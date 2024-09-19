import Image from "next/image";
import { CloudCTA } from "./CloudCTA";
import { Portal } from "./Portal";
import { categories } from "./categories";
import guia_blob from "@/assets/img/guia_blob.svg?url";

export default function GuideAll() {
  return (
    <>
      <CloudCTA full />
      <div className="flex max-w-[850px] flex-wrap items-end justify-center gap-x-6 gap-y-20 py-24">
        {Object.entries(categories).map(([slug, category], index) => (
          <Portal
            key={slug}
            title={category.title}
            slug={slug}
            src={category.bgImage}
            color={category.color}
            width={slug === "musica-en-vivo" ? 77 : undefined}
          />
        ))}
        <Image src={guia_blob} alt="Guía Blob" className="relative" />
      </div>
    </>
  );
}
