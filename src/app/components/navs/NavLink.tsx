"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
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
      className={`group relative rounded-md px-3 py-2 text-2xl transition-all md:text-xl`}
    >
      {children}
      <span
        className={`bg-accent absolute bottom-0 left-0 h-full w-full rounded-lg transition-all duration-300 group-hover:opacity-20 group-active:opacity-20 ${isActive ? "opacity-[12%]" : "opacity-0"}`}
      ></span>
    </Link>
  );
}
