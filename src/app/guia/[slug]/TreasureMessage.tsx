"use client";

import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import diamond from "@/assets/img/diamond.svg?url";

export function TreasureMessage() {
  return (
    <Fade>
      <p className="mb-20 ml-[33%] mt-16 flex max-w-[300px] flex-row gap-4 leading-5 text-eerie">
        <Image src={diamond} alt="Treasure Hunt" width={26} height={26} />
        Treasure hunt: menciona que vienes de Indaga y recibe una sorpresa
      </p>
    </Fade>
  );
}
