"use client";

import { usePathname } from 'next/navigation';

const NavColor: Record<string, string> = {
  happenings: "fern",
  guia: "blue",
  rutas: "ocre",
};

export function useNavColor() {
  const pathname = usePathname();

  const color = Object.entries(NavColor).find(([route]) => pathname.includes(route))?.[1] || "eerie";

  return `text-${color}`;
}
