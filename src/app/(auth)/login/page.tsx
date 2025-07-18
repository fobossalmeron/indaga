"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MagicLinkForm } from "@/app/components/auth/magic-link-form";
import { useAuth } from "@/hooks/use-auth";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scannedTreasure, setScannedTreasure] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();

  useEffect(() => {
    const scanned = searchParams.get('scanned');
    if (scanned) {
      setScannedTreasure(scanned);
    }
  }, [searchParams]);

  const handleLogin = async (email: string) => {
    setIsLoading(true);
    try {
      // Determine redirect URL based on admin status and scanned treasure
      const adminEmails = ['fobos.salmeron@gmail.com']; // You can move this to env or config
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
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              ¡Revisa tu correo!
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
                    Te hemos enviado un enlace mágico a tu correo electrónico.
                  </p>
                  <p className="mt-2 text-sm text-green-700">
                    Haz clic en el enlace para iniciar sesión. El enlace expira
                    en 10 minutos.
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
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-white px-6 py-8 shadow-sm">
        <div>
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Iniciar sesión en INDAGA
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
                      Para hacer válida la promoción, inicia sesión o regístrate
                    </p>
                  </div>
                </div>
              </div>
            )}
            <p className="mt-2 text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link
                href={`/register${scannedTreasure ? `?scanned=${scannedTreasure}` : ''}`}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <MagicLinkForm
            mode="login"
            onSubmit={handleLogin}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Cargando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
