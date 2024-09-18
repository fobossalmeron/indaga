"use client";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { Content } from "@prismicio/client";
import { Category } from "../components/Category";
import { Fade } from "react-awesome-reveal";
import { formatDate } from "@/app/utils/formatDate";
import { truncate } from "@/app/utils/truncate";

interface HappeningCardProps
  extends Omit<Content.HappeningDocument, "description"> {}

export const HappeningCard: React.FC<HappeningCardProps> = ({ data }) => {
  const { category, title, location_name, date, image } = data;

  return (
    <article className="duration-600 flex h-full w-[305px] flex-col overflow-hidden rounded-3xl bg-white outline-2 outline-transparent transition-all ease-in-out hover:-translate-y-1 hover:shadow-md hover:outline">
      <div className="relative h-full max-h-[130px] min-h-[130px] w-full bg-gray-200">
        <Fade delay={100}>
          <Image
            src={image?.url ?? ""}
            alt={`Imagen de ${title}`}
            fill={true}
            style={{ objectFit: "cover" }}
          />
        </Fade>
      </div>
      <Fade delay={250}>
        <div className="flex h-full flex-col justify-between gap-2 px-5 py-4">
          <div className="flex flex-col items-start gap-2">
            <Category category={category ?? "Arte"} />
              <h2 className="text-2xl leading-tight">
                {truncate(title ?? "Error en título")}
              </h2>
              <p className="text-blue underline">@{location_name}</p>
          </div>
          <div className="flex flex-col">
            <p className="mb-4 text-2xl capitalize">
              {formatDate(date ?? "01/01/2024")}
            </p>
            <Fade delay={350}>
              <Button fullWidth>Ver evento</Button>
            </Fade>
          </div>
        </div>
      </Fade>
    </article>
  );
};
