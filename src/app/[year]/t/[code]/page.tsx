import { redirect } from 'next/navigation'
import { getCurrentUserId } from '@/lib/auth-utils'
import { processTreasureScan } from '@/lib/treasure-hunt-2025'

interface TreasureLandingProps {
  params: Promise<{
    year: string
    code: string
  }>
}

export default async function TreasureLanding({ params: paramsPromise }: TreasureLandingProps) {
  const params = await paramsPromise
  // Validar que el año sea 2025 (por ahora)
  if (params.year !== '2025') {
    redirect('/dashboard')
  }

  // 1. Verificar auth
  const userId = await getCurrentUserId()
  
  // 2. Si NO está logueado: redirect con parámetro ?scanned
  if (!userId) {
    redirect(`/login?scanned=${params.code}`)
  }
  
  try {
    // 3. Si SÍ está logueado: procesar hallazgo
    const result = await processTreasureScan(params.code, userId)
    
    // 4. Redirect a dashboard con confirmación
    if (result.success) {
      if (result.alreadyScanned) {
        redirect('/dashboard?treasure=already-found')
      } else {
        redirect('/dashboard?treasure=found')
      }
    } else {
      // Si hay error, redirect con mensaje de error
      redirect(`/dashboard?treasure=error&message=${encodeURIComponent(result.message || 'Error desconocido')}`)
    }
  } catch (error) {
    console.error('Error processing treasure scan:', error)
    redirect('/dashboard?treasure=error&message=Error interno')
  }
}