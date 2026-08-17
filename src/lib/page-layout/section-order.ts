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

// Country page, on the engraved Section Constitution spine (rewire 2026-06-15,
// founder spec). The body is organized by the nine judgment lenses, data first
// and opinion lower: the kept hero, then the eight-stat scorecard and the
// nine-lens country shape (opening); the decisive setup read and the cost
// signature (reward + cost); the hire read and the talent reality (people);
// who-has-money and how-far-you-reach (demand); the neighbour facts, the
// opportunity gap, same-business-abroad, special zones and licences (comparison
// + edge); the ground-under-you risk read (risk); the uniform city cards, the
// break-in panel, the character panel, what-locals and your-life-here (the
// place); then vs-the-world, the small low honest take, the gut check, the
// one-thing close, and the compare CTA (close). Most bands render through the
// engraved kit whose card lives in the component, so the section-order gate
// (which scans literal <section id=> in the PAGE source) only sees the id-bearing
// sections (hero, decisive, hire, neighbours, cities, break-in, character,
// locals, vs-world, honest-take, gut-check, related). The full reading order is
// listed here as the authoritative skeleton; the gate's subsequence test passes
// because the page's literal sections are a subsequence of this list.
export const COUNTRY_PAGE_SECTIONS = [
  "hero",
  "scorecard",
  "shape",
  "decisive",
  "formation",
  "cost-signature",
  "hire",
  "talent",
  "who-has-money",
  "reach",
  "neighbours",
  "opportunity",
  "here-vs-abroad",
  "special-zones",
  "licences",
  "ground",
  "cities",
  "break-in",
  "character",
  "locals",
  "your-life",
  "vs-world",
  "honest-take",
  "gut-check",
  "one-thing",
  "related",
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
/* "moss-tinted" was removed from this union 2026-08-17. It resolved to a green
   fill, which the founder banned outright on 2026-08-09, and it had already
   been dead since the 2026-06-06 white reset: no SECTION_TONES entry named it
   and the comment below said so. It survived the palette gate because that
   gate reads src/components, src/app and src/styles, and this file is in
   src/lib. A tone left defined is a tone that gets used again. */
/* TWO MORE DEAD TONES LEFT WITH IT, 2026-08-17, both named after steps of the
   ramp the founder banned. One resolved to exactly the same class as "white",
   one line below it in the same table: two tone names, one class. The other was
   the last member naming a tint, and no entry in the map below had selected
   either since the 2026-06-06 white reset. Deleted rather than renamed to the
   ramp's new name, for the reason the note above gives: a tone left defined is
   a tone that gets used again, and a tint that comes back through a tone name
   is how a banned colour returns without anybody choosing it. */
export type SectionTone =
  | "ink-dark"
  | "white"
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

  // Homepage. SaaS reformation 2026-06-12 (founder): every home band is
  // "paper" (transparent), so the warm app ground (cream-75, set on the
  // body) runs the whole page and the modules inside each section carry
  // the separation as seated white cards. The white-band-plus-hairline
  // rhythm read as flat newsprint; the ground-plus-cards rhythm reads as
  // a layered product surface.
  "home-hero": "paper",
  "home-navigator": "paper",
  "home-city-picker": "paper",
  "home-sectors": "paper",
  "home-cities-placeholder": "paper",
  "home-featured": "paper",
  "home-how-it-works": "paper",
  "home-audience": "paper",
  /* MISSING ENTIRELY UNTIL 2026-08-17, and the default is not harmless.
     getToneClass falls back to "white" for an unknown id, and ToneBand renders
     w-screen, so the ledger band was painting an OPAQUE FULL-VIEWPORT white
     plate over the site's fixed background photograph. The card added to that
     band in the same tick was therefore sitting on a plate that blanked the
     picture for the band's whole height, which is the exact thing the founder
     objected to: "on the center, it's also visible". Found by the cohesion
     audit, not by looking at the band. */
  "home-ledger": "paper",
  "home-upgrade": "paper",
  "home-blog-rail": "paper",

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
  /* Was "white", for the same reason and with the same effect: an opaque
     full-viewport plate over the photograph, on the band that closes the page.
     White made sense when the app ground was cream and a closing band wanted to
     be crisper than it. Since AtlasFrame there is a picture behind every page,
     and any full-width opaque ground is a bug rather than a style choice. */
  "home-newsletter": "paper",
  "home-primary-ctas": "white",
  "home-methodology": "white",
};

// White-reset 2026-06-06: every section now resolves to "white". The
// non-white tone classes are retained (the SectionTone type still lists
// them, and a future page could opt back in) but no SECTION_TONES entry
// references them anymore.
export const TONE_CLASSES: Record<SectionTone, string> = {
  "ink-dark": "atlas-paper-dark",
  "white": "bg-white",
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
  // "paper" bands are transparent: the app ground shows through and the
  // section's own cards carry separation, so a band hairline would just
  // draw a stray rule across the ground (SaaS reformation 2026-06-12).
  if (tone === "paper") return "";
  if (!withSeparation) return bg;
  const hairline = sectionHairline(sectionId);
  return hairline ? `${bg} ${hairline}` : bg;
}
