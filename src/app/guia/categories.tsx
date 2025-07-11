import bares from "@/assets/img/guia/bares.svg?url";
import musica from "@/assets/img/guia/musica.svg?url";
import parques from "@/assets/img/guia/parques.svg?url";
import cafeterias from "@/assets/img/guia/cafeterias.svg?url";
import monumentos from "@/assets/img/guia/monumentos.svg?url";
import restaurantes from "@/assets/img/guia/restaurantes.svg?url";
import museos from "@/assets/img/guia/museos.svg?url";

// Claves: valores de LugarDocumentData["categoria"]
export const categories = {
  Cafeterías: {
    title: "Cafeterías",
    color: "guiaMustard",
    iconUrl: "/categories/cafeterias.svg",
    bgImage: cafeterias,
  },
  "Bares & Cantinas": {
    title: "Bares & Cantinas",
    color: "guiaOrange",
    iconUrl: "/categories/arte.svg",
    bgImage: bares,
  },
  "Música en Vivo": {
    title: "Música en Vivo",
    color: "guiaPurple",
    iconUrl: "/categories/musica.svg",
    bgImage: musica,
  },
  "Monumentos Históricos": {
    title: "Monumentos Históricos",
    color: "guiaCyan",
    iconUrl: "/categories/monumentos.svg",
    bgImage: monumentos,
  },
  Restaurantes: {
    title: "Restaurantes",
    color: "guiaSunset",
    iconUrl: "/categories/restaurantes.svg",
    bgImage: restaurantes,
  },
  Parques: {
    title: "Parques",
    color: "guiaGreen",
    iconUrl: "/categories/parques.svg",
    bgImage: parques,
  },
  "Espacios de Arte": {
    title: "Espacios de Arte",
    color: "guiaPink",
    iconUrl: "/categories/arte.svg",
    bgImage: museos,
  },
};
