import { Content } from "@prismicio/client";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { Category } from "../../components/Category";
import { formatDate } from "@/app/utils/formatDate";
import ShareArrow from "@/assets/img/share_arrow.svg";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage, PrismicNextLink } from "@prismicio/next";

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
  console.log(event);
  return (
    <div className="mt-16 flex max-w-[920px] overflow-hidden rounded-3xl bg-white">
      <div className="h-100 relative w-1/2 max-w-[460px] bg-gray-200">
        <PrismicNextImage
          fill={true}
          alt=""
          field={image}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex w-1/2 flex-col items-start gap-6 px-12 py-11">
        <div className="flex flex-col items-start gap-1">
          <Category category={category ?? "Arte"} />
          <h2 className="text-4xl">{title}</h2>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-4xl capitalize">
            {formatDate(date ?? "1-1-2024")}
          </p>
          <PrismicNextLink
            field={location_url}
            className="text-xl font-medium text-blue underline"
          >
            <p>@{location_name}</p>
          </PrismicNextLink>
          {/* <Link
            href={
              location_url?.link_type === "Web" && "url" in location_url
                ? location_url.url.startsWith("https://")
                  ? location_url.url
                  : `https://${location_url.url}`
                : "#"
            }
            className="text-xl font-medium text-blue underline"
          >
            <p>@{location_name}</p>
          </Link> */}
        </div>
        <div className="dangerous-links leading-5">
          <PrismicRichText field={description} />
        </div>

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
  );
}
