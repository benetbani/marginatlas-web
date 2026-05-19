/**
 * Plan v13 Wave 2b — canonical section order per page type.
 *
 * Sister pages (same template, different cell/country/industry) MUST
 * render IDENTICAL sections in IDENTICAL order. Each section gets a
 * graceful "Not available for this <cell|country|industry>" empty state
 * — sections never disappear, they degrade.
 */

export const CELL_PAGE_SECTIONS = [
  "hero",
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
