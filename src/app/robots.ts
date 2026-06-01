import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://anubhav2026.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the authenticated personal view and auth endpoints out of the index.
      disallow: ["/me", "/login", "/api/", "/logout"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
