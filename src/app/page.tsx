import Image from "next/image";
import silla from "@/assets/img/silla.svg?url";
import fundidora from "@/assets/img/fundidora.svg?url";
import Link from "next/link";
import Logo from "@/assets/img/logotipo.svg";

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <li className="home-link relative text-2xl md:text-3xl transition-bg duration-300 hover:bg-indagaBlue/15 active:bg-indagaBlue/15 bg-indagaBlue/0 py-2 px-4 rounded-xl -translate-x-4 ">
      <Link href={href}>{children}</Link>
    </li>
  );
};

export default function Home() {
  return (
    <div className="w-full animate-fadeIn bg-[#DAF7FF] text-[#4D4E6A]">
      <div className="align-start relative z-20 flex w-full md:grid md:grid-cols-2">
        <div className="flex w-full flex-col items-start justify-start px-8 py-36 pt-20 sm:pt-24 sm:px-[10%] md:col-start-2 md:px-2 md:pt-32 lg:pt-32">
          <div className="flex flex-col items-start">
            <div className="flex flex-col items-start justify-center gap-12 sm:max-w-[100%] md:min-w-[300px]">
              <div className="flex flex-col items-start gap-5">
                <span className="text-3xl leading-[1.2] md:text-4xl lg:text-5xl">
                  Explora. Prueba. <br />
                  Conecta. Descubre.
                </span>
                <Logo
                  width={200}
                  className="w-[150px] animate-fadeIn2 text-indagaBlue md:w-[170px] lg:w-[200px]"
                />
              </div>
              <ul className="flex animate-fadeIn3 flex-col items-start justify-center gap-5 xsm:gap-6 text-[#4D4E6A] sm:gap-8">
                <NavLink href="/happenings">Happenings</NavLink>
                <NavLink href="/guia">Guía de la ciudad</NavLink>
                <NavLink href="/rutas">Rutas culturales</NavLink>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="pointer-events-none relative z-10 flex h-[120px] w-full flex-col justify-center xsm:h-[150px] md:h-[180px]">
        <div className="absolute top-[-150%] w-full">
          <div className="flex w-full items-start">
            <Image src={silla} alt="Silla" width={670} height={340} />
          </div>
          <div className="h-[50px] w-full bg-[#00D583]"></div>
          <div className="relative w-full">
            <Image
              src={fundidora}
              alt="Fundidora"
              width={130}
              height={170}
              className="absolute right-6 translate-y-[-95%]"
            />
          </div>
          <div className="h-[50px] w-full bg-[#00C3D5]"></div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <div className="mx-5 flex max-w-[460px] animate-fadeIn2 flex-col items-start gap-6 py-20 sm:mx-10 sm:py-32">
          <div className="flex w-full flex-col gap-2">
            <h1 className="w-full text-3xl sm:text-4xl">
              Detrás de las palabras como de las cosas, habrá siempre algo que
              encontrar...
            </h1>
          </div>
          <div className="prose prose-invert text-lg xsm:text-base">
            &ldquo;Inmersos en la cotidianeidad, nos es difícil traspasar nuestra
            acostumbrada mirada a la certidumbre del entorno material al cual
            nos enfrentamos y vivimos día con día. ¿Qué posibilidades de ser se
            esconde bajo su imponente materia?, ¿qué propuesta de vida ofrece en
            ese silencio detrás de su estridente apariencia?
            <br />
            <br /> Como toda ciudad, Monterrey ha sabido formar a cada quien en
            función de su lugar, pues somos seres enraizados en un espacio y
            tiempo específico, somos entre otras cosas por las cosas que usamos,
            las cosas que hemos conservado y que experimentamos en el entorno
            que habitamos.
            <br />
            <br />
            Monterrey, ciudad fundada por Don Diego de Montemayor en 1596 en lo
            que ya se conocía como los ojos de agua de Santa Lucía, surgió como
            ruptura del silencio, como un puente entre el ser y el mundo como
            invento de una ficción o proyecto de vida.
            <br />
            <br /> Así pues, déjate llevar por esta guía que tienes entre manos
            y descubre la vida regiomontana que se te propone.&rdquo;
            <br />
            <br />
            <i className="font-medium">Federico j. López Castro</i>
          </div>
        </div>
      </div>
    </div>
  );
}
