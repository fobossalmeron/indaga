import { Header } from "@/app/components/Header";
import Off from "@/assets/img/off_alone.svg";
import SantaLucia from "@/assets/img/festival_santa_lucia.svg";
import Blob from "@/assets/img/blob_happening.svg";

export default function TreasureHuntLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex w-full max-w-[1020px] flex-col pt-16">
      <Header title="Treasure Hunt" subtitle="La ciudad está de festival">
        <SantaLucia className="text-foreground w-full max-w-[170px]" />
      </Header>
      <Blob className="absolute top-[350px] right-0 hidden h-[50vw] w-auto translate-x-1/2 md:top-[10%] md:translate-x-1/4 lg:block" />
      {children}
    </div>
  );
}
