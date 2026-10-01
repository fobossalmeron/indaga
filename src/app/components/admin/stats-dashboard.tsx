"use client";

import { useState } from "react";

interface StatsData {
  totalUsers: number;
  verifiedUsers: number;
  totalScans: number;
  activeTreasureHunts: number;
  totalSavedEvents: number;
  totalSavedPlaces: number;
  recentUsers: number;
  verificationRate: number;
}

interface ActivityData {
  date: string;
  users?: number;
  scans?: number;
}

interface StatsDashboardProps {
  stats: StatsData;
  userActivity: ActivityData[];
  scanActivity: ActivityData[];
  participantScope?: boolean;
  scopeLabel?: string;
}

export function SimpleChart({
  data,
  color = "#3B82F6",
  title,
}: {
  data: { date: string; value: number }[];
  color?: string;
  title: string;
}) {
  const maxValue = Math.max(1, ...data.map((point) => point.value));
  const width = 600;
  const height = 200;
  const padding = 40;
  const pointX = (index: number) => data.length <= 1 ? width / 2 : padding + index / (data.length - 1) * (width - padding * 2);
  const pointY = (value: number) => padding + height - value / maxValue * height;

  return (
    <div className="min-w-0 rounded-lg border border-gray-100 bg-white p-3 sm:p-6">
      <h3 className="mb-4 text-lg font-medium text-gray-900">{title}</h3>
      {data.length === 0 ? <p className="py-12 text-center text-gray-500">Sin actividad en este período</p> : (
        <svg viewBox={`0 0 ${width} ${height + padding * 2}`} className="block h-auto w-full max-w-full" role="img" aria-label={title}>
          <title>{title}</title>
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
            <g key={fraction}>
              <line x1={padding} y1={padding + height * fraction} x2={width - padding} y2={padding + height * fraction} stroke="#E5E7EB" />
              <text x={padding - 10} y={padding + height * fraction + 5} textAnchor="end" fontSize="12" fill="#6B7280">{Number((maxValue * (1 - fraction)).toFixed(1))}</text>
            </g>
          ))}
          <polyline points={data.map((item, index) => `${pointX(index)},${pointY(item.value)}`).join(" ")} fill="none" stroke={color} strokeWidth={2} />
          {data.map((item, index) => (
            <g key={`${item.date}-${index}`}>
              <circle cx={pointX(index)} cy={pointY(item.value)} r={4} fill={color}><title>{`${item.date}: ${item.value}`}</title></circle>
              {index % Math.ceil(data.length / 8) === 0 && <text x={pointX(index)} y={height + padding + 20} textAnchor="middle" fontSize="12" fill="#6B7280">{item.date}</text>}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

export default function StatsDashboard({ stats, userActivity, scanActivity, participantScope = false, scopeLabel = "Todas las ediciones" }: StatsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "activity">("overview");
  const formatChartData = (data: ActivityData[], key: "users" | "scans") => data.map((item) => ({
    date: new Date(`${item.date.slice(0, 10)}T12:00:00Z`).toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", timeZone: "UTC" }),
    value: item[key] || 0,
  }));
  const userChartData = formatChartData(userActivity, "users");
  const scanChartData = formatChartData(scanActivity, "scans");
  const periodUsers = userChartData.reduce((sum, day) => sum + day.value, 0);
  const periodScans = scanChartData.reduce((sum, day) => sum + day.value, 0);
  const average = (total: number) => (total / 30).toLocaleString("es-MX", { maximumFractionDigits: 1 });
  const cohortLabel = participantScope ? "De participantes de esta edición" : "De todos los usuarios de INDAGA";

  return (
    <div className="min-w-0 rounded-lg bg-white shadow">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex max-w-full gap-6 overflow-x-auto px-4 sm:px-6" aria-label="Secciones de estadísticas">
          {([
            { key: "overview", name: "Resumen" },
            { key: "users", name: participantScope ? "Registros de participantes" : "Registros de usuarios" },
            { key: "activity", name: "Escaneos QR" },
          ] as const).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} aria-current={activeTab === tab.key ? "page" : undefined} className={`shrink-0 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${activeTab === tab.key ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}>{tab.name}</button>
          ))}
        </nav>
      </div>

      <div className="min-w-0 p-4 sm:p-6">
        <p className="mb-6 text-sm text-gray-500">{scopeLabel}</p>
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-lg font-medium text-gray-900">Métricas principales</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-2xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-blue-800">{participantScope ? "Participantes únicos" : "Usuarios totales"}</p>
                  <p className="mt-1 text-xs text-blue-600">{stats.recentUsers} cuentas creadas en los últimos 7 días</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-2xl font-bold text-green-600">{stats.verificationRate}%</p>
                  <p className="text-sm text-green-800">Tasa de verificación</p>
                  <p className="mt-1 text-xs text-green-600">{stats.verifiedUsers} correos verificados</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-2xl font-bold text-purple-600">{stats.totalScans.toLocaleString()}</p>
                  <p className="text-sm text-purple-800">Escaneos QR</p>
                  <p className="mt-1 text-xs text-purple-600">{participantScope ? "De esta edición" : "De todas las ediciones"}</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-4">
                  <p className="text-2xl font-bold text-orange-600">{participantScope ? (stats.activeTreasureHunts ? "Sí" : "No") : stats.activeTreasureHunts}</p>
                  <p className="text-sm text-orange-800">{participantScope ? "Edición activa" : "Treasure Hunts activos"}</p>
                  <p className="mt-1 text-xs text-orange-600">Habilitados y dentro de sus fechas</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-medium text-gray-900">Contenido guardado</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[{ label: "Eventos favoritos", count: stats.totalSavedEvents }, { label: "Lugares favoritos", count: stats.totalSavedPlaces }].map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-gray-50 p-4"><p className="text-xl font-semibold text-gray-900">{metric.count.toLocaleString()}</p><p className="text-sm text-gray-600">{metric.label}</p><p className="mt-1 text-xs text-gray-500">{cohortLabel}</p></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-lg font-medium text-gray-900">Registro de cuentas · Últimos 30 días</h2>
              <p className="mb-4 text-sm text-gray-600">{participantScope ? "Fecha de creación de las cuentas de quienes ya registraron al menos una visita en esta edición. No representa la fecha de su primera visita." : "Fecha de creación de las cuentas de INDAGA."} Los días de las gráficas se agrupan en UTC.</p>
              <SimpleChart data={userChartData} title="Cuentas creadas por día" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-4"><h3 className="font-medium text-blue-700">Promedio diario</h3><p className="mt-2 text-sm text-blue-800">{average(periodUsers)} cuentas/día</p></div>
              <div className="rounded-lg bg-green-50 p-4"><h3 className="font-medium text-green-700">Día con más registros</h3><p className="mt-2 text-sm text-green-800">{Math.max(0, ...userChartData.map(day => day.value))} cuentas</p></div>
              <div className="rounded-lg bg-purple-50 p-4"><h3 className="font-medium text-purple-700">Total del período</h3><p className="mt-2 text-sm text-purple-800">{periodUsers} cuentas creadas</p></div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6">
            <div>
              <h2 className="mb-2 text-lg font-medium text-gray-900">Escaneos QR · Últimos 30 días</h2>
              <p className="mb-4 text-sm text-gray-600">{participantScope ? "Visitas registradas en esta edición." : "Visitas registradas en todas las ediciones."} Los días de las gráficas se agrupan en UTC.</p>
              <SimpleChart data={scanChartData} color="#10B981" title="Escaneos QR por día" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-green-50 p-4"><h3 className="font-medium text-green-700">Promedio diario</h3><p className="mt-2 text-sm text-green-800">{average(periodScans)} escaneos/día</p></div>
              <div className="rounded-lg bg-blue-50 p-4"><h3 className="font-medium text-blue-700">Día con más actividad</h3><p className="mt-2 text-sm text-blue-800">{Math.max(0, ...scanChartData.map(day => day.value))} escaneos</p></div>
              <div className="rounded-lg bg-purple-50 p-4"><h3 className="font-medium text-purple-700">Total del período</h3><p className="mt-2 text-sm text-purple-800">{periodScans} escaneos en 30 días</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
