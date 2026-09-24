import type { Metadata } from "next";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { createClient } from "@/prismicio";
import ArchiveFull from "./ArchiveFull";

const description =
  "Hemos estado construyendo una plataforma de difusión cultural que une distintas prácticas de preservación de ~lo humano a través de distintas manifestaciones culturales.";

export const metadata: Metadata = {
  title: "Archivo - Indaga",
  description,
  alternates: { canonical: "/archivo" },
};

export default async function Archive() {
  const client = await createClient();
  const posts = await client.getAllByType("post", {
    orderings: [{ field: "my.post.date", direction: "desc" }],
  });

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1018px] px-5 pt-32 pb-24 sm:pt-40 sm:pb-[170px]">
      <header>
        <h1 className="text-5xl leading-[1.1] sm:text-[64px]">Archivo</h1>
        <p className="mt-2 max-w-[650px] text-xl leading-[1.15] sm:text-2xl">
          {description}
        </p>
      </header>
      <NuqsAdapter>
        <Suspense fallback={<p className="mt-16">Cargando archivo…</p>}>
          <ArchiveFull
            posts={posts.map(({ id, uid, data }) => ({
              id,
              uid,
              data: {
                title: data.title,
                hero: data.hero,
                date: data.date,
                article_type: data.article_type,
              },
            }))}
          />
        </Suspense>
      </NuqsAdapter>
    </div>
  );
}

export const revalidate = 3600;
