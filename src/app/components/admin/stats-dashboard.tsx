"use client";

// Stats Dashboard Component for Admin Panel
// Created for ULTRATHINK Plan - Agent C

import { useState, useEffect } from "react";

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
}

export default function StatsDashboard({
  stats,
  userActivity,
  scanActivity,
}: StatsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "activity">(
    "overview",
  );

  // Simple chart data formatting
  const formatChartData = (data: ActivityData[], key: "users" | "scans") => {
    return data.map((item) => ({
      date: new Date(item.date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      }),
      value: item[key] || 0,
    }));
  };

  const userChartData = formatChartData(userActivity, "users");
  const scanChartData = formatChartData(scanActivity, "scans");

  // Simple SVG chart component
  const SimpleChart = ({
    data,
    color = "#3B82F6",
    title,
    height = 200,
  }: {
    data: { date: string; value: number }[];
    color?: string;
    title: string;
    height?: number;
  }) => {
    if (data.length === 0)
      return <div className="text-gray-500">Sin datos</div>;

    const maxValue = Math.max(...data.map((d) => d.value));
    const width = 600;
    const padding = 40;

    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900">{title}</h3>
        <svg width={width} height={height + padding * 2} className="w-full">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction, i) => (
            <g key={i}>
              <line
                x1={padding}
                y1={padding + height * fraction}
                x2={width - padding}
                y2={padding + height * fraction}
                stroke="#E5E7EB"
                strokeWidth={1}
              />
              <text
                x={padding - 10}
                y={padding + height * fraction + 5}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                {Math.round(maxValue * (1 - fraction))}
              </text>
            </g>
          ))}

          {/* Chart line */}
          <polyline
            points={data
              .map((item, index) => {
                const x =
                  padding + (index / (data.length - 1)) * (width - padding * 2);
                const y = padding + height - (item.value / maxValue) * height;
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke={color}
            strokeWidth={2}
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x =
              padding + (index / (data.length - 1)) * (width - padding * 2);
            const y = padding + height - (item.value / maxValue) * height;
            return <circle key={index} cx={x} cy={y} r={4} fill={color} />;
          })}

          {/* X-axis labels */}
          {data
            .filter((_, i) => i % Math.ceil(data.length / 8) === 0)
            .map((item, index, filtered) => {
              const originalIndex = data.findIndex((d) => d.date === item.date);
              const x =
                padding +
                (originalIndex / (data.length - 1)) * (width - padding * 2);
              return (
                <text
                  key={originalIndex}
                  x={x}
                  y={height + padding + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6B7280"
                >
                  {item.date}
                </text>
              );
            })}
        </svg>
      </div>
    );
  };

  return (
    <div className="rounded-lg bg-white shadow">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {[
            { key: "overview", name: "Resumen General" },
            { key: "users", name: "Análisis de Usuarios" },
            { key: "activity", name: "Actividad de Treasure Hunt" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab.key
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Métricas Principales
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-800">Usuarios Totales</div>
                  <div className="mt-1 text-xs text-blue-600">
                    +{stats.recentUsers} en 7 días
                  </div>
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.verificationRate}%
                  </div>
                  <div className="text-sm text-green-800">
                    Tasa de Verificación
                  </div>
                  <div className="mt-1 text-xs text-green-600">
                    {stats.verifiedUsers} verificados
                  </div>
                </div>

                <div className="rounded-lg bg-purple-50 p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.totalScans.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-800">Escaneos QR</div>
                  <div className="mt-1 text-xs text-purple-600">
                    Treasure Hunt 2025
                  </div>
                </div>

                <div className="rounded-lg bg-orange-50 p-4">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.activeTreasureHunts}
                  </div>
                  <div className="text-sm text-orange-800">Hunts Activos</div>
                  <div className="mt-1 text-xs text-orange-600">En curso</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Contenido Guardado
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-xl font-semibold text-gray-900">
                    {stats.totalSavedEvents.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Eventos favoritos</div>
                  <div className="mt-1 text-xs text-gray-500">
                    Por usuarios registrados
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="text-xl font-semibold text-gray-900">
                    {stats.totalSavedPlaces.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Lugares favoritos</div>
                  <div className="mt-1 text-xs text-gray-500">
                    De la guía INDAGA
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Registros de Usuarios (Últimos 30 días)
              </h3>
              <SimpleChart
                data={userChartData}
                color="#3B82F6"
                title="Nuevos Usuarios por Día"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="text-lg font-semibold text-blue-600">
                  Crecimiento
                </div>
                <div className="mt-2 text-sm text-blue-800">
                  Promedio:{" "}
                  {Math.round(
                    userActivity.reduce(
                      (sum, day) => sum + (day.users || 0),
                      0,
                    ) / userActivity.length,
                  )}{" "}
                  usuarios/día
                </div>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <div className="text-lg font-semibold text-green-600">
                  Pico Máximo
                </div>
                <div className="mt-2 text-sm text-green-800">
                  {Math.max(...userActivity.map((d) => d.users || 0))} usuarios
                  en un día
                </div>
              </div>

              <div className="rounded-lg bg-purple-50 p-4">
                <div className="text-lg font-semibold text-purple-600">
                  Total Período
                </div>
                <div className="mt-2 text-sm text-purple-800">
                  {userActivity.reduce((sum, day) => sum + (day.users || 0), 0)}{" "}
                  nuevos usuarios
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Actividad de Treasure Hunt (Últimos 30 días)
              </h3>
              <SimpleChart
                data={scanChartData}
                color="#10B981"
                title="Escaneos QR por Día"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-green-50 p-4">
                <div className="text-lg font-semibold text-green-600">
                  Engagement
                </div>
                <div className="mt-2 text-sm text-green-800">
                  Promedio:{" "}
                  {Math.round(
                    scanActivity.reduce(
                      (sum, day) => sum + (day.scans || 0),
                      0,
                    ) / scanActivity.length,
                  )}{" "}
                  escaneos/día
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <div className="text-lg font-semibold text-blue-600">
                  Día Más Activo
                </div>
                <div className="mt-2 text-sm text-blue-800">
                  {Math.max(...scanActivity.map((d) => d.scans || 0))} escaneos
                  máximos
                </div>
              </div>

              <div className="rounded-lg bg-purple-50 p-4">
                <div className="text-lg font-semibold text-purple-600">
                  Total Escaneos
                </div>
                <div className="mt-2 text-sm text-purple-800">
                  {scanActivity.reduce((sum, day) => sum + (day.scans || 0), 0)}{" "}
                  en 30 días
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Sugerencia para Mejorar Engagement
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Considera lanzar campañas promocionales cuando la
                      actividad baje o crear nuevos treasure hunts temáticos
                      para mantener el interés de los usuarios.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
