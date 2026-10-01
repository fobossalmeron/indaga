import { createServerSupabaseClient } from './supabase'
import { CURRENT_HUNT_YEAR, getHuntAvailability, isPublicTreasureCode, parseHuntYear, toPublicTreasureCode, toStoredTreasureCode } from './treasure-hunt-config'

export interface TreasureHunt {
  id: string
  name: string
  year: number
  description: string | null
  start_date: string | null
  end_date: string | null
  is_active: boolean | null
  total_treasures: number | null
  created_at: string | null
}

export interface Treasure {
  id: string
  hunt_id: string
  treasure_code: string
  treasure_name: string
  treasure_secret: string
  treasure_category: string | null
  treasure_website: string | null
  treasure_location_maps_url: string | null
  location_coordinates: any | null
  created_at: string | null
}

export interface TreasureScan {
  id: string
  user_id: string
  hunt_id: string
  treasure_id: string
  scanned_at: string | null
}

export interface TreasureProgress {
  id: string
  user_id: string
  hunt_id: string
  treasures_found: number | null
  completion_percentage: number | null
  started_at: string | null
  completed_at: string | null
}

export interface TreasureScanResult {
  success: boolean
  treasure?: Treasure
  alreadyScanned?: boolean
  message?: string
  progress?: TreasureProgress
}

// The physical table names are retained for compatibility; hunt_id separates editions.
export async function getTreasureHunt(year = CURRENT_HUNT_YEAR): Promise<TreasureHunt | null> {
  if (!parseHuntYear(year)) return null
  const { data, error } = await createServerSupabaseClient()
    .from('treasure_hunts').select('*').eq('year', year).maybeSingle()
  if (error) throw error
  return data
}

export async function getActiveTreasureHunt(year = CURRENT_HUNT_YEAR): Promise<TreasureHunt | null> {
  const hunt = await getTreasureHunt(year)
  return hunt?.is_active ? hunt : null
}

function publicTreasure<T extends { treasure_code: string }>(treasure: T, year: number): T {
  return { ...treasure, treasure_code: toPublicTreasureCode(year, treasure.treasure_code) }
}

export async function getTreasureByCode(code: string, year = CURRENT_HUNT_YEAR): Promise<Treasure | null> {
  if (!isPublicTreasureCode(code) || !parseHuntYear(year)) return null
  const hunt = await getTreasureHunt(year)
  if (!hunt) return null
  const { data, error } = await createServerSupabaseClient()
    .from('treasure_hunt_2025_treasures').select('*')
    .eq('hunt_id', hunt.id).eq('treasure_code', toStoredTreasureCode(year, code)).maybeSingle()
  if (error) throw error
  return data ? publicTreasure(data, year) : null
}

export async function getHuntTreasures(huntId: string, year: number): Promise<Treasure[]> {
  const { data, error } = await createServerSupabaseClient()
    .from('treasure_hunt_2025_treasures').select('*')
    .eq('hunt_id', huntId).order('treasure_name')
  if (error) throw error
  return data.map(treasure => publicTreasure(treasure, year))
}

export async function getUserProgress(userId: string, huntId: string): Promise<TreasureProgress | null> {
  const { data, error } = await createServerSupabaseClient()
    .from('treasure_hunt_2025_progress').select('*')
    .eq('user_id', userId).eq('hunt_id', huntId).maybeSingle()
  if (error) throw error
  return data
}

export async function getUserScannedTreasures(userId: string, huntId: string, year = CURRENT_HUNT_YEAR): Promise<Treasure[]> {
  const { data, error } = await createServerSupabaseClient()
    .from('treasure_hunt_2025_scans')
    .select('treasure_hunt_2025_treasures(*)')
    .eq('user_id', userId).eq('hunt_id', huntId)
    .order('scanned_at', { ascending: false })
  if (error) throw error
  return data.flatMap(item => {
    const treasure = item.treasure_hunt_2025_treasures
    return treasure && treasure.hunt_id === huntId ? [publicTreasure(treasure, year)] : []
  })
}

export async function getAvailableTreasureHunts(userId: string): Promise<TreasureHunt[]> {
  const client = createServerSupabaseClient()
  const [hunts, progress, scans] = await Promise.all([
    client.from('treasure_hunts').select('*').in('year', [2025, 2026]).order('year', { ascending: false }),
    client.from('treasure_hunt_2025_progress').select('hunt_id').eq('user_id', userId),
    client.from('treasure_hunt_2025_scans').select('hunt_id').eq('user_id', userId),
  ])
  if (hunts.error || progress.error || scans.error) throw hunts.error || progress.error || scans.error
  const participated = new Set([...progress.data, ...scans.data].map(row => row.hunt_id))
  return hunts.data.filter(hunt => hunt.year === CURRENT_HUNT_YEAR || participated.has(hunt.id))
}

export async function processTreasureScan(qrCode: string, userId: string, year = CURRENT_HUNT_YEAR): Promise<TreasureScanResult> {
  try {
    if (!parseHuntYear(year) || !isPublicTreasureCode(qrCode)) {
      return { success: false, message: 'Este código QR o edición no es válido.' }
    }
    const hunt = await getTreasureHunt(year)
    if (!hunt) return { success: false, message: 'No se encontró esta búsqueda del tesoro.' }
    const availability = getHuntAvailability(hunt)
    const messages = {
      upcoming: 'La búsqueda del tesoro aún no ha comenzado.',
      ended: 'La búsqueda del tesoro ha terminado. Puedes consultar tu historial.',
      inactive: 'Esta búsqueda del tesoro aún no está activa.',
    }
    if (availability !== 'open') return { success: false, message: messages[availability] }

    const treasure = await getTreasureByCode(qrCode, year)
    if (!treasure || treasure.hunt_id !== hunt.id) {
      return { success: false, message: 'Código de tesoro no encontrado en esta edición.' }
    }

    // The unique constraint handles repeat and concurrent scans. The database trigger
    // is the sole writer of progress, so a visit cannot increment the counter twice.
    const { error } = await createServerSupabaseClient()
      .from('treasure_hunt_2025_scans')
      .insert({ user_id: userId, hunt_id: hunt.id, treasure_id: treasure.id })
    if (error && error.code !== '23505') throw error
    const alreadyScanned = error?.code === '23505'
    const progress = await getUserProgress(userId, hunt.id)
    return {
      success: true,
      treasure,
      alreadyScanned,
      progress: progress || undefined,
      message: alreadyScanned
        ? 'Ya habías encontrado este tesoro anteriormente.'
        : `¡Tesoro encontrado! Llevas ${progress?.treasures_found ?? 1} de ${hunt.total_treasures} tesoros.`,
    }
  } catch (error) {
    console.error('Error processing treasure scan:', error)
    return { success: false, message: 'Error interno al procesar el código QR.' }
  }
}
