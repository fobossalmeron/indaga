"use client";

import { Fade } from "react-awesome-reveal";
import FraseRutasSkeleton from "@/assets/img/frase_rutas_skeleton.svg";

export default function Loading() {
  return (
    <Fade>
      <div className="flex justify-center">
        <FraseRutasSkeleton />
      </div>
      <div className="mt-16 flex min-h-[500px] w-full flex-wrap justify-center gap-8 pb-24">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="duration-600 flex w-full max-w-[469px] flex-col overflow-hidden rounded-2xl bg-white outline-2 outline-transparent transition-all ease-in-out"
          >
            <div className="relative h-32 w-full bg-gray-200"></div>
            <div className="flex flex-col items-start gap-2 p-5 py-4">
              <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-8 w-3/4 animate-pulse bg-gray-200 rounded-2xl"></div>
              <div className="h-16 w-full animate-pulse bg-gray-200 rounded-2xl"></div>
              <div className="h-10 w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </Fade>
  );
}
