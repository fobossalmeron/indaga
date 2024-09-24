import Image from "next/image";
import festival_santa_lucia from "@/assets/img/festival_santa_lucia.svg?url";
import Logo from "@/assets/img/logotipo.svg";
import home_blob from "@/assets/img/home_blob.svg?url";
import Link from "next/link";
import HappeningsHomeLink from "@/assets/img/happenings_home_link.svg?unoptimized";
import RutasHomeLink from "@/assets/img/rutas_home_link.svg?unoptimized";
import GuiaHomeLink from "@/assets/img/guia_home_link.svg?unoptimized";

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
    <li className="home-link relative text-3xl">
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
      <div className="sticky top-32 mt-14 h-[500px] w-full max-w-[50%]">
        <div className="relative w-full h-[900px] animate-fadeIn">
        <Image
          src={home_blob}
          alt="Home Blob"
          fill
          sizes="50vw"
          className="object-cover object-right"
          priority
        />
        </div>
      </div>
      <div className="flex max-w-[calc(370px+13%)] flex-col items-center justify-start p-[10%_8%]">
        <div className="flex flex-col items-start">
          <div className="flex flex-col items-start justify-center gap-10">
            <Image
              src={festival_santa_lucia}
              alt="Festival Santa Lucia"
              width={290}
              height={80}
              className="animate-fadeIn2"
            />
            <ul className="flex flex-col items-start justify-center gap-8 text-[#4D4E6A] animate-fadeIn3">
              <NavLink
                href="/happenings"
                svg={<HappeningsHomeLink className="h-[60px] w-auto" />}
              >
                Happenings off-festival
              </NavLink>
              <NavLink
                href="/guia"
                svg={<GuiaHomeLink className="h-[50px] w-auto" />}
              >
                Guía de la ciudad
              </NavLink>
              <NavLink
                href="/rutas"
                svg={<RutasHomeLink className="h-[48px] w-auto" />}
              >
                Rutas culturales
              </NavLink>
            </ul>
          </div>
          <p className="pt-40 text-xl text-blue animate-fadeIn4">
            Lo que despierta <br /> cuando el escenario duerme.
          </p>
        </div>
        <div className="mb-48 mt-52 flex flex-col items-center justify-center gap-8">
          <p className="text-center text-xl font-medium leading-6 text-[#6F708B]">
            Con cariño <br /> para Monterrey
          </p>
          <Logo width={118.75} height={22.5} className="text-blue" />
        </div>
      </div>
    </div>
  );
}
