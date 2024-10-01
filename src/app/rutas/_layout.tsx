import { Header } from "@/app/components/Header";
import rutas_icon from "@/assets/img/rutas_icon.png";

export default function RutasLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full flex-col items-center">
      <Header
        title="Rutas culturales"
        subtitle="El camino al neoleonés"
        image={rutas_icon}
      />
      <div className="mx-auto flex w-full max-w-[1020px] flex-col items-center pb-24">
        {children}
      </div>
    </div>
  );
}
