import Image from "next/image";
import blob_happenings from "@/assets/img/blob_happenings.svg?url";
import Link from "next/link";
import { Button } from "@/app/components/Button";

export default function Home() {
  return (
    <div className="align-start relative flex w-full bg-offwhite md:grid md:grid-cols-2">
      <div
        id="home-blob"
        className="absolute -top-32 w-full rotate-180 md:fixed md:top-[9%] md:h-[500px] md:max-w-[50%] md:rotate-0 2xl:top-[15%]"
      >
        <div className="relative h-60 w-full animate-fadeIn md:h-[700px]">
          <Image
            src={blob_happenings}
            alt="Home Blob"
            fill
            sizes="50vw"
            className="overflow-visible object-contain object-right md:object-cover"
            priority
          />
        </div>
      </div>
      <div className="flex w-full max-w-[750px] flex-col items-center justify-start px-5 py-36 sm:px-[10%] md:col-start-2 md:pt-32 lg:pt-40">
        <h1 className="text-5xl sm:text-7xl">404</h1>
        <p className="mt-2 max-w-[290px] text-center text-lg lg:max-w-[330px] lg:text-xl">
          Esta página no existe, por favor revisa el link y vuelve a intentarlo
        </p>
        <Link href="/">
          <Button className="mt-10 border-2 border-blue bg-white !text-blue hover:bg-[#DFE2EC] hover:text-blue">
            Volver al Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
