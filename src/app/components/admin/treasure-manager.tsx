'use client'

// Treasure Hunt Manager Component for Admin Panel
// Created for ULTRATHINK Plan - Agent C

import { useState, useEffect } from 'react'
import { adminTreasureActions } from '@/lib/admin-actions'
import type { TreasureHunt, TreasureHunt2025Treasure } from '../../../../types/database'

interface TreasureManagerProps {
  initialHunts?: any[]
}

export default function TreasureManager({ initialHunts = [] }: TreasureManagerProps) {
  const [hunts, setHunts] = useState(initialHunts)
  const [selectedHunt, setSelectedHunt] = useState<string | null>(null)
  const [huntDetails, setHuntDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showCreateHunt, setShowCreateHunt] = useState(false)
  const [showCreateTreasure, setShowCreateTreasure] = useState(false)

  // New hunt form state
  const [newHunt, setNewHunt] = useState({
    name: '',
    year: new Date().getFullYear(),
    description: '',
    start_date: '',
    end_date: '',
    total_treasures: 0
  })

  // New treasure form state
  const [newTreasure, setNewTreasure] = useState({
    treasure_code: '',
    treasure_name: '',
    treasure_secret: '',
    treasure_location_maps_url: ''
  })

  // Fetch hunt details
  const fetchHuntDetails = async (huntId: string) => {
    setLoading(true)
    try {
      const details = await adminTreasureActions.getTreasureHuntById(huntId)
      setHuntDetails(details)
    } catch (error) {
      console.error('Error fetching hunt details:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle hunt selection
  const handleHuntSelect = (huntId: string) => {
    setSelectedHunt(huntId)
    fetchHuntDetails(huntId)
  }

  // Create new hunt
  const handleCreateHunt = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const hunt = await adminTreasureActions.createTreasureHunt({
        ...newHunt,
        start_date: newHunt.start_date || undefined,
        end_date: newHunt.end_date || undefined,
        total_treasures: newHunt.total_treasures || undefined
      })
      
      setHunts([hunt, ...hunts])
      setShowCreateHunt(false)
      setNewHunt({
        name: '',
        year: new Date().getFullYear(),
        description: '',
        start_date: '',
        end_date: '',
        total_treasures: 0
      })
      alert('Treasure Hunt creado exitosamente!')
    } catch (error) {
      console.error('Error creating hunt:', error)
      alert('Error al crear el Treasure Hunt')
    } finally {
      setLoading(false)
    }
  }

  // Add treasure to hunt
  const handleCreateTreasure = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedHunt) return
    
    setLoading(true)
    
    try {
      await adminTreasureActions.addTreasure({
        hunt_id: selectedHunt,
        ...newTreasure
      })
      
      // Refresh hunt details
      await fetchHuntDetails(selectedHunt)
      
      setShowCreateTreasure(false)
      setNewTreasure({
        treasure_code: '',
        treasure_name: '',
        treasure_secret: '',
        treasure_location_maps_url: ''
      })
      alert('Tesoro añadido exitosamente!')
    } catch (error) {
      console.error('Error adding treasure:', error)
      alert('Error al añadir el tesoro')
    } finally {
      setLoading(false)
    }
  }

  // Toggle hunt active status
  const handleToggleHuntStatus = async (huntId: string, currentStatus: boolean) => {
    try {
      await adminTreasureActions.updateTreasureHunt(huntId, {
        is_active: !currentStatus
      })
      
      // Update local state
      setHunts(hunts.map(hunt => 
        hunt.id === huntId 
          ? { ...hunt, is_active: !currentStatus }
          : hunt
      ))
      
      if (huntDetails && huntDetails.id === huntId) {
        setHuntDetails({ ...huntDetails, is_active: !currentStatus })
      }
    } catch (error) {
      console.error('Error updating hunt status:', error)
      alert('Error al actualizar el estado del hunt')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium text-gray-900">
            Gestión de Treasure Hunts
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Administra treasure hunts, tesoros y códigos QR
          </p>
        </div>
        <button
          onClick={() => setShowCreateHunt(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Crear Nuevo Hunt
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hunt List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Treasure Hunts
              </h3>
              <div className="space-y-3">
                {hunts.map((hunt) => (
                  <div
                    key={hunt.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedHunt === hunt.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleHuntSelect(hunt.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {hunt.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          Año {hunt.year}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {hunt.treasure_hunt_2025_treasures?.length || 0} tesoros
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          hunt.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {hunt.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleToggleHuntStatus(hunt.id, hunt.is_active)
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-900"
                        >
                          {hunt.is_active ? 'Desactivar' : 'Activar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hunt Details */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center text-gray-500">Cargando...</div>
            </div>
          ) : huntDetails ? (
            <div className="space-y-6">
              {/* Hunt Info */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {huntDetails.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {huntDetails.description}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Año:</span> {huntDetails.year}
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Estado:</span>{' '}
                          <span className={huntDetails.is_active ? 'text-green-600' : 'text-gray-600'}>
                            {huntDetails.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Participantes:</span>{' '}
                          {huntDetails.treasure_hunt_2025_progress?.length || 0}
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Total Escaneos:</span>{' '}
                          {huntDetails.treasure_hunt_2025_scans?.length || 0}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCreateTreasure(true)}
                      className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
                    >
                      Añadir Tesoro
                    </button>
                  </div>
                </div>
              </div>

              {/* Treasures List */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Tesoros ({huntDetails.treasure_hunt_2025_treasures?.length || 0})
                  </h4>
                  
                  {huntDetails.treasure_hunt_2025_treasures?.length > 0 ? (
                    <div className="space-y-4">
                      {huntDetails.treasure_hunt_2025_treasures.map((treasure: any) => {
                        const scanCount = huntDetails.treasure_hunt_2025_scans?.filter(
                          (scan: any) => scan.treasure_id === treasure.id
                        ).length || 0
                        
                        return (
                          <div key={treasure.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-900">
                                  {treasure.treasure_name}
                                </h5>
                                <p className="text-xs text-gray-500 mt-1">
                                  Código: <span className="font-mono bg-gray-100 px-1 rounded">
                                    {treasure.treasure_code}
                                  </span>
                                </p>
                                {treasure.treasure_secret && (
                                  <p className="text-xs text-gray-600 mt-2">
                                    <span className="font-medium">Palabra secreta:</span> {treasure.treasure_secret}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">
                                  {scanCount} escaneos
                                </div>
                                <div className="text-xs text-gray-500">
                                  QR: {treasure.treasure_code}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Sin tesoros</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Comienza añadiendo tesoros a este hunt.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center text-gray-500">
                Selecciona un Treasure Hunt para ver los detalles
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Hunt Modal */}
      {showCreateHunt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <form onSubmit={handleCreateHunt} className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Crear Nuevo Treasure Hunt
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={newHunt.name}
                    onChange={(e) => setNewHunt({ ...newHunt, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Año *
                  </label>
                  <input
                    type="number"
                    required
                    value={newHunt.year}
                    onChange={(e) => setNewHunt({ ...newHunt, year: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Descripción
                  </label>
                  <textarea
                    value={newHunt.description}
                    onChange={(e) => setNewHunt({ ...newHunt, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={newHunt.start_date}
                      onChange={(e) => setNewHunt({ ...newHunt, start_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={newHunt.end_date}
                      onChange={(e) => setNewHunt({ ...newHunt, end_date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateHunt(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Hunt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Treasure Modal */}
      {showCreateTreasure && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <form onSubmit={handleCreateTreasure} className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Añadir Tesoro
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Código QR *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTreasure.treasure_code}
                    onChange={(e) => setNewTreasure({ ...newTreasure, treasure_code: e.target.value })}
                    placeholder="Ej: TREASURE_001"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del Tesoro *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTreasure.treasure_name}
                    onChange={(e) => setNewTreasure({ ...newTreasure, treasure_name: e.target.value })}
                    placeholder="Ej: Café Central"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Palabra Secreta *
                  </label>
                  <input
                    type="text"
                    value={newTreasure.treasure_secret}
                    onChange={(e) => setNewTreasure({ ...newTreasure, treasure_secret: e.target.value })}
                    placeholder="Palabra clave del tesoro (ej: Alquimia, Circuito)..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    URL de Google Maps
                  </label>
                  <input
                    type="url"
                    value={newTreasure.treasure_location_maps_url}
                    onChange={(e) => setNewTreasure({ ...newTreasure, treasure_location_maps_url: e.target.value })}
                    placeholder="https://maps.app.goo.gl/..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateTreasure(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-500 disabled:opacity-50"
                >
                  {loading ? 'Añadiendo...' : 'Añadir Tesoro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}