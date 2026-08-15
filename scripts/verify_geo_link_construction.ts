/**
 * scripts/verify_geo_link_construction.ts
 *
 * A URL ASSEMBLED FROM PARTS IS NOT A URL THAT RESOLVES.
 *
 * On 2026-08-01 seven live link defects were found and repaired in four
 * iterations, and every one of them was the same move: a path built by pasting
 * slugs together rather than resolved against something that exists.
 *
 *   - the cell page's breadcrumb built the two-segment place URL. Of 290 of
 *     those pairs, 248 resolve to nothing.
 *   - the country crumb built the one-segment URL from the code the statistics
 *     carry. Greece is held as EL there and as GR in COUNTRIES, so every Greek
 *     page had a first step that has never resolved.
 *   - two components emitted up to eight and three unchecked URLs per page.
 *   - the neighbourhood onward nav and the spine-2 doors did the same.
 *   - and the worst of them did not 404 at all. "All of New York" opened the
 *     two-segment URL, which is New York STATE, FIPS 36, 27,381 enterprises,
 *     not New York City. One slug names a city in one list and a state in
 *     another, and the reader is handed another place's data with nothing to
 *     notice.
 *
 * ALL SEVEN PASSED THE EXISTING DEAD-LINK GATE, for two structural reasons.
 * find_dead_links matches only a quoted literal path and skips anything with an
 * interpolation in it, which is how every one of these was written. And it
 * checks route SHAPE, so a well-formed two-segment path passes whether or not
 * it names the place the link says it names.
 *
 * WHAT MAKES THESE TWO SHAPES SPECIAL. Almost every route on this site takes
 * whatever segment it is given. These two do not:
 *
 *   /{country}       calls notFound() unless the segment is in COUNTRIES
 *   /{country}/{geo} calls notFound() unless the segment is in
 *                    getRegionsForCountry(iso2), which is REGIONS only: US
 *                    states, a country's admin1 entities where a manifest
 *                    exists, and otherwise one synthesized whole-country slug
 *
 * Neither list is what the surrounding code usually has in hand. A page holding
 * a city, a cell geo_id or a statistics country code has none of them, so
 * pasting that value into either shape is a guess. src/lib/cells/related_links.ts
 * exports resolveGeoPage and countryPagePath, which answer both questions
 * against the same lists the routes check, and return null when the honest
 * answer is that no page exists.
 *
 * -----------------------------------------------------------------------------
 * WHAT THIS GATE CHECKS
 *
 * 1. CONSTRUCTION. Every template-literal path in src/ that lands in the
 *    [country] route tree at depth one or two and interpolates any segment.
 *    That is the dangerous construction, whoever writes it and whatever it
 *    happens to produce today. Sanctioned entries are listed below with a
 *    reason each; everything else is recorded in a baseline and the gate fails
 *    when the set GROWS. This is the point of the gate: it fires when someone
 *    writes the construction, not when a particular URL is currently wrong.
 *
 * 2. COLLISION. Every slug that names a city in the city list AND a region in
 *    the region list of the same country. Independent of who links it, that
 *    slug is a live trap: the two-segment URL serves the region, and any code
 *    that assembles it meaning the city silently gets somewhere else.
 *
 * 3. SHAPE. Every template-literal path, at any depth, masked to a route
 *    pattern, must match some route in src/app/. This catches a wrong depth or
 *    a wrong literal segment in exactly the constructions find_dead_links skips.
 *
 * WHAT IT CANNOT SEE, and this is the honest limit of a static scan. The
 * RUNTIME VALUE of an interpolation is unknowable here. This gate can never say
 * that a particular assembled path is wrong, only that the code assembled one
 * without asking. Two consequences worth stating plainly: a construction listed
 * as known below may be perfectly correct at runtime, and a sanctioned
 * construction could still be handed a bad value. The rule is about the
 * MOVE, not about the string.
 *
 * Three narrower blind spots: a path built by string concatenation rather than
 * a template literal; a path whose country segment is supplied entirely by an
 * interpolation that itself carries more segments; and a value that is correct
 * in every case but one, which is what the Greek code was.
 *
 * STATE. Check 1 does not reach zero today and check 2 cannot, because live
 * constructions remain and the instruction for this iteration was to build the
 * instrument, not repair the findings. So both run as RATCHETS against
 * scripts/geo_link_construction_baseline.json: a new construction or a new
 * collision fails the build, a removed one is reported as an improvement. Pass
 * --strict to demand zero, which is the mode to register once the repairs land.
 *
 * Run:     npx tsx scripts/verify_geo_link_construction.ts
 * Strict:  npx tsx scripts/verify_geo_link_construction.ts --strict
 * Reseed:  npx tsx scripts/verify_geo_link_construction.ts --update-baseline
 *          (only after a repair genuinely removes entries; never to silence a
 *           new one)
 */
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { resolve, relative, join } from "node:path";
import { COUNTRIES } from "../src/lib/taxonomy";
import { getRegionsForCountry } from "../src/lib/regions/regions-by-country";
import cityListJson from "../data/cities/city_list_v1.json";

const ROOT = process.cwd();
const SRC = resolve(ROOT, "src");
const APP = resolve(SRC, "app");
const BASELINE_PATH = resolve(ROOT, "scripts/geo_link_construction_baseline.json");
const STRICT = process.argv.includes("--strict");
const UPDATE = process.argv.includes("--update-baseline");

const BACKTICK = String.fromCharCode(96);

/**
 * The module that owns the two resolvers. Its own emissions are the definitions
 * of the sanctioned answer, so they cannot be measured against themselves.
 */
const RESOLVER_MODULE = "src/lib/cells/related_links.ts";

/**
 * Constructions that are provably not the defect, each with the reason it is
 * not. Keyed on file plus the masked path, so a line move does not churn this
 * list and a genuinely new construction cannot inherit an old exemption.
 *
 * THE BAR FOR AN ENTRY HERE, and it is deliberately high: the value must come
 * at RUNTIME from the exact list the destination route checks, in code that was
 * read. A hardcoded array of codes does not qualify, however obviously correct
 * it looks today, because a list of data can drift without any resolver
 * noticing. That is precisely what the Greek case was: a code that arrived from
 * a dataset rather than from COUNTRIES, correct in 194 cases and wrong in one.
 *
 * `guard` is the text in the file that makes the claim true. If it disappears,
 * the exemption lapses and the construction goes back to being unproven, so a
 * refactor that removes the check cannot leave a stale sanction behind.
 */
const SANCTIONED: Array<{ file: string; path: string; guard: string; why: string }> = [
  {
    file: "src/lib/geo/page_targets.ts",
    path: "/*",
    guard: "COUNTRIES.find((c) => c.code === iso2)",
    why:
      "THIS IS THE RESOLVER. It is the one place allowed to build a country URL, " +
      "because it only does so after checking membership in COUNTRIES, which is " +
      "the same list the /[country] route gates on. Greece is why that check " +
      "exists: the country is held as GR, so every /el link ever emitted was dead.",
  },
  {
    file: "src/lib/geo/page_targets.ts",
    path: "/*/*",
    guard: "getRegionsForCountry(iso2, meta.name).find",
    why:
      "THIS IS THE RESOLVER. The two-segment form is built only after the slug " +
      "is found in that country's own region list, which is the list the region " +
      "route itself checks. A city is tried first and returns the /cities/ form, " +
      "because the region route 404s for a city slug.",
  },
  {
    file: "src/components/spine/hood/hood-view.tsx",
    path: "/*/*",
    guard: "cityIso2 && citySlug",
    why:
      "The page's own city, passed down to NeighborhoodExplorer so its 'what " +
      "works here' trade links land in the city being read rather than in " +
      "London, which is where all six of them were hardcoded. cityIso2 and " +
      "citySlug come from d.meta, set by the adapter from the route this page " +
      "resolved on, and the same pair already builds the depth-3 trade band " +
      "twenty lines above. Null when either is missing, and the card then " +
      "renders no link at all rather than a link to somewhere else.",
  },
  {
    file: "src/components/spine/cell/cell-view.tsx",
    path: "/*/*",
    guard: "d.meta?.iso2",
    why:
      "Not another place's URL. iso2 and geo are THIS page's own identity, set " +
      "by adapt_cell from the route params it was called with, and the route " +
      "only got here by resolving a real cell for exactly that country and geo. " +
      "So the prefix is the page's own address rather than a slug guessed for " +
      "somewhere else, which is the failure this gate exists to catch. It " +
      "replaced a hardcoded /gb/london, under a heading reading 'Related trades " +
      "in this place', which would have sent every non-London reader to London " +
      "the day adapt_cell starts populating `related`. When meta is absent the " +
      "href is undefined and the row renders as text, never as a wrong place.",
  },
  {
    file: "src/app/(site)/saved/SavedClient.tsx",
    path: "/*",
    guard: "${c.country}/${c.geo}/${c.industry}",
    why:
      "Not a country link at all. The single interpolation is the whole cell key " +
      "built two lines above, so this is the three-segment trade route; the depth " +
      "reads as one only because one expression carries all three segments.",
  },
  {
    file: "src/app/(site)/countries/page.tsx",
    path: "/*",
    guard: "for (const c of COUNTRIES)",
    why: "The value is the code field of a COUNTRIES row being rendered, which is the list the route checks.",
  },
  {
    file: "src/app/(site)/coverage/[iso2]/page.tsx",
    path: "/*",
    guard: "COUNTRIES.find",
    why: "The segment is this page's own param, and the page called notFound() on it failing COUNTRIES lookup.",
  },
  {
    file: "src/app/[country]/page.tsx",
    path: "/*",
    guard: "COUNTRIES.find",
    why:
      "The canonical for this page's own param, emitted after the same function " +
      "called notFound() on it failing COUNTRIES lookup.",
  },
  {
    file: "src/app/[country]/[geo]/page.tsx",
    path: "/*",
    guard: "COUNTRIES.find",
    why: "The country crumb for this page's own param, after the page called notFound() on a COUNTRIES miss.",
  },
  {
    file: "src/app/[country]/[geo]/industries/page.tsx",
    path: "/*",
    guard: "isKnownCountry",
    why:
      "The country crumb for this page's own param, after notFound() on isKnownCountry, " +
      "which is a COUNTRIES membership test in the same file. The two-segment crumb on " +
      "this page is a different matter and is NOT sanctioned.",
  },
  {
    file: "src/components/GlobalSearch.tsx",
    path: "/*",
    guard: "id: c.code",
    why: "The pushed value is the code field of a COUNTRIES row, carried through the result object built in this file.",
  },
  /* REMOVED 2026-08-09: src/app/dev/country/page.tsx was binned as a superseded
     prototype (country2 replaced it). A sanction naming a file that no longer
     exists is a licence nobody revoked, and the next file to land on that path
     would have inherited it silently. This gate has already been bitten by the
     same shape once: on 2026-08-08 it flipped to FAIL because six hand-built geo
     links DISAPPEARED with a deleted file, and the baseline was counting links
     in a file that was gone. Prune the entry when you delete the file. */
];

/* ------------------------------------------------------------------ scanning */

function walkFiles(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkFiles(p, acc);
    else if (p.endsWith(".ts") || p.endsWith(".tsx")) acc.push(p);
  }
  return acc;
}

function walkDirs(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      acc.push(p);
      walkDirs(p, acc);
    }
  }
  return acc;
}

/**
 * Every template literal in a file, with the line it starts on.
 *
 * A hand scanner rather than a regex, because an interpolation can hold braces,
 * slashes and nested template literals, and a regex that copes with one of those
 * silently drops the constructions that use another. Strings and comments are
 * skipped so a path discussed in prose is not read as a path emitted in code.
 */
function templateLiterals(src: string): Array<{ body: string; line: number }> {
  const out: Array<{ body: string; line: number }> = [];
  let i = 0;
  let line = 1;
  const advance = (to: number) => {
    for (let k = i; k < to && k < src.length; k++) if (src[k] === "\n") line++;
    i = to;
  };
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\n") {
      line++;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let k = i + 1;
      while (k < src.length && src[k] !== ch) {
        if (src[k] === "\\") k++;
        else if (src[k] === "\n") break;
        k++;
      }
      advance(k + 1);
      continue;
    }
    if (ch === "/" && src[i + 1] === "/") {
      const nl = src.indexOf("\n", i);
      advance(nl === -1 ? src.length : nl);
      continue;
    }
    if (ch === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      advance(end === -1 ? src.length : end + 2);
      continue;
    }
    if (ch === BACKTICK) {
      const startLine = line;
      const end = scanTemplate(src, i);
      out.push({ body: src.slice(i + 1, end - 1), line: startLine });
      advance(end);
      continue;
    }
    i++;
  }
  return out;
}

/** Index just past the closing backtick of the template literal starting at `from`. */
function scanTemplate(src: string, from: number): number {
  let i = from + 1;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (ch === BACKTICK) return i + 1;
    if (ch === "$" && src[i + 1] === "{") {
      i = scanInterpolation(src, i + 2);
      continue;
    }
    i++;
  }
  return src.length;
}

/** Index just past the closing brace of an interpolation whose body starts at `from`. */
function scanInterpolation(src: string, from: number): number {
  let i = from;
  let depth = 1;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "\\") {
      i += 2;
      continue;
    }
    if (ch === BACKTICK) {
      i = scanTemplate(src, i);
      continue;
    }
    if (ch === '"' || ch === "'") {
      let k = i + 1;
      while (k < src.length && src[k] !== ch) {
        if (src[k] === "\\") k++;
        k++;
      }
      i = k + 1;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
    i++;
  }
  return src.length;
}

/**
 * The template body with every interpolation replaced by a single star.
 *
 * Masking first is what makes the segment count trustworthy: an expression such
 * as a regex replace holds slashes of its own, and counting them would read a
 * three-segment trade URL as eight segments and let the real shape through.
 */
function maskPath(body: string): string | null {
  let out = "";
  let i = 0;
  let interpolations = 0;
  while (i < body.length) {
    if (body[i] === "$" && body[i + 1] === "{") {
      const end = scanInterpolation(body, i + 2);
      out += "*";
      interpolations++;
      i = end;
      continue;
    }
    out += body[i];
    i++;
  }
  if (interpolations === 0) return null;
  return out;
}

/* ------------------------------------------------------- route knowledge */

function hasRouteFile(dir: string): boolean {
  return (
    existsSync(join(dir, "page.tsx")) ||
    existsSync(join(dir, "page.ts")) ||
    existsSync(join(dir, "route.ts")) ||
    existsSync(join(dir, "route.tsx"))
  );
}

/** Route patterns from src/app/, dynamic segments as wildcards. */
function buildRoutePatterns(): RegExp[] {
  const patterns: RegExp[] = [/^\/$/];
  for (const dir of walkDirs(APP)) {
    if (!hasRouteFile(dir)) continue;
    const rel = relative(APP, dir).replace(/\\/g, "/");
    if (!rel) continue;
    const parts = rel
      .split("/")
      .filter((seg) => !(seg.startsWith("(") && seg.endsWith(")")))
      .map((seg) => {
        if (seg.startsWith("[...") || seg.startsWith("[[...")) return "(.+)";
        if (seg.startsWith("[") && seg.endsWith("]")) return "([^/]+)";
        return seg.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
      });
    if (parts.length === 0) continue;
    patterns.push(new RegExp("^/" + parts.join("/") + "$"));
  }
  return patterns;
}

/** Top-level directories that serve a route under their own name. */
function buildStaticTopLevel(): Set<string> {
  const segs = new Set<string>();
  for (const dir of walkDirs(APP)) {
    const rel = relative(APP, dir).replace(/\\/g, "/");
    const parts = rel.split("/").filter((p) => !(p.startsWith("(") && p.endsWith(")")));
    if (parts.length !== 1) continue;
    const name = parts[0];
    if (name.startsWith("[") || name.startsWith("_") || name.startsWith("@")) continue;
    if (hasRouteFile(dir)) segs.add(name);
  }
  return segs;
}

/* ------------------------------ checks 1 and 3: construction, then shape */

type Construction = {
  key: string;
  file: string;
  line: number;
  path: string;
  depth: number;
};

const patterns = buildRoutePatterns();
const staticTop = buildStaticTopLevel();

const constructions: Construction[] = [];
const shapeless: Array<{ file: string; line: number; path: string }> = [];
const sourceByFile = new Map<string, string>();
let pathsSeen = 0;

for (const file of walkFiles(SRC)) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  const src = readFileSync(file, "utf-8");
  sourceByFile.set(rel, src);
  for (const { body, line } of templateLiterals(src)) {
    if (!body.startsWith("/")) continue;
    const masked = maskPath(body);
    if (masked === null) continue;
    if (masked.startsWith("//") || masked.startsWith("/_next") || masked.startsWith("/static")) {
      continue;
    }
    const bare = masked.split("?")[0].split("#")[0];
    const segs = bare.split("/").filter(Boolean);
    if (segs.length === 0) continue;
    pathsSeen++;

    // Shape: mask to a route pattern and demand a route exists at that shape.
    const probe = "/" + segs.map((s) => (s.includes("*") ? "__wild__" : s)).join("/");
    if (!patterns.some((re) => re.test(probe))) {
      shapeless.push({ file: rel, line, path: masked });
    }

    // Construction: does this land in the [country] tree at depth one or two?
    if (segs.length > 2) continue;
    const first = segs[0];
    const firstIsCountryPosition = first.includes("*") || !staticTop.has(first);
    if (!firstIsCountryPosition) continue;
    // A literal second segment names a static child route, not a place.
    if (segs.length === 2 && !segs[1].includes("*")) continue;
    if (rel === RESOLVER_MODULE) continue;
    constructions.push({
      key: `${rel} ${bare}`,
      file: rel,
      line,
      path: bare,
      depth: segs.length,
    });
  }
}

/**
 * A sanction holds only while its guard is still in the file. A refactor that
 * removes the membership test lapses the exemption rather than outliving it.
 */
const liveSanctions = new Set<string>();
const lapsed: Array<{ key: string; guard: string }> = [];
const unused: string[] = [];
const constructionKeys = new Set(constructions.map((c) => c.key));
for (const s of SANCTIONED) {
  const key = `${s.file} ${s.path}`;
  const src = sourceByFile.get(s.file);
  if (src === undefined || !constructionKeys.has(key)) {
    unused.push(key);
    continue;
  }
  if (!src.includes(s.guard)) {
    lapsed.push({ key, guard: s.guard });
    continue;
  }
  liveSanctions.add(key);
}

const unproven = new Map<string, Construction>();
for (const c of constructions) {
  if (liveSanctions.has(c.key)) continue;
  if (!unproven.has(c.key)) unproven.set(c.key, c);
}

/* ----------------------------------------------------- check 2: collisions */

type CityEntry = { slug: string; name: string; iso2: string };
const cities = (cityListJson as { cities: CityEntry[] }).cities;
const citiesByIso = new Map<string, CityEntry[]>();
for (const c of cities) {
  const k = c.iso2.toUpperCase();
  citiesByIso.set(k, [...(citiesByIso.get(k) ?? []), c]);
}

type Collision = { key: string; iso2: string; slug: string; city: string; region: string; kind: string };
const collisions: Collision[] = [];
for (const meta of COUNTRIES) {
  const iso2 = meta.code.toUpperCase();
  const list = citiesByIso.get(iso2);
  if (!list || list.length === 0) continue;
  const regions = getRegionsForCountry(meta.code, meta.name);
  const byValue = new Map(regions.map((r) => [r.value, r.label]));
  for (const city of list) {
    const label = byValue.get(city.slug);
    if (label === undefined) continue;
    // Three ways a slug can end up on both lists, and they are not equally bad.
    const kind =
      iso2 === "US"
        ? "us-state"
        : regions.length === 1 && label.startsWith("All of ")
          ? "whole-country"
          : "admin1";
    collisions.push({
      key: `${iso2}/${city.slug}`,
      iso2,
      slug: city.slug,
      city: city.name,
      region: label,
      kind,
    });
  }
}
collisions.sort((a, b) => a.key.localeCompare(b.key));

/* ---------------------------------------------------------------- baseline */

type Baseline = { constructions: string[]; collisions: string[]; recorded?: string; why?: string };

const baseline: Baseline = existsSync(BASELINE_PATH)
  ? (JSON.parse(readFileSync(BASELINE_PATH, "utf-8")) as Baseline)
  : { constructions: [], collisions: [] };

const baseConstructions = new Set(baseline.constructions ?? []);
const baseCollisions = new Set(baseline.collisions ?? []);

const newConstructions = [...unproven.keys()].filter((k) => !baseConstructions.has(k)).sort();
const goneConstructions = [...baseConstructions].filter((k) => !unproven.has(k)).sort();
const collisionKeys = new Set(collisions.map((c) => c.key));
const newCollisions = collisions.filter((c) => !baseCollisions.has(c.key)).map((c) => c.key);
const goneCollisions = [...baseCollisions].filter((k) => !collisionKeys.has(k)).sort();

/* ------------------------------------------------------------------ report */

console.log("=== verify_geo_link_construction ===");
console.log(
  `  scanned ${pathsSeen} interpolated path literal(s) in src/, against ${patterns.length} route pattern(s).`,
);
console.log("");
console.log(`  1. CONSTRUCTION  unproven ${unproven.size}, sanctioned ${liveSanctions.size}/${SANCTIONED.length}`);
console.log(`  2. COLLISION     ${collisions.length} slug(s) name a city and a region in the same country`);
console.log(`  3. SHAPE         ${shapeless.length} path(s) match no route`);

if (unproven.size) {
  console.log("");
  console.log("  Paths into the country tree assembled without a resolver:");
  const rows = [...unproven.values()].sort((a, b) =>
    a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file),
  );
  for (const c of rows) {
    const known = baseConstructions.has(c.key) ? "" : "  <-- NEW";
    console.log(`    depth ${c.depth}  ${c.file}:${c.line}  ${c.path}${known}`);
  }
  console.log("");
  console.log("    Each of these needs resolveGeoPage or countryPagePath from");
  console.log("    src/lib/cells/related_links.ts, or a written reason in SANCTIONED.");
}

if (lapsed.length) {
  console.log("");
  console.log("  LAPSED sanctions. The guard that made the exemption true is gone:");
  for (const l of lapsed) console.log(`    ${l.key}   guard no longer in file: ${l.guard}`);
}

if (unused.length) {
  console.log("");
  console.log("  Stale SANCTIONED entries. The construction they exempt is gone, so delete them:");
  for (const k of unused) console.log(`    ${k}`);
}

if (collisions.length) {
  const byKind = new Map<string, Collision[]>();
  for (const c of collisions) byKind.set(c.kind, [...(byKind.get(c.kind) ?? []), c]);
  console.log("");
  console.log("  Slugs that name two places on two routes:");
  const order = ["us-state", "whole-country", "admin1"];
  const gloss: Record<string, string> = {
    "us-state": "the region list here is the 50 states, so the region is provably NOT the city",
    "whole-country": "the region is the synthesized whole-country entry, so it means the country",
    admin1: "the region is an admin1 division of the same name, usually but not provably the same place",
  };
  for (const kind of order) {
    const list = byKind.get(kind);
    if (!list) continue;
    console.log(`    ${kind} (${list.length}): ${gloss[kind]}`);
    for (const c of list.slice(0, 12)) {
      const flag = baseCollisions.has(c.key) ? "" : "  <-- NEW";
      console.log(`      /${c.iso2.toLowerCase()}/${c.slug}  city "${c.city}"  region "${c.region}"${flag}`);
    }
    if (list.length > 12) console.log(`      ... (${list.length - 12} more)`);
  }
}

if (shapeless.length) {
  console.log("");
  console.log("  Paths whose shape matches no route in src/app/:");
  for (const s of shapeless.slice(0, 20)) console.log(`    ${s.file}:${s.line}  ${s.path}`);
  if (shapeless.length > 20) console.log(`    ... (${shapeless.length - 20} more)`);
}

/* ------------------------------------------------------------------ verdict */

if (UPDATE) {
  writeFileSync(
    BASELINE_PATH,
    JSON.stringify(
      {
        constructions: [...unproven.keys()].sort(),
        collisions: collisions.map((c) => c.key).sort(),
        recorded: new Date().toISOString().slice(0, 10),
        why:
          "Known live constructions and known slug collisions, recorded so the set can only shrink. " +
          "A construction here is not approved, only known: it assembles a path into the country tree " +
          "without asking a resolver whether that page exists. Lower this when a repair lands; never " +
          "raise it to silence a new one.",
      },
      null,
      2,
    ) + "\n",
  );
  console.log("");
  console.log(
    `  Baseline written: ${unproven.size} construction(s), ${collisions.length} collision(s).`,
  );
  process.exit(0);
}

// The shape check has no ratchet. A path that matches no route is wrong on its
// own terms, needs no runtime knowledge to see, and there are none today.
if (shapeless.length) {
  console.error(
    `\nx verify_geo_link_construction: ${shapeless.length} assembled path(s) match no route at all.\n` +
      `   No runtime value can rescue these: the depth or a literal segment is wrong.`,
  );
  process.exit(1);
}

if (STRICT) {
  const total = unproven.size + collisions.length;
  if (total > 0) {
    console.error(
      `\nx verify_geo_link_construction: ${unproven.size} unresolved construction(s) and ` +
        `${collisions.length} slug collision(s).\n` +
        `   Route every country-tree path through resolveGeoPage or countryPagePath, and give\n` +
        `   a colliding slug one meaning.`,
    );
    process.exit(1);
  }
  console.log("\n  GATE: PASS (strict, every country-tree path resolved and no slug ambiguous).");
  process.exit(0);
}

if (newConstructions.length || newCollisions.length) {
  console.error("");
  if (newConstructions.length) {
    console.error(
      `x verify_geo_link_construction: ${newConstructions.length} NEW path(s) into the country tree\n` +
        `   assembled from parts rather than resolved:`,
    );
    for (const k of newConstructions) console.error(`     ${k}`);
  }
  if (newCollisions.length) {
    console.error(
      `x verify_geo_link_construction: ${newCollisions.length} NEW slug(s) now name both a city page\n` +
        `   and a region page, so the two-segment URL for them is ambiguous:`,
    );
    for (const k of newCollisions) console.error(`     ${k}`);
  }
  console.error(
    `\n   Do not reseed the baseline to clear this. Use the resolvers, or write the reason\n` +
      `   into SANCTIONED in this file.`,
  );
  process.exit(1);
}

if (goneConstructions.length || goneCollisions.length) {
  console.log("");
  console.log(
    `  IMPROVED: ${goneConstructions.length} construction(s) and ${goneCollisions.length} collision(s)` +
      ` are gone since the baseline.`,
  );
  for (const k of goneConstructions) console.log(`     ${k}`);
  for (const k of goneCollisions) console.log(`     ${k}`);
  console.log("  Lower the baseline: npx tsx scripts/verify_geo_link_construction.ts --update-baseline");
}

console.log("");
console.log(
  `  GATE: KNOWN DEFECT, NOT REPAIRED. ${unproven.size} construction(s) and ${collisions.length}\n` +
    `  collision(s) at the recorded baseline. This is a ratchet, not a pass. It fails the moment\n` +
    `  either set grows. Register with --strict once the repairs land.`,
);
