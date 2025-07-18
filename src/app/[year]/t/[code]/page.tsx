"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface TreasureLandingProps {
  params: Promise<{
    year: string
    code: string
  }>
}

export default function TreasureLanding({ params: paramsPromise }: TreasureLandingProps) {
  const router = useRouter()
  const { data: session, isPending } = useAuth()
  
  useEffect(() => {
    async function handleTreasureScan() {
      const params = await paramsPromise
      
      // Validar que el año sea 2025 (por ahora)
      if (params.year !== '2025') {
        router.push('/dashboard')
        return
      }

      // Si NO está logueado: redirect con parámetro ?scanned
      if (!isPending && !session?.user) {
        router.push(`/login?scanned=${params.code}`)
        return
      }

      // Si está autenticado, procesar el scan
      if (!isPending && session?.user) {
        try {
          const response = await fetch('/api/treasure-scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: params.code })
          })
          
          const result = await response.json()
          
          if (result.redirect) {
            router.push(result.redirect)
          } else {
            router.push('/dashboard?treasure=error&message=Error%20inesperado')
          }
        } catch (error) {
          console.error('Error processing treasure scan:', error)
          router.push('/dashboard?treasure=error&message=Error%20interno')
        }
      }
    }
    
    handleTreasureScan()
  }, [paramsPromise, session, isPending, router])

  // Mostrar loading mientras procesa
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
        <p className="text-gray-600">Procesando código QR...</p>
      </div>
    </div>
  )
}