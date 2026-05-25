/**
 * Industry hero image lookup.
 *
 * Reads data/images/industries_manifest.json at module init and exposes
 * getIndustryHero(industryId) -> first image record or null.
 *
 * The manifest was built by scripts/images/build_country_industry_images.ts
 * (Wikimedia Commons sourced, CC BY-SA 4.0 + similar licenses). Each
 * industry_id maps to an array of candidate images; the first entry is
 * the curated default. Callers that want a different angle can swap
 * via getIndustryHero(id, { index: 1 }).
 *
 * Founder direction 2026-05-25: every activity surface should show a
 * representative image. /industries/[industry] is the primary call
 * site; sector tiles and country-page activity tiles can layer in
 * smaller thumbnails later.
 *
 * Attribution policy: the manifest records carry HTML attribution
 * strings required by the source license. We DO NOT render that
 * attribution in the hero (would pollute the editorial frame); a
 * site-wide "Photo credits" page will surface attribution for all
 * Wikimedia + Unsplash + Pexels sources together. Per R-002, the
 * source-agency name does not appear in any user-visible string;
 * only photographer / contributor names do, when surfaced.
 */
import manifestJson from "../../../data/images/industries_manifest.json";

export type IndustryHero = {
  industryId: string;
  url: string;
  /** Image width in pixels, when known. */
  width: number | null;
  /** Image height in pixels, when known. */
  height: number | null;
  /** Short description for the alt attribute. */
  alt: string;
  /** Raw attribution HTML, kept for the credits page. Never rendered
   *  inline on a content page. */
  attributionHtml: string;
  /** License string (e.g. "CC BY-SA 4.0", "Unsplash", "Pexels"). */
  license: string;
};

type ManifestEntry = {
  url: string;
  source?: string;
  attribution?: string;
  license?: string;
  width?: number | null;
  height?: number | null;
  description?: string | null;
};

const MANIFEST = manifestJson as Record<string, ManifestEntry[]>;

function altFromDescription(desc: string | null | undefined): string {
  if (!desc) return "Activity hero image";
  // Strip "File:" prefix and trailing ".jpg" / ".png" from Wikimedia
  // descriptions. Keep the rest as a short alt fallback.
  return desc
    .replace(/^File:/i, "")
    .replace(/\.(jpg|jpeg|png|webp|svg)$/i, "")
    .replace(/_/g, " ")
    .slice(0, 140);
}

/**
 * Look up the hero image for an activity by its industry_id.
 * Returns null when no image is curated for that activity (the
 * caller should render its fallback hero block).
 */
export function getIndustryHero(
  industryId: string,
  opts: { index?: number } = {},
): IndustryHero | null {
  const list = MANIFEST[industryId];
  if (!Array.isArray(list) || list.length === 0) return null;
  const idx = opts.index ?? 0;
  const row = list[Math.min(idx, list.length - 1)];
  if (!row || !row.url) return null;
  return {
    industryId,
    url: row.url,
    width: row.width ?? null,
    height: row.height ?? null,
    alt: altFromDescription(row.description),
    attributionHtml: row.attribution || "",
    license: row.license || "",
  };
}

/**
 * Whether the manifest has any image for this activity. Cheap check
 * used by callers that want to branch before deciding to render an
 * image-based or pattern-based layout.
 */
export function hasIndustryHero(industryId: string): boolean {
  const list = MANIFEST[industryId];
  return Array.isArray(list) && list.length > 0 && !!list[0].url;
}
