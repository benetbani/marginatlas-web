/**
 * probe_live_data.ts - reachability audit. Answers one question: does the
 * data we KNOW is in the DB actually reach the rendered page through the
 * site's own slug round-trip (slugify(geo_id) -> regionalSlugToGeoId ->
 * query)?
 *
 * Three probes:
 *   A. Featured tuples (the homepage storefront) - must resolve to real data.
 *   B. Round-trip: pull real (country, geo_id, industry_id) rows straight
 *      from regional_cells, convert to the slugs the site would use, then
 *      call getCellBySlug and check it returns that SAME real row (not a
 *      fall-through to country-level extrapolated, and not synthesis).
 *   C. US state cells (cells_master path).
 *
 * Classifies each result: regional | country (extrapolated) | sector |
 * synthetic. A round-trip that was regional in the DB but comes back
 * country/synthetic is a REACHABILITY BUG (slug mapping drops real data).
 *
 * Read-only. Writes data/audit/data_reachability.json.
 * Usage: npx tsx scripts/audit/probe_live_data.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { writeFileSync } from "node:fs";

// Load .env.local before importing anything that reads env (supabase.ts).
config({ path: resolve(process.cwd(), ".env.local") });

async function run(): Promise<void> {
  // Relative imports (not @/ alias) to match the proven tsx script pattern
  // used by the other scripts/audit/* files; tsx does not reliably resolve
  // the tsconfig path alias for standalone runs.
  const { getCellBySlug, slugify } = await import("../../src/lib/cells");
  const { regionalSlugToGeoId } = await import("../../src/lib/cells/geo");
  const { industryToSlug } = await import("../../src/lib/taxonomy");
  const { supabaseAdmin } = await import("../../src/lib/supabase");

  type Probe = {
    label: string;
    country: string;
    geoSlug: string;
    industrySlug: string;
    db_geo_id?: string; // for round-trip: the geo_id we expect to hit
    resolved_geo_id: string;
    tier: "regional" | "country" | "sector" | "synthetic" | "error";
    quality: number | null;
    geo_level: string | null;
    reachability_bug: boolean;
  };

  function classify(cell: {
    is_synthetic?: boolean;
    geo_level?: string | null;
    coverage_tier?: string | null;
    quality_score?: number | null;
  }): Probe["tier"] {
    if (cell.is_synthetic) return "synthetic";
    const lvl = (cell.geo_level || "").toLowerCase();
    if (lvl === "country" || lvl === "nation") return "country";
    if (cell.coverage_tier === "X") return "sector";
    if (lvl) return "regional";
    return "country";
  }

  const probes: Probe[] = [];

  async function probe(
    label: string,
    country: string,
    geoSlug: string,
    industrySlug: string,
    db_geo_id?: string,
  ): Promise<void> {
    const resolved_geo_id = regionalSlugToGeoId(country.toUpperCase(), geoSlug);
    try {
      const cell = await getCellBySlug(country, geoSlug, industrySlug);
      const tier = classify(cell);
      // Reachability bug: we expected a specific regional geo_id and the
      // result was NOT a regional hit (slug mapping dropped real data).
      const reachability_bug = Boolean(db_geo_id) && tier !== "regional";
      probes.push({
        label,
        country,
        geoSlug,
        industrySlug,
        db_geo_id,
        resolved_geo_id,
        tier,
        quality: cell.quality_score ?? null,
        geo_level: cell.geo_level ?? null,
        reachability_bug,
      });
    } catch (e) {
      probes.push({
        label,
        country,
        geoSlug,
        industrySlug,
        db_geo_id,
        resolved_geo_id,
        tier: "error",
        quality: null,
        geo_level: null,
        reachability_bug: Boolean(db_geo_id),
      });
    }
  }

  // --- Probe A: homepage featured tuples (the storefront) ---
  const FEATURED: Array<[string, string, string]> = [
    ["us", "california", "software-development"],
    ["gb", "gb", "legal-services"],
    ["de", "de21", "fabricated-metal-mfg"],
    ["es", "es511", "restaurants"],
    ["mx", "mx-roo", "hotels-lodging"],
    ["us", "california", "restaurants"],
  ];
  for (const [c, g, i] of FEATURED) await probe(`featured:${c}/${g}/${i}`, c, g, i);

  // --- Probe B: round-trip real regional rows through the site's slugs ---
  // Pull high-quality real rows, ONE PER COUNTRY (a single .limit() with no
  // order returns rows all from one big country, so query per country).
  const COUNTRIES_B = ["DE", "FR", "ES", "IT", "JP", "MX", "AU", "GB", "NL", "PL"];
  const picks: Array<{ country: string; geo_id: string; industry_id: string }> = [];
  for (const country of COUNTRIES_B) {
    const { data } = await supabaseAdmin
      .from("regional_cells")
      .select("country, geo_id, industry_id, quality_score")
      .eq("country", country)
      .gte("quality_score", 70)
      .limit(1);
    const r = data?.[0];
    if (r) {
      picks.push({
        country: r.country as string,
        geo_id: r.geo_id as string,
        industry_id: r.industry_id as string,
      });
    }
  }

  // Industry-resolution diagnostic: for each pick, does the site's
  // slug -> industry -> resolveToMeasuredIndustry round-trip preserve the
  // industry_id that the DB row actually uses? If not, the regional query
  // searches for the wrong id and real data is missed.
  const { slugToIndustry, resolveToMeasuredIndustry } = await import(
    "../../src/lib/taxonomy"
  );
  const industryRemaps: Array<{
    db_industry: string;
    via_slug: string;
    resolved_to: string | null;
    preserved: boolean;
  }> = [];
  for (const p of picks) {
    const slug = industryToSlug(p.industry_id) ?? p.industry_id;
    const raw = slugToIndustry(slug);
    const resolved = raw ? resolveToMeasuredIndustry(raw) : null;
    industryRemaps.push({
      db_industry: p.industry_id,
      via_slug: slug,
      resolved_to: resolved?.id ?? null,
      preserved: resolved?.id === p.industry_id,
    });
  }

  for (const p of picks) {
    const geoSlug = slugify(p.geo_id);
    const industrySlug = industryToSlug(p.industry_id) ?? p.industry_id;
    await probe(
      `roundtrip:${p.country}/${p.geo_id}/${p.industry_id}`,
      p.country.toLowerCase(),
      geoSlug,
      industrySlug,
      p.geo_id,
    );
  }

  // --- Probe C: US state cells (cells_master) ---
  for (const [c, g, i] of [
    ["us", "texas", "restaurants"],
    ["us", "new-york", "legal-services"],
    ["us", "florida", "auto-repair-shops"],
  ] as Array<[string, string, string]>) {
    await probe(`us:${c}/${g}/${i}`, c, g, i);
  }

  const total = probes.length;
  const synthetic = probes.filter((p) => p.tier === "synthetic").length;
  const bugs = probes.filter((p) => p.reachability_bug);
  const snapshot = {
    generated_at: new Date().toISOString(),
    sample_size: total,
    synthetic_count: synthetic,
    synthesis_rate: Number((synthetic / total).toFixed(4)),
    reachability_bug_count: bugs.length,
    tier_breakdown: {
      regional: probes.filter((p) => p.tier === "regional").length,
      country: probes.filter((p) => p.tier === "country").length,
      sector: probes.filter((p) => p.tier === "sector").length,
      synthetic,
      error: probes.filter((p) => p.tier === "error").length,
    },
    industry_remaps: industryRemaps,
    industry_remap_drops: industryRemaps.filter((r) => !r.preserved),
    probes,
  };
  const out = resolve(process.cwd(), "data/audit/data_reachability.json");
  writeFileSync(out, JSON.stringify(snapshot, null, 2));
  console.log(
    `Probed ${total}: regional=${snapshot.tier_breakdown.regional} ` +
      `country=${snapshot.tier_breakdown.country} sector=${snapshot.tier_breakdown.sector} ` +
      `synthetic=${synthetic} error=${snapshot.tier_breakdown.error}`,
  );
  console.log(`Reachability bugs (real regional data NOT reached): ${bugs.length}`);
  for (const b of bugs) {
    console.log(
      `  BUG ${b.label}: slug '${b.geoSlug}' -> '${b.resolved_geo_id}' ` +
        `(db has '${b.db_geo_id}') resolved as ${b.tier}`,
    );
  }
  const drops = snapshot.industry_remap_drops;
  console.log(`\nIndustry-resolution drops (DB id NOT preserved): ${drops.length}/${industryRemaps.length}`);
  for (const d of drops) {
    console.log(`  '${d.db_industry}' --slug--> '${d.via_slug}' --resolve--> '${d.resolved_to}'`);
  }
  console.log(`\nWrote ${out}`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
