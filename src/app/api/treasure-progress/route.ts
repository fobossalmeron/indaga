import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth-utils'
import { getUserProgress, getActiveTreasureHunt, getUserScannedTreasures } from '@/lib/treasure-hunt-2025'

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

    // Obtener tesoros escaneados reales para contar correctamente
    const scannedTreasures = await getUserScannedTreasures(userId, hunt.id)
    const actualTreasuresFound = scannedTreasures.length

    // Calcular porcentaje de completado basado en tesoros reales
    const totalTreasures = hunt.total_treasures || 25
    const actualCompletionPercentage = (actualTreasuresFound / totalTreasures) * 100

    return NextResponse.json({
      treasuresFound: actualTreasuresFound,
      completionPercentage: actualCompletionPercentage,
      totalTreasures: totalTreasures
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