import type { Metadata } from "next";
import { Spectral, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

// Lumen type pairing: Spectral (display serif, personality) + Hanken Grotesk (clean text).
const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://anubhav2026.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Anubhav 2026 — Retreat for Youth", template: "%s · Anubhav 2026" },
  description:
    "Anubhav 2026 — a retreat for the youth of the Diocese of Jalandhar, across three venues in Punjab: Phagwara, Abohar, and Amritsar. 2–8 June 2026.",
  keywords: [
    "Anubhav 2026",
    "Diocese of Jalandhar",
    "Youth Commission",
    "Catholic youth retreat",
    "Punjab",
  ],
  openGraph: {
    title: "Anubhav 2026 — Retreat for Youth",
    description:
      "A retreat for the youth of the Diocese of Jalandhar, across three venues in Punjab. 2–8 June 2026.",
    type: "website",
    siteName: "Anubhav 2026",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anubhav 2026 — Retreat for Youth",
    description: "A retreat for the youth of the Diocese of Jalandhar. 2–8 June 2026.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spectral.variable} ${hanken.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-ink">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
