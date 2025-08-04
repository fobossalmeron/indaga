"use client";

import { useAuth } from "@/hooks/use-auth";
import { WebsiteNav } from "./WebsiteNav";
import { MobileWebsiteNav } from "./MobileWebsiteNav";
import { ProtectedNav } from "./ProtectedNav";
import { MobileProtectedNav } from "./MobileProtectedNav";

export const NavController = () => {
  const { data: session } = useAuth();

  // Si el usuario está autenticado, mostrar navegación protegida
  if (session) {
    return (
      <>
        <ProtectedNav />
        <MobileProtectedNav />
      </>
    );
  }

  // Si no está autenticado, mostrar navegación pública
  return (
    <>
      <WebsiteNav />
      <MobileWebsiteNav />
    </>
  );
};
