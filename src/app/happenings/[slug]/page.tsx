import HappeningFull from "./HappeningFull";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Loading from './loading';

// Función para generar rutas estáticas
export async function generateStaticParams() {
  const client = createClient();
  const happenings = await client.getAllByType("happening");

  return happenings.map((happening) => ({
    slug: happening.uid,
  }));
}

// Componente de la página
export default async function Happening({ params }: { params: { slug: string } }) {
  const client = createClient();

  try {
    const event = await client.getByUID<Content.HappeningDocument>(
      "happening",
      params.slug,
    );
    return (
      <Suspense fallback={<Loading />}>
        <HappeningFull event={event} />
      </Suspense>
    );
  } catch (error) {
    console.error(`Error al obtener el evento ${params.slug}:`, error);
    notFound();
  }
}

// Habilita ISR
export const revalidate = 60; // revalidar cada minuto