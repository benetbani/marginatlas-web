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
 * TIGHTENED 2026-10-11 (truth-fixes round 1, item 2): only SiteChrome counts. The line it replaced let SpineShell count too, on the
 * reasoning that the v2 pages carried their own masthead and footer; the shell is one div that paints the ground, so the clause was a
 * licence nobody revoked, and /gb/how-to-open held it: its page file named SpineShell and wrote a <main> of its own, and production drew
 * it with no bar, no newsletter bar and no footer (the build of 2026-10-11: header false, footer false, main true).
 *
 * READ CODE, NOT COMMENTS (truth-fixes round 3C, 2026-10-12): round 1 still matched the word. /industries (the bar's Trades) and /world
 * drew their own v2 masthead, their own <main> and the v2 footer (src/components/spine2/SiteFooter.tsx) and no SiteChrome at all, and
 * passed because the word stood in their comments (the review of round 1, Important 1). The check now strips comments with
 * scripts/lib/strip_comments and requires a real `<SiteChrome` element, as scripts/verify_main_landmark.mjs reads one, and both pages
 * draw it: no route is exempt by name but the four below. BLIND SPOT, stated: this reads source, so a page that draws `<SiteChrome` on a
 * branch it never takes, or inside a string, passes, and a page that draws the chrome through a component in another file reds (draw the
 * element in the page, or give it a line in EXEMPT with that reason); tests/chrome/masthead.test.ts draws the how-to, trades and world
 * routes and reads their markup.
 *
 * Follows this repository's test idiom: a bare tsx script, PASS/FAIL per case,
 * exit 1 on any failure.
 */
import fs from "node:fs";
import path from "node:path";
import { stripCommentLines } from "../../scripts/lib/strip_comments";

/** A page file's CODE: every comment (a line comment, a block comment, a JSX comment) gone, so a word that stands in prose draws nothing. */
const code = (f: string) => stripCommentLines(fs.readFileSync(f, "utf8").split("\n")).join("\n");
/** The element itself, opening tag only, as scripts/verify_main_landmark.mjs reads it. */
const DRAWS_CHROME = /<SiteChrome[\s>]/;

/** Routes that must NOT carry site chrome, each with the reason it is exempt. */
const EXEMPT: Record<string, string> = {
  "src/app/embed/[country]/[geo]/[industry]/page.tsx":
    "an embed widget rendered inside someone else's page; a masthead there would be someone else's masthead",
  "src/app/_design/page.tsx":
    "_design is a Next PRIVATE folder (underscore prefix), not routable; it is the component catalog",
  "src/app/_design/monetized/page.tsx": "same private catalog",
  "src/app/_design/v2-review/page.tsx": "same private catalog",
};

/** Every page.tsx that ships. src/app/dev is the workshop and is excluded wholesale, by its PATH from the root and never by the bare
 *  name `dev` (a gate that skips a directory by name will one day skip real source: the review of round 1, Minor 2; CLAUDE.md). */
function shippingRoutes(dir = "src/app", out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) {
      if (p !== "src/app/dev") shippingRoutes(p, out);
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
  // Only a drawn <SiteChrome> counts (see the header): the word in a comment or an import draws nothing, and SpineShell paints the
  // ground and draws no bar and no footer.
  if (DRAWS_CHROME.test(code(f))) continue;
  offenders.push(f);
}

if (offenders.length === 0) {
  console.log(`PASS  every shipping route has chrome or is exempt by name (${routes.length} routes scanned)`);
} else {
  failed++;
  console.log(`FAIL  ${offenders.length} shipping route(s) draw no <SiteChrome> element (a comment or an import that names it draws nothing):`);
  for (const f of offenders) console.log(`        ${f}`);
  console.log("      Read the route before exempting it. If it should have chrome, wrap its body in <SiteChrome> as the other spine routes do (SpineShell is the ground, not the chrome), draw no masthead, <main> or footer of its own, and keep the element in the page file.");
}

/* The group the loop above skips is held by ONE file, and it is read the same way: the (site) layout draws the element, in code. */
const GROUP_LAYOUT = "src/app/(site)/layout.tsx";
const groupDraws = fs.existsSync(GROUP_LAYOUT) && DRAWS_CHROME.test(code(GROUP_LAYOUT));
if (!groupDraws) failed++;
console.log(`${groupDraws ? "PASS" : "FAIL"}  the (site) group's layout draws <SiteChrome> for every route in the group: ${GROUP_LAYOUT}`);

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
