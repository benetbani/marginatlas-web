import type { MetadataRoute } from "next";
import { getTopCells, getTopRegionalCells, slugify, regionalCellUrl } from "@/lib/cells";
import { COUNTRIES, SECTORS_ORDERED } from "@/lib/taxonomy";
import { score100to10 } from "@/components/QualityDots";

const BASE_URL = "https://marginatlas.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [topUs, topRegional] = await Promise.all([
    getTopCells(5000),
    getTopRegionalCells(20000),
  ]);

  // Filter regional cells to quality_10 >= 4 (Plan v8 Track U + V.1)
  const goodRegional = topRegional.filter(
    (c) => score100to10(c.quality_score) >= 4
  );

  const usUrls = topUs
    .filter((c) => c.geo_name && (c.industry_description || c.naics_6))
    .map((c) => ({
      url: `${BASE_URL}/${c.country.toLowerCase()}/${slugify(c.geo_name)}/${slugify(c.industry_description || c.naics_6)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const regionalUrls = goodRegional
    .map((c) => regionalCellUrl(c))
    .filter((u) => u.length > 0)
    .map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // All 191 country landing pages (Plan v8 Track R)
  const countryUrls = COUNTRIES.map((c) => ({
    url: `${BASE_URL}/${c.code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 25 sector landing pages
  const sectorUrls = SECTORS_ORDERED.map((s) => ({
    url: `${BASE_URL}/sectors/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const staticUrls = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE_URL}/about-data`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/browse`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/ask`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${BASE_URL}/sectors`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/you`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/saved`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
  ];

  // Cap total at ~45,000 to stay safely under Vercel's 50,000 per-sitemap limit.
  const all = [...staticUrls, ...countryUrls, ...sectorUrls, ...usUrls, ...regionalUrls];
  return all.slice(0, 45000);
}
