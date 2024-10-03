"use client";

import Image from "next/image";
import { Fade } from "react-awesome-reveal";
import diamond from "@/assets/img/diamond.svg?url";

interface TreasureMessageProps {
  className?: string;
}

export function TreasureMessage({ className = "" }: TreasureMessageProps) {
  return (
    <div className={className}>
      <div className="flex max-w-[350px] text-sm sm:text-base flex-row items-start gap-3 rounded-2xl border-2 border-[#00A4FF] bg-[#b4e4ff75] p-4 leading-5 text-eerie animate-fadeIn2">
        <Image src={diamond} alt="Treasure Hunt" width={26} height={26} />
        <p>
          <span className="font-medium">Treasure hunt</span>: menciona que
          vienes de Indaga y recibe una sorpresa
        </p>
      </div>
    </div>
  );
}
