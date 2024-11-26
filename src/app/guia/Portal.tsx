"use client";
import Image from "next/image";
import PortalBg from "@/assets/img/portal.svg?unoptimized";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";

interface ImagenPortalProps {
  src? : StaticImageData | string;
  title: string;
  color: string;
  slug: string;
  image?: React.ReactNode;
  className?: string;
  rotation?: string;
}

export function Portal({
  src,
  title,
  color,
  slug,
  image,
  className,
  rotation,
}: ImagenPortalProps) {
  return (
    <Link href={`/guia/${slug}`}>
      <Fade>
        <div
          className={`flex flex-col items-end text-${color} group ${className}`}
        >
          <div className="grid h-[140px] md:h-[200px] md-lg:h-[385px]">
            <svg
              viewBox="0 0 150 275"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`col-start-1 row-start-1 h-full w-auto overflow-visible`}
            >
              {/* <path
                stroke="#00808B"
                strokeWidth="7"
                d="M3.5 74.9911V271.5H146.5V74.9911C146.5 35.5082 114.489 3.5 75 3.5C35.5114 3.5 3.5 35.5082 3.5 74.9911Z"
                className="opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-active:opacity-100"
              /> */}
              <path
                d="M3.5 74.9911V271.5H146.5V74.9911C146.5 35.5082 114.489 3.5 75 3.5C35.5114 3.5 3.5 35.5082 3.5 74.9911Z"
                fill="currentColor"
                className="origin-center transition-all duration-300 group-hover:scale-105 group-active:scale-105"
              />
            </svg>
            <Fade
              delay={200}
              className={`relative col-start-1 row-start-1 flex h-full w-full items-end justify-end self-end justify-self-center`}
            >
              <div className={`w-full transition-rotate duration-200 group-hover:${rotation} group-active:${rotation}`}>{image && image}</div>
            </Fade>
          </div>
          <h2 className="sr-only">{title}</h2>
        </div>
      </Fade>
    </Link>
  );
}
