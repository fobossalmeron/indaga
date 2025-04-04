import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">
        Artículo no encontrado
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Lo sentimos, no pudimos encontrar el artículo que estás buscando.
      </p>
      <Link
        href="/blog"
        className="rounded-lg bg-indigo-600 px-6 py-3 text-white transition-colors hover:bg-indigo-700"
      >
        Volver al blog
      </Link>
    </div>
  );
} 