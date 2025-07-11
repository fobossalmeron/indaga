import type {
  HappeningDocumentData,
  LugarDocumentData,
} from "../../../prismicio-types";

// Tipos de categorías
export type HappeningCategory = NonNullable<HappeningDocumentData["category"]>;
export type LugarCategoria = NonNullable<LugarDocumentData["categoria"]>;

// Mapeo de colores para categorías de agenda
const agendaColors: Record<
  HappeningCategory,
  { border: string; bg: string; text: string }
> = {
  Arte: { border: "#B7F400", bg: "#CAE47C25", text: "#527442" },
  Gastronomía: {
    border: "#FF7404",
    bg: "rgba(255, 116, 4, 0.25)",
    text: "#B85200",
  },
  Música: { border: "#527442", bg: "rgba(82, 116, 66, 0.25)", text: "#1A5200" },
  Cine: { border: "#FF00FF", bg: "rgba(255, 0, 255, 0.25)", text: "#800080" },
  Naturaleza: { border: "#527442", bg: "#52744225", text: "#1A5200" },
  Historia: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
  Literatura: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
  Danza: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
  Teatro: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
  Ciudad: { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
};

// Mapeo de colores para categorías de guía
const guiaColors: Record<
  LugarCategoria,
  { border: string; bg: string; text: string }
> = {
  Cafeterías: { border: "#FFD600", bg: "#FFF9E3", text: "#8A6D00" },
  "Bares & Cantinas": { border: "#FF7404", bg: "#FFF3E3", text: "#B85200" },
  "Música en Vivo": { border: "#A259FF", bg: "#F3E8FF", text: "#5B2A91" },
  "Monumentos Históricos": {
    border: "#00C2FF",
    bg: "#E3F8FF",
    text: "#007A99",
  },
  Restaurantes: { border: "#FF6F61", bg: "#FFE3E3", text: "#B23A48" },
  Parques: { border: "#00C48C", bg: "#E3FFF3", text: "#007A5A" },
  "Espacios de Arte": { border: "#FF61A6", bg: "#FFE3F1", text: "#B23A7A" },
};

// Mapeo de colores para rutas
const rutasColors: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  "En la ciudad": { border: "#00C2FF", bg: "#E3F8FF", text: "#007A99" },
  "Fuera de la ciudad": { border: "#00C48C", bg: "#E3FFF3", text: "#007A5A" },
};

interface CategoryProps {
  category: string;
}

export function Category({ category }: CategoryProps) {
  // Buscar en los mapeos
  const color = (
    guiaColors as Record<string, { border: string; bg: string; text: string }>
  )[category] ||
    (
      agendaColors as Record<
        string,
        { border: string; bg: string; text: string }
      >
    )[category] ||
    rutasColors[category] || {
      border: "#E5E7EB",
      bg: "#F3F4F6",
      text: "#374151",
    };

  return (
    <span
      className="inline-block w-auto rounded-full border px-3 py-1 text-sm"
      style={{
        borderColor: color.border,
        backgroundColor: color.bg,
        color: color.text,
      }}
    >
      {category}
    </span>
  );
}
