"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface HuntFilterProps {
  hunts: { id: string; name: string; year: number }[];
  selectedHuntId?: string;
}

export default function HuntFilter({ hunts, selectedHuntId }: HuntFilterProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex min-w-0 flex-col gap-2 sm:max-w-md">
      <label htmlFor="admin-hunt-filter" className="text-sm font-medium">Treasure Hunt</label>
      <Select
        value={selectedHuntId || "all"}
        disabled={pending}
        onValueChange={(huntId) => {
          startTransition(() => router.push(huntId === "all" ? "/admin" : `/admin?hunt=${encodeURIComponent(huntId)}`));
        }}
      >
        <SelectTrigger id="admin-hunt-filter" className="w-full min-w-0 bg-white">
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          {hunts.map((hunt) => <SelectItem key={hunt.id} value={hunt.id}>{hunt.year} · {hunt.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <span role="status" className="min-h-5 text-xs text-gray-500">{pending ? "Actualizando estadísticas…" : ""}</span>
    </div>
  );
}
