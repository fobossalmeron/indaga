import { Header } from "@/app/components/Header";
import rutas_icon from "@/assets/img/rutas_icon.svg?url";

export default function RutasLayout({
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
      <div className="mx-auto flex w-full max-w-[1020px] flex-col pb-24 items-center">
        {children}
      </div>
    </>
  );
}
