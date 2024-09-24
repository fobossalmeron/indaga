"use client";

import Logo from "@/assets/img/logotipo.svg";
import { Fade } from "react-awesome-reveal";

export function Dedication() {
  return (
    <div className="mb-10 mt-40 flex flex-col items-center justify-center gap-4 sm:gap-8 md:mb-48 md:mt-52">
      <Fade triggerOnce>
        <p className="text-center text-lg font-medium leading-6 text-[#6F708B] md:text-xl">
          Con cariño <br /> para Monterrey
        </p>
        <Logo width={118.75} height={22.5} className="text-blue" />
      </Fade>
    </div>
  );
}
