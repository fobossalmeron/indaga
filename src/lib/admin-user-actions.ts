'use server'

import { requireAdminClient, exactCount, participantIds } from './admin-access'
import type { User, UserWithProgress } from '../../types/database'

export async function getAllUsers(options: {
  page?: number; limit?: number; search?: string; verified?: boolean
  sortBy?: 'created_at' | 'email' | 'full_name'; sortOrder?: 'asc' | 'desc'
} = {}) {
  const client = await requireAdminClient()
  const { page = 1, limit = 10, search, verified, sortBy = 'created_at', sortOrder = 'desc' } = options
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 100 ||
      !['created_at', 'email', 'full_name'].includes(sortBy) || !['asc', 'desc'].includes(sortOrder)) throw new Error('Paginación inválida')
  let query = client.from('users').select('*, treasure_hunt_2025_progress(*), saved_events(id), saved_places(id)', { count: 'exact' })
  if (search?.trim()) {
    const safeSearch = search.trim().replace(/[(),"\\%_]/g, ' ').slice(0, 200)
    query = query.or(`full_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%`)
  }
  if (typeof verified === 'boolean') query = query.eq('email_verified', verified)
  const from = (page - 1) * limit
  const { data, error, count } = await query.order(sortBy, { ascending: sortOrder === 'asc' }).order('id').range(from, from + limit - 1)
  if (error) throw new Error(error.message)
  if (count === null) throw new Error('No se pudo obtener el total de usuarios')
  return { users: data as UserWithProgress[], total: count, page, limit, totalPages: Math.ceil(count / limit) }
}

export async function getUserSummary() {
  const client = await requireAdminClient()
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  const end = new Date(start.getTime() + 86400000)
  const query = () => client.from('users').select('id', { count: 'exact', head: true })
  const [totalUsers, verifiedUsers, registeredToday, participants] = await Promise.all([
    exactCount(query()), exactCount(query().eq('email_verified', true)),
    exactCount(query().gte('created_at', start.toISOString()).lt('created_at', end.toISOString())),
    participantIds(client),
  ])
  return { totalUsers, verifiedUsers, registeredToday, activeTreasureUsers: participants.length }
}

export async function getUserById(userId: string) {
  const client = await requireAdminClient()
  const { data, error } = await client.from('users')
    .select('*, saved_events(*), saved_places(*), treasure_hunt_2025_progress(*), treasure_hunt_2025_scans(*, treasure_hunt_2025_treasures(*))')
    .eq('id', userId).single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const client = await requireAdminClient()
  // Keep identity and administrator permissions outside this profile form.
  const { data, error } = await client.from('users').update({
    full_name: updates.full_name,
    email_verified: updates.email_verified,
    avatar_url: updates.avatar_url,
  }).eq('id', userId).select().single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteUser(userId: string) {
  const client = await requireAdminClient()
  const { error } = await client.from('users').update({ email_verified: false }).eq('id', userId)
  if (error) throw new Error(error.message)
  return true
}
