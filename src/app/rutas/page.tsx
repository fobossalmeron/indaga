import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import RoutesFull from "./RoutesFull";
import FraseRutas from "@/assets/img/frase_rutas.svg";

export default async function RoutesAll() {
  const client = createClient();

  const routes = await client.getAllByType<Content.RouteDocument>("route", {
    fetchOptions: {
      cache: "no-store",
      next: { tags: ["prismic", "route"] },
    },
    limit: 100,
  });

  return (
    <>
      <div className="flex animate-fadeIn2 justify-center px-5 text-ocre">
        <div className="w-full max-w-[284px]">
          <FraseRutas width="100%" />
        </div>
      </div>
      <RoutesFull routes={routes} />
    </>
  );
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)