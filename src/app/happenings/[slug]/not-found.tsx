import Link from "next/link";
import { Button } from "@/app/components/Button";
import Sad from "@/assets/img/sad.svg";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center py-10 text-center">
      <Sad className="text-indagaBlue mb-6 h-20 w-20" />
      <h1 className="mb-4 text-4xl">404 - Evento no encontrado</h1>
      <p className="mb-4 px-5">
        Lo sentimos, no pudimos encontrar el evento que estás buscando
        <br />
        Revisa que el enlace sea correcto.
      </p>
      <Link href="/happenings">
        <Button>Volver a Happenings</Button>
      </Link>
    </div>
  );
}
