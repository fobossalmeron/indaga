"use client";

import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import { Button } from "@/app/components/Button";
import OffLogotipo from "@/assets/img/off_logotipo.svg";
import { NavLink } from "./NavLink";
import { useNavColor } from "./useNavColor";

export const Nav = () => {
  const navColor = useNavColor();

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 flex h-16 w-full px-5 sm:px-10 md:px-20 items-center justify-center bg-white ${navColor}`}
    >
      <div className="flex items-center justify-between w-full max-w-[1240px]">
        <Link href="/" className="w-100 transition-all">
          <Logo width={95} height={18} className="transition-all animate-fadeSimple" />
        </Link>
        <nav className="flex items-center gap-7 transition-all animate-fadeSimple">
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
        <div className="hidden xsm:block animate-fadeSimple">
          <a href="/INDAGA_GUIA_2024v2.pdf" target="_blank">
            <Button thin>
              Descarga la guía
            </Button>
          </a>
        </div>
      </div>
    </nav>
  );
};
