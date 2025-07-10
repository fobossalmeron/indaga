"use client";

import React, { useMemo } from "react";
import { Content } from "@prismicio/client";
import { PlaceCard } from "./PlaceCard";
import { categories } from "./categories";
import { Category } from "@/app/components/Category";
import { GuideCategorySelect } from "./GuideCategorySelect";
import { useQueryState } from "nuqs";

interface GuideFullProps {
  lugares: Content.LugarDocument[];
}

// Generar el mapeo dinámicamente a partir de categories
const categoriaToKey: Record<string, keyof typeof categories> = Object.entries(
  categories,
).reduce(
  (acc, [key, value]) => {
    acc[value.title] = key as keyof typeof categories;
    return acc;
  },
  {} as Record<string, keyof typeof categories>,
);

export default function GuideFull({ lugares }: GuideFullProps) {
  // Obtener todas las categorías únicas presentes en los lugares
  const allCategories = useMemo(() => {
    const cats = lugares.map((lugar) => lugar.data.categoria as string);
    return [...new Set(cats.filter(Boolean))];
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
          const categoriaNombre = lugar.data.categoria as string;
          const categoriaKey = categoriaToKey[categoriaNombre];
          const categoryObj = categoriaKey
            ? categories[categoriaKey]
            : { color: "gray-400", title: categoriaNombre };
          // Type guard para saber si categoryObj tiene 'iconUrl'
          function hasIconUrl(obj: any): obj is { iconUrl: string } {
            return obj && typeof obj === "object" && "iconUrl" in obj;
          }
          const categoryIconUrl = hasIconUrl(categoryObj)
            ? categoryObj.iconUrl
            : undefined;
          return (
            <div key={lugar.id} className="flex flex-col gap-2">
              <PlaceCard
                title={lugar.data.nombre as string}
                color={categoryObj.color}
                area={lugar.data.area as string}
                mapLink={lugar.data.mapLink}
                link={lugar.data.link}
                capsuleLink={lugar.data.capsuleLink}
                category={categoriaNombre}
                categoryIconUrl={categoryIconUrl}
                description={lugar.data.description as string}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
