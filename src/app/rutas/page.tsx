import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import RoutesFull from "./RoutesFull";

export default async function RoutesAll() {
  const client = createClient();

  const routes = await client.getAllByType<Content.RouteDocument>("route", {
    fetchOptions: {
      cache: "no-store",
      next: { tags: ["prismic", "route"] },
    },
    limit: 100,
  });

  return <RoutesFull routes={routes} />;
}
