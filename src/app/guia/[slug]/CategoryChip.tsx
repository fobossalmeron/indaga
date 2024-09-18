import Bares from "@/assets/img/bares_g.svg";
import Musica from "@/assets/img/musica_g.svg";
import Cafeterias from "@/assets/img/cafeterias_g.svg";
import Monumentos from "@/assets/img/monumentos_g.svg";
import Restaurantes from "@/assets/img/restaurantes_g.svg";
import Museos from "@/assets/img/espacios_art_g.svg";

const categoryMap = {
  "bares-y-cantinas": {
    title: "Bares & Cantinas",
    color: "bg-guiaOrange",
    image: <Bares />,
  },
  "musica-en-vivo": {
    title: "Música en Vivo",
    color: "bg-guiaPurple",
    image: <Musica />,
  },
  cafeterias: {
    title: "Cafeterías",
    color: "bg-guiaMustard",
    image: <Cafeterias />,
  },
  "monumentos-historicos": {
    title: "Monumentos Históricos",
    color: "bg-guiaCyan",
    image: <Monumentos />,
  },
  restaurantes: {
    title: "Restaurantes",
    color: "bg-guiaSunset",
    image: <Restaurantes />,
  },
  "espacios-de-arte": {
    title: "Espacios de Arte",
    color: "bg-guiaPink",
    image: <Museos />,
  },
};

export function CategoryChip({ slug }: { slug: string }) {
  const category = categoryMap[slug as keyof typeof categoryMap];

  return (
    <div
      className={`flex items-center gap-2 rounded-full ${category.color} py-2 pl-4 pr-7`}
    >
      <div className="flex h-10 w-10 items-center justify-center [&>*]:h-full [&>*]:w-auto">
        {category.image}
      </div>
      <span className="text-2xl text-white">{category.title}</span>
    </div>
  );
}
