import { Loader2 } from "lucide-react";

export function AuthLoadingSpinner() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center">
      <Loader2 className="text-primary mx-auto mb-4 h-10 w-10 animate-spin" />
      <p className="text-center text-gray-600">Verificando autenticación...</p>
    </div>
  );
}
