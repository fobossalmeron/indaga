import Image from "next/image";
import { Eyes } from "./Eyes";
import Logo from "@/assets/img/logotipo.svg";
import { Button } from "@/app/components/Button";
import Link from "next/link";
import { createClient } from '@/prismicio'
import { PrismicRichText } from "@prismicio/react";

export default async function Nosotras() {
  const client = createClient()
  const about = await client.getSingle('about')

  return (
    <div className="w-full bg-blue text-[#ECEAEC]">
      <div className="mt-32 flex w-full flex-col items-center justify-center">
        <Eyes />
        <div className="flex max-w-[460px] flex-col items-start gap-6 py-32">
          <div className="flex flex-col gap-2">
            <Logo width={115} className="" />
            <h1 className="max-w-[360px] text-5xl">
              {about.data.title}
            </h1>
          </div>
          <div className="prose prose-invert">
            <PrismicRichText field={about.data.text} />
          </div>
          <div className="pt-3">
            <Link href="/">
              <Button className="bg-white !text-blue hover:bg-[#DFE2EC] hover:text-blue">Visita el Off Festival</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
