/**
 * THE SOURCE-AGENCY NAMES no reader meets outside the one sources page (R-002; his ruling of 2026-10-04: "One sources page").
 * Moved here unchanged from scripts/verify_no_source_agencies.ts on 2026-10-06 so the blog's gate (tests/blog/blog_content.test.ts)
 * holds the posts to the same list the site's source is held to.
 */
export const AGENCY_TOKENS: readonly string[] = [
  "Eurostat",
  "Destatis",
  "INSEE",
  "ISTAT",
  "e-Stat",
  "IBGE",
  "INEGI",
  "OECD",
  "ONS NOMIS",
  "StatCan",
  "US Census",
  "Census Bureau",
  "World Bank",
  /* THE UNITED KINGDOM'S PUBLISHERS (plan 06, task B4; his ruling of 2026-10-04 on R-002: "One sources page"): named once, on
     About the figures, from src/lib/spine/uk_sources.ts (allowed below), and nowhere a reader meets them on a card, a heading or a
     title. Not listed, on purpose: an institution a reader deals with rather than a source of figures (the central bank whose
     rate the page states, Companies House where a company is registered, the tax office a return goes to, the start-up loan a
     founder applies for). */
  "Office for National Statistics",
  "Valuation Office",
  "Nomis",
  "VisitBritain",
  "Worldpanel",
  "Kantar",
  "UK Finance",
  "British Retail Consortium",
  "Department for Transport",
  "Department for Business and Trade",
  "Department for Energy Security",
];
