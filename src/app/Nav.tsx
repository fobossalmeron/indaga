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
      className={`py-3 bg-transparent hover:underline ${
        isActive ? "underline" : ""
      } text-2xl transition-all`}
    >
      {children}
    </Link>
  );
};

const NavColor: Record<string, string> = {
  "/": "black",
  "/happenings": "fern",
  "/guia": "blue",
  "/rutas": "ocre",
};

const handleColor = (pathname: string) => {
  if (pathname.includes("/happenings")) {
    return "text-fern";
  }
  if (pathname.includes("/guia")) {
    return "text-blue";
  }
  if (pathname.includes("/rutas")) {
    return "text-ocre";
  } else {
    return "text-black";
  }
};

export const Nav = () => {
  return (
    <nav
      className={`w-full h-16 bg-white flex items-center justify-around ${handleColor(
        usePathname()
      )} fixed top-0 left-0 right-0 z-50`}
    >
      <Link href="/" className="w-100 transition-all">
        <Logo width={95} height={18} className="transition-all" />
      </Link>
      <nav className="flex items-center gap-7 transition-all	">
        <ul className="flex items-center gap-7 transition-all	">
          <li>
            <NavLink href="/happenings">Happenings</NavLink>
          </li>
          <li>
            <OffLogotipo className="h-5 w-auto transition-all" />
          </li>
          <li>
            <NavLink href="/guia">Guía</NavLink>
          </li>
          <li>
            <NavLink href="/rutas">Rutas</NavLink>
          </li>
        </ul>
      </nav>
      <Button thin>Descarga la guía</Button>
    </nav>
  );
};
