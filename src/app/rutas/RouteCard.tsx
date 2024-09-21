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
      <Fade
        delay={100}
        className="relative h-full max-h-[130px] min-h-[130px] w-full bg-gray-200"
      >
        <PrismicNextImage
          fill={true}
          alt=""
          field={image}
          style={{ objectFit: "cover" }}
        />
      </Fade>

      <div className="flex h-full flex-col items-start justify-between gap-2 p-5 py-4">
        <Fade delay={250}>
          <div className="flex flex-col items-start gap-2">
            <Category category={category ?? "En la ciudad"} />
            <h2 className="text-3xl">{title}</h2>
            <div className="dangerous-links leading-5">
              <PrismicRichText field={description} />
            </div>
          </div>
          <div className="flex w-full">
            <Fade delay={350}>
              <MiniForm openModal={openModal} route={title} />
            </Fade>
          </div>
        </Fade>
      </div>
    </article>
  );
}
