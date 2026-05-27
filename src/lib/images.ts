/**
 * Image manifest lookup helper.
 *
 * Reads the JSON manifests produced by scripts/images/build_manifests.py
 * and exposes typed accessors used by cell / country / city / sector
 * page renderers (IM8-IM10).
 *
 * Manifest entries describe REMOTE source URLs (Wikimedia / Unsplash /
 * Pexels / Pixabay). For production, the download_and_optimize.py
 * step rewrites the entries to point at local /public/images/...
 * paths. Until then, the helpers degrade gracefully: if a manifest
 * isn't present, return [].
 */
import fs from "node:fs";
import path from "node:path";
import { findCountryIndustryImage } from "./images/country_industry_lookup";

export type AtlasImage = {
  url: string;
  source: string;
  attribution: string;
  license: string;
  width?: number | null;
  height?: number | null;
  description?: string | null;
};

type ManifestMap = Record<string, AtlasImage[]>;

const dataDir = path.resolve(process.cwd(), "data", "images");

function loadManifest(filename: string): ManifestMap {
  try {
    const raw = fs.readFileSync(path.join(dataDir, filename), "utf-8");
    return JSON.parse(raw) as ManifestMap;
  } catch {
    return {};
  }
}

// Cache at module load — Next dev/prod re-imports per request anyway,
// but module-level loads still amortize across the request's lifetime.
const CITIES = loadManifest("cities_manifest.json");
const INDUSTRIES = loadManifest("industries_manifest.json");
const COUNTRIES = loadManifest("countries_manifest.json");
const SECTORS = loadManifest("sectors_manifest.json");

// Manual override layer. Founder-curated entries in
// manual_overrides_v1.json win against the auto-generated manifest. The
// file's shape is { overrides: { "<category>/<slug>": AtlasImage } }.
function loadOverrides(): Record<string, AtlasImage> {
  try {
    const raw = fs.readFileSync(
      path.join(dataDir, "manual_overrides_v1.json"),
      "utf-8",
    );
    const parsed = JSON.parse(raw) as { overrides?: Record<string, AtlasImage> };
    return parsed?.overrides || {};
  } catch {
    return {};
  }
}

const OVERRIDES = loadOverrides();

function checkOverride(category: string, slug: string): AtlasImage | null {
  const key = `${category}/${slug}`;
  return (
    OVERRIDES[key] ||
    OVERRIDES[`${category}/${slug.toLowerCase()}`] ||
    null
  );
}

export function getCityImages(slug: string): AtlasImage[] {
  const override = checkOverride("cities", slug);
  if (override) return [override];
  return CITIES[slug] || CITIES[slug.toLowerCase()] || [];
}

export function getIndustryImages(industryId: string): AtlasImage[] {
  const override = checkOverride("industries", industryId);
  if (override) return [override];
  return INDUSTRIES[industryId] || [];
}

export function getCountryImages(iso2: string): AtlasImage[] {
  const override = checkOverride("countries", iso2.toUpperCase());
  if (override) return [override];
  return COUNTRIES[iso2.toUpperCase()] || COUNTRIES[iso2.toLowerCase()] || [];
}

export function getSectorImages(sectorId: string): AtlasImage[] {
  const override = checkOverride("sectors", sectorId);
  if (override) return [override];
  return SECTORS[sectorId] || [];
}

/**
 * Best-image-for-cell picker. Plan v20: prefer the country-industry
 * matched image (descriptions-scored, authentic-cuisine-aware) when
 * available. Falls back to the legacy city > industry > sector chain.
 */
export function pickCellHeroImage(
  citySlug: string | null | undefined,
  industryId: string | null | undefined,
  sectorId?: string | null,
  iso2?: string | null,
): AtlasImage | null {
  // Country-industry match first.
  if (iso2 && industryId) {
    try {
      const ci = findCountryIndustryImage(iso2, industryId);
      if (ci) {
        return {
          url: ci.url,
          source: ci.source,
          attribution: ci.photographer || ci.source,
          license: ci.source === "pexels" ? "Pexels License" : "CC",
          width: ci.width ?? null,
          height: ci.height ?? null,
          description: ci.description,
        };
      }
    } catch {
      // ignore — fall through to legacy chain
    }
  }
  if (citySlug) {
    const c = getCityImages(citySlug);
    if (c.length > 0) return c[0];
  }
  if (industryId) {
    const i = getIndustryImages(industryId);
    if (i.length > 0) return i[0];
  }
  if (sectorId) {
    const s = getSectorImages(sectorId);
    if (s.length > 0) return s[0];
  }
  return null;
}

export function pickCountryHeroImage(iso2: string): AtlasImage | null {
  const list = getCountryImages(iso2);
  return list[0] || null;
}

export function pickSectorHeroImage(sectorId: string): AtlasImage | null {
  const list = getSectorImages(sectorId);
  return list[0] || null;
}
