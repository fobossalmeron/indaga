import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Indaga",
  description: "Explora nuestros artículos y mantente actualizado con las últimas noticias y tendencias.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white">
      {children}
    </main>
  );
} 