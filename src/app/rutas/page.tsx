"use client";
import { RouteCard } from "./RouteCard";
import { happenings } from "./mockRoutes";
import { Fade } from "react-awesome-reveal";
import FraseRutas from "@/assets/img/frase_rutas.svg";

export default function RoutesAll() {
  return (
    <>
      <div className="flex justify-center text-ocre">
        <Fade>
          <FraseRutas />
        </Fade>
      </div>
      <div className="mt-16 flex w-full flex-wrap justify-center gap-4 pb-24">
        <Fade cascade damping={0.1}>
          {happenings.map((happening, index) => (
            <RouteCard
              key={index}
              slug={happening.slug}
              category={happening.category}
              title={happening.title}
              image={happening.image}
              description={happening.description}
            />
          ))}
        </Fade>
      </div>
    </>
  );
}
