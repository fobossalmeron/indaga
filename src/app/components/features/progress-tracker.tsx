"use client";

import { Button } from "@/app/components/ui/button";
import type {
  TreasureHunt,
  TreasureProgress,
  Treasure,
} from "@/lib/treasure-hunt-2025";

interface ProgressTrackerProps {
  hunt: TreasureHunt;
  progress: TreasureProgress | null;
  scannedTreasures: Treasure[];
  onRefresh?: () => void;
}

export default function ProgressTracker({
  hunt,
  progress,
  scannedTreasures,
  onRefresh,
}: ProgressTrackerProps) {
  // Usar el conteo real de tesoros escaneados en lugar del campo progress
  const treasuresFound = scannedTreasures.length;
  const totalTreasures = hunt.total_treasures || 25;
  const completionPercentage = (treasuresFound / totalTreasures) * 100;
  const isCompleted = completionPercentage >= 100;

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
    if (treasuresFound === 0) return "Explorador Novato";
    if (treasuresFound < 5) return "Cazador de Tesoros";
    if (treasuresFound < 15) return "Aventurero Experimentado";
    if (treasuresFound < 20) return "Maestro Explorador";
    if (isCompleted) return "Leyenda de INDAGA";
    return "Gran Aventurero";
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
    </div>
  );
}
