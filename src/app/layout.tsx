import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Nav } from "@/app/components/Nav";
import { Footer } from "@/app/components/Footer";

const general_sans = localFont({
  src: "./../assets/fonts/GeneralSans-Variable.woff2",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://indaga.site"),
  title: "Indaga",
  description: "Sitio de Indaga",
  openGraph: {
    images: "/opengraph-image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${general_sans.className} font-normal bg-offwhite`}>
      <body>
        <Nav />
        <main className="flex flex-col bg-offwhite text-eerie items-center pt-16 relative">
          {children}
        </main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-1QH9PC856P" />
    </html>
  );
}
