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
    <Fade>
      <div className="flex justify-center">
        <FechasHappenings />
      </div>
      <div className="relative mt-16 flex min-h-[350px] flex-wrap justify-center gap-8">
        <Fade triggerOnce delay={500} className="absolute -left-[15%] top-1/2">
          <Image src={blob_happenings} alt="" aria-hidden="true" />
        </Fade>
        <Fade>
          {entries &&
            entries.map((entry) => (
              <Link href={`/happenings/${entry.uid}`} key={entry.uid + "link"}>
                <HappeningCard key={entry.uid} {...entry} />
              </Link>
            ))}
        </Fade>
      </div>
    </Fade>
  );
}
