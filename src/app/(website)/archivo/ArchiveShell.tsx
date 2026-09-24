import type { ReactNode } from "react";
import { Header } from "@/app/components/Header";

export const archiveDescription =
  "Hemos estado construyendo una plataforma de difusión cultural que une distintas prácticas de preservación de ~lo humano a través de distintas manifestaciones culturales.";

export default function ArchiveShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1020px] pt-16 pb-24 sm:pb-[170px]">
      <Header title="Archivo" subtitle={archiveDescription} />
      <div className="px-5">{children}</div>
    </div>
  );
}
