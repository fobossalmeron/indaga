"use client";
import { PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { Fade } from "react-awesome-reveal";
import { Content } from "@prismicio/client";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export function RouteCard({ route }: { route: Content.RouteDocument }) {
  const { title, image, description, featuring } = route.data;
  const isTreasureRoute = title?.toLowerCase().includes("treasure");
  const borderClass = isTreasureRoute ? "border-2 border-[#F3BB44]" : "";

  return (
    <Link href={`/rutas/${route.uid}`} className="block">
      <article
        className={`flex h-full w-full max-w-[469px] cursor-pointer flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 ease-in-out hover:shadow-lg ${borderClass}`}
      >
        <div className="relative h-[130px] w-full overflow-hidden bg-gray-200">
          <PrismicNextImage
            fill={true}
            alt=""
            field={image}
            loader={undefined}
            sizes="(max-width: 640px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex flex-1 flex-col p-5 py-4">
          <Fade delay={200}>
            <div className="flex flex-col items-start gap-2">
              <p className="text-base">
                Ruta de <span className="font-medium">{featuring}</span> x{" "}
                <span className="text-accent font-medium">INDAGA</span>
              </p>
              <h2 className="text-3xl">{title}</h2>
              <div className="dangerous-links leading-5">
                <PrismicRichText field={description} />
              </div>
            </div>
          </Fade>
          <div className="mt-auto pt-4">
            <Fade delay={350} className="flex w-full">
              <Button className="pointer-events-none w-fit px-10">
                Ver ruta
              </Button>
            </Fade>
          </div>
        </div>
      </article>
    </Link>
  );
}
