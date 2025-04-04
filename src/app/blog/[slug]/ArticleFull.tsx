import { Content } from "@prismicio/client";
import Image from "next/image";
import { PrismicRichText } from "@prismicio/react";
import { formatDate } from "@/app/utils/formatDate";

interface ArticleFullProps {
  post: Content.PostDocument;
}

export default function ArticleFull({ post }: ArticleFullProps) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          {post.data.title}
        </h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{post.data.author}</span>
          <span>•</span>
          <time dateTime={post.data.date?.toString() || ""}>
            {formatDate(post.data.date?.toString() || "")}
          </time>
        </div>
      </header>

      {post.data.hero?.url && (
        <div className="mb-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={post.data.hero.url}
            alt={post.data.hero.alt || ""}
            width={1200}
            height={630}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-lg mx-auto max-w-none">
        <PrismicRichText field={post.data.body} />
      </div>
    </article>
  );
} 