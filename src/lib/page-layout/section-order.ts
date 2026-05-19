/**
 * Plan v13 Wave 2b — canonical section order per page type.
 *
 * Sister pages (same template, different cell/country/industry) render
 * sections in this exact order WHEN the underlying data is present.
 *
 * Plan v13 Wave 4a (D2) override: sections with no usable data render
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

export const INDUSTRY_PAGE_SECTIONS = [
  "hero",
  "industry-tiles",
  "revenue-distribution",
  "margin-waterfall",
  "top-countries",
  "top-cities-for-industry",
] as const;

export type CellSection = (typeof CELL_PAGE_SECTIONS)[number];
export type CountrySection = (typeof COUNTRY_PAGE_SECTIONS)[number];
export type IndustrySection = (typeof INDUSTRY_PAGE_SECTIONS)[number];

/**
 * Plan v13 Wave 4d — section background tone map.
 * Replaces the "every section a cream card" monotony with alternating
 * backgrounds + light section-type accents.
 */
export type SectionTone = "ink-dark" | "cream-50" | "white" | "cream-100" | "moss-tinted";

export const SECTION_TONES: Record<string, SectionTone> = {
  // Cell page
  "hero": "ink-dark",
  // Plan v14 Phase B — editorial narrative sits between the ink-dark hero
  // and the cream revenue tiles. cream-50 keeps the reading band airy and
  // distinct from both neighbors.
  "narrative": "cream-50",
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
};

export const TONE_CLASSES: Record<SectionTone, string> = {
  "ink-dark": "bg-ink-900 text-cream-50",
  "cream-50": "bg-cream-50",
  "white": "bg-white",
  "cream-100": "bg-cream-100",
  "moss-tinted": "bg-moss-50",
};

export function getToneClass(sectionId: string): string {
  const tone = SECTION_TONES[sectionId] || "white";
  return TONE_CLASSES[tone];
}
