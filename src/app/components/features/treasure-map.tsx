"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import type { TreasureHunt, Treasure } from "@/lib/treasure-hunt-2025";

interface TreasureMapProps {
  hunt: TreasureHunt;
  scannedTreasures: Treasure[];
}

interface AllTreasure extends Treasure {
  isScanned: boolean;
}

export default function TreasureMap({
  hunt,
  scannedTreasures,
}: TreasureMapProps) {
  console.log("TreasureMap component rendered with:", {
    hunt,
    scannedTreasures,
  });
  const [allTreasures, setAllTreasures] = useState<AllTreasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTreasure, setSelectedTreasure] = useState<AllTreasure | null>(
    null,
  );

  useEffect(() => {
    loadAllTreasures();
  }, [hunt.id, scannedTreasures]);

  const loadAllTreasures = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/treasure-data");
      if (!response.ok) {
        throw new Error("Error al cargar los datos del treasure hunt");
      }

      const { allTreasures } = await response.json();

      // Mark which treasures have been scanned usando los props
      const scannedIds = new Set(scannedTreasures.map((t: any) => t.id));
      console.log("Scanned treasures from props:", scannedTreasures.length);
      console.log("All treasures from API:", allTreasures.length);

      const treasuresWithStatus = allTreasures.map((treasure: any) => ({
        ...treasure,
        isScanned: scannedIds.has(treasure.id),
      }));

      console.log(
        "Treasures with status:",
        treasuresWithStatus.filter((t: any) => t.isScanned).length,
        "scanned",
      );
      setAllTreasures(treasuresWithStatus);
    } catch (error) {
      console.error("Error in loadAllTreasures:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTreasureStatusColor = (treasure: AllTreasure) => {
    if (treasure.isScanned) {
      return "bg-green-500 border-green-600 text-white";
    }
    return "bg-gray-200 border-gray-300 text-gray-600";
  };

  const getTreasureIcon = (treasure: AllTreasure) => {
    if (treasure.isScanned) {
      return "✓";
    }
    return "?";
  };

  const groupTreasuresByLocation = () => {
    // Group treasures by location or create a simple grid layout
    const groups: { [key: string]: AllTreasure[] } = {};

    allTreasures.forEach((treasure) => {
      // Extract location from treasure name or use first word
      const location = treasure.treasure_name.split(" ")[0] || "Otros";
      if (!groups[location]) {
        groups[location] = [];
      }
      groups[location].push(treasure);
    });

    return groups;
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p>Cargando mapa de tesoros...</p>
      </div>
    );
  }

  const treasureGroups = groupTreasuresByLocation();

  return (
    <div className="space-y-6">
      {/* Map Legend */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          Leyenda del Mapa
        </h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-600 bg-green-500 font-bold text-white">
              ✓
            </div>
            <span className="text-sm text-gray-600">Tesoro encontrado</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-200 font-bold text-gray-600">
              ?
            </div>
            <span className="text-sm text-gray-600">Tesoro por descubrir</span>
          </div>
        </div>
      </div>

      {/* Treasure Grid */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Todos los Tesoros ({allTreasures.length})
          </h3>
          <div className="text-sm text-gray-600">
            {scannedTreasures.length} de {allTreasures.length} encontrados
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {allTreasures.map((treasure) => (
            <button
              key={treasure.id}
              onClick={() => setSelectedTreasure(treasure)}
              className={`rounded-lg border-2 p-4 transition-all duration-200 hover:scale-105 ${getTreasureStatusColor(treasure)}`}
            >
              <div className="text-center">
                <div className="mb-2 text-2xl">{getTreasureIcon(treasure)}</div>
                <div className="text-xs font-medium">
                  {treasure.treasure_code.split("-").pop()}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Treasure Groups */}
      <div className="space-y-4">
        {Object.entries(treasureGroups).map(([location, treasures]) => (
          <div key={location} className="rounded-lg bg-white p-6 shadow-lg">
            <h4 className="mb-4 text-lg font-bold text-gray-900">
              {location} ({treasures.filter((t) => t.isScanned).length}/
              {treasures.length})
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {treasures.map((treasure) => (
                <div
                  key={treasure.id}
                  className={`rounded-lg border p-4 ${
                    treasure.isScanned
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {treasure.treasure_name}
                      </h5>
                      <p className="mt-1 text-sm text-gray-600">
                        {treasure.treasure_description}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        Código: {treasure.treasure_code}
                      </div>
                    </div>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                        treasure.isScanned
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {getTreasureIcon(treasure)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="rounded-lg bg-blue-50 p-6 text-center">
        <h4 className="mb-2 text-lg font-bold text-blue-900">
          ¡Sigue explorando!
        </h4>
        <p className="mb-4 text-blue-800">
          Te faltan {allTreasures.length - scannedTreasures.length} tesoros por
          descubrir. ¡Explora la ciudad y encuentra los códigos QR!
        </p>
        <Button
          onClick={() => (window.location.href = "/qr-scanner")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Escanear Código QR
        </Button>
      </div>

      {/* Treasure Detail Modal */}
      {selectedTreasure && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 text-center">
              <div
                className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold ${
                  selectedTreasure.isScanned
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {getTreasureIcon(selectedTreasure)}
              </div>

              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {selectedTreasure.treasure_name}
              </h3>

              {selectedTreasure.isScanned ? (
                <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                  ¡Encontrado!
                </span>
              ) : (
                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                  Por descubrir
                </span>
              )}
            </div>

            <div className="mb-6 space-y-3">
              <p className="text-gray-600">
                {selectedTreasure.treasure_description}
              </p>

              <div className="text-sm text-gray-500">
                <strong>Código:</strong> {selectedTreasure.treasure_code}
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

              {!selectedTreasure.isScanned && (
                <Button
                  onClick={() => (window.location.href = "/qr-scanner")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Ir a escanear
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
