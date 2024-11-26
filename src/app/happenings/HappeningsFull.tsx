"use client";
import { HappeningCard } from "./HappeningCard";
import { Content } from "@prismicio/client";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";

export default function HappeningsFull({
  entries,
}: {
  entries: Content.HappeningDocument[];
}) {
  return (
    <div className="animate-fadeIn2">
      <div className="flex justify-center px-5">
      </div>
      <div className="relative mt-10 sm:mt-16 flex w-full flex-col flex-wrap justify-center gap-8 px-5 sm:flex-row">
        <Fade>
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
