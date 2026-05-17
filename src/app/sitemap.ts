import type { MetadataRoute } from "next";
import { getTopCells, getTopRegionalCells, slugify, regionalCellUrl } from "@/lib/cells";

const BASE_URL = "https://marginatlas.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [topUs, topRegional] = await Promise.all([
    getTopCells(5000),
    getTopRegionalCells(10000),
  ]);

  const usUrls = topUs
    .filter((c) => c.geo_name && (c.industry_description || c.naics_6))
    .map((c) => ({
      url: `${BASE_URL}/${c.country.toLowerCase()}/${slugify(c.geo_name)}/${slugify(c.industry_description || c.naics_6)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const regionalUrls = topRegional
    .map((c) => regionalCellUrl(c))
    .filter((u) => u.length > 0)
    .map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
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
      url: `${BASE_URL}/about-data`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/browse`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/ask`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...usUrls,
    ...regionalUrls,
  ];
}
