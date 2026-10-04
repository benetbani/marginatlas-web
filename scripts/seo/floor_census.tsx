/**
 * THE FLOOR CENSUS (milestone 1, M10; his interview of 2026-09-26, answer 6: "UK pages + every page at its floor; thin pages
 * noindexed until they reach it"). Renders every spine page outside the United Kingdom the way the harness does (the same seed
 * builders and views, the same shell), counts its blocks (scripts/lib/block_count.mjs, the model laws' BLOCK FLOOR without a
 * browser) and writes data/seo/floor_census.json, which src/lib/seo/indexable.ts reads for each page's robots tag and the sitemap.
 *
 * WHICH PAGES: every country page and its how-to page, every city page, every industry page, and the trade pages the sitemap
 * lists (its US and regional sets, read the way the sitemap reads them). UK pages are not counted: they index by his rule whatever
 * their count. A page whose seed builder returns nothing is not counted either: its route answers 404.
 *
 * Needs the database (the trade pages' seeds read it) and runs by hand, never in the chain:
 *   node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs \
 *     --require ./scripts/spikes/stub_next_font.cjs scripts/seo/floor_census.tsx [--only=country,howto,city,industry,cell] [--limit=N]
 * The chain's `floor-census-fresh` gate holds the file to the harness renders it can see; after a change that adds or removes a
 * block anywhere, run this again and commit the file.
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, writeFileSync } from "node:fs";
import cityListJson from "../../data/cities/city_list_v1.json";
import { COUNTRIES, SLUG_TO_INDUSTRY } from "../../src/lib/taxonomy";
import { RETIRED } from "../../src/lib/taxonomy/retired";
import { getTopCells, getTopRegionalCells, slugify, regionalCellUrl, withBudget } from "../../src/lib/cells";
import { buildSpineCountrySeed } from "../../src/lib/spine/adapt_country";
import { buildSpineCitySeed } from "../../src/lib/spine/adapt_city";
import { buildSpineCellSeed } from "../../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../../src/lib/spine/adapt_industry";
import { SpineCountryBody } from "../../src/components/spine/country/country-view";
import { SpineCityBody } from "../../src/components/spine/city/city-view";
import { SpineCellBody } from "../../src/components/spine/cell/cell-view";
import { SpineIndustryBody } from "../../src/components/spine/industry/industry-view";
import { SpineShell } from "../../src/components/spine/shell";
import { HowToBody } from "../../src/components/spine/country/how-to-view";
import { countTopBlocks, floorsFromLaws } from "../lib/block_count.mjs";

type Surface = "country" | "howto" | "city" | "industry" | "cell";
type Entry = { surface: Surface; blocks: number };

const args = process.argv.slice(2);
const only = (args.find((a) => a.startsWith("--only="))?.slice(7) ?? "country,howto,city,industry,cell").split(",") as Surface[];
const limit = Number(args.find((a) => a.startsWith("--limit="))?.slice(8) ?? "0") || Infinity;
const FILE = "data/seo/floor_census.json";
const floors = floorsFromLaws(readFileSync("scripts/harness/check_model_laws.mjs", "utf8")) as Record<string, number>;

/* The views render inside the shell and SiteChrome's main, as the harness and production draw them. */
const shelled = (el: React.ReactElement) => React.createElement("main", { className: "relative max-w-content mx-auto px-6 pt-4" }, React.createElement(SpineShell as any, null, el));
const quiet = async <T,>(fn: () => Promise<T>): Promise<T> => {
  const log = console.log, warn = console.warn, err = console.error;
  console.log = () => {}; console.warn = () => {}; console.error = () => {};
  try { return await fn(); } finally { console.log = log; console.warn = warn; console.error = err; }
};

async function render(surface: Surface, slugs: string[]): Promise<number | null> {
  return quiet(async () => {
    let el: React.ReactElement | null = null;
    if (surface === "country") { const d = await buildSpineCountrySeed(slugs[0]); el = d ? shelled(React.createElement(SpineCountryBody as any, { data: d })) : null; }
    if (surface === "howto") el = React.createElement("main", { className: "mx-auto max-w-[1120px] px-4 py-2 md:px-6" }, React.createElement(SpineShell as any, null, React.createElement(HowToBody as any, { iso2: slugs[0].toUpperCase() })));
    if (surface === "city") { const d = await buildSpineCitySeed(slugs[0]); el = d ? shelled(React.createElement(SpineCityBody as any, { data: d })) : null; }
    if (surface === "industry") { const d = await buildSpineIndustrySeed(slugs[0]); el = d ? shelled(React.createElement(SpineIndustryBody as any, { data: d })) : null; }
    if (surface === "cell") { const d = await buildSpineCellSeed(slugs[0], slugs[1], slugs[2]); el = d ? shelled(React.createElement(SpineCellBody as any, { data: d })) : null; }
    if (!el) return null;
    const html = renderToStaticMarkup(el);
    /* A how-to body for a country the builder does not hold renders nothing inside its main: the route answers 404. */
    if (surface === "howto" && !html.includes("data-block")) return null;
    return countTopBlocks(html) as number;
  });
}

async function candidates(): Promise<Array<{ surface: Surface; slugs: string[]; path: string }>> {
  const out: Array<{ surface: Surface; slugs: string[]; path: string }> = [];
  const isos = (COUNTRIES as Array<{ code: string }>).map((c) => c.code.toLowerCase()).filter((c) => c !== "gb");
  if (only.includes("country")) for (const iso of isos) out.push({ surface: "country", slugs: [iso.toUpperCase()], path: `/${iso}` });
  if (only.includes("howto")) for (const iso of isos) out.push({ surface: "howto", slugs: [iso.toUpperCase()], path: `/${iso}/how-to-open` });
  if (only.includes("city")) for (const c of (cityListJson as { cities: Array<{ slug: string; iso2: string }> }).cities) if (String(c.iso2).toUpperCase() !== "GB") out.push({ surface: "city", slugs: [c.slug], path: `/cities/${c.slug}` });
  if (only.includes("industry")) for (const slug of Object.keys(SLUG_TO_INDUSTRY as Record<string, unknown>)) if (!(slug in RETIRED)) out.push({ surface: "industry", slugs: [slug], path: `/industries/${slug}` });
  if (only.includes("cell")) {
    /* The trade pages the sitemap lists, read as it reads them (src/app/sitemap.ts, the US and the regional sets). */
    const us = await quiet(() => withBudget(getTopCells(500), [], 60_000, "census:usCells"));
    const regional = await quiet(() => withBudget(getTopRegionalCells(300), [], 60_000, "census:regionalCells"));
    const paths = new Set<string>();
    for (const c of us as any[]) if (c.geo_name && (c.industry_description || c.naics_6)) paths.add(`/${String(c.country).toLowerCase()}/${slugify(c.geo_name)}/${slugify(c.industry_description || c.naics_6)}`);
    for (const c of regional as any[]) if ((c.quality_score ?? 0) >= 40) { const u = regionalCellUrl(c); if (u) paths.add(u); }
    for (const p of paths) { const parts = p.split("/").filter(Boolean); if (parts.length === 3 && parts[0] !== "gb") out.push({ surface: "cell", slugs: parts, path: p }); }
  }
  return out;
}

async function main() {
  const prior = (() => { try { return JSON.parse(readFileSync(FILE, "utf8")); } catch { return null; } })();
  const pages: Record<string, Entry> = only.length === 5 ? {} : { ...(prior?.pages ?? {}) };
  const list = (await candidates()).slice(0, limit);
  let done = 0, none = 0;
  const started = Date.now();
  for (const c of list) {
    let blocks: number | null = null;
    try { blocks = await render(c.surface, c.slugs); } catch { blocks = null; }
    if (blocks == null) { none++; delete pages[c.path]; } else pages[c.path] = { surface: c.surface, blocks };
    done++;
    if (done % 50 === 0) console.log(`floor census: ${done} of ${list.length} (${Math.round((Date.now() - started) / 1000)}s)`);
  }
  const atFloor = Object.values(pages).filter((e) => e.blocks >= (floors[e.surface] ?? Infinity)).length;
  const file = {
    why: "The floor census (milestone 1, M10; his interview of 2026-09-26, answer 6): each spine page outside the United Kingdom with its block count, read by src/lib/seo/indexable.ts. A page indexes when its count meets its type's floor (`floors`, the model laws' FLOOR_BY_SURFACE); UK pages index by his rule and are not counted. Written by scripts/seo/floor_census.tsx; never edited by hand.",
    generated_at: new Date().toISOString(),
    floors,
    pages: Object.fromEntries(Object.entries(pages).sort(([a], [b]) => a.localeCompare(b))),
  };
  writeFileSync(FILE, `${JSON.stringify(file, null, 1)}\n`);
  console.log(`floor census: ${Object.keys(pages).length} pages counted (${atFloor} at their floor), ${none} with no page, written to ${FILE}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
