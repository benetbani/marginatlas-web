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
 * Nobody had tested the FIRST segment on its own, which is the rule this test
 * was written for.
 *
 * THE INSTRUMENT IS THE MIDDLEWARE ITSELF (2026-10-06). Each verdict is the
 * real middleware's, asked with a browser's request the way
 * tests/routing/metadata_routes.test.ts asks it, so every rule it runs gets its
 * say: the dot rule, the first-segment rule, the two-letter rule, a country's
 * static children and regions, the edge's not-found rule
 * (src/lib/routing/edge_not_found.ts) and every redirect above them. Until then
 * this test asked `wouldBe404`, a copy of the first-segment rule alone that
 * called itself "the exact predicate middleware applies", and three of its
 * paths were listed wrong. /og was "spared", and the two-letter rule pins it,
 * rightly: src/app/og holds only children. /de/bayern was "spared", and the
 * region rule pins it, rightly: Germany's regions go by their English names, the
 * site's Bavaria is /de/bavaria, and the region page calls notFound() on
 * bayern. /gb/london was "spared" by a rule it never reaches: the edge sends it
 * to /cities/london first.
 *
 * WHAT IT CANNOT SEE. The matcher in the middleware's config: a path the matcher
 * skips never reaches the middleware, and this asks the middleware anyway, so
 * it is stricter than production, never looser. And what a route does with an
 * address the middleware passes.
 *
 * OFFLINE BY DEFAULT. The prebuild chain must never need the network, so the
 * live sitemap is only fetched when --live is passed. The offline run asks the
 * middleware about a fixed set of paths that covers every shape the site serves.
 *
 *   npx tsx tests/routing/junk_url_rule.test.ts
 *   npx tsx tests/routing/junk_url_rule.test.ts --live
 */
import { readdirSync } from "node:fs";
import { NextRequest } from "next/server";
/* routeRequest, not middleware: since A7 (2026-10-06) `middleware` is async (the session refresh wraps the routing), and this
   test reads the routing decision itself, as tests/routing/metadata_routes.test.ts does. */
import { routeRequest as middleware } from "../../src/middleware";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "junk-url-rule";
const MW = "src/middleware.ts";
const SELF = "tests/routing/junk_url_rule.test.ts";
const OG = "src/app/og";
const OR_CORRECT = `, or correct the path's line in ${SELF} when the site changed on purpose`;
const PIN_REMEDY = `keep the edge's 404 on an address for nothing: isPlaceWeDoNotHold and edgeNotFound in ${MW} judge it after every redirect${OR_CORRECT}`;
const PASS_REMEDY =
  "let the middleware pass an address the site serves: a route folder belongs in TOP_LEVEL_SEGMENTS and a static child of [country] in COUNTRY_STATIC_CHILDREN (src/lib/routing/top_level_segments.ts), a trade or a city in its route's resolver (src/lib/routing/edge_not_found.ts)" +
  OR_CORRECT;
const MOVE_REMEDY = `send the address to its page in one hop (cityPathUnderCountry in ${MW})${OR_CORRECT}`;
const OG_REMEDY = `spare /og in isPlaceWeDoNotHold (${MW}) before a page at ${OG} can be reached: the two-letter rule pins every bare two-letter address that is no country`;
const WALK_REMEDY = `point OG in ${SELF} at the folder that holds the image routes`;
const LIVE_REMEDY = `fix the rule in ${MW} that catches a page production declares, or stop src/app/sitemap.ts declaring an address the edge moves`;
const SUMMARY_REMEDY = "an address for nothing stays the edge's 404 and an address the site serves passes it untouched: read each red above";

let failed = 0;
const check = (label: string, ok: boolean, file: string, remedy: string) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};

const ORIGIN = "https://www.marginatlas.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
let caller = 0;
/** The middleware's answer to a browser asking for the address: "passes" (untouched, on to its route), "pinned to 404", or
 *  where else it sends the reader. Each request comes from its own address, so the 60-a-minute rate limit never answers instead. */
function verdict(address: string): string {
  caller++;
  const res = middleware(new NextRequest(`${ORIGIN}${address}`, {
    headers: { host: "www.marginatlas.com", "user-agent": UA, "accept-language": "en-GB", "x-real-ip": `10.8.${caller >> 8}.${caller & 255}` },
  }));
  if (res.status === 200 && res.headers.get("x-middleware-next") === "1") return "passes";
  if (res.status === 404) return "pinned to 404";
  const to = res.headers.get("location") ?? res.headers.get("x-middleware-rewrite");
  return `answers ${res.status}${to ? ` to ${to.startsWith(ORIGIN) ? to.slice(ORIGIN.length) : to}` : ""}`;
}

function expectVerdict(path: string, want: string, why: string, remedy: string) {
  const v = verdict(path);
  check(`${path} ${v}${v === want ? "" : `, expected "${want}"`}: ${why}`, v === want, MW, remedy);
}

/* /download left with its page (the checkup of 2026-10-06, finding 5). Its one address, /download/2026-benchmarks, is
   answered by next.config.js's redirect to /data, which runs before the middleware; anything else under it is junk. */
expectVerdict("/download", "pinned to 404", "the /download page left in the checkup's B1", "keep download out of src/lib/routing/top_level_segments.ts; its one redirect lives in next.config.js");

/* PINNED: an address for nothing, rewritten onto itself with the status pinned to 404. */
const NO_PLACE = "neither a country we hold nor a route folder, so it could only have matched [country]";
const PINNED: ReadonlyArray<readonly [string, string]> = [
  ["/zz/qq", NO_PLACE],
  ["/definitely-not-a-route-xyz", NO_PLACE],
  ["/nonsense/thing", NO_PLACE],
  ["/qq", NO_PLACE],
  ["/og", "a route folder, but two letters and no country, and src/app/og holds only children: nothing lives at its bare address"],
  ["/de/bayern", "a country we hold and no region of it: the site's Bavaria is /de/bavaria, and the region page calls notFound() on bayern"],
];
for (const [p, why] of PINNED) expectVerdict(p, "pinned to 404", why, PIN_REMEDY);

/* PASSES: every shape the site serves goes on to its route untouched. */
const PASSES: ReadonlyArray<readonly [string, string]> = [
  ["/", "the home page"],
  ["/us", "a country we hold"],
  ["/gb", "a country we hold"],
  ["/fr", "a country we hold"],
  ["/us/california", "a state, from the United States list"],
  ["/de/bavaria", "a region of a country we hold, by the name its country page links"],
  ["/us/industries", "a static child of the country route"],
  ["/gb/how-to-open", "a static child other than industries, pinned on every deploy until 2026-09-19"],
  ["/cities/london", "a city the list holds, a shape the edge's not-found rule judges"],
  ["/coverage/us", "a child of a route folder"],
  ["/gb/london/restaurants", "a trade under a UK city, a shape the edge's not-found rule judges"],
  ["/us/california/restaurants", "a trade under a state"],
  ["/us/mississippi/offices-of-lawyers", "a census description: a United States word is the database's, never judged at the edge"],
  ["/geo/countries-110m.json", "a file is not a place: the world map's data, which the place rule once pinned"],
];
for (const [p, why] of PASSES) expectVerdict(p, "passes", why, PASS_REMEDY);

const ROUTE_FOLDERS = [
  "/cities", "/learn", "/compare", "/browse", "/world", "/pricing", "/about-data", "/faq", "/blog", "/you", "/status",
  "/decide", "/extremes", "/tools", "/random", "/margin-index", "/methodology",
  "/privacy", "/terms", "/cookies", "/contact", "/signin", "/account", "/saved",
  "/check", "/calculator", "/embed", "/industries", "/countries", "/admin", "/dev",
];
for (const p of ROUTE_FOLDERS) expectVerdict(p, "passes", "a route folder", PASS_REMEDY);

/* MOVES: an address the edge sends on, permanently, before any 404 rule is asked. */
expectVerdict("/gb/london", "answers 308 to /cities/london", "a city its country holds, under the country's path, goes to its own page", MOVE_REMEDY);

/* /og is rightly the edge's 404 only while src/app/og holds nothing at its own root; the image routes under it pass. */
const ROUTE_FILE = /^(page|route)\.[jt]sx?$/;
const og = readdirSync(OG, { withFileTypes: true });
const ogRoot = og.filter((e) => e.isFile() && ROUTE_FILE.test(e.name)).map((e) => e.name);
check(`${OG} holds no page or route at its own root (found: ${ogRoot.join(", ") || "none"})`, ogRoot.length === 0, OG, OG_REMEDY);
const ogRoutes = og
  .filter((e) => e.isDirectory() && /^[a-z0-9-]+$/.test(e.name) && readdirSync(`${OG}/${e.name}`).some((f) => ROUTE_FILE.test(f)))
  .map((e) => `/og/${e.name}`);
check(`the walk finds the image routes under ${OG} (found ${ogRoutes.length}: ${ogRoutes.join(", ")})`, ogRoutes.length > 0, OG, WALK_REMEDY);
for (const p of ogRoutes) expectVerdict(p, "passes", "an image route a page's head links", PASS_REMEDY);

function finish() {
  if (failed > 0) {
    redSummary(RULE, failed, SUMMARY_REMEDY, "checks failed");
    process.exit(1);
  }
  console.log(`junk_url_rule: all pass (${caller} addresses asked of the middleware)`);
}

/* No top-level await: this repo's tsx transform emits CJS and rejects it. */
if (process.argv.includes("--live")) {
  (async () => {
    const urls: string[] = [];
    const perShard: string[] = [];
    /* Shard 5, the neighbourhood shard, has declared nothing since 2026-08-08 (src/app/sitemap.ts). Each shard's count is
       printed, because a shard that loads empty only shrinks the total and would otherwise pass unseen. */
    for (const id of [0, 1, 2, 3, 4, 6, 7]) {
      const r = await fetch(`${ORIGIN}/sitemap/${id}.xml`);
      if (!r.ok) check(`live: /sitemap/${id}.xml answers ${r.status} on production`, false, "src/app/sitemap.ts", "rerun --live once production serves its sitemap");
      const before = urls.length;
      for (const m of (await r.text()).matchAll(/<loc>([^<]+)<\/loc>/g)) urls.push(new URL(m[1]).pathname);
      perShard.push(`${id}: ${urls.length - before}`);
    }
    const held = urls.map((u) => [u, verdict(u)] as const).filter(([, v]) => v !== "passes").map(([u, v]) => `${u} ${v}`);
    check(
      `live: ${urls.length - held.length} of ${urls.length} declared URLs pass the edge untouched (per shard ${perShard.join(", ")})${held.length ? `; ${held.slice(0, 10).join("; ")}` : ""}`,
      urls.length > 0 && held.length === 0,
      MW,
      LIVE_REMEDY,
    );
    finish();
  })();
} else {
  finish();
}
