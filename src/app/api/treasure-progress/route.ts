import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth-utils'
import { getTreasureHunt, getUserScannedTreasures } from '@/lib/treasure-hunt-2025'
import { parseHuntYear } from '@/lib/treasure-hunt-config'

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const year = parseHuntYear(request.nextUrl.searchParams.get('year'))
    if (!year) return NextResponse.json({ error: 'Edición inválida' }, { status: 400 })
    const hunt = await getTreasureHunt(year)
    if (!hunt) return NextResponse.json({ error: 'No se encontró esta edición' }, { status: 404 })
    const scannedTreasures = await getUserScannedTreasures(userId, hunt.id, year)
    const totalTreasures = hunt.total_treasures ?? 0
    return NextResponse.json({
      year, treasuresFound: scannedTreasures.length,
      completionPercentage: totalTreasures ? scannedTreasures.length / totalTreasures * 100 : 0,
      totalTreasures,
    })
  } catch (error) {
    console.error('Error fetching treasure progress:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
