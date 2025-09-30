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
      title: "Eventos favoritos",
      value: "0",
      description: "En tu agenda personal",
      href: "/saved-items",
      color: "bg-blue-500",
    },
    {
      title: "Lugares favoritos",
      value: "0",
      description: "De la guía de la ciudad",
      href: "/saved-items",
      color: "bg-green-500",
    },
  ];

  const treasureHuntStats = {
    treasuresFound: progressLoading
      ? "..."
      : progress.treasuresFound.toString(),
    completionPercentage: progressLoading
      ? "..."
      : `${Math.round(progress.completionPercentage)}%`,
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-foreground mb-2 text-3xl">Mi perfil</h1>
        <p className="text-foreground">
          Que gusto verte, {session?.user?.email}
        </p>
      </div>
      {/* Treasure Notification */}
      <TreasureNotification />

      {/* Treasure Hunt Card - Spanning 2 columns on mobile */}
      <Link
        href="/treasures"
        className="overflow-hidden rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-purple-50 shadow transition-shadow hover:shadow-md"
      >
        <div className="overflow-hidden rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-purple-500">
                  <div className="h-6 w-6 rounded-sm bg-white"></div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Treasure Hunt
                </h3>
                <p className="text-sm text-gray-600">OFF FEST FISL 2025</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600">
                {treasureHuntStats.completionPercentage}
              </div>
              <div className="text-sm text-gray-500">Completado</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {treasureHuntStats.treasuresFound}
              </div>
              <div className="text-sm text-gray-600">Tesoros encontrados</div>
            </div>
            <div className="mx-4 flex-1">
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-purple-500 transition-all duration-300"
                  style={{
                    width: progressLoading
                      ? "0%"
                      : `${Math.round(progress.completionPercentage)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Stats Grid */}
      {/* <div className="grid grid-cols-2 gap-6">
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
      </div> */}
    </div>
  );
}
