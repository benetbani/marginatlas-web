/**
 * The TypeScript band estimator equals the Python one (registers/uk/estimators/banded.py). The expected values were
 * produced by the Python implementation on the same counts (Nomis NM_199_1, March 2026, read 2026-10-02).
 *
 * Run: npx tsx tests/uk/pnl/banded.test.ts
 */
import { bandCdf, bandMeanK, bandQuantile, inOpenBand } from "../../../src/lib/uk/pnl/banded";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-pnl-banded";
const FILE = "src/lib/uk/pnl/banded.ts";
const REMEDY = "keep banded.ts equal to registers/uk/estimators/banded.py; never change an expected figure to fit the code (each was computed independently)";
let failed = 0;
/** A red names the rule, the file under test and what to do (scripts/lib/red, the gate-reds ratchet's shape). */
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};
const r1 = (x: number) => Math.round(x * 10) / 10;

const RESTAURANTS_LONDON = [625, 800, 2250, 1470, 1245, 725, 500, 140, 75, 30];
const HAIR_BEAUTY_LONDON = [2405, 3740, 2655, 525, 245, 70, 40, 10, 5, 0];

const qs = [0.1, 0.25, 0.5, 0.75, 0.9].map((q) => r1(bandQuantile(RESTAURANTS_LONDON, q)!.k));
check("restaurants London quantiles equal Python's: 57.5, 124.6, 281.9, 759.1, 1923.1", qs.join(",") === "57.5,124.6,281.9,759.1,1923.1");
check("hair and beauty London median 78.6k (the published table)", r1(bandQuantile(HAIR_BEAUTY_LONDON, 0.5)!.k) === 78.6);
check("share above 100k: restaurants 0.819", Math.round((1 - bandCdf(RESTAURANTS_LONDON, 100)!) * 1000) / 1000 === 0.819);
check("share above 100k: hair and beauty 0.366", Math.round((1 - bandCdf(HAIR_BEAUTY_LONDON, 100)!) * 1000) / 1000 === 0.366);
const low = bandQuantile(HAIR_BEAUTY_LONDON, 0.1)!;
check("hair and beauty q10 falls in the first band and says so (prints as under 50k)", low.openBelow && low.band === 0);
let roundTrip = true;
for (const q of [0.1, 0.25, 0.5, 0.75, 0.9]) {
  const x = bandQuantile(HAIR_BEAUTY_LONDON, q)!.k;
  if (Math.abs(bandCdf(HAIR_BEAUTY_LONDON, x)! - q) > 1e-9) roundTrip = false;
}
check("the CDF inverts the quantile", roundTrip);
check("no businesses, no figure", bandQuantile(new Array(10).fill(0), 0.5) === null && bandCdf(new Array(10).fill(0), 100) === null);
let threw = false;
try { bandQuantile([1, 2, 3], 0.5); } catch { threw = true; }
check("anything but the register's ten bands is refused", threw);

// The anchor: mean sales below 5m, log-uniform inside each band; equal to estimators/banded.py trimmed_mean.
const hb = bandMeanK(HAIR_BEAUTY_LONDON)!;
check("hair and beauty London, mean sales under 5m: 139.40636k (Python: 139.40636)", Math.round(hb.k * 100_000) / 100_000 === 139.40636);
check("its bounds, whatever the shape inside each band: 88.46k to 207.18k", Math.round(hb.lo * 100) / 100 === 88.46 && Math.round(hb.hi * 100) / 100 === 207.18);
const re = bandMeanK(RESTAURANTS_LONDON)!;
check("restaurants London: 597.44087k, inside 391.33k to 867.20k", Math.round(re.k * 100_000) / 100_000 === 597.44087 && Math.round(re.lo * 100) / 100 === 391.33 && Math.round(re.hi * 100) / 100 === 867.2);
check("a band of one value has that mean: 50 businesses all in 100-250k average (250 - 100) / ln 2.5", Math.abs(bandMeanK([0, 0, 50, 0, 0, 0, 0, 0, 0, 0])!.k - 150 / Math.log(2.5)) < 1e-9);
check("nobody below 5m, no mean", bandMeanK([0, 0, 0, 0, 0, 0, 0, 3, 2, 1]) === null);
const r5 = (x: number) => Math.round(x * 100_000) / 100_000;
check("the three band shapes: hair and beauty 130.83117k (pareto) < 139.40636k (log-flat) < 148.43879k (flat), Python's values",
  r5(bandMeanK(HAIR_BEAUTY_LONDON, 7, "pareto")!.k) === 130.83117 && r5(bandMeanK(HAIR_BEAUTY_LONDON, 7, "log-flat")!.k) === 139.40636 && r5(bandMeanK(HAIR_BEAUTY_LONDON, 7, "flat")!.k) === 148.43879);
check("restaurants: 566.21168k (pareto) and 629.47308k (flat) either side of 597.44087k", r5(bandMeanK(RESTAURANTS_LONDON, 7, "pareto")!.k) === 566.21168 && r5(bandMeanK(RESTAURANTS_LONDON, 7, "flat")!.k) === 629.47308);
let openTop = false;
try { bandMeanK(RESTAURANTS_LONDON, 10); } catch { openTop = true; }
check("the open top band is refused: its mean would rest on the cap", openTop);

// Parity with the Python to the last digits, the edges exact, and the same refusals (estimators/banded.py, 2026-10-03).
const near = (x: number, y: number) => Math.abs(x - y) <= 1e-12 * Math.abs(y);
const PY_R = [57.48470287863078, 124.59643091957105, 281.94181923933206, 759.1251417365786, 1923.1193177966609];
const PY_H = [12.649941218765644, 50.17405236988422, 78.62580926652228, 147.50474862510842, 243.65409068712677];
check("every quantile equals Python's to twelve significant figures (restaurants and hair and beauty, q10 to q90)",
  [0.1, 0.25, 0.5, 0.75, 0.9].every((q, i) => near(bandQuantile(RESTAURANTS_LONDON, q)!.k, PY_R[i]) && near(bandQuantile(HAIR_BEAUTY_LONDON, q)!.k, PY_H[i])));
const e50 = bandQuantile([5, 0, 5, 0, 0, 0, 0, 0, 0, 0], 0.5)!, e50m = bandQuantile([0, 0, 0, 0, 0, 0, 0, 0, 5, 5], 0.5)!;
check("a quantile on an edge is the edge exactly and prints as a figure: 50 (not under 50k) and 50,000 (not over 50m)",
  e50.k === 50 && !e50.openBelow && !e50.openAbove && e50m.k === 50_000 && !e50m.openAbove && !inOpenBand(50) && !inOpenBand(50_000));
const top = bandQuantile([0, 0, 0, 0, 0, 0, 0, 0, 0, 4], 0.5)!, bottom = bandQuantile([4, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0.5)!;
check("inside the open bands the floor and the cap are used and flagged: 70,710.68 over 50m, 15.81 under 50k (Python's)",
  near(top.k, 70710.67811865476) && top.openAbove && near(bottom.k, 15.811388300841898) && bottom.openBelow && inOpenBand(49.99) && inOpenBand(50_000.01));
check("hair and beauty q25 at 50.17k is a figure, not under 50k", !bandQuantile(HAIR_BEAUTY_LONDON, 0.25)!.openBelow);
check("the CDF equals Python's: 0 below the floor and at or below 0, 1 above the cap, 0.49982 at 78.6k, 0.99842 at 75,000k",
  bandCdf(RESTAURANTS_LONDON, 4) === 0 && bandCdf(RESTAURANTS_LONDON, 0) === 0 && bandCdf(RESTAURANTS_LONDON, -3) === 0 && bandCdf(RESTAURANTS_LONDON, 200_000) === 1
  && near(bandCdf(HAIR_BEAUTY_LONDON, 78.6)!, 0.4998172824972646) && near(bandCdf(RESTAURANTS_LONDON, 75_000)!, 0.9984158874073327));
const refuses = (f: () => unknown) => { try { f(); return false; } catch { return true; } };
const BAD = [[-5, 0, 0, 0, 0, 0, 0, 0, 0, 10], [Number.NaN, 0, 0, 0, 0, 0, 0, 0, 0, 10], [Infinity, 0, 0, 0, 0, 0, 0, 0, 0, 10], ["5" as unknown as number, 0, 0, 0, 0, 0, 0, 0, 0, 10], [Number.MAX_VALUE, Number.MAX_VALUE, 0, 0, 0, 0, 0, 0, 0, 0]];
check("counts that are negative, not numbers, infinite or overflow their total are refused by all three", BAD.every((b) =>
  refuses(() => bandQuantile(b, 0.5)) && refuses(() => bandCdf(b, 100)) && refuses(() => bandMeanK(b))));
check("a sales figure that is not a number is refused, never read as nobody below it", refuses(() => bandCdf(RESTAURANTS_LONDON, Number.NaN)));


// ---- review additions
check("a q outside (0, 1), or not a number, is refused", [0, 1, -0.1, 1.5, Number.NaN].every((q) => refuses(() => bandQuantile(RESTAURANTS_LONDON, q))));
check("bands 7 and 8 (5m to 50m) equal Python's: restaurants cdf 0.97925 at 7,500k and 0.99075 at 20,000k, q98 7,722.5k (band 7), q99.5 40,954.1k (band 8)",
  near(bandCdf(RESTAURANTS_LONDON, 7_500)!, 0.9792486959415981) && near(bandCdf(RESTAURANTS_LONDON, 20_000)!, 0.9907507305159675)
  && near(bandQuantile(RESTAURANTS_LONDON, 0.98)!.k, 7722.515984513339) && bandQuantile(RESTAURANTS_LONDON, 0.98)!.band === 7
  && near(bandQuantile(RESTAURANTS_LONDON, 0.995)!.k, 40954.131817211535) && bandQuantile(RESTAURANTS_LONDON, 0.995)!.band === 8 && bandQuantile(RESTAURANTS_LONDON, 0.5)!.band === 3);
const m1 = bandMeanK(RESTAURANTS_LONDON, 1)!, m3 = bandMeanK(RESTAURANTS_LONDON, 3)!, m8 = bandMeanK(RESTAURANTS_LONDON, 8)!, m9 = bandMeanK(RESTAURANTS_LONDON, 9)!;
check("the mean stops where uptoBand says: restaurants over 1, 3, 8 and 9 bands equal Python's (mean, lower bound, upper bound)",
  near(m1.k, 19.54325168564633) && m1.lo === 0 && m1.hi === 50 && near(m3.k, 119.25311819535328) && near(m3.lo, 72.10884353741497) && near(m3.hi, 183.33333333333334)
  && near(m8.k, 716.8792695062162) && near(m8.lo, 474.53255963894264) && near(m8.hi, 1032.0760799484203) && near(m9.k, 948.071971736851) && near(m9.lo, 565.7726692209451) && near(m9.hi, 1501.117496807152));
check("uptoBand 0 and 2.5 are refused", refuses(() => bandMeanK(RESTAURANTS_LONDON, 0)) && refuses(() => bandMeanK(RESTAURANTS_LONDON, 2.5)));
const ten = (bad: unknown) => [bad, 0, 0, 0, 0, 0, 0, 0, 0, 10] as unknown as number[];
check("a count under zero by any amount, and an eleventh count, are refused by all three",
  [ten(-0.5), ten(-1e-9), [...RESTAURANTS_LONDON, 1]].every((c) => refuses(() => bandQuantile(c, 0.1)) && refuses(() => bandCdf(c, 100)) && refuses(() => bandMeanK(c))));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/pnl/banded: all pass");
