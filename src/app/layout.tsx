import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { site } from "@/data/site";
import { buildJsonLd } from "@/lib/jsonld";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Cafe private room di Medan dengan area kerja remote, ruang meeting privat, dan venue wedding/event. Lihat menu digital, cek slot, lalu reservasi dan bayar DP online. Melayani area Medan Selayang, Padang Bulan, dan Sei Sikambing.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Seis Cafe & Public Space Medan | Cafe Private Room & Tempat Kerja Remote",
    template: "%s | Seis Cafe Medan",
  },
  description,
  keywords: [
    "cafe private room Medan",
    "tempat kerja remote Sei Sikambing",
    "cafe untuk meeting Medan",
    "venue wedding Medan",
    "reservasi cafe Medan",
    "Seis Cafe",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: site.name,
    title: "Seis Cafe & Public Space Medan",
    description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Suasana malam di Seis Cafe & Public Space" }],
  },
  twitter: { card: "summary_large_image", title: "Seis Cafe & Public Space Medan", description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0907",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen font-sans">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:text-ink"
        >
          Lewati ke konten
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c") }}
        />
        <AnalyticsScripts />
      </body>
    </html>
  );
}
