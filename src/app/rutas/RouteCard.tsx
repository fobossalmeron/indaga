"use client";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { RouteProps } from "./route.types";
import { Category } from "@/app/components/Category";
import MiniForm from "./MiniForm";

export const RouteCard: React.FC<RouteProps> = ({
  category,
  title,
  image,
  description,
}) => {
  return (
    <article className="duration-600 max-w-[469px] flex w-full flex-col overflow-hidden rounded-2xl bg-white outline-2 outline-transparent transition-all ease-in-out">
      <div className="relative h-32 w-full bg-gray-200">
        <Image
          src={image}
          alt={`Imagen de ${title}`}
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col items-start p-5 py-4 gap-2">
        <Category category={category} />
        <h2 className="text-3xl">{title}</h2>
        <p className="text-normal">{description}</p>
        <div className="flex w-full">
        <MiniForm />
        </div>
      </div>
    </article>
  );
};
