"use client";
import { Fade } from "react-awesome-reveal";
import { PrismicNextLink } from "@prismicio/next";
import { LinkField, isFilled } from "@prismicio/client";
import { Button } from "@/app/components/ui/button";
import { Category } from "@/app/components/Category";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface PlaceCardProps {
  title: string;
  area: string;
  mapLink: any;
  link: any;
  capsuleLink: any;
  category: string;
  description: string;
}

const categoryToIcon: Record<string, string> = {
  Cafeterías: "/categories/cafeterias.svg",
  "Bares & Cantinas": "/categories/bares.svg",
  "Música en Vivo": "/categories/musica.svg",
  "Monumentos Históricos": "/categories/monumentos.svg",
  Restaurantes: "/categories/restaurantes.svg",
  Parques: "/categories/parques.svg",
  "Espacios de Arte": "/categories/arte.svg",
};

export function PlaceCard({
  title,
  area,
  mapLink,
  link,
  capsuleLink,
  category,
  description,
}: PlaceCardProps) {
  const iconPath = categoryToIcon[category] || "/categories/default.svg";

  return (
    <Fade triggerOnce>
      <div className="relative flex flex-col items-start gap-1 overflow-hidden rounded-2xl bg-white p-4">
        <Category category={category} />
        <div className="mt-2 flex w-full flex-row items-start">
          <h2
            className="flex w-auto items-center gap-1 text-2xl leading-tight sm:[display:-webkit-box] sm:max-w-full sm:overflow-hidden sm:[-webkit-box-orient:vertical] sm:[-webkit-line-clamp:2]"
            title={title ?? "Error en título"}
          >
            {title ?? "Error en título"}
          </h2>
          {isFilled.link(link) && (
            <PrismicNextLink
              field={link}
              target="_blank"
              className="ml-1"
              aria-label="Abrir enlace externo"
            >
              <ExternalLink className="mt-2 ml-1 h-4 w-4 align-text-top" />
            </PrismicNextLink>
          )}
        </div>
        {description && (
          <div className="flex w-full flex-row items-center gap-3 pt-0 text-base">
            {description}
          </div>
        )}
        {isFilled.link(mapLink) ? (
          <PrismicNextLink
            field={mapLink}
            target="_blank"
            className="md-lg:text-base text-primary text-base hover:underline focus:underline"
          >
            @{area}
          </PrismicNextLink>
        ) : (
          <span className="md-lg:text-base text-base">@{area}</span>
        )}
        {isFilled.link(capsuleLink) && (
          <PrismicNextLink
            field={capsuleLink}
            target="_blank"
            className="mt-2 flex w-full flex-row items-start"
          >
            <Button size="sm" className="w-fit">
              Ver cápsula
            </Button>
          </PrismicNextLink>
        )}
        <div className="absolute right-5 bottom-0 flex justify-center">
          <Image src={iconPath} alt={category} width={51} height={94} />
        </div>
      </div>
    </Fade>
  );
}
