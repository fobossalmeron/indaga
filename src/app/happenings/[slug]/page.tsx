import Link from "next/link";
import { Button } from "@/app/components/Button";
import HappeningFull from "./HappeningFull";
import { HappeningProps } from "../happenings.types";
import { createClient } from "@/prismicio";
import Loading from "./loading";
import { Content } from "@prismicio/client";

export default async function Happening({
  params,
}: {
  params: { slug: string };
}) {
  const client = createClient();
  let event;
  try {
    event = await client.getByUID<Content.HappeningDocument>("happening", params.slug);
  } catch (error) {
    console.log("Error al obtener el evento:", error);
  }
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
