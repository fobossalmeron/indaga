"use client";
import { Fade } from "react-awesome-reveal";
import { PrismicNextLink } from "@prismicio/next";
import { isFilled } from "@prismicio/client";
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
  Cafeterías: "cafeterias.svg",
  "Bares & Cantinas": "bares.svg",
  "Música en Vivo": "musica.svg",
  "Monumentos Históricos": "monumentos.svg",
  Restaurantes: "restaurantes.svg",
  Parques: "parques.svg",
  "Espacios de Arte": "arte.svg",
};

// Helper para separar la última palabra del título
function splitTitle(title: string) {
  const words = title.trim().split(" ");
  if (words.length === 1) return [title, ""];
  const lastWord = words.pop();
  return [words.join(" "), lastWord];
}

export function PlaceCard({
  title,
  area,
  mapLink,
  link,
  capsuleLink,
  category,
  description,
}: PlaceCardProps) {
  const isCardLinked = isFilled.link(link);
  const [titleStart, titleEnd] = splitTitle(title ?? "Error en título");

  return (
    <Fade triggerOnce>
      <div className="relative flex flex-col items-start gap-0 overflow-hidden rounded-2xl bg-white p-2">
        <Category category={category} className="mt-2 ml-2" />
        <div className="mt-1 flex w-full flex-row items-start pr-16">
          {isCardLinked ? (
            <PrismicNextLink
              field={link}
              target="_blank"
              className="hover:bg-accent/20 hover:text-accent active:bg-accent/20 active:text-accent w-fit rounded-lg p-2 py-1 transition-colors"
              title={title ?? "Error en título"}
              aria-label={title ?? "Enlace externo"}
            >
              <h2 className="w-fit text-2xl leading-tight">
                {titleStart}{" "}
                <span className="whitespace-nowrap">
                  {titleEnd}
                  <ExternalLink
                    className="ml-2 inline h-4 w-4 align-middle opacity-60"
                    aria-label="Enlace externo"
                  />
                </span>
              </h2>
            </PrismicNextLink>
          ) : (
            <h2
              className="w-full p-2 py-1 pr-16 text-2xl leading-tight sm:max-w-full sm:overflow-hidden"
              title={title ?? "Error en título"}
            >
              {title ?? "Error en título"}
            </h2>
          )}
        </div>
        {description && (
          <div className="flex w-full flex-row items-center gap-3 pt-0 pl-2 text-base">
            {description}
          </div>
        )}
        {area &&
          (isFilled.link(mapLink) ? (
            <PrismicNextLink
              field={mapLink}
              target="_blank"
              className="md-lg:text-base text-primary hover:bg-accent/20 active:bg-accent/20 rounded-lg p-2 py-1 text-base transition-colors active:underline"
            >
              @{area}
            </PrismicNextLink>
          ) : (
            <span className="md-lg:text-base text-base">@{area}</span>
          ))}
        {isFilled.link(capsuleLink) && (
          <PrismicNextLink
            field={capsuleLink}
            target="_blank"
            className="m-2 flex w-full flex-row items-start"
          >
            <Button size="sm" className="w-fit">
              Ver cápsula
            </Button>
          </PrismicNextLink>
        )}
        <div className="absolute right-5 bottom-0 flex justify-center">
          <Image
            src={`/categories/${categoryToIcon[category] || "arte.svg"}`}
            alt={category}
            width={51}
            height={94}
          />
        </div>
      </div>
    </Fade>
  );
}
