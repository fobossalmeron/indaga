"use client";

import React, { useMemo } from "react";
import { Content } from "@prismicio/client";
import { PlaceCard } from "./PlaceCard";
import { GuideCategorySelect } from "./GuideCategorySelect";
import { useQueryState } from "nuqs";
import type { LugarDocumentData } from "../../../prismicio-types";

type LugarCategoria = NonNullable<LugarDocumentData["categoria"]>;

interface GuideFullProps {
  lugares: Content.LugarDocument[];
}

export default function GuideFull({ lugares }: GuideFullProps) {
  // Obtener todas las categorías únicas presentes en los lugares
  const allCategories = useMemo(() => {
    const cats = lugares
      .map((lugar) => lugar.data.categoria)
      .filter(Boolean) as LugarCategoria[];
    return [...new Set(cats)];
  }, [lugares]);

  const [selectedCategory, setSelectedCategory] = useQueryState("category", {
    defaultValue: "Todas",
  });

  // Filtrar lugares según la categoría seleccionada
  const filteredLugares = useMemo(() => {
    if (selectedCategory === "Todas") return lugares;
    return lugares.filter(
      (lugar) => (lugar.data.categoria as string) === selectedCategory,
    );
  }, [lugares, selectedCategory]);

  return (
    <div className="animate-fadeIn2 mt-10 p-5 sm:mt-5">
      <div className="mb-8 flex w-full justify-center lg:justify-start">
        <div className="grid w-full max-w-full grid-cols-2 gap-2 sm:max-w-[500px]">
          <GuideCategorySelect
            className="w-full"
            categories={allCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredLugares.map((lugar) => {
          return (
            <div key={lugar.id} className="flex flex-col gap-2">
              <PlaceCard
                title={lugar.data.nombre as string}
                area={lugar.data.area as string}
                mapLink={lugar.data.mapLink}
                link={lugar.data.link}
                capsuleLink={lugar.data.capsuleLink}
                category={lugar.data.categoria as string}
                description={lugar.data.description as string}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
