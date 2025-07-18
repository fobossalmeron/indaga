"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagicLinkForm } from "@/app/components/auth/magic-link-form";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scannedTreasure, setScannedTreasure] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  useEffect(() => {
    const scanned = searchParams.get("scanned");
    if (scanned) {
      setScannedTreasure(scanned);
    }
  }, [searchParams]);

  const handleLogin = async (email: string) => {
    setIsLoading(true);
    try {
      // Determine redirect URL based on admin status and scanned treasure
      const adminEmails = ["fobos.salmeron@gmail.com"]; // You can move this to env or config
      const isAdmin = adminEmails.includes(email.toLowerCase());

      let callbackURL: string;
      if (scannedTreasure) {
        // Si viene de QR, redirect para procesar el treasure
        callbackURL = `/2025/t/${scannedTreasure}`;
      } else {
        // Flujo normal
        callbackURL = isAdmin ? "/admin" : "/dashboard";
      }

      const result = await signIn.magicLink({
        email,
        callbackURL,
      });

      if (result.data) {
        setShowSuccess(true);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert("Error al enviar el enlace mágico. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
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
                    Haz clic en el enlace para iniciar sesión. El enlace expira
                    en 10 minutos.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowSuccess(false)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al formulario
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-12 sm:px-6 lg:px-8">
      {scannedTreasure && (
        <div className="border-primary/20 bg-primary/10 mt-4 rounded-lg border p-4">
          <div className="flex items-start">
            <div className="ml-3">
              <p className="text-primary text-base">Treasure Hunt FISL</p>
              <p className="text-primary text-lg font-medium">
                {scannedTreasure.replace(/-/g, " ")} escaneado con éxito
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
      )}
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white px-6 py-8 shadow-sm">
        <div>
          <div className="text-center">
            <h2 className="text-foreground mt-6 text-3xl">Acceder a INDAGA</h2>
            <p className="mt-2 text-sm text-gray-600">
              Ingresa tu email para iniciar sesión o crear tu cuenta
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <MagicLinkForm onSubmit={handleLogin} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Cargando...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
