import HappeningFull from "./HappeningFull";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loading';
import { Metadata } from 'next';
import { asImageSrc, asText } from "@prismicio/helpers";
import { truncate } from "@/app/utils/truncate";

// Función para generar metadatos
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const client = createClient();

  try {
    const event = await client.getByUID<Content.HappeningDocument>("happening", params.slug);

    if (!event) {
      return {
        title: 'Evento no encontrado',
      };
    }

    const title = event.data.title;
    const description = event.data.description ? truncate(asText(event.data.description), 155) : '';


    return {
      title: title,
      description: description,
      openGraph: {
        images: event.data.image?.url
          ? [
              {
                url: asImageSrc(event.data.image, {
                  width: 1200,
                  height: 630,
                }),
                
              },
            ]
          : [],
      },
    };
  } catch (error) {
    console.error(`Error al obtener metadatos para el evento ${params.slug}:`, error);
    return {
      title: 'Error al cargar el evento',
    };
  }
}

export default async function Happening({ params }: { params: { slug: string } }) {
  const client = createClient();
  console.log("Prismic client fetchOptions:", client.fetchOptions);

  try {
    const event = await client.getByUID<Content.HappeningDocument>(
      "happening",
      params.slug,
      {
        fetchOptions: {
          cache: "no-store",
          next: { tags: ["prismic", "happenings"] },
        },
      }
    );

    if (!event) {
      notFound();
    }

    return (
      <Suspense fallback={<Loading />}>
        <HappeningFull event={event} />
      </Suspense>
    );
  } catch (error) {
    console.error(`Error al obtener el evento ${params.slug}:`, error);
    notFound();
  }
}

// Eliminamos la línea de revalidate