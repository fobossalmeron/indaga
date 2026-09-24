export default function Loading() {
  return (
    <div
      role="status"
      className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-start gap-x-16 px-5 pt-32 pb-24 sm:pt-[182px] sm:pb-48 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)]"
    >
      <span className="sr-only">Cargando artículo…</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse lg:pt-6">
        <div className="mb-3 h-7 w-48 rounded bg-gray-200" />
        <div className="space-y-3">
          <div className="h-10 w-full rounded bg-gray-200 sm:h-14" />
          <div className="h-10 w-4/5 rounded bg-gray-200 sm:h-14" />
        </div>
        <div className="mt-6 h-7 w-40 rounded bg-gray-200" />
      </div>
      <div
        aria-hidden="true"
        className="mt-8 aspect-[440/280] rounded-xl bg-gray-300 motion-safe:animate-pulse lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0"
      />
      <div
        aria-hidden="true"
        className="mt-10 w-full max-w-[635px] min-w-0 space-y-8 motion-safe:animate-pulse lg:col-start-1 lg:row-start-2 lg:mt-14"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-5 w-full rounded bg-gray-200" />
            <div className="h-5 w-full rounded bg-gray-200" />
            <div className="h-5 w-5/6 rounded bg-gray-200" />
            <div className="h-5 w-3/4 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
