import { categories } from "../happenings/happenings.types";
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
  "Fuera de la ciudad": { border: "#527442", bg: "#52744225", text: "#1A5200" },
  "En la ciudad": { border: "#2149E5", bg: "#2149E530", text: "#00209E" },
};

export function Category({
  category,
}: {
  category: (typeof categories)[number] | (typeof routeCategories)[number];
}) {
  const color = categoryColors[category];

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
