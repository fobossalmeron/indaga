'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import type { TreasureHunt, Treasure } from '@/lib/treasure-hunt-2025'
import { supabase } from '@/lib/supabase'

interface TreasureMapProps {
  hunt: TreasureHunt
  scannedTreasures: Treasure[]
}

interface AllTreasure extends Treasure {
  isScanned: boolean
}

export default function TreasureMap({ hunt, scannedTreasures }: TreasureMapProps) {
  const [allTreasures, setAllTreasures] = useState<AllTreasure[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTreasure, setSelectedTreasure] = useState<AllTreasure | null>(null)

  useEffect(() => {
    loadAllTreasures()
  }, [hunt.id, scannedTreasures])

  const loadAllTreasures = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('treasure_hunt_2025_treasures')
        .select('*')
        .eq('hunt_id', hunt.id)
        .order('treasure_code', { ascending: true })

      if (error) {
        console.error('Error loading treasures:', error)
        return
      }

      // Mark which treasures have been scanned
      const scannedIds = new Set(scannedTreasures.map(t => t.id))
      const treasuresWithStatus = data.map(treasure => ({
        ...treasure,
        isScanned: scannedIds.has(treasure.id)
      }))

      setAllTreasures(treasuresWithStatus)
    } catch (error) {
      console.error('Error in loadAllTreasures:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTreasureStatusColor = (treasure: AllTreasure) => {
    if (treasure.isScanned) {
      return 'bg-green-500 border-green-600 text-white'
    }
    return 'bg-gray-200 border-gray-300 text-gray-600'
  }

  const getTreasureIcon = (treasure: AllTreasure) => {
    if (treasure.isScanned) {
      return '✓'
    }
    return '?'
  }

  const groupTreasuresByLocation = () => {
    // Group treasures by location or create a simple grid layout
    const groups: { [key: string]: AllTreasure[] } = {}
    
    allTreasures.forEach(treasure => {
      // Extract location from treasure name or use first word
      const location = treasure.treasure_name.split(' ')[0] || 'Otros'
      if (!groups[location]) {
        groups[location] = []
      }
      groups[location].push(treasure)
    })

    return groups
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Cargando mapa de tesoros...</p>
      </div>
    )
  }

  const treasureGroups = groupTreasuresByLocation()

  return (
    <div className="space-y-6">
      {/* Map Legend */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Leyenda del Mapa</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-500 border-2 border-green-600 rounded-full flex items-center justify-center text-white font-bold mr-2">
              ✓
            </div>
            <span className="text-sm text-gray-600">Tesoro encontrado</span>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 border-2 border-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold mr-2">
              ?
            </div>
            <span className="text-sm text-gray-600">Tesoro por descubrir</span>
          </div>
        </div>
      </div>

      {/* Treasure Grid */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Todos los Tesoros ({allTreasures.length})
          </h3>
          <div className="text-sm text-gray-600">
            {scannedTreasures.length} de {allTreasures.length} encontrados
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allTreasures.map((treasure) => (
            <button
              key={treasure.id}
              onClick={() => setSelectedTreasure(treasure)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${getTreasureStatusColor(treasure)}`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {getTreasureIcon(treasure)}
                </div>
                <div className="text-xs font-medium">
                  {treasure.treasure_code.split('-').pop()}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Treasure Groups */}
      <div className="space-y-4">
        {Object.entries(treasureGroups).map(([location, treasures]) => (
          <div key={location} className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              {location} ({treasures.filter(t => t.isScanned).length}/{treasures.length})
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {treasures.map((treasure) => (
                <div
                  key={treasure.id}
                  className={`p-4 rounded-lg border ${
                    treasure.isScanned 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {treasure.treasure_name}
                      </h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {treasure.treasure_description}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        Código: {treasure.treasure_code}
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      treasure.isScanned 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {getTreasureIcon(treasure)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <h4 className="text-lg font-bold text-blue-900 mb-2">
          ¡Sigue explorando!
        </h4>
        <p className="text-blue-800 mb-4">
          Te faltan {allTreasures.length - scannedTreasures.length} tesoros por descubrir.
          ¡Explora la ciudad y encuentra los códigos QR!
        </p>
        <Button 
          onClick={() => window.location.href = '/qr-scanner'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Escanear Código QR
        </Button>
      </div>

      {/* Treasure Detail Modal */}
      {selectedTreasure && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-3 ${
                selectedTreasure.isScanned 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {getTreasureIcon(selectedTreasure)}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {selectedTreasure.treasure_name}
              </h3>
              
              {selectedTreasure.isScanned ? (
                <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  ¡Encontrado!
                </span>
              ) : (
                <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                  Por descubrir
                </span>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <p className="text-gray-600">
                {selectedTreasure.treasure_description}
              </p>
              
              <div className="text-sm text-gray-500">
                <strong>Código:</strong> {selectedTreasure.treasure_code}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setSelectedTreasure(null)}
                variant="outline"
                className="flex-1"
              >
                Cerrar
              </Button>
              
              {!selectedTreasure.isScanned && (
                <Button
                  onClick={() => window.location.href = '/qr-scanner'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Ir a escanear
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}