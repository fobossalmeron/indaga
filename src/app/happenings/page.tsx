"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { HappeningCard } from "./HappeningCard";
import { HappeningProps } from "./happenings.types";
import Link from "next/link";
import { happenings } from "./mockHappenings";
import { Fade } from "react-awesome-reveal";
import FechasHappenings from "@/assets/img/fechas_happenings.svg";
import blob_happenings from "@/assets/img/blob_happenings.svg?url";

export default function HappeningsAll() {
  const [entries, setEntries] = useState<{attributes: HappeningProps}[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:1337/api/happenings?populate=*', {
          headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        //intenta usar esto para regresar la imagen
        const returnImage = (entry: any) => {
          return `http://localhost:1337${entry.attributes.image.data.attributes.url}?format=webp&width=610&height=260`
        }
        
        const data = await res.json();
        const optimizedEntries = data.data.map((entry: {attributes: HappeningProps}) => ({
          ...entry,
          attributes: {
            ...entry.attributes,
            image: entry.attributes.image?.data?.attributes?.url
              ? `http://localhost:1337${entry.attributes.image.data.attributes.url}?format=webp&width=610&height=260`
              : null
          }
        }));
        setEntries(optimizedEntries);
      } catch (error) {
        console.error("Hubo un problema con la solicitud fetch:", error);
      }
    }
    
    fetchPosts();
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <Fade>
          <FechasHappenings />
        </Fade>
      </div>
      <div className="relative mt-16 flex flex-wrap justify-center gap-8">
        <Fade className="absolute -left-[15%] top-1/2">
          <Image src={blob_happenings} alt="" aria-hidden="true" />
        </Fade>
        <Fade damping={0.1}>
          {entries &&
            entries.map((entry: {attributes: HappeningProps}) => (
              <Link
                href={`/happenings/${entry.attributes.slug}`}
                key={entry.attributes.slug + "link"}
              >
                <HappeningCard
                  key={entry.attributes.slug}
                  {...entry.attributes}
                />
              </Link>
            ))}

          {/* {happenings.map((happening, index) => (
            <Link href={`/happenings/${happening.slug}`} key={index}>
              <HappeningCard
                key={index}
                slug={happening.slug}
                category={happening.category}
                title={happening.title}
                image={happening.image}
                location={happening.location}
                locationUrl={happening.locationUrl}
                fecha={happening.fecha}
              />
            </Link>
          ))} */}
        </Fade>
      </div>
    </>
  );
}
