"use client";

import Image from "next/image";
import Link from "next/link";
import { Content } from "@prismicio/client";
import { Fade } from "react-awesome-reveal";
import { Button } from "@/app/components/Button";
import { formatDate } from "@/app/utils/formatDate";

export const ArticleCard = ({ post }: { post: Content.PostDocument }) => {
  const { data, uid } = post;

  return (
    <Link href={`/blog/${uid}`}>
      <div className="group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-transparent transition-all duration-300 ease-in-out hover:shadow-md active:shadow-md sm:max-w-[850px] sm:flex-row">
        <div className="relative h-[130px] overflow-hidden bg-gray-200 sm:h-auto sm:min-h-full sm:w-[200px] md:w-[40%]">
          <Fade delay={100} triggerOnce className="absolute h-full w-full">
            {data.hero?.url && (
              <Image
                src={data.hero.url}
                alt={data.hero.alt || ""}
                fill={true}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 group-hover:scale-105 group-active:scale-105"
              />
            )}
          </Fade>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-2 px-6 py-5 md:pr-10">
          <Fade delay={250}>
            <div className="flex flex-col items-start gap-2">
              <h2 className="group-hover:text-indagaBlue text-3xl leading-tight text-gray-900 sm:[display:-webkit-box] sm:max-w-full sm:overflow-hidden sm:[-webkit-box-orient:vertical] sm:[-webkit-line-clamp:2]">
                {data.title}
              </h2>
              <p className="line-clamp-2 text-gray-600">
                {data.meta_description}
              </p>
            </div>
            <div className="mt-4 flex flex-col">
              <div className="mb-4 flex flex-row gap-2 text-lg">
                {data.author && <span>Por {data.author}</span>}
                <span>{data.date && formatDate(data.date, true)}</span>
              </div>
              <Button className="px-9 sm:w-fit">Ver artículo</Button>
            </div>
          </Fade>
        </div>
      </div>
    </Link>
  );
};
