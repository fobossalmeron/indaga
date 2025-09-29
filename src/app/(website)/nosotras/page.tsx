import { Eyes } from "./Eyes";
import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";

export default async function Nosotras() {
  const client = await createClient();
  const about = await client.getSingle("about");

  return (
    <>
      <div className="w-full bg-[#5B3F7D] pt-16 text-[#ECEAEC]">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="animate-fadeIn2 mx-5 flex max-w-[460px] flex-col items-start gap-6 py-20 sm:mx-10 sm:py-32">
            <div className="flex flex-col gap-2">
              <h1 className="max-w-[15ch] text-4xl sm:text-5xl">
                {about.data.title}
              </h1>
            </div>
            <div className="prose prose-invert">
              <PrismicRichText field={about.data.text} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center">
        <div className="animate-fadeIn2 mx-5 flex max-w-[460px] flex-col items-start gap-6 py-20 sm:mx-10 sm:py-32">
          <div className="flex w-full flex-col gap-2">
            <h1 className="w-full text-3xl sm:text-4xl">
              Detrás de las palabras como de las cosas, habrá siempre algo que
              encontrar...
            </h1>
          </div>
          <div className="prose prose-invert xsm:text-base text-lg">
            &ldquo;Inmersos en la cotidianeidad, nos es difícil traspasar
            nuestra acostumbrada mirada a la certidumbre del entorno material al
            cual nos enfrentamos y vivimos día con día. ¿Qué posibilidades de
            ser se esconde bajo su imponente materia?, ¿qué propuesta de vida
            ofrece en ese silencio detrás de su estridente apariencia?
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
    </>
  );
}

export const revalidate = 86400; // Revalidar cada 24 horas (86400 segundos)
