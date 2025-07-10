"use client";
import { Fade } from "react-awesome-reveal";
import { PrismicNextLink } from "@prismicio/next";
import { LinkField, isFilled } from "@prismicio/client";
import { Button } from "@/app/components/ui/button";
import MapIcon from "@/assets/img/map.svg";
import GlobeIcon from "@/assets/img/globe.svg";
import { Category } from "@/app/components/Category";

interface PlaceProps {
  title: string;
  color: string;
  area: string;
  category: string;
  mapLink?: LinkField;
  link?: LinkField;
  capsuleLink?: LinkField;
}

export function PlaceCard({
  title,
  color,
  mapLink,
  link,
  area,
  capsuleLink,
  category,
}: PlaceProps) {
  return (
    <Fade triggerOnce>
      <div className="mb-2 flex flex-col items-start rounded-2xl bg-white p-4">
        <Category category={category} />
        <h2
          className="pt-2 text-2xl leading-tight sm:[display:-webkit-box] sm:max-w-full sm:overflow-hidden sm:[-webkit-box-orient:vertical] sm:[-webkit-line-clamp:2]"
          title={title ?? "Error en título"}
        >
          {title ?? "Error en título"}
        </h2>
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
              <Button
                variant="outline"
                size="thin"
                className="w-full min-w-[137px]"
              >
                Ver cápsula
              </Button>
            </PrismicNextLink>
          )}
        </div>
        <span className="md-lg:text-xl text-base">{area}</span>
      </div>
    </Fade>
  );
}
