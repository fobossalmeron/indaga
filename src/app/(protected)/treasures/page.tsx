"use client";

import { useState, useEffect } from "react";
import TreasureMap from "@/app/components/features/treasure-map";
import ProgressTracker from "@/app/components/features/progress-tracker";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import type {
  TreasureHunt,
  TreasureProgress,
  Treasure,
} from "@/lib/treasure-hunt-2025";

interface TreasurePageData {
  hunt: TreasureHunt | null;
  progress: TreasureProgress | null;
  scannedTreasures: Treasure[];
}

export default function TreasuresPage() {
  const [data, setData] = useState<TreasurePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"progress" | "map">("progress");
  const { data: session, isPending } = useAuth();

  useEffect(() => {
    if (!isPending && session?.user) {
      loadTreasureData();
    } else if (!isPending && !session?.user) {
      setLoading(false);
    }
  }, [session, isPending]);

  const loadTreasureData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/treasure-data");
      if (response.ok) {
        const treasureData = await response.json();
        setData(treasureData);
      } else {
        setData({
          hunt: null,
          progress: null,
          scannedTreasures: [],
        });
      }
    } catch (error) {
      console.error("Error loading treasure data:", error);
      setData({
        hunt: null,
        progress: null,
        scannedTreasures: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p>Cargando datos del treasure hunt...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.hunt) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="py-12 text-center">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No hay treasure hunt activo
            </h3>
            <p className="mb-6 text-gray-600">
              En este momento no hay ninguna búsqueda del tesoro disponible.
            </p>
            <Button onClick={() => (window.location.href = "/dashboard")}>
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {data.hunt.name}
          </h1>
          <p className="text-gray-600">{data.hunt.description}</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveView("progress")}
                className={`border-b-2 px-6 py-4 text-sm font-medium ${
                  activeView === "progress"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Mi Progreso
              </button>
              <button
                onClick={() => setActiveView("map")}
                className={`border-b-2 px-6 py-4 text-sm font-medium ${
                  activeView === "map"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Mapa de Tesoros
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeView === "progress" && (
          <div className="space-y-6">
            <ProgressTracker
              hunt={data.hunt}
              progress={data.progress}
              scannedTreasures={data.scannedTreasures}
              onRefresh={loadTreasureData}
            />
          </div>
        )}

        {activeView === "map" && (
          <div className="space-y-6">
            <TreasureMap
              hunt={data.hunt}
              scannedTreasures={data.scannedTreasures}
            />
          </div>
        )}
      </div>
    </div>
  );
}
