import { Header } from "@/app/components/Header";

export default function TreasureHuntLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header
        title="Treasure Hunt"
      />
      <div className="mx-auto flex w-full flex-col items-center pb-24">
        <div className="mx-auto mt-8 w-full max-w-fit animate-fadeIn2 px-5">
          {children}
        </div>
      </div>
    </>
  );
}
