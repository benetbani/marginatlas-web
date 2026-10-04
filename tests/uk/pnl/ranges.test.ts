/**
 * The headline figures' range across the three band shapes (pareto, log-flat, flat), London barbershops and restaurants.
 * Every value agreed to the penny with the independent Python implementation at each shape's anchor (2026-10-02).
 *
 * Run: npx tsx tests/uk/pnl/ranges.test.ts
 */
import { shapeRanges } from "../../../src/lib/uk/pnl/ranges";
import { londonTradeInputs, londonTradeRanges } from "../../../src/lib/uk/pnl/london";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-pnl-ranges";
const FILE = "src/lib/uk/pnl/ranges.ts";
const REMEDY = "fix ranges.ts until this worked example holds; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};
const r4 = (x: number) => Math.round(x * 10_000) / 10_000;

const b = londonTradeRanges("barbershops")!;
check("barbershops: the anchor 130,831.17 (pareto), 139,406.36 (log-flat), 148,438.79 (flat)", b.anchorSales.lo === 130_831.17 && b.anchorSales.mid === 139_406.36 && b.anchorSales.hi === 148_438.79);
check("barbershops: break-even 62,453.27 to 65,861.19 around 64,112.98", b.breakEven.lo === 62_453.27 && b.breakEven.mid === 64_112.98 && b.breakEven.hi === 65_861.19);
check("barbershops: 0.5986 to 0.6282 of registered businesses above it, around 0.6136", r4(b.shareAbove.lo) === 0.5986 && r4(b.shareAbove.mid) === 0.6136 && r4(b.shareAbove.hi) === 0.6282);
check("barbershops: the median owner keeps 24,951.65 to 25,830.38 around 25,407.33", b.keepsQ50.lo === 24_951.65 && b.keepsQ50.mid === 25_407.33 && b.keepsQ50.hi === 25_830.38);

const r = londonTradeRanges("restaurants")!;
check("restaurants: break-even 535,523.20 to 577,038.50 around 556,017.36", r.breakEven.lo === 535_523.2 && r.breakEven.mid === 556_017.36 && r.breakEven.hi === 577_038.5);
check("restaurants: the median owner keeps 11,533.69 to 15,558.30 around 13,756.27: a thin margin moves most", r.keepsQ50.lo === 11_533.69 && r.keepsQ50.mid === 13_756.27 && r.keepsQ50.hi === 15_558.3);
check("restaurants: the margin at the median 4.09% to 5.89% around 5.03%", r4(r.marginAtMedian.lo) === 0.0409 && r4(r.marginAtMedian.mid) === 0.0503 && r4(r.marginAtMedian.hi) === 0.0589);
check("mid is the log-flat reading the summary prints, so the two never disagree", shapeRanges(londonTradeInputs("restaurants")!)!.keepsQ50.mid === 13_756.27);
check("a withheld trade has no range", londonTradeRanges("grocery-stores") === null);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/pnl/ranges: all pass");
