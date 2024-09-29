"use client";

import { Button } from "@/app/components/Button";
import Link from "next/link";
import { Category } from "../../components/Category";
import { formatDate } from "@/app/utils/formatDate";
import ShareArrow from "@/assets/img/whatsapp.svg";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Content, LinkField } from "@prismicio/client";
import blob_happening from "@/assets/img/blob_happening.svg?url";
import Image from "next/image";

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
      `${shareText} ${shareUrl}`,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div className="z-10 animate-fadeIn2 px-4">
        <div className="mx-auto mt-8 flex max-w-[920px] flex-col overflow-hidden rounded-3xl bg-white sm:mt-16 md:flex-row">
          <div className="relative min-h-60 w-full bg-gray-200 md:w-1/2 md:max-w-[460px]">
            <PrismicNextImage
              fill={true}
              alt=""
              field={image}
              priority={true}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="flex w-full flex-col items-start gap-6 px-5 py-11 sm:px-10 md:w-1/2 md:px-12">
            <div className="flex flex-col items-start gap-1">
              <Category category={category ?? "Arte"} />
              <h2 className="text-3xl sm:text-4xl">{title}</h2>
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="text-2xl capitalize sm:text-4xl">
                {formatDate(date ?? "1-1-2024")}
              </p>
              <PrismicNextLink
                field={validatedLocationUrl}
                className="text-lg font-medium text-blue underline sm:text-xl"
              >
                <p>@{location_name}</p>
              </PrismicNextLink>
            </div>
            <div className="dangerous-links leading-5">
              <PrismicRichText field={description} />
            </div>

            <div className="flex w-full flex-col gap-2 xsm:flex-row">
              <Link href={"/happenings"} className="w-full">
                <Button secondary className="w-full">
                  Volver
                </Button>
              </Link>
              <Button
                className="flex w-full items-center gap-3"
                onClick={handleShare}
              >
                Compartir <ShareArrow width={20} height={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1/4 -right-[11%] z-[0] animate-fadeIn4">
        <Image src={blob_happening} alt="" aria-hidden="true" />
      </div>
    </>
  );
}
