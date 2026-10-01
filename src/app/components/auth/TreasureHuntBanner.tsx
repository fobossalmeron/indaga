import { XCircle } from "lucide-react";

interface TreasureHuntBannerProps {
  treasureName: string;
  year: number;
}

export function TreasureHuntBanner({ treasureName, year }: TreasureHuntBannerProps) {
  return (
    <div className="border-primary/20 bg-primary/10 mt-4 rounded-lg border p-4">
      <div className="flex items-start">
        <div className="ml-3">
          <p className="text-primary text-base">Treasure Hunt {year}</p>
          <p className="text-primary text-lg font-medium">
            {treasureName.replace(/-/g, " ")}
          </p>
          <p className="text-primary/80 mt-1 text-base">
            {year === 2025 ? "Ingresa tu email para consultar tu historial de 2025. Esta edición terminó." : "Ingresa tu email para continuar con este lugar y registrar tu visita"}
          </p>
        </div>
        <div className="flex-shrink-0">
          <XCircle className="text-primary/50 h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
