import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import styles from "./layout.module.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://indaga.site'),
  title: "Indaga",
  description: "Sitio de Indaga",
  openGraph: {
    images: '/opengraph-image.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
        <div className={styles.footer}>
          <a href="mailto:hello@indaga.site">Contacto</a>© Indaga, 2024
        </div>
      </body>
      <GoogleAnalytics gaId="G-1QH9PC856P" />
    </html>
  );
}
