import { Eyes } from "./Eyes";
import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";

export default async function Nosotras() {
  const client = await createClient();
  const about = await client.getSingle("about");

  return (
    <div className="bg-indagaBrown w-full text-[#ECEAEC]">
      <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-32">
        <div className="animate-fadeIn w-full max-w-[950px]">
          <Eyes />
        </div>
        <div className="animate-fadeIn2 mx-5 flex max-w-[460px] flex-col items-start gap-6 py-20 sm:mx-10 sm:py-32">
          <div className="flex flex-col gap-2">
            <h1 className="max-w-[15ch] text-4xl sm:text-5xl">
              {about.data.title}
            </h1>
          </div>
          <div className="prose prose-invert">
            <PrismicRichText field={about.data.text} />
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 86400; // Revalidar cada 24 horas (86400 segundos)
