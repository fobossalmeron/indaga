import { Header } from "@/app/components/Header";
import rutas_icon from "@/assets/img/rutas_icon.svg?url";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header
        title="Rutas culturales"
        subtitle="El camino al neoleonés"
        image={rutas_icon}
      />
      <div className="mx-auto flex w-full max-w-[970px] flex-col pb-24">
        {children}
      </div>
    </>
  );
}
