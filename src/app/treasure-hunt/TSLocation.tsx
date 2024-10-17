"use client";

import React, { useState } from "react";
import { AudioPlayer } from "react-audio-play";
import Image from "next/image";

export function TSLocation({
  location,
}: {
  location: { title: string; audioSrc: string; logoSrc: string };
}) {
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);

  const toggleLocation = (title: string) => {
    setExpandedLocation(expandedLocation === title ? null : title);
  };

  return (
    <div
      key={location.title}
      className="mb-4 max-w-fit border-b-2 border-eerie items-start justify-start"
    >
      <button
        onClick={() => toggleLocation(location.title)}
        className="hover:bg-blue-600 flex w-full items-center rounded-md px-4 py-12 text-left transition-all"
      >
        <div className="mr-6 flex h-[60px] w-[60px] -translate-y-7 items-center justify-center rounded-full bg-blue">
          <Image
            src={location.logoSrc}
            alt={`${location.title} logo`}
            width={60}
            height={60}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="flex flex-col text-8xl text-eerie">
          {" "}
          {location.title}
          {expandedLocation === location.title && (
            <div className="mt-2 rounded-md bg-gray-100 p-4">
              <AudioPlayer
                src={location.audioSrc}
                style={{ width: "100%" }}
                className="audio-player max-w-full"
                backgroundColor="#F4F5F4"
              />
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
