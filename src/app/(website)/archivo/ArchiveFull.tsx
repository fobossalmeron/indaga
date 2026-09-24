"use client";

import { parseAsStringLiteral, useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
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
    <section aria-label="Publicaciones del archivo" className="mt-10 sm:mt-16">
      <Select
        value={category}
        onValueChange={(value) => setCategory(value as typeof category)}
      >
        <SelectTrigger
          aria-label="Filtra por categoría"
          className="mb-[30px] min-w-[202px] bg-transparent font-normal data-[size=default]:h-11"
        >
          <SelectValue className="text-accent">
            {category === "Todas" ? "Filtra por categoría" : category}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todas">Todas las categorías</SelectItem>
          {archiveTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
