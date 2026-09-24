import Image from "next/image";
import Link from "next/link";
import { Category } from "@/app/components/Category";
import {
  formatArchiveDate,
  getArchiveType,
  type ArchivePost,
} from "@/lib/archive";

export function ArticleCard({ post }: { post: ArchivePost }) {
  const { data, uid } = post;

  return (
    <Link
      href={`/archivo/${uid}`}
      className="group focus-visible:outline-accent h-full rounded-[22px] outline-offset-4 focus-visible:outline-2"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[22px] bg-white transition-shadow hover:shadow-md">
        {data.hero.url && (
          <div className="relative h-[130px] overflow-hidden sm:h-[105px]">
            <Image
              src={data.hero.url}
              alt={data.hero.alt || ""}
              fill
              sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 50vw, 305px"
              className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col items-start gap-2 px-6 py-6">
          <Category
            category={getArchiveType(data.article_type)}
            className="py-1 text-xs leading-4 tracking-wider uppercase"
          />
          <h2 className="text-2xl leading-[1.2]">{data.title}</h2>
          {data.date && (
            <time dateTime={data.date} className="mt-auto pt-1 text-lg">
              {formatArchiveDate(data.date)}
            </time>
          )}
        </div>
      </article>
    </Link>
  );
}
