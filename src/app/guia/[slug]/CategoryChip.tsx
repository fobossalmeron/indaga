"use client";

import { categories } from "../categories";

export function CategoryChip({ slug }: { slug: string }) {
  const category = categories[slug as keyof typeof categories];

  return (
    <div id="category-chip" className="flex flex-col items-start w-full p-6 pt-0 gap-10">
      <div
        className={`flex items-center gap-2 rounded-full bg-${category.color} animate-fadeIn py-3 pl-5 pr-8`}
      >
        <div className="flex h-10 w-10 items-center justify-center [&>*]:h-full [&>*]:w-auto">
          {category.image}
        </div>
        <h2 className="text-2xl text-white">{category.title}</h2>
      </div>
      </div>
  );
}
