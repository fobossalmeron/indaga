"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Header } from "@/app/components/Header";
import { Fade } from "react-awesome-reveal";
import guia_icon from "@/assets/img/guia_icon.svg?url";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [animationParent] = useAutoAnimate();
  return (
    <Fade>
      <Header title="Indaga la ciudad" subtitle="Espacios endémicos" image={guia_icon} />
      <div className="flex flex-col max-w-[1000px] mx-auto" ref={animationParent}>{children}</div>
    </Fade>
  );
}
