"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MagicLinkForm } from "@/app/components/auth/magic-link-form";
import { useAuth } from "@/hooks/use-auth";

function RegisterContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scannedTreasure, setScannedTreasure] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth(); // Usar signIn en vez de signUp

  useEffect(() => {
    const scanned = searchParams.get('scanned');
    if (scanned) {
      setScannedTreasure(scanned);
    }
  }, [searchParams]);

  const handleRegister = async (email: string, fullName?: string) => {
    if (!fullName) {
      alert("El nombre completo es requerido para registrarse");
      return;
    }

    setIsLoading(true);
    try {
      // Determine callback URL based on scanned treasure
      const callbackURL = scannedTreasure ? `/2025/t/${scannedTreasure}` : "/dashboard";
      
      const result = await signIn.magicLink({
        email,
        name: fullName,
        callbackURL,
      });

      if (result.data) {
        setShowSuccess(true);
      }
    } catch (error: any) {
      console.error("Register error:", error);
      alert("Error al crear la cuenta. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              ¡Cuenta creada!
            </h2>
            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Te hemos enviado un enlace mágico para verificar tu cuenta.
                  </p>
                  <p className="mt-2 text-sm text-green-700">
                    Revisa tu correo y haz clic en el enlace para completar el
                    registro. El enlace expira en 10 minutos.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setShowSuccess(false)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                ← Volver al formulario
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Crear cuenta en INDAGA
            </h2>
            {scannedTreasure && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-800">
                      {scannedTreasure.replace(/-/g, ' ')} escaneado con éxito
                    </p>
                    <p className="mt-1 text-sm text-blue-700">
                      Para hacer válida la promoción, crea tu cuenta
                    </p>
                  </div>
                </div>
              </div>
            )}
            <p className="mt-2 text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link
                href={`/login${scannedTreasure ? `?scanned=${scannedTreasure}` : ''}`}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-lg border bg-white px-6 py-8 shadow-sm">
            <MagicLinkForm
              mode="register"
              onSubmit={handleRegister}
              isLoading={isLoading}
            />
          </div>

          <div className="px-4 text-center text-xs text-gray-500">
            Al crear una cuenta, aceptas nuestros{" "}
            <Link
              href="/terminos"
              className="text-blue-600 hover:text-blue-500"
            >
              términos de servicio
            </Link>{" "}
            y{" "}
            <Link
              href="/privacidad"
              className="text-blue-600 hover:text-blue-500"
            >
              política de privacidad
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
