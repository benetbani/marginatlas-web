/**
 * THROWAWAY DRY-RUN, the city page's "Best and hardest" activity table.
 *
 * The table used to render only for London (from a curated JSON). It now renders
 * for EVERY city: buildCityActivities resolves the city's candidate activities
 * through the cell engine (getTopIndustriesForCountry + getCellBySlug under the
 * city's own slug), keeps only trusted local measurements of the activity each
 * claims (isTrustedLocalCell, so no invented number ranks), scores each through
 * the SAME break-in path its own masthead uses, attaches owner take-home + net
 * margin through the SAME single source of truth the cell page uses, ranks by
 * owner take-home descending (highest first, ties by break-in), and self-omits
 * the whole list below three rows.
 *
 * This proves it by calling the new async buildCityActivities for a representative
 * set of cities (London plus a Tier-1 spread and one Tier-2), printing each city's
 * rows, and asserting:
 *
 *   A. No row has a NaN / negative / non-finite break-in score or take-home, and
 *      no city repeats an activity (dedupe holds).
 *   B. Every emitted row's break-in score is 0..100, and take-home (when present)
 *      is positive and under a sane ceiling.
 *   C. Rows are sorted by owner take-home descending (nulls last).
 *   D. London still produces a healthy list (>= 8 rows); its rows are printed so a
 *      human can eyeball them.
 *   E. A thin city (a Tier-3 slug that resolves few trusted cells) returns < 3
 *      rows, so the page would omit the section.
 *
 * Run: npx tsx scripts/audit/dryrun_city_activities.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

/** A sane positive ceiling for an after-tax single-site owner take-home, USD.
 * Nothing we rank should print an owner pocketing more than this; a figure above
 * it is the wrong-scale-aggregate class of bug we never want to surface. */
const TAKE_HOME_CEILING_USD = 25_000_000;

function pad(s: string, w: number): string {
  return s.length >= w ? s : s + " ".repeat(w - s.length);
}
function padL(s: string, w: number): string {
  return s.length >= w ? s : " ".repeat(w - s.length) + s;
}
function fmtMoney(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "-";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
function fmtPctOrDash(n: number | null): string {
  if (n == null || !Number.isFinite(n)) return "-";
  return `${Math.round(n)}%`;
}

// The representative city set: London, a Tier-1 spread, one Tier-2 (austin), and
// one thin Tier-3 (abidjan) for the omission check (E). iso2 is read from the
// city list at runtime, exactly as the page does, so this never drifts.
const TIER1_PLUS = [
  "london",
  "new-york",
  "paris",
  "tokyo",
  "los-angeles",
  "sao-paulo",
  "austin",
];
const THIN_CITY = "abidjan"; // Tier 3, low-coverage country (CI)

type Row = {
  name: string;
  slug: string;
  breakInScore: number;
  breakInBand: string;
  takeHome: number | null;
  netMarginPct: number | null;
};

async function main(): Promise<void> {
  const { buildCityActivities } = await import("@/lib/scores/city_board");
  const cityListJson = (await import("../../data/cities/city_list_v1.json")).default as {
    cities: Array<{ slug: string; iso2: string; tier: number; name: string }>;
  };
  const bySlug = new Map(cityListJson.cities.map((c) => [c.slug, c]));

  let aViol = 0;
  let bViol = 0;
  let cViol = 0;
  const summary: string[] = [];
  const detail: string[] = [];

  async function runCity(slug: string): Promise<Row[]> {
    const city = bySlug.get(slug);
    if (!city) {
      detail.push(`  ${slug}: NOT IN CITY LIST`);
      return [];
    }
    const rows = (await buildCityActivities({
      slug: city.slug,
      countryIso2: city.iso2,
    })) as Row[];

    // A: per-row finiteness + dedupe.
    const seen = new Set<string>();
    for (const r of rows) {
      const badScore =
        !Number.isFinite(r.breakInScore) || r.breakInScore < 0;
      const badTake =
        r.takeHome != null && (!Number.isFinite(r.takeHome) || r.takeHome < 0);
      if (badScore || badTake) {
        aViol++;
        detail.push(
          `    A-VIOLATION ${slug}/${r.slug}: score=${r.breakInScore} take=${r.takeHome}`,
        );
      }
      if (seen.has(r.slug)) {
        aViol++;
        detail.push(`    A-VIOLATION ${slug}: duplicate activity ${r.slug}`);
      }
      seen.add(r.slug);

      // B: bounds.
      if (r.breakInScore < 0 || r.breakInScore > 100) {
        bViol++;
        detail.push(
          `    B-VIOLATION ${slug}/${r.slug}: break-in score out of 0..100 (${r.breakInScore})`,
        );
      }
      if (
        r.takeHome != null &&
        (r.takeHome <= 0 || r.takeHome > TAKE_HOME_CEILING_USD)
      ) {
        bViol++;
        detail.push(
          `    B-VIOLATION ${slug}/${r.slug}: take-home implausible (${r.takeHome})`,
        );
      }
    }

    // C: sorted by owner take-home descending (nulls treated as lowest, last).
    for (let i = 1; i < rows.length; i++) {
      const prev = rows[i - 1].takeHome ?? -Infinity;
      const cur = rows[i].takeHome ?? -Infinity;
      if (cur > prev) {
        cViol++;
        detail.push(
          `    C-VIOLATION ${slug}: row ${i} take-home ${rows[i].takeHome} > row ${i - 1} take-home ${rows[i - 1].takeHome}`,
        );
      }
    }

    summary.push(
      "  " +
        pad(slug, 14) +
        pad(`tier ${city.tier}`, 9) +
        pad(`${rows.length} rows`, 10) +
        (rows.length > 0
          ? `top take-home $${Math.round((rows[0].takeHome ?? 0) / 1000)}K (break-in ${rows[0].breakInScore})`
          : "(omits)"),
    );
    return rows;
  }

  function printRows(title: string, rows: Row[]): void {
    console.log("");
    console.log(`  ${title} (${rows.length} rows)`);
    console.log(
      "    " +
        padL("#", 3) +
        "  " +
        pad("activity", 30) +
        pad("break-in", 18) +
        pad("take-home", 12) +
        "net",
    );
    rows.forEach((r, i) => {
      console.log(
        "    " +
          padL(String(i + 1), 3) +
          "  " +
          pad(r.name.slice(0, 29), 30) +
          pad(`${r.breakInScore} ${r.breakInBand}`, 18) +
          pad(fmtMoney(r.takeHome), 12) +
          fmtPctOrDash(r.netMarginPct),
      );
    });
  }

  console.log("");
  console.log("=".repeat(96));
  console.log("CITY ACTIVITIES dry-run, buildCityActivities (engine-backed, every city)");
  console.log("=".repeat(96));

  // Run the Tier-1+ set and keep London's rows for the D eyeball.
  const cityRows = new Map<string, Row[]>();
  for (const slug of TIER1_PLUS) {
    cityRows.set(slug, await runCity(slug));
  }
  // The thin city (E).
  const thinRows = await runCity(THIN_CITY);

  console.log("");
  console.log("  per-city summary:");
  for (const line of summary) console.log(line);

  // Print every city's table so a human can eyeball them; London called out.
  for (const slug of TIER1_PLUS) {
    printRows(slug, cityRows.get(slug) ?? []);
  }
  printRows(`${THIN_CITY} (thin-city check)`, thinRows);

  if (detail.length) {
    console.log("");
    console.log("  violations:");
    for (const line of detail) console.log(line);
  }

  // D: London healthy (>= 8 rows).
  const londonRows = cityRows.get("london") ?? [];
  const dPass = londonRows.length >= 8;
  // E: thin city omits (< 3 rows).
  const ePass = thinRows.length < 3;

  console.log("");
  console.log("=".repeat(96));
  console.log(`A: no NaN / negative / non-finite score or take-home; no dupes ... ${aViol === 0 ? "PASS" : `FAIL(${aViol})`}`);
  console.log(`B: every score 0..100, take-home positive and under ceiling ..... ${bViol === 0 ? "PASS" : `FAIL(${bViol})`}`);
  console.log(`C: rows sorted by owner take-home descending ................. ${cViol === 0 ? "PASS" : `FAIL(${cViol})`}`);
  console.log(`D: London produces a healthy list (>= 8 rows) .................. ${dPass ? "PASS" : `FAIL(${londonRows.length})`}`);
  console.log(`E: a thin city returns < 3 rows (section omits) ................ ${ePass ? "PASS" : `FAIL(${thinRows.length})`}`);
  console.log("=".repeat(96));
  console.log("");

  const allPass = aViol === 0 && bViol === 0 && cViol === 0 && dPass && ePass;
  process.exit(allPass ? 0 : 1);
}

main().catch((err) => {
  console.error("dryrun_city_activities failed:", err);
  process.exit(1);
});
