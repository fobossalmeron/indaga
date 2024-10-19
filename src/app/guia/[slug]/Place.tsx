"use client";
import Image from "next/image";
import OffEl from "@/assets/img/off_el.svg";
import diamond from "@/assets/img/diamond.svg?url";
import { Fade } from "react-awesome-reveal";
import { PrismicNextLink } from "@prismicio/next";
import { LinkField } from "@prismicio/client";

interface PlaceProps {
  place: string;
  treasure: boolean;
  color: string;
  reverse?: boolean;
  link?: LinkField;
}

export function Place({ place, treasure, color, reverse, link }: PlaceProps) {
  const content = (
    <>
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
      <h3
        className={`text-xl transition-colors duration-300 md:text-2xl md-lg:text-3xl lg:text-4xl ${link ? `hover:text-${color} active:text-${color}` : ""}`}
      >
        {place}
      </h3>
    </>
  );

  return (
    <Fade triggerOnce>
      <div className="mb-2 flex flex-row items-center gap-4 sm:gap-6">
        {link ? (
          <PrismicNextLink
            target="_blank"
            field={link}
            className="flex flex-row items-center gap-4 sm:gap-6"
          >
            {content}
          </PrismicNextLink>
        ) : (
          content
        )}
      </div>
    </Fade>
  );
}
