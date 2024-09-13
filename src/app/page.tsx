import Image from "next/image";
import festival_santa_lucia from "@/assets/img/festival_santa_lucia.svg?url";
import Logo from "@/assets/img/logotipo.svg";
import home_blob from "@/assets/img/home_blob.svg?url";
import Link from "next/link";
// import happenings_home_link from "@/assets/img/happenings_home_link.svg";
import HappeningsHomeLink from "@/assets/img/happenings_home_link.svg";

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
    <li className="text-4xl relative">
      <Link href={href}>{children}</Link>
      {svg && (
        <div className="absolute top-0 left-0 pointer-events-none">
          {svg}
        </div>
      )}
    </li>
  );
};

export default function Home() {
  return (
    <main className={`bg-offwhite`}>
      <div className="flex min-h-[100vh] flex-col items-center justify-center">
        <div className="flex flex-col items-start">
          <div className="flex flex-col items-start justify-center gap-5">
            <Image
              src={festival_santa_lucia}
              alt="Festival Santa Lucia"
              width={320}
              height={90}
            />
            <ul className="flex flex-col items-start justify-center gap-5 text-[#4D4E6A]">
              <NavLink
                href="/happenings"
                svg={<HappeningsHomeLink className="h-[72px] w-auto" />}
              >
                Happenings off-festival
              </NavLink>
              <NavLink href="/guia">Guía de la ciudad</NavLink>
              <NavLink href="/rutas">Rutas culturales</NavLink>
            </ul>
          </div>
          <p className="text-blue">
            Lo que despierta <br /> cuando el escenario duerme.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5">
          <p className="text-center">
            Con cariño <br /> para Monterrey
          </p>
          <Logo width={95} height={18} className="text-blue" />
        </div>
      </div>
      <Image
        src={home_blob}
        alt="Home Blob"
        width={470}
        height={150}
        priority
      />
    </main>
  );
}
