"use client";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { HappeningProps } from "./happenings.types";
import { Category } from "../components/Category";
import { Fade } from "react-awesome-reveal";
import { formatDate } from "@/app/utils/formatDate";
import { truncate } from "@/app/utils/truncate";

interface HappeningCardProps extends Omit<HappeningProps, "description"> {}

export const HappeningCard: React.FC<HappeningCardProps> = ({
  category,
  title,
  location,
  fecha,
  image,
}) => {
  console.log(image);
  return (
    <article className="duration-600 flex h-full w-[305px] flex-col overflow-hidden rounded-3xl bg-white outline-2 outline-transparent transition-all ease-in-out hover:-translate-y-1 hover:shadow-md hover:outline">
      <div className="relative min-h-[130px] max-h-[130px] w-full bg-gray-200 h-full">
        <Image
          src={image}
          alt={`Imagen de ${title}`}
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col h-full justify-between gap-2 px-5 py-4">
        <div className="flex flex-col items-start gap-2">
          <Category category={category} />
          <div>
            <h2 className="text-2xl leading-tight">{truncate(title)}</h2>
            <p className="text-blue underline">@{location}</p>
          </div>
        </div>
        <div className="flex flex-col">
          {/* <p className="mb-4 text-2xl capitalize">{formatDate(fecha)}</p> */}
          <Button fullWidth>Ver evento</Button>
        </div>
      </div>
    </article>
  );
};
