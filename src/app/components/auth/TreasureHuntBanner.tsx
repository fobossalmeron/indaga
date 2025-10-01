import { XCircle } from "lucide-react";

interface TreasureHuntBannerProps {
  treasureName: string;
}

export function TreasureHuntBanner({ treasureName }: TreasureHuntBannerProps) {
  return (
    <div className="border-primary/20 bg-primary/10 mt-4 rounded-lg border p-4">
      <div className="flex items-start">
        <div className="ml-3">
          <p className="text-primary text-base">Treasure Hunt FISL</p>
          <p className="text-primary text-lg font-medium">
            {treasureName.replace(/-/g, " ")} escaneado con éxito
          </p>
          <p className="text-primary/80 mt-1 text-base">
            Para hacer válida la promoción, ingresa tu email
          </p>
        </div>
        <div className="flex-shrink-0">
          <XCircle className="text-primary/50 h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
