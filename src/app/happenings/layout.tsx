"use client";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Header } from "@/app/components/Header";
import { Fade } from "react-awesome-reveal";
import happening_icon from "@/assets/img/happening_icon.svg?url";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [animationParent] = useAutoAnimate();
  return (
    <>
      <Fade>
        <Header title="Happenings off-festival" subtitle="Experiencias de origen" image={happening_icon} />
        <div
          className="mx-auto flex max-w-[1000px] flex-col pb-24"
          ref={animationParent}
        >
          {children}
        </div>
      </Fade>
    </>
  );
}
