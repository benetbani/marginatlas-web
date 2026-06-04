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
  "country-stats",
  "industry-mix-grid",
  "top-cities",
  "regions",
  "tax-overview",
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

export const SECTION_TONES: Record<string, SectionTone> = {
  // Cell page. Plan v19 Block C — switched from ink-dark cinematic to
  // cream-100 broadsheet, matching the homepage hero treatment. Founder
  // explicit: dark hero on a cream site reads as "totally unrelated".
  "hero": "cream-100",
  // Editorial narrative sits between the ink-dark hero
  // and the cream revenue tiles. Plan v14 6c (audit v2 N-2): switched to
  // white so it doesn't collide tonally with the cream-50 revenue-tiles
  // section directly below, restoring the alternation rhythm.
  "narrative": "white",
  "revenue-tiles": "cream-50",
  "revenue-distribution": "white",
  "margin-waterfall": "cream-100",
  "tax-and-cost-panel": "white",
  "related-cells": "cream-50",

  // Country page
  "country-stats": "cream-50",
  "industry-mix-grid": "white",
  "top-cities": "cream-100",
  "regions": "white",
  "tax-overview": "cream-50",
  "related-countries": "white",

  // Industry page
  "industry-tiles": "cream-50",
  "top-countries": "white",
  "top-cities-for-industry": "cream-100",

  // Region / city landing page. Alternating cream/white after the
  // cream-100 hero to preserve the broadsheet rhythm. ("top-cities" already
  // has a tone entry under the country page block above and is shared.)
  "city-character": "white",
  "neighborhoods": "cream-50",
  "top-industries": "cream-50",

  // Neighborhood overview
  "neighborhood-industries": "cream-50",

  // Homepage. Final accent retone 2026-06-04: hero masthead is now a pure
  // white band (was cream-100 paper). The home-hero tone is used by this
  // section only, so flipping it to white here does not affect any other
  // section. Active sections below alternate paper (let pattern show through,
  // cards pop) and white (clean band that hides the pattern) for rhythm.
  // Old half of the entries (cell-of-the-week, tax-overlay, ask, quality,
  // stats, recently-added, spotlight, primary-ctas, what-youll-see,
  // whats-hot, methodology, global-coverage) are dead sections kept here
  // as deliberate no-ops in case the route revives.
  "home-hero": "white",
  "home-navigator": "paper",
  "home-city-picker": "ink-dark",
  "home-sectors": "white",
  "home-cities-placeholder": "paper",
  "home-featured": "white",
  "home-blog-rail": "paper",

  // Legacy / dead routes — kept defined for safety.
  "home-global-coverage": "cream-100",
  "home-recently-added": "white",
  "home-spotlight": "white",
  "home-cell-of-the-week": "white",
  "home-tax-overlay": "cream-50",
  "home-ask": "cream-50",
  "home-quality": "cream-100",
  "home-stats": "white",
  "home-what-youll-see": "cream-50",
  "home-whats-hot": "white",
  "home-newsletter": "cream-100",
  "home-primary-ctas": "white",
  "home-methodology": "cream-50",
};

export const TONE_CLASSES: Record<SectionTone, string> = {
  // Ink-dark now renders the Atlas paper pattern at 10% white
  // on a graphite #3A3A3A surface. Mirrors the light atlas-paper used on
  // the page body. Set on any section meant to be visually heavy: the
  // colour swap + the pattern do all the work, no extra utilities needed.
  "ink-dark": "atlas-paper-dark",
  "cream-50": "bg-cream-50",
  "white": "bg-white",
  "cream-100": "bg-cream-100",
  "moss-tinted": "bg-moss-50",
  // "Paper" applies no background, so the body's atlas-paper
  // pattern is visible through the section. Cards on top of a paper
  // section pop off the patterned surface; cards on top of a white
  // or cream section sit on a clean band.
  "paper": "",
};

export function getToneClass(sectionId: string): string {
  const tone = SECTION_TONES[sectionId] || "white";
  return TONE_CLASSES[tone];
}
