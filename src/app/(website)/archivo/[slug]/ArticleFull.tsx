import type { Content } from "@prismicio/client";
import { isFilled } from "@prismicio/client";
import Image from "next/image";
import { PrismicRichText, type JSXMapSerializer } from "@prismicio/react";
import { formatArchiveDate, getArchiveEyebrow } from "@/lib/archive";

const components: JSXMapSerializer = {
  heading2: ({ children }) => (
    <h2 className="mt-8 mb-5 text-[28px] leading-tight font-medium sm:mt-12 sm:text-[34px]">
      {children}
    </h2>
  ),
  heading3: ({ children }) => (
    <h3 className="mt-8 mb-4 text-2xl leading-tight font-medium">{children}</h3>
  ),
  paragraph: ({ children }) => <p className="mb-6">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  list: ({ children }) => (
    <ul className="mb-6 list-disc space-y-2 pl-6">{children}</ul>
  ),
  oList: ({ children }) => (
    <ol className="mb-6 list-decimal space-y-2 pl-6">{children}</ol>
  ),
};

export default function ArticleFull({ post }: { post: Content.PostDocument }) {
  const { data } = post;

  return (
    <article className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-start gap-x-16 px-5 pt-32 pb-24 sm:pt-[182px] sm:pb-48 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
      <header className="lg:pt-6">
        <p className="mb-3 text-sm font-medium tracking-[0.16em] uppercase sm:text-lg">
          {getArchiveEyebrow(data.article_type)}
        </p>
        <h1 className="text-4xl leading-[1.15] sm:text-6xl">{data.title}</h1>
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-lg">
          {data.date && (
            <time dateTime={data.date} className="first-letter:uppercase">
              {formatArchiveDate(data.date, true)}
            </time>
          )}
          {data.author && <span>Por {data.author}</span>}
        </div>
      </header>
      {data.hero.url && (
        <div className="relative mt-8 aspect-[440/280] overflow-hidden rounded-xl lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">
          <Image
            src={data.hero.url}
            alt={data.hero.alt || ""}
            fill
            priority
            sizes="(max-width: 1023px) calc(100vw - 40px), 440px"
            className="object-cover"
          />
        </div>
      )}
      <div className="mt-10 max-w-[635px] min-w-0 lg:col-start-1 lg:row-start-2 lg:mt-14">
        {isFilled.richText(data.introduction) && (
          <div className="mb-10 text-2xl leading-[1.2] sm:text-[28px] [&_a]:underline">
            <PrismicRichText field={data.introduction} />
          </div>
        )}
        {isFilled.embed(data.video) && data.video.html && (
          <div
            data-oembed={data.video.embed_url}
            data-oembed-type={data.video.type}
            data-oembed-provider={data.video.provider_name}
            className="mb-12 aspect-video overflow-hidden rounded-2xl bg-[#292929] [&_iframe]:h-full [&_iframe]:w-full [&_video]:h-full [&_video]:w-full"
            dangerouslySetInnerHTML={{ __html: data.video.html }}
          />
        )}
        <div className="[&_a]:text-accent text-lg leading-[1.4] sm:text-xl [&_a]:underline [&_a]:underline-offset-4 [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl">
          <PrismicRichText field={data.body} components={components} />
        </div>
      </div>
    </article>
  );
}
