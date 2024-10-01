"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void; // Función opcional añadida
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative py-2 px-3 rounded-md group text-2xl transition-all`}
    >
      {children}
      <span className={ ` rounded-lg absolute bottom-0 left-0 h-full w-full bg-current transition-all duration-300 group-hover:opacity-20 group-active:opacity-20 ${isActive ? 'opacity-15' : 'opacity-0'}`}></span>
    </Link>
  );
};
