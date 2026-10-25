"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { TreasureScanConfetti } from "@/app/components/auth/TreasureScanConfetti";
import { Button } from "@/app/components/ui/button";
import { AchievementIcon } from "@/app/components/ui/achievement-icon";
import { TreasureStar } from "@/app/components/ui/treasure-star";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/app/components/ui/responsive-dialog";
import { HelpCircle, Map } from "lucide-react";
import type {
  TreasureHunt,
  TreasureProgress,
  Treasure,
} from "@/lib/treasure-hunt-2025";

import { getHuntAvailability } from "@/lib/treasure-hunt-config";

interface AllTreasure extends Treasure {
  isScanned: boolean;
}

interface ProgressTrackerProps {
  hunt: TreasureHunt;
  progress: TreasureProgress | null;
  scannedTreasures: Treasure[];
  treasures: Treasure[];
  scannedCode?: string | null;
  confettiSeen?: boolean;
}

export default function ProgressTracker({
  hunt,
  progress,
  scannedTreasures,
  treasures,
  scannedCode,
  confettiSeen = false,
}: ProgressTrackerProps) {
  const [selectedTreasure, setSelectedTreasure] = useState<AllTreasure | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const allTreasures = useMemo(() => {
    const scannedIds = new Set(scannedTreasures.map((treasure) => treasure.id));
    return treasures.map((treasure) => ({ ...treasure, isScanned: scannedIds.has(treasure.id) }));
  }, [treasures, scannedTreasures]);
  const treasuresFound = scannedTreasures.length;
  const totalTreasures = hunt.total_treasures || treasures.length;
  const completionPercentage = totalTreasures > 0 ? (treasuresFound / totalTreasures) * 100 : 0;
  const isCompleted = totalTreasures > 0 && treasuresFound >= totalTreasures;
  const isHistorical = hunt.year === 2025 || getHuntAvailability(hunt) === "ended";

  useEffect(() => {
    if (scannedCode && allTreasures.length > 0) {
      const treasure = allTreasures.find(
        (t) => t.treasure_code === scannedCode,
      );
      if (treasure) {
        setSelectedTreasure(treasure);
        setIsDetailOpen(true);
        setShowConfetti(!confettiSeen);
      }
    }
  }, [scannedCode, allTreasures, confettiSeen]);

  useEffect(() => {
    if (!showConfetti) return;
    const timeout = window.setTimeout(() => setShowConfetti(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [showConfetti]);

  const getTreasureStatusColor = (treasure: AllTreasure) => {
    if (treasure.isScanned) {
      return "bg-primary/10 border-primary/20 text-primary hover:bg-primary/15 active:bg-primary/20";
    }
    return "bg-gray-200 border-gray-300 text-gray-600 hover:bg-gray-300 active:bg-gray-400";
  };

  const getTreasureIcon = (treasure: AllTreasure) => {
    if (treasure.isScanned) {
      return <TreasureStar className="h-[27.6px] w-[27.6px]" />;
    }
    return <HelpCircle className="h-6 w-6" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getProgressMessage = () => {
    if (isHistorical) return "Tu progreso guardado en esta edición";
    if (isCompleted) {
      return "¡Felicidades! Has completado la búsqueda del tesoro";
    }
    if (treasuresFound === 0) {
      return "Comienza escaneando tu primer tesoro";
    }
    if (treasuresFound < 5) {
      return "¡Buen comienzo! Sigue explorando la ciudad";
    }
    if (treasuresFound < 15) {
      return "¡Vas muy bien! Todavía hay espacios por explorar";
    }
    return "¡Estás muy cerca de completar la búsqueda!";
  };

  return (
    <div className="mt-12 space-y-6">
      {showConfetti && createPortal(
        <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden="true">
          <TreasureScanConfetti />
        </div>,
        document.body,
      )}
      {/* Progress Overview */}
      <div className="rounded-2xl bg-white px-6 pt-9 pb-4 sm:pt-11 lg:pt-[29px]">
        <div className="mb-6 text-left">
          <h2 className="text-foreground mb-2 text-3xl lg:text-5xl">
            {treasuresFound} de {totalTreasures} Tesoros · {hunt.year}
          </h2>

          <p className="mb-4 text-gray-600">{getProgressMessage()}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Progreso</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="rounded-2xl bg-gray-50 p-2 text-start sm:p-4">
            <div className="text-primary text-3xl">{treasuresFound}</div>
            <div className="text-foreground text-sm">Encontrados</div>
          </div>
          <div className="rounded-2xl bg-gray-50 p-2 text-start sm:p-4">
            <div className="text-3xl text-gray-600">
              {totalTreasures - treasuresFound}
            </div>
            <div className="text-foreground text-sm">Restantes</div>
          </div>
          <div className="rounded-2xl bg-gray-50 p-2 text-start sm:p-4">
            <div className="text-primary text-3xl">
              {Math.round(completionPercentage)}%
            </div>
            <div className="text-foreground text-sm">Completado</div>
          </div>
        </div>

        {/* Dates */}
        {progress?.started_at && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Comenzaste: {formatDate(progress.started_at)}</span>
              {progress.completed_at && (
                <span>Completado: {formatDate(progress.completed_at)}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="rounded-2xl bg-white p-6">
        <h3 className="text-foreground text-txl mb-4">Logros desbloqueados</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* First Treasure Achievement */}
          <div
            className={`rounded-2xl border p-4 ${
              treasuresFound >= 1
                ? "border-primary/20 bg-primary/10"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="mb-2 flex items-start">
              <AchievementIcon kind="trophy" unlocked={treasuresFound >= 1} />
              <div>
                <h4 className="font-medium">Primer tesoro</h4>
                <p className="text-sm text-gray-600">
                  Encuentra tu primer tesoro
                </p>
              </div>
            </div>
            {treasuresFound >= 1 && (
              <div className="text-primary text-xs font-medium">
                ¡Desbloqueado!
              </div>
            )}
          </div>

          {/* Explorer Achievement */}
          <div
            className={`rounded-2xl border p-4 ${
              treasuresFound >= 5
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="mb-2 flex items-start">
              <AchievementIcon kind="compass" unlocked={treasuresFound >= 5} />
              <div>
                <h4 className="font-medium">Explorador</h4>
                <p className="text-sm text-gray-600">Encuentra 5 tesoros</p>
              </div>
            </div>
            {treasuresFound >= 5 && (
              <div className="text-xs font-medium text-blue-600">
                ¡Desbloqueado!
              </div>
            )}
          </div>

          {/* Master Explorer Achievement */}
          <div
            className={`rounded-2xl border p-4 ${
              treasuresFound >= 15
                ? "border-purple-200 bg-purple-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="mb-2 flex items-start">
              <AchievementIcon kind="medal" unlocked={treasuresFound >= 15} />
              <div>
                <h4 className="font-medium">Maestro explorador</h4>
                <p className="text-sm text-gray-600">Encuentra 15 tesoros</p>
              </div>
            </div>
            {treasuresFound >= 15 && (
              <div className="text-xs font-medium text-purple-600">
                ¡Desbloqueado!
              </div>
            )}
          </div>

          {/* Legend Achievement */}
          <div
            className={`rounded-2xl border p-4 ${
              isCompleted
                ? "border-yellow-200 bg-yellow-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="mb-2 flex items-start">
              <AchievementIcon kind="crown" unlocked={isCompleted} />
              <div>
                <h4 className="font-medium">Leyenda</h4>
                <p className="text-sm text-gray-600">
                  Completa toda la búsqueda
                </p>
              </div>
            </div>
            {isCompleted && (
              <div className="text-xs font-medium text-yellow-600">
                ¡Desbloqueado!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Treasure Map Section */}
      <div className="rounded-2xl bg-white p-6">
        <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
          <h3 className="text-foreground text-xl">
            Tesoros {hunt.year} ({allTreasures.length})
          </h3>
          <div className="text-foreground text-sm">
            {scannedTreasures.length} de {allTreasures.length} encontrados
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <div className="flex items-center">
            <TreasureStar className="mr-1.5 h-[27.6px] w-[27.6px]" />
            <span className="text-foreground text-sm">Encontrado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full">
              <HelpCircle className="h-7 w-7" strokeWidth={1.2} />
            </div>
            <span className="text-foreground text-sm">Por descubrir</span>
          </div>
        </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {allTreasures.map((treasure) => (
              <button
                key={treasure.id}
                onClick={() => {
                  setShowConfetti(false);
                  setSelectedTreasure(treasure);
                  setIsDetailOpen(true);
                }}
                className={`cursor-pointer rounded-2xl border p-4 transition-colors duration-200 ${getTreasureStatusColor(treasure)}`}
              >
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    {getTreasureIcon(treasure)}
                  </div>
                  <div className="text-sm font-medium">
                    {treasure.treasure_name}
                  </div>
                </div>
              </button>
            ))}
          </div>
      </div>

      {/* Treasure Detail Dialog */}
      <ResponsiveDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      >
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <div className="mb-4 flex items-start gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                  selectedTreasure?.isScanned
                    ? ""
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {selectedTreasure &&
                  (selectedTreasure.isScanned ? (
                    <TreasureStar className="h-14 w-14" />
                  ) : (
                    <HelpCircle className="h-8 w-8" />
                  ))}
              </div>

              <div className="flex-1 text-left">
                <ResponsiveDialogTitle className="mb-2 text-xl font-medium text-gray-900">
                  {selectedTreasure?.treasure_name}
                </ResponsiveDialogTitle>
                {isHistorical && <p className="mb-2 text-sm text-gray-500">Historial {hunt.year}</p>}

                {selectedTreasure?.isScanned ? (
                  <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary">
                    ¡Encontrado!
                  </span>
                ) : (
                  <span className="inline-block rounded-full border-1 border-gray-400 bg-gray-100 px-3 py-1 text-sm text-gray-800">
                    Por descubrir
                  </span>
                )}
              </div>
            </div>
          </ResponsiveDialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              {selectedTreasure?.isScanned ? (
                <>
                  <p className="mb-3 text-base font-medium">{isHistorical ? "Visita registrada en tu historial" : "Muestra esta palabra para recibir tu tesoro"}</p>
                  {selectedTreasure.treasure_secret && <div className="bg-primary/10 border-primary/20 rounded-2xl border px-6 py-4"><p className="text-primary text-3xl">{selectedTreasure.treasure_secret}</p></div>}
                </>
              ) : (
                <p className="mb-3 text-base font-medium">{isHistorical ? "No registraste una visita a este lugar en esta edición." : "Visita este lugar y escanea su QR para registrar tu visita."}</p>
              )}
              {selectedTreasure?.treasure_location_maps_url ? (
                <Button asChild variant="default" className="mt-4 w-full">
                  <a href={selectedTreasure.treasure_location_maps_url} target="_blank" rel="noopener noreferrer">
                    <Map className="size-4" aria-hidden="true" />
                    Ver en el mapa
                  </a>
                </Button>
              ) : <p className="mt-4 text-xs text-gray-500">Google Maps próximamente</p>}
              {selectedTreasure?.treasure_website ? (
                <Button asChild variant="outline" className="mt-3 w-full">
                  <a href={selectedTreasure.treasure_website} target="_blank" rel="noopener noreferrer">Instagram</a>
                </Button>
              ) : <p className="mt-3 text-xs text-gray-500">Instagram próximamente</p>}
            </div>
          </div>

        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </div>
  );
}
