import Image from "next/image";
import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import festival_santa_lucia from "@/assets/img/festival_santa_lucia.svg?url";
import imago_delgado from "@/assets/img/imago_delgado.svg?url";

export const Footer = () => {
  return (
    <footer
      className={
        "px-20 py-20 w-full h-auto bg-white flex flex-col items-start text-blue gap-32 text-2xl font-regular"
      }
    >
      <div className="flex w-full justify-between items-start">
        <nav className="flex flex-col flex-start align-text-left">
          <Link
            href="/home"
            className="px-0 py-3 bg-transparent hover:underline"
          >
            Home{" "}
          </Link>
          <Link
            href="/happenings"
            className="px-0 py-3 bg-transparent hover:underline"
          >
            Happenings
          </Link>
          <Link
            href="/guia"
            className="px-0 py-3 bg-transparent hover:underline"
          >
            Guía
          </Link>
          <Link
            href="/rutas"
            className="px-0 py-3 bg-transparent hover:underline"
          >
            Rutas
          </Link>
        </nav>
        <Image
          src={festival_santa_lucia}
          alt="Festival Santa Lucia"
          width={217}
          height={58}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Image src={imago_delgado} alt="Indaga" width={33} height={60} />
        Indaga, 2024
      </div>
    </footer>
  );
};
