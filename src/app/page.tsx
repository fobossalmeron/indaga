import Image from "next/image";
import silla from "@/assets/img/silla.svg?url";
import fundidora from "@/assets/img/fundidora.svg?url";
import Link from "next/link";
import HappeningsHomeLink from "@/assets/img/happenings_home_link.svg?unoptimized";
import RutasHomeLink from "@/assets/img/rutas_home_link.svg?unoptimized";
import GuiaHomeLink from "@/assets/img/guia_home_link.svg?unoptimized";
import Logo from "@/assets/img/logotipo.svg";

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
    <div className="w-full animate-fadeIn bg-[#DAF7FF] text-[#4D4E6A]">
      <div className="align-start relative z-20 flex w-full md:grid md:grid-cols-2">
        <div className="flex w-full flex-col items-start justify-start px-8 py-36 sm:px-[10%] md:col-start-2 md:px-2 pt-24 md:pt-32 lg:pt-32">
          <div className="flex flex-col items-start">
            <div className="flex flex-col items-start justify-center gap-12 sm:max-w-[100%] md:min-w-[300px]">
              <div className="flex flex-col items-start gap-5">
                <span className="text-3xl md:text-4xl leading-[1.2] lg:text-5xl">
                  Explora. Prueba. <br />
                  Conecta. Descubre.
                </span>
                <Logo
                  width={200}
                  className="animate-fadeIn2 text-indagaBlue w-[150px] md:w-[170px] lg:w-[200px]"
                />
              </div>
              <ul className="flex animate-fadeIn3 flex-col items-start justify-center gap-6 text-[#4D4E6A] sm:gap-8">
                <NavLink
                  href="/happenings"
                  svg={
                    <HappeningsHomeLink className="h-[41px] w-auto sm:h-[48px] md:h-[60px]" />
                  }
                >
                  Happenings
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
          </div>
        </div>
      </div>
      <div className="pointer-events-none relative z-10 flex h-[120px] xsm:h-[150px] md:h-[180px] w-full flex-col justify-center">
        <div className="absolute top-[-150%] w-full">
          <div className="flex w-full items-start">
            <Image src={silla} alt="Silla" width={670} height={340} />
          </div>
          <div className="h-[50px] w-full bg-[#00D583]"></div>
          <div className="relative w-full">
            <Image
              src={fundidora}
              alt="Fundidora"
              width={130}
              height={170}
              className="absolute right-6 translate-y-[-95%]"
            />
          </div>
          <div className="h-[50px] w-full bg-[#00C3D5]"></div>
        </div>
      </div>
    </div>
  );
}
