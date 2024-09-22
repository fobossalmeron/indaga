"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./NavLink";
import { useNavColor } from "./useNavColor";
import { Button } from "@/app/components/Button";

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navColor = useNavColor();
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleNav = () => setIsOpen(!isOpen);

  const handleNavLinkClick = () => {
    // No necesitamos hacer nada aquí, useEffect se encargará de cerrar el menú
  };

  return (
    <>
      <button
        onClick={toggleNav}
        className="fixed bottom-4 right-4 lg:hidden z-50 w-[60px] h-[60px] bg-fern text-white rounded-full shadow-md flex items-center justify-center p-2.5"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 42 42"
          stroke="currentColor"
          className={`w-full h-full transition-transform duration-300 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        >
                        <path
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
              strokeWidth={2}
              d={isOpen ? "M8.64 8.64L33.36 33.36M8.64 33.36L33.36 8.64" : "M6 10h30M6 21h30M6 32h20"}
            />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-40 bg-white ${navColor} pt-16 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full justify-center items-center p-5 space-y-10">
          <div>
            <nav>
              <ul className="space-y-6 items-center flex flex-col">
              <li>
                  <NavLink href="/" onClick={handleNavLinkClick}>
                    Inicio
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/happenings" onClick={handleNavLinkClick}>
                    Happenings
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/guia" onClick={handleNavLinkClick}>
                    Guía
                  </NavLink>
                </li>
                <li>
                  <NavLink href="/rutas" onClick={handleNavLinkClick}>
                    Rutas
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <div className="mb-10">
            <Button className="xsm:hidden" onClick={toggleNav}>Descarga la guía</Button>
          </div>
        </div>
      </div>
    </>
  );
};
