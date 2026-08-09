/**
 * Route chrome contract (2026-08-09).
 *
 * WHY THIS EXISTS. The home page shipped with no masthead and nobody noticed
 * for weeks. Production served zero <header> and zero role="banner" on the
 * single most-visited URL on the site, and the founder found it, not a check.
 *
 * THE MECHANISM, because the shape of the bug is the point. The masthead used
 * to live in the ROOT layout and therefore wrapped every route. It moved into
 * <SiteChrome> for a real reason that still holds: one URL,
 * /[country]/[geo]/[industry], serves three different renders chosen at REQUEST
 * TIME by data, and App Router layouts are keyed by PATH, not by data. So chrome
 * became opt-in: routes under src/app/(site)/ get it from that group's layout,
 * and routes outside it render <SiteChrome> themselves.
 *
 * src/app/page.tsx sits at the app root. It is in neither. It was the one route
 * that got neither, and nothing in the repository could say so.
 *
 * This is a HARD check, not a ratchet: measured clean at four exemptions on the
 * day it was written. If it fails, a route has fallen into the same hole. READ
 * the route before adding it to the exemption list , the list is for pages that
 * genuinely must not have chrome, and every entry carries its reason.
 *
 * Follows this repository's test idiom: a bare tsx script, PASS/FAIL per case,
 * exit 1 on any failure.
 */
import fs from "node:fs";
import path from "node:path";

/** Routes that must NOT carry site chrome, each with the reason it is exempt. */
const EXEMPT: Record<string, string> = {
  "src/app/embed/[country]/[geo]/[industry]/page.tsx":
    "an embed widget rendered inside someone else's page; a masthead there would be someone else's masthead",
  "src/app/_design/page.tsx":
    "_design is a Next PRIVATE folder (underscore prefix), not routable; it is the component catalog",
  "src/app/_design/monetized/page.tsx": "same private catalog",
  "src/app/_design/v2-review/page.tsx": "same private catalog",
};

/** Every page.tsx that ships. /dev is the workshop and is excluded wholesale. */
function shippingRoutes(dir = "src/app", out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) {
      if (e.name !== "dev") shippingRoutes(p, out);
    } else if (e.name === "page.tsx") out.push(p);
  }
  return out;
}

let failed = 0;
const routes = shippingRoutes();
const offenders: string[] = [];

for (const f of routes) {
  if (f.includes("(site)/")) continue; // the group layout renders SiteChrome for all of these
  if (f in EXEMPT) continue;
  const src = fs.readFileSync(f, "utf8");
  // SpineShell counts: the v2 pages carry their own masthead and footer, which
  // is the whole reason chrome had to become opt-in.
  if (src.includes("SiteChrome") || src.includes("SpineShell")) continue;
  offenders.push(f);
}

if (offenders.length === 0) {
  console.log(`PASS  every shipping route has chrome or is exempt by name (${routes.length} routes scanned)`);
} else {
  failed++;
  console.log(`FAIL  ${offenders.length} shipping route(s) render neither SiteChrome nor SpineShell:`);
  for (const f of offenders) console.log(`        ${f}`);
  console.log("      Read the route before exempting it. If it should have chrome, wrap it.");
}

/* The exemption list must not rot. An entry naming a file that no longer exists
   is a licence nobody revoked, and the next file to land on that path inherits
   it silently. */
for (const [f, why] of Object.entries(EXEMPT)) {
  const exists = fs.existsSync(f);
  if (!exists) failed++;
  console.log(`${exists ? "PASS" : "FAIL"}  exemption still points at a real file: ${f} (${why})`);
}

if (failed > 0) {
  console.error(`route_chrome_contract: ${failed} failures`);
  process.exit(1);
}
console.log("route_chrome_contract: all pass");
