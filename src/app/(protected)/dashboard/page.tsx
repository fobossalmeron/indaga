"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProtectedLayout } from "@/app/components/layout/protected-layout";
import { useAuth } from "@/hooks/use-auth";
import { useTreasureProgress } from "@/hooks/use-treasure-progress";
import { TreasureNotification } from "@/app/components/features/treasure-notification";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useAuth();
  const { progress, isLoading: progressLoading } = useTreasureProgress();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      router.push("/admin");
    }
  }, [session, isPending, router]);

  if (isPending || (!isPending && session?.user?.role === "admin")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  const dashboardStats = [
    {
      title: "Tesoros Encontrados",
      value: progressLoading ? "..." : progress.treasuresFound.toString(),
      description: "Festival Santa Lucía 2025",
      href: "/treasures",
      color: "bg-yellow-500",
    },
    {
      title: "Eventos Guardados",
      value: "0",
      description: "En tu agenda personal",
      href: "/saved-items",
      color: "bg-blue-500",
    },
    {
      title: "Lugares Favoritos",
      value: "0",
      description: "De la guía de la ciudad",
      href: "/saved-items",
      color: "bg-green-500",
    },
    {
      title: "Progreso Hunt",
      value: progressLoading ? "..." : `${Math.round(progress.completionPercentage)}%`,
      description: "Completado",
      href: "/treasures",
      color: "bg-purple-500",
    },
  ];

  const quickActions = [
    {
      title: "Escanear QR",
      description: "Usa la cámara de tu teléfono",
      href: "/treasure-hunt",
      icon: "📱",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    },
    {
      title: "Ver Agenda",
      description: "Explora eventos de la ciudad",
      href: "/agenda",
      icon: "📅",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
    },
    {
      title: "Guía de Lugares",
      description: "Descubre lugares increíbles",
      href: "/guia",
      icon: "📍",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    },
    {
      title: "Mis Tesoros",
      description: "Ve tu progreso en el hunt",
      href: "/treasures",
      icon: "💎",
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
    },
  ];

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        {/* Treasure Notification */}
        <TreasureNotification />
        
        {/* Welcome Section */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Bienvenido a INDAGA!
            </h1>
            <p className="mt-2 text-gray-600">
              Hola{" "}
              <span className="font-medium">
                {session?.user?.name || session?.user?.email}
              </span>
              , estás listo para explorar Monterrey y encontrar tesoros únicos.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat, index) => (
            <Link
              key={index}
              href={stat.href}
              className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div
                      className={`h-8 w-8 ${stat.color} flex items-center justify-center rounded-md`}
                    >
                      <div className="h-4 w-4 rounded-sm bg-white"></div>
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        {stat.title}
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </dd>
                      <dd className="text-sm text-gray-600">
                        {stat.description}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-6 text-xl font-bold text-gray-900">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`rounded-lg border-2 p-6 transition-colors ${action.color}`}
              >
                <div className="text-center">
                  <div className="mb-3 text-3xl">{action.icon}</div>
                  <h3 className="mb-2 font-semibold text-gray-900">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Treasure Hunt Promo */}
        <div className="rounded-lg bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg">
          <div className="px-6 py-8 text-center">
            <h3 className="mb-2 text-2xl font-bold text-white">
              🏆 Festival Santa Lucía 2025 - Treasure Hunt
            </h3>
            <p className="mb-6 text-yellow-100">
              Explora la ciudad, escanea códigos QR y colecciona tesoros únicos.
              ¡Descubre lugares mágicos durante el festival!
            </p>
            <Link
              href="/treasure-hunt"
              className="inline-flex items-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-yellow-600 transition-colors hover:bg-yellow-50"
            >
              Comenzar Hunt 🔍
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              Actividad Reciente
            </h3>
          </div>
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No hay actividad reciente aún.</p>
            <p className="mt-2 text-sm">
              ¡Comienza escaneando tu primer código QR!
            </p>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
