/**
 * page-sections.ts - the STRICT per-page-type section manifest.
 *
 * The founder's content-map quiz (docs/superpowers/specs/2026-06-11-page-content-map.md)
 * fixes the sections each page type must carry. The rule (2026-06-13): every one
 * is ALWAYS present on every instance, filled where data exists and a calm
 * SectionEmpty placeholder where it does not, NEVER self-omitted.
 *
 * These ordered manifests are the single source of truth. Each page renders by
 * mapping its manifest (content-or-SectionEmpty per entry), so presence is
 * structural. The gate scripts/verify_page_sections.ts asserts each manifest
 * still covers the canonical id set AND that the page references every id.
 *
 * Scope: these are the NUMBERED content-map sections (the guaranteed skeleton).
 * The signature brand beats (reality-check, what-locals-know, contrarian,
 * myth-vs-reality, right-for/wrong-for, gut-check) remain curated flourishes
 * that fill on the exemplar and self-omit elsewhere; they are NOT forced-empty.
 *
 * `id` is the anchor (matches the rendered section + the sticky nav). `label` is
 * the eyebrow. `heading` is the section H2 (shown filled AND empty).
 */

export type PageSection = {
  id: string;
  label: string;
  heading: string;
};

/**
 * BUSINESS / CELL body. Section 1 (masthead) and section 4 (the revenue picture
 * + spread) live in the AnswerFirstMasthead above the body, so they are not
 * repeated here. Everything else from the 14-item business list is a body
 * section that always renders.
 */
export const CELL_SECTIONS: PageSection[] = [
  { id: "honest-take", label: "The honest take", heading: "The honest take" },
  { id: "narrative", label: "In context", heading: "The story in plain words" },
  { id: "plain-terms", label: "In plain terms", heading: "What the numbers feel like" },
  { id: "money", label: "Where the money goes", heading: "Where each $100 goes" },
  { id: "owner-take-home", label: "What the owner keeps", heading: "What the owner takes home" },
  { id: "break-even", label: "Break-even", heading: "When it covers its costs" },
  { id: "wages", label: "Pay by role", heading: "What you would pay your team" },
  { id: "startup-cost", label: "Cost to open", heading: "What it costs to open one here" },
  { id: "seasonality", label: "Through the year", heading: "Busy months and slow months" },
  { id: "first-year", label: "Your first year", heading: "A realistic first year" },
  { id: "nearby", label: "The same business nearby", heading: "The same business, comparable places" },
  { id: "related", label: "Related", heading: "Related businesses and places" },
];

/** COUNTRY body. Section 1 (hero) lives in the masthead. */
export const COUNTRY_SECTIONS: PageSection[] = [
  { id: "decisive", label: "The decisive read", heading: "Setting up and running a business here" },
  { id: "hire", label: "Hiring", heading: "How hard it is to hire here" },
  { id: "neighbours", label: "Versus the neighbours", heading: "How this country compares to its neighbours" },
  { id: "cities", label: "Cities", heading: "The cities of this country" },
  { id: "character", label: "Character", heading: "The character of the place" },
  { id: "related", label: "Related", heading: "Related countries" },
];

/** CITY body. Section 1 (masthead + score) and section 2 (the board stats) live
 * in the masthead block. */
export const CITY_SECTIONS: PageSection[] = [
  { id: "customer", label: "Your customer", heading: "Who the local customer is" },
  { id: "space", label: "What space costs", heading: "What shop and office space costs" },
  { id: "visitors", label: "Tourist vs local", heading: "Visitor money versus local money" },
  { id: "owners-keep", label: "What owners keep", heading: "What an owner keeps across the everyday trades" },
  { id: "best-areas", label: "Best areas", heading: "The best areas to set up" },
  { id: "neighbourhoods", label: "Neighbourhoods", heading: "The districts, drilled down" },
  { id: "changing", label: "How it is changing", heading: "How the city is changing" },
  { id: "peers", label: "Rival and peer cities", heading: "Rival and peer cities" },
];

/** INDUSTRY body. Section 1 (hero) lives in the masthead. */
export const INDUSTRY_SECTIONS: PageSection[] = [
  { id: "typical-operator", label: "A typical operator", heading: "What a typical operator looks like" },
  { id: "where-it-earns", label: "Where it earns most", heading: "Where this business earns more, and less" },
  { id: "margin-waterfall", label: "The cost structure", heading: "How the economics work" },
  { id: "related-links", label: "Go deeper", heading: "Into the places and businesses" },
];

/** NEIGHBOURHOOD body. Section 1 (hero) lives in the header. */
export const NEIGHBOURHOOD_SECTIONS: PageSection[] = [
  { id: "thrives", label: "What thrives here", heading: "What thrives here, and why" },
  { id: "who", label: "Who shops here", heading: "Who lives and shops here" },
  { id: "operating-cost", label: "Cost to operate", heading: "How pricey it is to operate here" },
  { id: "adjacent", label: "Versus next door", heading: "How this area compares to the ones beside it" },
  { id: "businesses-here", label: "The businesses here", heading: "The businesses of this district" },
];

/** LEARN body. Section 1 (question + answer) lives at the top. */
export const LEARN_SECTIONS: PageSection[] = [
  { id: "pnl", label: "A worked example", heading: "Where the money goes, on a sample year" },
  { id: "explanation", label: "In plain words", heading: "The explanation in plain words" },
  { id: "other-businesses", label: "Other businesses", heading: "Other businesses worth a look" },
  { id: "benchmarks", label: "Live benchmarks", heading: "See the real, live benchmarks" },
];

/** COMPARE. All three sections always present. */
export const COMPARE_SECTIONS: PageSection[] = [
  { id: "compare-pickers", label: "Set the matchup", heading: "The two sides" },
  { id: "compare-grid", label: "Side by side", heading: "The head-to-head numbers" },
  { id: "where-each-wins", label: "Where each wins", heading: "Where each one wins" },
];

/** All manifests, keyed by page type, for the gate. */
export const PAGE_SECTION_MANIFESTS: Record<string, PageSection[]> = {
  cell: CELL_SECTIONS,
  country: COUNTRY_SECTIONS,
  city: CITY_SECTIONS,
  industry: INDUSTRY_SECTIONS,
  neighbourhood: NEIGHBOURHOOD_SECTIONS,
  learn: LEARN_SECTIONS,
  compare: COMPARE_SECTIONS,
};
