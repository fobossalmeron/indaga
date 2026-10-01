import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth-utils'
import { processTreasureScan } from '@/lib/treasure-hunt-2025'
import { isPublicTreasureCode, parseHuntYear } from '@/lib/treasure-hunt-config'

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    const body = await request.json()
    // Old 2025 clients omitted the edition: never silently credit their QR to 2026.
    const year = parseHuntYear(body?.year, null)
    const code = body?.code
    if (!year || !isPublicTreasureCode(code)) {
      return NextResponse.json({ success: false, message: 'Código o edición inválidos' }, { status: 400 })
    }
    const result = await processTreasureScan(code, userId, year)
    const query = new URLSearchParams({ year: String(year), scanned: code })
    if (!result.success) {
      query.set('error', 'technical')
      if (result.message) query.set('message', result.message)
    }
    return NextResponse.json({ ...result, redirect: `/treasures?${query}` })
  } catch (error) {
    console.error('Error processing treasure scan:', error)
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 })
  }
}
