"use client";
import Image from "next/image";
import { HappeningCard } from "./HappeningCard";
import { Content } from "@prismicio/client";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import FechasHappenings from "@/assets/img/fechas_happenings.svg";
import blob_happenings from "@/assets/img/blob_happenings.svg?url";

export default function HappeningsFull({
  entries,
}: {
  entries: Content.HappeningDocument[];
}) {
  return (
    <div className="animate-fadeIn2">
      <div className="flex justify-center px-5">
        <div className="w-full max-w-[284px]">
          <FechasHappenings width="100%" />
        </div>
      </div>
      <div className="relative mt-16 flex w-full flex-col flex-wrap justify-center gap-8 px-5 sm:flex-row">
        <Fade triggerOnce delay={500} className="absolute -left-[15%] top-1/2 hidden lg:block">
          <Image src={blob_happenings} alt="" aria-hidden="true" />
        </Fade>
        <Fade cascade damping={0.1}>
          {entries &&
            entries.map((entry) => (
              <Link href={`/happenings/${entry.uid}`} key={entry.uid + "link"}>
                <HappeningCard key={entry.uid} {...entry} />
              </Link>
            ))}
        </Fade>
      </div>
    </div>
  );
}
