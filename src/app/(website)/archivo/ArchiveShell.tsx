import type { ReactNode } from "react";

export const archiveDescription =
  "Hemos estado construyendo una plataforma de difusión cultural que une distintas prácticas de preservación de ~lo humano a través de distintas manifestaciones culturales.";

export default function ArchiveShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1018px] px-5 pt-32 pb-24 sm:pt-40 sm:pb-[170px]">
      <header className="motion-safe:animate-fadeIn motion-safe:[animation-duration:300ms]">
        <h1 className="text-5xl leading-[1.1] sm:text-[64px]">Archivo</h1>
        <p className="mt-2 max-w-[650px] text-xl leading-[1.15] sm:text-2xl">
          {archiveDescription}
        </p>
      </header>
      {children}
    </div>
  );
}
