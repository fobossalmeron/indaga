import { UserPlus, ScanLine, Star, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import SantaLucia from "@/assets/img/festival_santa_lucia.svg";
import Link from "next/link";

export default function TreasureHuntFull() {
  return (
    <div className="animate-fadeIn2">
      <p className="max-w-[35ch] pt-2 text-xl md:pt-12 md:text-2xl">
        Durante la temporada del FISL 2025, INDAGA te invita a participar en su{" "}
        <span className="rounded-lg bg-white px-2 py-1">Treasure Hunt</span>
      </p>

      <div className="mt-12 flex items-center justify-start gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
            <UserPlus className="text-primary h-8 w-8" />
          </div>
          <p className="text-sm font-medium">Regístrate</p>
        </div>

        <ArrowRight className="text-muted-foreground h-6 w-6" />

        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
            <ScanLine className="text-primary h-8 w-8" />
          </div>
          <p className="text-sm font-medium">Escanea</p>
        </div>

        <ArrowRight className="text-muted-foreground h-6 w-6" />

        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
            <Star className="text-primary h-8 w-8" />
          </div>
          <p className="text-sm font-medium">Colecciona</p>
        </div>
      </div>

      <div className="mt-8 flex">
        <Button asChild>
          <Link href="/login">Regístrate</Link>
        </Button>
      </div>

      <SantaLucia className="text-foreground mt-12 w-full max-w-[170px]" />
    </div>
  );
}
