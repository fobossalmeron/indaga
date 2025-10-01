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
              className={`animate-fadeSimple text-[#a7e198] transition-all`}
            />
          </Link>
          <nav className="animate-fadeSimple gap-7 text-[#a7e198]">
            <ul className="flex items-center gap-3 transition-all">
              <li className="hidden lg:block">
                <NavLink href="/agenda">Agenda</NavLink>
              </li>
              <li className="hidden lg:block">
                <NavLink href="/guia">Guía</NavLink>
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
            className="animate-fadeSimple hidden -translate-x-30 md:block"
          >
            <Button size="thin" variant="link" className="text-[#a7e198]">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </div>
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-50 flex h-16 px-5 md:px-8 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-end">
          <Link
            href="/login"
            className="animate-fadeSimple pointer-events-auto"
          >
            <Button
              size="thin"
              className="border-1 border-white/20 px-4 md:px-6"
            >
              Regístrate
            </Button>
          </Link>
        </div>
      </div>
      <div className="fixed top-0 right-0 left-0 z-40 h-32 -translate-y-16 backdrop-blur-lg"></div>
    </>
  );
};
