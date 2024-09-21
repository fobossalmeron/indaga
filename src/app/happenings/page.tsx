import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import HappeningsFull from "./HappeningsFull";

export default async function HappeningsAll() {
  const client = createClient();

  const entries = await client.getAllByType<Content.HappeningDocument>("happening", {
    fetchOptions: {
      cache: "no-store",
      next: { tags: ["prismic", "happenings"] },
    },
    limit: 100,
    orderings: [
      {
        field: "my.happening.date",
        direction: "asc",
      },
    ],
  });

  return <HappeningsFull entries={entries} />;
}
