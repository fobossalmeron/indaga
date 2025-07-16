"use client";
import { HappeningCard } from "./HappeningCard";
import { Content } from "@prismicio/client";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { useMemo } from "react";
import { CategorySelect } from "./CategorySelect";
import { EventTypeSelect } from "./EventTypeSelect";
import { useQueryState } from "nuqs";
import type { HappeningDocumentData } from "../../../prismicio-types";
import { Header } from "@/app/components/Header";
import { PromoterCTA } from "./PromoterCTA";

type HappeningCategory = NonNullable<HappeningDocumentData["category"]>;

export default function HappeningsFull({
  entries,
}: {
  entries: Content.HappeningDocument[];
}) {
  const [selectedCategory, setSelectedCategory] = useQueryState("category", {
    defaultValue: "Todas",
  });
  const [selectedEventType, setSelectedEventType] = useQueryState("eventType", {
    defaultValue: "Todas",
  });

  const categories = useMemo(() => {
    const allCategories = entries
      .map((entry) => entry.data.category)
      .filter(Boolean) as HappeningCategory[];
    return [...new Set(allCategories)];
  }, [entries]);

  const eventTypes = useMemo(() => {
    const allEventTypes = entries
      .map((entry) => entry.data.event_type)
      .filter(Boolean);
    return [...new Set(allEventTypes)] as string[];
  }, [entries]);

  const filteredEntries = entries.filter((entry) => {
    const matchesCategory =
      selectedCategory === "Todas" || entry.data.category === selectedCategory;
    const matchesEventType =
      selectedEventType === "Todas" ||
      entry.data.event_type === selectedEventType;
    return matchesCategory && matchesEventType;
  });

  return (
    <>
      <Header title="Agenda" subtitle="Tu brújula cultural">
        <PromoterCTA />
      </Header>
      <div className="animate-fadeIn2 mt-10 sm:mt-10">
        <div className="mb-8 flex w-full justify-center px-5 lg:justify-start">
          <div className="grid w-full max-w-full grid-cols-2 gap-2 sm:max-w-[500px]">
            <CategorySelect
              className="w-full"
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <EventTypeSelect
              className="w-full"
              eventTypes={eventTypes}
              selectedEventType={selectedEventType}
              onSelectEventType={setSelectedEventType}
            />
          </div>
        </div>
        <div className="relative flex w-full flex-col flex-wrap justify-center gap-8 px-5 sm:flex-row">
          {filteredEntries.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-center py-16 text-center text-gray-500">
              <span className="mb-2 text-2xl">No se encontraron eventos</span>
              <span className="text-base">
                Intenta cambiar la categoría o el tipo de evento.
              </span>
            </div>
          ) : (
            <Fade>
              {filteredEntries &&
                filteredEntries.map((entry) => (
                  <Link href={`/agenda/${entry.uid}`} key={entry.uid + "link"}>
                    <HappeningCard key={entry.uid} data={entry.data} />
                  </Link>
                ))}
            </Fade>
          )}
        </div>
      </div>
    </>
  );
}
