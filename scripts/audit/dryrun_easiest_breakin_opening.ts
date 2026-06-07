/**
 * THROWAWAY DRY-RUN — the "Easiest to break in" panel's /opening cross-links.
 *
 * The panel (EasiestToBreakIn.tsx) renders a "Cost to open" link `${r.href}/opening`
 * for EVERY emitted row. buildEasiestToBreakIn used to keep a row on the weak gate
 * (right activity + not synthetic), which let extrapolated (coverage_tier "X") and
 * national-aggregate (geo_level "country") cells through. Those still render a cell
 * page, but their /opening sub-page runs buildOpeningPage, which applies
 * isTrustedLocalCell and notFound()s — so the link 404s.
 *
 * This proves the fix (gate buildEasiestToBreakIn on isTrustedLocalCell, the same
 * gate buildOpeningPage uses) by replicating the country page's exact panel
 * pipeline for each prerendered country (placeGeo = "california" for the US, the
 * slugified country name otherwise, exactly as page.tsx hoists it) and checking,
 * per top industry:
 *   OLD-keep   right activity + not synthetic (the pre-fix row gate)
 *   NEW-keep   isTrustedLocalCell(cell, id) (the post-fix row gate)
 *   /opening   buildOpeningPage(...) !== null  (the live 404 truth oracle)
 *
 * Two assertions, both must hold for EVERY country:
 *   A. EMITTED  — every row buildEasiestToBreakIn now emits has /opening OK
 *                 (no panel link 404s).
 *   B. DROPPED  — every row OLD kept but NEW drops has /opening NULL
 *                 (the fix only removes links that were already 404s; it never
 *                  drops a row whose /opening resolved).
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
  const { isTrustedLocalCell } = await import("@/lib/cells/trust");
  const { buildEasiestToBreakIn } = await import("@/lib/scores/country_board");
  const { buildOpeningPage } = await import("@/lib/open/opening_page");
  const { getCountryEconomicsSnapshot } = await import("@/lib/economics/country_metrics");

  let aViolTotal = 0;
  let bViolTotal = 0;
  let removedTotal = 0;
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
          oldKeep:
            !!cell && cell.industry_id === ind.industry_id && !cell.is_synthetic,
          newKeep: isTrustedLocalCell(cell, ind.industry_id),
          openingOk: opening != null,
        };
      }),
    );

    // The post-fix rows the panel actually emits (and renders /opening links for).
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
    const emittedIds = new Set(emitted.map((r) => r.industryId));

    // A: every emitted row resolves /opening.
    const aViol = emitted.filter((row) => {
      const r = resolved.find((x) => x.industryId === row.industryId);
      return !r || !r.openingOk;
    });
    // B: every row OLD kept but NEW dropped was already a 404.
    const diffRows = resolved.filter((r) => r.oldKeep && !r.newKeep);
    const bViol = diffRows.filter((r) => r.openingOk);

    aViolTotal += aViol.length;
    bViolTotal += bViol.length;
    removedTotal += diffRows.length;

    perCountry.push(
      "  " +
        pad(`${iso2}/${placeGeo}`, 24) +
        pad(`emit ${emitted.length}`, 9) +
        pad(`fixRemoved ${diffRows.length}`, 16) +
        pad(`A ${aViol.length === 0 ? "ok" : "FAIL"}`, 9) +
        `B ${bViol.length === 0 ? "ok" : "FAIL"}`,
    );

    // Detail any row the fix removed (old-keep, new-drop) — the bug-class hits.
    for (const r of diffRows) {
      detail.push(
        "    " +
          pad(`${iso2}/${placeGeo}/${r.slug}`, 40) +
          pad(`geo=${r.cell?.geo_level ?? "-"}`, 16) +
          pad(`tier=${(r.cell?.coverage_tier ?? "-").toString()}`, 10) +
          pad(`/opening ${r.openingOk ? "OK" : "NULL(404)"}`, 18) +
          (emittedIds.has(r.industryId) ? "STILL-EMITTED!" : "dropped"),
      );
    }
    for (const v of aViol) {
      detail.push(`    A-VIOLATION ${iso2}/${placeGeo}/${v.industryId}: emitted but /opening 404s`);
    }
  }

  console.log("");
  console.log("=".repeat(96));
  console.log("EASIEST-TO-BREAK-IN /opening cross-link gate — prerendered country sweep");
  console.log("=".repeat(96));
  for (const line of perCountry) console.log(line);

  if (detail.length) {
    console.log("");
    console.log("  rows the fix removed (each must be /opening NULL and 'dropped'):");
    for (const line of detail) console.log(line);
  }

  console.log("");
  console.log("=".repeat(96));
  console.log(
    `A: no emitted panel row 404s ............... ${aViolTotal === 0 ? "PASS" : `FAIL(${aViolTotal})`}`,
  );
  console.log(
    `B: fix only drops already-404 rows ......... ${bViolTotal === 0 ? "PASS" : `FAIL(${bViolTotal})`}`,
  );
  console.log(`   total 404-links removed by the fix: ${removedTotal}`);
  console.log("=".repeat(96));
  console.log("");
  process.exit(aViolTotal + bViolTotal === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("dryrun_easiest_breakin_opening failed:", err);
  process.exit(1);
});
