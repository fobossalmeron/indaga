import Image from "next/image";
import { HappeningCard } from "./HappeningCard";
import { HappeningProps } from "./happenings.types";
import Link from "next/link";
import { happenings } from "./mockHappenings";

export default function HappeningsAll() {
  return (
    <>
      <p>19 de octubre al 03 de noviembre</p>
      <div className="flex gap-4 max-w-[1000px] flex-wrap justify-center">
        {happenings.map((happening, index) => (
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
        ))}
      </div>
    </>
  );
}
