"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagicLinkForm } from "@/app/components/auth/magic-link-form";
import { useAuth } from "@/hooks/use-auth";
import { EmailSentSuccess } from "@/app/components/auth/EmailSentSuccess";
import { TreasureHuntBanner } from "@/app/components/auth/TreasureHuntBanner";
import { AuthLoadingSpinner } from "@/app/components/auth/AuthLoadingSpinner";
import { Loader2 } from "lucide-react";
import { parseHuntYear, treasurePath } from "@/lib/treasure-hunt-config";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, data: session, isPending } = useAuth();

  const scannedTreasure = searchParams.get("scanned");
  // A legacy login link with only a code belongs to 2025.
  const year = parseHuntYear(searchParams.get("year"), scannedTreasure ? 2025 : 2026);
  const scanPath = scannedTreasure && year ? treasurePath(year, scannedTreasure) : null;

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(scanPath || (session.user.role === "admin" ? "/admin" : "/treasures"));
    }
  }, [session, isPending, scanPath, router]);

  const handleLogin = async (email: string) => {
    setIsLoading(true);
    try {
      // Determine redirect URL based on admin status and scanned treasure
      const adminEmails = ["fobos.salmeron@gmail.com"]; // You can move this to env or config
      const isAdmin = adminEmails.includes(email.toLowerCase());

      let callbackURL: string;
      if (scanPath) {
        // Si viene de QR, redirect para procesar el treasure
        callbackURL = scanPath;
      } else {
        // Flujo normal
        callbackURL = isAdmin ? "/admin" : "/treasures";
      }

      const result = await signIn.magicLink({
        email,
        callbackURL,
      });

      if (result.error) throw new Error(result.error.message || "No se pudo enviar el enlace");
      if (result.data) setShowSuccess(true);
    } catch (error: any) {
      console.error("Login error:", error);
      alert("Error al enviar el enlace mágico. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return <AuthLoadingSpinner />;
  }

  if (showSuccess) {
    return <EmailSentSuccess onBack={() => setShowSuccess(false)} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-12 sm:px-6 lg:px-8">
      {scannedTreasure && (
        <TreasureHuntBanner treasureName={scannedTreasure} year={year || 2026} />
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
        <div className="flex min-h-dvh items-center justify-center">
          <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
