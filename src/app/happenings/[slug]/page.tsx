import HappeningFull from "./HappeningFull";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { asImageSrc, asText } from "@prismicio/helpers";
import { truncate } from "@/app/utils/truncate";

// Función para generar metadatos
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const client = createClient();

  try {
    const event = await client.getByUID<Content.HappeningDocument>(
      "happening",
      params.slug,
    );

    if (!event) {
      return {
        title: "Evento no encontrado",
      };
    }

    const title = event.data.title;
    const description = event.data.description
      ? truncate(asText(event.data.description), 155)
      : "";

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
    console.error(
      `Error al obtener metadatos para el evento ${params.slug}:`,
      error,
    );
    return {
      title: "Error al cargar el evento",
    };
  }
}

export default async function Happening({
  params,
}: {
  params: { slug: string };
}) {
  const client = createClient();
  console.log("Prismic client fetchOptions:", client.fetchOptions);

  try {
    const event = await client.getByUID<Content.HappeningDocument>(
      "happening",
      params.slug,
      {
        fetchOptions: {
          next: { tags: ["happening", `happening-${params.slug}`] },
        },
      },
    );

    if (!event) {
      notFound();
    }

    return <HappeningFull event={event} />;
  } catch (error) {
    console.error(`Error al obtener el evento ${params.slug}:`, error);
    notFound();
  }
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
