import Link from "next/link";
import { Content } from "@prismicio/client";
import { Star } from "@/app/components/Star";

export function OtherArticlesCard({
  articles,
}: {
  articles: Content.PostDocument[];
}) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-3xl bg-white">
      <div className="bg-indagaBrown flex items-center gap-3 p-5">
        <Star className="h-8 w-8 text-yellow-200" />
        <h3 className="text-xl text-white">Explora otros artículos</h3>
      </div>
      <div className="flex flex-col gap-2 p-5 pb-7">
        {articles?.map((article) => (
          <Link
            key={article.uid}
            href={`/blog/${article.uid}`}
            className="text-indagaBrown hover:text-indagaBrown/80 text-lg underline"
          >
            {article.data.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
