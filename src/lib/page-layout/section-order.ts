/**
 * Canonical section order per page type.
 *
 * Sister pages (same template, different cell/country/industry) render
 * sections in this exact order WHEN the underlying data is present.
 *
 * Sections with no usable data render
 * NOTHING — no "Not available" banner, no "Coming soon" stub. Pages
 * are shorter when data is thin but never broadcast brokenness.
 */

export const CELL_PAGE_SECTIONS = [
  "hero",
  "narrative",
  "revenue-tiles",
  "revenue-distribution",
  "margin-waterfall",
  "tax-and-cost-panel",
  "related-cells",
] as const;

export const COUNTRY_PAGE_SECTIONS = [
  "hero",
  "tax-overview",
  "regions",
  "related-countries",
] as const;

// Region / city landing page (`/[country]/[geo]`). Renders a hero, an
// optional neighborhoods grid (cities with a neighborhood scheme only),
// top cities in the region, and the region's top SMB industries. Sections
// after the hero self-suppress when their data is absent.
export const REGION_PAGE_SECTIONS = [
  "hero",
  "city-character",
  "neighborhoods",
  "top-cities",
  "top-industries",
] as const;

// City landing page shares the region template today (same `/[country]/[geo]`
// route resolves both region and city slugs). Kept as a distinct named
// export so the two can diverge later without touching the gate.
export const CITY_PAGE_SECTIONS = REGION_PAGE_SECTIONS;

// Neighborhood overview (`/[country]/[geo]/[sub]` when [sub] is a
// neighborhood rather than an industry). Renders a hero and the
// neighborhood's industry grid; falls through to the cell template when the
// final segment resolves to an industry.
export const NEIGHBORHOOD_PAGE_SECTIONS = [
  "hero",
  "neighborhood-industries",
] as const;

// Country-page rebuild §8 (2026-05-25): industry-tiles, revenue-
// distribution, top-countries, and top-cities-for-industry sections
// were removed because they depend on a global cross-country revenue
// aggregate that is dominated by wrong-aggregation tails. The page
// now hands users off to the country page for real revenue data.
export const INDUSTRY_PAGE_SECTIONS = [
  "hero",
  "how-it-works",
  "margin-waterfall",
] as const;

export type CellSection = (typeof CELL_PAGE_SECTIONS)[number];
export type CountrySection = (typeof COUNTRY_PAGE_SECTIONS)[number];
export type IndustrySection = (typeof INDUSTRY_PAGE_SECTIONS)[number];
export type RegionSection = (typeof REGION_PAGE_SECTIONS)[number];
export type NeighborhoodSection = (typeof NEIGHBORHOOD_PAGE_SECTIONS)[number];

/**
 * Per-level canonical section order, keyed for the verify_section_order
 * prebuild gate. The gate asserts each page renders a SUBSEQUENCE of its
 * level's list (subsequence, not equality, because data-thin sections
 * collapse to nothing). Adding a section to a page means adding it here
 * first, in the right position.
 */
export const PAGE_SECTION_ORDER: Record<string, readonly string[]> = {
  cell: CELL_PAGE_SECTIONS,
  country: COUNTRY_PAGE_SECTIONS,
  region: REGION_PAGE_SECTIONS,
  city: CITY_PAGE_SECTIONS,
  neighborhood: NEIGHBORHOOD_PAGE_SECTIONS,
  industry: INDUSTRY_PAGE_SECTIONS,
};

/**
 * Section background tone map.
 * Replaces the "every section a cream card" monotony with alternating
 * backgrounds + light section-type accents.
 */
export type SectionTone =
  | "ink-dark"
  | "cream-50"
  | "white"
  | "cream-100"
  | "moss-tinted"
  // "Paper" is intentionally transparent. The section adds NO
  // background of its own so the body's atlas-paper pattern shows
  // through. Use for sections that should feel like part of the page
  // surface (the world map, the featured grid where the cards are
  // meant to pop off the patterned page).
  | "paper";

// White-reset 2026-06-06 (founder): every section is a pure white band.
// The cream/ink-dark/paper alternation is retired. Tint no longer carries
// section separation; hairlines, spacing, and card shadows do (see
// getToneClass below + ToneBand / section wrappers). Section IDs and order
// are unchanged so the verify_section_order gate still passes. Every entry
// below is intentionally "white" so any active OR dead section that revives
// renders clean white, never a tint.
export const SECTION_TONES: Record<string, SectionTone> = {
  // Cell page
  "hero": "white",
  "narrative": "white",
  "revenue-tiles": "white",
  "revenue-distribution": "white",
  "margin-waterfall": "white",
  "tax-and-cost-panel": "white",
  "related-cells": "white",

  // Country page
  "top-cities": "white",
  "regions": "white",
  "tax-overview": "white",
  "related-countries": "white",

  // Industry page
  "industry-tiles": "white",
  "top-countries": "white",
  "top-cities-for-industry": "white",

  // Region / city landing page. ("top-cities" already has a tone entry
  // under the country page block above and is shared.)
  "city-character": "white",
  "neighborhoods": "white",
  "top-industries": "white",

  // Neighborhood overview
  "neighborhood-industries": "white",

  // Homepage. The hero masthead, the navigator band, the world-map band
  // (was ink-dark), and every editorial band are pure white. Separation is
  // carried by the ToneBand hairline + spacing, not by tint.
  "home-hero": "white",
  "home-navigator": "white",
  "home-city-picker": "white",
  "home-sectors": "white",
  "home-cities-placeholder": "white",
  "home-featured": "white",
  "home-how-it-works": "white",
  "home-audience": "white",
  "home-upgrade": "white",
  "home-blog-rail": "white",

  // Legacy / dead routes — kept defined for safety, all white.
  "home-global-coverage": "white",
  "home-recently-added": "white",
  "home-spotlight": "white",
  "home-cell-of-the-week": "white",
  "home-tax-overlay": "white",
  "home-ask": "white",
  "home-quality": "white",
  "home-stats": "white",
  "home-what-youll-see": "white",
  "home-whats-hot": "white",
  "home-newsletter": "white",
  "home-primary-ctas": "white",
  "home-methodology": "white",
};

// White-reset 2026-06-06: every section now resolves to "white". The
// non-white tone classes are retained (the SectionTone type still lists
// them, and a future page could opt back in) but no SECTION_TONES entry
// references them anymore.
export const TONE_CLASSES: Record<SectionTone, string> = {
  "ink-dark": "atlas-paper-dark",
  "cream-50": "bg-cream-50",
  "white": "bg-white",
  "cream-100": "bg-cream-100",
  "moss-tinted": "bg-moss-50",
  "paper": "",
};

/**
 * White-reset separation (2026-06-06).
 *
 * With every section now pure white, tint no longer separates them. To keep
 * the page crisp and intentional we draw a single restraint hairline at the
 * TOP of each section band, using the canonical parchment border token at a
 * soft opacity. The first section of a page (the hero) gets no rule above it,
 * so the page opens clean.
 *
 * `border-parchment` is the site hairline token (= cream-300). `/60` softens
 * it so the rule reads as a quiet fold in the paper, not a hard divider.
 */
function sectionHairline(sectionId: string): string {
  const isHero = sectionId === "hero" || sectionId === "home-hero";
  return isHero ? "" : "border-t border-parchment/60";
}

/**
 * Background class for a section band. White-reset: always white. Callers
 * that want the matching separation hairline should use getToneClass with
 * `withSeparation` (default) so the band carries a top rule and a touch more
 * breathing room; pass false to get the bare background only.
 */
export function getToneClass(sectionId: string, withSeparation = true): string {
  const tone = SECTION_TONES[sectionId] || "white";
  const bg = TONE_CLASSES[tone];
  if (!withSeparation) return bg;
  const hairline = sectionHairline(sectionId);
  return hairline ? `${bg} ${hairline}` : bg;
}
