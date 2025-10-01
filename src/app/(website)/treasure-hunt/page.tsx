import PublicTreasureGrid from "@/app/components/features/PublicTreasureGrid";
import { getActiveTreasureHunt } from "@/lib/treasure-hunt-2025";
import { createServerSupabaseClient } from "@/lib/supabase";
import TreasureHuntFull from "./TreasureHuntFull";

async function getTreasures() {
  try {
    const hunt = await getActiveTreasureHunt();
    if (!hunt) {
      return [];
    }

    const serverClient = createServerSupabaseClient();
    const { data: allTreasures, error } = await serverClient
      .from("treasure_hunt_2025_treasures")
      .select("id, treasure_code, treasure_name, treasure_location_maps_url")
      .eq("hunt_id", hunt.id)
      .order("treasure_code", { ascending: true });

    if (error) {
      console.error("Error fetching public treasures:", error);
      return [];
    }

    return allTreasures;
  } catch (error) {
    console.error("Error in getTreasures:", error);
    return [];
  }
}

export default async function TreasureHunt() {
  const treasures = await getTreasures();

  return (
    <div className="flex flex-col px-5 pb-24">
      <TreasureHuntFull />
      <PublicTreasureGrid treasures={treasures} />
    </div>
  );
}
