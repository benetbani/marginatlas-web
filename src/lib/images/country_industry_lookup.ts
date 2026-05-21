/**
 * Plan v20 — read the country-industry image manifest produced by
 * scripts/images/build_country_industry_images.ts.
 *
 * Components ask for an image by (iso2, industry_id). The manifest is
 * loaded once at module load and cached in memory. Missing entries
 * return null; callers fall back to SmartImage glyph placeholder.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type CountryIndustryImage = {
  url: string;
  source: "pexels" | "wikimedia";
  description: string;
  photographer?: string;
  width?: number;
  height?: number;
  generated_at?: string;
};

const MANIFEST_PATH = resolve(process.cwd(), "data", "images", "country_industry_v1.json");

let cache: Record<string, CountryIndustryImage> | undefined;

function load(): Record<string, CountryIndustryImage> {
  if (cache !== undefined) return cache;
  try {
    const raw = readFileSync(MANIFEST_PATH, "utf-8");
    cache = JSON.parse(raw) as Record<string, CountryIndustryImage>;
  } catch {
    cache = {};
  }
  return cache;
}

/**
 * Look up the country-industry image for a benchmark page. Returns null
 * when the manifest hasn't been built yet or this pair isn't covered.
 * Callers should fall back gracefully (SmartImage glyph or hide the
 * image surface entirely).
 */
export function findCountryIndustryImage(
  iso2: string | null | undefined,
  industryId: string | null | undefined,
): CountryIndustryImage | null {
  if (!iso2 || !industryId) return null;
  const map = load();
  const key = `${iso2.toUpperCase()}|${industryId}`;
  return map[key] || null;
}
