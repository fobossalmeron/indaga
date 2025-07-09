import Link from "next/link";
import { Button } from "@/app/components/Button";
import Sad from "@/assets/img/sad.svg";

export default function NotFound() {
  return (
    <div className="mb-20 flex min-h-[60vh] flex-col items-center justify-center px-4 pt-20 text-center">
      <Sad className="text-accent mb-6 h-20 w-20" />
      <h1 className="mb-4 text-4xl">404 - Artículo no encontrado</h1>
      <p className="mb-8 text-lg">
        Lo sentimos, no pudimos encontrar el artículo que estás buscando.
      </p>
      <Link href="/blog">
        <Button>Volver al Blog</Button>
      </Link>
    </div>
  );
}
