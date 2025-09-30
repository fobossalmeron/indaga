"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ProgressTracker from "@/app/components/features/progress-tracker";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import type {
  TreasureHunt,
  TreasureProgress,
  Treasure,
} from "@/lib/treasure-hunt-2025";
import { Loader2 } from "lucide-react";
import Image from "next/image";

interface TreasurePageData {
  hunt: TreasureHunt | null;
  progress: TreasureProgress | null;
  scannedTreasures: Treasure[];
}

export default function TreasuresPage() {
  const [data, setData] = useState<TreasurePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, isPending } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isPending && session?.user) {
      loadTreasureData();
    } else if (!isPending && !session?.user) {
      setLoading(false);
    }
  }, [session, isPending]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "technical") {
      toast.error("Algo salió mal. Intenta escanear el código nuevamente.", {
        duration: 5000,
        style: {
          background: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#dc2626",
        },
      });
    }
  }, [searchParams]);

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
      <div className="py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="py-8 text-center">
            <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
            <p>Cargando datos del treasure hunt...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.hunt) {
    return (
      <div className="py-8">
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
    <div className="py-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex w-full flex-col gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/festival_santa_lucia.svg"
              alt="OFF FST Festival Internacional de Santa Lucia"
              width={200}
              height={200}
            />
          </div>
          {session?.user?.email && (
            <div className="text-center md:text-right">
              <p className="text-base leading-tight md:text-lg">
                Hola,
                <br />
                <span className="text-gray-600">{session.user.email}</span>
              </p>
            </div>
          )}
        </div>

        {/* Progress Tracker with integrated Treasure Map */}
        <ProgressTracker
          hunt={data.hunt}
          progress={data.progress}
          scannedTreasures={data.scannedTreasures}
          onRefresh={loadTreasureData}
          scannedCode={searchParams.get("scanned")}
        />
      </div>
    </div>
  );
}
