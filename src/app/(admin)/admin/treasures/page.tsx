// Admin Treasure Hunts Page
// Created for ULTRATHINK Plan - Agent C

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import auth from '@/lib/auth'
import { adminUtils, adminTreasureActions } from '@/lib/admin-actions'
import TreasureManager from '@/app/components/admin/treasure-manager'

export default async function AdminTreasuresPage() {
  // Get session
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Redirect if not logged in
  if (!session) {
    redirect('/login?redirect=/admin/treasures')
  }

  // Check if user is admin
  const isAdmin = await adminUtils.isAdmin(session.user.email)
  
  if (!isAdmin) {
    redirect('/')
  }

  // Get treasure hunts data
  const hunts = await adminTreasureActions.getAllTreasureHunts()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Gestión de Treasure Hunts
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Administra treasure hunts, tesoros y códigos QR para INDAGA
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <Link
              href="/admin"
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              ← Volver al Panel
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Total Treasure Hunts
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {hunts.length}
              </dd>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Hunts Activos
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {hunts.filter(h => h.is_active).length}
              </dd>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Total Tesoros
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {hunts.reduce((sum, hunt) => sum + ((hunt as any).treasure_hunt_2025_treasures?.count || 0), 0)}
              </dd>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Participantes Activos
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {hunts.reduce((sum, hunt) => sum + ((hunt as any).treasure_hunt_2025_progress?.count || 0), 0)}
              </dd>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="rounded-lg bg-blue-50 p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  <strong>Instrucciones:</strong> Para crear códigos QR para los tesoros, puedes usar herramientas como QR Code Generator con la URL: 
                  <code className="bg-white px-1 rounded">https://indaga.com/qr/{`{treasure_code}`}</code>
                </p>
                <p className="mt-3 text-sm md:ml-6 md:mt-0">
                  <a href="#" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                    Guía completa →
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Treasure Manager Component */}
        <div className="mt-8">
          <TreasureManager initialHunts={hunts} />
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Actividad Reciente
              </h3>
              
              <div className="space-y-4">
                {hunts.length > 0 ? (
                  hunts.map((hunt, index) => (
                    <div key={hunt.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-3 ${
                          hunt.is_active ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {hunt.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(hunt as any).treasure_hunt_2025_treasures?.count || 0} tesoros • 
                            {(hunt as any).treasure_hunt_2025_scans?.count || 0} escaneos totales
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">
                          {(hunt as any).treasure_hunt_2025_progress?.count || 0} participantes
                        </p>
                        <p className="text-xs text-gray-500">
                          Año {hunt.year}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Sin treasure hunts</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Comienza creando tu primer treasure hunt.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}