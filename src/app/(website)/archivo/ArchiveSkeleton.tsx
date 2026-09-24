export default function ArchiveSkeleton() {
  return (
    <div role="status" className="mt-10 sm:mt-16">
      <span className="sr-only">Cargando publicaciones del archivo…</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="mb-[30px] h-11 w-[202px] rounded-xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[22px] bg-white"
            >
              <div className="h-[130px] bg-gray-300 sm:h-[105px]" />
              <div className="flex flex-col items-start gap-2 px-6 py-6">
                <div className="h-[26px] w-28 rounded-full bg-gray-200" />
                <div className="w-full space-y-2 py-px">
                  <div className="h-6 w-full rounded bg-gray-200" />
                  <div className="h-6 w-4/5 rounded bg-gray-200" />
                </div>
                <div className="mt-1 h-[27px] w-24 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
