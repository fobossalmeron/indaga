import Image from "next/image";

export const Header = ({
  title,
  subtitle,
  image,
}: {
  title: string;
  subtitle?: string;
  image?: string;
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-center gap-4 px-5 pb-5 pt-8 sm:pt-16 animate-fadeIn">
        <div className="h-14 w-14">
          {image && <Image src={image} alt={title} width={60} height={60} />}
        </div>
        <div className="flex flex-col text-center sm:text-start">
          <h1 className="text-3xl sm:text-5xl">{title}</h1>
          {subtitle && <h2 className="text-xl sm:text-2xl text-[#505854]">{subtitle}</h2>}
        </div>
      </header>
  );
};
