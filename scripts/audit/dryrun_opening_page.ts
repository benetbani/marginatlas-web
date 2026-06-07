/**
 * THROWAWAY DRY-RUN — the "what it costs to open" PAGE builder (opening layer).
 *
 * Founder-review tool. NOT wired into the app, NOT a production helper. It calls
 * the SAME buildOpeningPage(...) the new page will call, for ~10 representative
 * flagship business x place combos, and prints, per combo: the total to open,
 * the four entry parts, the break-in score + band + payback, the resolved owner
 * take-home, and the count + first row of each comparison strip.
 *
 * This DOES touch the database (buildOpeningPage resolves a real cell through
 * getCellBySlug, exactly as the cell page does), so it loads .env.local first and
 * then dynamically imports the builder, so the Supabase client picks up the env
 * (the client is constructed at module-load time, so the env must be present
 * before the builder module is evaluated).
 *
 * The whole point: confirm the assembled numbers AGREE with the cell page (same
 * functions), no NaN/null leaks in the core, and comparisons resolve or self-omit
 * cleanly, before any page or component is built.
 *
 * Run: npx tsx scripts/audit/dryrun_opening_page.ts
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

// Ten representative flagship combos. Each (country, geo, industry) is a real URL
// triple: the geo slugs are major-city slugs in data/cities/city_list_v1.json
// (the same slate across_cities.ts resolves), and the industry slugs are the
// canonical industryToSlug outputs verified against src/lib/taxonomy/industries.json:
//   Restaurants -> restaurants
//   Hotels & lodging -> hotels-lodging
//   Software development -> software-development
//   Dental practices -> dental-practices
//   Cafes & coffee shops -> cafes-coffee-shops
//   Cleaning services -> cleaning-services
//   Legal services -> legal-services
//   Sports & fitness -> sports-fitness
//   Hairdressers & beauty -> hairdressers-beauty
//   Auto repair shops -> auto-repair-shops
const COMBOS: Combo[] = [
  { label: "London restaurants", country: "gb", geo: "london", industry: "restaurants" },
  { label: "New York hotels", country: "us", geo: "new-york", industry: "hotels-lodging" },
  { label: "Tokyo software dev", country: "jp", geo: "tokyo", industry: "software-development" },
  { label: "Berlin dental", country: "de", geo: "berlin", industry: "dental-practices" },
  { label: "Paris cafe", country: "fr", geo: "paris", industry: "cafes-coffee-shops" },
  { label: "Madrid cleaning", country: "es", geo: "madrid", industry: "cleaning-services" },
  { label: "Toronto law firm", country: "ca", geo: "toronto", industry: "legal-services" },
  { label: "Sydney gym", country: "au", geo: "sydney", industry: "sports-fitness" },
  { label: "Los Angeles hair & beauty", country: "us", geo: "los-angeles", industry: "hairdressers-beauty" },
  { label: "Chicago auto repair", country: "us", geo: "chicago", industry: "auto-repair-shops" },
];

function usd(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "-";
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${Math.round(n)}`;
}

function flag(b: boolean): string {
  return b ? "modeled" : "real";
}

async function main(): Promise<void> {
  // Dynamic import AFTER env is loaded (the Supabase client is built at module
  // load, so the builder must be imported only once the env is present).
  const { buildOpeningPage } = await import("@/lib/open/opening_page");

  console.log("");
  console.log("=".repeat(78));
  console.log("COST-TO-OPEN PAGE BUILDER — DRY RUN (buildOpeningPage, same path as the cell page)");
  console.log("=".repeat(78));

  let nullCount = 0;
  let nanLeaks = 0;

  for (const c of COMBOS) {
    console.log("");
    console.log("-".repeat(78));
    console.log(`# ${c.label}   (/${c.country}/${c.geo}/${c.industry})`);
    console.log("-".repeat(78));

    let page;
    try {
      page = await buildOpeningPage({ country: c.country, geo: c.geo, industry: c.industry });
    } catch (err) {
      console.log(`  ERROR thrown: ${(err as Error).message}`);
      nullCount++;
      continue;
    }

    if (!page) {
      console.log("  -> buildOpeningPage returned NULL (cell missing or untrusted). Page would notFound().");
      nullCount++;
      continue;
    }

    // Core sanity: any NaN in the core numbers is a leak we must catch.
    const coreNums = [
      page.capital.value,
      page.permits.value,
      page.time.value,
      page.hires.value,
      page.totalToOpenUsd,
    ];
    for (const n of coreNums) {
      if (typeof n !== "number" || !Number.isFinite(n)) nanLeaks++;
    }

    console.log(`  Business / place : ${page.businessName} in ${page.placeName}`);
    console.log(`  Cell page href   : ${page.cellHref}`);
    console.log(`  Trusted          : ${page.trusted}`);
    console.log("");
    console.log(`  TOTAL TO OPEN    : ${usd(page.totalToOpenUsd)}   (capital + permits)`);
    console.log(`    - Capital      : ${usd(page.capital.value)}   [${flag(page.capital.modeled)}]`);
    console.log(`    - Permits      : ${usd(page.permits.value)}   [${flag(page.permits.modeled)}]`);
    console.log(`    - Time to open : ${page.time.value} weeks   [${flag(page.time.modeled)}]`);
    console.log(`    - First hires  : ${page.hires.value}   (${page.hires.roleHint}) [${flag(page.hires.modeled)}]`);
    console.log("");
    console.log(`  Owner take-home  : ${usd(page.takeHomeUsd)} / year (after tax)`);
    if (page.breakIn) {
      const b = page.breakIn;
      console.log(
        `  BREAK-IN RATING  : ${b.score}/100  band=${b.band}  payback=${b.paybackYears}y  restsOnModeled=${b.restsOnModeled}`,
      );
      console.log(
        `    components     : payback=${b.components.paybackScore} speed=${b.components.speedScore} room=${b.components.roomScore}`,
      );
    } else {
      console.log("  BREAK-IN RATING  : null (no defensible take-home + capital)");
    }
    console.log(`  Verdict          : "${page.verdict}"`);

    // Comparisons.
    const peers = page.comparisons.sameBusinessElsewhere;
    console.log("");
    console.log(`  sameBusinessElsewhere: ${peers.length} place(s)`);
    if (peers.length > 0) {
      const p = peers[0];
      console.log(
        `    first row -> ${p.place} (${p.country}) total=${usd(p.totalToOpenUsd)} score=${p.score ?? "null"} band=${p.band ?? "null"} href=${p.href}`,
      );
      // Print the rest compactly so the cheaper/dearer contrast is visible.
      for (let i = 1; i < peers.length; i++) {
        const q = peers[i];
        console.log(
          `              -> ${q.place} (${q.country}) total=${usd(q.totalToOpenUsd)} score=${q.score ?? "null"} band=${q.band ?? "null"}`,
        );
      }
    }

    const others = page.comparisons.otherBusinessesHere;
    console.log(`  otherBusinessesHere : ${others.length} business(es)`);
    if (others.length > 0) {
      const o = others[0];
      console.log(
        `    first row -> ${o.business} score=${o.score ?? "null"} band=${o.band ?? "null"} href=${o.href}`,
      );
      for (let i = 1; i < others.length; i++) {
        const x = others[i];
        console.log(
          `              -> ${x.business} score=${x.score ?? "null"} band=${x.band ?? "null"}`,
        );
      }
    } else {
      console.log("    (omitted: no clean multi-industry-per-geo read for this geo)");
    }
  }

  console.log("");
  console.log("=".repeat(78));
  console.log(
    `SUMMARY: ${COMBOS.length} combos, ${nullCount} returned null, ${nanLeaks} NaN/non-finite core leak(s).`,
  );
  console.log("=".repeat(78));
  console.log("");

  // Let any in-flight Supabase keepalive sockets settle, then exit so the
  // process does not hang on an open pool.
  process.exit(0);
}

main().catch((err) => {
  console.error("dryrun_opening_page failed:", err);
  process.exit(1);
});
