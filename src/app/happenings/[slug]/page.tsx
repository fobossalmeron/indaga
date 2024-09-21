import HappeningFull from "./HappeningFull";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loading';

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
    console.log("Evento obtenido:", event);

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