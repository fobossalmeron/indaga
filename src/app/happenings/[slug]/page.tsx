"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { happenings } from "../mockHappenings";
import Link from "next/link";

export default function Happening() {
  const params = useParams();
  const slug = params.slug as string;

  // Verifica si slug está definido
  if (!slug) {
    return <p>Cargando...</p>; // O un estado de carga
  }

  const event = happenings.find((happening) => happening.slug === slug);
  console.log(event);

  if (!event) {
    return (
      <div>
        Evento no encontrado.{" "}
        <Link href="/happenings">
          <Button>Volver a la lista de eventos</Button>
        </Link>
      </div>
    );
  }

  const { category, title, image, location, locationUrl, fecha } = event;

  return (
    <div>
      <div className="h-32 w-full bg-gray-200 relative">
        <Image
          src={image}
          alt={`Imagen de ${title}`}
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col p-8 py-4">
        <span className="text-sm text-gray-500">{category}</span>
        <h2>{title}</h2>
        <Link href={locationUrl} className="text-sm text-blue">
          <p>@{location}</p>
        </Link>
        <p>{fecha.toLocaleDateString()}</p>
        <Button>Ver evento</Button>
      </div>
    </div>
  );
}
