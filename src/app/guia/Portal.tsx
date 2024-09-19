"use client";
import Image from "next/image";
import PortalBg from "@/assets/img/portal.svg?unoptimized";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";

interface ImagenPortalProps {
  src: StaticImageData;
  title: string;
  color: string;
  slug: string;
  width?: number;
}

export function Portal({ src, title, color, width, slug }: ImagenPortalProps) {
  return (
    <Link href={`/guia/${slug}`}>
      <Fade>
        <div className={`flex flex-col items-center text-${color} group`}>
          <div className="grid">
            <svg
              width="151"
              height="276"
              viewBox="0 0 151 276"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`col-start-1 row-start-1`}
            >
              <path
                stroke="currentColor"
                strokeWidth="7"
                d="M4.41602 75.4869V271.909H147.333V75.4869C147.333 36.0216 115.34 4.02835 75.8746 4.02835C36.4093 4.02835 4.41602 36.0216 4.41602 75.4869Z"
              />
              <path
                fill="currentColor"
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                d="M4.41602 75.4869V271.909H147.333V75.4869C147.333 36.0216 115.34 4.02835 75.8746 4.02835C36.4093 4.02835 4.41602 36.0216 4.41602 75.4869Z"
              />
            </svg>
            <Fade
              delay={200}
              className="col-start-1 row-start-1 self-end justify-self-center"
            >
              <Image
                src={src}
                alt={title}
                width={width ?? 140}
                height={0}
                className="pointer-events-none col-start-1 transition-transform duration-300 group-hover:scale-105"
              />
            </Fade>
          </div>
          <p className="sr-only">{title}</p>
        </div>
      </Fade>
    </Link>
  );
}
