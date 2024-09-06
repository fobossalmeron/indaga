"use client";
import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Header } from "@/app/components/Header";
import { Fade } from "react-awesome-reveal";
export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [animationParent] = useAutoAnimate();
  return (
    <Fade direction="up">
      <Header title="Indaga la ciudad" />
      <div className="flex flex-col max-w-[1000px] mx-auto" ref={animationParent}>{children}</div>
    </Fade>
  );
}
