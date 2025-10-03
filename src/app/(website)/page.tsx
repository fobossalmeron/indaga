import Link from "next/link";
import Logo from "@/assets/img/logotipo.svg";
import LeftPanel from "@/assets/img/left_panel.svg";
import RightPanel from "@/assets/img/right_panel.svg";
import SantaLucia from "@/assets/img/festival_santa_lucia.svg";

export default function Home() {
  return (
    <div className="animate-fadeIn min-h-dvh w-full">
      <div className="relative flex min-h-dvh w-full gap-0 md:grid md:grid-cols-2">
        <div className="relative hidden overflow-hidden md:block">
          <LeftPanel className="absolute top-0 right-0 bottom-0 left-0 min-h-full min-w-full" />
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-14 pt-40 pb-20">
          <RightPanel className="absolute top-0 right-0 bottom-0 left-0 min-h-full min-w-full" />
          <div className="relative flex h-full max-w-[450px] flex-col items-center justify-between">
            <div className="flex flex-col gap-8">
              <Logo className="animate-fadeIn2 text-foreground w-full" />
              <p className="text-lg leading-tight md:text-[1.375rem]">
                Tu brújula cultural, el punto de encuentro con lo local, lo
                profundo y con sustancia
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <SantaLucia className="animate-fadeIn2 text-foreground w-full max-w-[45%]" />
              <p className="text-lg leading-tight md:text-[1.120rem]">
                Durante la temporada del FISL 2025, te invitamos a participar en
                el{" "}
                <Link href="/treasure-hunt" className="rounded-md underline">
                  Treasure Hunt
                </Link>{" "}
                más grande de la ciudad
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
