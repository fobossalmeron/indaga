import Image from "next/image";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <div className="w-14 h-14 bg-blue"></div>
        <h1 className="text-6xl">Happenings off-festival</h1>
      </header>
      {children}
    </>
  );
}
