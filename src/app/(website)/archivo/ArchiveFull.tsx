"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import { CategorySelect } from "@/app/components/CategorySelect";
import { archiveTypes, getArchiveType, type ArchivePost } from "@/lib/archive";
import { ArticleCard } from "./ArticleCard";

export default function ArchiveFull({ posts }: { posts: ArchivePost[] }) {
  const [category, setCategory] = useQueryState(
    "categoria",
    parseAsStringLiteral(["Todas", ...archiveTypes] as const).withDefault(
      "Todas",
    ),
  );
  const filteredPosts = posts.filter(
    (post) =>
      category === "Todas" ||
      getArchiveType(post.data.article_type) === category,
  );

  return (
    <section
      aria-label="Publicaciones del archivo"
      className="motion-safe:animate-fadeIn mt-6 motion-safe:[animation-duration:300ms] sm:mt-10"
    >
      <div className="mb-4 flex w-full justify-center sm:mb-8 lg:justify-start">
        <div className="grid w-full max-w-full grid-cols-2 gap-2 sm:max-w-[500px]">
          <CategorySelect
            className="w-full"
            categories={archiveTypes}
            selectedCategory={category}
            onSelectCategory={(value) => setCategory(value as typeof category)}
          />
        </div>
      </div>
      <p role="status" className="sr-only">
        {filteredPosts.length} publicaciones
        {category !== "Todas" ? ` de tipo ${category}` : ""}
      </p>
      {filteredPosts.length ? (
        <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-12">
          <p className="text-2xl">
            {category === "Todas"
              ? "Pronto compartiremos nuevas historias."
              : "Aún no hay publicaciones en esta categoría."}
          </p>
          {category !== "Todas" && (
            <button
              onClick={() => setCategory("Todas")}
              className="text-accent mt-4 cursor-pointer underline underline-offset-4"
            >
              Ver todo el archivo
            </button>
          )}
        </div>
      )}
    </section>
  );
}
