import HappeningFull from "./HappeningFull";
import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import { notFound } from 'next/navigation';

export default async function Happening({ params }: { params: { slug: string } }) {
  const client = createClient();

  try {
    const event = await client.getByUID<Content.HappeningDocument>(
      "happening",
      params.slug,
    );
    return <HappeningFull event={event} />;
  } catch (error) {
    console.error("Error al obtener el evento:", error);
    notFound();
  }
}
