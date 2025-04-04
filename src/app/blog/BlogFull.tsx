"use client";

import { Content } from "@prismicio/client";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";

interface BlogFullProps {
  posts: Content.PostDocument[];
}

export default function BlogFull({ posts }: BlogFullProps) {
  return (
    <div className="animate-fadeIn2">
      <div className="mt-10 flex w-full flex-wrap justify-center gap-y-10 sm:mt-20 md:gap-y-20 md:pb-36 lg:pb-28">
        {posts.map((post) => (
          <Fade key={post.id} triggerOnce>
            <Link
              href={`/blog/${post.uid}`}
              className="group relative mx-4 w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <div className="aspect-w-16 aspect-h-9">
                {post.data.hero?.url && (
                  <Image
                    src={post.data.hero.url}
                    alt={post.data.hero.alt || ""}
                    className="h-full w-full object-cover"
                    width={1000}
                    height={1000}
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2 text-xl text-gray-900 group-hover:text-indigo-600">
                  {post.data.title}
                </h3>
                <p className="line-clamp-2 text-gray-600">
                  {post.data.meta_description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>{post.data.author}</span>
                  <span>
                    {post.data.date &&
                      new Date(post.data.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </span>
                </div>
              </div>
            </Link>
          </Fade>
        ))}
      </div>
    </div>
  );
}
