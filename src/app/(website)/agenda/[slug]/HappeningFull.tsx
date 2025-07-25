"use client";

import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Category } from "../../../components/Category";
import { formatDate } from "@/utils/date-utils";
import ShareArrow from "@/assets/img/whatsapp.svg";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";
import { Content, LinkField } from "@prismicio/client";
import { PromoterCTA } from "../PromoterCTA";
import { ArrowLeft } from "lucide-react";

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
    end_date,
    description,
    time,
    cost,
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
    const shareText = `Te invito a: ${title}`;
    const shareUrl = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareText} ${shareUrl}`,
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="animate-fadeIn2 z-10 mt-4 px-5 pb-10 sm:mt-12 sm:pb-24">
      <Link href="/agenda">
        <Button variant="outline" className="mb-4 gap-2 sm:mb-8">
          <ArrowLeft className="h-4 w-4" />
          Volver a Agenda
        </Button>
      </Link>
      <div className="mx-auto flex max-w-[1020px] flex-col overflow-hidden rounded-3xl bg-white md:flex-row">
        <div className="relative min-h-60 w-full bg-gray-200 md:w-1/2 md:max-w-[460px]">
          <PrismicNextImage
            fill
            alt=""
            field={image}
            loader={undefined}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex w-full flex-col items-start gap-6 px-5 py-11 sm:px-10 md:w-1/2 md:px-12">
          <div className="flex flex-col items-start gap-1">
            <Category category={category ?? "Arte"} />
            <h2 className="text-3xl sm:text-4xl">{title}</h2>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="text-2xl capitalize sm:text-3xl">
              {formatDate(date)}
              {end_date && ` - ${formatDate(end_date)}`}
            </p>
            {location_name && (
              <PrismicNextLink
                field={validatedLocationUrl}
                className="text-accent text-lg font-medium underline sm:text-xl"
              >
                <p>@{location_name}</p>
              </PrismicNextLink>
            )}
          </div>
          <div className="mt-3 flex flex-row flex-wrap gap-4">
            {time && time.length > 0 && (
              <div className="border-accent relative rounded-xl border-2 px-4 py-3">
                <h3 className="text-accent absolute -top-2 left-2 bg-white px-2 text-sm font-medium tracking-wider uppercase">
                  Horario
                </h3>
                <div className="dangerous-links text-accent mt-2 leading-6">
                  <PrismicRichText field={time} />
                </div>
              </div>
            )}

            {cost &&
              cost.length > 0 &&
              cost[0]?.type === "paragraph" &&
              cost[0]?.text !== "-" && (
                <div className="relative rounded-xl border-2 border-gray-300 px-4 py-3">
                  <h3 className="absolute -top-2 left-2 bg-white px-2 text-sm font-medium tracking-wider text-gray-700 uppercase">
                    Costo
                  </h3>
                  <div className="dangerous-links mt-2 leading-6">
                    <PrismicRichText field={cost} />
                  </div>
                </div>
              )}
          </div>
          <div className="dangerous-links leading-5">
            <PrismicRichText field={description} />
          </div>
          <div className="xsm:grid-cols-2 grid w-full grid-cols-1 gap-2">
            <Button className="w-full" onClick={handleShare}>
              Compartir <ShareArrow width={20} height={20} />
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-10 flex w-full items-center justify-center sm:mt-20">
        <PromoterCTA center />
      </div>
    </div>
  );
}
