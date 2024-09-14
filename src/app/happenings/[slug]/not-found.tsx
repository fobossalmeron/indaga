import Link from "next/link";
import { Button } from "@/app/components/Button";

export default function NotFound() {
  return (
    <div className="py-10 text-center mx-auto max-w-4xl flex flex-col items-center">
      <h1 className="font-bold mb-4 text-2xl">Evento no encontrado</h1>
      <p className="mb-4">
        Lo sentimos, no pudimos encontrar el evento que estás buscando.
        <br />
        Revisa que el enlace sea correcto.
      </p>
      <Link href="/happenings">
        <Button className="">Volver a la lista de eventos</Button>
      </Link>
    </div>
  );
}