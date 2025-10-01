"use client";

import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { NavLink } from "./NavLink";

export const WebsiteNav = () => {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isNosotras = pathname === "/nosotras";

  return (
    <>
      <Link
        href="/"
        className="fixed top-0 left-0 z-50 flex h-16 items-center justify-start px-5 mix-blend-difference transition-all md:px-8 lg:px-10"
      >
        <Logo
          width={95}
          height={18}
          className={`animate-fadeSimple text-[#a7e198] transition-all`}
        />
      </Link>
      <nav className="animate-fadeSimple fixed top-0 left-1/2 z-50 flex h-16 -translate-x-1/2 items-center justify-center gap-7 text-[#a7e198] mix-blend-difference transition-all">
        <ul className="flex items-center gap-3 transition-all">
          <li className="hidden lg:block">
            <NavLink href="/agenda">Agenda</NavLink>
          </li>
          <li className="hidden lg:block">
            <NavLink href="/guia">Guía</NavLink>
          </li>
          <li className="hidden lg:block">
            <NavLink href="/rutas">Rutas</NavLink>
          </li>
          <li className="hidden lg:block">
            <NavLink href="/blog">Blog</NavLink>
          </li>
        </ul>
      </nav>
      <Link
        href="/login"
        className="animate-fadeSimple fixed top-0 right-34 z-50 flex h-16 items-center justify-end px-2 mix-blend-difference sm:right-40 md:right-48"
      >
        <Button size="thin" variant="link" className="text-[#a7e198]">
          Iniciar sesión
        </Button>
      </Link>
      <Link
        href="/login"
        className="animate-fadeSimple fixed top-0 right-5 z-50 flex h-16 items-center justify-end px-2 sm:right-10 md:right-20"
      >
        <Button size="thin" className="border-1 border-white/20">
          Regístrate
        </Button>
      </Link>
      <div className="fixed top-0 right-0 left-0 z-40 h-16 backdrop-blur-lg lg:backdrop-blur-lg"></div>
    </>
  );
};
