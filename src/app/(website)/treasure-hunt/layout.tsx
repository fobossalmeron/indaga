import { Header } from "@/app/components/Header";
import Off from "@/assets/img/off_alone.svg";

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
      {children}
    </div>
  );
}
