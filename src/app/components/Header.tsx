import Image from "next/image";

export const Header = ({ title, subtitle, image }: { title: string, subtitle?: string, image?: string }) => {
  return (
    <header className="flex items-center gap-4 pt-16 pb-5">
      <div className="w-14 h-14">
        {image && <Image src={image} alt={title} width={60} height={60} />}
      </div>
      <div className="flex flex-col">
      <h1 className="text-5xl">{title}</h1>
      {subtitle && <h2 className="text-2xl text-[#505854]">{subtitle}</h2>}
      </div>
    </header>
  );
};
