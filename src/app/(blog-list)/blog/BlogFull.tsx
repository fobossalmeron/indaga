"use client";

import { Content } from "@prismicio/client";
import { Fade } from "react-awesome-reveal";
import { ArticleCard } from "./ArticleCard";
interface BlogFullProps {
  posts: Content.PostDocument[];
}

export default function BlogFull({ posts }: BlogFullProps) {
  return (
    <>
      <div className="animate-fadeIn2">
        <div className="mt-10 flex w-full flex-wrap items-start justify-start gap-6 px-5 pb-[5%] sm:mt-20 sm:pb-[10%] md:gap-8">
          {posts.map((post) => (
            <Fade key={post.id} triggerOnce>
              <ArticleCard post={post} />
              <ArticleCard post={post} />
              <ArticleCard post={post} />
            </Fade>
          ))}
        </div>
      </div>
    </>
  );
}
