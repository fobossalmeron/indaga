"use server";

import { headers } from "next/headers";
import auth from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase";
import { toStoredTreasureCode, parseHuntYear } from "@/lib/treasure-hunt-config";
import type { TreasureHunt, TreasureHunt2025TreasureUpdate, TreasureHuntWithStats } from "../../types/database";

async function adminClient() {
  const session = await auth.api.getSession({ headers: await headers() });
  const adminEmails = (process.env.ADMIN_EMAILS || "fobos.salmeron@gmail.com").split(",").map(email => email.trim().toLowerCase());
  if (!session?.user || !adminEmails.includes(session.user.email.toLowerCase())) throw new Error("Acceso no autorizado");
  return createServerSupabaseClient();
}

function externalUrl(value: string | null | undefined) {
  if (!value?.trim()) return null;
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("El enlace debe comenzar con https:// o http://");
  return url.href;
}

export async function getAllTreasureHunts() {
  const client = await adminClient();
  const { data, error } = await client.from("treasure_hunts").select("*, treasure_hunt_2025_treasures(count), treasure_hunt_2025_scans(count), treasure_hunt_2025_progress(count)").order("year", { ascending: false });
  if (error) throw new Error(error.message);
  return data as TreasureHuntWithStats[];
}

export async function getTreasureHuntById(huntId: string) {
  const client = await adminClient();
  const { data, error } = await client.from("treasure_hunts").select("*, treasure_hunt_2025_treasures(*), treasure_hunt_2025_scans(*), treasure_hunt_2025_progress(*)").eq("id", huntId).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createTreasureHunt(input: { name: string; year: number; description?: string; start_date?: string; end_date?: string; total_treasures?: number }) {
  const client = await adminClient();
  if (!parseHuntYear(input.year)) throw new Error("Edición no admitida");
  const { data: existing, error: lookupError } = await client.from("treasure_hunts").select("id").eq("year", input.year);
  if (lookupError) throw new Error(lookupError.message);
  if (existing?.length) throw new Error("Esta edición ya existe. Selecciónala para administrarla.");
  const { data, error } = await client.from("treasure_hunts").insert({ ...input, is_active: false }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTreasureHunt(huntId: string, updates: Partial<TreasureHunt>) {
  const client = await adminClient();
  const { data: hunt, error: lookupError } = await client.from("treasure_hunts").select("year").eq("id", huntId).single();
  if (lookupError) throw new Error(lookupError.message);
  if (hunt.year === 2025) throw new Error("La edición 2025 se conserva como historial");
  const { data, error } = await client.from("treasure_hunts").update({ is_active: updates.is_active }).eq("id", huntId).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function addTreasure(input: { hunt_id: string; treasure_code: string; treasure_name: string; treasure_secret: string; treasure_location_maps_url?: string; treasure_website?: string; treasure_category?: string }) {
  const client = await adminClient();
  const { data: hunt, error: lookupError } = await client.from("treasure_hunts").select("year, total_treasures").eq("id", input.hunt_id).single();
  if (lookupError) throw new Error(lookupError.message);
  if (hunt.year === 2025) throw new Error("La edición 2025 se conserva como historial");
  const { count, error: countError } = await client.from("treasure_hunt_2025_treasures").select("id", { count: "exact", head: true }).eq("hunt_id", input.hunt_id);
  if (countError) throw new Error(countError.message);
  if (count !== null && count >= (hunt.total_treasures || 0)) throw new Error("Esta edición ya tiene todos sus lugares. Edita los existentes para completar enlaces.");
  const { data, error } = await client.from("treasure_hunt_2025_treasures").insert({
    hunt_id: input.hunt_id,
    treasure_name: input.treasure_name.trim(),
    treasure_code: toStoredTreasureCode(hunt.year, input.treasure_code.trim().toUpperCase()),
    treasure_secret: hunt.year === 2026 ? "ENCONTRADO" : input.treasure_secret,
    treasure_location_maps_url: externalUrl(input.treasure_location_maps_url),
    treasure_website: externalUrl(input.treasure_website),
    treasure_category: input.treasure_category || null,
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateTreasure(treasureId: string, updates: TreasureHunt2025TreasureUpdate) {
  const client = await adminClient();
  const { data: treasure, error: lookupError } = await client.from("treasure_hunt_2025_treasures").select("hunt_id, treasure_hunts(year)").eq("id", treasureId).single();
  if (lookupError) throw new Error(lookupError.message);
  const year = treasure.treasure_hunts?.year;
  if (year !== 2026) throw new Error("La edición 2025 se conserva como historial");
  const { data, error } = await client.from("treasure_hunt_2025_treasures").update({
    treasure_name: updates.treasure_name,
    treasure_location_maps_url: updates.treasure_location_maps_url === undefined ? undefined : externalUrl(updates.treasure_location_maps_url),
    treasure_website: updates.treasure_website === undefined ? undefined : externalUrl(updates.treasure_website),
    treasure_category: updates.treasure_category,
    treasure_secret: "ENCONTRADO",
  }).eq("id", treasureId).eq("hunt_id", treasure.hunt_id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTreasure(_treasureId: string) {
  await adminClient();
  throw new Error("No se eliminan tesoros desde el panel para conservar visitas y códigos QR impresos");
}
