import { Loader2 } from "lucide-react";
import Logo from "@/assets/img/logotipo.svg";

export function AuthLoadingSpinner() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center" role="status" aria-label="Cargando">
      <Loader2 className="text-primary mx-auto mb-4 h-10 w-10 animate-spin" aria-hidden="true" />
      <Logo width={95} height={18} className="text-foreground" role="img" aria-label="Indaga" />
    </div>
  );
}
