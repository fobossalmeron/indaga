'use server'

import { requireAdminClient, exactCount, readAllRows, validateHunt, participantIds, idBatches } from './admin-access'
import { getHuntAvailability } from './treasure-hunt-config'

export async function getDashboardStats(huntId?: string) {
  const client = await requireAdminClient()
  await validateHunt(client, huntId)
  const ids = huntId ? await participantIds(client, huntId) : undefined
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString()
  const batches = await Promise.all(idBatches(ids).map(async batch => {
    const users = () => {
      let query = client.from('users').select('id', { count: 'exact', head: true })
      return batch ? query.in('id', batch) : query
    }
    let events = client.from('saved_events').select('id', { count: 'exact', head: true })
    let places = client.from('saved_places').select('id', { count: 'exact', head: true })
    if (batch) { events = events.in('user_id', batch); places = places.in('user_id', batch) }
    return Promise.all([
      exactCount(users()), exactCount(users().eq('email_verified', true)),
      exactCount(users().gte('created_at', sevenDaysAgo)), exactCount(events), exactCount(places),
    ])
  }))
  const [totalUsers, verifiedUsers, recentUsers, totalSavedEvents, totalSavedPlaces] =
    batches.reduce<number[]>((totals, batch) => totals.map((total, i) => total + batch[i]), [0, 0, 0, 0, 0])
  let scans = client.from('treasure_hunt_2025_scans').select('id', { count: 'exact', head: true })
  let hunts = client.from('treasure_hunts').select('id,start_date,end_date,is_active')
  if (huntId) { scans = scans.eq('hunt_id', huntId); hunts = hunts.eq('id', huntId) }
  const [totalScans, allHunts] = await Promise.all([exactCount(scans), hunts])
  if (allHunts.error) throw new Error(allHunts.error.message)
  return {
    totalUsers, verifiedUsers, totalScans, totalSavedEvents, totalSavedPlaces, recentUsers,
    activeTreasureHunts: allHunts.data.filter(hunt => getHuntAvailability(hunt, now) === 'open').length,
    verificationRate: totalUsers ? Math.round(verifiedUsers / totalUsers * 100) : 0,
  }
}

export async function getTreasureHuntStats(huntId?: string) {
  const client = await requireAdminClient()
  await validateHunt(client, huntId)
  return readAllRows((from, to) => {
    let query = client.from('treasure_hunt_2025_progress')
      .select('*, users(full_name, email), treasure_hunts(name, year)')
      .order('completion_percentage', { ascending: false }).order('id').range(from, to)
    if (huntId) query = query.eq('hunt_id', huntId)
    return query
  })
}

function calendar(days: number) {
  if (!Number.isInteger(days) || days < 1 || days > 366) throw new Error('Periodo inválido')
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  end.setUTCDate(end.getUTCDate() + 1)
  const start = new Date(end.getTime() - days * 86400000)
  const counts = new Map<string, number>(Array.from({ length: days }, (_, i) => [
    new Date(start.getTime() + i * 86400000).toISOString().slice(0, 10), 0,
  ]))
  return { start: start.toISOString(), end: end.toISOString(), counts }
}

export async function getUserActivityStats(days = 30, huntId?: string) {
  const client = await requireAdminClient()
  await validateHunt(client, huntId)
  const { start, end, counts } = calendar(days)
  const ids = huntId ? await participantIds(client, huntId) : undefined
  const batches = await Promise.all(idBatches(ids).map(batch => readAllRows<{ created_at: string | null }>((from, to) => {
    let query = client.from('users').select('created_at').gte('created_at', start).lt('created_at', end)
      .order('created_at').order('id').range(from, to)
    if (batch) query = query.in('id', batch)
    return query
  })))
  for (const user of batches.flat()) {
    if (user.created_at) {
      const day = new Date(user.created_at).toISOString().slice(0, 10)
      if (counts.has(day)) counts.set(day, counts.get(day)! + 1)
    }
  }
  return [...counts].map(([date, users]) => ({ date, users }))
}

export async function getTreasureScanStats(days = 30, huntId?: string) {
  const client = await requireAdminClient()
  await validateHunt(client, huntId)
  const { start, end, counts } = calendar(days)
  const rows = await readAllRows<{ scanned_at: string | null }>((from, to) => {
    let query = client.from('treasure_hunt_2025_scans').select('scanned_at')
      .gte('scanned_at', start).lt('scanned_at', end).order('scanned_at').order('id').range(from, to)
    if (huntId) query = query.eq('hunt_id', huntId)
    return query
  })
  for (const scan of rows) {
    if (scan.scanned_at) {
      const day = new Date(scan.scanned_at).toISOString().slice(0, 10)
      if (counts.has(day)) counts.set(day, counts.get(day)! + 1)
    }
  }
  return [...counts].map(([date, scans]) => ({ date, scans }))
}
