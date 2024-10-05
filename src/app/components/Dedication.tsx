"use client";

import Logo from "@/assets/img/logotipo.svg";
import { Fade } from "react-awesome-reveal";

export function Dedication() {
  return (
    <div className="mb-10 mt-40 flex flex-col items-center justify-center gap-4 sm:gap-4 md:mb-48 md:mt-60">
      <Fade triggerOnce>
        <p className="md:text-l max-w-72 text-center text-lg font-medium leading-6 text-[#6F708B]">
          Un homenaje a la riqueza cultural de nuestra ciudad
        </p>
        <Logo width={95} height={18} className="text-blue" />
      </Fade>
    </div>
  );
}
