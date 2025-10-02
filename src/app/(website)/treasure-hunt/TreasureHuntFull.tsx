import { UserPlus, ScanLine, Star, ArrowRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

export default function TreasureHuntFull() {
  return (
    <div className="animate-fadeIn2">
      <div className="mt-8 flex items-center justify-start gap-4">
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
      <p className="mt-8 max-w-[45ch] text-lg leading-[1.3]">
        Durante la temporada del FISL 2025,{" "}
        <span className="font-medium">INDAGA</span> te invita a participar en el
        Treasure Hunt más grande de la ciudad
      </p>
      <div className="mt-8 flex">
        <Button asChild>
          <Link href="/login">Regístrate</Link>
        </Button>
      </div>
    </div>
  );
}
