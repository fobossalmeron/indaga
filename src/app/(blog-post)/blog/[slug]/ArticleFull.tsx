import { Content } from "@prismicio/client";
import Image from "next/image";
import { PrismicRichText } from "@prismicio/react";
import { formatDate } from "@/app/utils/formatDate";
import { JSXMapSerializer } from "@prismicio/react";
import { OtherArticlesCard } from "./OtherArticlesCard";

export default function ArticleFull({
  post,
  otherPosts,
}: {
  post: Content.PostDocument;
  otherPosts: Content.PostDocument[];
}) {
  const components: JSXMapSerializer = {
    strong: ({ children }) => <span className="font-semibold">{children}</span>,
    heading2: ({ children }) => (
      <h2 className="mt-6 font-sans text-2xl md:text-4xl">{children}</h2>
    ),
    paragraph: ({ children }) => (
      <p className="m-0 mb-3 text-lg leading-[140%] md:mb-4 md:text-xl">
        {children}
      </p>
    ),
    hyperlink: ({ children, node }) => (
      <a
        href={node.data.url}
        className="text-indagaBlue from-indagaBlue to-indagaBlue bg-gradient-to-r bg-[length:0%_2px] bg-[position:0_100%] bg-no-repeat transition-all duration-300 ease-in-out hover:bg-[length:100%_2px] focus:bg-[length:100%_2px] active:bg-[length:100%_2px]"
      >
        {children}
      </a>
    ),
  };

  return (
    <article className="relative mx-auto mb-20 w-full lg:mb-40">
      <header className="animate-fadeIn mx-auto flex w-full max-w-[1120px] flex-col items-center gap-4 px-5 pt-12 pb-5 sm:pt-24 lg:flex-row">
        <div className="flex flex-col text-center lg:text-start">
          <h1 className="text-4xl md:max-w-[23ch] md:text-5xl lg:text-6xl">
            {post.data.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 py-6 text-lg text-gray-600 lg:justify-start">
            {post.data.author && (
              <>
                <span>Por {post.data.author}</span>
                <span className="bg-indagaBlue h-4 w-px rounded-sm" />
              </>
            )}
            <time dateTime={post.data.date?.toString() || ""}>
              Publicado el {formatDate(post.data.date?.toString() || "", true)}
            </time>
          </div>
        </div>
      </header>

      {post.data.hero?.url && (
        <div className="animate-fadeIn mb-8 aspect-video w-full overflow-hidden">
          <Image
            src={post.data.hero.url}
            alt={post.data.hero.alt || ""}
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      <div className="relative mx-auto flex w-full max-w-[1120px] flex-col gap-10 px-5 md:gap-16 lg:flex-row">
        <div className="mx-auto flex w-full max-w-[635px] flex-col pt-5 sm:pt-8 lg:pt-14">
          <div className="article-content prose prose-lg flex max-w-[635px] flex-col gap-6">
            <PrismicRichText field={post.data.body} components={components} />
          </div>
        </div>

        <aside className="sticky mx-auto w-full self-start md:max-w-[350px] lg:top-20 lg:pt-14 lg:pr-4">
          {otherPosts?.length > 0 && (
            <OtherArticlesCard articles={otherPosts} />
          )}
        </aside>
      </div>
    </article>
  );
}
