import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Nav } from "@/app/components/navs/Nav";
import { Footer } from "@/app/components/Footer";
import { MobileNav } from "@/app/components/navs/MobileNav";
import Providers from "./ProgressBarProvider";

const general_sans = localFont({
  src: "./../assets/fonts/GeneralSans-Variable.woff2",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://indaga.site"),
  title: "Off Festival - Indaga",
  description: "Off Festival del Festival Santa Lucía - Indaga",
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
      <body>
        <Providers>
          <Nav />
          <MobileNav />
          <main className="relative flex flex-col items-center pt-16 text-eerie">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>

      <GoogleAnalytics gaId="G-1QH9PC856P" />
    </html>
  );
}
