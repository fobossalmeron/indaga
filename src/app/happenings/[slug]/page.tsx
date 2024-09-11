import Link from "next/link";
import { Button } from "@/app/components/Button";
import HappeningFull from "./HappeningFull";
import { HappeningProps } from "../happenings.types";
import Loading from "./loading";

export default async function Happening({
  params,
}: {
  params: { slug: string };
}) {
  async function getEvent(slug: string): Promise<HappeningProps | null> {
    const url = `http://127.0.0.1:1337/api/happenings?populate=*&filters[slug][$eq]=${slug}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 60 }, // Revalidar cada 60 segundos
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data.data[0] || null;
    } catch (error) {
      console.error("Error fetching event:", error);
      return null;
    }
  };

  const event = await getEvent(params.slug);

  if (!event) {
    return (
      //Esto hay que mejorarlo
      <div>
        <h1>Evento no encontrado</h1>
        <p>Lo sentimos, no pudimos encontrar el evento que estás buscando.</p>
        <Link href="/happenings">
          <Button>Volver a la lista de eventos</Button>
        </Link>
      </div>
    );
  }

  return <HappeningFull event={event} />;

}
