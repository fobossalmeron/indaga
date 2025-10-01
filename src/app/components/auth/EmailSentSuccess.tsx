import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface EmailSentSuccessProps {
  onBack: () => void;
}

export function EmailSentSuccess({ onBack }: EmailSentSuccessProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl">¡Revisa tu correo!</h2>
          <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-green-900">
                  Te enviamos un enlace mágico a tu correo electrónico.
                </p>
                <p className="mt-2 text-base text-green-700">
                  Haz clic en el enlace para iniciar sesión. El enlace expira en
                  10 minutos.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="link" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
