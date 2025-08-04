"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Check, HelpCircle } from "lucide-react";
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
      return <Check className="h-6 w-6" />;
    }
    return <HelpCircle className="h-6 w-6" />;
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
      {/* Treasure Grid */}
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">
            Todos los Tesoros ({allTreasures.length})
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

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {allTreasures.map((treasure) => (
            <button
              key={treasure.id}
              onClick={() => setSelectedTreasure(treasure)}
              className={`rounded-lg border-2 p-4 transition-all duration-200 hover:scale-105 ${getTreasureStatusColor(treasure)}`}
            >
              <div className="text-center">
                <div className="mb-2 flex justify-center">
                  {getTreasureIcon(treasure)}
                </div>
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

      {/* Treasure Detail Dialog */}
      <Dialog
        open={!!selectedTreasure}
        onOpenChange={() => setSelectedTreasure(null)}
      >
        <DialogContent className="w-full max-w-md">
          <DialogHeader className="text-center">
            <div className="mb-4">
              <div
                className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${
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

              <DialogTitle className="mb-2 text-xl font-bold text-gray-900">
                {selectedTreasure?.treasure_name}
              </DialogTitle>

              {selectedTreasure?.isScanned ? (
                <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                  ¡Encontrado!
                </span>
              ) : (
                <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">
                  Por descubrir
                </span>
              )}
            </div>
          </DialogHeader>

          <div className="mb-6 space-y-3">
            <p className="text-gray-600">
              {selectedTreasure?.treasure_description}
            </p>

            <div className="text-sm text-gray-500">
              <strong>Código:</strong> {selectedTreasure?.treasure_code}
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
