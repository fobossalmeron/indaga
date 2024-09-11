"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Header } from "@/app/components/Header";
import { Fade } from "react-awesome-reveal";
import rutas_icon from "@/assets/img/rutas_icon.svg?url";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [animationParent] = useAutoAnimate();
  return (
    <Fade>
      <Header title="Rutas culturales" subtitle="El camino al neoleonés" image={rutas_icon} />
      <div className="flex flex-col max-w-[970px] mx-auto">{children}</div>
    </Fade>
  );
}
