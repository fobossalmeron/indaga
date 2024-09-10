"use client";
import { Header } from "@/app/components/Header";
import { Fade } from "react-awesome-reveal";
import blob_happening from "@/assets/img/blob_happening.svg?url";
import Image from "next/image";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Fade className="absolute -bottom-1/4 -right-[11%] z-[-1]">
        <Image src={blob_happening} alt="" aria-hidden="true"  />
      </Fade>
    </>
  );
}
