/**
 * dryrun_us_industry_fix - before/after evidence for the US wrong-industry
 * foundation fix (Fable, 2026-06-12).
 *
 * For each (state, industry-slug) probe: queries the NAICS-3 candidate set
 * exactly like getCellBySlugRaw, then shows
 *   BEFORE: the row the old logic returned (largest n in the whole group)
 *   AFTER:  the row the validated logic returns (pickMatchingRow), or the
 *           honest fall-through to the modeled cell.
 *
 * Run: npx tsx scripts/audit/dryrun_us_industry_fix.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const { supabaseAdmin } = await import("../../src/lib/supabase");
  const { slugToIndustry, resolveToMeasuredIndustry } = await import(
    "../../src/lib/taxonomy"
  );
  const { pickMatchingRow } = await import(
    "../../src/lib/cells/us_industry_match"
  );
  const { SLUG_TO_GEO_ID } = await import("../../src/lib/cells/geo");

  const probes: Array<[string, string]> = [
    // The reported breakages
    ["california", "legal-services"],
    ["california", "dental-practices"],
    ["california", "hairdressers-beauty"],
    ["california", "independent-pharmacy"],
    ["texas", "legal-services"],
    ["new-york", "dental-practices"],
    // Healthy controls (must NOT regress)
    ["california", "restaurants"],
    ["california", "software-development"],
    ["texas", "trucking-freight"],
    ["florida", "real-estate-agencies"],
    // Sub-niche inheritance control (parent_id walk)
    ["california", "sit-down-restaurants"],
  ];

  for (const [state, slug] of probes) {
    const geoId = (SLUG_TO_GEO_ID as Record<string, string>)[state];
    const rawInd = slugToIndustry(slug);
    const ind = resolveToMeasuredIndustry(rawInd);
    const naicsSource =
      rawInd && (rawInd.naics_3 || []).length ? rawInd : ind;
    const header = `\n=== /us/${state}/${slug} ===`;
    if (!geoId || !rawInd || !naicsSource || !(naicsSource.naics_3 || []).length) {
      console.log(header);
      console.log(
        `  (no geo or no NAICS prefixes: geo=${geoId} raw=${rawInd?.id} src=${naicsSource?.id}) -> fuzzy/synth path`,
      );
      continue;
    }
    const orClauses = (naicsSource.naics_3 || [])
      .map((p) => `naics_6.like.${p}%`)
      .join(",");
    const { data, error } = await supabaseAdmin
      .from("cells_master")
      .select("naics_6, industry_description, n, year, rev_p50, size_band")
      .eq("country", "US")
      .eq("geo_id", geoId)
      .or(orClauses)
      .order("year", { ascending: false, nullsFirst: false })
      .order("n", { ascending: false, nullsFirst: false })
      .limit(1000);
    console.log(header);
    if (error || !data || data.length === 0) {
      console.log(`  candidate set empty (${error?.message ?? "no rows"}) -> synth (correctly named)`);
      continue;
    }
    const before = data[0];
    const picked = pickMatchingRow(data as Array<Record<string, unknown>>, rawInd);
    const fmt = (r: Record<string, unknown> | null | undefined) =>
      r
        ? `"${r.industry_description}" [naics ${r.naics_6}] n=${r.n} yr=${r.year} rev_p50=$${Math.round(Number(r.rev_p50 ?? 0)).toLocaleString()}`
        : "(none)";
    console.log(`  requested:  ${rawInd.name} (${rawInd.id})`);
    console.log(`  candidates: ${data.length} rows in group [${(naicsSource.naics_3 || []).join(",")}]`);
    console.log(`  BEFORE:     ${fmt(before as Record<string, unknown>)}`);
    if (picked) {
      console.log(
        `  AFTER:      ${fmt(picked.row as Record<string, unknown>)} (via ${picked.matchedVia}${picked.matchedVia === "parent" ? `: ${picked.matchedIndustry.name}` : ""})`,
      );
    } else {
      console.log(
        `  AFTER:      no honest match in group -> null -> modeled cell named "${rawInd.name}"`,
      );
    }
    const changed =
      !picked ||
      (picked.row as Record<string, unknown>).industry_description !==
        (before as Record<string, unknown>).industry_description;
    console.log(`  verdict:    ${changed ? "CHANGED (was mislabeled)" : "unchanged (was already honest)"}`);
  }
}

main().then(() => process.exit(0)).catch((e) => {
  console.error(e);
  process.exit(1);
});
