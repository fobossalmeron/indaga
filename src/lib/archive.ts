import type { Content } from "@prismicio/client";

export const archiveTypes = ["Conversación", "Ensayo"] as const;
export type ArchiveType = (typeof archiveTypes)[number];

export type ArchivePost = Pick<Content.PostDocument, "id" | "uid"> & {
  data: Pick<
    Content.PostDocument["data"],
    "title" | "hero" | "date" | "article_type"
  >;
};

// Published posts may not have the new field until they are saved in Prismic.
export function getArchiveType(
  type: Content.PostDocument["data"]["article_type"] | null | undefined,
): ArchiveType {
  return type === "Conversación" ? "Conversación" : "Ensayo";
}

export function getArchiveEyebrow(
  type: Content.PostDocument["data"]["article_type"] | null | undefined,
) {
  return getArchiveType(type) === "Conversación"
    ? "En conversación con"
    : "Ensayo sobre";
}

export function formatArchiveDate(date: string, withWeekday = false) {
  const [year, month, day] = date.split("-");
  const formatted = `${Number(day)}.${month}.${year}`;
  if (!withWeekday) return formatted;

  const weekday = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));

  return `${weekday} ${Number(day)}.${month} del ${year}`;
}
