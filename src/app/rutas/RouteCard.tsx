"use client";
import { RouteProps } from "./route.types";
import { Category } from "@/app/components/Category";
import MiniForm from "./MiniForm";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage} from "@prismicio/next";
import { Content } from "@prismicio/client";


export const RouteCard: React.FC<RouteProps> = ({ route, openModal }) => {
  const { category, title, image, description } = route.data;
  console.log(image);
  return (
    <article className="duration-600 flex w-full max-w-[469px] flex-col overflow-hidden rounded-2xl bg-white outline-2 outline-transparent transition-all ease-in-out">
      <div className="relative h-32 w-full bg-gray-200">
        <PrismicNextImage
          fill={true}
          alt=""
          field={image}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col items-start gap-2 p-5 py-4">
        <Category category={category} />
        <h2 className="text-3xl">{title}</h2>
        <div className="dangerous-links leading-5">
          <PrismicRichText field={description} />
        </div>{" "}
        <div className="flex w-full">
          <MiniForm openModal={openModal} />
        </div>
      </div>
    </article>
  );
};
