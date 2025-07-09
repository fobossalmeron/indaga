import ArticleFull from "./ArticleFull";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { asImageSrc } from "@prismicio/helpers";
import { truncate } from "@/utils/truncate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
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

    const title = post.data.seo_title;
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
      error,
    );
    return {
      title: "Error al cargar el artículo",
    };
  }
}

export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await createClient();

  try {
    const post = await client.getByUID<Content.PostDocument>("post", slug);
    const otherPosts = await client.getAllByType<Content.PostDocument>("post", {
      limit: 5,
      orderings: {
        field: "document.first_publication_date",
        direction: "desc",
      },
      graphQuery: `
        {
          post {
            title
            uid
          }
        }
      `,
    });

    if (!post) {
      notFound();
    }

    // Filtrar el artículo actual de los otros artículos
    const filteredOtherPosts = otherPosts.filter((p) => p.uid !== slug);

    return <ArticleFull post={post} otherPosts={filteredOtherPosts} />;
  } catch (error) {
    console.error(`Error al obtener el artículo ${slug}:`, error);
    notFound();
  }
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
