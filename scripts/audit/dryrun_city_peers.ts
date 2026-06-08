/**
 * THROWAWAY DRY-RUN: "cities like this" peer comparison.
 *
 * Founder-review + correctness tool for the city page's peer-comparison section
 * (src/components/cities/CityPeers.tsx, fed by src/lib/scores/city_peers.ts). NOT
 * wired into the app, NOT a production helper. Reads ONLY the local city record,
 * the comparable-cities selector, the country economics snapshot accessor, and
 * the pure city score. NEVER touches the database.
 *
 * What it does
 * ------------
 * For a representative set of seed cities, it builds each seed's peers through
 * the EXACT production path the page uses (buildCityPeers), prints each seed's
 * chosen peers with each peer's own 0-100 city score and band, and asserts the
 * invariants the surface relies on:
 *
 *   - peers EXCLUDE the seed itself
 *   - peers are DISTINCT (no slug appears twice in one seed's list)
 *   - AT MOST ONE per country (the selector's de-dupe holds end to end)
 *   - COUNT <= 3 (the requested limit is respected)
 *   - every peer score is either NULL (a thin peer the score refuses to rate) or
 *     an INTEGER in 0..100 (no NaN, nothing out of range)
 *
 * A null score is legal by design (a thin peer renders without a badge), so it is
 * NOT a failure; only a non-null, non-integer, or out-of-range score fails.
 *
 * Run: npx tsx scripts/audit/dryrun_city_peers.ts
 */
import { buildCityPeers, type CityPeer } from "@/lib/scores/city_peers";

// A deliberate spread: deep rich metros, a couple of mid metros, and smaller /
// cheaper ones, so the chosen peers and their scores are easy to eyeball.
const SEEDS = [
  "london",
  "new-york",
  "paris",
  "tokyo",
  "barcelona",
  "austin",
  "lisbon",
];

const LIMIT = 3;

type Failure = { seed: string; reason: string };
const failures: Failure[] = [];

function fmtPeer(p: CityPeer): string {
  const badge =
    p.score == null || p.band == null
      ? "score pending"
      : `${p.score} ${p.band}`;
  return `${p.name} (${p.iso2}, ${p.continent}) -> /cities/${p.slug}  [${badge}]`;
}

console.log("");
console.log(
  "CITY PEERS: dry-run of the city-page peer comparison (peers by economic similarity, each with its own 0-100 city score, each linking to that peer's city page).",
);
console.log(
  "Selection: getComparableCities (similar scale + wealth, different-country preference, max one per country). Score: buildCityScore, the same path the city masthead uses.",
);
console.log("=".repeat(96));

for (const seed of SEEDS) {
  const peers = buildCityPeers(seed, LIMIT);

  console.log("");
  console.log(`SEED: ${seed}  (${peers.length} peer${peers.length === 1 ? "" : "s"})`);
  if (peers.length === 0) {
    console.log("  (no peers resolved)");
  }
  for (const p of peers) {
    console.log(`  - ${fmtPeer(p)}`);
  }

  // -- assertions ----------------------------------------------------------

  // count <= 3
  if (peers.length > LIMIT) {
    failures.push({ seed, reason: `count ${peers.length} > limit ${LIMIT}` });
  }

  // peers exclude the seed
  if (peers.some((p) => p.slug === seed)) {
    failures.push({ seed, reason: `peer list includes the seed slug "${seed}"` });
  }

  // peers are distinct (by slug)
  const slugs = peers.map((p) => p.slug);
  if (new Set(slugs).size !== slugs.length) {
    failures.push({ seed, reason: `duplicate peer slug(s): ${slugs.join(", ")}` });
  }

  // at most one per country (by iso2)
  const isos = peers.map((p) => p.iso2);
  if (new Set(isos).size !== isos.length) {
    failures.push({
      seed,
      reason: `more than one peer per country: ${isos.join(", ")}`,
    });
  }

  // every score is null OR an integer in 0..100
  for (const p of peers) {
    if (p.score == null) continue; // a thin peer is legal (renders without a badge)
    if (
      !Number.isInteger(p.score) ||
      !Number.isFinite(p.score) ||
      p.score < 0 ||
      p.score > 100
    ) {
      failures.push({
        seed,
        reason: `peer ${p.slug} has an invalid score: ${p.score}`,
      });
    }
    // A non-null score must carry a band, and vice versa, so the badge is coherent.
    if (p.band == null) {
      failures.push({
        seed,
        reason: `peer ${p.slug} has a score (${p.score}) but a null band`,
      });
    }
  }
}

console.log("");
console.log("=".repeat(96));

// Aggregate integrity read across every seed's peers.
const allPeers = SEEDS.flatMap((s) => buildCityPeers(s, LIMIT));
const scored = allPeers.filter((p) => p.score != null).length;
const pending = allPeers.length - scored;
console.log(
  `Seeds: ${SEEDS.length}  |  Total peers: ${allPeers.length}  |  Scored: ${scored}  |  Score pending (null): ${pending}`,
);

if (failures.length === 0) {
  console.log(
    "PASS: every seed's peers exclude the seed, are distinct, at most one per country, count <= 3, and every score is null or a 0..100 integer.",
  );
} else {
  console.log(`FAIL: ${failures.length} assertion failure(s):`);
  for (const f of failures) {
    console.log(`  - [${f.seed}] ${f.reason}`);
  }
}
console.log("");

// Non-zero exit on failure so CI / a caller can gate on it.
if (failures.length > 0) {
  process.exit(1);
}
