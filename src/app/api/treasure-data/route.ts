import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth-utils'
import { getActiveTreasureHunt, getUserScannedTreasures } from '@/lib/treasure-hunt-2025'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Verificar auth
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener treasure hunt activo
    const hunt = await getActiveTreasureHunt()
    if (!hunt) {
      return NextResponse.json({
        error: 'No hay una búsqueda del tesoro activa'
      }, { status: 404 })
    }

    // Obtener tesoros escaneados por el usuario
    const scannedTreasures = await getUserScannedTreasures(userId, hunt.id)
    console.log('API: Scanned treasures count:', scannedTreasures.length)

    // Obtener todos los tesoros
    const serverClient = createServerSupabaseClient()
    const { data: allTreasures, error } = await serverClient
      .from('treasure_hunt_2025_treasures')
      .select('*')
      .eq('hunt_id', hunt.id)
      .order('treasure_code', { ascending: true })

    if (error) {
      console.error('Error fetching all treasures:', error)
      return NextResponse.json({
        error: 'Error al obtener los tesoros'
      }, { status: 500 })
    }

    console.log('API: All treasures count:', allTreasures.length)

    return NextResponse.json({
      hunt,
      scannedTreasures,
      allTreasures,
      totalScanned: scannedTreasures.length,
      totalTreasures: allTreasures.length
    })

  } catch (error) {
    console.error('Error fetching treasure data:', error)
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}