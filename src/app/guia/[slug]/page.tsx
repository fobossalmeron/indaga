import * as prismic from '@prismicio/client';
import { createClient } from "@/prismicio";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { Content } from "@prismicio/client";
import { notFound } from 'next/navigation';
import Link from "next/link";
import Diamond from "@/assets/img/diamond.svg";

const categories = [
  { slug: "bares-y-cantinas", title: "Bares & Cantinas" },
  { slug: "musica-en-vivo", title: "Música en Vivo" },
  { slug: "cafeterias", title: "Cafeterías" },
  { slug: "monumentos-historicos", title: "Monumentos Históricos" },
  { slug: "restaurantes", title: "Restaurantes" },
  { slug: "espacios-de-arte", title: "Espacios de Arte" }
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
        prismic.filter.at("my.lugar.categoria", categories.find(category => category.slug === params.slug)?.title ?? '')
      ],
      fetchOptions: {
        cache: "no-store",
        next: { tags: ["prismic", "lugares"] },
      },
    });

    if (!categories.some(category => category.slug === params.slug)) {
      notFound();
    }

    console.log(lugares)

    return (
      <div className="flex flex-col">
        <Link href="/guia">
          <Button secondary>Volver a la guía</Button>
        </Link>
        <div>
          <div className={`h-100 relative w-full text-white`}>
            <h2 className="px-10 py-2 text-center text-2xl text-white">
              {categories.find(category => category.slug === params.slug)!.title}
            </h2>
          </div>
          <div className="flex flex-col p-8 py-4">
            {lugares.map((lugar, index) => (
              <div key={index} className="flex gap-2">
                <p>{lugar.data.nombre}</p>
                {lugar.data.treasure_hunt && <Diamond />}
              </div>
            ))}
            <div className="flex gap-2"></div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error al obtener el evento ${params.slug}:`, error);
    notFound();
  }
}
