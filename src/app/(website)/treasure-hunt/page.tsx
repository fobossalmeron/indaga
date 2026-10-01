import { getTreasureHunt } from "@/lib/treasure-hunt-2025";
import { parseHuntYear, toPublicTreasureCode, getHuntAvailability } from "@/lib/treasure-hunt-config";
import { createServerSupabaseClient } from "@/lib/supabase";
import { notFound } from "next/navigation";
import TreasureHuntFull from "./TreasureHuntFull";
import PublicTreasureGrid from "./PublicTreasureGrid";

export const dynamic = "force-dynamic";

export default async function TreasureHunt({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const year = parseHuntYear((await searchParams).year);
  if (!year) notFound();
  const hunt = await getTreasureHunt(year);
  const status = hunt ? getHuntAvailability(hunt) : "inactive";
  const serverClient = createServerSupabaseClient();
  const { data: treasures, error } = hunt ? await serverClient
    .from("treasure_hunt_2025_treasures")
    .select("id, treasure_code, treasure_name, treasure_location_maps_url, treasure_website, treasure_category")
    .eq("hunt_id", hunt.id)
    .order("treasure_name", { ascending: true }) : { data: [], error: null };

  return (
    <div className="flex flex-col px-5 pb-24">
      <h2 className="text-2xl">TREASURE HUNT {year}</h2>
      {/* {year === 2026 && <p className="mt-3">Del 30 de septiembre a las 23:00 al 1 de diciembre de 2026 · Hora de Monterrey · Festival Internacional de Santa Lucía</p>} */}
      {year === 2026 && <p className="mt-3">Las fechas serán reveladas pronto</p>}
      {status === "ended" ? <p className="mt-4">Esta edición terminó. Inicia sesión para consultar tu historial.</p> : <TreasureHuntFull year={year} />}
      {error ? <p role="alert" className="mt-8">No se pudo cargar el catálogo. Intenta de nuevo en unos minutos.</p> : <PublicTreasureGrid year={year} historical={status === "ended"} treasures={(treasures || []).map(treasure => ({ ...treasure, treasure_code: toPublicTreasureCode(year, treasure.treasure_code) }))} />}
    </div>
  );
}
