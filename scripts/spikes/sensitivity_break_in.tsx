/**
 * scripts/spikes/sensitivity_break_in.tsx , how much does the break-in word
 * move when its inputs move?
 *
 * WHY. The founder's own example of the problem: "how hard is restaurant
 * industry in a shithole city, we need objective data not some slaps like that".
 * The site prints one of four words (forgiving, manageable, demanding, brutal)
 * and a 0-100 score from src/lib/scores/break_in_rating.ts. This asks the only
 * question that decides whether that word is a measurement or a slap: if an
 * input is wrong by 10 percent, which is well inside the error of any of them,
 * does the printed word change?
 *
 * A label that flips under noise smaller than the error in its own inputs is
 * fiction, and the flip rate is the evidence. 08-CLAIMS-AND-INDICES.md.
 *
 * THE MECHANISM BEING TESTED, read from the module rather than assumed:
 *   payback years = (startup + permits) / annual owner take-home
 *   three sub-scores off piecewise-linear anchor curves, then
 *   score = 0.58*payback + 0.24*speed + 0.18*room, rounded, clamped 0..100
 *   band  = >=78 forgiving, >=60 manageable, >=40 demanding, else brutal
 *   a missing speed or room input does NOT omit: it substitutes a neutral 50,
 *     which is a DEFENSIVE fallback: production callers pass a modeled value
 *     rather than null, so that path is measured here as the weight of the
 *     fallback, not as live behaviour
 *
 * BLIND SPOTS.
 *   1. The grid is a plausible spread of inputs, not the live distribution of
 *      cells. It cannot say what fraction of PUBLISHED pages are fragile, only
 *      how fragile the function is across the space it is used on. Reading the
 *      live distribution needs the database and is a separate tick.
 *   2. It perturbs one input at a time. Real errors arrive together and can
 *      cancel as easily as compound.
 *   3. It measures the score's stability, never whether the score measures
 *      difficulty. A perfectly stable number can still be the wrong idea.
 *
 * Run: npx tsx scripts/spikes/sensitivity_break_in.tsx
 */
import {
  computeBreakInRating,
  type BreakInBand,
} from "../../src/lib/scores/break_in_rating";

const TAKE_HOME = [25_000, 40_000, 55_000, 75_000, 100_000, 140_000, 200_000];
const STARTUP = [30_000, 60_000, 100_000, 160_000, 250_000, 400_000, 600_000];
const WEEKS = [3, 8, 14, 20, 30, 52];
const DENSITY = [2, 5, 9, 14, 22, 35];

type Cell = {
  takeHome: number;
  startup: number;
  weeks: number;
  density: number;
  score: number;
  band: BreakInBand;
};

function rate(takeHome: number, startup: number, weeks: number, density: number) {
  return computeBreakInRating({
    annualOwnerTakeHomeUsd: takeHome,
    startupCapitalUsd: startup,
    permitsUsd: 0,
    timeToOpenWeeks: weeks,
    densityPer10k: density,
    restsOnModeled: true,
  });
}

function main() {
  const cells: Cell[] = [];
  for (const takeHome of TAKE_HOME)
    for (const startup of STARTUP)
      for (const weeks of WEEKS)
        for (const density of DENSITY) {
          const r = rate(takeHome, startup, weeks, density);
          if (r) cells.push({ takeHome, startup, weeks, density, score: r.score, band: r.band });
        }

  const bandCount: Record<string, number> = {};
  for (const c of cells) bandCount[c.band] = (bandCount[c.band] ?? 0) + 1;

  /* One input at a time, up and down, at two magnitudes. A flip is the PRINTED
     WORD changing, which is what a reader takes away. */
  const inputs = ["takeHome", "startup", "weeks", "density"] as const;
  const results: Record<string, Record<number, number>> = {};
  for (const key of inputs) results[key] = { 10: 0, 20: 0 };

  let anyFlip10 = 0;
  let anyFlip20 = 0;

  for (const c of cells) {
    let flipped10 = false;
    let flipped20 = false;
    for (const key of inputs) {
      for (const pct of [10, 20]) {
        let flips = false;
        for (const dir of [1, -1]) {
          const f = 1 + (dir * pct) / 100;
          const r = rate(
            key === "takeHome" ? c.takeHome * f : c.takeHome,
            key === "startup" ? c.startup * f : c.startup,
            key === "weeks" ? c.weeks * f : c.weeks,
            key === "density" ? c.density * f : c.density,
          );
          if (r && r.band !== c.band) flips = true;
        }
        if (flips) {
          results[key][pct]++;
          if (pct === 10) flipped10 = true;
          else flipped20 = true;
        }
      }
    }
    if (flipped10) anyFlip10++;
    if (flipped20) anyFlip20++;
  }

  /* The neutral-50 substitution: what does the score do when an input the page
     does not hold is simply absent? This is not noise, it is a value the module
     invents, so its effect is worth its own number. */
  let missingSpeedShift = 0;
  let missingSpeedFlip = 0;
  let missingBothShift = 0;
  let missingBothFlip = 0;
  for (const c of cells) {
    const noSpeed = computeBreakInRating({
      annualOwnerTakeHomeUsd: c.takeHome,
      startupCapitalUsd: c.startup,
      permitsUsd: 0,
      timeToOpenWeeks: null,
      densityPer10k: c.density,
      restsOnModeled: true,
    });
    if (noSpeed) {
      missingSpeedShift += Math.abs(noSpeed.score - c.score);
      if (noSpeed.band !== c.band) missingSpeedFlip++;
    }
    const noBoth = computeBreakInRating({
      annualOwnerTakeHomeUsd: c.takeHome,
      startupCapitalUsd: c.startup,
      permitsUsd: 0,
      timeToOpenWeeks: null,
      densityPer10k: null,
      restsOnModeled: true,
    });
    if (noBoth) {
      missingBothShift += Math.abs(noBoth.score - c.score);
      if (noBoth.band !== c.band) missingBothFlip++;
    }
  }

  const pct = (n: number) => `${((n / cells.length) * 100).toFixed(1)}%`;

  console.log(`\nBREAK-IN RATING SENSITIVITY, ${cells.length} input combinations\n`);
  console.log("band distribution across the grid:");
  for (const [b, n] of Object.entries(bandCount)) console.log(`  ${b.padEnd(12)} ${String(n).padStart(5)}  ${pct(n)}`);

  console.log("\nprinted WORD changes when ONE input moves:");
  console.log("  input        +/-10%          +/-20%");
  for (const key of inputs) {
    console.log(
      `  ${key.padEnd(10)} ${String(results[key][10]).padStart(5)} ${pct(results[key][10]).padStart(7)}  ${String(results[key][20]).padStart(5)} ${pct(results[key][20]).padStart(7)}`,
    );
  }
  console.log(`\n  ANY single input at 10%: ${anyFlip10} of ${cells.length} = ${pct(anyFlip10)}`);
  console.log(`  ANY single input at 20%: ${anyFlip20} of ${cells.length} = ${pct(anyFlip20)}`);

  console.log("\nthe neutral-50 substitution when an input is absent:");
  console.log(
    `  time-to-open absent:      mean score shift ${(missingSpeedShift / cells.length).toFixed(1)} points, band changes ${missingSpeedFlip} = ${pct(missingSpeedFlip)}`,
  );
  console.log(
    `  time AND density absent:  mean score shift ${(missingBothShift / cells.length).toFixed(1)} points, band changes ${missingBothFlip} = ${pct(missingBothFlip)}`,
  );
  console.log(
    "\nThis measures the function's stability across a plausible grid, not the live distribution of published cells, and never whether the score measures difficulty at all.",
  );
}

main();
