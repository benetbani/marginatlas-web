/**
 * The junk-URL rule, tested against every URL the site declares (2026-08-09).
 *
 * WHAT IT GUARDS. src/middleware.ts pins a 404 on a first segment that is
 * neither a country we hold nor a real route folder. That rule is only safe
 * while the route-folder list is complete, so this test proves the rule catches
 * nothing the site actually publishes.
 *
 * Two rules were measured and REJECTED before this one, and they are recorded
 * here so nobody re-proposes them:
 *
 *   "the industry slug must resolve"  would 404 269 of 800 real cell URLs. A
 *   third of them use a raw NAICS description slugified,
 *   /us/mississippi/offices-of-lawyers, rather than a taxonomy slug.
 *
 *   "country + geo must resolve"  does not discriminate: geoResolves("us",
 *   "nowhere") is true, because the geo resolver is permissive several layers
 *   down. That permissiveness is why the page renders at all.
 *
 * Nobody had tested the FIRST segment on its own, which is what this is.
 *
 * OFFLINE BY DEFAULT. The prebuild chain must never need the network, so the
 * live sitemap is only fetched when --live is passed. The offline run tests the
 * rule against a fixed set of paths that covers every shape the site serves.
 *
 *   npx tsx tests/routing/junk_url_rule.test.ts
 *   npx tsx tests/routing/junk_url_rule.test.ts --live
 */
import { TOP_LEVEL_SEGMENTS } from "../../src/lib/routing/top_level_segments";
import { COUNTRIES } from "../../src/lib/taxonomy";

const countries = new Set(COUNTRIES.map((c) => c.code.toLowerCase()));

/** The exact predicate middleware applies, kept in one place. */
function wouldBe404(path: string): boolean {
  const s = path.split("/").filter(Boolean);
  if (s.length === 0 || s.length > 2) return false;
  return !TOP_LEVEL_SEGMENTS.has(s[0]) && !countries.has(s[0]);
}

let failed = 0;
const check = (label: string, ok: boolean, detail = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` :: ${detail}` : ""}`);
};

/* Must be caught: a first segment that can only have matched [country]. */
for (const p of ["/zz/qq", "/definitely-not-a-route-xyz", "/nonsense/thing", "/qq"]) {
  check(`caught: ${p}`, wouldBe404(p));
}

/* Must NOT be caught. Every shape the site actually serves. */
const spared = [
  "/", "/us", "/gb", "/fr",
  "/us/california", "/gb/london", "/us/industries", "/de/bayern",
  "/cities", "/cities/london", "/coverage/us", "/learn", "/compare",
  "/browse", "/world", "/pricing", "/about-data", "/faq", "/blog", "/you", "/status",
  "/og", // two letters, not a country, and a real route: the reason the list is checked first
  "/decide", "/extremes", "/tools", "/random", "/margin-index", "/methodology",
  "/privacy", "/terms", "/cookies", "/contact", "/signin", "/account", "/saved",
  "/check", "/calculator", "/download", "/embed", "/industries", "/countries", "/admin", "/dev",
];
for (const p of spared) check(`spared: ${p}`, !wouldBe404(p));

/* Three-segment paths are never judged here: that is the cell lattice. */
for (const p of ["/us/california/restaurants", "/us/mississippi/offices-of-lawyers"]) {
  check(`not judged (3 segments): ${p}`, !wouldBe404(p));
}

function finish() {
  if (failed > 0) {
    console.error(`junk_url_rule: ${failed} failures`);
    process.exit(1);
  }
  console.log("junk_url_rule: all pass");
}

/* No top-level await: this repo's tsx transform emits CJS and rejects it. */
if (process.argv.includes("--live")) {
  (async () => {
    const urls: string[] = [];
    for (const id of [0, 1, 2, 3, 4, 6, 7]) {
      const x = await (await fetch(`https://www.marginatlas.com/sitemap/${id}.xml`)).text();
      for (const m of x.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(new URL(m[1]).pathname);
    }
    const caught = urls.filter(wouldBe404);
    check(`live: 0 of ${urls.length} declared URLs caught`, caught.length === 0, caught.slice(0, 10).join(" "));
    finish();
  })();
} else {
  finish();
}
