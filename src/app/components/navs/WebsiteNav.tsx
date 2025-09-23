"use client";

import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { NavLink } from "./NavLink";

export const WebsiteNav = () => {
  const pathname = usePathname();
  const isHomepageOrNosotras = pathname === "/" || pathname === "/nosotras";

  return (
    <nav className="text-accent fixed top-0 right-0 left-0 z-50 flex h-16 w-full items-center justify-center px-5 mix-blend-difference backdrop-blur-lg sm:px-10 md:px-20">
      <div className="flex w-full max-w-[1240px] items-center justify-between">
        <Link href="/" className="transition-all">
          <Logo
            width={95}
            height={18}
            className={`animate-fadeSimple transition-all ${isHomepageOrNosotras ? "text-white" : "text-white"}`}
          />
        </Link>
        <nav className="animate-fadeSimple flex items-center gap-7 transition-all">
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
              <NavLink href="/blog">Blog</NavLink>
            </li>
          </ul>
        </nav>
        <div className="animate-fadeSimple flex gap-2">
          {/* Botón temporal para poder publicar */}
          {/* <Link
            href="/ReporteAgosto_compressed.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="thin" className="bg-gray-400 text-black">
              Descarga el reporte
            </Button>
          </Link> */}

          {/* Login/registro ocultos temporalmente */}
          {true && (
            <>
              <Link href="/login">
                <Button size="thin" variant="link" className="text-white">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button size="thin">Regístrate</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
