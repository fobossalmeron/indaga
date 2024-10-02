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
    window.scrollTo(0, 0);
    console.log("Se ejecutó la función scroll");
  }, [pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed bottom-5 transition-all right-5 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-fern p-2.5 text-white shadow-md active:bg-[#3C5530] active:scale-95 lg:hidden"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 42 42"
          stroke="currentColor"
          className={`h-full w-full transition-transform duration-300 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
            strokeWidth={2}
            d={
              isOpen
                ? "M8.64 8.64L33.36 33.36M8.64 33.36L33.36 8.64"
                : "M6 10h30M6 21h30M6 32h20"
            }
          />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-40 bg-white ${navColor} pt-16 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center space-y-10 p-5">
          <nav>
            <ul className="flex flex-col items-center space-y-6">
              {[
                { href: "/", text: "Inicio" },
                { href: "/happenings", text: "Happenings" },
                { href: "/guia", text: "Guía" },
                { href: "/rutas", text: "Rutas" },
                { href: "/nosotras", text: "Nosotras" },
              ].map(({ href, text }) => (
                <li key={href}>
                  <NavLink onClick={() => toggleMenu()} href={href}>{text}</NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mb-10">
            <Button className="xsm:hidden" onClick={() => setIsOpen(false)}>
              Descarga la guía
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
