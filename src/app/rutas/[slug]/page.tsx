import RouteFull from "./RouteFull";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { asImageSrc, asText } from "@prismicio/helpers";
import { truncate } from "@/utils/truncate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = await createClient();

  try {
    const route = await client.getByUID<Content.RouteDocument>("route", slug, {
      fetchLinks: ["lugar.nombre", "lugar.area", "lugar.mapLink", "lugar.link", "lugar.capsuleLink", "lugar.categoria", "lugar.description", "happening.uid"]
    });

    if (!route) {
      return {
        title: "Ruta no encontrada",
      };
    }

    const title = route.data.title;
    const description = route.data.description
      ? truncate(asText(route.data.description), 155)
      : "";

    return {
      title: title,
      description: description,
      openGraph: {
        images: route.data.image?.url
          ? [
              {
                url: asImageSrc(route.data.image, {
                  width: 1200,
                  height: 630,
                }),
              },
            ]
          : [],
      },
    };
  } catch (error) {
    console.error(`Error al obtener metadatos para la ruta ${slug}:`, error);
    return {
      title: "Error al cargar la ruta",
    };
  }
}

export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await createClient();

  try {
    const route = await client.getByUID<Content.RouteDocument>("route", slug, {
      fetchLinks: ["lugar.nombre", "lugar.area", "lugar.mapLink", "lugar.link", "lugar.capsuleLink", "lugar.categoria", "lugar.description", "happening.uid"]
    });

    if (!route) {
      notFound();
    }

    return <RouteFull route={route} />;
  } catch (error) {
    console.error(`Error al obtener la ruta ${slug}:`, error);
    notFound();
  }
}

export const revalidate = 3600;
