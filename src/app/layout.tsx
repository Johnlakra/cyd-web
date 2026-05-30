import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Anubhav 2026", template: "%s · Anubhav 2026" },
  description:
    "Anubhav 2026 — a Catholic youth retreat across three venues in Punjab. Dates, venues, speakers, timetable and announcements.",
  openGraph: {
    title: "Anubhav 2026",
    description: "A Catholic youth retreat across three venues in Punjab.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Anubhav 2026" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
