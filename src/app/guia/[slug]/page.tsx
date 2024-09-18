import * as prismic from "@prismicio/client";
import { createClient } from "@/prismicio";
import { Button } from "@/app/components/Button";
import { notFound } from "next/navigation";
import Link from "next/link";
import diamond from "@/assets/img/diamond.svg?url";
import { CategoryChip } from "./CategoryChip";
import BackArrow from "@/assets/img/back_arrow.svg";
import bares from "@/assets/img/bares.png";
import musica from "@/assets/img/musica.png";
import cafeterias from "@/assets/img/cafeterias.png";
import monumentos from "@/assets/img/monumentos.png";
import restaurantes from "@/assets/img/restaurantes.png";
import museos from "@/assets/img/museos.png";
import Image from "next/image";
import TextBubble from "@/assets/img/text_bubble.svg";
import OffEl from "@/assets/img/off_el.svg";
import CloudAlone from "@/assets/img/cloud_alone.svg";

const categories = [
  {
    slug: "bares-y-cantinas",
    title: "Bares & Cantinas",
    image: bares,
    color: "text-guiaOrange",
  },
  {
    slug: "musica-en-vivo",
    title: "Música en Vivo",
    image: musica,
    color: "text-guiaPurple",
  },
  {
    slug: "cafeterias",
    title: "Cafeterías",
    image: cafeterias,
    color: "text-guiaMustard",
  },
  {
    slug: "monumentos-historicos",
    title: "Monumentos Históricos",
    image: monumentos,
    color: "text-guiaCyan",
  },
  {
    slug: "restaurantes",
    title: "Restaurantes",
    image: restaurantes,
    color: "text-guiaSunset",
  },
  {
    slug: "espacios-de-arte",
    title: "Espacios de Arte",
    image: museos,
    color: "text-guiaPink",
  },
];

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
          categories.find((category) => category.slug === params.slug)?.title ??
            "",
        ),
      ],
      fetchOptions: {
        cache: "no-store",
        next: { tags: ["prismic", "lugares"] },
      },
    });

    if (!categories.some((category) => category.slug === params.slug)) {
      notFound();
    }

    return (
      <div className="mt-10 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-4">
          <CategoryChip slug={params.slug} />
          <Link href="/guia">
            <Button secondary thin className="gap-3 pl-5">
              <BackArrow />
              Volver a las categorías
            </Button>
          </Link>
        </div>
        <div className="my-8 flex flex-row gap-4">
          <div className="flex w-full justify-center">
            <Image
              src={
                categories.find((category) => category.slug === params.slug)
                  ?.image || ""
              }
              alt={`Imagen de ${params.slug}`}
              width={516}
              height={0}
              sizes="50vw"
            />
          </div>
          <div className="grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
            <TextBubble />
            <div className="align ml-32 flex flex-col gap-4 p-8 py-4 text-white">
              {lugares.map((lugar, index) => (
                <div
                  key={lugar.data.nombre}
                  className="flex flex-row items-center gap-6"
                >
                  {lugar.data.treasure_hunt ? (
                    <Image
                      src={diamond}
                      alt="Treasure Hunt"
                      width={26}
                      height={26}
                    />
                  ) : (
                    <OffEl
                      className={`h-[26px] w-[26px] ${categories.find((c) => c.slug === params.slug)?.color || ""}`}
                      style={{
                        transform: index % 2 === 0 ? "rotate(180deg)" : "none",
                      }}
                    />
                  )}
                  <p className="text-4xl">{lugar.data.nombre}</p>
                </div>
              ))}
              <div>
                <a
                  href="/guia.pdf"
                  target="_blank"
                  className="grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1"
                >
                  <p className="text-2xl font-medium text-white underline">
                    Descarga la Guía
                  </p>
                  <CloudAlone />
                </a>
              </div>
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
