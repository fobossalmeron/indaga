"use client";

import { ProgressProvider } from "@bprogress/next/app";

export const ProgressBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <ProgressProvider
        height="4px"
        color="#65468b"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
      </ProgressProvider>
    </>
  );
};
