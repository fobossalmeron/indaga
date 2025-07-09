import CloudAlone from "@/assets/img/cloud_alone.svg";
import CAL from "@/assets/img/cloud_arrow_left.svg";
import CAR from "@/assets/img/cloud_arrow_right.svg";

export function CloudCTA({
  full = false,
  hoverStroke = "accent",
}: {
  full?: boolean;
  hoverStroke?: string;
}) {
  return (
    <div className={`animate-fadeIn2`}>
      <div className="xsm:h-[150px] relative flex h-[120px] justify-center text-2xl font-medium text-inherit transition-all duration-300 md:h-[215px]">
        {full && <CAL className="h-full transition-all duration-300" />}
        <a
          href="/INDAGA_GUIA_2024v2.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={`grid place-items-center text-inherit transition-all duration-300 active:scale-95 [&>*]:col-start-1 [&>*]:row-start-1 hover:text-${hoverStroke} active:text-${hoverStroke} group`}
        >
          <p
            className={`xsm:text-xl text-base font-medium md:text-2xl ${full ? "text-blue hover:text-inherit active:text-inherit" : "text-white"} underline`}
          >
            Descarga la Guía
          </p>
          <CloudAlone
            className={`h-full w-auto group-hover:text-${hoverStroke} group-active:text-${hoverStroke} text-inherit transition-all duration-300`}
          />
        </a>
        {full && (
          <CAR className="[&>path]:fill-indagaBlue h-full transition-all duration-300" />
        )}
      </div>
    </div>
  );
}
