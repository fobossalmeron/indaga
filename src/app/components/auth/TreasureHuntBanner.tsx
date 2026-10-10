interface TreasureHuntBannerProps {
  treasureName: string;
  year: number;
}

export function TreasureHuntBanner({ treasureName, year }: TreasureHuntBannerProps) {
  return (
    <div className="border-primary/20 bg-primary/10 rounded-2xl border p-4 text-center text-primary">
      <p className="text-base">
        {year === 2025 ? "Treasure Hunt 2025" : "Has encontrado un tesoro"}
      </p>
      <div className="mt-2 flex items-center justify-center gap-2">
        <svg
          className="h-[32.4px] w-[32.4px] shrink-0 -rotate-12"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M26 3L31 17L46 19L34 28L38 44L24 35L9 43L13 27L2 18L18 16Z"
            fill="#FFD600"
          />
        </svg>
        <p className="min-w-0 break-words text-lg font-medium">
          {treasureName.replace(/-/g, " ")}
        </p>
      </div>
      <p className="mt-2 text-base">
        {year === 2025 ? "Ingresa tu email para consultar tu historial de 2025. Esta edición terminó." : "Inicia sesión para registrar tu visita"}
      </p>
    </div>
  );
}
