"use client";

import React, { useState, useEffect } from "react";
import { AudioPlayer } from "react-audio-play";
import Image from "next/image";

export function TreasureLocation({
  location,
}: {
  location: { title: string; file: string };
}) {
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [hasRendered, setHasRendered] = useState(false);

  const toggleLocation = (title: string) => {
    setExpandedLocation(expandedLocation === title ? null : title);
  };

  useEffect(() => {
    if (expandedLocation === location.title && !hasRendered) {
      setHasRendered(true);
    }
  }, [expandedLocation, location.title, hasRendered]);

  return (
    <div
      key={location.title}
      className="mb-4 grid max-w-none grid-cols-[50px,84%] items-start justify-start border-b-2 border-eerie pb-2 pt-10 xsm:grid-cols-[50px,85%] sm:max-w-fit sm:grid-cols-[auto,auto] sm:pb-6 lg:pt-12"
    >
      <button
        onClick={() => toggleLocation(location.title)}
        className="hover:bg-blue-600 col-span-2 grid w-full grid-cols-subgrid items-start rounded-md text-left"
      >
        <div className="col-span-1 mr-4 flex h-[40px] w-[40px] -translate-y-4 items-center justify-center rounded-full shadow-sm md:h-[60px] md:w-[60px] lg:mr-6">
          <Image
            src={`/treasure-hunt/img/${location.file}.jpg`}
            alt={`${location.title} logo`}
            width={60}
            height={60}
            className="max-h-full max-w-full rounded-full object-contain"
          />
        </div>

        <div className="col-span-1 col-start-2 row-start-1 mb-2 flex flex-col text-3xl text-eerie transition-colors duration-300 hover:text-blue active:text-blue xsm:text-4xl sm:text-6xl md:text-7xl lg:mb-4 lg:text-8xl">
          {location.title}
        </div>
      </button>
      <div
        className={`col-span-2 col-start-1 row-start-2 overflow-hidden transition-all duration-500 ease-in-out sm:col-span-1 sm:col-start-2 ${
          expandedLocation === location.title
            ? "max-h-[800px] pb-4 pt-2 opacity-100 sm:py-0"
            : "max-h-0 opacity-0"
        }`}
      >
        {(hasRendered || expandedLocation === location.title) && (
          <AudioPlayer
            src={`/treasure-hunt/audio/${location.file}.ogg`}
            className="audio-player w-full max-w-full"
            backgroundColor="#F4F5F4"
          />
        )}
      </div>
    </div>
  );
}
