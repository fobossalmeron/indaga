import React from "react";
import { Portal } from "./Portal";
import { categories } from "./categories";

const rotations = [
  "-rotate-[6deg]",
  "rotate-6", 
  "-rotate-[4deg]",
  "rotate-6",
  "-rotate-[6deg]",
  "rotate-6",
  "-rotate-[4deg]",
];

export default function GuideAll() {
  return (
    <div className="flex w-full animate-fadeIn2 flex-col items-center justify-center px-0 text-blue mt-10 sm:mt-20">
      <div className="flex w-full flex-wrap justify-center gap-y-10 md:gap-y-20 md:pb-36 lg:pb-28">
        {Object.entries(categories).map(([slug, category], index) => (
          <div key={slug} className="w-1/4 flex justify-center">
            <Portal
              title={category.title}
              slug={slug}
              image={category.image}
              color={category.color}
              className={`relative w-full`}
              rotation={rotations[index]}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
