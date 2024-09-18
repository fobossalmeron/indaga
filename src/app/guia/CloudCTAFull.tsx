"use client";
import { Fade } from "react-awesome-reveal";
import DescargaGuia from "@/assets/img/descarga_guia.svg";

export const CloudCTAFull: React.FC = () => {
  return (
    <Fade>
      <div className="flex justify-center relative font-medium text-blue text-2xl ">
        <DescargaGuia />
        <a href="guia.pdf" target="_blank">
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 underline">Descarga la Guía</p>
        </a>
      </div>
    </Fade>
  );
};

