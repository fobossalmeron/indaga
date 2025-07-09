"use client";
import { HappeningCard } from "./HappeningCard";
import { Content } from "@prismicio/client";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { useMemo } from "react";
import { CategorySelect } from "./CategorySelect";
import { useQueryState } from "nuqs";

export default function HappeningsFull({
  entries,
}: {
  entries: Content.HappeningDocument[];
}) {
  const [selectedCategory, setSelectedCategory] = useQueryState("category", {
    defaultValue: "Todas",
  });

  const categories = useMemo(() => {
    const allCategories = entries.map((entry) => entry.data.category);
    return [...new Set(allCategories.filter((c) => c !== null))] as string[];
  }, [entries]);

  const filteredEntries =
    selectedCategory === "Todas"
      ? entries
      : entries.filter((entry) => entry.data.category === selectedCategory);

  return (
    <div className="animate-fadeIn2">
      <div className="mb-4 w-auto px-5">
        <CategorySelect
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
      <div className="relative mt-10 flex w-full flex-col flex-wrap justify-center gap-8 px-5 sm:mt-16 sm:flex-row">
        <Fade>
          {filteredEntries &&
            filteredEntries.map((entry) => (
              <Link href={`/agenda/${entry.uid}`} key={entry.uid + "link"}>
                <HappeningCard key={entry.uid} data={entry.data} />
              </Link>
            ))}
        </Fade>
      </div>
    </div>
  );
}
