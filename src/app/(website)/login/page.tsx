"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagicLinkForm } from "@/app/components/auth/magic-link-form";
import { useAuth } from "@/hooks/use-auth";
import { EmailSentSuccess } from "@/app/components/auth/EmailSentSuccess";
import { TreasureHuntBanner } from "@/app/components/auth/TreasureHuntBanner";
import { AuthLoadingSpinner } from "@/app/components/auth/AuthLoadingSpinner";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scannedTreasure, setScannedTreasure] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, data: session, isPending } = useAuth();

  useEffect(() => {
    const scanned = searchParams.get("scanned");
    if (scanned) {
      setScannedTreasure(scanned);
    }
  }, [searchParams]);

  // Redirect if already logged in and has scanned treasure
  useEffect(() => {
    console.log("Login redirect effect:", {
      isPending,
      session: !!session?.user,
      scannedTreasure,
    });

    if (!isPending && session?.user && scannedTreasure) {
      console.log(
        "Redirecting to treasure scan:",
        `/2025/t/${scannedTreasure}`,
      );
      router.push(`/2025/t/${scannedTreasure}`);
    } else if (!isPending && session?.user && !scannedTreasure) {
      // Already logged in without scanned treasure, go to dashboard
      const isAdmin = session.user.role === "admin";
      const redirectPath = isAdmin ? "/admin" : "/treasures";
      console.log("Redirecting to dashboard/admin:", redirectPath);
      router.push(redirectPath);
    }
  }, [session, isPending, scannedTreasure, router]);

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
        callbackURL = isAdmin ? "/admin" : "/treasures";
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

  if (isPending) {
    return <AuthLoadingSpinner />;
  }

  if (showSuccess) {
    return <EmailSentSuccess onBack={() => setShowSuccess(false)} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 py-12 sm:px-6 lg:px-8">
      {scannedTreasure && (
        <TreasureHuntBanner treasureName={scannedTreasure} />
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
