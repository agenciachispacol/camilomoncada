import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Camilo Moncada · IA para Emprendedores",
  description:
    "Ayudo a emprendedores a crecer sus empresas con soluciones de IA. Consultorías, clases virtuales y automatizaciones.",
  openGraph: {
    title: "Camilo Moncada · IA para Emprendedores",
    description:
      "Consultorías gratuitas, clases virtuales y automatizaciones con IA.",
    type: "website",
  },
  metadataBase: new URL("https://camilomoncada.ia"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05030f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-ink-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
