"use client";

import Image from "next/image";
import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import { Button } from "@/app/components/Button";
import { usePathname } from "next/navigation";
import OffLogotipo from "@/assets/img/off_logotipo.svg";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname.includes(href);

  return (
    <Link
      href={href}
      className={`bg-transparent py-3 hover:underline ${
        isActive ? "underline" : ""
      } text-2xl transition-all`}
    >
      {children}
    </Link>
  );
};

const NavColor: Record<string, string> = {
  happenings: "fern",
  guia: "blue",
  rutas: "ocre",
};

const handleColor = (pathname: string) => {
  const route = Object.keys(NavColor).find((route) => pathname.includes(route));
  const color = route ? NavColor[route] : "eerie";
  return `text-${color}`;
};

export const Nav = () => {
  const pathname = usePathname();

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 flex h-16 w-full px-5 sm:px-10 md:px-20 items-center justify-center bg-white ${handleColor(
        pathname,
      )}`}
    >
      <div className="flex items-center justify-between w-full max-w-[1240px]">
        <Link href="/" className="w-100 transition-all">
          <Logo width={95} height={18} className="transition-all" />
        </Link>
        <nav className="flex items-center gap-7 transition-all">
          <ul className="flex items-center gap-7 transition-all">
            <li className="hidden lg:block">
              <NavLink href="/happenings">Happenings</NavLink>
            </li>
            <li>
              <OffLogotipo className="h-5 w-auto transition-all" />
            </li>
            <li className="hidden lg:block">
              <NavLink href="/guia">Guía</NavLink>
            </li>
            <li className="hidden lg:block">
              <NavLink href="/rutas">Rutas</NavLink>
            </li>
          </ul>
        </nav>
        <Button thin>Descarga la guía</Button>
      </div>
    </nav>
  );
};
