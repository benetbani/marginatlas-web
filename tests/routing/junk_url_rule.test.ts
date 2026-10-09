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
 * real routing's (routeRequest, which the exported middleware wraps with the
 * session refresh: that touches cookies and cache headers only, never a status;
 * next.config.js's redirects run before it and are not asked), asked with a
 * browser's request the way
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
/* The P1-A hops: a retired or renamed trade under a place no table holds is that place's 404, and the two redirects that would move it
   first each skip such a place by one guard. A red on those rows names the guard, never the edge's rule alone. */
const GUARD_REMEDY = `leave a place no table holds to the edge's 404 and never move it first: placeNotHeldIn (src/lib/routing/place_words.ts) guards the retired-trade hop, retiredPlaceTarget in src/lib/taxonomy/retired_paths.ts, and the rename handler in ${MW}${OR_CORRECT}`;
const RENAME_REMEDY = `keep the rename handler in ${MW} sending a renamed trade (TAXONOMY_REDIRECTS, src/lib/taxonomy/legacy_redirects.ts) to its new slug in one hop under a place a table holds: only a place placeNotHeldIn (src/lib/routing/place_words.ts) names is left to the edge's 404${OR_CORRECT}`;
const RENAME_ENCODED_REMEDY = `keep the rename handler in ${MW} sending a renamed trade to its new slug under a place a table holds, and read the place as its route does, percent-decoded (routeWord in src/lib/routing/place_words.ts, which placeNotHeldIn uses)${OR_CORRECT}`;
const STATIC_CHILD_REMEDY = `exempt a static child of a place (GEO_STATIC_CHILDREN, src/lib/routing/edge_not_found.ts) from the 404 for its own three-part address only: under /opening and /buy-or-start the route wants a trade, and a static child is none${OR_CORRECT}`;
const ENCODED_REMEDY = `read the country and the place of an address (its first two parts, under a country the site holds) as their route reads them, percent-decoded and lowercased (routeWord in src/lib/routing/place_words.ts), in parts() of src/lib/routing/edge_not_found.ts and in placeNotHeldIn, and decode no other part${OR_CORRECT}`;
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
  let res: ReturnType<typeof middleware>;
  try {
    res = middleware(new NextRequest(`${ORIGIN}${address}`, {
      headers: { host: "www.marginatlas.com", "user-agent": UA, "accept-language": "en-GB", "x-real-ip": `10.8.${caller >> 8}.${caller & 255}` },
    }));
  } catch (e) {
    return `throws (${e instanceof Error ? e.message : String(e)})`;
  }
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

/* A WORD THAT NAMES A BUILT-IN NAMES NOTHING (2026-10-06). The edge's tables are plain objects, and a plain object answers for
   the names every object inherits: on production `/gb/london/constructor` answered 308 to `/gb/london/function%20Object()%20%7B%20
   [native%20code]%20%7D`, the rename table's "entry" printed as text, and `/gb/london/__proto__` 308 to `/gb/london/[object%20Object]`;
   `/cities/constructor/neighborhoods/central` threw inside the middleware. Each now answers as any made-up word in its shape does. */
const PROTO_REMEDY = `look a word up in a table keyed by the address with own() (src/lib/own.ts), never table[word]: a plain object answers "constructor" and "__proto__" with a built-in${OR_CORRECT}`;
const BUILT_IN = "names an Object.prototype member and nothing on the site, so it is a made-up word like any other";
const PROTO_PINNED = [
  "/gb/london/constructor", "/gb/london/__proto__", "/gb/london/hasownproperty", "/gb/london/tostring", "/gb/london/valueof",
  "/constructor", "/__proto__", "/gb/constructor", "/gb/__proto__", "/fr/paris/constructor",
  "/industries/constructor", "/industries/__proto__", "/industries/constructor/across",
  "/cities/constructor", "/cities/__proto__", "/cities/constructor/neighborhoods", "/cities/constructor/neighborhoods/central",
  "/cities/london/neighborhoods/constructor",
];
for (const p of PROTO_PINNED) expectVerdict(p, "pinned to 404", BUILT_IN, PROTO_REMEDY);
/* An uppercase letter is canonicalised first, as for any word, and the lowercase address is then judged above. */
expectVerdict("/gb/london/toString", "answers 308 to /gb/london/tostring", "an uppercase address goes to its lowercase form first, as any address does", PROTO_REMEDY);
/* A United States word is judged at the edge since P1-A (2026-10-09): one that is no trade and no census description the database
   holds answers 404, and a built-in's name is such a word; it must never move to a built-in's text. */
expectVerdict("/us/california/constructor", "pinned to 404", "a United States word that names no trade and no census description, as any made-up one", PROTO_REMEDY);

/* P1-A (the page architecture, 2026-10-09): a made-up place in five countries, a retired or renamed trade under one, an unknown
   United States word and a /decide pair its route cannot draw answer 404 at the address asked, never a hop first. */
const P1A_PINNED: ReadonlyArray<readonly [string, string, string?]> = [
  ["/gb/atlantis/restaurants", "a place no UK table holds"],
  ["/us/atlantis/restaurants", "a place no United States table holds"],
  ["/de/atlantis/restaurants", "a place no German table holds"],
  ["/fr/atlantis/restaurants", "a place no French table holds"],
  ["/tr/atlantis/restaurants", "a place no Turkish table holds"],
  ["/gb/atlantis/restaurants/opening", "an opening page under a place no table holds"],
  ["/gb/atlantis/banking", "a retired trade under a place no table holds: that place's 404, not a hop to the country", GUARD_REMEDY],
  ["/gb/atlantis/crop-farming", "a renamed trade under a place no table holds: that place's 404, not a hop to the new name", GUARD_REMEDY],
  ["/us/california/zz-not-a-trade", "a United States word that is no trade and no census description"],
  ["/us/us-06-037/offices-of-lawyers", "a census description under a county: only a state's lookup reads one"],
  ["/gb/london/zz-not-a-trade/opening", "an opening page whose trade names nothing"],
  ["/gb/london/industries/opening", "a static child of the place has no opening page: the route wants a trade, and industries is none", STATIC_CHILD_REMEDY],
  ["/gb/london/industries/buy-or-start", "a static child of the place has no buy-or-start page", STATIC_CHILD_REMEDY],
  ["/decide/zz-not-a-trade/london", "a /decide pair whose activity names nothing"],
  ["/decide/restaurants/atlantis", "a /decide pair whose city holds no neighbourhood scheme"],
  ["/br/s%c3%a3o-atlantis/restaurants", "an accented place no table holds, in the percent-encoded form the canonical hop writes", ENCODED_REMEDY],
];
for (const [p, why, remedy] of P1A_PINNED) expectVerdict(p, "pinned to 404", why, remedy ?? PIN_REMEDY);

/* PASSES: every shape the site serves goes on to its route untouched. */
const PASSES: ReadonlyArray<readonly [string, string, string?]> = [
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
  ["/us/mississippi/offices-of-lawyers", "a census description the database holds (src/lib/routing/place_slugs_generated.ts), under a state"],
  ["/gb/gb/restaurants", "the country's own code as its place"],
  ["/gb/england/restaurants", "a nation"],
  ["/gb/birmingham-uk/restaurants", "a friendly city alias: kept until the inventory gives it its line"],
  ["/gb/liverpool/restaurants", "a manual city alias the rivals list links: kept until the inventory gives it its line"],
  ["/us/us-06-037/restaurants", "a county the database holds"],
  ["/gb/london/restaurants/opening", "an opening page of a trade page that exists"],
  ["/gb/london/industries", "a static child of a place is a page of its own", STATIC_CHILD_REMEDY],
  ["/decide/restaurants/london", "a /decide pair its route draws"],
  ["/de/frankfurt-am-main/restaurants", "the address the across-cities columns link for Frankfurt (cellUrl spells its label)"],
  ["/br/s%c3%a3o-paulo/restaurants", "a place the table spells with an accent, in the percent-encoded form the canonical hop writes (the route receives the decoded word)", ENCODED_REMEDY],
  ["/geo/countries-110m.json", "a file is not a place: the world map's data, which the place rule once pinned"],
];
for (const [p, why, remedy] of PASSES) expectVerdict(p, "passes", why, remedy ?? PASS_REMEDY);

const ROUTE_FOLDERS = [
  "/cities", "/learn", "/compare", "/browse", "/world", "/pricing", "/about-data", "/faq", "/blog", "/you", "/status",
  "/decide", "/extremes", "/tools", "/random", "/margin-index", "/methodology",
  "/privacy", "/terms", "/cookies", "/contact", "/signin", "/account", "/saved",
  "/check", "/calculator", "/embed", "/industries", "/countries", "/admin", "/dev",
];
for (const p of ROUTE_FOLDERS) expectVerdict(p, "passes", "a route folder", PASS_REMEDY);

/* MOVES: an address the edge sends on, permanently, before any 404 rule is asked. */
expectVerdict("/gb/london", "answers 308 to /cities/london", "a city its country holds, under the country's path, goes to its own page", MOVE_REMEDY);

/* THE RENAME HOP, POSITIVELY (the review of 2026-10-09). The Wave 4b handler in src/middleware.ts is guarded since P1-A: a renamed
   trade under a place no table holds is that place's 404 (P1A_PINNED above). Every row of that kind pins the guard shut; nothing pinned
   it open, so a guard that skipped the hop for every place survived. A renamed trade under a place a table holds still goes to its new
   name in one hop, and the guard reads the place as its route does: percent-decoded, so an accented place the table holds is held. */
expectVerdict("/gb/london/media-publishing", "answers 308 to /gb/london/news-periodical-publishing", "a renamed trade under a place the tables hold goes to its new name, in one hop", RENAME_REMEDY);
expectVerdict("/br/s%c3%a3o-paulo/media-publishing", "answers 308 to /br/s%c3%a3o-paulo/news-periodical-publishing", "the same under a place the table spells with an accent, as the middleware sees it", RENAME_ENCODED_REMEDY);

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
