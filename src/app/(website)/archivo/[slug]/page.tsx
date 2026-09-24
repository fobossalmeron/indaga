import type { Metadata } from "next";
import { cache } from "react";
import { NotFoundError } from "@prismicio/client";
import { asImageSrc } from "@prismicio/helpers";
import { notFound } from "next/navigation";
import { createClient } from "@/prismicio";
import { truncate } from "@/utils/truncate";
import ArticleFull from "./ArticleFull";

const getPost = cache(async (slug: string) => {
  const client = await createClient();
  try {
    return await client.getByUID("post", slug);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
});

type ArticleProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: ArticleProps): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await getPost(slug);
  const title = data.seo_title || data.title || "Archivo - Indaga";
  const description = data.meta_description
    ? truncate(data.meta_description, 155)
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/archivo/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/archivo/${slug}`,
      publishedTime: data.date || undefined,
      images: data.hero.url
        ? [{ url: asImageSrc(data.hero, { width: 1200, height: 630 })! }]
        : [],
    },
  };
}

export default async function Article({ params }: ArticleProps) {
  const { slug } = await params;
  return <ArticleFull post={await getPost(slug)} />;
}

export const revalidate = 3600;
