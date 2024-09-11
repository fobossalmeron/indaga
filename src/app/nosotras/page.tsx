import Image from "next/image";
import { Eyes } from "./Eyes";
import Logo from "@/assets/img/logotipo.svg";
import { Button } from "@/app/components/Button";
import Link from "next/link";

export default function Nosotras() {
  return (
    <div className="w-full bg-blue text-[#ECEAEC]">
      <div className="mt-32 flex w-full flex-col items-center justify-center">
        <Eyes />
        <div className="flex max-w-[460px] flex-col items-start gap-6 py-32">
          <div className="flex flex-col gap-2">
            <Logo width={115} className="" />
            <h1 className="max-w-[360px] text-5xl">
              Otra forma de ver la ciudad
            </h1>
          </div>
          <p>
            Indaga surge de la curiosidad y el deseo de redescubrir Monterrey.
            Somos dos mujeres que, con pasos pausados, recorremos la ciudad para
            revelar esos rincones que pocos ven. Exploramos su cultura, su
            música, sus espacios que invitan a detenerse, y los lugares de
            consumo que narran historias propias. Nuestra misión es mostrar una
            Monterrey auténtica, alejada del turismo tradicional, pero llena de
            vida y esencia. <br />
            <br />A través de Indaga, invitamos tanto a residentes como a
            visitantes a conectar con la ciudad de una manera más íntima. Desde
            lo más cotidiano hasta lo inesperado, cada lugar que encontramos es
            una pieza de lo que hace única a esta ciudad.
            <br />
            <br />
            Organizamos el Off Festival como una extensión de nuestra visión, un
            espacio para vivir Monterrey con el corazón abierto y los sentidos
            atentos.
          </p>
          <div className="pt-3">
            <Link href="/">
              <Button className="bg-white !text-blue hover:bg-[#DFE2EC] hover:text-blue">Visita el Off Festival</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
