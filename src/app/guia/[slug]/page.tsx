import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import { CategoryChip } from "./CategoryChip";
import Image from "next/image";
import { categories } from "../categories";
import { Place } from "./Place";
import { LinkField } from "@prismicio/client";
import { Button } from "@/app/components/Button";
import BackArrow from "@/assets/img/back_arrow.svg";
import Link from "next/link";

export default async function Categoria({
  params,
}: {
  params: { slug: string };
}) {
  const client = createClient();

  try {
    const lugares = await client.getAllByType("lugar", {
      filters: [
        prismic.filter.at(
          "my.lugar.categoria",
          categories[params.slug as keyof typeof categories]?.title ?? "",
        ),
      ],
    });

    // Ordenar los lugares alfabéticamente
    const lugaresOrdenados = lugares.sort((a, b) =>
      (a.data.nombre as string).localeCompare(b.data.nombre as string),
    );

    if (!Object.keys(categories).includes(params.slug)) {
      notFound();
    }

    const color = `${categories[params.slug as keyof typeof categories].color}`;

    return (
      <div className="flex max-w-[1020px] animate-fadeIn2 flex-col self-center w-full">
        <div className="flex flex-col items-start justify-center gap-4 pl-6">
          <Link href="/guia" className="animate-fadeIn2">
            <Button secondary thin className="gap-3 pl-4 pr-4">
              <BackArrow />
              Volver a las categorías
            </Button>
          </Link>
        </div>
        <div className="relative mt-10 grid w-full grid-cols-12 grid-rows-[auto] p-2">
          <div className="sm:z-1 relative z-10 col-span-4 col-start-1 row-start-2 w-full animate-fadeIn3 sm:col-span-6 sm:col-start-1">
            <CategoryChip slug={params.slug} />
            <Image
              src={categories[params.slug as keyof typeof categories].bgImage}
              alt={`Imagen de ${params.slug}`}
              width={450}
              className="h-auto w-full object-contain pt-12"
              priority
            />
          </div>
          <div className="relative z-0 col-span-12 col-start-1 row-start-2 grid animate-fadeIn4 grid-cols-subgrid place-items-end sm:col-span-8 sm:col-start-5">
            <div className="align col-span-7 col-start-5 row-start-1 flex flex-col gap-2 pb-2 text-eerie sm:col-start-3 md:gap-4 md:pb-4 max-w-[400px]">
              {lugaresOrdenados.map((lugar) => (
                <Place
                  key={lugar.data.nombre}
                  place={lugar.data.nombre as string}
                  color={color}
                  link={lugar.data.link as LinkField}
                  area={lugar.data.area as string}
                  mapLink={lugar.data.mapLink as LinkField}
                  capsuleLink={lugar.data.capsuleLink as LinkField}
                />
              ))}
              <a href="/INDAGA_GUIA_2024v2.pdf" target="_blank">
                <Button secondary>Ver guía completa</Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error al obtener el evento ${params.slug}:`, error);
    notFound();
  }
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
