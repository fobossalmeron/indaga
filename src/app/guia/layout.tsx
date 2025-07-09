import { Header } from "@/app/components/Header";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header title="Guía de la ciudad" subtitle="Espacios endémicos" />
      <div className="mx-auto flex w-full max-w-[1300px] flex-col pb-24">
        {children}
      </div>
    </>
  );
}
