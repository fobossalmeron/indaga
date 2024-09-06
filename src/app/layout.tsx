import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

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
    <html lang="es" className={`${general_sans.className} bg-offwhite`}>
      <body>
        <Nav />
        <main className="flex flex-col bg-offwhite text-eerie pt-20 items-center px-8 py-16">
          {children}
        </main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-1QH9PC856P" />
    </html>
  );
}
