"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProgressTracker from "@/app/components/features/progress-tracker";
import { useAuth } from "@/hooks/use-auth";
import { CURRENT_HUNT_YEAR, getHuntAvailability, parseHuntYear } from "@/lib/treasure-hunt-config";
import type { TreasureHunt, TreasureProgress, Treasure } from "@/lib/treasure-hunt-2025";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface TreasurePageData {
  hunt: TreasureHunt | null;
  progress: TreasureProgress | null;
  scannedTreasures: Treasure[];
  allTreasures: Treasure[];
  availableHunts: TreasureHunt[];
}

export default function TreasuresPage() {
  const [data, setData] = useState<TreasurePageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { data: session, isPending } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = session?.user?.id;
  const year = parseHuntYear(searchParams.get("year"));

  useEffect(() => {
    if (isPending || !userId || !year) {
      if (!isPending) setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setLoadError(false);
    setData(null);
    fetch(`/api/treasure-data?year=${year}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("No se pudo cargar esta edición");
        setData(await response.json());
      })
      .catch((error) => {
        if (error.name !== "AbortError") setLoadError(true);
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [userId, isPending, year]);

  if (loading || isPending) return <div className="py-12 text-center"><Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" /><p>Cargando Treasure Hunt...</p></div>;

  const status = data?.hunt ? getHuntAvailability(data.hunt) : null;
  const scanError = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <div className="py-4"><div className="mx-auto max-w-4xl">
      <div className="mb-8 flex w-full flex-col gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
        <Image src="/festival_santa_lucia.svg" alt="Festival Internacional de Santa Lucía" width={200} height={200} className="mx-auto md:mx-0" />
        {session?.user?.email && <p className="text-base md:text-right">Hola,<br /><span className="text-gray-600">{session.user.email}</span></p>}
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl">TREASURE HUNT {year || CURRENT_HUNT_YEAR}</h1>
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="treasure-edition">Edición</label>
          <Select value={String(year || CURRENT_HUNT_YEAR)} onValueChange={(value) => router.push(`/treasures?year=${value}`)}>
            <SelectTrigger id="treasure-edition" aria-label="Edición del Treasure Hunt" className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(data?.availableHunts?.length ? data.availableHunts : [{ id: "current", year: CURRENT_HUNT_YEAR }]).map((hunt) => <SelectItem key={hunt.id} value={String(hunt.year)}>{hunt.year}{hunt.year < CURRENT_HUNT_YEAR ? " · Historial" : ""}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      {status === "ended" && <p className="mb-6 rounded-lg bg-gray-100 p-4">Esta edición terminó. Consulta aquí tu historial de visitas y logros.</p>}
      {status === "upcoming" && <p className="mb-6 rounded-lg bg-blue-50 p-4">La edición todavía no comienza. Las visitas se registran desde el 30 de septiembre de 2026 a las 23:00, hora de Monterrey.</p>}
      {status === "inactive" && <p className="mb-6 rounded-lg bg-blue-50 p-4">Esta edición está en preparación. El registro de visitas aún no está habilitado.</p>}
      {scanError && <p role="alert" className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">{message || (scanError === "technical" ? "No se pudo registrar la visita. Intenta escanear el QR nuevamente." : "No se pudo registrar esta visita. Revisa la edición y sus fechas.")}</p>}
      {loadError ? <p role="alert">No se pudo cargar esta edición. Recarga la página para intentar de nuevo.</p> : !data?.hunt ? <p>Esta edición no está disponible.</p> :
        <ProgressTracker key={data.hunt.id} hunt={data.hunt} progress={data.progress} scannedTreasures={data.scannedTreasures} treasures={data.allTreasures} scannedCode={searchParams.get("scanned")} />}
    </div></div>
  );
}
