import Bares from "@/assets/img/bares_g.svg";
import Musica from "@/assets/img/musica_g.svg";
import Cafeterias from "@/assets/img/cafeterias_g.svg";
import Monumentos from "@/assets/img/monumentos_g.svg";
import Restaurantes from "@/assets/img/restaurantes_g.svg";
import Museos from "@/assets/img/espacios_art_g.svg";
import bares from "@/assets/img/bares.svg?url";
import musica from "@/assets/img/musica.svg?url";
import cafeterias from "@/assets/img/cafeterias.svg?url";
import monumentos from "@/assets/img/monumentos.svg?url";
import restaurantes from "@/assets/img/restaurantes.svg?url";
import museos from "@/assets/img/museos.svg?url";

export const categories = {
  cafeterias: {
    title: "Cafeterías",
    color: "guiaMustard",
    image: <Cafeterias />,
    bgImage: cafeterias,
  },
  "bares-y-cantinas": {
    title: "Bares & Cantinas",
    color: "guiaOrange",
    image: <Bares />,
    bgImage: bares,
  },
  "musica-en-vivo": {
    title: "Música en Vivo", 
    color: "guiaPurple",
    image: <Musica />,
    bgImage: musica,
  },
  "monumentos-historicos": {
    title: "Monumentos Históricos",
    color: "guiaCyan",
    image: <Monumentos />,
    bgImage: monumentos,
  },
  restaurantes: {
    title: "Restaurantes",
    color: "guiaSunset",
    image: <Restaurantes />,
    bgImage: restaurantes,
  },
  "espacios-de-arte": {
    title: "Espacios de Arte",
    color: "guiaPink",
    image: <Museos />,
    bgImage: museos,
  },
};