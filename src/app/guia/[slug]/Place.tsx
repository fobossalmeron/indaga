"use client";
import { useMemo } from "react";
import Image from "next/image";
import OffEl from "@/assets/img/off_el.svg";
import diamond from "@/assets/img/diamond.svg?url";
import { Fade } from "react-awesome-reveal";

interface PlaceProps {
  place: string;
  treasure: boolean;
  color: string;
  reverse?: boolean;
}

export function Place({ place, treasure, color, reverse }: PlaceProps) {
  const shouldRotate = useMemo(() => Math.random() < 0.5, []);

  return (
    <Fade triggerOnce>
      <div className="mb-2 flex flex-row items-center gap-4 sm:gap-6">
        {treasure ? (
          <Image src={diamond} alt="Treasure Hunt" width={26} height={26} />
        ) : (
          <OffEl
            className={`h-[20px] w-[20px] sm:h-[26px] sm:w-[26px] text-${color}`}
            style={{
              transform: reverse ? "rotate(180deg)" : "none",
            }}
          />
        )}
        <h3 className="text-xl md:text-2xl md-lg:text-3xl lg:text-4xl">{place}</h3>
      </div>
    </Fade>
  );
}
