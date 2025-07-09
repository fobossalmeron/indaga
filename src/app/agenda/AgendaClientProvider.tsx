"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";

interface AgendaClientProviderProps {
  children: ReactNode;
}

function AgendaClientProvider({ children }: AgendaClientProviderProps) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}

export default AgendaClientProvider;
