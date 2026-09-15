import type { Metadata } from "next";
import "./globals.css";

const siteDescription =
  "Fabricamos helados y te ayudamos a equipar tu local. Más de 60 sabores para tu heladería, desde el primer día.";
const shareTitle = "Full Cream | Más de 60 sabores";

export const metadata: Metadata = {
  metadataBase: new URL("https://fullcream.online"),
  title: "Full Cream | Fábrica de Helados",
  description: siteDescription,
  applicationName: "Full Cream",
  authors: [{ name: "Full Cream" }],
  creator: "Full Cream",
  publisher: "Full Cream",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "fábrica de helados",
    "helados por mayor",
    "abrir heladería",
    "equipamiento para heladería",
    "helados Villa Bosch",
    "Full Cream",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Full Cream",
    title: shareTitle,
    description: siteDescription,
    images: [
      {
        url: "https://fullcream.online/og.png",
        width: 520,
        height: 520,
        alt: "Full Cream | Fábrica de Helados",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: shareTitle,
    description: siteDescription,
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
