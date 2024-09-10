"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { happenings } from "../mockHappenings";
import Link from "next/link";
import { Category } from "../../components/Category";
import { WhatsappShareButton, WhatsappIcon } from "next-share";
import { formatDate } from "@/app/utils/formatDate";
import { Fade } from "react-awesome-reveal";
import ShareArrow from "@/assets/img/share_arrow.svg";

export default function Happening() {
  const params = useParams();
  const slug = params.slug as string;

  // Verifica si slug está definido
  if (!slug) {
    return <p>Cargando...</p>; // O un estado de carga
  }

  const event = happenings.find((happening) => happening.slug === slug);

  if (!event) {
    return (
      <div>
        Evento no encontrado.{" "}
        <Link href="/happenings">
          <Button>Volver a la lista de eventos</Button>
        </Link>
      </div>
    );
  }

  const { category, title, image, location, locationUrl, fecha, description } =
    event;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: `https://indaga.site/happenings/${slug}`,
        });
        console.log("Compartido con éxito");
      } catch (error) {
        console.error("Error al compartir:", error);
      }
    } else {
      // Fallback para navegadores que no soportan la API de Web Share
      const shareUrl = `https://indaga.site/happenings/${slug}`;
      alert(`Copia este enlace para compartir: ${shareUrl}`);
    }
  };

  return (
    <Fade>
      <div className="mt-16 flex overflow-hidden rounded-3xl bg-white max-w-[920px]">
        <div className="h-100 relative w-1/2 bg-gray-200 max-w-[460px]">
          <Image
            src={image}
            alt={`Imagen de ${title}`}
            fill={true}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="flex w-1/2 flex-col items-start gap-6 px-12 py-11">
          <div className="flex flex-col items-start gap-1">
            <Category category={category} />
            <h2 className="text-4xl">{title}</h2>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="text-4xl capitalize">{formatDate(fecha)}</p>
            <Link href={locationUrl} className="text-xl text-blue underline font-medium">
              <p>@{location}</p>
            </Link>
          </div>
          <div
            className="leading-5 dangerous-links"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
          <div className="flex w-full gap-2">
            <Link href={"/happenings"} className="w-full">
              <Button secondary className="w-full">
                Volver
              </Button>
            </Link>
            <Button onClick={handleShare} className="w-10/12">
              Compartir <ShareArrow />
            </Button>
          </div>
          {/* <WhatsappShareButton
          url={`https://indaga.site/happenings/${slug}`}
          title={title}
          separator=":: "
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton> */}
        </div>
      </div>
    </Fade>
  );
}
