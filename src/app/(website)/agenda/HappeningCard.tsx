"use client";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Content } from "@prismicio/client";
import { Category } from "@/app/components/Category";
import { Fade } from "react-awesome-reveal";
import { formatDate, isPastDate } from "@/utils/date-utils";

export function HappeningCard({
  data,
}: {
  data: Omit<Content.HappeningDocumentData, "description">;
}) {
  const { category, title, location_name, date, image, end_date } = data;
  const isPast = isPastDate(date);

  return (
    <article
      className={`group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-transparent transition-all duration-300 ease-in-out hover:shadow-md active:shadow-md sm:w-[305px] ${isPast ? "opacity-50" : "opacity-100"}`}
    >
      {" "}
      <div className="relative h-full max-h-[130px] min-h-[130px] w-full overflow-hidden bg-gray-200">
        <Fade delay={100} triggerOnce className="absolute h-full w-full">
          <Image
            src={image?.url ?? ""}
            alt={`Imagen de ${title}`}
            fill={true}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105 group-active:scale-105"
          />
        </Fade>
      </div>
      <div className="flex h-full flex-col justify-between gap-2 px-5 py-4">
        <Fade delay={250}>
          <div className="flex flex-col items-start gap-2">
            <Category category={category ?? "Arte"} />
            <h2
              className="text-2xl leading-tight sm:[display:-webkit-box] sm:max-w-full sm:overflow-hidden sm:[-webkit-box-orient:vertical] sm:[-webkit-line-clamp:2]"
              title={title ?? "Error en título"}
            >
              {title ?? "Error en título"}
            </h2>
            {location_name && (
              <p className="text-accent underline">@{location_name}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Fade delay={350}>
              <p className="mb-4 text-xl capitalize">
                {formatDate(date)}
                {end_date && ` - ${formatDate(end_date)}`}
              </p>
              <Button className="w-full">Ver evento</Button>
            </Fade>
          </div>
        </Fade>
      </div>
    </article>
  );
}
