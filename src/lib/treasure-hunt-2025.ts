import { supabase } from './supabase'

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
  treasure_description: string | null
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

export async function getActiveTreasureHunt(): Promise<TreasureHunt | null> {
  const { data, error } = await supabase
    .from('treasure_hunts')
    .select('*')
    .eq('is_active', true)
    .eq('year', 2025)
    .single()

  if (error) {
    console.error('Error fetching active treasure hunt:', error)
    return null
  }

  return data
}

export async function getTreasureByCode(code: string): Promise<Treasure | null> {
  const { data, error } = await supabase
    .from('treasure_hunt_2025_treasures')
    .select('*')
    .eq('treasure_code', code)
    .single()

  if (error) {
    console.error('Error fetching treasure by code:', error)
    return null
  }

  return data
}

export async function getUserProgress(userId: string, huntId: string): Promise<TreasureProgress | null> {
  const { data, error } = await supabase
    .from('treasure_hunt_2025_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('hunt_id', huntId)
    .single()

  if (error && error.code !== 'PGRST116') { // Not found error is ok
    console.error('Error fetching user progress:', error)
    return null
  }

  return data
}

export async function createUserProgress(userId: string, huntId: string): Promise<TreasureProgress | null> {
  const { data, error } = await supabase
    .from('treasure_hunt_2025_progress')
    .insert({
      user_id: userId,
      hunt_id: huntId,
      treasures_found: 0,
      completion_percentage: 0,
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating user progress:', error)
    return null
  }

  return data
}

export async function updateUserProgress(
  userId: string, 
  huntId: string, 
  treasuresFound: number, 
  totalTreasures: number
): Promise<TreasureProgress | null> {
  const completionPercentage = (treasuresFound / totalTreasures) * 100
  const isCompleted = completionPercentage >= 100

  const updateData: any = {
    treasures_found: treasuresFound,
    completion_percentage: completionPercentage,
  }

  if (isCompleted) {
    updateData.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('treasure_hunt_2025_progress')
    .update(updateData)
    .eq('user_id', userId)
    .eq('hunt_id', huntId)
    .select()
    .single()

  if (error) {
    console.error('Error updating user progress:', error)
    return null
  }

  return data
}

export async function checkIfTreasureScanned(
  userId: string, 
  treasureId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('treasure_hunt_2025_scans')
    .select('id')
    .eq('user_id', userId)
    .eq('treasure_id', treasureId)
    .single()

  if (error && error.code !== 'PGRST116') { // Not found error is ok
    console.error('Error checking if treasure scanned:', error)
    return false
  }

  return !!data
}

export async function recordTreasureScan(
  userId: string,
  huntId: string,
  treasureId: string
): Promise<TreasureScan | null> {
  const { data, error } = await supabase
    .from('treasure_hunt_2025_scans')
    .insert({
      user_id: userId,
      hunt_id: huntId,
      treasure_id: treasureId,
      scanned_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error recording treasure scan:', error)
    return null
  }

  return data
}

export async function getUserScannedTreasures(userId: string, huntId: string): Promise<Treasure[]> {
  const { data, error } = await supabase
    .from('treasure_hunt_2025_scans')
    .select(`
      treasure_hunt_2025_treasures (
        id,
        hunt_id,
        treasure_code,
        treasure_name,
        treasure_description,
        location_coordinates,
        created_at
      )
    `)
    .eq('user_id', userId)
    .eq('hunt_id', huntId)
    .order('scanned_at', { ascending: false })

  if (error) {
    console.error('Error fetching user scanned treasures:', error)
    return []
  }

  return data.map(item => item.treasure_hunt_2025_treasures).filter(Boolean) as Treasure[]
}

export async function processTreasureScan(qrCode: string, userId: string): Promise<TreasureScanResult> {
  try {
    // Validate QR code format (should be descriptive format like "CAFE-LIMON")
    if (!/^[A-Z-]+$/.test(qrCode)) {
      return {
        success: false,
        message: 'Este código QR no es válido para la búsqueda del tesoro 2025.'
      }
    }

    // Get active treasure hunt
    const hunt = await getActiveTreasureHunt()
    if (!hunt) {
      return {
        success: false,
        message: 'No hay una búsqueda del tesoro activa en este momento.'
      }
    }

    // Check if hunt is within date range
    const now = new Date()
    if (hunt.start_date && new Date(hunt.start_date) > now) {
      return {
        success: false,
        message: 'La búsqueda del tesoro aún no ha comenzado.'
      }
    }
    if (hunt.end_date && new Date(hunt.end_date) < now) {
      return {
        success: false,
        message: 'La búsqueda del tesoro ha terminado.'
      }
    }

    // Find treasure by code
    const treasure = await getTreasureByCode(qrCode)
    if (!treasure) {
      return {
        success: false,
        message: 'Código de tesoro no encontrado.'
      }
    }

    // Check if user already scanned this treasure
    const alreadyScanned = await checkIfTreasureScanned(userId, treasure.id)
    if (alreadyScanned) {
      return {
        success: true,
        treasure,
        alreadyScanned: true,
        message: 'Ya habías encontrado este tesoro anteriormente.'
      }
    }

    // Get or create user progress
    let progress = await getUserProgress(userId, hunt.id)
    if (!progress) {
      progress = await createUserProgress(userId, hunt.id)
      if (!progress) {
        return {
          success: false,
          message: 'Error al inicializar el progreso del usuario.'
        }
      }
    }

    // Record the scan
    const scan = await recordTreasureScan(userId, hunt.id, treasure.id)
    if (!scan) {
      return {
        success: false,
        message: 'Error al registrar el escaneo del tesoro.'
      }
    }

    // Update user progress
    const newTreasuresFound = (progress.treasures_found || 0) + 1
    const updatedProgress = await updateUserProgress(
      userId, 
      hunt.id, 
      newTreasuresFound, 
      hunt.total_treasures || 25
    )

    return {
      success: true,
      treasure,
      alreadyScanned: false,
      progress: updatedProgress || progress,
      message: `¡Tesoro encontrado! Llevas ${newTreasuresFound} de ${hunt.total_treasures} tesoros.`
    }

  } catch (error) {
    console.error('Error processing treasure scan:', error)
    return {
      success: false,
      message: 'Error interno al procesar el código QR.'
    }
  }
}