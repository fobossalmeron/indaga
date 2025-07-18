"use client";
import { RouteCard } from "./RouteCard";
import { Fade } from "react-awesome-reveal";
import { Content } from "@prismicio/client";

export default function RoutesFull({
  routes,
}: {
  routes: Content.RouteDocument[];
}) {

  return (
    <div className="mx-auto flex w-full max-w-[1020px] flex-col items-center pb-24">
      <div className="relative mt-10 grid grid-cols-1 gap-8 px-5 sm:mt-16 sm:grid-cols-2">
        <Fade>
          {routes &&
            routes.map((route, index) => (
              <RouteCard
                key={index + "route"}
                route={route}
              />
            ))}
        </Fade>
      </div>
    </div>
  );
}
