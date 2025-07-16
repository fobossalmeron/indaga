"use client";

import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import React from "react";
import imago_delgado from "@/assets/img/imago_delgado.svg?url";

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="group relative bg-transparent px-0 py-3">
    <span className="relative">
      {children}
      <span className="bg-accent bg-opacity-80 absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full group-active:w-full"></span>
    </span>
  </Link>
);

export const Footer = () => {
  return (
    <footer
      className={
        "text-accent md-lg:text-2xl relative z-1 flex h-auto w-full flex-col items-center bg-white px-5 pt-5 pb-16 text-xl sm:px-10 sm:pt-10 md:px-20"
      }
    >
      <div className="flex w-full max-w-[1240px] flex-col items-start justify-between gap-32">
        <div className="flex w-full flex-col-reverse items-start justify-between gap-8 sm:gap-5 md:flex-row md:gap-0">
          <nav className="flex-start align-text-left flex flex-row gap-8 sm:flex-col sm:gap-0">
            <Fade delay={200} triggerOnce>
              <div className="flex flex-col flex-wrap gap-x-8 gap-y-0 sm:flex-row">
                <FooterLink href="/">Home</FooterLink>
                <FooterLink href="/agenda">Agenda</FooterLink>
                <FooterLink href="/guia">Guía</FooterLink>
                <FooterLink href="/rutas">Rutas</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
              </div>
              <div className="flex flex-col gap-x-8 gap-y-0 sm:flex-row">
                <FooterLink href="/nosotras">Nosotras</FooterLink>
                <FooterLink href="https://www.instagram.com/indagamx/">
                  Instagram
                </FooterLink>
              </div>
            </Fade>
          </nav>
        </div>
        <div className="flex flex-col gap-3">
          <Fade delay={450} triggerOnce>
            <div className="flex flex-col gap-2">
              <Image src={imago_delgado} alt="Indaga" width={33} height={60} />
              Indaga, {new Date().getFullYear()}
            </div>
          </Fade>
        </div>
      </div>
    </footer>
  );
};
