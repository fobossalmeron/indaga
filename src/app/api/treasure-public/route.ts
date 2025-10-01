import { NextResponse } from 'next/server'
import { getActiveTreasureHunt } from '@/lib/treasure-hunt-2025'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    // Obtener treasure hunt activo
    const hunt = await getActiveTreasureHunt()
    if (!hunt) {
      return NextResponse.json({
        error: 'No hay una búsqueda del tesoro activa'
      }, { status: 404 })
    }

    // Obtener todos los tesoros (datos públicos solamente)
    const serverClient = createServerSupabaseClient()
    const { data: allTreasures, error } = await serverClient
      .from('treasure_hunt_2025_treasures')
      .select('id, treasure_code, treasure_name, treasure_location_maps_url')
      .eq('hunt_id', hunt.id)
      .order('treasure_code', { ascending: true })

    if (error) {
      console.error('Error fetching public treasures:', error)
      return NextResponse.json({
        error: 'Error al obtener los tesoros'
      }, { status: 500 })
    }

    return NextResponse.json({
      treasures: allTreasures,
      totalTreasures: allTreasures.length
    })

  } catch (error) {
    console.error('Error fetching public treasure data:', error)
    return NextResponse.json({
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}
