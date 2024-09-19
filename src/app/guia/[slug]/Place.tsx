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
    <Fade>
      <div className="mb-2 flex flex-row items-center gap-6">
        {treasure ? (
          <Image src={diamond} alt="Treasure Hunt" width={26} height={26} />
        ) : (
          <OffEl
            className={`h-[26px] w-[26px] text-${color}`}
            style={{
              transform: reverse ? "rotate(180deg)" : "none",
            }}
          />
        )}
        <p className="text-4xl">{place}</p>
      </div>
    </Fade>
  );
}
