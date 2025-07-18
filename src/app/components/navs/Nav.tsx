import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { NavLink } from "./NavLink";
export const Nav = () => {
  return (
    <nav className="text-accent fixed top-0 right-0 left-0 z-50 flex h-16 w-full items-center justify-center bg-white px-5 sm:px-10 md:px-20">
      <div className="flex w-full max-w-[1240px] items-center justify-between">
        <Link href="/" className="transition-all">
          <Logo
            width={95}
            height={18}
            className="animate-fadeSimple transition-all"
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
          <Link
            href="/INDAGA_GUIA_2024v2.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="thin">Descarga la guía</Button>
          </Link>

          {/* Login/registro ocultos temporalmente */}
          {false && (
            <>
              <Link href="/login">
                <Button size="thin" variant="link">
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
