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

type Params = Promise<{ slug: string }>

export default async function GuiaPage({
  params,
}: {
  params: Params
}) {
  const client = createClient();
  const { slug } = await params;

  try {
    const lugares = await client.getAllByType("lugar", {
      filters: [
        prismic.filter.at(
          "my.lugar.categoria",
          categories[slug as keyof typeof categories]?.title ?? "",
        ),
      ],
    });

    // Ordenar los lugares alfabéticamente
    const lugaresOrdenados = lugares.sort((a, b) =>
      (a.data.nombre as string).localeCompare(b.data.nombre as string),
    );

    if (!Object.keys(categories).includes(slug as keyof typeof categories)) {
      notFound();
    }

    const color = `${categories[slug as keyof typeof categories].color}`;

    return (
      <div className="flex w-full max-w-[1020px] animate-fadeIn2 flex-col self-center">
        <div className="flex flex-col items-center justify-center gap-4 px-6 lg:items-start">
          <Link href="/guia" className="animate-fadeIn2">
            <Button secondary thin className="gap-3 pl-4 pr-4">
              <BackArrow />
              Volver a las categorías
            </Button>
          </Link>
        </div>
        <div className="relative mt-5 grid w-full grid-cols-12 grid-rows-[64px_auto] p-5 lg:mt-10">
          <CategoryChip
            slug={slug}
            className="col-span-12 col-start-1 row-start-1 w-full items-center lg:items-start"
          />
          <div className="sm:z-1 pointer-events-none relative z-10 col-span-4 col-start-1 row-start-2 hidden w-full animate-fadeIn3 xsm:block sm:col-span-6 sm:col-start-1">
            <Image
              src={categories[slug as keyof typeof categories].bgImage}
              alt={`Imagen de ${slug}`}
              width={450}
              className="h-auto w-full object-contain pt-12"
              priority
            />
          </div>
          <div className="relative z-0 col-span-12 col-start-1 row-start-2 row-end-3 grid animate-fadeIn4 grid-cols-subgrid place-items-center sm:col-span-12 sm:col-start-5 sm:place-items-end lg:row-start-1">
            <div className="align col-span-12 col-start-1 row-start-1 flex max-w-[400px] flex-col gap-2 pb-2 pt-10 text-eerie xsm:col-span-8 xsm:col-start-5 sm:col-start-3 md:gap-4 md:pb-4 lg:pt-0">
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
    console.error(`Error al obtener el evento ${slug}:`, error);
    notFound();
  }
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
