import { NextRequest, NextResponse } from 'next/server'
import { getHuntTreasures, getTreasureHunt } from '@/lib/treasure-hunt-2025'
import { parseHuntYear } from '@/lib/treasure-hunt-config'

export async function GET(request: NextRequest) {
  try {
    const year = parseHuntYear(request.nextUrl.searchParams.get('year'))
    if (!year) return NextResponse.json({ error: 'Edición inválida' }, { status: 400 })
    const hunt = await getTreasureHunt(year)
    if (!hunt) return NextResponse.json({ error: 'No se encontró esta edición' }, { status: 404 })
    const allTreasures = await getHuntTreasures(hunt.id, year)
    const treasures = allTreasures.map(({ treasure_secret, ...treasure }) => treasure)
    return NextResponse.json({ hunt, treasures, totalTreasures: treasures.length })
  } catch (error) {
    console.error('Error fetching public treasure data:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
