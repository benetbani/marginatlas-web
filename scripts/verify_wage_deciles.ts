/**
 * scripts/verify_wage_deciles.ts
 *
 * The other half of notation N9. verify_no_quartile_words.mjs proves the banned
 * WORDS never render; this gate proves the numbers under the permitted words
 * are real.
 *
 * The founder's ruling of 2026-08-30, verbatim: "we should seek to find the
 * average, the top ten percent and the bottom ten percent. Instead you are just
 * saying the lower quarter or the upper quarter... that's not very helpful."
 * The trap that ruling sets is obvious once named: the cheapest way to satisfy
 * it is to relabel the quartiles, or to fit a curve through them, and call the
 * result a decile. Both produce a number no one measured. So the chain is
 * closed from the other end here: a decile may reach the country page ONLY as
 * the product of this country's own median and a dispersion ratio that a named
 * source published, and this gate recomputes that product and refuses any
 * profile figure it cannot reproduce.
 *
 * Rules:
 *   R1. Every entry's ratios sit inside the file's declared bounds.
 *   R2. Every entry carries confidence in {held, modeled}. "placeholder" is
 *       forbidden outright: an unsourced country simply has no entry.
 *   R3. Every entry names a source and an as-of period.
 *   R4. Every profile decile reproduces from the research: recomputing
 *       median x ratio must match the stored figure. A hand-edited profile
 *       fails here, and so does research that was changed without rerunning
 *       scripts/data/apply_wage_deciles.ts.
 *   R5. No profile row carries a decile with no research behind it. This is
 *       the anti-fabrication rule proper.
 *   R6. Every filled row is ordered: p10 < median < p90.
 *   R7. A row carries both deciles or neither. Half a spread cannot be drawn.
 *
 * Run: npx tsx scripts/verify_wage_deciles.ts
 * Exit 0 = pass, exit 1 = fail.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DECILES_PATH = path.resolve(ROOT, "data/economics/wage_deciles_v1.json");
const PROFILE_PATH = path.resolve(ROOT, "data/economic_indicators/country_profile_v2.json");

type DecileRecord = {
  d1_over_d5: number;
  d9_over_d5: number;
  _meta?: { confidence?: string; source?: string; as_of?: string; method?: string };
};
type DecileFile = {
  quality_checks: Record<string, number | string>;
  countries: Record<string, DecileRecord>;
};
type Profile = {
  median_wage_full_time_usd: number;
  wage_p10_usd?: number;
  wage_p90_usd?: number;
};

const deciles = JSON.parse(fs.readFileSync(DECILES_PATH, "utf-8")) as DecileFile;
const profileFile = JSON.parse(fs.readFileSync(PROFILE_PATH, "utf-8")) as {
  countries: Record<string, Profile>;
};

/* THE BOUNDS THE DATA DECLARES FOR ITSELF, intersected with this gate's own, so
 * a declared bound can only ever tighten and never loosen. The same reasoning
 * as verify_wage_source_consistency.ts: a blanket "adopt the declared bounds"
 * would let a future edit to the data file widen its own goalposts. */
const declared = deciles.quality_checks ?? {};
const num = (v: unknown, fallback: number) => (typeof v === "number" ? v : fallback);
const MIN_D1 = Math.max(0.25, num(declared.min_d1_over_d5, 0));
const MAX_D1 = Math.min(0.95, num(declared.max_d1_over_d5, Infinity));
const MIN_D9 = Math.max(1.15, num(declared.min_d9_over_d5, 0));
const MAX_D9 = Math.min(4.0, num(declared.max_d9_over_d5, Infinity));
const VALID_CONFIDENCE = new Set(["held", "modeled"]);

const messages: string[] = [];
let failures = 0;
const fail = (m: string) => {
  messages.push(m);
  failures++;
};

console.log("=== verify_wage_deciles ===");

// R1 to R3: the research itself.
for (const [iso, rec] of Object.entries(deciles.countries)) {
  const { d1_over_d5: d1, d9_over_d5: d9 } = rec;
  if (typeof d1 !== "number" || typeof d9 !== "number") {
    fail(`[${iso}] ratios are not both numbers`);
    continue;
  }
  if (d1 < MIN_D1 || d1 > MAX_D1) fail(`[${iso}] d1_over_d5=${d1} outside [${MIN_D1}, ${MAX_D1}]`);
  if (d9 < MIN_D9 || d9 > MAX_D9) fail(`[${iso}] d9_over_d5=${d9} outside [${MIN_D9}, ${MAX_D9}]`);
  const conf = rec._meta?.confidence;
  if (!conf || !VALID_CONFIDENCE.has(conf)) {
    fail(`[${iso}] confidence="${conf ?? "missing"}" not in {held, modeled}`);
  }
  if (!rec._meta?.source || rec._meta.source.trim().length < 20) {
    fail(`[${iso}] names no source`);
  }
  if (!rec._meta?.as_of) fail(`[${iso}] names no as-of period`);
}

// R4 to R7: the profile against the research.
let filled = 0;
for (const [iso, profile] of Object.entries(profileFile.countries)) {
  const hasP10 = typeof profile.wage_p10_usd === "number";
  const hasP90 = typeof profile.wage_p90_usd === "number";
  if (!hasP10 && !hasP90) continue;
  if (hasP10 !== hasP90) {
    fail(`[${iso}] carries half a spread; a row holds both deciles or neither`);
    continue;
  }
  filled++;
  const rec = deciles.countries[iso];
  if (!rec) {
    fail(`[${iso}] carries deciles with NO research behind them (fabrication rule)`);
    continue;
  }
  const median = profile.median_wage_full_time_usd;
  const expectP10 = Math.round(median * rec.d1_over_d5);
  const expectP90 = Math.round(median * rec.d9_over_d5);
  if (profile.wage_p10_usd !== expectP10) {
    fail(`[${iso}] wage_p10_usd=${profile.wage_p10_usd} does not reproduce from research (expected ${expectP10}); rerun apply_wage_deciles`);
  }
  if (profile.wage_p90_usd !== expectP90) {
    fail(`[${iso}] wage_p90_usd=${profile.wage_p90_usd} does not reproduce from research (expected ${expectP90}); rerun apply_wage_deciles`);
  }
  if (!(profile.wage_p10_usd! < median && median < profile.wage_p90_usd!)) {
    fail(`[${iso}] ordering fails: ${profile.wage_p10_usd} / ${median} / ${profile.wage_p90_usd}`);
  }
}

console.log(
  `  ${Object.keys(deciles.countries).length} countries researched, ${filled} carrying a drawn spread.`,
);

if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations)`);
  for (const m of messages.slice(0, 30)) console.log("  - " + m);
  process.exit(1);
}
console.log("  Every decile on the profile reproduces from a sourced ratio and its own median.");
console.log("\n  GATE: PASS");
