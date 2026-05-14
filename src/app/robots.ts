import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/sign-in", "/_next/"],
      },
    ],
    sitemap: "https://marginatlas.com/sitemap.xml",
    host: "https://marginatlas.com",
  };
}
