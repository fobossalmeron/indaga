"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/app/components/Button";
import { happenings } from "../mockHappenings";
import Link from "next/link";
import { WhatsappShareButton, WhatsappIcon } from "next-share";

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
        console.log('Compartido con éxito');
      } catch (error) {
        console.error('Error al compartir:', error);
      }
    } else {
      // Fallback para navegadores que no soportan la API de Web Share
      const shareUrl = `https://indaga.site/happenings/${slug}`;
      alert(`Copia este enlace para compartir: ${shareUrl}`);
    }
  };

  return (
    <div className="flex">
      <div className="h-100 w-full bg-gray-200 relative">
        <Image
          src={image}
          alt={`Imagen de ${title}`}
          fill={true}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="flex flex-col p-8 py-4">
        <span className="text-sm text-gray-500">{category}</span>
        <h2>{title}</h2>
        <Link href={locationUrl} className="text-sm text-blue">
          <p>@{location}</p>
        </Link>
        <p>{description}</p>
        <p>{fecha.toLocaleDateString()}</p>
        <div className="flex gap-2">
          <Link href={"/happenings"}>
            <Button secondary>Volver</Button>
          </Link>
          <Button onClick={handleShare}>Compartir</Button>
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
  );
}
