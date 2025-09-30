import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth-utils'
import { processTreasureScan } from '@/lib/treasure-hunt-2025'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    // Verificar auth
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }
    
    // Procesar hallazgo
    const result = await processTreasureScan(code, userId)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        redirect: `/treasures?scanned=${code}`,
        message: result.message
      })
    } else {
      return NextResponse.json({
        success: false,
        redirect: `/treasures?scanned=${code}&error=technical`,
        message: result.message
      })
    }
  } catch (error) {
    console.error('Error processing treasure scan:', error)
    return NextResponse.json({ 
      success: false, 
      redirect: '/treasures?scanned=unknown&error=technical',
      message: 'Error interno' 
    }, { status: 500 })
  }
}