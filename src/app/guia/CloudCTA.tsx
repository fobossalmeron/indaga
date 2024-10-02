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
      <div className="relative flex justify-center text-2xl font-medium h-[120px] xsm:h-[150px] md:h-[215px]">
        {full && <CAL className="h-full"/>}
        <a
          href="/guia.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1`}
        >
          <p
            className={`text-base xsm:text-xl md:text-2xl font-medium ${full ? "text-blue" : "text-white"} underline`}
          >
            Descarga la Guía
          </p>
          <CloudAlone
            className={`h-full w-auto ${full ? "text-blue" : "text-white"} hover:text-${hoverStroke} transition-all duration-300`}
          />
        </a>
        {full && <CAR className="h-full"/>}
      </div>
    </div>
  );
};
