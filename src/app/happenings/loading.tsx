export default function Loading() {
  return (
    <div className="flex w-full animate-fadeIn flex-col items-center">
      <div className="relative mt-16 flex flex-wrap justify-center gap-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="group flex h-full w-full animate-pulse flex-col overflow-hidden rounded-3xl bg-white shadow-transparent sm:w-[305px]"
          >
            <div className="relative h-[130px] w-full overflow-hidden bg-gray-300"></div>
            <div className="flex h-full flex-col justify-between gap-2 px-5 py-4">
              <div className="flex flex-col items-start gap-2">
                <div className="h-6 w-20 rounded bg-gray-300"></div>
                <div className="h-8 w-full rounded bg-gray-300"></div>
                <div className="h-4 w-1/2 rounded bg-gray-300"></div>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 h-6 w-2/3 rounded bg-gray-300"></div>
                <div className="h-10 w-full rounded bg-gray-300"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
