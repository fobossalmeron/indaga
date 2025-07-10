import { categories } from "../agenda/happenings.types";
import { routeCategories } from "../rutas/route.types";

export const categoryColors: Record<
  (typeof categories)[number] | (typeof routeCategories)[number],
  { border: string; bg: string; text: string }
> = {
  Arte: { border: "#B7F400", bg: "#CAE47C25", text: "#527442" },
  Gastronomía: {
    border: "#FF7404",
    bg: "rgba(255, 116, 4, 0.25)",
    text: "#B85200",
  },
  Música: { border: "#527442", bg: "rgba(82, 116, 66, 0.25)", text: "#1A5200" },
  Cultura: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
  Cine: { border: "#FF00FF", bg: "rgba(255, 0, 255, 0.25)", text: "#800080" },
  Naturaleza: { border: "#527442", bg: "#52744225", text: "#1A5200" },
  Historia: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
  Literatura: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
  Danza: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
  Teatro: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
  Ciudad: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
};

// Colores para categorías de guía
export const categoryColorsGuia: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  Cafeterías: { border: "#FFD600", bg: "#FFF9E3", text: "#8A6D00" }, // guiaMustard
  "Bares & Cantinas": { border: "#FF7404", bg: "#FFF3E3", text: "#B85200" }, // guiaOrange
  "Música en Vivo": { border: "#A259FF", bg: "#F3E8FF", text: "#5B2A91" }, // guiaPurple
  "Monumentos Históricos": {
    border: "#00C2FF",
    bg: "#E3F8FF",
    text: "#007A99",
  }, // guiaCyan
  Restaurantes: { border: "#FF6F61", bg: "#FFE3E3", text: "#B23A48" }, // guiaSunset
  Parques: { border: "#00C48C", bg: "#E3FFF3", text: "#007A5A" }, // guiaGreen
  "Espacios de Arte": { border: "#FF61A6", bg: "#FFE3F1", text: "#B23A7A" }, // guiaPink
};

export function Category({ category }: { category: string }) {
  // Buscar primero en los colores de guía, luego en los de agenda/rutas
  const color =
    categoryColorsGuia[category] ||
    categoryColors[category as keyof typeof categoryColors];

  return (
    color && (
      <span
        className={`inline-block w-auto rounded-full border px-3 py-1 text-sm`}
        style={{
          borderColor: color.border,
          backgroundColor: color.bg,
          color: color.text,
        }}
      >
        {category}
      </span>
    )
  );
}
