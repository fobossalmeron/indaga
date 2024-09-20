import { Header } from "@/app/components/Header";
import rutas_icon from "@/assets/img/rutas_icon.svg?url";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col items-center">
      <Header
        title="Rutas culturales"
        subtitle="El camino al neoleonés"
        image={rutas_icon}
      />
      <div className="mx-auto flex max-w-[970px] flex-col">{children}</div>
    </div>
  );
}
