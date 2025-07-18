"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { data: session, isPending, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      setIsLoading(false);
      if (!session) {
        router.push("/login");
      }
    }
  }, [session, isPending, router]);

  if (isLoading || isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="text-xl font-bold text-gray-900"
              >
                INDAGA
              </Link>
              <div className="hidden space-x-4 md:flex">
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/treasures"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Mis Tesoros
                </Link>
                <Link
                  href="/saved-items"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Guardados
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Hola, {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={async () => {
                  await signOut();
                  router.push("/login");
                }}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
