import ArticleFull from "./ArticleFull";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { asImageSrc } from "@prismicio/helpers";
import { truncate } from "@/app/utils/truncate";

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

    // Añadir artículos de prueba si filteredOtherPosts está vacío
    const postsToShow =
      filteredOtherPosts.length === 0
        ? ([
            {
              id: "articulo-prueba-1",
              uid: "articulo-prueba-1",
              type: "post",
              url: "/blog/articulo-prueba-1",
              href: "/blog/articulo-prueba-1",
              tags: [],
              slugs: ["articulo-prueba-1"],
              lang: "es-es",
              alternate_languages: [],
              first_publication_date: new Date().toISOString(),
              last_publication_date: new Date().toISOString(),
              linked_documents: [],
              data: {
                hero: {
                  id: "articulo-prueba-1-hero",
                  dimensions: { width: 1920, height: 1080 },
                  alt: "Artículo de Prueba 1",
                  copyright: null,
                  url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1920&auto=format&fit=crop",
                  edit: { x: 0, y: 0, zoom: 1, background: "#000000" },
                },
                title: "El origen de una Gargantúa espacios de cultura",
                seo_title: "Artículo de Prueba 1",
                meta_description: "Este es un artículo de prueba",
                date: new Date().toISOString(),
                author: "Equipo Indaga",
                body: [],
              },
            },
            {
              id: "articulo-prueba-2",
              uid: "articulo-prueba-2",
              type: "post",
              url: "/blog/articulo-prueba-2",
              href: "/blog/articulo-prueba-2",
              tags: [],
              slugs: ["articulo-prueba-2"],
              lang: "es-es",
              alternate_languages: [],
              first_publication_date: new Date().toISOString(),
              last_publication_date: new Date().toISOString(),
              linked_documents: [],
              data: {
                hero: {
                  id: "articulo-prueba-2-hero",
                  dimensions: { width: 1920, height: 1080 },
                  alt: "Artículo de Prueba 2",
                  copyright: null,
                  url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1920&auto=format&fit=crop",
                  edit: { x: 0, y: 0, zoom: 1, background: "#000000" },
                },
                title:
                  "El obispado como vínculo cultural de la edad media y el renacimiento",
                seo_title: "Artículo de Prueba 2",
                meta_description: "Este es otro artículo de prueba",
                date: new Date().toISOString(),
                author: "Equipo Indaga",
                body: [],
              },
            },
          ] as Content.PostDocument[])
        : filteredOtherPosts;

    return <ArticleFull post={post} otherPosts={postsToShow} />;
  } catch (error) {
    console.error(`Error al obtener el artículo ${slug}:`, error);
    notFound();
  }
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
