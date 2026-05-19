/**
 * Sitemap (Track DD.6 split version + Plan v14 Phase C.7 hub expansion).
 *
 * Next 15 generateSitemaps splits one virtual sitemap into multiple physical
 * sitemap-NN.xml files behind a sitemap-index. Each sub-sitemap stays under
 * Google's 50,000-URL / 50MB cap.
 *
 * Buckets:
 *   id=0 → static + 195 country pages + 25 sectors + coverage/world/status
 *          + Plan v14 C.7: 195 /[country]/industries hubs
 *   id=1 → top 5,000 US cells_master entries
 *   id=2 → top 20,000 regional_cells entries (filtered to quality_10 >= 4)
 *   id=3 → 195 /coverage/[iso2] scorecard pages
 *   id=4 → Plan v14 C.7: /[country]/[geo]/industries hubs across the ~36
 *          countries with regional coverage × their admin1 regions
 *          (~3,500 URLs, well under the 50K cap).
 */
import type { MetadataRoute } from "next";
import { getTopCells, getTopRegionalCells, slugify, regionalCellUrl } from "@/lib/cells";
import { COUNTRIES, SECTORS_ORDERED } from "@/lib/taxonomy";
import { score100to10 } from "@/components/QualityDots";
import { hasRegionalCoverage } from "@/lib/coverage/regional";
import { getAdmin1Regions } from "@/lib/coverage/admin1";

const BASE_URL = "https://marginatlas.com";

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
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
  if (id === 4) return regionIndustryHubsSitemap();
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

  // Plan v14 Phase C.7 — /[country]/industries hub per country (~195 URLs).
  // High-value internal-link nexus for the country topical-authority play.
  const countryHubUrls: MetadataRoute.Sitemap = COUNTRIES.map((c) => ({
    url: `${BASE_URL}/${c.code.toLowerCase()}/industries`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticUrls, ...countryUrls, ...sectorUrls, ...countryHubUrls];
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

/**
 * Plan v14 Phase C.7 — region industry hubs.
 *
 * For every country with regional coverage (per regional_coverage_v1.json,
 * currently ~36 countries) emit /[iso2]/[region-slug]/industries.
 * Caps each country at its full admin1 list; the total stays in the low
 * thousands — well under the 50K-URL bucket cap.
 */
async function regionIndustryHubsSitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = [];
  for (const c of COUNTRIES) {
    if (!hasRegionalCoverage(c.code)) continue;
    const regions = getAdmin1Regions(c.code);
    for (const r of regions) {
      out.push({
        url: `${BASE_URL}/${c.code.toLowerCase()}/${r.slug.toLowerCase()}/industries`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }
  return out;
}
