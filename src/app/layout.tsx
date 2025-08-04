import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/app/styles/globals.css";
import { ProgressBarProvider } from "@/app/components/ProgressBarProvider";
import { LenisProvider } from "@/app/components/LenisProvider";
import { ScrollToTop } from "@/app/components/ScrollToTop";
import { NavController } from "@/app/components/navs/NavController";

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
      className={`${general_sans.className} bg-background font-normal`}
    >
      <body className="bg-background flex h-full flex-col justify-between">
        <ProgressBarProvider>
          <LenisProvider>
            <ScrollToTop />
            <NavController />
            {children}
          </LenisProvider>
        </ProgressBarProvider>
      </body>

      <GoogleAnalytics gaId="G-C5EE6QLH20" />
    </html>
  );
}
