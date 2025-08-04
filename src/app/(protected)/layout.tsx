"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      setIsLoading(false);
      if (!session) {
        router.push("/login");
      }
    }
  }, [session, isPending, router]);

  if (isLoading || isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
          <p className="text-foreground mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="">
      <main className="mx-auto max-w-7xl px-4 py-6 pt-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
