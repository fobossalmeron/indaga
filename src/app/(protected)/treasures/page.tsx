'use client'

import { useState, useEffect } from 'react'
import TreasureMap from '@/app/components/features/treasure-map'
import ProgressTracker from '@/app/components/features/progress-tracker'
import { Button } from '@/app/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import type { TreasureHunt, TreasureProgress, Treasure } from '@/lib/treasure-hunt-2025'

interface TreasurePageData {
  hunt: TreasureHunt | null
  progress: TreasureProgress | null
  scannedTreasures: Treasure[]
}

export default function TreasuresPage() {
  const [data, setData] = useState<TreasurePageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'progress' | 'map'>('progress')
  const { data: session, isPending } = useAuth()

  useEffect(() => {
    if (!isPending && session?.user) {
      loadTreasureData()
    } else if (!isPending && !session?.user) {
      setLoading(false)
    }
  }, [session, isPending])

  const loadTreasureData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/treasure-data')
      if (response.ok) {
        const treasureData = await response.json()
        setData(treasureData)
      } else {
        setData({
          hunt: null,
          progress: null,
          scannedTreasures: []
        })
      }
    } catch (error) {
      console.error('Error loading treasure data:', error)
      setData({
        hunt: null,
        progress: null,
        scannedTreasures: []
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Cargando datos del treasure hunt...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data?.hunt) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay treasure hunt activo
            </h3>
            <p className="text-gray-600 mb-6">
              En este momento no hay ninguna búsqueda del tesoro disponible.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {data.hunt.name}
          </h1>
          <p className="text-gray-600">
            {data.hunt.description}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveView('progress')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeView === 'progress'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mi Progreso
              </button>
              <button
                onClick={() => setActiveView('map')}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeView === 'map'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mapa de Tesoros
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeView === 'progress' && (
          <div className="space-y-6">
            <ProgressTracker 
              hunt={data.hunt}
              progress={data.progress}
              scannedTreasures={data.scannedTreasures}
              onRefresh={loadTreasureData}
            />
          </div>
        )}

        {activeView === 'map' && (
          <div className="space-y-6">
            <TreasureMap 
              hunt={data.hunt}
              scannedTreasures={data.scannedTreasures}
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => window.location.href = '/treasure-hunt'}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Ir al Treasure Hunt
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard'}
              variant="outline"
              className="w-full"
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}