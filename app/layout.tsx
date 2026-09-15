import type { Metadata } from "next";
import "./globals.css";

const seoDescription =
  "Helados por mayor con más de 60 sabores. Equipamos tu local y te ayudamos a abrir tu heladería desde nuestra fábrica en Villa Bosch.";
const shareDescription =
  "Fabricamos helados y te ayudamos a equipar tu local. Más de 60 sabores para tu heladería, desde el primer día.";
const shareTitle = "Full Cream | Más de 60 sabores";

export const metadata: Metadata = {
  metadataBase: new URL("https://fullcream.online"),
  title: "Fábrica de Helados por Mayor | Full Cream",
  description: seoDescription,
  applicationName: "Full Cream",
  authors: [{ name: "Full Cream" }],
  creator: "Full Cream",
  publisher: "Full Cream",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Full Cream",
    title: shareTitle,
    description: shareDescription,
    images: [
      {
        url: "https://fullcream.online/og.png",
        width: 520,
        height: 520,
        alt: "Fábrica de helados por mayor Full Cream",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: shareTitle,
    description: shareDescription,
    images: ["https://fullcream.online/og.png"],
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
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon.png?v=2", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [{ url: "/favicon.png?v=2", type: "image/png", sizes: "512x512" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <body>{children}</body>
    </html>
  );
}
