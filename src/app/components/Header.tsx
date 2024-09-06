import Image from "next/image";

export const Header = ({ title, image }: { title: string, image?: string }) => {
  return (
    <header className="flex items-center gap-10 pt-24 pb-5">
      <div className="w-14 h-14 bg-blue">
        {image && <Image src={image} alt={title} width={56} height={56} />}
      </div>
      <h1 className="text-5xl">{title}</h1>
    </header>
  );
};
