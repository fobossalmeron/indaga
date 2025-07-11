import { createClient } from "@/prismicio";
import { Content, filter } from "@prismicio/client";
import HappeningsFull from "./HappeningsFull";

export default async function HappeningsAll() {
  const client = await createClient();

  // Calcular la fecha límite (hoy - 30 días) en formato YYYY-MM-DD
  const now = new Date();
  const limitDate = new Date(now.setDate(now.getDate() - 30))
    .toISOString()
    .split("T")[0];

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
      filters: [filter.dateAfter("my.happening.date", limitDate)],
      graphQuery: `{
        happening {
          title
          category
          location_name
          date
          image
          event_type
        }
      }`,
    },
  );

  return <HappeningsFull entries={entries} />;
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
