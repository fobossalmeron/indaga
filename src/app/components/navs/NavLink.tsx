"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void; // Función opcional añadida
}

export const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick} // Uso de la función opcional
      className={`bg-transparent py-3 hover:underline ${
        isActive ? "underline" : ""
      } text-2xl transition-all`}
    >
      {children}
    </Link>
  );
};