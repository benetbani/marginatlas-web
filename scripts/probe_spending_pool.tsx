/**
 * probe_spending_pool , how many city pages built that card with nothing in it?
 *
 * WHAT THIS CANNOT DISTINGUISH: it reads a sample of cities, not all 252. The two
 * fields it looks for are set unconditionally or not at all by the adapter, so a
 * sample settles the question; a field that varied per city would not.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/probe_spending_pool.tsx
 */
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { spineCitySeed } from "../src/lib/spine-seeds";

const SLUGS = ["london", "tokyo", "new-york", "sao-paulo", "berlin", "mumbai", "lagos", "sydney"];

async function main() {
  let empty = 0;
  let seen = 0;
  console.log("");
  for (const slug of SLUGS) {
    const d: any = await buildSpineCitySeed(slug);
    if (!d) { console.log(`  ${slug.padEnd(11)} no such city`); continue; }
    const o = d.demand;
    if (!o) { console.log(`  ${String(d.meta?.city ?? slug).padEnd(11)} no demand block at all, the whole band omits`); continue; }
    seen++;
    const mag = o.spend_per_capita_usd != null;
    const mil = o.millionaires_count != null;
    const split = o.resident_pct != null && o.visitor_pct != null;
    if (!mag && !mil) empty++;
    console.log(
      `  ${String(d.meta?.city ?? slug).padEnd(11)} spend/resident ${mag ? "yes" : "no "}  millionaires ${mil ? "yes" : "no "}  split ${split ? "yes" : "no "}   => the card had ${mag || mil ? "content" : "ONLY ITS HEADING"}`,
    );
  }
  const s: any = spineCitySeed;
  const so = s.demand ?? {};
  console.log(
    `\n  bundled sample   spend/resident ${so.spend_per_capita_usd != null ? "yes" : "no "}  millionaires ${so.millionaires_count != null ? "yes" : "no "}   => the card had content`,
  );
  console.log(`\n  ${empty} of ${seen} real cities built the card with nothing under its heading.\n`);
}
void main();

/* ------------------------------------------------------------------------- *
 * A SECOND READING, recorded for the NEXT row and deliberately not acted on.
 * The card beside this one draws a bar whose two segments are widths in per
 * cent, so it claims to sum to 100. The two figures are rounded independently
 * upstream, which is exactly how a pair like that drifts off its own total.
 * ------------------------------------------------------------------------- */
async function sums() {
  console.log("  the seasonal bar, does it sum to what it claims?");
  for (const slug of SLUGS) {
    const d: any = await buildSpineCitySeed(slug);
    const o = d?.demand;
    if (!o || o.resident_pct == null || o.visitor_pct == null) continue;
    const t = o.resident_pct + o.visitor_pct;
    console.log(
      `    ${String(d.meta?.city ?? slug).padEnd(11)} ${String(o.resident_pct).padStart(3)} + ${String(o.visitor_pct).padStart(2)} = ${String(t).padStart(3)}   ${t === 100 ? "closes" : "DOES NOT CLOSE"}`,
    );
  }
}
void sums();
