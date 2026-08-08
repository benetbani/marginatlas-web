/**
 * Sitemap (Track DD.6 split version + Plan v14 Phase C.7 hub expansion).
 *
 * Next 15 generateSitemaps splits one virtual sitemap into multiple physical
 * sitemap-NN.xml files behind a sitemap-index. Each sub-sitemap stays under
 * Google's 50,000-URL / 50MB cap.
 *
 * Buckets:
 *   id=0 → static + 195 country pages + coverage/world/status
 *          + Plan v14 C.7: 195 /[country]/industries hubs
 *   id=1 → top 500 US cells_master entries
 *   id=2 → top 300 regional_cells entries (filtered to quality_10 >= 4)
 *
 *   THOSE TWO NUMBERS WERE WRONG IN THIS COMMENT UNTIL 2026-08-02. It claimed
 *   5,000 and 20,000 while the code has called getTopCells(500) and
 *   getTopRegionalCells(300). Twenty-five times the truth, in the one place a
 *   reader looks to find out how much of the lattice is crawlable, and it is
 *   almost certainly a leftover from the caps being cut to survive a build that
 *   was running out of memory.
 *
 *   The caps themselves are still an open question and are NOT changed here.
 *   Nobody has established whether that memory ceiling was the development
 *   laptop, which has under 2GB free and cannot complete a production build, or
 *   the deploy environment, which has more. If it was the laptop, the site is
 *   advertising 800 URLs of a much larger lattice for no reason, and one build
 *   log settles it.
 *   id=3 → 195 /coverage/[iso2] scorecard pages
 *   id=4 → Plan v14 C.7: /[country]/[geo]/industries hubs across the ~36
 *          countries with regional coverage × their admin1 regions
 *          (~3,500 URLs, well under the 50K cap).
 */
import type { MetadataRoute } from "next";
import { getTopCells, getTopRegionalCells, slugify, regionalCellUrl, withBudget } from "@/lib/cells";
import { COUNTRIES } from "@/lib/taxonomy";
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
  // Next 15's metadata-route system passes `id` as
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
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about-data`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    // Listed with about-data rather than with privacy and terms, which are
    // absent from this file on purpose: those are documents a reader goes
    // looking for, whereas this one answers questions people type into a search
    // box, and it is the page carrying the site's FAQPage structured data.
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
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

  // /[Country]/industries hub per country (~195 URLs).
  // High-value internal-link nexus for the country topical-authority play.
  const countryHubUrls: MetadataRoute.Sitemap = COUNTRIES.map((c) => ({
    url: `${BASE_URL}/${c.code.toLowerCase()}/industries`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticUrls, ...countryUrls, ...countryHubUrls];
}

async function usCellsSitemap(): Promise<MetadataRoute.Sitemap> {
  // Was 5000, dropped to 500 to reduce build memory.
  // Was contributing to OOM at the very end of static gen.
  // Fail-soft: on a cold or throttled DB this read must not hang the build to
  // the 300s per-route cap (it did, deploy ks27agr69). On timeout the shard
  // ships thinner; URLs stay reachable via on-demand ISR and internal links,
  // and the next healthy build refills it.
  const cells = await withBudget(getTopCells(500), [], 20_000, "sitemap:usCells");
  return cells
    .filter((c) => c.geo_name && (c.industry_description || c.naics_6))
    .map((c) => {
      const path = `/${c.country.toLowerCase()}/${slugify(c.geo_name)}/${slugify(c.industry_description || c.naics_6)}`;
      return { path };
    })
    // Drop pages flagged as thin / missing-core / broken.
    .filter(({ path }) => !isPathSuppressed(path))
    .map(({ path }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
}

async function regionalCellsSitemap(): Promise<MetadataRoute.Sitemap> {
  // 20000 Limit hit Supabase statement timeout
  // and emptied the shard. PostgREST caps per-request rows at 1000,
  // so we use that cap and keep the quality_score ordering so the
  // downstream filter (score100to10 >= 4) keeps the right rows.
  // Dropped from 1000 to 300 to reduce build memory.
  const cells = await withBudget(getTopRegionalCells(300), [], 20_000, "sitemap:regionalCells");
  return cells
    // Standardized on the native 0-100 scale. quality_score
    // >= 40 corresponds to the old `score100to10(...) >= 4` filter.
    .filter((c) => (c.quality_score ?? 0) >= 40)
    .map((c) => regionalCellUrl(c))
    .filter((u) => u.length > 0)
    // Same suppression for the international cells.
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
 * Region industry hubs.
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
 * Neighborhood × industry URLs.
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

  /* WITHDRAWN 2026-08-08, ON THE FOUNDER'S INSTRUCTION, AND THE MEASUREMENT
     BEHIND IT.
     This shard declared 25,320 URLs, 90% of everything the site advertised.
     Measured on production: three trades in the same district share 95% of
     their body text (5-gram Jaccard 0.96 / 0.95 / 0.95, chrome stripped). They
     are one city figure multiplied by a district character score, so the
     numbers differ but the page does not.
     Google's own crawl-budget guidance names this as the first remedy for a
     site whose URLs sit in "Discovered, currently not indexed", which is ours:
     "eliminate duplicate content to focus crawling on unique content rather
     than unique URLs". 2,266 of 28,167 discovered is 8%.
     The district content is not being deleted. It moves into a section on the
     city page, one district selected by default, which is the founder's call
     and the next build. Until that lands the routes still RESOLVE, so nothing
     already linked breaks; they simply stop being advertised, and the pages
     themselves carry a noindex (see the [sub] route's generateMetadata).
     TOP_INDUSTRIES is kept below because the city-page section will need the
     same list. Note: `2026-08-08-seo-lattice.md`. */
  void cities;
  void nbCities;
  void TOP_INDUSTRIES;
  return [];
}


/** Cities deep build: metropolis + neighborhood hub +
 *  city-vs-city comparison pages. */
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
  }
  for (const slug of Object.keys(neighborhoodCities)) {
    out.push({ url: `${BASE_URL}/cities/${slug}/neighborhoods`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  }
  for (const p of pairs) {
    out.push({ url: `${BASE_URL}/compare/cities/${p.left}-vs-${p.right}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
  }
  return out;
}

/** Knowledge base for SEO. 60-page evergreen corpus
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
