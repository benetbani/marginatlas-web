/**
 * Every metadata route src/app serves passes the edge middleware untouched, never its pinned 404 (2026-10-06).
 *
 * src/app/icon.tsx serves at /icon, the site icon every page links. The middleware's list of real first segments was walked
 * from route folders only, so it read /icon as a made-up one and rewrote it onto itself with the status pinned to 404, and
 * production sent the icon's PNG as the body of a 404 (curl with a browser's user agent, 2026-10-06: 404, image/png, 924
 * bytes, matched path /icon). A browser refuses a favicon that answers 404.
 *
 * THE INSTRUMENT. Each file's address is Next's own (scripts/lib/metadata_routes.mjs), and the verdict is the real
 * middleware's, called with a browser's request, so every rule it has is asked (the place rule, the edge not-found rule,
 * every redirect), not a copy of one: junk_url_rule's `wouldBe404` copied the first-segment rule alone, and called /og spared
 * while the middleware pins it (rightly: /og holds children only). WHAT IT CANNOT SEE: the matcher in the middleware's
 * config, since a path the matcher skips never reaches the middleware (this asks the middleware anyway, so it is stricter
 * than production, never looser), and whatever the platform does after the middleware answers. `--live` asks production
 * itself; the chain never passes it, because the chain must not need the network.
 *
 * Run: npx tsx tests/routing/metadata_routes.test.ts
 *      npx tsx tests/routing/metadata_routes.test.ts --live
 */
import { NextRequest } from "next/server";
/* The middleware's routing decision (since the checkup of 2026-10-06 the exported `middleware` is async: it adds a session refresh
   that is a no-op with auth off and no session cookie, as here), asked synchronously. */
import { routeRequest as middleware } from "../../src/middleware";
import { METADATA_IMAGE_NAMES, metadataAddress, metadataRoutes, requestedAddress } from "../../scripts/lib/metadata_routes.mjs";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "metadata-routes";
const LIB = "scripts/lib/metadata_routes.mjs";
const LIST = "src/lib/routing/top_level_segments.ts";
const MW = "src/middleware.ts";
const REMEDY =
  "let the middleware pass every metadata route's address untouched: a dotless first segment belongs in TOP_LEVEL_SEGMENTS, a child of [country] in COUNTRY_STATIC_CHILDREN (src/lib/routing/top_level_segments.ts; scripts/verify_top_level_segments.mjs names the entry)";
const WALK_REMEDY = `read ${LIB} against the next/dist functions it calls, or update this check if src/app moved the file`;
const HELD_REMEDY = "add a value the site holds for that dynamic part to HELD in tests/routing/metadata_routes.test.ts";
const CONTROL_REMEDY = `keep a made-up first segment pinned: a name belongs in ${LIST} only while a folder or metadata file holds it`;
const LIVE_REMEDY = "when the checks without --live pass, production runs older code: deploy, then run --live again";
let failed = 0;
const check = (label: string, ok: boolean, file = MW, remedy = REMEDY) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: label, remedy });
};

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";
let caller = 0;
/** The middleware's answer to a browser asking for the address: "passes" (untouched, on to its route), "pinned to 404", or
 *  where it sends the reader. Each request comes from its own address, so the per-address rate limit never answers instead. */
function verdict(address: string): string {
  caller++;
  const res = middleware(new NextRequest(`https://www.marginatlas.com${address}`, {
    headers: { host: "www.marginatlas.com", "user-agent": UA, "accept-language": "en-GB,en;q=0.9", "x-real-ip": `10.6.${caller >> 8}.${caller & 255}` },
  }));
  if (res.status === 200 && res.headers.get("x-middleware-next") === "1") return "passes";
  if (res.status === 404) return "pinned to 404";
  const to = res.headers.get("location") ?? res.headers.get("x-middleware-rewrite");
  return `answers ${res.status}${to ? ` with ${to}` : ""}`;
}

/** A value the site holds for each dynamic part a metadata address can carry, so the address asked is one a reader's page
 *  links; a part with no value here reds rather than being guessed. */
const HELD: Partial<Record<string, string>> = { "[country]": "gb" };
function asRequested(address: string): string | null {
  const parts = requestedAddress(address).split("/").map((p) => (p.startsWith("[") ? HELD[p] ?? null : p));
  return parts.includes(null) ? null : parts.join("/");
}

/* The instrument sees the files: the three src/app holds, each at the address Next serves it at. */
const routes = metadataRoutes();
const at = (file: string) => routes.find((r) => r.file === file)?.address;
check(`the walk finds src/app/icon.tsx, the site icon, at /icon (found ${at("src/app/icon.tsx")})`, at("src/app/icon.tsx") === "/icon", LIB, WALK_REMEDY);
check(`the walk finds src/app/robots.ts at /robots.txt (found ${at("src/app/robots.ts")})`, at("src/app/robots.ts") === "/robots.txt", LIB, WALK_REMEDY);
check(
  `the walk finds src/app/sitemap.ts at one address per id, the first /sitemap/0.xml (found ${at("src/app/sitemap.ts")})`,
  at("src/app/sitemap.ts") === "/sitemap/[__metadata_id__]" && requestedAddress(at("src/app/sitemap.ts") ?? "") === "/sitemap/0.xml",
  LIB,
  WALK_REMEDY,
);

/* Next's own addressing, on files src/app does not hold: a route group's suffix, a dynamic parent, one image per id. */
const grouped = metadataAddress("/(site)/opengraph-image.tsx");
check(`a file in a route group takes Next's suffix: (site)/opengraph-image.tsx serves at ${grouped}`, /^\/opengraph-image-[0-9a-z]{6}$/.test(grouped ?? ""), LIB, WALK_REMEDY);
check("a file under the country wildcard: [country]/opengraph-image.tsx serves at /[country]/opengraph-image", metadataAddress("/[country]/opengraph-image.tsx") === "/[country]/opengraph-image", LIB, WALK_REMEDY);
check("an image with an id list serves one address per id: icon.tsx with generateImageMetadata at /icon/0 for id 0", requestedAddress(metadataAddress("/icon.tsx", true) ?? "") === "/icon/0", LIB, WALK_REMEDY);
check("a page is no metadata route: page.tsx", metadataAddress("/page.tsx") === null, LIB, WALK_REMEDY);

/* Each address answers through its own route, never the edge's pinned 404. */
for (const { file, address } of routes) {
  const asked = asRequested(address);
  if (asked === null) {
    check(`${file} serves at ${address}, and this test holds no value for its dynamic part`, false, file, HELD_REMEDY);
    continue;
  }
  const v = verdict(asked);
  check(`${file} serves at ${asked}: ${v}`, v === "passes", LIST);
}

/* The 404 for a made-up first segment is not weakened: the addresses the place rule exists for stay pinned, and so does a
   metadata name src/app holds no file for (a name is listed for its file, never for its convention). */
for (const p of ["/zz", "/definitely-not-a-route-xyz"]) {
  const v = verdict(p);
  check(`a made-up first segment stays the edge's 404: ${p} ${v}`, v === "pinned to 404", MW, CONTROL_REMEDY);
}
const named = new Set(routes.map((r) => requestedAddress(r.address).split("/")[1]));
for (const name of METADATA_IMAGE_NAMES.filter((n) => !named.has(n))) {
  const v = verdict(`/${name}`);
  check(`a metadata name with no file is a made-up first segment too: /${name} ${v}`, v === "pinned to 404", MW, CONTROL_REMEDY);
}

function finish() {
  if (failed > 0) {
    redSummary(RULE, failed, REMEDY, "checks failed");
    process.exit(1);
  }
  console.log(`routing/metadata_routes: all pass (${routes.length} metadata route files)`);
}

/* No top-level await: this repo's tsx transform emits CJS and rejects it. */
if (process.argv.includes("--live")) {
  (async () => {
    for (const { file, address } of routes) {
      const asked = asRequested(address);
      if (asked === null) continue;
      const r = await fetch(`https://www.marginatlas.com${asked}`, { headers: { "user-agent": UA, "accept-language": "en-GB" }, redirect: "manual" });
      check(`live: ${file} serves at ${asked}: ${r.status} on production`, r.status === 200, LIST, LIVE_REMEDY);
    }
    finish();
  })();
} else {
  finish();
}
