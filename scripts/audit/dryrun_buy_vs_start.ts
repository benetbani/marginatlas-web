/**
 * THROWAWAY DRY-RUN — the "buy vs start" PAGE builder (open layer).
 *
 * Founder-review tool. NOT wired into the app, NOT a production helper. It calls
 * the SAME buildBuyVsStart(...) the new page will call, for ~10 representative
 * flagship business x place combos, and prints, per combo: the START side (the
 * stated line, the longest licence wait and the years to pay back, each with its
 * stamp; no start cost is held since 2026-10-15, release 2 job A), the buy range (the trade's own shard range times the take-home, the same
 * figure the trade page's "What one sells for" card prints) with its stamp or its
 * stated line, and the verdict.
 *
 * This DOES touch the database (buildBuyVsStart calls buildOpeningPage, which
 * resolves a real cell through getCellBySlug, exactly as the cell page does), so
 * it loads .env.local first and then dynamically imports the builder so the
 * Supabase client picks up the env (the client is constructed at module-load
 * time, so the env must be present before the builder module is evaluated).
 *
 * The whole point: confirm the buy range AGREES with the trade page's card (same
 * function, worthPrice), the START side AGREES with the opening page (same
 * builder), every figure stamped, and nulls show up wherever take-home is
 * missing.
 *
 * Run: npx tsx scripts/audit/dryrun_buy_vs_start.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";

// Load env BEFORE importing anything that constructs the Supabase client.
config({ path: resolve(process.cwd(), ".env.local") });

type Combo = {
  label: string;
  country: string; // iso2 url slug
  geo: string; // geo url slug
  industry: string; // industry url slug (the canonical industryToSlug output)
};

// Ten representative flagship combos, the founder's review slate. Each
// (country, geo, industry) is a real URL triple: the geo slugs are major-city
// slugs in data/cities/city_list_v1.json (the same slate across_cities.ts
// resolves), and the industry slugs are the canonical industryToSlug outputs.
const COMBOS: Combo[] = [
  { label: "London restaurants", country: "gb", geo: "london", industry: "restaurants" },
  { label: "New York hotels", country: "us", geo: "new-york", industry: "hotels-lodging" },
  { label: "Tokyo software dev", country: "jp", geo: "tokyo", industry: "software-development" },
  { label: "Berlin dental", country: "de", geo: "berlin", industry: "dental-practices" },
  { label: "Madrid cleaning", country: "es", geo: "madrid", industry: "cleaning-services" },
  { label: "Toronto law firm", country: "ca", geo: "toronto", industry: "legal-services" },
  { label: "Paris cafe", country: "fr", geo: "paris", industry: "cafes-coffee-shops" },
  { label: "Sydney gym", country: "au", geo: "sydney", industry: "sports-fitness" },
  { label: "Chicago auto repair", country: "us", geo: "chicago", industry: "auto-repair-shops" },
  { label: "Mumbai retail", country: "in", geo: "mumbai", industry: "clothing-boutiques" },
  // US state geos, where the page draws today, a priced trade and an operating-earnings one.
  { label: "California restaurants", country: "us", geo: "california", industry: "restaurants" },
  { label: "California dental", country: "us", geo: "california", industry: "dental-practices" },
];

function usd(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "-";
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${Math.round(n)}`;
}

function pad(s: string, w: number): string {
  return s.length >= w ? s : s + " ".repeat(w - s.length);
}

async function main(): Promise<void> {
  // Dynamic import AFTER env is loaded.
  const { buildBuyVsStart } = await import("@/lib/open/buy_vs_start");
  const { buyRangeText } = await import("@/lib/open/buy_side");

  console.log("");
  console.log("=".repeat(110));
  console.log("BUY vs START PAGE BUILDER — DRY RUN (buildBuyVsStart, START side off the cost-to-open builder)");
  console.log("=".repeat(110));

  let nullCount = 0;
  let nanLeaks = 0;

  // Collect rows for the compact summary table at the end.
  type Row = {
    label: string;
    startTotal: string;
    startCash: string;
    buyRange: string;
  };
  const rows: Row[] = [];

  for (const c of COMBOS) {
    console.log("");
    console.log("-".repeat(110));
    console.log(`# ${c.label}   (/${c.country}/${c.geo}/${c.industry})`);
    console.log("-".repeat(110));

    let page;
    try {
      page = await buildBuyVsStart({ country: c.country, geo: c.geo, industry: c.industry });
    } catch (err) {
      console.log(`  ERROR thrown: ${(err as Error).message}`);
      nullCount++;
      rows.push({
        label: c.label,
        startTotal: "ERROR",
        startCash: "-",
        buyRange: "-",
      });
      continue;
    }

    if (!page) {
      console.log("  -> buildBuyVsStart returned NULL (cell missing/untrusted, or no take-home). Page would notFound().");
      nullCount++;
      rows.push({
        label: c.label,
        startTotal: "NULL",
        startCash: "-",
        buyRange: "-",
      });
      continue;
    }

    // Core sanity: every START figure carries its stamp.
    if (page.start.longestWait && !page.start.longestWait.prov) nanLeaks++;
    if (page.start.payback && !page.start.payback.prov) nanLeaks++;
    // The buy range, where one stands: both ends finite and ordered, and the stamp present. A stated line stands in its place otherwise.
    if (page.buy.state === "range") {
      const { lowUsd, highUsd, prov } = page.buy;
      if (typeof lowUsd !== "number" || typeof highUsd !== "number" || !Number.isFinite(lowUsd) || !Number.isFinite(highUsd) || !(lowUsd < highUsd) || !prov) nanLeaks++;
    }
    const buyRange = buyRangeText(page.buy);

    console.log(`  Business / place : ${page.businessName} in ${page.placeName}`);
    console.log(`  Cell href        : ${page.cellHref}`);
    console.log(`  Opening href     : ${page.openingHref}`);
    console.log("");
    console.log("  START (build it fresh):");
    console.log(`    - Cash needed   : ${page.start.cashLine}`);
    console.log(`    - Longest wait  : ${page.start.longestWait ? `${page.start.longestWait.figure}  [${page.start.longestWait.prov.src}]` : "none"}`);
    console.log(`    - Pays back     : ${page.start.payback ? `${page.start.payback.figure}  [${page.start.payback.prov?.src ?? "NO STAMP"}]` : "none"}`);
    console.log("");
    console.log("  BUY (buy existing, an estimate):");
    console.log(`    - Sale range     : ${buyRange ?? "none"}   (the trade's shard range times the take-home, the trade page's own figure)`);
    console.log(`    - Stamp          : ${page.buy.prov ? `${page.buy.prov.kind}, ${page.buy.prov.src}` : "none"}`);
    console.log(`    - Stated line    : ${page.buy.line ?? "none"}`);
    console.log("");
    console.log(`  VERDICT: ${page.verdict}`);

    rows.push({
      label: c.label,
      startTotal: page.start.longestWait?.figure ?? "-",
      startCash: page.start.payback?.figure ?? "-",
      buyRange: buyRange ?? "none",
    });
  }

  // The compact table the founder asked for.
  console.log("");
  console.log("=".repeat(110));
  console.log("SUMMARY TABLE");
  console.log("=".repeat(110));
  console.log(
    "  " +
      pad("Combo", 24) +
      pad("LongestWait", 12) +
      pad("PaysBack", 12) +
      pad("BuyRange", 24),
  );
  console.log("  " + "-".repeat(72));
  for (const r of rows) {
    console.log(
      "  " +
        pad(r.label, 24) +
        pad(r.startTotal, 12) +
        pad(r.startCash, 12) +
        pad(r.buyRange, 24),
    );
  }

  console.log("");
  console.log("=".repeat(110));
  console.log(
    `SUMMARY: ${COMBOS.length} combos, ${nullCount} returned null, ${nanLeaks} NaN/non-finite headline leak(s).`,
  );
  console.log("=".repeat(110));
  console.log("");

  // Let any in-flight Supabase keepalive sockets settle, then exit.
  process.exit(0);
}

main().catch((err) => {
  console.error("dryrun_buy_vs_start failed:", err);
  process.exit(1);
});
