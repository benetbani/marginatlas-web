/**
 * Plan v12 IM7 — image manifest lookup helper.
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

export function getCityImages(slug: string): AtlasImage[] {
  return CITIES[slug] || CITIES[slug.toLowerCase()] || [];
}

export function getIndustryImages(industryId: string): AtlasImage[] {
  return INDUSTRIES[industryId] || [];
}

export function getCountryImages(iso2: string): AtlasImage[] {
  return COUNTRIES[iso2.toUpperCase()] || COUNTRIES[iso2.toLowerCase()] || [];
}

export function getSectorImages(sectorId: string): AtlasImage[] {
  return SECTORS[sectorId] || [];
}

/**
 * Best-image-for-cell picker. Order: city > industry > sector > none.
 * Cell pages will fall through to the existing SmartImage glyph if this
 * returns null.
 */
export function pickCellHeroImage(
  citySlug: string | null | undefined,
  industryId: string | null | undefined,
  sectorId?: string | null
): AtlasImage | null {
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
