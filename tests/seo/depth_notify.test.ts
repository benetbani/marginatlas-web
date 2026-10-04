/**
 * The thin page's one ask (milestone 1, M9; his interview of 2026-09-26: "the 'notify me when my place reaches this depth' capture on
 * thinner pages"): drawn only on a page the floor census counted under its floor outside the UK, its tag accepted by the newsletter
 * endpoint only for such a page.
 *
 * Run: npx tsx tests/seo/depth_notify.test.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { isThinPage, depthSourceFor, isDepthSource, placeOfPath } from "../../src/lib/seo/depth_source";
import { DepthNotifyFoot } from "../../src/components/spine/DepthNotifyFoot";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "depth-notify";
const FILE = "src/lib/seo/depth_source.ts";
const REMEDY = "draw the notify form only on a page counted under its floor outside the UK, and accept its tag only for such a page";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

type Census = { floors: Record<string, number>; pages: Record<string, { surface: string; blocks: number }> };
const census = JSON.parse(readFileSync("data/seo/floor_census.json", "utf8")) as Census;
const entries = Object.entries(census.pages);
const thin = entries.find(([, e]) => e.blocks < census.floors[e.surface])?.[0];
const full = entries.find(([, e]) => e.blocks >= census.floors[e.surface])?.[0];
check(`the census holds a thin page and a full one (${thin}, ${full})`, !!thin && !!full);

check("a thin page outside the UK draws the ask", !!thin && isThinPage(thin));
check("a page at its floor does not", !!full && !isThinPage(full));
check("a UK page never does, whatever its count", !isThinPage("/cities/manchester") && !isThinPage("/gb/london/pizzerias"));
check("a page the census never counted does not", !isThinPage("/zz/nowhere/nothing"));

const tag = thin ? depthSourceFor(thin) : null;
check(`the thin page's tag is depth:<its path> (${tag})`, tag === `depth:${thin}`);
check("the endpoint accepts that tag", !!tag && isDepthSource(tag));
check("and refuses a UK page's, a full page's, an unknown page's and a bare prefix", !isDepthSource("depth:/gb") && !(full && isDepthSource(`depth:${full}`)) && !isDepthSource("depth:/zz/nowhere") && !isDepthSource("depth:"));
check("an ordinary source is not a depth tag", !isDepthSource("footer"));

check("the place of a city page is the city list's own name", placeOfPath("/cities/frankfurt") === "Frankfurt am Main" && placeOfPath("/cities/paris") === "Paris");
check("the place of a country page and its how-to page is the country", placeOfPath("/de") === "Germany" && placeOfPath("/de/how-to-open") === "Germany");
check("the place of a trade page is its city or its region", placeOfPath("/us/california/restaurants") === "California");

const drawn = thin ? renderToStaticMarkup(React.createElement(DepthNotifyFoot, { path: thin })) : "";
check("the foot draws the form on the thin page, naming its place", drawn.includes("data-depth-notify") && drawn.includes("reaches this depth") && !!placeOfPath(thin ?? "") && drawn.includes(String(placeOfPath(thin ?? ""))));
check("and nothing on a UK page or a full page", renderToStaticMarkup(React.createElement(DepthNotifyFoot, { path: "/gb" })) === "" && (!full || renderToStaticMarkup(React.createElement(DepthNotifyFoot, { path: full })) === ""));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("seo/depth_notify: all pass");
