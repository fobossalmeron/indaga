import { Header } from "@/app/components/Header";
import GuiaClientProvider from "./GuiaClientProvider";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuiaClientProvider>
      <div className="pt-16">
        <Header
          title="Guía de la ciudad"
          subtitle="Descubre los lugares más especiales"
        />
        <div className="mx-auto flex w-full max-w-[1020px] flex-col pb-24">
          {children}
        </div>
      </div>
    </GuiaClientProvider>
  );
}
