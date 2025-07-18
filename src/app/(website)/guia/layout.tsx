import { Header } from "@/app/components/Header";
import GuiaClientProvider from "./GuiaClientProvider";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuiaClientProvider>
      <Header
        title="Guía de la ciudad"
        subtitle="Explora la curaduría norestense"
      />
      <div className="mx-auto flex w-full max-w-[1020px] flex-col pb-24">
        {children}
      </div>
    </GuiaClientProvider>
  );
}
