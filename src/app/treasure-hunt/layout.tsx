import { Header } from "@/app/components/Header";
import treasure_hunt_icon from "@/assets/img/hunt_icon.svg?url";

export default function TreasureHuntLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header
        title="Treasure Hunt"
        subtitle="Descubre nuevas historias"
        image={treasure_hunt_icon}
      />
      <div className="mx-auto flex w-full flex-col items-center pb-24">
        <div className="mx-auto mt-8 w-full max-w-fit animate-fadeIn2 px-5">
          {children}
        </div>
      </div>
    </>
  );
}
