import React from "react";
import Image from "next/image";
import { CloudCTA } from "./CloudCTA";
import { Portal } from "./Portal";
import { categories } from "./categories";
import guia_blob from "@/assets/img/guia_blob.svg?url";

const rotations = [
  "-rotate-[8deg]",
  "rotate-12 bottom-20 left-10",
  "-rotate-[4deg]",
  "rotate-12 md-lg:-top-40 -top-20",
  "-rotate-[20deg] top-20 -left-10",
  "rotate-12 top-10",
];

export default function GuideAll() {
  return (
    <div className="flex flex-col w-full justify-center items-center animate-fadeIn2 px-5">
      <CloudCTA full />
      <div className="mt-32 grid max-w-[760px] grid-cols-3 gap-x-[2%] md-lg:gap-x-[12%] gap-y-4 py-24">
        {Object.entries(categories).map(([slug, category], index) => (
          <React.Fragment key={slug}>
            {index === 3 && (
              <div className="relative right-[25%] md-lg:right-[12%] col-span-3 flex items-center justify-end">
                <Image
                  src={guia_blob}
                  alt="Guía Blob"
                  width={368}
                  height={204}
                  className="max-w-[200px] md:max-w-[300px] md-lg:max-w-[368px]"
                />
              </div>
            )}
            <Portal
              title={category.title}
              slug={slug}
              src={category.bgImage}
              color={category.color}
              width={slug === "musica-en-vivo" ? 77 : undefined}
              className={`relative ${rotations[index % rotations.length]}`}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
