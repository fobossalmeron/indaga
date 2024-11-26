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
    <div className="flex w-full animate-fadeIn2 flex-col items-center justify-center px-0 text-blue mt-16">
      <div className="grid w-full grid-cols-4 gap-0 md:gap-y-20 md:pb-36 lg:pb-60 place-items-center">
        {Object.entries(categories).map(([slug, category], index) => (
          <React.Fragment key={slug}>
            <Portal
              title={category.title}
              slug={slug}
              image={category.image}
              color={category.color}
              className={`relative w-full`}
              rotation={rotations[index]}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
