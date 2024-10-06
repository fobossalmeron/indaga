import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import { CategoryChip } from "./CategoryChip";
import Image from "next/image";
import TextBubble from "@/assets/img/text_bubble.svg";
import { categories } from "../categories";
import { CloudCTA } from "../CloudCTA";
import { Place } from "./Place";
import { TreasureMessage } from "./TreasureMessage";

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
      fetchOptions: {
        cache: "no-store",
        next: { tags: ["prismic", "lugares"] },
      },
    });

    if (!Object.keys(categories).includes(params.slug)) {
      notFound();
    }

    const color = `${categories[params.slug as keyof typeof categories].color}`;

    return (
      <div className="mt-10 flex animate-fadeIn2 flex-col">
        <div className="flex flex-col items-center justify-center gap-4">
          <CategoryChip slug={params.slug} />
        </div>
        <div
          id="img"
          className="relative mt-10 grid w-full grid-cols-12 grid-rows-[120px_auto] p-2 sm:grid-rows-[100px_auto]"
        >
          <div className="sm:z-1 relative z-10 col-span-4 col-start-1 sm:col-start-1 row-start-2 w-full animate-fadeIn3 sm:col-span-5">
            <Image
              src={categories[params.slug as keyof typeof categories].bgImage}
              alt={`Imagen de ${params.slug}`}
              width={1032}
              height={774}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          <div className="relative z-0 col-span-12 col-start-1 row-start-2 grid animate-fadeIn4 grid-cols-subgrid place-items-center sm:col-span-8 sm:col-start-5">
            <TextBubble className="col-span-12 col-start-1 row-start-1 h-full w-full min-w-[420px] text-eerie" />
            <div className="align col-span-7 col-start-5 row-start-1 flex flex-col gap-2 py-4 pb-2 text-white sm:col-start-3 md:gap-4 md:pb-4">
              {lugares.map((lugar, index) => (
                <Place
                  key={lugar.data.nombre}
                  place={lugar.data.nombre as string}
                  treasure={lugar.data.treasure_hunt as boolean}
                  color={color}
                  reverse={index % 2 === 0}
                />
              ))}
              <div className="-translate-x-5 pt-2 sm:pt-4">
                <CloudCTA hoverStroke={color} />
              </div>
            </div>
          </div>
          <TreasureMessage className="col-span-10 col-start-2" />
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error al obtener el evento ${params.slug}:`, error);
    notFound();
  }
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
