"use client";

import { Fragment } from "react";
import { PlaceCard } from "@/app/(website)/guia/PlaceCard";
import Blob from "@/assets/img/blob_happening.svg";

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
  year: number;
}

export default function PublicTreasureGrid({
  treasures, year,
}: PublicTreasureGridProps) {
  return (
    <div className="animate-fadeIn3 mt-12 space-y-6">
      <div className="text-left md:text-center">
        <h3 className="text-foreground text-xl font-medium md:text-2xl">
          Ubicaciones participantes
        </h3>
        <p className="mt-2 text-gray-600">
          {treasures.length} lugares · Edición {year}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {treasures.map((treasure, index) => (
          <Fragment key={treasure.id}>
            {index === 3 && (
              <Blob className="align-self-end mb-4 block h-20 w-auto justify-self-end lg:hidden" />
            )}
            <PlaceCard
              title={treasure.treasure_name}
              mapLink={treasure.treasure_location_maps_url ? { link_type: "Web", url: treasure.treasure_location_maps_url } : undefined}
              link={treasure.treasure_website ? { link_type: "Web", url: treasure.treasure_website } : undefined}
              category={treasure.treasure_category || undefined}
              className="border-2 border-transparent"
              grayscale={true}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
