"use client";

import { useState } from "react";
import { PlaceCard } from "@/app/(website)/guia/PlaceCard";
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
  treasure_website: string | null;
  treasure_category: string | null;
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
      <div className="animate-fadeIn3 mt-12 space-y-6">
        <div className="text-center">
          <h3 className="text-foreground text-2xl font-medium">
            Ubicaciones del Treasure Hunt
          </h3>
          <p className="mt-2 text-gray-600">
            {treasures.length} tesoros esperando ser descubiertos
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {treasures.map((treasure) => (
            <div
              key={treasure.id}
              onClick={() => setSelectedTreasure(treasure)}
              className="cursor-pointer"
            >
              <PlaceCard
                title={treasure.treasure_name}
                mapLink={{ url: treasure.treasure_location_maps_url }}
                link={{ url: treasure.treasure_website }}
                category={treasure.treasure_category || undefined}
                className="active:border-primary hover:border-primary border-2 border-transparent transition-colors"
                grayscale={true}
              />
            </div>
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
                className="border-primary/20 bg-primary/5 hover:bg-primary/10 mx-auto block rounded-lg border-2 px-6 py-4 transition-colors"
              >
                <Map className="text-primary mx-auto mb-2 h-8 w-8" />
                <div className="text-primary text-sm font-medium">
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
