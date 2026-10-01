import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth-utils'
import { getAvailableTreasureHunts, getHuntTreasures, getTreasureHunt, getUserProgress, getUserScannedTreasures } from '@/lib/treasure-hunt-2025'
import { parseHuntYear } from '@/lib/treasure-hunt-config'

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const year = parseHuntYear(request.nextUrl.searchParams.get('year'))
    if (!year) return NextResponse.json({ error: 'Edición inválida' }, { status: 400 })
    const hunt = await getTreasureHunt(year)
    if (!hunt) return NextResponse.json({ error: 'No se encontró esta edición' }, { status: 404 })
    const [scannedTreasures, allTreasures, progress, availableHunts] = await Promise.all([
      getUserScannedTreasures(userId, hunt.id, year),
      getHuntTreasures(hunt.id, year),
      getUserProgress(userId, hunt.id),
      getAvailableTreasureHunts(userId),
    ])
    const foundIds = new Set(scannedTreasures.map(treasure => treasure.id))
    const visibleTreasures = allTreasures.map(treasure => ({ ...treasure,
      treasure_secret: year === 2025 && foundIds.has(treasure.id) ? treasure.treasure_secret : '',
    }))
    const visibleScanned = scannedTreasures.map(treasure => ({ ...treasure,
      treasure_secret: year === 2025 ? treasure.treasure_secret : '',
    }))
    return NextResponse.json({ hunt, progress, scannedTreasures: visibleScanned, allTreasures: visibleTreasures, availableHunts,
      totalScanned: scannedTreasures.length, totalTreasures: allTreasures.length })
  } catch (error) {
    console.error('Error fetching treasure data:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
