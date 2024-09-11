"use client";

import Image from "next/image";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { Category } from "../../components/Category";
import { formatDate } from "@/app/utils/formatDate";
import ShareArrow from "@/assets/img/share_arrow.svg";
import { Fade } from "react-awesome-reveal";
import { HappeningProps } from "../happenings.types";
// import BlocksRenderer from "@strapi/blocks-react-renderer";

export default function HappeningsFull({ event }: { event: HappeningProps }) {
  const { attributes } = event;
  const { category, title, image, location, locationUrl, date, description } =
    attributes;

  return (
    <Fade>
      <div className="mt-16 flex max-w-[920px] overflow-hidden rounded-3xl bg-white">
        <div className="h-100 relative w-1/2 max-w-[460px] bg-gray-200">
          <Image
            src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${image.data.attributes.url}`}
            alt={`Imagen de ${title}`}
            fill={true}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex w-1/2 flex-col items-start gap-6 px-12 py-11">
          <div className="flex flex-col items-start gap-1">
            <Category category={category} />
            <h2 className="text-4xl">{title}</h2>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="text-4xl capitalize">{formatDate(date)}</p>
            <Link
              href={locationUrl}
              className="text-xl font-medium text-blue underline"
            >
              <p>@{location}</p>
            </Link>
          </div>
          <div
            className="dangerous-links leading-5"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
          <div className="flex w-full gap-2">
            <Link href={"/happenings"} className="w-full">
              <Button secondary className="w-full">
                Volver
              </Button>
            </Link>
            <Button className="w-10/12">
              Compartir <ShareArrow />
            </Button>
          </div>
        </div>
      </div>
    </Fade>
  );
}
