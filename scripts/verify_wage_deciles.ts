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
 *   R8. A filled row's p10 sits at or above that country's own annual wage
 *       floor, because the country page prints BOTH.
 *
 * ============ R8, ADDED 2026-09-03 WHILE REFUSING QUEUE ROW C30 ==============
 *
 * R6 orders the three marks against each other. It cannot see the fourth wage
 * figure the same PAGE prints: the hiring card's "Wage floor", which is
 * `minimum_wage_annual_usd` from the profile, drawn about thirteen hundred
 * pixels below the customers card's bracket. Nothing in this repo joined the
 * two files, and joining them says that on **7 of the 47 countries that render
 * both cards, the page states a bottom tenth of FULL-TIME pay BELOW the legal
 * annual minimum it states elsewhere.** Australia prints "Bottom tenth $37K"
 * against "Wage floor $42K", a 10.3 percent contradiction a reader can see and
 * the page never explains. Croatia is 11.4 percent and Argentina 11.1.
 *
 * IT IS A CROSS-FILE ARTIFACT AND THE DECILE FILE PREDICTED ITS CLASS. p10 is
 * this country's own median multiplied by a measured dispersion ratio, and that
 * file's own convention says in as many words that "a published p10 in local
 * currency belongs to that source's own population, period and exchange rate"
 * while the median is separately normalised. The minimum wage is a third
 * research line again. So the ratio can be right, the median can be right and
 * the floor can be right, and the PAIR can still print in an impossible order.
 * The decile file's `quality_checks` are explicitly "a unit-error trap, not a
 * plausibility opinion", and this trap is one rung below them.
 *
 * WHY A NAMED LIST RATHER THAN A COUNT, and why the gate does not fix the seven.
 * Choosing which of two researched sources yields is a data decision that needs
 * re-sourcing, not a design edit, and every alternative available inside the
 * page is worse: clamping p10 to the floor fabricates a figure; withholding the
 * bracket removes a founder-visible drawing from the United Kingdom over a 0.9
 * percent gap; a sentence beside the chart is banned by rulebook 26. So the
 * seven are named with the gap each had when they were found, an EIGHTH cannot
 * arrive unseen, a listed gap cannot GROW, and a country that gets fixed fails
 * this gate until it is struck from the list, so the list can only shrink.
 * Queue row C52 owns the data decision.
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
  minimum_wage_annual_usd?: number;
};

/* R8's named list. The value is the shortfall as a percentage of the floor,
 * measured on 2026-09-03 with scratchpad/loop20/c30_p10_vs_floor.mjs and stored
 * to one decimal. NEVER RAISE A NUMBER HERE: a growing gap is a new fault in an
 * old country and this gate exists to say so. Removing a line is the only edit
 * that needs no argument. */
const P10_BELOW_FLOOR: Record<string, number> = {
  HR: 11.4,
  AR: 11.1,
  AU: 10.3,
  LV: 8.5,
  CA: 5.7,
  GB: 0.9,
  IL: 0.8,
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

// R4 to R8: the profile against the research, and against the page's own floor.
let filled = 0;
let belowFloor = 0;
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

  /* R8. The fourth wage figure, from the card thirteen hundred pixels below. */
  const floor = profile.minimum_wage_annual_usd;
  if (typeof floor === "number" && floor > 0) {
    const p10 = profile.wage_p10_usd!;
    const listed = P10_BELOW_FLOOR[iso];
    if (p10 < floor) {
      const gap = Math.round(((floor - p10) / floor) * 1000) / 10;
      belowFloor++;
      if (listed === undefined) {
        fail(
          `[${iso}] R8: the bottom tenth of full-time pay (${p10}) is ${gap}% BELOW this country's own annual wage floor (${floor}), and the country page prints both. A new one: fix the source, or add it to P10_BELOW_FLOOR with its reason and a queue row`,
        );
      } else if (gap > listed) {
        fail(
          `[${iso}] R8: a listed shortfall GREW, ${listed}% to ${gap}%. A baseline in this file is never raised`,
        );
      }
    } else if (listed !== undefined) {
      fail(
        `[${iso}] R8: listed in P10_BELOW_FLOOR at ${listed}% and the figures no longer contradict. Strike the line; the list only shrinks`,
      );
    }
  }
}

console.log(
  `  ${Object.keys(deciles.countries).length} countries researched, ${filled} carrying a drawn spread.`,
);
console.log(
  `  R8: ${belowFloor} of them state a bottom tenth below their own wage floor, all ${Object.keys(P10_BELOW_FLOOR).length} named in P10_BELOW_FLOOR (queue row C52 owns the data decision).`,
);

if (failures > 0) {
  console.log(`\n  GATE: FAIL  (${failures} violations)`);
  for (const m of messages.slice(0, 30)) console.log("  - " + m);
  process.exit(1);
}
console.log("  Every decile on the profile reproduces from a sourced ratio and its own median.");
console.log("\n  GATE: PASS");
