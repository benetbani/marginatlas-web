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
import { hasRegionalCoverage } from "@/lib/coverage/regional";
import { getAdmin1Regions } from "@/lib/coverage/admin1";
import { isPathSuppressed } from "@/lib/quality/thin_pages";
import neighborhoodsJson from "../../data/cities/neighborhoods_v1.json";
import cityListJson from "../../data/cities/city_list_v1.json";
import cityComparisonsJson from "../../data/cities/city_comparisons_v1.json";

const BASE_URL = "https://www.marginatlas.com";

export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // Plan v24 Block 11 — Next 15's metadata-route system passes `id` as
  // a STRING ("0", "1", ...) even when generateSitemaps returned numeric
  // ids. Strict-equality checks against numbers silently fell through
  // to the empty array, which is why every shard was 110 bytes before
  // this fix. Coerce defensively so the dispatcher works for both
  // numeric and stringified ids.
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  if (numId === 0) return staticAndContainersSitemap();
  if (numId === 1) return usCellsSitemap();
  if (numId === 2) return regionalCellsSitemap();
  if (numId === 3) return coverageScorecardSitemap();
  if (numId === 4) return regionIndustryHubsSitemap();
  if (numId === 5) return neighborhoodSitemap();
  if (numId === 6) return citiesSitemap();
  if (numId === 7) return knowledgeBaseSitemap();
  return [];
}

async function staticAndContainersSitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/browse`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/world`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/coverage`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
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
  // Plan v30 hotfix — was 5000, dropped to 500 to reduce build memory.
  // Was contributing to OOM at the very end of static gen.
  const cells = await getTopCells(500);
  return cells
    .filter((c) => c.geo_name && (c.industry_description || c.naics_6))
    .map((c) => {
      const path = `/${c.country.toLowerCase()}/${slugify(c.geo_name)}/${slugify(c.industry_description || c.naics_6)}`;
      return { path };
    })
    // Plan v24 Block 5 — drop pages flagged as thin / missing-core / broken.
    .filter(({ path }) => !isPathSuppressed(path))
    .map(({ path }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
}

async function regionalCellsSitemap(): Promise<MetadataRoute.Sitemap> {
  // Plan v26 follow-up: 20000 limit hit Supabase statement timeout
  // and emptied the shard. PostgREST caps per-request rows at 1000,
  // so we use that cap and keep the quality_score ordering so the
  // downstream filter (score100to10 >= 4) keeps the right rows.
  // Plan v30 hotfix — dropped from 1000 to 300 to reduce build memory.
  const cells = await getTopRegionalCells(300);
  return cells
    // Plan v26 P8 — standardized on the native 0-100 scale. quality_score
    // >= 40 corresponds to the old `score100to10(...) >= 4` filter.
    .filter((c) => (c.quality_score ?? 0) >= 40)
    .map((c) => regionalCellUrl(c))
    .filter((u) => u.length > 0)
    // Plan v24 Block 5 — same suppression for the international cells.
    .filter((path) => !isPathSuppressed(path))
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

/**
 * Plan v26 Phase B.5 — neighborhood × industry URLs.
 *
 * Emits /[country]/[city]/[neighborhood]/[industry] for every entry
 * in data/cities/neighborhoods_v1.json crossed with the top-20
 * industries. ~23 cities × ~5 neighborhoods × 20 industries =
 * ~2,300 URLs. Comfortably within the 50K-per-shard sitemap limit.
 */
async function neighborhoodSitemap(): Promise<MetadataRoute.Sitemap> {
  const TOP_INDUSTRIES = [
    "restaurants",
    "cafes-coffee-shops",
    "bars-pubs-clubs",
    "bakeries-pastries",
    "hotels-lodging",
    "clothing-stores",
    "jewelry-stores",
    "grocery-stores",
    "hairdressers-beauty",
    "legal-services",
    "management-consulting",
    "accounting-bookkeeping",
    "software-development",
    "marketing-design",
    "real-estate-agencies",
    "residential-construction",
    "specialty-trades",
    "auto-repair-shops",
    "veterinary-pet-care",
    "fabricated-metal-mfg",
  ];

  type CityListEntry = { slug: string; iso2: string };
  type CityScheme = {
    scheme: string;
    neighborhoods: Array<{ slug: string }>;
  };

  const cities = (cityListJson as { cities: CityListEntry[] }).cities;
  const nbCities = (
    neighborhoodsJson as { cities: Record<string, CityScheme> }
  ).cities;

  const out: MetadataRoute.Sitemap = [];
  for (const [citySlug, scheme] of Object.entries(nbCities)) {
    const cityEntry = cities.find((c) => c.slug === citySlug);
    if (!cityEntry) continue;
    const country = cityEntry.iso2.toLowerCase();
    for (const nb of scheme.neighborhoods) {
      for (const industrySlug of TOP_INDUSTRIES) {
        out.push({
          url: `${BASE_URL}/${country}/${citySlug}/${nb.slug}/${industrySlug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.55,
        });
      }
    }
  }
  return out;
}


/** Plan v27 Lane C — cities deep build: metropolis + neighborhood hub +
 *  curiosities + city-vs-city comparison pages. */
async function citiesSitemap(): Promise<MetadataRoute.Sitemap> {
  type CityListEntry = { slug: string; tier: number };
  type Pair = { left: string; right: string };
  const cities = (cityListJson as { cities: CityListEntry[] }).cities;
  const pairs = (cityComparisonsJson as { pairs: Pair[] }).pairs;
  const neighborhoodCities = (neighborhoodsJson as { cities: Record<string, unknown> }).cities;

  const out: MetadataRoute.Sitemap = [];
  out.push({ url: `${BASE_URL}/cities`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 });
  for (const c of cities) {
    out.push({ url: `${BASE_URL}/cities/${c.slug}`, lastModified: new Date(), changeFrequency: "weekly", priority: c.tier === 1 ? 0.85 : c.tier === 2 ? 0.75 : 0.6 });
    if (c.tier <= 2) {
      out.push({ url: `${BASE_URL}/cities/${c.slug}/curiosities`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 });
    }
  }
  for (const slug of Object.keys(neighborhoodCities)) {
    out.push({ url: `${BASE_URL}/cities/${slug}/neighborhoods`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  }
  for (const p of pairs) {
    out.push({ url: `${BASE_URL}/compare/cities/${p.left}-vs-${p.right}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  }
  return out;
}

/** Plan v27 Lane D — knowledge base for SEO. 60-page evergreen corpus
 *  routed under /learn/. */
async function knowledgeBaseSitemap(): Promise<MetadataRoute.Sitemap> {
  const { LEARN_ARTICLES } = await import("@/lib/learn/articles");
  const out: MetadataRoute.Sitemap = [];
  out.push({ url: `${BASE_URL}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 });
  for (const a of LEARN_ARTICLES) {
    out.push({ url: `${BASE_URL}/learn/${a.slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  }
  return out;
}
