import Image from "next/image";
import festival_santa_lucia from "@/assets/img/festival_santa_lucia.svg?url";
import home_blob from "@/assets/img/home_blob.svg?url";
import Link from "next/link";
import HappeningsHomeLink from "@/assets/img/happenings_home_link.svg?unoptimized";
import RutasHomeLink from "@/assets/img/rutas_home_link.svg?unoptimized";
import GuiaHomeLink from "@/assets/img/guia_home_link.svg?unoptimized";
import { Dedication } from "./Dedication";

const NavLink = ({
  href,
  children,
  svg,
}: {
  href: string;
  children: React.ReactNode;
  svg?: React.ReactNode;
}) => {
  return (
    <li className="home-link relative text-xl sm:text-2xl md:text-3xl">
      <Link href={href}>{children}</Link>
      {svg && (
        <div className="pointer-events-none absolute left-0 top-0">{svg}</div>
      )}
    </li>
  );
};

export default function Home() {
  return (
    <div className="align-start relative flex w-full bg-offwhite">
      <div className="absolute -top-32 w-full rotate-180 sm:-top-[calc(14%-4rem)] md:sticky md:top-32 md:mt-14 md:h-[500px] md:max-w-[50%] md:rotate-0">
        <div className="relative h-60 w-full animate-fadeIn md:h-[900px]">
          <Image
            src={home_blob}
            alt="Home Blob"
            fill
            sizes="50vw"
            className="object-contain object-right md:object-cover"
            priority
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-start px-5 py-36 sm:px-[10%] md:w-4/5 md:pt-32 lg:pt-40">
        <div className="flex flex-col items-start">
          <div className="flex max-w-[240px] flex-col items-start justify-center gap-10 sm:max-w-[100%] md:min-w-[315px]">
            <Image
              src={festival_santa_lucia}
              alt="Festival Santa Lucia"
              width={290}
              height={80}
              className="animate-fadeIn2"
            />
            <ul className="flex animate-fadeIn3 flex-col items-start justify-center gap-6 text-[#4D4E6A] sm:gap-8">
              <NavLink
                href="/happenings"
                svg={
                  <HappeningsHomeLink className="h-[41px] w-auto sm:h-[48px] md:h-[60px]" />
                }
              >
                Happenings off-festival
              </NavLink>
              <NavLink
                href="/guia"
                svg={
                  <GuiaHomeLink className="h-[35px] w-auto sm:h-[42px] md:h-[50px]" />
                }
              >
                Guía de la ciudad
              </NavLink>
              <NavLink
                href="/rutas"
                svg={
                  <RutasHomeLink className="h-[33px] w-auto sm:h-[40px] md:h-[48px]" />
                }
              >
                Rutas culturales
              </NavLink>
            </ul>
          </div>
          <p className="animate-fadeIn4 pt-20 text-lg leading-6 text-blue sm:pt-40 md:text-xl">
            Lo que despierta <br /> cuando el escenario duerme.
          </p>
        </div>
        <Dedication />
      </div>
    </div>
  );
}
