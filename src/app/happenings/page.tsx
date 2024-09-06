import Image from "next/image";
import { HappeningCard } from "./HappeningCard";
import { HappeningProps } from "./happenings.types";
import Link from "next/link";

const happenings: HappeningProps[] = [
  {
    category: "Arte",
    title: "Evento de Arte",
    image:
      "https://festivalsantalucia.gob.mx/wp-content/uploads/grandes-eventos.png",
    location: "Lugar del Evento",
    locationUrl: "https://www.google.com",
    fecha: new Date("2024-10-20"),
    slug: "evento-de-arte",
  },
  {
    category: "Gastronomía",
    title: "Evento de Gastronomía",
    image:
      "https://festivalsantalucia.gob.mx/wp-content/uploads/grandes-eventos.png",
    location: "Lugar del Evento",
    locationUrl: "https://www.google.com",
    fecha: new Date("2024-10-21"),
    slug: "evento-de-gastronomia",
  },
  {
    category: "Música",
    title: "Evento de Música",
    image:
      "https://festivalsantalucia.gob.mx/wp-content/uploads/grandes-eventos.png",
    location: "Lugar del Evento",
    locationUrl: "https://www.google.com",
    fecha: new Date("2024-10-22"),
    slug: "evento-de-musica",
  },
  {
    category: "Cultura",
    title: "Evento de Cultura",
    image:
      "https://festivalsantalucia.gob.mx/wp-content/uploads/grandes-eventos.png",
    location: "Lugar del Evento",
    locationUrl: "https://www.google.com",
    fecha: new Date("2024-10-23"),
    slug: "evento-de-cultura",
  },
];

export default function HappeningsAll() {
  return (
    <>
      <p>19 de octubre al 03 de noviembre</p>
      <div className="flex gap-4 max-w-[1000px] flex-wrap justify-center">
        {happenings.map((happening, index) => (
          <Link href={`/happenings/${happening.slug}`} key={index}>
            <HappeningCard
              key={index}
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
