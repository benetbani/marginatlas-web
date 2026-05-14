import type { MetadataRoute } from "next";
import { getTopCells, slugify } from "@/lib/cells";

const BASE_URL = "https://marginatlas.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const top = await getTopCells(5000);
  const cellUrls = top
    .filter((c) => c.geo_name && (c.industry_description || c.naics_6))
    .map((c) => ({
      url: `${BASE_URL}/${c.country.toLowerCase()}/${slugify(c.geo_name)}/${slugify(c.industry_description || c.naics_6)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/methodology`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...cellUrls,
  ];
}
