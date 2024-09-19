"use client";

import { categories } from "../categories";
import { Fade } from "react-awesome-reveal";
import { Button } from "@/app/components/Button";
import BackArrow from "@/assets/img/back_arrow.svg";
import Link from "next/link";


export function CategoryChip({ slug }: { slug: string }) {
  const category = categories[slug as keyof typeof categories];

  return (
    <Fade>
      <div
        className={`flex items-center gap-2 rounded-full bg-${category.color} py-3 pl-5 pr-8`}
      >
        <div className="flex h-10 w-10 items-center justify-center [&>*]:h-full [&>*]:w-auto">
          {category.image}
        </div>
        <span className="text-2xl text-white">{category.title}</span>
      </div>
      <Link href="/guia">
            <Button secondary thin className="gap-3 pl-4 pr-4">
              <BackArrow />
              Volver a las categorías
            </Button>
          </Link>
    </Fade>
  );
}
