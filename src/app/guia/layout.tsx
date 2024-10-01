import { Header } from "@/app/components/Header";
import guia_icon from "@/assets/img/guia_icon.png";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header
        title="Indaga la ciudad"
        subtitle="Espacios endémicos"
        image={guia_icon}
      />
      <div className="mx-auto flex max-w-[1000px] flex-col pb-24">
        {children}
      </div>
    </>
  );
}
