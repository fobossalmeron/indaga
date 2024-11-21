import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import { Button } from "@/app/components/Button";
import { NavLink } from "./NavLink";
export const Nav = () => {
  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 flex h-16 w-full items-center justify-center bg-white px-5 text-indagaBlue sm:px-10 md:px-20`}
    >
      <div className="flex w-full max-w-[1240px] items-center justify-between">
        <Link href="/" className="w-100 transition-all">
          <Logo
            width={95}
            height={18}
            className="animate-fadeSimple transition-all"
          />
        </Link>
        <nav className="flex animate-fadeSimple items-center gap-7 transition-all">
          <ul className="flex items-center gap-3 transition-all">
            <li className="hidden lg:block">
              <NavLink href="/happenings">Happenings</NavLink>
            </li>
            <li className="hidden lg:block">
              <NavLink href="/guia">Guía</NavLink>
            </li>
            <li className="hidden lg:block">
              <NavLink href="/rutas">Rutas</NavLink>
            </li>
          </ul>
        </nav>
        <div className="hidden animate-fadeSimple xsm:block">
          <a href="/INDAGA_GUIA_2024v2.pdf" target="_blank">
            <Button thin>Descarga la guía</Button>
          </a>
        </div>
      </div>
    </nav>
  );
};
