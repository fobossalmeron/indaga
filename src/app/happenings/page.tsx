"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { HappeningCard } from "./HappeningCard";
import { HappeningProps } from "./happenings.types";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import FechasHappenings from "@/assets/img/fechas_happenings.svg";
import blob_happenings from "@/assets/img/blob_happenings.svg?url";

export default function HappeningsAll() {
  const [entries, setEntries] = useState<HappeningProps[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch(
          "http://localhost:1337/api/happenings?populate=*",
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setEntries(data.data);
      } catch (error) {
        console.error("Hubo un problema con la solicitud fetch:", error);
      }
    }

    fetchPosts();
  }, []);

  return (
    <Fade>
      <div className="flex justify-center">
          <FechasHappenings />
      </div>
      <div className="relative mt-16 flex flex-wrap justify-center gap-8 min-h-[350px]">
        <Fade triggerOnce delay={500} className="absolute -left-[15%] top-1/2">
          <Image src={blob_happenings} alt="" aria-hidden="true" />
        </Fade>
        <Fade>
          {entries &&
            entries.map((entry) => (
              <Link
                href={`/happenings/${entry.attributes.slug}`}
                key={entry.attributes.slug + "link"}
              >
                <HappeningCard key={entry.attributes.slug} {...entry} />
              </Link>
            ))}
        </Fade>
      </div>
    </Fade>
  );
}
