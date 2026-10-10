import { cn } from "@/utils/cn";

export function TreasureStar({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-[32.4px] w-[32.4px] shrink-0 -rotate-12", className)}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M26 3L31 17L46 19L34 28L38 44L24 35L9 43L13 27L2 18L18 16Z"
        fill="#FFD600"
      />
    </svg>
  );
}
