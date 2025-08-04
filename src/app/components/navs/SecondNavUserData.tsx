"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/app/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

export const SecondNavUserData = () => {
  const { data: session, signOut } = useAuth();
  const router = useRouter();

  if (!session) return null;

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6 sm:px-5">
        <div className="mt-16 flex items-center justify-between pt-2 pb-4">
          <div className="flex items-center space-x-4">
            <span className="text-foreground text-sm">
              Hola, {session.user?.name || session.user?.email}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    router.push("/login");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
