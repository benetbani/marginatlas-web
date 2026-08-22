/**
 * probe_money_split , does the "$100" bar actually add up to 100?
 *
 * THE CLAIM UNDER TEST. The cell page's cost stack says "Where each $100 of
 * sales goes" and draws a 100% stacked bar whose segment widths are set to the
 * literal percentages. If those percentages do not sum to 100, the bar does not
 * fill its own track, and the section's whole claim is a sum.
 *
 * THE PIPELINE, reproduced exactly as it runs:
 *   1. the cost structure is scaled so the four costs plus the net margin sum to
 *      exactly 100.0 in floating point
 *   2. any slice under half a point is DROPPED
 *   3. each surviving slice is rounded INDEPENDENTLY to a whole number
 *   4. the bar sets each segment's width to that whole number, as a percentage,
 *      with no normalisation
 *
 * Steps 2 and 3 are where the sum escapes. This runs the pipeline over a wide
 * spread of realistic cost structures and counts how often it lands off 100, and
 * in which direction, because the two directions fail differently: short leaves
 * a gap at the right end, long is CLIPPED, and the clipped end is the terracotta
 * slice the section exists to show.
 *
 *   node scripts/probe_money_split.mjs
 */

/* Step 1 and 2, verbatim in behaviour. */
function buildMoneyGoes(cs, netMarginPct) {
  const net = Math.max(0, Math.min(60, netMarginPct));
  const costsTotal = 100 - net;
  const sum = cs.cogs + cs.labor + cs.rent + cs.other;
  if (!(sum > 0) || costsTotal <= 0) return null;
  const scale = costsTotal / sum;
  const items = [
    { label: "Cost of goods", perHundred: cs.cogs * scale },
    { label: "Payroll", perHundred: cs.labor * scale },
    { label: "Rent and premises", perHundred: cs.rent * scale },
    { label: "Everything else", perHundred: cs.other * scale },
    { label: "What the owner keeps", perHundred: net, kept: true },
  ].filter((it) => it.perHundred >= 0.5);
  return items.length >= 2 ? items : null;
}

/* Step 3, the adapter. */
const toBar = (items) => items.map((m) => ({ ...m, pct: Math.round(m.perHundred) }));

/* A spread of plausible cost structures. Restaurant-ish, retail-ish, service-ish,
   rent-heavy, payroll-heavy, and the thin-margin and fat-margin ends. */
const SHAPES = [
  { cogs: 32, labor: 30, rent: 9, other: 22 },
  { cogs: 55, labor: 18, rent: 7, other: 12 },
  { cogs: 8, labor: 48, rent: 14, other: 22 },
  { cogs: 41, labor: 26, rent: 18, other: 8 },
  { cogs: 12, labor: 61, rent: 5, other: 15 },
  { cogs: 63, labor: 11, rent: 11, other: 9 },
  { cogs: 27, labor: 27, rent: 27, other: 12 },
  { cogs: 3, labor: 39, rent: 31, other: 20 },
];

let n = 0, off = 0, short = 0, long = 0, dropped = 0, worst = 0;
const examples = [];

for (const shape of SHAPES) {
  for (let net = 1; net <= 40; net++) {
    const built = buildMoneyGoes(shape, net);
    if (!built) continue;
    if (built.length < 5) dropped++;
    const bar = toBar(built);
    const total = bar.reduce((a, b) => a + b.pct, 0);
    n++;
    if (total !== 100) {
      off++;
      if (total < 100) short++; else long++;
      if (Math.abs(total - 100) > Math.abs(worst)) worst = total - 100;
      if (examples.length < 6) {
        examples.push({
          net,
          shape,
          total,
          parts: bar.map((b) => `${b.label.split(" ")[0]} ${b.pct}`).join("  "),
        });
      }
    }
  }
}

console.log(`\n  ${n} realistic splits run through the live pipeline\n`);
console.log(`  land on exactly 100 : ${n - off}   (${(((n - off) / n) * 100).toFixed(1)}%)`);
console.log(`  DO NOT sum to 100   : ${off}   (${((off / n) * 100).toFixed(1)}%)`);
console.log(`     short of 100, leaves a gap at the right end : ${short}`);
console.log(`     over 100, the LAST segment is clipped       : ${long}`);
console.log(`  worst miss          : ${worst > 0 ? "+" : ""}${worst} points`);
console.log(`  splits that silently lost a slice under half a point: ${dropped}\n`);

console.log("  examples:");
for (const e of examples) {
  console.log(`    net ${String(e.net).padStart(2)}%  sums to ${e.total}   ${e.parts}`);
}

/* THE PART THAT MATTERS MOST. The bar sorts size-descending with the kept slice
   pinned LAST and terracotta, so when the total runs over 100 the segment that
   overflows the container, and is hidden by it, is the one the section is about. */
console.log(
  `\n  When the total runs over 100 (${long} of ${n}), the overflowing segment is the LAST one,`,
);
console.log("  and the bar pins the kept slice last. The clipped slice is the terracotta one.\n");
