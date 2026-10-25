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
import { authClient } from "@/lib/auth-client";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [emailToEdit, setEmailToEdit] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const celebratedScan = useRef<string | null>(null);
  const shownScan = useRef<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, data: session, isPending } = useAuth();

  const scannedTreasure = searchParams.get("scanned");
  const [resolvedTreasure, setResolvedTreasure] = useState<{ key: string; name: string | null; error?: boolean } | null>(null);
  // A legacy login link with only a code belongs to 2025.
  const year = parseHuntYear(searchParams.get("year"), scannedTreasure ? 2025 : 2026);
  const scanKey = `${year}:${scannedTreasure}`;
  const currentTreasure = resolvedTreasure?.key === scanKey ? resolvedTreasure : null;
  const scanPath = scannedTreasure && year && currentTreasure?.name ? treasurePath(year, scannedTreasure) : null;

  useEffect(() => {
    if (!scannedTreasure || !year) return;
    const controller = new AbortController();
    async function resolveTreasure() {
      try {
        const response = await fetch(`/api/treasure-public?year=${year}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("No se pudo consultar el código");
        const data = await response.json();
        const treasure = data.treasures.find((item: { treasure_code: string; treasure_name: string }) => item.treasure_code === scannedTreasure);
        if (!controller.signal.aborted) setResolvedTreasure({ key: scanKey, name: treasure?.treasure_name ?? null });
      } catch {
        if (!controller.signal.aborted) setResolvedTreasure({ key: scanKey, name: null, error: true });
      }
    }
    void resolveTreasure();
    return () => controller.abort();
  }, [scannedTreasure, year, scanKey]);

  useEffect(() => {
    if (isPending || session?.user || year !== 2026 || !scanPath || celebratedScan.current === scanPath) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShowConfetti(true);
    shownScan.current = scanPath;
    const timeout = window.setTimeout(() => {
      celebratedScan.current = scanPath;
      setShowConfetti(false);
    }, 3000);
    return () => window.clearTimeout(timeout);
  }, [isPending, session?.user, year, scanPath]);

  useEffect(() => {
    if (!isPending && session?.user && (!scannedTreasure || currentTreasure || !year)) {
      router.replace(scanPath ? `${scanPath}${shownScan.current === scanPath ? "?confetti=seen" : ""}` : (session.user.role === "admin" ? "/admin" : "/treasures"));
    }
  }, [session, isPending, scanPath, router, scannedTreasure, currentTreasure, year]);

  useEffect(() => {
    if (!sentEmail || session?.user) return;
    let checking = false;
    const check = async () => {
      if (checking || document.visibilityState !== "visible") return;
      checking = true;
      try {
        const result = await authClient.getSession();
        if (result.data?.user) authClient.$store.notify("$sessionSignal");
      } catch {
        // A suspended phone or temporary network failure can retry on return.
      } finally {
        checking = false;
      }
    };
    const interval = window.setInterval(() => void check(), 10000);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", check);
    };
  }, [sentEmail, session?.user]);

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
        callbackURL = `${scanPath}${shownScan.current === scanPath ? "?confetti=seen" : ""}`;
      } else {
        // Flujo normal
        callbackURL = isAdmin ? "/admin" : "/treasures";
      }

      const handoff = await fetch("/api/auth/browser-handoff/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!handoff.ok) throw new Error("No se pudo iniciar el acceso. Intenta nuevamente.");

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

  if (isPending || (scannedTreasure && year && !currentTreasure)) {
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
          {currentTreasure?.name ? "¡Tesoro encontrado!" : "Iniciar sesión"}
        </h2>
        <div className="space-y-8 rounded-2xl bg-white px-6 py-8">
          {currentTreasure?.name ? (
            <TreasureHuntBanner treasureName={currentTreasure.name} year={year || 2026} />
          ) : (
            <p className="text-center text-base text-gray-600">
              {scannedTreasure
                ? currentTreasure?.error
                  ? "No pudimos verificar el código. Recarga la página para intentar de nuevo."
                  : "Este código no corresponde a un espacio de esta edición."
                : "Inicia sesión o crea tu cuenta"}
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
