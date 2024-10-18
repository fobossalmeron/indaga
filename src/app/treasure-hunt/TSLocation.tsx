"use client";

import React, { useState, useEffect } from "react";
import { AudioPlayer } from "react-audio-play";
import Image from "next/image";

export function TSLocation({
  location,
}: {
  location: { title: string; audioSrc: string; logoSrc: string };
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
      className={`mb-4 max-w-fit items-start justify-start border-b-2 border-eerie pb-6 pt-12`}
    >
      <button
        onClick={() => toggleLocation(location.title)}
        className="hover:bg-blue-600 flex w-full items-start rounded-md text-left"
      >
        <div className="mr-6 flex h-[60px] w-[60px] -translate-y-4 items-center justify-center rounded-full bg-blue">
          <Image
            src={location.logoSrc}
            alt={`${location.title} logo`}
            width={60}
            height={60}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div className="mb-4 flex flex-col text-8xl text-eerie">
          {location.title}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expandedLocation === location.title
            ? "max-h-[800px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        {(hasRendered || expandedLocation === location.title) && (
          <AudioPlayer
            src={location.audioSrc}
            style={{ width: "100%" }}
            className="audio-player max-w-full"
            backgroundColor="#F4F5F4"
          />
        )}
      </div>
    </div>
  );
}
