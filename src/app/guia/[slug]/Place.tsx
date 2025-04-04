"use client";
import { Fade } from "react-awesome-reveal";
import { PrismicNextLink } from "@prismicio/next";
import { LinkField, isFilled } from "@prismicio/client";
import { Button } from "@/app/components/Button";
import MapIcon from "@/assets/img/map.svg";
import GlobeIcon from "@/assets/img/globe.svg";
interface PlaceProps {
  place: string;
  color: string;
  area: string;
  mapLink?: LinkField;
  link?: LinkField;
  capsuleLink?: LinkField;
}

export function Place({
  place,
  color,
  mapLink,
  link,
  area,
  capsuleLink,
}: PlaceProps) {
  return (
    <Fade triggerOnce>
      <div className="mb-2 flex flex-col items-start rounded-2xl bg-white p-4">
        <span className="md-lg:text-xl text-base">{area}</span>
        <h3 className="text-2xl transition-colors duration-300 sm:text-3xl lg:text-5xl">
          {place}
        </h3>
        <div className="flex w-full flex-row items-center gap-3 pt-5">
          {isFilled.link(mapLink) && (
            <PrismicNextLink
              field={mapLink}
              target="_blank"
              className={`flex flex-row items-center rounded-full p-2 bg-${color} transition-opacity duration-300 hover:opacity-80 active:opacity-80`}
            >
              <MapIcon className="h-8 w-8" />
            </PrismicNextLink>
          )}
          {isFilled.link(link) && (
            <PrismicNextLink
              field={link}
              target="_blank"
              className="bg-eerie flex flex-row items-center rounded-full p-2 transition-opacity duration-300 hover:opacity-80 active:opacity-80"
            >
              <GlobeIcon className="h-8 w-8 translate-x-[1px]" />
            </PrismicNextLink>
          )}
          {isFilled.link(capsuleLink) && (
            <PrismicNextLink
              field={capsuleLink}
              target="_blank"
              className="flex w-full flex-row items-start"
            >
              <Button secondary thin className="w-full min-w-[137px]">
                Ver cápsula
              </Button>
            </PrismicNextLink>
          )}
        </div>
      </div>
    </Fade>
  );
}
