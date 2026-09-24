import type { Metadata } from "next";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { createClient } from "@/prismicio";
import ArchiveFull from "./ArchiveFull";
import ArchiveShell, { archiveDescription } from "./ArchiveShell";
import ArchiveSkeleton from "./ArchiveSkeleton";

export const metadata: Metadata = {
  title: "Archivo - Indaga",
  description: archiveDescription,
  alternates: { canonical: "/archivo" },
};

async function ArchiveEntries() {
  const client = await createClient();
  const posts = await client.getAllByType("post", {
    orderings: [{ field: "my.post.date", direction: "desc" }],
  });

  return (
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
  );
}

export default function Archive() {
  return (
    <ArchiveShell>
      <NuqsAdapter>
        <Suspense fallback={<ArchiveSkeleton />}>
          <ArchiveEntries />
        </Suspense>
      </NuqsAdapter>
    </ArchiveShell>
  );
}

export const revalidate = 3600;
