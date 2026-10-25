"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/app/components/ui/button";

export const GuideDownload = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const closeOutside = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto relative"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) {
          setIsOpen(false);
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <Button
        ref={buttonRef}
        size="thin"
        className="h-10 px-3 text-xs sm:px-5 sm:text-base"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={(event) => {
          if ((event.nativeEvent as PointerEvent).pointerType === "mouse") {
            setIsOpen(true);
          } else {
            setIsOpen((open) => !open);
          }
        }}
      >
        Descarga la guía
      </Button>
      <div id={panelId} hidden={!isOpen} className="absolute top-full right-0 min-w-full pt-2">
        <div className="text-accent rounded-xl border border-black/10 bg-white p-2 shadow-lg">
          {[
            { label: "Español", lang: "es", file: "indaga-guia-2026-espanol.pdf" },
            { label: "English", lang: "en", file: "indaga-guide-2026-english.pdf" },
          ].map(({ label, lang, file }) => (
            <a
              key={lang}
              href={`/${file}`}
              download={file}
              lang={lang}
              className="hover:bg-accent/10 focus-visible:bg-accent/10 flex min-h-11 items-center rounded-lg px-3 text-xs font-medium focus-visible:outline-2 sm:text-base"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
