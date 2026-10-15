/**
 * THROWAWAY DRY-RUN — the "what it costs to open" PAGE builder (opening layer).
 *
 * Founder-review tool. NOT wired into the app, NOT a production helper. It calls
 * the SAME buildOpeningPage(...) the new page will call, for ~10 representative
 * flagship business x place combos, and prints, per combo: the licences with
 * their waits and stamps, the longest wait, the trade's two first-year figures,
 * the resolved owner take-home, and the peer strip (since 2026-10-15, release 2
 * job A: the typed total, capital, permits, weeks, hires and payback left the
 * page, and this dry-run prints what stands in their place).
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
  // US state geos, where the page draws today (the investigation's production sample: 18 of 27 drew).
  { label: "California restaurants", country: "us", geo: "california", industry: "restaurants" },
  { label: "California software", country: "us", geo: "california", industry: "software-development" },
  { label: "Ohio plumbers", country: "us", geo: "ohio", industry: "plumbers" },
];

function usd(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return "-";
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${Math.round(n)}`;
}

async function main(): Promise<void> {
  // Dynamic import AFTER env is loaded (the Supabase client is built at module
  // load, so the builder must be imported only once the env is present).
  const { buildOpeningPage } = await import("@/lib/open/opening_page");

  console.log("");
  console.log("=".repeat(78));
  console.log("OPENING PAGE BUILDER, DRY RUN (buildOpeningPage, the trade page's own builders)");
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

    // Core sanity: a printed figure with no stamp is a leak we must catch.
    const stamps = [page.longestWait?.prov, page.takeHomeProv, ...page.earning.map((e) => e.prov), ...(page.permits?.cells ?? []).map((c) => c.prov)];
    const figures = [page.longestWait, page.takeHomeUsd, ...page.earning, ...(page.permits?.cells ?? [])].filter((f) => f != null);
    if (stamps.filter(Boolean).length !== figures.length) nanLeaks++;

    console.log(`  Business / place : ${page.businessName} in ${page.placeName}`);
    console.log(`  Cell page href   : ${page.cellHref}`);
    console.log(`  Trusted          : ${page.trusted}`);
    console.log("");
    console.log(`  LONGEST WAIT     : ${page.longestWait ? `${page.longestWait.figure}  [${page.longestWait.prov.src}]` : "none"}`);
    for (const c of page.permits?.cells ?? []) console.log(`    - ${c.label}: ${String(c.value)} (${c.note ?? "no band"})  [${c.prov?.src ?? "NO STAMP"}]`);
    if (page.permits?.withheld) console.log(`    withheld line: ${page.permits.withheld}`);
    for (const e of page.earning) console.log(`  EARNING          : ${e.figure} ${e.words}  [${e.prov?.src ?? "NO STAMP"}]`);
    console.log(`  Owner take-home  : ${usd(page.takeHomeUsd)} / year (after tax)  [${page.takeHomeProv?.src ?? "none"}]`);
    console.log(`  Verdict          : "${page.verdict}"`);

    const peers = page.comparisons.sameBusinessElsewhere;
    console.log("");
    console.log(`  sameBusinessElsewhere: ${peers.length} place(s)`);
    for (const q of peers) console.log(`    -> ${q.place} (${q.country}) keeps=${usd(q.takeHomeUsd)} href=${q.href}`);
  }

  console.log("");
  console.log("=".repeat(78));
  console.log(
    `SUMMARY: ${COMBOS.length} combos, ${nullCount} returned null, ${nanLeaks} page(s) printing a figure with no stamp.`,
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
