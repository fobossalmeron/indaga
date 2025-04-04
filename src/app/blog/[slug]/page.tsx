import ArticleFull from "./ArticleFull";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { asImageSrc } from "@prismicio/helpers";
import { truncate } from "@/app/utils/truncate";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = await createClient();

  try {
    const post = await client.getByUID<Content.PostDocument>("post", slug);

    if (!post) {
      return {
        title: "Artículo no encontrado",
      };
    }

    const title = post.data.title;
    const description = post.data.meta_description
      ? truncate(post.data.meta_description, 155)
      : "";

    return {
      title: title,
      description: description,
      openGraph: {
        images: post.data.hero?.url
          ? [
              {
                url: asImageSrc(post.data.hero, {
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
      `Error al obtener metadatos para el artículo ${slug}:`,
      error
    );
    return {
      title: "Error al cargar el artículo",
    };
  }
}

export default async function Article({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const client = await createClient();

  try {
    const post = await client.getByUID<Content.PostDocument>("post", slug);

    if (!post) {
      notFound();
    }

    return <ArticleFull post={post} />;
  } catch (error) {
    console.error(`Error al obtener el artículo ${slug}:`, error);
    notFound();
  }
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos) 