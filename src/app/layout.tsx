import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/app/styles/globals.css";
import { Nav } from "@/app/components/navs/Nav";
import { Footer } from "@/app/components/Footer";
import { MobileNav } from "@/app/components/navs/MobileNav";
import { ProgressBarProvider } from "@/app/components/ProgressBarProvider";
import { LenisProvider } from "@/app/components/LenisProvider";
import { ScrollToTop } from "@/app/components/ScrollToTop";

const general_sans = localFont({
  src: "./../assets/fonts/GeneralSans-Variable.woff2",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://indaga.site"),
  title: "Descubre la ciudad - Indaga",
  description:
    "Encuentra eventos y una guía de la ciudad para disfrutar la temporada.",
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
    <html
      lang="es"
      className={`${general_sans.className} bg-offwhite font-normal`}
    >
      <body className="flex h-full flex-col justify-between">
        <ProgressBarProvider>
          <LenisProvider>
            <ScrollToTop />
            <Nav />
            <MobileNav />
            <main className="text-notBlack relative flex flex-col items-center pt-16">
              {children}
            </main>
            <Footer />
          </LenisProvider>
        </ProgressBarProvider>
      </body>

      <GoogleAnalytics gaId="G-1QH9PC856P" />
    </html>
  );
}
