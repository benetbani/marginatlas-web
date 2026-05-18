/**
 * Sitemap (Track DD.6 split version).
 *
 * Next 15 generateSitemaps splits one virtual sitemap into multiple physical
 * sitemap-NN.xml files behind a sitemap-index. Each sub-sitemap stays under
 * Google's 50,000-URL / 50MB cap.
 *
 * Buckets:
 *   id=0 → static + 191 country pages + 25 sectors + coverage/world/status
 *   id=1 → top 5,000 US cells_master entries
 *   id=2 → top 20,000 regional_cells entries (filtered to quality_10 >= 4)
 *   id=3 → 191 /coverage/[iso2] scorecard pages
 */
import type { MetadataRoute } from "next";
import { getTopCells, getTopRegionalCells, slugify, regionalCellUrl } from "@/lib/cells";
import { COUNTRIES, SECTORS_ORDERED } from "@/lib/taxonomy";
import { score100to10 } from "@/components/QualityDots";

const BASE_URL = "https://marginatlas.com";

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  if (id === 0) return staticAndContainersSitemap();
  if (id === 1) return usCellsSitemap();
  if (id === 2) return regionalCellsSitemap();
  if (id === 3) return coverageScorecardSitemap();
  return [];
}

async function staticAndContainersSitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/browse`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/world`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/coverage`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ask`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sectors`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about-data`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/you`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/status`, lastModified: new Date(), changeFrequency: "daily", priority: 0.4 },
  ];

  const countryUrls: MetadataRoute.Sitemap = COUNTRIES.map((c) => ({
    url: `${BASE_URL}/${c.code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const sectorUrls: MetadataRoute.Sitemap = SECTORS_ORDERED.map((s) => ({
    url: `${BASE_URL}/sectors/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticUrls, ...countryUrls, ...sectorUrls];
}

async function usCellsSitemap(): Promise<MetadataRoute.Sitemap> {
  const cells = await getTopCells(5000);
  return cells
    .filter((c) => c.geo_name && (c.industry_description || c.naics_6))
    .map((c) => ({
      url: `${BASE_URL}/${c.country.toLowerCase()}/${slugify(c.geo_name)}/${slugify(c.industry_description || c.naics_6)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
}

async function regionalCellsSitemap(): Promise<MetadataRoute.Sitemap> {
  const cells = await getTopRegionalCells(20000);
  return cells
    .filter((c) => score100to10(c.quality_score) >= 4)
    .map((c) => regionalCellUrl(c))
    .filter((u) => u.length > 0)
    .map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
}

async function coverageScorecardSitemap(): Promise<MetadataRoute.Sitemap> {
  return COUNTRIES.map((c) => ({
    url: `${BASE_URL}/coverage/${c.code.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));
}
