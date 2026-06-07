/**
 * THROWAWAY DRY-RUN — flagship static-param resolution for /opening + /buy-or-start,
 * plus the cell-page opening cross-link gate.
 *
 * Part A: the FINAL opening / buy-or-start generateStaticParams list — every entry
 *         must resolve to a non-null buildOpeningPage AND buildBuyVsStart (else the
 *         flagship prerender 404s).
 * Part B: the OLD country-aggregate (and es511) entries that were removed — confirm
 *         they return NULL (the reason they were replaced).
 * Part C: the cell-page link gate — for a few gb/gb (aggregate) and gb/london (city)
 *         cells, print getCellBySlug + isTrustedLocalCell + the opensTrusted decision
 *         the cell page uses to show/hide the "See the full opening guide" link.
 *
 * Run: npx tsx scripts/audit/dryrun_flagship_static_params.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

type Combo = { country: string; geo: string; industry: string };

// The FINAL list, identical in both route files.
const FINAL: Combo[] = [
  { country: "us", geo: "california", industry: "software-development" },
  { country: "us", geo: "california", industry: "restaurants" },
  { country: "us", geo: "new-york", industry: "restaurants" },
  { country: "us", geo: "texas", industry: "restaurants" },
  { country: "us", geo: "florida", industry: "restaurants" },
  { country: "us", geo: "california", industry: "hotels-lodging" },
  { country: "us", geo: "new-york", industry: "hotels-lodging" },
  { country: "us", geo: "los-angeles", industry: "cafes-coffee" },
  { country: "us", geo: "los-angeles", industry: "hairdressers-beauty" },
  { country: "us", geo: "los-angeles", industry: "auto-repair-shops" },
  { country: "gb", geo: "london", industry: "legal-services" },
  { country: "gb", geo: "london", industry: "restaurants" },
  { country: "gb", geo: "london", industry: "cafes-coffee" },
  { country: "de", geo: "de21", industry: "fabricated-metal-mfg" },
  { country: "de", geo: "berlin", industry: "restaurants" },
  { country: "es", geo: "barcelona", industry: "restaurants" },
  { country: "mx", geo: "mx-roo", industry: "hotels-lodging" },
  { country: "fr", geo: "paris", industry: "restaurants" },
  { country: "it", geo: "rome", industry: "restaurants" },
  { country: "jp", geo: "tokyo", industry: "restaurants" },
];

// The entries that were REMOVED — must be NULL (would 404 as prerenders).
const REMOVED: Combo[] = [
  { country: "gb", geo: "gb", industry: "legal-services" },
  { country: "gb", geo: "gb", industry: "restaurants" },
  { country: "gb", geo: "gb", industry: "cafes-coffee" },
  { country: "es", geo: "es511", industry: "restaurants" },
  { country: "de", geo: "de", industry: "restaurants" },
  { country: "fr", geo: "fr", industry: "restaurants" },
  { country: "it", geo: "it", industry: "restaurants" },
  { country: "jp", geo: "jp", industry: "restaurants" },
];

// Cell-page link-gate cases: gb/gb aggregates (link must hide) and gb/london
// cities (link must show).
const GATE: Combo[] = [
  { country: "gb", geo: "gb", industry: "legal-services" },
  { country: "gb", geo: "gb", industry: "restaurants" },
  { country: "gb", geo: "london", industry: "legal-services" },
  { country: "gb", geo: "london", industry: "restaurants" },
];

function pad(s: string, w: number): string {
  return s.length >= w ? s : s + " ".repeat(w - s.length);
}

async function main(): Promise<void> {
  const { buildOpeningPage } = await import("@/lib/open/opening_page");
  const { buildBuyVsStart } = await import("@/lib/open/buy_vs_start");
  const { getCellBySlug } = await import("@/lib/cells");
  const { isTrustedLocalCell } = await import("@/lib/cells/trust");
  const { slugToIndustry } = await import("@/lib/taxonomy");

  let failA = 0;
  let failB = 0;
  let failC = 0;

  console.log("");
  console.log("=".repeat(96));
  console.log("PART A — FINAL static-param list (expect every row OK / OK)");
  console.log("=".repeat(96));
  console.log("  " + pad("URL", 46) + pad("opening", 12) + "buy-or-start");
  for (const c of FINAL) {
    const op = await buildOpeningPage(c);
    const bs = await buildBuyVsStart(c);
    const o = op ? "OK" : "NULL(404)";
    const b = bs ? "OK" : "NULL(404)";
    if (!op || !bs) failA++;
    console.log("  " + pad(`/${c.country}/${c.geo}/${c.industry}`, 46) + pad(o, 12) + b);
  }

  console.log("");
  console.log("=".repeat(96));
  console.log("PART B — REMOVED entries (expect every row NULL / NULL)");
  console.log("=".repeat(96));
  console.log("  " + pad("URL", 46) + pad("opening", 12) + "buy-or-start");
  for (const c of REMOVED) {
    const op = await buildOpeningPage(c);
    const bs = await buildBuyVsStart(c);
    const o = op ? "OK" : "NULL(404)";
    const b = bs ? "OK" : "NULL(404)";
    if (op || bs) failB++;
    console.log("  " + pad(`/${c.country}/${c.geo}/${c.industry}`, 46) + pad(o, 12) + b);
  }

  console.log("");
  console.log("=".repeat(96));
  console.log("PART C — cell-page opening cross-link gate (opensTrusted mirrors buildOpeningPage)");
  console.log("=".repeat(96));
  console.log(
    "  " + pad("URL", 40) + pad("cell?", 8) + pad("geo_level", 11) + pad("tier", 6) +
      pad("trusted", 9) + "link-shown",
  );
  for (const c of GATE) {
    const cell = await getCellBySlug(c.country, c.geo, c.industry, { sizeBand: null, year: null });
    const requestedIndustry = slugToIndustry(c.industry);
    const expectedIndustryId = requestedIndustry?.id ?? cell?.industry_id ?? undefined;
    const opensTrusted = isTrustedLocalCell(cell, expectedIndustryId) && !!cell?.industry_id;
    // Country aggregates (gb/gb) must hide the link; cities (gb/london) must show it.
    const isAggregate = c.geo === c.country;
    const expectShown = !isAggregate;
    if (opensTrusted !== expectShown) failC++;
    console.log(
      "  " +
        pad(`/${c.country}/${c.geo}/${c.industry}`, 40) +
        pad(cell ? "yes" : "no", 8) +
        pad(cell?.geo_level ?? "-", 11) +
        pad((cell?.coverage_tier ?? "-").toString(), 6) +
        pad(String(opensTrusted), 9) +
        (opensTrusted ? "SHOWN" : "hidden"),
    );
  }

  console.log("");
  console.log("=".repeat(96));
  console.log(
    `RESULT: A ${failA === 0 ? "PASS" : `FAIL(${failA})`}  |  ` +
      `B ${failB === 0 ? "PASS" : `FAIL(${failB})`}  |  ` +
      `C ${failC === 0 ? "PASS" : `FAIL(${failC})`}`,
  );
  console.log("=".repeat(96));
  console.log("");
  process.exit(failA + failB + failC === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("dryrun_flagship_static_params failed:", err);
  process.exit(1);
});
