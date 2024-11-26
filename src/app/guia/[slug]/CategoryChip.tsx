"use client";

import { categories } from "../categories";

export function CategoryChip({ slug, className }: { slug: string; className?: string }) {
  const category = categories[slug as keyof typeof categories];

  return (
    <div id="category-chip" className={`flex flex-col items-start w-full gap-10 ${className || ''}`}>
      <div
        className={`flex items-center gap-2 rounded-full bg-${category.color} animate-fadeIn py-2 pl-4 pr-6 lg:py-3 lg:pl-5 lg:pr-8`}
      >
        <div className="flex h-10 w-10 items-center justify-center [&>*]:h-full [&>*]:w-auto">
          {category.image}
        </div>
        <h2 className="text-xl lg:text-2xl text-white">{category.title}</h2>
      </div>
    </div>
  );
}
