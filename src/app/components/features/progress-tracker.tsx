"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Check, HelpCircle, Loader2, Map } from "lucide-react";
import type {
  TreasureHunt,
  TreasureProgress,
  Treasure,
} from "@/lib/treasure-hunt-2025";

interface AllTreasure extends Treasure {
  isScanned: boolean;
}

interface ProgressTrackerProps {
  hunt: TreasureHunt;
  progress: TreasureProgress | null;
  scannedTreasures: Treasure[];
  onRefresh?: () => void;
  scannedCode?: string | null;
}

export default function ProgressTracker({
  hunt,
  progress,
  scannedTreasures,
  onRefresh,
  scannedCode,
}: ProgressTrackerProps) {
  const [allTreasures, setAllTreasures] = useState<AllTreasure[]>([]);
  const [loadingTreasures, setLoadingTreasures] = useState(false);
  const [selectedTreasure, setSelectedTreasure] = useState<AllTreasure | null>(
    null,
  );

  // Usar el conteo real de tesoros escaneados en lugar del campo progress
  const treasuresFound = scannedTreasures.length;
  const totalTreasures = hunt.total_treasures || 25;
  const completionPercentage = (treasuresFound / totalTreasures) * 100;
  const isCompleted = completionPercentage >= 100;

  useEffect(() => {
    loadAllTreasures();
  }, [hunt.id, scannedTreasures, scannedCode]);

  const loadAllTreasures = async () => {
    setLoadingTreasures(true);
    try {
      const response = await fetch("/api/treasure-data");
      if (!response.ok) {
        throw new Error("Error al cargar los datos del treasure hunt");
      }

      const { allTreasures } = await response.json();

      // Mark which treasures have been scanned usando los props
      const scannedIds = new Set(scannedTreasures.map((t: any) => t.id));

      const treasuresWithStatus = allTreasures.map((treasure: any) => ({
        ...treasure,
        isScanned: scannedIds.has(treasure.id),
      }));

      setAllTreasures(treasuresWithStatus);
    } catch (error) {
      console.error("Error in loadAllTreasures:", error);
    } finally {
      setLoadingTreasures(false);
    }
  };

  useEffect(() => {
    if (scannedCode && allTreasures.length > 0) {
      const treasure = allTreasures.find(
        (t) => t.treasure_code === scannedCode,
      );
      if (treasure) {
        setSelectedTreasure(treasure);
      }
    }
  }, [scannedCode, allTreasures]);

  const getTreasureStatusColor = (treasure: AllTreasure) => {
    if (treasure.isScanned) {
      return "bg-green-500 border-green-600 text-white";
    }
    return "bg-gray-200 border-gray-300 text-gray-600";
  };

  const getTreasureIcon = (treasure: AllTreasure) => {
    if (treasure.isScanned) {
      return <Check className="h-6 w-6" />;
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
    if (isCompleted) {
      return "¡Felicidades! Has completado la búsqueda del tesoro";
    }
    if (treasuresFound === 0) {
      return "Comienza tu aventura escaneando tu primer tesoro";
    }
    if (treasuresFound < 5) {
      return "¡Buen comienzo! Sigue explorando la ciudad";
    }
    if (treasuresFound < 15) {
      return "¡Vas muy bien! Ya eres todo un explorador";
    }
    return "¡Excelente! Estás muy cerca de completar la búsqueda";
  };

  const getAchievementLevel = () => {
    if (treasuresFound === 0) return "Exploradorx Novatx";
    if (treasuresFound < 5) return "Cazadorx de Tesoros";
    if (treasuresFound < 15) return "Aventurerx Experimentadx";
    if (treasuresFound < 20) return "Maestrx Exploradorx";
    if (isCompleted) return "Leyenda de INDAGA";
    return "Gran Aventurerx";
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="rounded-lg bg-white p-4 shadow-lg">
        <div className="mb-6 text-center">
          <div
            className={`mb-4 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              isCompleted
                ? "bg-green-100 text-green-800"
                : "text-primary bg-primary/10"
            }`}
          >
            {getAchievementLevel()}
          </div>

          <h2 className="text-foreground mb-2 text-3xl">
            {treasuresFound} de {totalTreasures} Tesoros
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
              className={`h-3 rounded-full transition-all duration-500 ease-out ${
                isCompleted ? "bg-green-500" : "bg-primary"
              }`}
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
          <div className="rounded-lg bg-gray-50 p-2 text-start sm:p-4">
            <div className="text-primary text-3xl">{treasuresFound}</div>
            <div className="text-foreground text-sm">Encontrados</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 text-start sm:p-4">
            <div className="text-3xl text-gray-600">
              {totalTreasures - treasuresFound}
            </div>
            <div className="text-foreground text-sm">Restantes</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 text-start sm:p-4">
            <div className="text-3xl text-green-600">
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
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="text-foreground text-txl mb-4">Logros desbloqueados</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* First Treasure Achievement */}
          <div
            className={`rounded-lg border-2 p-4 ${
              treasuresFound >= 1
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="mb-2 flex items-center">
              <span
                className={`mr-3 text-2xl ${treasuresFound >= 1 ? "" : "grayscale"}`}
              >
                🏆
              </span>
              <div>
                <h4 className="font-medium">Primer tesoro</h4>
                <p className="text-sm text-gray-600">
                  Encuentra tu primer tesoro
                </p>
              </div>
            </div>
            {treasuresFound >= 1 && (
              <div className="text-xs font-medium text-green-600">
                ¡Desbloqueado!
              </div>
            )}
          </div>

          {/* Explorer Achievement */}
          <div
            className={`rounded-lg border-2 p-4 ${
              treasuresFound >= 5
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="mb-2 flex items-center">
              <span
                className={`mr-3 text-2xl ${treasuresFound >= 5 ? "" : "grayscale"}`}
              >
                🧭
              </span>
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
            className={`rounded-lg border-2 p-4 ${
              treasuresFound >= 15
                ? "border-purple-200 bg-purple-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="mb-2 flex items-center">
              <span
                className={`mr-3 text-2xl ${treasuresFound >= 15 ? "" : "grayscale"}`}
              >
                🎖️
              </span>
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
            className={`rounded-lg border-2 p-4 ${
              isCompleted
                ? "border-yellow-200 bg-yellow-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="mb-2 flex items-center">
              <span
                className={`mr-3 text-2xl ${isCompleted ? "" : "grayscale"}`}
              >
                👑
              </span>
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
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
          <h3 className="text-foreground text-xl">
            Todos los tesoros ({allTreasures.length})
          </h3>
          <div className="text-foreground text-sm">
            {scannedTreasures.length} de {allTreasures.length} encontrados
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <div className="flex items-center">
            <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full border-1 border-green-600 bg-green-500 text-white">
              <Check className="h-4 w-4" />
            </div>
            <span className="text-foreground text-sm">Encontrado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full">
              <HelpCircle className="h-7 w-7" strokeWidth={1.2} />
            </div>
            <span className="text-foreground text-sm">Por descubrir</span>
          </div>
        </div>

        {loadingTreasures ? (
          <div className="py-8 text-center">
            <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
            <p>Cargando tesoros...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {allTreasures.map((treasure) => (
              <button
                key={treasure.id}
                onClick={() => setSelectedTreasure(treasure)}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:scale-105 ${getTreasureStatusColor(treasure)}`}
              >
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    {getTreasureIcon(treasure)}
                  </div>
                  <div className="text-xs font-medium">
                    {treasure.treasure_name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Treasure Detail Dialog */}
      <Dialog
        open={!!selectedTreasure}
        onOpenChange={() => setSelectedTreasure(null)}
      >
        <DialogContent className="w-full !max-w-[400px] rounded-3xl">
          <DialogHeader>
            <div className="mb-4 flex items-start gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  selectedTreasure?.isScanned
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {selectedTreasure &&
                  (selectedTreasure.isScanned ? (
                    <Check className="h-8 w-8" />
                  ) : (
                    <HelpCircle className="h-8 w-8" />
                  ))}
              </div>

              <div className="flex-1 text-left">
                <DialogTitle className="mb-2 text-xl font-medium text-gray-900">
                  {selectedTreasure?.treasure_name}
                </DialogTitle>

                {selectedTreasure?.isScanned ? (
                  <span className="inline-block rounded-full border-1 border-green-500 bg-green-100 px-3 py-1 text-sm text-green-800">
                    ¡Encontrado!
                  </span>
                ) : (
                  <span className="inline-block rounded-full border-1 border-gray-400 bg-gray-100 px-3 py-1 text-sm text-gray-800">
                    Por descubrir
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="mb-6 space-y-4">
            <div className="text-center">
              {selectedTreasure?.isScanned ? (
                <>
                  <div className="mb-2 text-sm font-medium text-gray-600">
                    Palabra secreta:
                  </div>
                  <div className="bg-primary/10 border-primary/20 mx-auto rounded-lg border-2 px-6 py-4">
                    <div className="text-primary text-3xl font-medium tracking-wider">
                      {selectedTreasure?.treasure_secret}
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Muestra esta palabra para recibir tu tesoro
                  </p>
                </>
              ) : (
                <>
                  <a
                    href={selectedTreasure?.treasure_location_maps_url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-auto block rounded-lg border-2 border-blue-200 bg-blue-50 px-6 py-4 transition-colors hover:bg-blue-100"
                  >
                    <Map className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                    <div className="text-sm font-medium text-blue-600">
                      Ver en el mapa
                    </div>
                  </a>
                  <p className="mt-3 text-xs text-gray-500">
                    Encuentra este lugar y escanea el QR para revelar la palabra
                    secreta
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setSelectedTreasure(null)}
              variant="outline"
              className="flex-1"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
