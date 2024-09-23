"use client";

import { Button } from "@/app/components/Button";
import Link from "next/link";
import { Category } from "../../components/Category";
import { formatDate } from "@/app/utils/formatDate";
import ShareArrow from "@/assets/img/whatsapp.svg";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Content, LinkField } from "@prismicio/client";
import { Fade } from "react-awesome-reveal";

export default function HappeningsFull({
  event,
}: {
  event: Content.HappeningDocument;
}) {
  const {
    category,
    title,
    image,
    location_name,
    location_url,
    date,
    description,
  } = event.data;

  const validatedLocationUrl =
    location_url.link_type === "Web" && "url" in location_url
      ? location_url?.url?.startsWith("https://") ||
        location_url?.url?.startsWith("http://")
        ? location_url
        : ({
            link_type: "Web",
            url: `https://${location_url.url}`,
            target: "_blank",
          } as LinkField)
      : location_url;

  const handleShare = () => {
    const shareText = `Echa un vistazo a este evento: ${title}`;
    const shareUrl = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareText} ${shareUrl}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Fade className="px-4">
    <div className="mt-8 sm:mt-16 flex flex-col md:flex-row max-w-[920px] overflow-hidden rounded-3xl bg-white mx-auto">
      <div className="min-h-60 relative w-full md:w-1/2 md:max-w-[460px] bg-gray-200">
        <PrismicNextImage
          fill={true}
          alt=""
          field={image}
          priority={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex w-full md:w-1/2 flex-col items-start gap-6 px-5 sm:px-10 md:px-12 py-11">
        <div className="flex flex-col items-start gap-1">
          <Category category={category ?? "Arte"} />
          <h2 className="text-3xl sm:text-4xl">{title}</h2>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-2xl sm:text-4xl capitalize">
            {formatDate(date ?? "1-1-2024")}
          </p>
          <PrismicNextLink
            field={validatedLocationUrl}
            className="text-lg sm:text-xl font-medium text-blue underline"
          >
            <p>@{location_name}</p>
          </PrismicNextLink>
        </div>
        <div className="dangerous-links leading-5">
          <PrismicRichText field={description} />
        </div>

        <div className="flex flex-col xsm:flex-row w-full gap-2">
          <Link href={"/happenings"} className="w-full">
            <Button secondary className="w-full">
              Volver
            </Button>
          </Link>
          <Button className="w-full flex items-center gap-3 " onClick={handleShare}>
            Compartir <ShareArrow width={20} height={20} />
          </Button>
        </div>
      </div>
    </div>
    </Fade>
  );
}
