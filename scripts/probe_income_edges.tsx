/**
 * probe_income_edges , can the income scale be handed a figure it cannot place?
 *
 * The section admits itself on the median alone, and then places three marks with
 * a logarithm. A missing top-tenth or top-hundredth falls back to zero, and the
 * logarithm of zero is negative infinity, which is not a position. This asks
 * whether any real city reaches that state.
 *
 * WHAT THIS CANNOT DISTINGUISH: it reads the cities it is given. It cannot prove
 * the case is unreachable, only that it is not reached by these.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/probe_income_edges.tsx
 */
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";

const SLUGS = ["london", "tokyo", "new-york", "sao-paulo", "berlin", "mumbai", "lagos", "sydney", "cairo", "hanoi"];

async function main() {
  console.log("");
  let risky = 0;
  let withMedian = 0;
  for (const slug of SLUGS) {
    const d: any = await buildSpineCitySeed(slug);
    if (!d) { console.log(`  ${slug.padEnd(11)} no such city`); continue; }
    const o = d.income ?? {};
    if (o.median_income_usd == null) { console.log(`  ${String(d.meta?.city ?? slug).padEnd(11)} no median, the card omits`); continue; }
    withMedian++;
    const med = o.median_income_usd, t10 = o.top10_income_usd ?? 0, t1 = o.top1_income_usd ?? 0;
    const bad = !(med > 0) || !(t10 > 0) || !(t1 > 0);
    const order = med <= t10 && t10 <= t1;
    if (bad) risky++;
    console.log(
      `  ${String(d.meta?.city ?? slug).padEnd(11)} median ${String(med).padStart(7)}  top10 ${String(t10).padStart(7)}  top1 ${String(t1).padStart(7)}   ${bad ? "CANNOT BE PLACED" : order ? "placeable, in order" : "placeable, OUT OF ORDER"}`,
    );
  }
  console.log(`\n  ${withMedian} card(s) drawn, ${risky} of them carrying a figure that cannot be placed.\n`);
}
void main();
