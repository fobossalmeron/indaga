"use client";

import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { NavLink } from "./NavLink";

export const WebsiteNav = () => {
  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 flex h-16 px-5 mix-blend-difference md:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between">
          <Link href="/" className="">
            <Logo
              width={95}
              height={18}
              className="animate-fadeSimple w-20 text-[#a7e198] transition-all sm:w-[95px]"
            />
          </Link>
          <nav className="animate-fadeSimple hidden gap-7 text-[#a7e198] lg:block">
            <ul className="flex items-center gap-3 transition-all">
              <li className="hidden lg:block">
                <NavLink href="/agenda">Agenda</NavLink>
              </li>
              <li className="hidden lg:block">
                <NavLink href="/guia">Guía</NavLink>
              </li>
              <li className="hidden lg:block">
                <NavLink href="/archivo">Archivo</NavLink>
              </li>
              {/* <li className="hidden lg:block">
                <NavLink href="/rutas">Rutas</NavLink>
              </li> */}
              <li className="hidden lg:block">
                <NavLink href="/treasure-hunt">Treasure Hunt</NavLink>
              </li>
            </ul>
          </nav>
          <Link
            href="/login"
            className="animate-fadeSimple hidden mr-[92px] whitespace-nowrap text-xs text-[#a7e198] underline underline-offset-4 sm:mr-36 sm:text-base"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-50 hidden h-16 px-5 md:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-end">
          <Button asChild size="thin" className="animate-fadeSimple pointer-events-auto h-9 border border-white/20 px-3 text-xs sm:h-10 sm:px-6 sm:text-base">
            <Link href="/login">Regístrate</Link>
          </Button>
        </div>
      </div>
      <div className="fixed top-0 right-0 left-0 z-40 h-32 -translate-y-16 backdrop-blur-lg"></div>
    </>
  );
};
