import { createClient } from "@/prismicio";
import { Content } from "@prismicio/client";
import BlogFull from "./BlogFull";

async function getPosts() {
  const client = await createClient();

  return await client.getAllByType<Content.PostDocument>("post", {
    limit: 150,
    orderings: [
      {
        field: "my.post.date",
        direction: "desc",
      },
    ],
    graphQuery: `{
      post {
        title
        meta_description
        author
        date
        hero
      }
    }`,
  });
}

export default async function BlogAll() {
  const posts = await getPosts();
  return <BlogFull posts={posts} />;
}

export const revalidate = 3600; // Revalidar cada hora (3600 segundos)
