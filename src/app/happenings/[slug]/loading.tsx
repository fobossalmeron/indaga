"use client";
import { Fade } from "react-awesome-reveal";
export default function Loading() {
  return (
    <Fade>
      <div className="mt-16 flex min-h-[500px] w-full max-w-[920px] animate-pulse overflow-hidden rounded-3xl bg-white">
        <div className="h-100 relative w-1/2 max-w-[460px] bg-gray-200"></div>
        <div className="flex w-1/2 flex-col items-start gap-6 px-12 py-11">
          <div className="flex flex-col items-start gap-1">
            <div className="h-4 w-3/4 rounded bg-gray-300"></div>
            <div className="h-4 w-1/2 rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </Fade>
  );
}
