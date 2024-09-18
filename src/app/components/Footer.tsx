import Image from "next/image";
import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import festival_santa_lucia from "@/assets/img/festival_santa_lucia.svg?url";
import imago_delgado from "@/assets/img/imago_delgado.svg?url";

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="bg-transparent px-0 py-3 hover:underline">
    {children}
  </Link>
);

export const Footer = () => {
  return (
    <footer
      className={
        "z-1 relative flex h-auto w-full flex-col items-center bg-white px-5 sm:px-10 md:px-20 pb-10 pt-2 sm:pt-10 text-xl md-lg:text-2xl text-blue"
      }
    >
      <div className="flex w-full max-w-[1240px] flex-col items-start justify-between gap-32">
        <div className="flex w-full items-start justify-between flex-col-reverse gap-5 md:flex-row md:gap-0">
          <nav className="flex-start align-text-left flex flex-row sm:flex-col gap-8 sm:gap-0">
            <div className="flex flex-wrap gap-y-0 gap-x-8 flex-col sm:flex-row">
              <FooterLink href="/home">Home</FooterLink>
              <FooterLink href="/happenings">Happenings</FooterLink>
              <FooterLink href="/guia">Guía</FooterLink>
              <FooterLink href="/rutas">Rutas</FooterLink>
            </div>
            <div className="flex gap-y-0 gap-x-8 flex-col sm:flex-row">
              <FooterLink href="https://www.instagram.com/indagamx/">
                Instagram
              </FooterLink>
              <FooterLink href="/nosotras">Nosotras</FooterLink>
            </div>
          </nav>
          <Image
            src={festival_santa_lucia}
            alt="Festival Santa Lucia"
            width={217.5}
            height={60}
            className="pt-4 md-lg:max-w-[217.5px] max-w-[180px] w-full"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Image src={imago_delgado} alt="Indaga" width={33} height={60} />
          Indaga, 2024
        </div>
      </div>
    </footer>
  );
};
