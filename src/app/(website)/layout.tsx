import { Footer } from "@/app/components/Footer";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="text-foreground bg-background relative flex flex-col items-center">
      {children}
      <Footer />
    </main>
  );
}
