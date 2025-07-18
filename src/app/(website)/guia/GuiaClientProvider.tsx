"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactNode } from "react";

interface GuiaClientProviderProps {
  children: ReactNode;
}

function GuiaClientProvider({ children }: GuiaClientProviderProps) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}

export default GuiaClientProvider;
