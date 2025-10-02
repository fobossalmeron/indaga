import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import RoutesFull from "./RoutesFull";
import { Header } from "../../components/Header";

export default async function RoutesAll() {
  const client = await createClient();

  const routes = await client.getAllByType<Content.RouteDocument>("route", {
    limit: 100,
  });

  return (
    <div className="pt-16">
      <Header
        title="Rutas culturales"
        subtitle="Recorridos únicos por INDAGA y amigxs"
      />
      <RoutesFull routes={routes} />
    </div>
  );
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
