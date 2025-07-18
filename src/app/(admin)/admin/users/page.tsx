// Admin Users Page
// Created for ULTRATHINK Plan - Agent C

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import auth from '@/lib/auth'
import { adminUtils, adminUserActions } from '@/lib/admin-actions'
import UsersTable from '@/app/components/admin/users-table'

export default async function AdminUsersPage() {
  // Get session
  const session = await auth.api.getSession({
    headers: await headers()
  })

  // Redirect if not logged in
  if (!session) {
    redirect('/login?redirect=/admin/users')
  }

  // Check if user is admin
  const isAdmin = await adminUtils.isAdmin(session.user.email)
  
  if (!isAdmin) {
    redirect('/')
  }

  // Get initial users data
  const initialData = await adminUserActions.getAllUsers({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Gestión de Usuarios
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Administra todos los usuarios registrados en INDAGA
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
        </div>

        {/* Stats Summary */}
        <div className="mt-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Total de Usuarios
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {initialData.total.toLocaleString()}
              </dd>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Usuarios Verificados
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {initialData.users.filter(u => u.email_verified).length}
              </dd>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Con Actividad TH
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {initialData.users.filter(u => u.treasure_hunt_2025_progress?.length).length}
              </dd>
            </div>

            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">
                Registros Hoy
              </dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {initialData.users.filter(u => {
                  const today = new Date().toDateString()
                  const userDate = new Date(u.created_at || '').toDateString()
                  return today === userDate
                }).length}
              </dd>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="mt-8">
          <UsersTable 
            initialUsers={initialData.users} 
            initialTotal={initialData.total}
          />
        </div>
      </div>
    </div>
  )
}