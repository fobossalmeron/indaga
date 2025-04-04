"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void; // Función opcional añadida
}

export function NavLink({ href, children, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isActive) {
      onClick?.();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`group relative rounded-md px-3 py-2 text-2xl transition-all`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-full w-full rounded-lg bg-current transition-all duration-300 group-hover:opacity-20 group-active:opacity-20 ${isActive ? "opacity-[12%]" : "opacity-0"}`}
      ></span>
    </Link>
  );
}
