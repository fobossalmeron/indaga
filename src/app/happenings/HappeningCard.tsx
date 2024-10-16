"use client";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { Content } from "@prismicio/client";
import { Category } from "@/app/components/Category";
import { Fade } from "react-awesome-reveal";
import { formatDate } from "@/app/utils/formatDate";
import { truncate } from "@/app/utils/truncate";

interface HappeningCardProps
  extends Omit<Content.HappeningDocument, "description"> {}

export const HappeningCard: React.FC<HappeningCardProps> = ({ data }) => {
  const { category, title, location_name, date, image } = data;

  return (
    <article className="group flex h-full w-full sm:w-[305px] flex-col overflow-hidden rounded-3xl bg-white shadow-transparent transition-all duration-300 ease-in-out hover:shadow-md active:shadow-md">
      <div className="relative h-full max-h-[130px] min-h-[130px] w-full overflow-hidden bg-gray-200">
        <Fade delay={100} triggerOnce className="h-full absolute w-full">
          <Image
            src={image?.url ?? ""}
            alt={`Imagen de ${title}`}
            fill={true}
            loading="lazy"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105 group-active:scale-105"
          />
        </Fade>
      </div>
      <div className="flex h-full flex-col justify-between gap-2 px-5 py-4">
        <Fade delay={250}>
          <div className="flex flex-col items-start gap-2">
            <Category category={category ?? "Arte"} />
            <h2 className="text-2xl leading-tight">
              {truncate(title ?? "Error en título", 40)}
            </h2>
            <p className="text-blue underline">@{location_name}</p>
          </div>
          <div className="flex flex-col">
            <Fade delay={350}>
              <p className="mb-4 text-2xl capitalize">
                {formatDate(date ?? "01/01/2024")}
              </p>
              <Button fullWidth>Ver evento</Button>
            </Fade>
          </div>
        </Fade>
      </div>
    </article>
  );
};
