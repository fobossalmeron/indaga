import { cn } from "@/utils/cn";

type AchievementIconProps = {
  kind: "trophy" | "compass" | "medal" | "crown";
  unlocked: boolean;
};

export function AchievementIcon({ kind, unlocked }: AchievementIconProps) {
  return (
    <svg
      className={cn("mr-3 size-6 shrink-0", unlocked ? "text-[#FFD600]" : "text-gray-400")}
      viewBox="0 0 48 48"
      fill="currentColor"
      aria-hidden="true"
    >
      {kind === "trophy" && (
        <>
          <path d="M12 5L36 3L34 20L30 27L26 30L27 37L35 39L36 44L12 45L14 39L21 37L20 30L15 25Z" />
          <path d="M13 10L4 9L5 19L10 25L18 27L17 22L12 21L9 17L8 13L14 14ZM35 8L44 7L43 18L38 24L31 26L32 21L36 20L39 16L40 11L34 12Z" />
        </>
      )}
      {kind === "compass" && (
        <path
          fillRule="evenodd"
          d="M23 3L36 7L44 19L43 32L33 43L19 45L7 36L3 22L9 10ZM32 13L16 23L14 36L29 26Z"
          clipRule="evenodd"
        />
      )}
      {kind === "medal" && (
        <>
          <path d="M9 3L21 4L25 18L16 23ZM27 4L40 2L31 23L23 18Z" />
          <path d="M25 18L30 26L40 27L33 34L35 45L24 40L14 46L15 35L7 28L19 26Z" />
        </>
      )}
      {kind === "crown" && (
        <path d="M3 12L15 22L25 4L33 23L46 11L40 36L9 38ZM10 41L40 39L39 45L11 46Z" />
      )}
    </svg>
  );
}
