/**
 * scripts/spikes/measure_industry_precision.tsx , does the industry page print
 * one quantity at two precisions?
 *
 * WHY. The 2026-08-18 dossier carries this as an open defect: "the same trade
 * reads $9 in one block and 8.6% in another; 6 of 6 rows disagree, worst
 * 0.5pp". That claim was never checked against the code, and this loop's own
 * failure log says a typed statement nobody verified is the defect class behind
 * every tick so far. So it is measured here rather than repaired on trust.
 *
 * WHAT IT COMPARES. For each industry it builds the real seed with
 * `buildSpineIndustrySeed` and prints, side by side:
 *   - `benchmark.trades[].keeps_per_100`, which the rail renders as `${n}`
 *   - `deriveSubtypes(seed)[].keeps_pct`, which the subtype table renders as
 *     `n.toFixed(1)%`
 * and flags any pair whose rendered strings disagree once parsed back to a
 * number.
 *
 * BLIND SPOT, stated: these two blocks describe DIFFERENT things unless a
 * subtype carries the trade's own keep. Trades are sibling industries; subtypes
 * are formats within this trade. A disagreement between them is only a defect
 * where the two rows name the same quantity, so this prints both lists in full
 * and lets the reader see which pairs are comparable rather than asserting a
 * count. It also cannot see rounding done in the component: it reads the data
 * the component is handed.
 *
 * Run:
 *   npx tsx --env-file=.env.local scripts/spikes/measure_industry_precision.tsx restaurants
 */
import { buildSpineIndustrySeed } from "../../src/lib/spine/adapt_industry";
import { deriveSubtypes } from "../../src/components/spine/industry/subtypes";

const SLUGS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["restaurants", "cafes", "bakeries", "hair-salons"];

function rendersAs(n: unknown): { dollars: string; percent: string } {
  const v = typeof n === "number" ? n : Number(n);
  return {
    dollars: Number.isFinite(v) ? `$${v}` : "n/a",
    percent: Number.isFinite(v) ? `${v.toFixed(1)}%` : "n/a",
  };
}

async function main() {
  for (const slug of SLUGS) {
    let seed: any;
    try {
      seed = await buildSpineIndustrySeed(slug);
    } catch (e) {
      console.log(`\n${slug}: build failed, ${(e as Error).message.slice(0, 80)}`);
      continue;
    }
    if (!seed) {
      console.log(`\n${slug}: no seed`);
      continue;
    }

    const trades = seed?.benchmark?.trades ?? [];
    const subtypes = deriveSubtypes(seed) ?? [];

    console.log(`\n=== ${slug} ===`);
    console.log(`hero keeps_per_100: ${JSON.stringify(seed?.margin_intro?.keeps_per_100)}`);
    console.log(`all-trades tick:    ${JSON.stringify(seed?.benchmark?.all_trades_avg)}`);

    console.log(`\ntrades (rail prints $n):`);
    for (const t of trades) {
      const r = rendersAs(t.keeps_per_100);
      const integral = Number.isInteger(t.keeps_per_100);
      console.log(
        `  ${String(t.name).padEnd(26)} raw=${String(t.keeps_per_100).padEnd(8)} prints ${r.dollars.padEnd(6)} ${integral ? "" : "NON-INTEGER"}`,
      );
    }

    console.log(`\nsubtypes (table prints n.n%):`);
    for (const s of subtypes) {
      const r = rendersAs((s as { keeps_pct?: number }).keeps_pct);
      const integral = Number.isInteger((s as { keeps_pct?: number }).keeps_pct);
      console.log(
        `  ${String((s as { name?: string }).name).padEnd(26)} raw=${String((s as { keeps_pct?: number }).keeps_pct).padEnd(8)} prints ${r.percent.padEnd(7)} ${integral ? "" : "NON-INTEGER"}`,
      );
    }

    /* The only pair that names the same quantity: the trade's own row in the
       rail (self) against any subtype carrying the trade's baseline keep. */
    const self = trades.find((t: { self?: boolean }) => t.self);
    if (self) {
      console.log(
        `\nself row: rail prints ${rendersAs(self.keeps_per_100).dollars}, ` +
          `hero prints ${rendersAs(seed?.margin_intro?.keeps_per_100).dollars}, ` +
          `${self.keeps_per_100 === seed?.margin_intro?.keeps_per_100 ? "AGREE" : "DISAGREE"}`,
      );
    }
  }
  console.log(
    "\nThis reads the data handed to the components. It cannot see rounding done inside them, and a trade row and a subtype row are only comparable where they name the same quantity.",
  );
}

void main();
