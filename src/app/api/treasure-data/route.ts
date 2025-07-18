import { NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth-utils'
import { 
  getActiveTreasureHunt, 
  getUserProgress, 
  getUserScannedTreasures 
} from '@/lib/treasure-hunt-2025'

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const hunt = await getActiveTreasureHunt()
    
    if (hunt) {
      const [progress, scannedTreasures] = await Promise.all([
        getUserProgress(userId, hunt.id),
        getUserScannedTreasures(userId, hunt.id)
      ])

      return NextResponse.json({
        hunt,
        progress,
        scannedTreasures
      })
    } else {
      return NextResponse.json({
        hunt: null,
        progress: null,
        scannedTreasures: []
      })
    }
  } catch (error) {
    console.error('Error loading treasure data:', error)
    return NextResponse.json({
      hunt: null,
      progress: null,
      scannedTreasures: []
    }, { status: 500 })
  }
}