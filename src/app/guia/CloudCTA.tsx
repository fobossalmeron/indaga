"use client";
import { Fade } from "react-awesome-reveal";
import CloudAlone from "@/assets/img/cloud_alone.svg";
import CAL from "@/assets/img/cloud_arrow_left.svg";
import CAR from "@/assets/img/cloud_arrow_right.svg";

interface CloudCTAProps {
  full?: boolean;
  hoverStroke?: string;
}

export const CloudCTA: React.FC<CloudCTAProps> = ({
  full = false,
  hoverStroke = "blue",
}) => {
  return (
    <div className="animate-fadeIn2">
      <div className="relative flex justify-center text-2xl font-medium">
        {full && (
         <CAL />
        )}
        <a
          href="/guia.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1`}
        >
          <p className={`text-2xl font-medium ${full ? 'text-blue' : 'text-white'} underline`}>
            Descarga la Guía
          </p>
          <CloudAlone className={`h-[216px] w-[329px] ${full ? 'text-blue' : 'text-white'} hover:text-${hoverStroke} transition-all duration-300`} />
        </a>
        {full && (
         <CAR />
        )}
      </div>
    </div>
  );
};
