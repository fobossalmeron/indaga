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
      <div className="mt-10 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-4">
          <CategoryChip slug={params.slug} />
        </div>
        <div id="img" className="my-8 flex flex-row relative">
          <div className="relative w-full max-h-[665px] min-w-[375px] h-auto z-1">
            <Image
              src={categories[params.slug as keyof typeof categories].bgImage}
              alt={`Imagen de ${params.slug}`}
              width={1032}
              height={774}
              className="w-auto h-full object-contain"
              priority
            />
          </div>
          <div className="flex flex-col -ml-[30%] z-0">
            <div className="grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
              <TextBubble className="text-eerie"/>
              <div className="align ml-32 flex flex-col gap-4 p-8 py-4 text-white">
                {lugares.map((lugar, index) => (
                  <Place
                    key={lugar.data.nombre}
                    place={lugar.data.nombre as string}
                    treasure={lugar.data.treasure_hunt as boolean}
                    color={color}
                    reverse={index % 2 === 0}
                  />
                ))}
                <div>
                  <CloudCTA hoverStroke={color} />
                </div>
              </div>
            </div>
            <TreasureMessage />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error al obtener el evento ${params.slug}:`, error);
    notFound();
  }
}
