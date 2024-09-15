import Image from "next/image";
import { CategoriaProps } from "./categoria.types";
import Link from "next/link";
import { categorias } from "./categorias";

export default function GuideAll() {
  return (
    <>
      <div className="flex gap-4 max-w-[1000px] flex-wrap justify-center pb-24">
        {categorias.map((categoria, index) => (
          <Link href={`/guia/${categoria.slug}`} key={index} className={`${categoria.color}`}>
            <p>{categoria.title}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
