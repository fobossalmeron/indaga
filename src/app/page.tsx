import Image from "next/image";

export default function Home() {
  return (
    <main className={`bg-offwhite`}>
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Image
          src="/indaga.svg"
          alt="Indaga Logo"
          width={470}
          height={150}
          priority
        />
      </div>
    </main>
  );
}
