"use client";

import React from "react";
import { categories } from "./categories";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";

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
    <div className="animate-fadeIn2">
      <div className="mt-10 flex w-full flex-wrap justify-center gap-y-10 sm:mt-20 md:gap-y-20 md:pb-36 lg:pb-28">
        {Object.entries(categories).map(([slug, category], index) => (
          <div key={slug} className="flex w-1/4 items-center justify-center">
            <Fade>
              <Link href={`/guia/${slug}`}>
                <div
                  className={`flex flex-col items-center text-${category.color} group w-full`}
                >
                  <div className="grid h-[140px] place-items-center md:h-[200px] md-lg:h-[385px]">
                    <svg
                      viewBox="0 0 150 275"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="col-start-1 row-start-1 h-full w-auto overflow-visible"
                    >
                      <path
                        d="M3.5 74.9911V271.5H146.5V74.9911C146.5 35.5082 114.489 3.5 75 3.5C35.5114 3.5 3.5 35.5082 3.5 74.9911Z"
                        fill="currentColor"
                        className="origin-center transition-all duration-300 group-hover:scale-105 group-active:scale-105"
                      />
                    </svg>
                    <div className="relative col-start-1 row-start-1 flex h-full w-full items-end justify-center">
                      <div
                        className={`transition-rotate w-full duration-200 group-hover:${rotations[index]} group-active:${rotations[index]}`}
                      >
                        <Fade delay={200}>
                          {category.image && category.image}
                        </Fade>
                      </div>
                    </div>
                  </div>
                  <h2 className="sr-only">{category.title}</h2>
                </div>
              </Link>
            </Fade>
          </div>
        ))}
      </div>
    </div>
  );
}
