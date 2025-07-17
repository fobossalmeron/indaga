export default function Loading() {
  return (
    <div className="animate-fadeIn2 z-10 mb-24 px-4">
      <div className="mx-auto mt-8 flex max-w-[920px] animate-pulse flex-col overflow-hidden rounded-3xl bg-white sm:mt-16 md:flex-row">
        <div className="relative min-h-60 w-full bg-gray-300 md:w-1/2 md:max-w-[460px]"></div>
        <div className="flex w-full flex-col items-start gap-6 px-5 py-11 sm:px-10 md:w-1/2 md:px-12">
          <div className="flex w-full flex-col items-start gap-1">
            <div className="h-6 w-20 rounded bg-gray-300"></div>
            <div className="h-8 w-full rounded bg-gray-300 sm:w-3/4"></div>
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            <div className="h-8 w-1/2 rounded bg-gray-300"></div>
            <div className="h-6 w-1/3 rounded bg-gray-300"></div>
          </div>
          <div className="w-full space-y-2">
            <div className="h-4 w-full rounded bg-gray-300"></div>
            <div className="h-4 w-5/6 rounded bg-gray-300"></div>
            <div className="h-4 w-4/5 rounded bg-gray-300"></div>
          </div>
          <div className="xsm:flex-row flex w-full flex-col gap-2">
            <div className="h-10 w-full rounded bg-gray-300"></div>
            <div className="h-10 w-full rounded bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
