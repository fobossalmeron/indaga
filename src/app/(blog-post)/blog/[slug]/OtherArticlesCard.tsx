import Link from "next/link";
import { Content } from "@prismicio/client";
import Star from "@/assets/img/star.svg";

export function OtherArticlesCard({
  articles,
}: {
  articles: Content.PostDocument[];
}) {
  return (
    <div className="flex max-w-[350px] flex-col overflow-hidden rounded-3xl bg-white shadow-md">
      <div className="bg-indagaBrown flex items-center gap-3 p-5">
        <Star className="h-8 w-8" />
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
