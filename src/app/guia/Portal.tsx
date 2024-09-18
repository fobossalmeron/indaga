"use client";
import Image from "next/image";
import PortalBg from "@/assets/img/portal.svg";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
interface ImagenPortalProps {
  src: StaticImageData;
  title: string;
  className?: string;
  slug: string;
  width?: number;
}

export function Portal({ src, title, className,width, slug }: ImagenPortalProps) {
  return (
    <Link href={`/guia/${slug}`}>
        <Fade>
      <div className={`flex flex-col items-center ${className}`}>
        <div className="grid">
          <PortalBg className="col-start-1 row-start-1" />
          <Image
            src={src}
            alt={title}
            width={width ? width : 140}
            height={0}
            className="col-start-1 row-start-1 justify-self-center self-end"
          />
        </div>
        <p className="sr-only">{title}</p>
      </div>
      </Fade>
    </Link>
  );
}
