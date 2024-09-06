"use client";

import Image from "next/image";
import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import { Button } from "@/app/components/Button";
import { usePathname } from "next/navigation";
import off_logotipo from "@/assets/img/off_logotipo.svg?url";

interface NavLinkProps {
  href: string;
  color: string;
  children: React.ReactNode;
}

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href; // Cambiar 'pathname' a 'asPath'

  return (
    <Link
      href={href}
      className={`py-3 bg-transparent hover:underline ${
        isActive ? "font-bold" : ""
      } text-2xl font-regular`}
    >
      {children}
    </Link>
  );
};

export const Nav = () => {
  return (
    <nav
      className={
        "w-full h-20 bg-white flex items-center justify-around text-blue fixed top-0 left-0 right-0 z-50"
      }
    >
      <Link href="/" className="w-100">
        <Logo width={95} height={18}/>
      </Link>
      <nav className="flex items-center gap-7">
        <ul className="flex items-center gap-7">
          <li>
            <NavLink href="/happenings">
              Happenings
            </NavLink>
          </li>
          <li>
            <Image src={off_logotipo} alt="Off-festival" className="h-5 w-auto" />
          </li>
          <li>
            <NavLink href="/guia">
              Guía
            </NavLink>
          </li>
          <li>
            <NavLink href="/rutas">
              Rutas
            </NavLink>
          </li>
        </ul>
      </nav>
      <Button>Descarga la guía</Button>
    </nav>
  );
};
