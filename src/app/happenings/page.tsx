import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import HappeningsFull from "./HappeningsFull";

export default async function HappeningsAll() {
  const client = createClient();

  const entries = await client.getAllByType<Content.HappeningDocument>(
    "happening",
    {
      limit: 150,
      orderings: [
        {
          field: "my.happening.date",
          direction: "desc",
        },
      ],
    },
  );

  return <HappeningsFull entries={entries} />;
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
