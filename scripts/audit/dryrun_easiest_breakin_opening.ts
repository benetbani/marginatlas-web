/**
 * THROWAWAY DRY-RUN, the "Easiest to break in" panel's /opening cross-links.
 *
 * The panel (EasiestToBreakIn.tsx) renders a quiet "Cost to open" link for each
 * ranked row. The row itself always points at the activity's cell page (which
 * renders real content even for a national-aggregate cell). The "Cost to open"
 * link points at that cell's /opening sub-page, which buildOpeningPage gates on
 * isTrustedLocalCell and notFound()s for aggregate / extrapolated cells, so on
 * country pages that link lands on a "Page not found" (a soft 404 served 200).
 *
 * The fix is a LINK gate, not a ROW gate: buildEasiestToBreakIn still emits the
 * row (keeping the ranking and the working cell-page link), but now attaches an
 * `openingHref` that is set ONLY when isTrustedLocalCell(cell, id) holds, the
 * exact predicate buildOpeningPage uses. The component renders the "Cost to open"
 * link only when openingHref is set. So the panel stays on every country page and
 * only the broken cross-links disappear.
 *
 * This proves it by replicating the country page's exact panel pipeline for each
 * prerendered country (placeGeo = "california" for the US, the slugified country
 * name otherwise, exactly as page.tsx hoists it) and checking, per emitted row:
 *   hasLink    row.openingHref != null      (does the panel render a /opening link?)
 *   /opening   buildOpeningPage(...) != null (the live 404 truth oracle)
 *
 * Two assertions, both must hold for EVERY country:
 *   A. NO BROKEN LINK   every emitted row with a link has /opening OK
 *                       (the panel never renders a "Cost to open" link that 404s).
 *   B. NO OVER-HIDING   every emitted row WITHOUT a link has /opening NULL
 *                       (we only withhold links that were actually broken; a row
 *                        whose /opening resolves always keeps its link).
 *
 * Plus a coverage read: emit count per country should be unchanged by the fix
 * (the panel is preserved), with linksKept + linksWithheld accounting for every
 * emitted row.
 *
 * Run: npx tsx scripts/audit/dryrun_easiest_breakin_opening.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });

function pad(s: string, w: number): string {
  return s.length >= w ? s : s + " ".repeat(w - s.length);
}

// The prerendered country set (page.tsx PRERENDER_COUNTRIES). The on-demand long
// tail follows the same code path, so this set is representative of the bug class.
const PRERENDER = [
  "US", "GB", "DE", "FR", "CA", "AU", "IT", "ES", "NL",
  "JP", "IN", "BR", "MX", "SE", "PL", "IE", "NZ", "SG",
];

async function main(): Promise<void> {
  const { getTopIndustriesForCountry, getCellBySlug, slugify } = await import("@/lib/cells");
  const { COUNTRIES, industryToSlug } = await import("@/lib/taxonomy");
  const { buildEasiestToBreakIn } = await import("@/lib/scores/country_board");
  const { buildOpeningPage } = await import("@/lib/open/opening_page");
  const { getCountryEconomicsSnapshot } = await import("@/lib/economics/country_metrics");

  let aViolTotal = 0;
  let bViolTotal = 0;
  let linksKeptTotal = 0;
  let linksWithheldTotal = 0;
  const perCountry: string[] = [];
  const detail: string[] = [];

  for (const iso2 of PRERENDER) {
    const meta = COUNTRIES.find((c: { code: string; name: string }) => c.code === iso2);
    if (!meta) continue;
    const placeGeo = iso2 === "US" ? "california" : slugify(meta.name);
    const snapshot = getCountryEconomicsSnapshot(iso2);

    const topIndustries = await getTopIndustriesForCountry(iso2, 18);
    const resolved = await Promise.all(
      topIndustries.map(async (ind) => {
        const slug = industryToSlug(ind.industry_id);
        const cell = await getCellBySlug(iso2.toLowerCase(), placeGeo, slug, {
          sizeBand: null,
          year: null,
        });
        const opening = await buildOpeningPage({
          country: iso2.toLowerCase(),
          geo: placeGeo,
          industry: slug,
        });
        return {
          industryId: ind.industry_id,
          industryName: ind.industry_name,
          slug,
          cell,
          openingOk: opening != null,
        };
      }),
    );

    // The post-fix rows the panel actually emits, each carrying openingHref.
    const emitted = buildEasiestToBreakIn({
      iso2,
      geo: placeGeo,
      activities: resolved.map((r) => ({
        industryId: r.industryId,
        industryName: r.industryName,
        cell: r.cell,
      })),
      econ: { avgMonthlySalary: snapshot.avgMonthlySalary },
    });

    let linksKept = 0;
    let linksWithheld = 0;
    const aViol: string[] = [];
    const bViol: string[] = [];

    for (const row of emitted) {
      const r = resolved.find((x) => x.industryId === row.industryId);
      const openingOk = !!r && r.openingOk;
      const hasLink = row.openingHref != null;
      if (hasLink) linksKept++;
      else linksWithheld++;

      // A: a rendered link must resolve.
      if (hasLink && !openingOk) {
        aViol.push(row.industryId);
        detail.push(
          "    A-VIOLATION " +
            pad(`${iso2}/${placeGeo}/${row.industrySlug}`, 40) +
            "renders /opening link but it 404s",
        );
      }
      // B: a withheld link must have been genuinely broken.
      if (!hasLink && openingOk) {
        bViol.push(row.industryId);
        detail.push(
          "    B-VIOLATION " +
            pad(`${iso2}/${placeGeo}/${row.industrySlug}`, 40) +
            "withheld /opening link that actually resolves",
        );
      }
    }

    aViolTotal += aViol.length;
    bViolTotal += bViol.length;
    linksKeptTotal += linksKept;
    linksWithheldTotal += linksWithheld;

    perCountry.push(
      "  " +
        pad(`${iso2}/${placeGeo}`, 24) +
        pad(`emit ${emitted.length}`, 9) +
        pad(`linkKept ${linksKept}`, 14) +
        pad(`linkWithheld ${linksWithheld}`, 18) +
        pad(`A ${aViol.length === 0 ? "ok" : "FAIL"}`, 9) +
        `B ${bViol.length === 0 ? "ok" : "FAIL"}`,
    );
  }

  console.log("");
  console.log("=".repeat(96));
  console.log("EASIEST-TO-BREAK-IN /opening cross-link gate, prerendered country sweep");
  console.log("=".repeat(96));
  for (const line of perCountry) console.log(line);

  if (detail.length) {
    console.log("");
    console.log("  violations:");
    for (const line of detail) console.log(line);
  }

  console.log("");
  console.log("=".repeat(96));
  console.log(
    `A: no emitted row renders a /opening link that 404s ... ${aViolTotal === 0 ? "PASS" : `FAIL(${aViolTotal})`}`,
  );
  console.log(
    `B: a row is only link-withheld when /opening is null .. ${bViolTotal === 0 ? "PASS" : `FAIL(${bViolTotal})`}`,
  );
  console.log(`   live "Cost to open" links kept: ${linksKeptTotal}   broken links withheld: ${linksWithheldTotal}`);
  console.log("=".repeat(96));
  console.log("");
  process.exit(aViolTotal + bViolTotal === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("dryrun_easiest_breakin_opening failed:", err);
  process.exit(1);
});
