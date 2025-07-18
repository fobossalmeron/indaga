// Admin Dashboard Main Page
// Created for ULTRATHINK Plan - Agent C

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import auth from "@/lib/auth";
import { adminUtils, adminStatsActions } from "@/lib/admin-actions";
import StatsDashboard from "@/app/components/admin/stats-dashboard";
import { Button } from "@/app/components/ui/button";
import { Users, Trophy, BarChart3, LogOut } from "lucide-react";

export default async function AdminPage() {
  console.log("🔍 [ADMIN PAGE] Starting AdminPage function");

  // Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("🔍 [ADMIN PAGE] Session:", session ? "EXISTS" : "NULL");
  console.log("🔍 [ADMIN PAGE] User email:", session?.user?.email);

  // Redirect if not logged in
  if (!session) {
    console.log("🔍 [ADMIN PAGE] No session, redirecting to login");
    redirect("/login?redirect=/admin");
  }

  // Check if user is admin
  const isAdmin = await adminUtils.isAdmin(session.user.email);
  console.log("🔍 [ADMIN PAGE] Is admin check result:", isAdmin);

  if (!isAdmin) {
    console.log("🔍 [ADMIN PAGE] Not admin, redirecting to /");
    redirect("/");
  }

  console.log("🔍 [ADMIN PAGE] Admin check passed, proceeding to render");

  // Get dashboard stats
  const stats = await adminStatsActions.getDashboardStats();
  const userActivity = await adminStatsActions.getUserActivityStats(30);
  const scanActivity = await adminStatsActions.getTreasureScanStats(30);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
              Panel de Administración INDAGA
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Gestiona usuarios, treasure hunts y revisa estadísticas
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 md:mt-0 md:ml-4">
            <div className="text-sm text-gray-500">
              Bienvenido, {session.user.name || session.user.email}
            </div>
            <form action="/api/auth/sign-out" method="POST">
              <Button size="sm" variant="outline" type="submit">
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </Button>
            </form>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Usuarios Totales
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {stats.totalUsers.toLocaleString()}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Usuarios Verificados
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {stats.verifiedUsers.toLocaleString()}
            </dd>
            <div className="mt-1 text-sm text-gray-500">
              {stats.verificationRate}% de verificación
            </div>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Escaneos QR Totales
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {stats.totalScans.toLocaleString()}
            </dd>
          </div>

          <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">
              Treasure Hunts Activos
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {stats.activeTreasureHunts}
            </dd>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Users Management */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Gestión de Usuarios
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalUsers} usuarios registrados
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  • Ver tabla completa de usuarios
                  <br />
                  • Filtrar por verificación
                  <br />
                  • Exportar datos
                  <br />• {stats.recentUsers} nuevos en 7 días
                </div>
                <div className="mt-4">
                  <Link href="/admin/users">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-500">
                      Gestionar Usuarios
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Treasure Hunt Management */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Treasure Hunts
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.activeTreasureHunts} hunts activos
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  • Crear nuevos treasure hunts
                  <br />
                  • Gestionar tesoros y códigos QR
                  <br />
                  • Ver progreso de participantes
                  <br />• {stats.totalScans} escaneos totales
                </div>
                <div className="mt-4">
                  <Link href="/admin/treasures">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-500"
                    >
                      Gestionar Treasures
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="truncate text-sm font-medium text-gray-500">
                      Estadísticas Avanzadas
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Analytics completos
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-500">
                  • Eventos guardados: {stats.totalSavedEvents}
                  <br />• Lugares guardados: {stats.totalSavedPlaces}
                  <br />
                  • Gráficas de actividad
                  <br />• Reportes detallados
                </div>
                <div className="mt-4">
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-500"
                  >
                    Ver más abajo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics Component */}
        <div className="mt-8">
          <StatsDashboard
            stats={stats}
            userActivity={userActivity}
            scanActivity={scanActivity}
          />
        </div>
      </div>
    </div>
  );
}
