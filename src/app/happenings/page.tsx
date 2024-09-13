import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
// import { happenings } from "./mockHappenings";
import HappeningsFull from "./HappeningsFull";

export default async function HappeningsAll() {
  const client = createClient();

  const entries = await client.getAllByType<Content.HappeningDocument>("happening", {
    fetchOptions: {
      cache: "no-store",
      next: { tags: ["prismic", "happenings"] },
    },
    limit: 20,
    orderings: [
      {
        field: "my.happening.date",
        direction: "desc",
      },
    ],
  });

  // console.log(entries);

  return <HappeningsFull entries={entries} />;
}
