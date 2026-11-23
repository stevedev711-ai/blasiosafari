import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";
import { siteConfig, isPreview, absoluteUrl } from "@/site.config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentManager } from "@/components/ConsentBanner";
import { AttributionCapture } from "@/components/AttributionCapture";
import { JsonLd } from "@/components/JsonLd";

// Self-hosted (SIL Open Font License). Swap these files to change the brand typefaces.
const display = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-500-italic.woff2", weight: "500", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["Georgia", "serif"],
});
const text = localFont({
  src: [
    { path: "./fonts/instrument-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/instrument-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-text",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: { default: `${siteConfig.brand.name} | Private safaris in Kenya`, template: `%s | ${siteConfig.brand.name}` },
  description:
    "Private, tailor-made safaris in Kenya, designed around your party, your pace and how you want to travel between the Maasai Mara, Lewa & Laikipia and the Chyulu Hills.",
  applicationName: siteConfig.brand.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.brand.name,
    locale: "en_GB",
    images: [{ url: "/images/mara-first-light.jpg", width: 1920, height: 1280, alt: "First light over the Maasai Mara" }],
  },
  twitter: { card: "summary_large_image" },
  robots: isPreview ? { index: false, follow: false, googleBot: { index: false, follow: false } } : { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#171713", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const banner = isPreview ? (
    <div className="preview-banner">
      Preview site. Not indexed by search engines, and the consultation form sends test enquiries only. <Link href="/image-credits">Image sources</Link>
    </div>
  ) : null;
  return (
    <html lang="en-GB" className={`${display.variable} ${text.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header previewBanner={banner} />
        <main id="main" tabIndex={-1}>{children}</main>
        <Footer />
        <ConsentManager />
        <AttributionCapture />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: siteConfig.brand.name,
            url: absoluteUrl("/"),
            description: "Private, tailor-made safaris in Kenya, quoted after a consultation.",
            areaServed: { "@type": "Country", name: "Kenya" },
            ...(siteConfig.contact.publicEmail ? { email: siteConfig.contact.publicEmail } : {}),
            ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
          }}
        />
      </body>
    </html>
  );
}
