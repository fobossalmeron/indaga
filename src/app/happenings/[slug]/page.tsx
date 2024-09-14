import HappeningFull from "./HappeningFull";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { notFound } from 'next/navigation';

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
    return <HappeningFull event={event} />;
  } catch (error) {
    console.error(`Error al obtener el evento ${params.slug}:`, error);
    notFound();
  }
}

export const revalidate = 3600; // Revalidar cada hora