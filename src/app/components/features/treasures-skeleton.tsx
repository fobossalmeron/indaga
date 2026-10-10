"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { Skeleton } from "@/app/components/ui/skeleton";

export function TreasurePageHeader({ children }: { children?: ReactNode }) {
  return (
    <div className="mb-8 flex w-full flex-col gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
      <Image
        src="/festival_santa_lucia.svg"
        alt="Festival Internacional de Santa Lucía"
        width={200}
        height={200}
        className="mx-auto md:mx-0"
      />
      <div className="flex justify-center md:justify-end">
        {children || (
          <div className="flex items-center gap-2 text-sm">
            <span>Edición</span>
            <Skeleton aria-hidden="true" className="h-9 w-24 rounded-xl" />
          </div>
        )}
      </div>
    </div>
  );
}

export function TreasureProgressSkeleton() {
  return (
    <div className="animate-fadeIn mt-12 motion-reduce:animate-none" aria-busy="true" aria-label="Cargando tesoros">
      <span role="status" className="sr-only">
        Cargando tus tesoros…
      </span>
      <div aria-hidden="true" className="space-y-6">
        <div className="rounded-2xl bg-white px-6 pt-9 pb-4 sm:pt-11 lg:pt-[29px]">
          <div className="mb-6 flex flex-col items-start">
            <Skeleton className="mb-2 h-9 w-64 max-w-full lg:h-12 lg:w-[27rem]" />
            <Skeleton className="mb-4 h-6 w-80 max-w-full" />
          </div>
          <div className="mb-6">
            <div className="mb-2 flex justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-8" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
          <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="rounded-2xl bg-gray-50 p-2 sm:p-4">
                <Skeleton className="mb-1 h-8 w-12" />
                <Skeleton className="h-5 w-20 max-w-full" />
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <Skeleton className="h-5 w-56 max-w-full" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <Skeleton className="mb-4 h-6 w-48 max-w-full" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <Skeleton className="mb-2 h-5 w-32 max-w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                </div>
                <Skeleton className="mt-2 h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6">
          <div className="mb-6 flex flex-col items-center justify-between gap-2 md:flex-row">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="mb-4 flex gap-2">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-7 w-28" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }, (_, index) => (
              <div
                key={index}
                className="flex flex-col items-center rounded-2xl border border-gray-200 p-4"
              >
                <Skeleton className="mb-2 size-6 rounded-full" />
                <Skeleton className="h-5 w-20 max-w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TreasuresPageSkeleton() {
  return (
    <div className="py-4">
      <div className="mx-auto max-w-4xl">
        <TreasurePageHeader />
        <TreasureProgressSkeleton />
      </div>
    </div>
  );
}
