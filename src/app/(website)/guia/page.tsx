import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import GuideFull from "./GuideFull";

export default async function GuiaAll() {
  const client = await createClient();

  const lugares = await client.getAllByType<Content.LugarDocument>("lugar", {
    limit: 150,
    orderings: [
      {
        field: "my.lugar.nombre",
        direction: "asc",
      },
    ],
    graphQuery: `{
        lugar {
          nombre
          area
          categoria
          description
          link
          mapLink
          capsuleLink
        }
      }`,
  });

  return <GuideFull lugares={lugares} />;
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
