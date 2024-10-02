"use client";
import Image from "next/image";
import PortalBg from "@/assets/img/portal.svg?unoptimized";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";

interface ImagenPortalProps {
  src: StaticImageData | string;
  title: string;
  color: string;
  slug: string;
  width?: number;
  className?: string;
}

export function Portal({
  src,
  title,
  color,
  width,
  slug,
  className,
}: ImagenPortalProps) {
  return (
    <Link href={`/guia/${slug}`}>
      <Fade>
        <div
          className={`flex flex-col items-center text-${color} group ${className}`}
        >
          <div className="grid h-[140px] md:h-[200px] md-lg:h-[275px]">
            <svg
              viewBox="0 0 150 275"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`col-start-1 row-start-1 h-full w-auto`}
            >
              <path
                stroke="currentColor"
                strokeWidth="7"
                d="M3.5 74.9911V271.5H146.5V74.9911C146.5 35.5082 114.489 3.5 75 3.5C35.5114 3.5 3.5 35.5082 3.5 74.9911Z"
              />
              <path
                d="M3.5 74.9911V271.5H146.5V74.9911C146.5 35.5082 114.489 3.5 75 3.5C35.5114 3.5 3.5 35.5082 3.5 74.9911Z"
                fill="currentColor"
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
              />
            </svg>
            <Fade
              delay={200}
              className="relative left-1.5 col-start-1 row-start-1 h-full w-full self-end justify-self-center"
            >
              <Image
                src={src}
                alt={title}
                fill={true}
                style={{ objectFit: "contain" }}
                className="pt-[10%] pointer-events-none col-start-1 h-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Fade>
          </div>
          <p className="sr-only">{title}</p>
        </div>
      </Fade>
    </Link>
  );
}
