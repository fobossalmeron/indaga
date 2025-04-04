import { Content } from "@prismicio/client";
import Image from "next/image";
import { PrismicRichText } from "@prismicio/react";
import { formatDate } from "@/app/utils/formatDate";
import { JSXMapSerializer } from "@prismicio/react";

export default function ArticleFull({ post }: { post: Content.PostDocument }) {
  const components: JSXMapSerializer = {
    heading2: ({ children }) => (
      <h2 className="mt-6 font-sans text-4xl">{children}</h2>
    ),
    paragraph: ({ children }) => (
      <p className="m-0 text-xl leading-[140%]">{children}</p>
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
    <article className="mx-auto mb-40 w-full">
      <header className="animate-fadeIn mx-auto flex w-full max-w-[1020px] flex-col items-center gap-4 px-5 pt-12 pb-5 sm:pt-24 lg:flex-row">
        <div className="flex flex-col text-center lg:text-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl">
            {post.data.title}
          </h1>
          <div className="flex items-center space-x-4 py-6 text-lg text-gray-600">
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

      <div className="prose prose-lg mx-auto flex w-full max-w-[1020px] flex-col pt-14">
        <div className="article-content flex max-w-[635px] flex-col gap-6">
          <PrismicRichText field={post.data.body} components={components} />
        </div>
      </div>
    </article>
  );
}
