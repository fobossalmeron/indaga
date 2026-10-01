import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import auth from "@/lib/auth";
import { adminUtils, adminStatsActions } from "@/lib/admin-actions";
import { getAllTreasureHunts } from "@/lib/admin-treasure-actions";
import StatsDashboard from "@/app/components/admin/stats-dashboard";
import HuntFilter from "@/app/components/admin/hunt-filter";
import { Button } from "@/app/components/ui/button";
import { Users, Trophy, BarChart3 } from "lucide-react";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ hunt?: string | string[] }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?redirect=/admin");
  if (!(await adminUtils.isAdmin(session.user.email))) redirect("/");

  const hunts = await getAllTreasureHunts();
  const { hunt } = await searchParams;
  if (Array.isArray(hunt)) notFound();
  const selectedHunt = hunt ? hunts.find((item) => item.id === hunt) : undefined;
  if (hunt && !selectedHunt) notFound();
  const huntId = selectedHunt?.id;
  const [stats, userActivity, scanActivity] = await Promise.all([
    adminStatsActions.getDashboardStats(huntId),
    adminStatsActions.getUserActivityStats(30, huntId),
    adminStatsActions.getTreasureScanStats(30, huntId),
  ]);
  const participantScope = !!selectedHunt;

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl leading-7 sm:text-3xl">Panel de Administración INDAGA</h1>
            <p className="mt-2 text-sm text-gray-500">Gestiona usuarios, treasure hunts y revisa estadísticas.</p>
          </div>
          <p className="break-all text-sm text-gray-500">{session.user.email}</p>
        </div>

        <section className="mt-8 rounded-lg bg-white p-5 shadow" aria-label="Alcance de las estadísticas">
          <HuntFilter hunts={hunts} selectedHuntId={huntId} />
          <p className="mt-2 text-sm text-gray-600">
            {selectedHunt
              ? `${selectedHunt.name}: participantes únicos con al menos una visita registrada en esta edición. Verificación, favoritos y registros corresponden a esas personas; los escaneos corresponden únicamente a esta edición.`
              : "Todos: usuarios y favoritos de toda INDAGA, y escaneos de todas las ediciones. Cada usuario se cuenta una sola vez."}
          </p>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: participantScope ? "Participantes de la edición" : "Usuarios totales", value: stats.totalUsers.toLocaleString() },
            { title: participantScope ? "Participantes verificados" : "Usuarios verificados", value: stats.verifiedUsers.toLocaleString(), detail: `${stats.verificationRate}% de verificación` },
            { title: participantScope ? "Escaneos de la edición" : "Escaneos QR totales", value: stats.totalScans.toLocaleString() },
            { title: participantScope ? "Edición activa" : "Treasure Hunts activos", value: participantScope ? (stats.activeTreasureHunts ? "Sí" : "No") : stats.activeTreasureHunts, detail: "Habilitados y dentro de sus fechas" },
          ].map((metric) => (
            <dl key={metric.title} className="min-w-0 rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="text-sm font-medium text-gray-500">{metric.title}</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{metric.value}</dd>
              {metric.detail && <dd className="mt-1 text-sm text-gray-500">{metric.detail}</dd>}
            </dl>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="min-w-0 rounded-lg bg-white p-6 shadow">
            <Users className="mb-4 h-8 w-8 text-blue-600" />
            <h2 className="text-lg font-medium">Gestión de usuarios</h2>
            <p className="mt-2 text-sm text-gray-600">Consulta, filtra y exporta la tabla global de usuarios de INDAGA.</p>
            <Button asChild size="sm" className="mt-4 bg-blue-600 hover:bg-blue-500"><Link href="/admin/users">Gestionar usuarios</Link></Button>
          </div>
          <div className="min-w-0 rounded-lg bg-white p-6 shadow">
            <Trophy className="mb-4 h-8 w-8 text-green-600" />
            <h2 className="text-lg font-medium">Treasure Hunts</h2>
            <p className="mt-2 text-sm text-gray-600">Gestiona las ediciones, sus lugares y los códigos QR.</p>
            <Button asChild size="sm" className="mt-4 bg-green-600 hover:bg-green-500"><Link href="/admin/treasures">Gestionar Treasure Hunts</Link></Button>
          </div>
          <div className="min-w-0 rounded-lg bg-white p-6 shadow">
            <BarChart3 className="mb-4 h-8 w-8 text-purple-600" />
            <h2 className="text-lg font-medium">Estadísticas</h2>
            <p className="mt-2 text-sm text-gray-600">Eventos guardados: {stats.totalSavedEvents}<br />Lugares guardados: {stats.totalSavedPlaces}</p>
            <Button asChild size="sm" className="mt-4 bg-purple-600 hover:bg-purple-500"><a href="#estadisticas">Ver estadísticas</a></Button>
          </div>
        </div>

        <div className="mt-8 scroll-mt-20" id="estadisticas">
          <StatsDashboard stats={stats} userActivity={userActivity} scanActivity={scanActivity} participantScope={participantScope} scopeLabel={selectedHunt?.name || "Todas las ediciones"} />
        </div>
      </div>
    </div>
  );
}
