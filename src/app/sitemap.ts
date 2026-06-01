import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://anubhav2026.in";

// Public, indexable routes only (no /me, /login).
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/timetable", "/announcements", "/speakers", "/stats"];
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
