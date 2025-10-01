export default function Loading() {
  return (
    <>
      <header className="animate-pulse flex w-full max-w-[1020px] flex-row items-center gap-4 px-5 pt-8 pb-5 md:pt-20">
        <div className="flex w-full flex-col text-start">
          <div className="flex flex-col md:gap-2">
            <div className="h-8 w-48 bg-gray-300 rounded md:h-12 md:w-64 lg:h-14"></div>
            <div className="h-5 w-64 bg-gray-300 rounded md:h-7 md:w-80 mt-2"></div>
          </div>
        </div>
      </header>
      <div className="animate-fadeIn flex w-full flex-col items-center">
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
    </>
  );
}
