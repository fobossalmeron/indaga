export default function Loading() {
  return (
    <div className="animate-fadeIn flex w-full flex-col items-center">
      <div className="mb-8 flex w-full justify-center px-5 lg:justify-start">
        <div className="grid w-full max-w-full grid-cols-2 gap-2 sm:max-w-[500px]">
          <div className="h-10 w-full rounded-2xl bg-gray-200" />
          <div className="h-10 w-full rounded-2xl bg-gray-200" />
        </div>
      </div>
      <div className="relative mt-4 flex flex-wrap justify-center gap-8">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="group flex h-full w-full animate-pulse flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-transparent sm:w-[305px]"
          >
            <div className="relative h-40 w-full overflow-hidden rounded-t-[2.5rem] bg-gray-300"></div>
            <div className="flex h-full flex-col justify-between gap-2 px-5 py-4">
              <div className="flex flex-col items-start gap-2">
                <div className="h-6 w-20 rounded-2xl bg-gray-300"></div>
                <div className="h-8 w-full rounded-2xl bg-gray-300"></div>
                <div className="h-4 w-1/2 rounded-2xl bg-gray-300"></div>
              </div>
              <div className="flex flex-col">
                <div className="mb-4 h-6 w-2/3 rounded-2xl bg-gray-300"></div>
                <div className="h-10 w-full rounded-2xl bg-gray-300"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
