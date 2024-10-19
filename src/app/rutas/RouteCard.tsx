"use client";
import { Category } from "@/app/components/Category";
import MiniForm from "./MiniForm";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Fade } from "react-awesome-reveal";
import { Content } from "@prismicio/client";

export function RouteCard({
  route,
  openModal,
}: {
  route: Content.RouteDocument;
  openModal: () => void;
}) {
  const { category, title, image, description } = route.data;
  return (
    <article className="flex h-full w-full max-w-[469px] flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 ease-in-out">
      <div className="relative h-[130px] w-full overflow-hidden bg-gray-200">
          <PrismicNextImage
            fill={true}
            alt=""
            field={image}
            loader={undefined}
            sizes="(max-width: 640px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
      </div>
      <div className="flex flex-1 flex-col p-5 py-4">
        <Fade delay={200}>
          <div className="flex flex-col items-start gap-2">
            <Category category={category ?? "En la ciudad"} />
            <h2 className="text-3xl">{title}</h2>
            <div className="dangerous-links leading-5">
              <PrismicRichText field={description} />
            </div>
          </div>
        </Fade>
        <div className="mt-auto pt-4">
          <Fade delay={350} className="flex w-full">
            <MiniForm openModal={openModal} route={title} />
          </Fade>
        </div>
      </div>
    </article>
  );
}
