"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { categorias } from "../categorias";
import Link from "next/link";

export default function Categoria() {
  const params = useParams();
  const slug = params.slug as string;

  // Verifica si slug está definido
  if (!slug) {
    return <p>Cargando...</p>; // O un estado de carga
  }

  const event = categorias.find((categoria) => categoria.slug === slug);

  if (!event) {
    return (
      <div>
        Categoria no encontrado.{" "}
        <Link href="/guia">
          <Button>Volver a la guía</Button>
        </Link>
      </div>
    );
  }

  const { title, color, locations } = event;

  return (
    <div className="flex flex-col">
      <Link href="/guia">
        <Button secondary>Volver a la guía</Button>
      </Link>
      <div>
        <div className={`h-100 w-full relative text-white ${color}`}>
          <h2 className="px-10 py-2 text-2xl text-center text-white">{title}</h2>
        </div>
        <div className="flex flex-col p-8 py-4">
          {locations.map((location, index) => (
            <p key={index}>{location}</p>
          ))}
          <div className="flex gap-2"></div>
        </div>
      </div>
    </div>
  );
}
