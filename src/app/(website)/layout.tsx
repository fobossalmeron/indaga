import { Nav } from "@/app/components/navs/Nav";
import { Footer } from "@/app/components/Footer";
import { MobileNav } from "@/app/components/navs/MobileNav";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="text-foreground bg-background relative flex flex-col items-center pt-16">
      <Nav />
      <MobileNav />
      {children}
      <Footer />
    </main>
  );
}
