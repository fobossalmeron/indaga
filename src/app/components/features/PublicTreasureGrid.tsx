"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { HelpCircle, Map } from "lucide-react";

interface PublicTreasure {
  id: string;
  treasure_code: string;
  treasure_name: string;
  treasure_location_maps_url: string | null;
}

interface PublicTreasureGridProps {
  treasures: PublicTreasure[];
}

export default function PublicTreasureGrid({
  treasures,
}: PublicTreasureGridProps) {
  const [selectedTreasure, setSelectedTreasure] =
    useState<PublicTreasure | null>(null);

  return (
    <>
      <div className="mt-12 space-y-6">
        <div className="text-center">
          <h3 className="text-foreground text-2xl font-medium">
            Ubicaciones del Treasure Hunt
          </h3>
          <p className="mt-2 text-gray-600">
            {treasures.length} tesoros esperando ser descubiertos
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {treasures.map((treasure) => (
            <button
              key={treasure.id}
              onClick={() => setSelectedTreasure(treasure)}
              className="cursor-pointer rounded-lg border-2 border-gray-300 bg-gray-200 p-4 text-gray-600 transition-all duration-200 hover:scale-105"
            >
              <div className="text-center">
                <div className="mb-2 flex justify-center">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div className="text-xs font-medium">
                  {treasure.treasure_name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Treasure Detail Dialog */}
      <Dialog
        open={!!selectedTreasure}
        onOpenChange={() => setSelectedTreasure(null)}
      >
        <DialogContent className="w-full !max-w-[400px] rounded-3xl">
          <DialogHeader>
            <div className="mb-4 flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                <HelpCircle className="h-8 w-8" />
              </div>

              <div className="flex-1 text-left">
                <DialogTitle className="mb-2 text-xl font-medium text-gray-900">
                  {selectedTreasure?.treasure_name}
                </DialogTitle>

                <span className="inline-block rounded-full border-1 border-gray-400 bg-gray-100 px-3 py-1 text-sm text-gray-800">
                  Por descubrir
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="mb-6 space-y-4">
            <div className="text-center">
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
    </>
  );
}
