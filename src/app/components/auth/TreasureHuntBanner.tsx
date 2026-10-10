import { TreasureStar } from "@/app/components/ui/treasure-star";

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
        <TreasureStar />
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
