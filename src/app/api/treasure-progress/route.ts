import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth-utils'
import { getUserProgress, getActiveTreasureHunt } from '@/lib/treasure-hunt-2025'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Obtener hunt activo
    const hunt = await getActiveTreasureHunt()
    if (!hunt) {
      return NextResponse.json({
        treasuresFound: 0,
        completionPercentage: 0,
        totalTreasures: 25
      })
    }

    // Obtener progreso del usuario
    const progress = await getUserProgress(userId, hunt.id)
    
    return NextResponse.json({
      treasuresFound: progress?.treasures_found || 0,
      completionPercentage: progress?.completion_percentage || 0,
      totalTreasures: hunt.total_treasures || 25
    })
  } catch (error) {
    console.error('Error fetching treasure progress:', error)
    return NextResponse.json({
      treasuresFound: 0,
      completionPercentage: 0,
      totalTreasures: 25
    })
  }
}