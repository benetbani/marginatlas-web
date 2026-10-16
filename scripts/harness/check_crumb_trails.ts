/**
 * check_crumb_trails , THE TRAIL BACK UP IS NEVER CUT, ON EVERY TRAIL SHAPE THE SITE DRAWS (release 3 job C, 2026-10-16; the rhythm
 * reform's final review, Important 4).
 *
 * WHY A PROBE AND NOT ONLY THE PAGE LAWS: the page laws read the trail on the chain's renders (CRUMB CUT, scripts/lib/crumb_cut.mjs),
 * and those renders carry short names (Restaurants, Barbershops, London). The trails that cut were the long ones: measured on
 * 2026-10-16 before the fix, 13 of 22 longest trails were cut mid-word at 320 and 375 ("United Kingdom / London / Catering &").
 * No render of the chain reaches those names, so this draws them.
 *
 * WHAT IT DRAWS: every trail shape the site builds, through the builders the pages call (src/lib/spine/crumb_rows.ts) and the real
 * component (src/components/spine/Crumbs.tsx), the three longest trails of each shape by characters:
 *   city            country / city, over every city of the list
 *   hood-hub        country / city / Districts, over every city the district spine admits
 *   hood-district   country / city / Districts / district, over every admitted district
 *   howto           country / How to open a business, over every country with a how-to page
 *   industry        Trades / sector / trade, over every trade
 *   trade-city      country / city / trade, over every city and the five longest trade names
 *   trade-region    country / region / trade, over every region of every country and the five longest trade names
 * Each trail stands in SiteChrome's main and gutter (GUTTER, src/lib/nav.ts) on the site's own stylesheet, compiled from
 * src/app/globals.css as the harness renders compile it, and is read at 320, 375 and 768 by crumbCutInPage.
 *
 * IT NEVER PASSES HAVING READ NOTHING, OR BLIND: a run that drew no trail, a width that read fewer navs than it drew or a nav with
 * no visible text is a red, and before reading the trails it reads a PLANT, the longest trail with the component's wrap and
 * one-line height taken off (the nowrap, overflow-hidden nav of before the fix): if the reading does not see that trail cut at
 * 320, the reading is blind and the gate reds.
 *
 * WHAT IT CANNOT SEE, stated: a trade's name as the database prints it (the trade page labels its step with the cell's own
 * industry name; this reads the taxonomy's names, which the trade list and the industry pages print); a trade page for a place
 * that has no cell (it draws the trail a route would draw, whether or not the database holds the page); and a font other than
 * the one installed here (Geist, from the system; no network is asked for, so no web font is fetched). The reading's own blind
 * spot is stated in scripts/lib/crumb_cut.mjs.
 *
 * usage: node node_modules/tsx/dist/cli.mjs scripts/harness/check_crumb_trails.ts
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import cityList from "../../data/cities/city_list_v1.json";
import { requireBrowser } from "../lib/local_only.mjs";
import { preflight } from "./preflight.mjs";
import { crumbCutInPage } from "../lib/crumb_cut.mjs";
import { Crumbs, type SpineCrumb } from "../../src/components/spine/Crumbs";
import { buildCityCrumbs, buildHoodCrumbs, buildCellCrumbs, buildHowToCrumbs, buildIndustryCrumbs } from "../../src/lib/spine/crumb_rows";
import { spineHoodDistricts } from "../../src/lib/spine/hood_scheme";
import { buildHowTo } from "../../src/lib/spine/howto_rows";
import { INDUSTRIES, COUNTRIES } from "../../src/lib/taxonomy";
import { getRegionsForCountry } from "../../src/lib/regions/regions-by-country";
import { GUTTER } from "../../src/lib/nav";

const GATE = "crumb-trails";
const WIDTHS = [320, 375, 768];
const PER_SHAPE = 3;

async function main() {
  await requireBrowser(GATE, "the trail back up on the longest trail of every shape the site draws, at 320, 375 and 768");
  preflight({ browser: true, name: "check_crumb_trails" });
  const { chromium } = await import("playwright");

  /* THE TRAILS, through the pages' own builders. */
  const cities = (cityList as { cities: { slug: string; name: string; iso2: string }[] }).cities;
  const longestTrades = [...INDUSTRIES].sort((a, b) => b.name.length - a.name.length).slice(0, 5);
  const shapes = new Map<string, SpineCrumb[][]>();
  const take = (shape: string, t: SpineCrumb[]) => { if (t.length >= 2) shapes.set(shape, [...(shapes.get(shape) ?? []), t]); };
  for (const c of cities) {
    take("city", buildCityCrumbs(c.slug));
    const districts = spineHoodDistricts(c.slug);
    if (districts) {
      take("hood-hub", buildHoodCrumbs(c.slug));
      for (const d of districts) take("hood-district", buildHoodCrumbs(c.slug, d.slug));
    }
    for (const ind of longestTrades) take("trade-city", buildCellCrumbs({ iso2: c.iso2, geo: c.slug, trade: ind.name, city: c.name }));
  }
  for (const co of COUNTRIES as Array<{ code: string; name: string }>) {
    if (buildHowTo(co.code)) take("howto", buildHowToCrumbs(co.code));
    for (const r of getRegionsForCountry(co.code, co.name)) for (const ind of longestTrades) take("trade-region", buildCellCrumbs({ iso2: co.code, geo: r.value, trade: ind.name, city: r.label }));
  }
  for (const ind of INDUSTRIES) take("industry", buildIndustryCrumbs(ind.id));
  const said = (t: SpineCrumb[]) => t.map((s) => s.label).join(" / ");
  const drawn: { shape: string; trail: string; html: string }[] = [];
  for (const [shape, trails] of [...shapes].sort()) {
    const seen = new Set<string>();
    const longest = [...trails].sort((a, b) => said(b).length - said(a).length).filter((t) => (seen.has(said(t)) ? false : (seen.add(said(t)), true))).slice(0, PER_SHAPE);
    for (const t of longest) drawn.push({ shape, trail: said(t), html: renderToStaticMarkup(React.createElement(Crumbs, { items: t })) });
  }
  if (!drawn.length) { console.log(`RED ${GATE}: the builders gave no trail of two steps or more; the probe read nothing`); process.exit(1); }

  /* THE SITE'S STYLESHEET, compiled as scripts/harness/render_page.tsx compiles it, into a directory of its own. */
  const dir = mkdtempSync(join(tmpdir(), "crumb-trails-"));
  const cssPath = join(dir, "site.css");
  execFileSync(process.execPath, ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", cssPath, "--minify"], { stdio: "pipe" });
  const css = readFileSync(cssPath, "utf8");
  const page = (navs: string[]) => `<!doctype html><html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>${css}</style></head><body style="font-family: var(--font-body);">${navs.map((n) => `<div class="relative max-w-content mx-auto ${GUTTER} pt-4"><div class="spine-scope"><div>${n}</div></div></div>`).join("")}</body></html>`;

  /* THE PLANT: the longest trail drawn, with the wrap and the one-line height taken off (the nav of before the fix). */
  const longestAll = [...drawn].sort((a, b) => b.trail.length - a.trail.length)[0];
  const plant = longestAll.html.replace(/\bflex-wrap\b/, "flex-nowrap").replace(/\bmax-h-\[1lh\]/, "");
  const plantFile = join(dir, "plant.html"), trailsFile = join(dir, "trails.html");
  writeFileSync(plantFile, page([plant]));
  writeFileSync(trailsFile, page(drawn.map((d) => d.html)));

  const reds: string[] = [];
  const browser = await chromium.launch();
  try {
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
      const tab = await ctx.newPage();
      await tab.goto(pathToFileURL(plantFile).href, { waitUntil: "load" });
      await tab.evaluate(() => document.fonts && document.fonts.ready);
      const p = await tab.evaluate(crumbCutInPage);
      if (w === 320 && (p.navs !== 1 || p.cuts.length === 0)) reds.push(`BLIND at ${w}: the plant ("${longestAll.trail}" on one line with nothing to give way) read ${p.navs} nav(s) and ${p.cuts.length} cut(s); the reading must see it cut`);
      await tab.goto(pathToFileURL(trailsFile).href, { waitUntil: "load" });
      await tab.evaluate(() => document.fonts && document.fonts.ready);
      const r = await tab.evaluate(crumbCutInPage);
      if (r.navs !== drawn.length) reds.push(`READ SHORT at ${w}: ${drawn.length} trail(s) drawn and ${r.navs} nav(s) read`);
      if (r.runs < r.navs) reds.push(`READ NOTHING at ${w}: ${r.navs} nav(s) and ${r.runs} visible text run(s); every trail shows at least its first step`);
      for (const c of r.cuts) reds.push(`CRUMB CUT at ${w}: ${c.msg} ("${c.trail}")`);
      console.log(`${GATE} @${w}: plant ${p.cuts.length} cut (must be over 0 at 320), ${r.navs} trail(s) read, ${r.runs} visible run(s), ${r.cuts.length} cut`);
      await ctx.close();
    }
  } finally {
    await browser.close();
    rmSync(dir, { recursive: true, force: true });
  }
  for (const d of drawn) console.log(`  ${d.shape.padEnd(14)} ${String(d.trail.length).padStart(3)} chars  ${d.trail}`);
  if (reds.length) {
    for (const m of reds) console.log(`RED ${GATE}: ${m}`);
    console.log(`RED ${GATE}: ${reds.length} red(s). Remedy: keep Crumbs a one-line nav that wraps into its hidden second line (flex-wrap, max-h-[1lh], overflow-hidden), each step after the first one unit with its slash, so a step gives way whole and the page's own step first; never an ellipsis, never a scroll`);
    process.exit(1);
  }
  console.log(`PASS ${GATE}: ${drawn.length} trail(s) over ${shapes.size} shape(s) at ${WIDTHS.join(", ")}, none cut; the plant was seen cut`);
}

void main().catch((e) => { console.error(`RED ${GATE}: ${String(e?.stack ?? e)}`); process.exit(1); });
