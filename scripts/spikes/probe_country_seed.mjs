/**
 * scripts/spikes/probe_country_seed.mjs , what does buildSpineCountrySeed
 * actually return, for a rich country and for two thin ones?
 *
 * WHY. The country adapter is the most load-bearing code of the rebuild: a
 * wrong number here ships to a reader under the founder's name. A typecheck
 * proves the shape compiles; only running it over real countries proves that
 * the figures are real, that the tags are honest, and that a country holding
 * none of the inputs SELF-OMITS rather than printing a hole or a zero.
 *
 * WHAT IT CANNOT SEE, stated before it is quoted:
 *   1. It reads the seed, never a pixel. It cannot tell that a section task
 *      later renders one of these fields in the wrong place or with the wrong
 *      label.
 *   2. It proves a figure came from a module, never that the module's figure is
 *      right about the world.
 *   3. Three countries are not a coverage census. Coverage counts belong to the
 *      inventory, which ran the real accessors over all 195.
 *
 * Run:
 *   set -a; . ./.env.local >/dev/null 2>&1; set +a
 *   npx tsx scripts/spikes/probe_country_seed.mjs
 */
import { buildSpineCountrySeed } from "@/lib/spine/adapt_country";

/** GB is the exemplar; AL holds rates but no cities; TD holds neither. */
const SUBJECTS = ["gb", "al", "td"];

function short(v) {
  if (v == null) return "undefined";
  if (Array.isArray(v)) return `[${v.length}]`;
  if (typeof v === "object") return "{...}";
  if (typeof v === "string") return v.length > 72 ? `${v.slice(0, 69)}...` : v;
  return String(v);
}

function printBlock(name, block) {
  if (block == null) {
    console.log(`  ${name.padEnd(12)} SELF-OMITTED`);
    return;
  }
  const conf = block._meta ? block._meta.confidence : "NO _meta (DEFECT)";
  const keys = Object.keys(block).filter((k) => k !== "_meta");
  console.log(`  ${name.padEnd(12)} confidence=${String(conf).padEnd(12)} keys=${keys.join(", ")}`);
  for (const k of keys) {
    const v = block[k];
    if (Array.isArray(v)) {
      console.log(`      ${k}: ${v.length} row(s)`);
      for (const row of v.slice(0, 8)) {
        if (row && typeof row === "object") {
          const parts = Object.entries(row)
            .filter(([, x]) => x != null && typeof x !== "object")
            .map(([kk, xx]) => `${kk}=${short(xx)}`);
          console.log(`        - ${parts.join("  ")}`);
        } else {
          console.log(`        - ${short(row)}`);
        }
      }
    } else if (v && typeof v === "object") {
      const parts = Object.entries(v).map(([kk, xx]) => `${kk}=${short(xx)}`);
      console.log(`      ${k}: ${parts.join("  ")}`);
    } else {
      console.log(`      ${k}: ${short(v)}`);
    }
  }
}

let defects = 0;

for (const iso of SUBJECTS) {
  const seed = await buildSpineCountrySeed(iso);
  console.log(`\n================ ${iso.toUpperCase()} ================`);
  if (!seed) {
    console.log("  seed: undefined (no such country in the taxonomy)");
    continue;
  }
  for (const [name, block] of Object.entries(seed)) {
    printBlock(name, block);
    if (block != null && (block._meta == null || block._meta.confidence == null)) {
      console.log(`  !! ${name} carries no _meta.confidence`);
      defects += 1;
    }
  }
  const takeVal = seed.hero ? seed.hero.government_take_pct : undefined;
  const cityCount = seed.cities ? seed.cities.list.length : 0;
  const mapCount = seed.cities && seed.cities.map_points ? seed.cities.map_points.length : 0;
  const funnel = seed.money ? `${seed.money.coverage.resolved} of ${seed.money.coverage.attempted}` : "block omitted";
  console.log(
    `  HEADLINE: government take=${takeVal == null ? "omitted" : takeVal + "%"}` +
      `  cities=${cityCount} (map points ${mapCount})  funnel=${funnel}`,
  );
}

/* A zero anywhere in a money field is the failure mode this probe exists to
   catch: an omitted figure must be ABSENT, never rendered as nothing-shaped-
   like-a-number. Walks every block for a numeric zero on a money or rate key. */
const MONEYISH = /_usd|_pct|keeps_|cost_|rate|days/;
for (const iso of SUBJECTS) {
  const seed = await buildSpineCountrySeed(iso);
  if (!seed) continue;
  const walk = (node, path) => {
    if (node == null || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      if (typeof v === "number" && v === 0 && MONEYISH.test(k)) {
        // A genuine zero fee (registering free) is real and must survive; flag
        // it for a human read rather than failing on it.
        console.log(`  NOTE ${iso}: zero at ${path}.${k} (real free/zero, or a hole?)`);
      }
      if (v && typeof v === "object") walk(v, `${path}.${k}`);
    }
  };
  walk(seed, iso);
}

console.log(`\nBLOCKS MISSING _meta.confidence: ${defects}`);
process.exit(defects === 0 ? 0 : 1);
