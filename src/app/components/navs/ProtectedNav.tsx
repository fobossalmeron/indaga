import Logo from "@/assets/img/logotipo.svg";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { NavLink } from "./NavLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Settings, LogOut } from "lucide-react";

export const ProtectedNav = () => {
  const { data: session, signOut } = useAuth();
  const router = useRouter();

  return (
    <>
      <nav className="text-accent fixed top-0 right-0 left-0 z-50 flex h-16 w-full items-center justify-center bg-white px-5 sm:px-10 md:px-20">
        <div className="flex w-full max-w-[1240px] items-center justify-between">
          <Link href="/" className="transition-all">
            <Logo
              width={95}
              height={18}
              className="animate-fadeSimple text-foreground transition-all"
            />
          </Link>
          <nav className="animate-fadeSimple flex items-center gap-7 transition-all">
            <ul className="flex items-center gap-3 transition-all">
              <li className="hidden lg:block">
                <NavLink href="/dashboard">Mi perfil</NavLink>
              </li>
              <li className="hidden lg:block">
                <NavLink href="/saved-items">Favoritos</NavLink>
              </li>
              <li className="hidden lg:block">
                <NavLink href="/treasures">Tesoros</NavLink>
              </li>
              <li className="hidden lg:block">
                <NavLink href="/agenda">Agenda</NavLink>
              </li>
              <li className="hidden lg:block">
                <NavLink href="/guia">Guía</NavLink>
              </li>
              <li className="hidden lg:block">
                <NavLink href="/blog">Blog</NavLink>
              </li>
            </ul>
          </nav>
          <div className="animate-fadeSimple flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none font-medium">
                      Mi cuenta
                    </p>
                    <p className="text-muted-foreground text-xs leading-none">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
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
      </nav>
    </>
  );
};
