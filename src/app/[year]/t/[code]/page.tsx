"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { parseHuntYear } from "@/lib/treasure-hunt-config";

interface TreasureLandingProps {
  params: Promise<{ year: string; code: string }>;
}

export default function TreasureLanding({ params }: TreasureLandingProps) {
  const router = useRouter();
  const { data: session, isPending } = useAuth();
  const processing = useRef(false);

  useEffect(() => {
    if (isPending || processing.current) return;
    processing.current = true;
    async function scan() {
      const { year: rawYear, code } = await params;
      const year = parseHuntYear(rawYear);
      if (!year) {
        router.replace("/treasures?error=invalid-year");
        return;
      }
      if (!session?.user) {
        router.replace(`/login?year=${year}&scanned=${encodeURIComponent(code)}`);
        return;
      }
      try {
        const response = await fetch("/api/treasure-scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year, code }),
        });
        const result = await response.json();
        if (result.redirect) {
          router.replace(result.redirect);
          return;
        }
      } catch (error) {
        console.error("Error processing treasure scan:", error);
      }
      router.replace(`/treasures?year=${year}&error=technical`);
    }
    void scan();
  }, [params, session, isPending, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
        <p className="text-gray-600">Procesando código QR...</p>
      </div>
    </div>
  );
}
