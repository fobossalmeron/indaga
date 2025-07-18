'use client'

import { Button } from '@/app/components/ui/button'
import type { TreasureHunt, TreasureProgress, Treasure } from '@/lib/treasure-hunt-2025'

interface ProgressTrackerProps {
  hunt: TreasureHunt
  progress: TreasureProgress | null
  scannedTreasures: Treasure[]
  onRefresh?: () => void
}

export default function ProgressTracker({ 
  hunt, 
  progress, 
  scannedTreasures, 
  onRefresh 
}: ProgressTrackerProps) {
  const treasuresFound = progress?.treasures_found || 0
  const totalTreasures = hunt.total_treasures || 25
  const completionPercentage = progress?.completion_percentage || 0
  const isCompleted = completionPercentage >= 100

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getProgressMessage = () => {
    if (isCompleted) {
      return '¡Felicidades! Has completado la búsqueda del tesoro'
    }
    if (treasuresFound === 0) {
      return 'Comienza tu aventura escaneando tu primer tesoro'
    }
    if (treasuresFound < 5) {
      return '¡Buen comienzo! Sigue explorando la ciudad'
    }
    if (treasuresFound < 15) {
      return '¡Vas muy bien! Ya eres todo un explorador'
    }
    return '¡Excelente! Estás muy cerca de completar la búsqueda'
  }

  const getAchievementLevel = () => {
    if (treasuresFound === 0) return 'Explorador Novato'
    if (treasuresFound < 5) return 'Cazador de Tesoros'
    if (treasuresFound < 15) return 'Aventurero Experimentado'
    if (treasuresFound < 20) return 'Maestro Explorador'
    if (isCompleted) return 'Leyenda de INDAGA'
    return 'Gran Aventurero'
  }

  const getAchievementColor = () => {
    if (treasuresFound === 0) return 'text-gray-600'
    if (treasuresFound < 5) return 'text-bronze'
    if (treasuresFound < 15) return 'text-blue-600'
    if (treasuresFound < 20) return 'text-purple-600'
    return 'text-yellow-600'
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            isCompleted 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {getAchievementLevel()}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {treasuresFound} de {totalTreasures} Tesoros
          </h2>
          
          <p className="text-gray-600 mb-4">
            {getProgressMessage()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ease-out ${
                isCompleted ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{treasuresFound}</div>
            <div className="text-sm text-gray-600">Encontrados</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{totalTreasures - treasuresFound}</div>
            <div className="text-sm text-gray-600">Restantes</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{Math.round(completionPercentage)}%</div>
            <div className="text-sm text-gray-600">Completado</div>
          </div>
        </div>

        {/* Dates */}
        {progress?.started_at && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Comenzaste: {formatDate(progress.started_at)}</span>
              {progress.completed_at && (
                <span>Completado: {formatDate(progress.completed_at)}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Logros Desbloqueados</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Treasure Achievement */}
          <div className={`p-4 rounded-lg border-2 ${
            treasuresFound >= 1 
              ? 'border-green-200 bg-green-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center mb-2">
              <span className={`text-2xl mr-3 ${treasuresFound >= 1 ? '' : 'grayscale'}`}>
                🏆
              </span>
              <div>
                <h4 className="font-medium">Primer Tesoro</h4>
                <p className="text-sm text-gray-600">Encuentra tu primer tesoro</p>
              </div>
            </div>
            {treasuresFound >= 1 && (
              <div className="text-xs text-green-600 font-medium">¡Desbloqueado!</div>
            )}
          </div>

          {/* Explorer Achievement */}
          <div className={`p-4 rounded-lg border-2 ${
            treasuresFound >= 5 
              ? 'border-blue-200 bg-blue-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center mb-2">
              <span className={`text-2xl mr-3 ${treasuresFound >= 5 ? '' : 'grayscale'}`}>
                🧭
              </span>
              <div>
                <h4 className="font-medium">Explorador</h4>
                <p className="text-sm text-gray-600">Encuentra 5 tesoros</p>
              </div>
            </div>
            {treasuresFound >= 5 && (
              <div className="text-xs text-blue-600 font-medium">¡Desbloqueado!</div>
            )}
          </div>

          {/* Master Explorer Achievement */}
          <div className={`p-4 rounded-lg border-2 ${
            treasuresFound >= 15 
              ? 'border-purple-200 bg-purple-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center mb-2">
              <span className={`text-2xl mr-3 ${treasuresFound >= 15 ? '' : 'grayscale'}`}>
                🎖️
              </span>
              <div>
                <h4 className="font-medium">Maestro Explorador</h4>
                <p className="text-sm text-gray-600">Encuentra 15 tesoros</p>
              </div>
            </div>
            {treasuresFound >= 15 && (
              <div className="text-xs text-purple-600 font-medium">¡Desbloqueado!</div>
            )}
          </div>

          {/* Legend Achievement */}
          <div className={`p-4 rounded-lg border-2 ${
            isCompleted 
              ? 'border-yellow-200 bg-yellow-50' 
              : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center mb-2">
              <span className={`text-2xl mr-3 ${isCompleted ? '' : 'grayscale'}`}>
                👑
              </span>
              <div>
                <h4 className="font-medium">Leyenda</h4>
                <p className="text-sm text-gray-600">Completa toda la búsqueda</p>
              </div>
            </div>
            {isCompleted && (
              <div className="text-xs text-yellow-600 font-medium">¡Desbloqueado!</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Treasures */}
      {scannedTreasures.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Tesoros Recientes</h3>
          
          <div className="space-y-3">
            {scannedTreasures.slice(0, 5).map((treasure) => (
              <div key={treasure.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">
                    {treasure.treasure_code.split('-').pop()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{treasure.treasure_name}</h4>
                  <p className="text-sm text-gray-600">{treasure.treasure_description}</p>
                </div>
                <span className="text-green-600">
                  ✓
                </span>
              </div>
            ))}
          </div>

          {scannedTreasures.length > 5 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Y {scannedTreasures.length - 5} tesoros más...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={() => window.location.href = '/qr-scanner'}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Escanear Tesoro
        </Button>
        {onRefresh && (
          <Button 
            onClick={onRefresh}
            variant="outline"
            className="px-6"
          >
            Actualizar
          </Button>
        )}
      </div>
    </div>
  )
}