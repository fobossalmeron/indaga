import Image from "next/image";
import { CloudGuideFull } from "./CloudGuideFull";
import { Portal } from "./Portal";
import bares from "@/assets/img/bares.png";
import musica from "@/assets/img/musica.png";
import cafeterias from "@/assets/img/cafeterias.png";
import monumentos from "@/assets/img/monumentos.png";
import restaurantes from "@/assets/img/restaurantes.png";
import museos from "@/assets/img/museos.png";
import guia_blob from "@/assets/img/guia_blob.svg?url";

export default function GuideAll() {
  return (
    <>
      <CloudGuideFull />
      <div className="flex max-w-[1000px] flex-wrap justify-center items-end gap-x-6 gap-y-20 py-24">
        <Portal
          title="Bares y Cantinas"
          slug="bares-y-cantinas"
          src={bares}
          className="text-guiaOrange"
        />
        <Portal
          title="Música en Vivo"
          slug="musica-en-vivo"
          src={musica}
          className="text-guiaPurple"
          width={77}
        />
        <Portal
          title="Cafeterías"
          slug="cafeterias"
          src={cafeterias}
          className="text-guiaMustard"
        />
        <Image src={guia_blob} alt="Guía Blob" className="relative" />
        <Portal
          title="Monumentos Históricos"
          slug="monumentos-historicos"
          src={monumentos}
          className="text-guiaCyan"
        />
        <Portal
          title="Restaurantes"
          slug="restaurantes"
          src={restaurantes}
          className="text-guiaSunset"
        />
        <Portal
          title="Espacios de Arte"
          slug="espacios-de-arte"
          src={museos}
          className="text-guiaPink"
        />
      </div>
    </>
  );
}
