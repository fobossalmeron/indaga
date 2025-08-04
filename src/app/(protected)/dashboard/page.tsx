"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
      description: "FISL 2025",
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
      value: progressLoading
        ? "..."
        : `${Math.round(progress.completionPercentage)}%`,
      description: "Completado",
      href: "/treasures",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Treasure Notification */}
      <TreasureNotification />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex flex-col items-center space-y-3 md:flex-row md:items-center md:space-y-0">
                <div className="flex-shrink-0">
                  <div
                    className={`h-8 w-8 ${stat.color} flex items-center justify-center rounded-md`}
                  >
                    <div className="h-4 w-4 rounded-sm bg-white"></div>
                  </div>
                </div>
                <div className="text-center md:ml-4 md:w-0 md:flex-1 md:text-left">
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
    </div>
  );
}
