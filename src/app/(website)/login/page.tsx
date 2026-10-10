"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MagicLinkForm } from "@/app/components/auth/magic-link-form";
import { useAuth } from "@/hooks/use-auth";
import { EmailSentSuccess } from "@/app/components/auth/EmailSentSuccess";
import { TreasureHuntBanner } from "@/app/components/auth/TreasureHuntBanner";
import { TreasureScanConfetti } from "@/app/components/auth/TreasureScanConfetti";
import { AuthLoadingSpinner } from "@/app/components/auth/AuthLoadingSpinner";
import { Loader2 } from "lucide-react";
import { parseHuntYear, treasurePath } from "@/lib/treasure-hunt-config";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [emailToEdit, setEmailToEdit] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const celebratedScan = useRef<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, data: session, isPending } = useAuth();

  const scannedTreasure = searchParams.get("scanned");
  // A legacy login link with only a code belongs to 2025.
  const year = parseHuntYear(searchParams.get("year"), scannedTreasure ? 2025 : 2026);
  const scanPath = scannedTreasure && year ? treasurePath(year, scannedTreasure) : null;

  useEffect(() => {
    if (isPending || session?.user || year !== 2026 || !scanPath || celebratedScan.current === scanPath) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShowConfetti(true);
    const timeout = window.setTimeout(() => {
      celebratedScan.current = scanPath;
      setShowConfetti(false);
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [isPending, session?.user, year, scanPath]);

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(scanPath || (session.user.role === "admin" ? "/admin" : "/treasures"));
    }
  }, [session, isPending, scanPath, router]);

  const handleLogin = async (email: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setResendMessage("");
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
      if (!result.data) throw new Error("No se pudo enviar el enlace");
      setSentEmail(email);
      if (sentEmail !== null) setResendMessage("Te enviamos un nuevo enlace. Revisa tu correo.");
    } catch (error: any) {
      console.error("Login error:", error);
      if (sentEmail !== null) {
        setResendMessage("No pudimos reenviar el correo. Intenta nuevamente en unos momentos.");
      } else {
        alert("Error al enviar el enlace mágico. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return <AuthLoadingSpinner />;
  }

  if (sentEmail !== null) {
    return (
      <EmailSentSuccess
        email={sentEmail}
        isResending={isLoading}
        resendMessage={resendMessage}
        onResend={() => handleLogin(sentEmail)}
        onBack={() => {
          setEmailToEdit(sentEmail);
          setSentEmail(null);
          setResendMessage("");
        }}
      />
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 px-4 py-25 sm:px-6 lg:px-8">
      {showConfetti && <TreasureScanConfetti />}
      <div className="w-full space-y-8 sm:max-w-[370px]">
        <h2 className="text-center text-3xl">
          {scannedTreasure ? "¡Tesoro encontrado!" : "Iniciar sesión"}
        </h2>
        <div className="space-y-8 rounded-2xl bg-white px-6 py-8">
          {scannedTreasure ? (
            <TreasureHuntBanner treasureName={scannedTreasure} year={year || 2026} />
          ) : (
            <p className="text-center text-base text-gray-600">
              Inicia sesión o crea tu cuenta
            </p>
          )}
          <MagicLinkForm onSubmit={handleLogin} isLoading={isLoading} initialEmail={emailToEdit} />
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
