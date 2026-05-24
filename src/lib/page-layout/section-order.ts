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
export type SectionTone =
  | "ink-dark"
  | "cream-50"
  | "white"
  | "cream-100"
  | "moss-tinted"
  // Plan v32 — "paper" is intentionally transparent. The section adds NO
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
  // Plan v14 Phase B — editorial narrative sits between the ink-dark hero
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

  // Homepage. Plan v14 6d: hero is a quiet editorial masthead on
  // cream-100 paper (was ink-dark cinematic video frame). The slight
  // warmth distinguishes it from the cream-50 body and the cream-50
  // navigator section directly below, preserving the alternation.
  // Plan v32 — homepage tone map rewritten after the Sprint B kill round.
  // Old half of the entries (cell-of-the-week, tax-overlay, ask, quality,
  // stats, recently-added, spotlight, primary-ctas, what-youll-see,
  // whats-hot, methodology, global-coverage) are dead sections kept here
  // as deliberate no-ops in case the route revives. Active sections
  // alternate paper (let pattern show through, cards pop) and white
  // (clean band that hides the pattern) for visual rhythm.
  "home-hero": "cream-100",
  "home-navigator": "paper",
  "home-city-picker": "paper",
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
  // Plan v32 — ink-dark now renders the Atlas paper pattern at 10% white
  // on a graphite #3A3A3A surface. Mirrors the light atlas-paper used on
  // the page body. Set on any section meant to be visually heavy: the
  // colour swap + the pattern do all the work, no extra utilities needed.
  "ink-dark": "atlas-paper-dark",
  "cream-50": "bg-cream-50",
  "white": "bg-white",
  "cream-100": "bg-cream-100",
  "moss-tinted": "bg-moss-50",
  // Plan v32 — "paper" applies no background, so the body's atlas-paper
  // pattern is visible through the section. Cards on top of a paper
  // section pop off the patterned surface; cards on top of a white
  // or cream section sit on a clean band.
  "paper": "",
};

export function getToneClass(sectionId: string): string {
  const tone = SECTION_TONES[sectionId] || "white";
  return TONE_CLASSES[tone];
}
