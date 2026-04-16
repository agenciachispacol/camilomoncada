import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://camilomoncada.ia";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = `${s.name} · ${s.role}`;
  const description = s.tagline;
  const image = s.avatar_url || `${SITE_URL}/og.png`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s · ${s.name}`,
    },
    description,
    keywords: [
      "IA para emprendedores",
      "Inteligencia Artificial",
      "consultoría IA",
      "clases de IA",
      "automatización IA",
      "Camilo Moncada",
      "crecimiento empresarial",
      "agentes IA",
      "prompts IA",
    ],
    authors: [{ name: s.name }],
    creator: s.name,
    publisher: s.name,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "es_CO",
      url: SITE_URL,
      title,
      description,
      siteName: s.name,
      images: image ? [{ url: image, width: 1200, height: 630, alt: s.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
      ],
      apple: "/favicon.svg",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#05030f",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: s.name,
    jobTitle: s.role,
    description: s.tagline,
    image: s.avatar_url || undefined,
    url: SITE_URL,
    sameAs: [
      "https://www.instagram.com/camilomoncada.ia",
      "https://www.tiktok.com/@camilomoncada.ia",
    ],
    knowsAbout: [
      "Inteligencia Artificial",
      "Emprendimiento",
      "Automatización",
      "Consultoría empresarial",
    ],
    offers: {
      "@type": "Offer",
      name: "Consultoría gratuita de IA para emprendedores",
      description:
        "30 minutos de consultoría 1 a 1 para diseñar la hoja de ruta de IA para tu negocio",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: s.name,
    url: SITE_URL,
    inLanguage: "es",
  };

  return (
    <html lang="es" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-ink-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
