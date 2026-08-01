/**
 * scripts/verify_shared_revenue_across_countries.ts
 *
 * ONE NUMBER CANNOT BE THE ANSWER FOR SEVEN CITIES.
 *
 * The whole claim of this site is that it publishes what a business actually
 * earns IN A PARTICULAR PLACE. So the worst thing it can do is print the same
 * figure for London, Sao Paulo, Tokyo, Madrid, Berlin, Paris and Manchester,
 * to the cent, and put a label on each of them that asserts a direct
 * observation in that place. That is not a rounding problem. It is the product
 * saying something it does not know, in the voice it reserves for things it
 * does know.
 *
 * WHERE IT COMES FROM. Two thirds of the rows behind place pages carry firm
 * counts and employment but no revenue of their own. When one of those is the
 * best row for a page, the read path fills the missing headline from a
 * per-industry anchor (src/lib/cells/fill_defaults.ts, pickTypicalRevenue) and
 * leaves the row's provenance tier untouched. The anchor is per-country only
 * when a country happens to have its own entry; otherwise it is a single global
 * constant, identical for every country that falls through to it. The label
 * that survives describes where the firm COUNT came from, not where the revenue
 * came from, so a shared constant inherits the strongest wording on the site.
 *
 * WHAT THIS GATE CHECKS. For every country that publishes place pages and every
 * industry the site covers, it reproduces that fill using the production
 * functions themselves (fillMissingFields then enforceSanity, imported, not
 * reimplemented), reads the tier off the RESULTING cell, and groups identical
 * figures. It fails when one figure is published for two or more different
 * countries under a measured-class label.
 *
 * Reading the tier off the OUTPUT rather than the input is deliberate: it means
 * any of the three honest repairs turns this gate green on its own. Make the
 * figure place-specific, or dash it, or mark the filled cell so it stops
 * claiming to be measured, and the collision stops counting.
 *
 * THE THRESHOLD, AND WHY.
 *   - Two countries is enough. Two national datasets do not agree on a currency
 *     amount to the cent. Requiring three would wave through the real
 *     two-country collisions this found.
 *   - Nulls and zeros never count. A dash is the honest outcome and must never
 *     be what trips a gate about honesty.
 *   - Figures below COLLISION_FLOOR never count. Small numbers genuinely
 *     coincide, and no real annual revenue-per-firm headline sits under a
 *     thousand dollars, so nothing true is lost by ignoring that range.
 *   - Only measured-class labels count. A figure shared under an estimated or
 *     modeled label is a guess wearing a guess's label, which is honest. This
 *     gate is only about a guess wearing an observation's label.
 *   - Alias country codes are collapsed first. GB and UK are one country, as
 *     are GR and EL, and both pairs appear in the data. A code duplicate must
 *     not be able to fake a violation.
 *
 * STATE. REPAIRED, and this is now a plain gate that demands zero. It ran as a
 * RATCHET from 2026-08-01 at a recorded 7281 colliding combinations while the
 * defect was live and the repair was still a founder decision. The repair that
 * landed is the third of the three the note above anticipated: the fill is
 * marked where it happens (fillMissingFields sets _revenueFilled on a cell whose
 * HEADLINE it supplied rather than read) and deriveCoverageTier refuses
 * "measured" for such a cell. No figure moved; the claim about the figure did.
 * The count fell to zero on the same probe, which is the whole reason the tier
 * is read off the OUTPUT. See design/loop4/reviews/2026-08-01-X1-shared-revenue.md.
 *
 * Because it is repaired, there is no baseline file any more and no reseed path.
 * A reseed on a repaired gate is only ever a way to make a returning defect look
 * normal. Any collision fails the run, in every mode.
 *
 * Run:    npx tsx scripts/verify_shared_revenue_across_countries.ts
 * Strict: npx tsx scripts/verify_shared_revenue_across_countries.ts --strict
 *         (identical behaviour; the flag is kept because the prebuild
 *          registration passes it and it says out loud what the gate demands)
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fillMissingFields, enforceSanity } from "../src/lib/cells/fill_defaults";
import { deriveCoverageTier } from "../src/components/CoverageIndicator";

const ROOT = process.cwd();
const COVERAGE_PATH = resolve(ROOT, "data/coverage/regional_coverage_v1.json");
const TAXONOMY_PATH = resolve(ROOT, "src/lib/taxonomy/industries.json");

/**
 * Below this, exact equality between two places can be an honest coincidence,
 * and nothing the site publishes as an annual revenue-per-firm headline sits
 * this low anyway.
 */
const COLLISION_FLOOR = 1_000;

/**
 * Country codes that are the same country written two ways. Both pairs are
 * present in the place data. Collapsed before the "different country" test so
 * a coding duplicate cannot register as a collision.
 */
const COUNTRY_ALIASES: Record<string, string> = { UK: "GB", EL: "GR" };
const canon = (iso: string) => COUNTRY_ALIASES[iso.toUpperCase()] ?? iso.toUpperCase();

/**
 * The provenance shapes that actually occur on revenue-less place rows. Before
 * the repair both derived measured-class, which was the point. Both now derive
 * "estimated", because the fill that supplied their headline says so.
 */
const PROVENANCE_SHAPES: Array<{ coverage_tier: string; quality_score: number }> = [
  { coverage_tier: "P", quality_score: 90 },
  { coverage_tier: "S", quality_score: 78 },
];

const coverage = JSON.parse(readFileSync(COVERAGE_PATH, "utf-8")) as Record<string, boolean>;
const taxonomy = JSON.parse(readFileSync(TAXONOMY_PATH, "utf-8")) as {
  industries: Array<{ id: string }>;
};

const countries = Object.entries(coverage)
  .filter(([, on]) => on)
  .map(([iso]) => iso.toUpperCase())
  .sort();
const industries = taxonomy.industries.map((i) => i.id).sort();

type Hit = { country: string; industry: string; tier: string };
const byFigure = new Map<string, Hit[]>();
let probed = 0;
let dashed = 0;
let belowFloor = 0;
let notMeasured = 0;

for (const iso of countries) {
  for (const industryId of industries) {
    for (const shape of PROVENANCE_SHAPES) {
      probed++;
      // The shape of a real place row that has provenance but no revenue: the
      // condition two thirds of the rows behind place pages are in.
      const row = {
        country: iso,
        geo_id: `${iso}-PROBE`,
        geo_level: "region",
        geo_name: iso,
        industry_id: industryId,
        size_band: null,
        year: 2024,
        revenue_per_firm: null,
        rev_p50: null,
        coverage_tier: shape.coverage_tier,
        quality_score: shape.quality_score,
        currency: "USD",
      };
      // The production read path, imported rather than reimplemented, so this
      // cannot drift away from what the pages actually do.
      const published = enforceSanity(fillMissingFields(row as never));
      const figure = published.revenue_per_firm;
      if (figure == null || figure === 0) {
        dashed++;
        continue;
      }
      if (figure < COLLISION_FLOOR) {
        belowFloor++;
        continue;
      }
      // Read the label off the RESULT, so marking a filled cell as no longer
      // measured is a repair this gate can see.
      if (deriveCoverageTier(published) !== "measured") {
        notMeasured++;
        continue;
      }
      const key = figure.toFixed(2);
      byFigure.set(key, [
        ...(byFigure.get(key) ?? []),
        { country: iso, industry: industryId, tier: shape.coverage_tier },
      ]);
    }
  }
}

type Cluster = { figure: string; countries: string[]; combinations: number; industries: string[] };
const clusters: Cluster[] = [];
for (const [figure, hits] of byFigure) {
  const cs = [...new Set(hits.map((h) => canon(h.country)))].sort();
  if (cs.length < 2) continue;
  const combos = new Set(hits.map((h) => `${h.country}|${h.industry}`));
  clusters.push({
    figure,
    countries: cs,
    combinations: combos.size,
    industries: [...new Set(hits.map((h) => h.industry))].sort(),
  });
}
clusters.sort((a, b) => b.combinations - a.combinations);
const totalCombinations = clusters.reduce((s, c) => s + c.combinations, 0);

console.log("=== verify_shared_revenue_across_countries ===");
console.log(
  `  probed ${probed} (country, industry, provenance) shapes across ${countries.length} countries and ${industries.length} industries.`,
);
console.log(
  `  ${dashed} dashed honestly, ${belowFloor} below the $${COLLISION_FLOOR} floor, ${notMeasured} not measured-class.`,
);
console.log("");
console.log(`  COLLIDING (country, industry) combinations: ${totalCombinations}`);
console.log(`  Distinct shared figures:                    ${clusters.length}`);

function show(list: Cluster[]) {
  for (const c of list) {
    const inds =
      c.industries.length <= 3
        ? c.industries.join(", ")
        : `${c.industries.slice(0, 3).join(", ")} +${c.industries.length - 3} more`;
    console.log(
      `    $${c.figure.padStart(14)}  ${String(c.countries.length).padStart(2)} countries  ${String(c.combinations).padStart(4)} combos  [${c.countries.join(",")}]`,
    );
    console.log(`                     industries: ${inds}`);
  }
}

if (clusters.length) {
  console.log("");
  console.log("  Widest by country count (one figure standing in for the most places):");
  show([...clusters].sort((a, b) => b.countries.length - a.countries.length).slice(0, 8));
  console.log("");
  console.log("  Widest by combination count (one figure covering the most of the site):");
  show(clusters.slice(0, 8));
}

// Zero, in every mode. The ratchet and its baseline file were removed when the
// repair landed: a tolerated count is only useful while a defect is knowingly
// live, and leaving one behind on a repaired gate is how a returning defect
// gets to look normal.
if (totalCombinations > 0) {
  console.error(
    `\nx verify_shared_revenue_across_countries: ${totalCombinations} combination(s) publish a figure that is\n` +
      `   also published for a different country, under a label that asserts a direct observation.\n` +
      `   Repair the fill, dash the figure, or stop calling a filled cell measured.\n` +
      `   Do not relax this gate. It was at 7281 once and reached zero without any figure moving.`,
  );
  process.exit(1);
}

console.log("\n  GATE: PASS. No figure is published for two countries under a measured-class label.");
