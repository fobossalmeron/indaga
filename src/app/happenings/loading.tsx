import FechasHappeningsSkeleton from "@/assets/img/fechas_happenings_skeleton.svg";

export default function Loading() {
  return (
      <div className="flex w-full flex-col items-center animate-fadeIn">
        <div className="flex h-[153px] w-[284px] justify-center">
          <FechasHappeningsSkeleton />
        </div>
        <div className="relative mt-16 flex flex-wrap justify-center gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-80 w-[305px] animate-pulse overflow-hidden rounded-3xl bg-gray-200"
            >
              <div className="h-40 rounded-t-lg bg-gray-300"></div>
              <div className="p-4">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-300"></div>
                <div className="h-4 w-1/2 rounded bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
