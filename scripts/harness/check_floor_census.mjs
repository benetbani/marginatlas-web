/**
 * THE FLOOR CENSUS IS NOT STALE (milestone 1, M10). data/seo/floor_census.json decides which spine pages outside the United Kingdom
 * a search engine may index (src/lib/seo/indexable.ts); it is written by hand (scripts/seo/floor_census.tsx, which needs the
 * database). This gate holds it to what the chain can see: every harness render outside the UK (scripts/harness/pages.json, the
 * renders `pages-fresh` writes) must count the same blocks the census recorded for its path, with the same counter
 * (scripts/lib/block_count.mjs), and the census's floors must be the model laws' FLOOR_BY_SURFACE.
 *
 * ITS BLIND SPOT: it sees the exemplars only (Afghanistan's country page and the restaurants industry page today); a block added or
 * removed on a page type the list does not render passes here until the census is run again. The census's own header says when.
 *
 * usage: node scripts/harness/check_floor_census.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { countTopBlocks, floorsFromLaws } from "../lib/block_count.mjs";

const census = JSON.parse(readFileSync("data/seo/floor_census.json", "utf8"));
const pages = JSON.parse(readFileSync("scripts/harness/pages.json", "utf8")).pages;
const reds = [];
const pathOf = (p) => {
  if (p.surface === "country") return `/${p.slugs[0].toLowerCase()}`;
  if (p.surface === "howto") return `/${p.slugs[0].toLowerCase()}/how-to-open`;
  if (p.surface === "city") return `/cities/${p.slugs[0]}`;
  if (p.surface === "industry") return `/industries/${p.slugs[0]}`;
  if (p.surface === "cell") return `/${p.slugs.join("/")}`;
  if (p.surface === "hood") return p.slugs[1] ? `/cities/${p.slugs[0]}/neighborhoods/${p.slugs[1]}` : `/cities/${p.slugs[0]}/neighborhoods`;
  return null;
};
/* The UK pages as src/lib/seo/indexable.ts reads them: everything under /gb, and a UK city with its neighbourhood pages. */
const UK_CITIES = new Set(JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")).cities.filter((c) => String(c.iso2).toUpperCase() === "GB").map((c) => c.slug));
const uk = (path) => path === "/gb" || path.startsWith("/gb/") || UK_CITIES.has(/^\/cities\/([a-z0-9-]+)/.exec(path)?.[1] ?? "");

const laws = floorsFromLaws(readFileSync("scripts/harness/check_model_laws.mjs", "utf8"));
if (JSON.stringify(census.floors) !== JSON.stringify(laws)) reds.push(`the census's floors ${JSON.stringify(census.floors)} are not the model laws' ${JSON.stringify(laws)}`);

let held = 0;
for (const p of pages) {
  const path = pathOf(p);
  if (!path || uk(path)) continue;
  const file = `scratchpad/harness/pages/${p.surface}-${p.slugs.join("-")}.html`;
  if (!existsSync(file)) { reds.push(`${path}: no render under scratchpad/harness/pages (run pages-fresh first)`); continue; }
  const blocks = countTopBlocks(readFileSync(file, "utf8"));
  const entry = census.pages[path];
  if (!entry) reds.push(`${path}: the census holds no entry (the render counts ${blocks} blocks)`);
  else if (entry.blocks !== blocks) reds.push(`${path}: the census says ${entry.blocks} blocks, the render counts ${blocks}`);
  else held++;
}

if (reds.length) {
  for (const r of reds) console.log(`x floor-census ${r}. Remedy: run scripts/seo/floor_census.tsx (its header has the command) and commit data/seo/floor_census.json`);
  process.exit(1);
}
console.log(`floor-census: the census (written ${census.generated_at}) holds on ${held} render(s) outside the UK and the model laws' floors`);
