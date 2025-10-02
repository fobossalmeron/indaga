import { Header } from "@/app/components/Header";
import Off from "@/assets/img/off_alone.svg";
import Blob from "@/assets/img/blob_happening.svg";

export default function TreasureHuntLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex w-full max-w-[1020px] flex-col pt-16">
      <Header title="Treasure Hunt">
        <Off className="align-self-start h-10 md:h-16" />
      </Header>
      <Blob className="absolute top-[350px] right-0 h-[50vw] w-auto translate-x-1/2 md:top-[10%] md:translate-x-1/4" />
      {children}
    </div>
  );
}
