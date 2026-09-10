/* THE HARNESS RENDERER. Renders the archetype stories to one static HTML file
   over the site's own compiled stylesheet, without Next and without the
   network, so the checks measure what the site would draw.
   usage, from E:/atlas/website:
     npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_archetypes.tsx
   writes scratchpad/harness/archetypes.html and instances.json */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
/* Site-root asset paths (src="/cities/x.jpeg") resolve only under a server; a static file needs the public folder spelled out. */
const PUBLIC_URL = pathToFileURL(process.cwd() + "/public/").href;
const mapAssets = (html: string) => html.replace(/(src|href)="\/(cities|spine|flags)\//g, (_m, a, d) => `${a}="${PUBLIC_URL}${d}/`);
import { AnswerCardStories, RankedBarsStories, pickCityDistrictInstances, CompareTableStories, CardPagerStories, CityCardsStories, TiersTableStories, RangeStripStories, SpectraTableStories, NoteListStories, TerminusStories, PayBarsStories, KvGridStories, DetailPanelStories, IncomeBreakdownStories, BentoBandStories, MarkListStories, CityHeroStories, CityVerdictStories, pickCityVerdictInstances, pickAnswerCardInstances, pickRankedBarsInstances, pickCompareTableInstances, pickCardPagerInstances, pickTiersTableInstances, pickRangeStripInstances, pickSpectraTableInstances, pickNoteListInstances, pickTerminusInstances, pickPayBarsInstances, pickKvGridInstances, pickDetailPanelInstances, pickIncomeBreakdownInstances, pickBentoBandInstances, pickMarkListInstances, pickCityStripInstances, cityStripKey, pickCityReadsInstances, pickCityCloseInstances, pickAllInstances, StoriesIndex, pickCityPeerInstances } from "../../src/components/spine/archetypes/stories";

const CSS_PATH = "scratchpad/pages/site.css";
try {
  execFileSync(process.execPath, ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", CSS_PATH, "--minify"], { stdio: "pipe" });
} catch {
  /* a stale stylesheet still renders */
}
const css = readFileSync(CSS_PATH, "utf8");
import { loadCityHeroInstances } from "../../src/lib/spine/city_hero_facts";
import { SpineShell } from "../../src/components/spine/shell";
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, free memory printed; a wrong ground stops here with the remedy. */
preflight({ name: "render_archetypes" });

async function main() {
const cityHero = await loadCityHeroInstances();
const cityStrips = pickCityStripInstances(cityHero);
const cityReads = pickCityReadsInstances(cityHero);
const cityCloses = pickCityCloseInstances(cityHero);
const instances = pickAllInstances(cityHero);
/* THE SHEET MOUNTS THE SAME SHELL THE PAGE DOES (sys:sheet-mounts-shell,
   2026-09-11). render_page.tsx has always wrapped its output in SpineShell and
   this file did not, so a story and the card it stands for rendered under
   different stylesheets: everything the shell owned , the grey ground, the
   `.spine-scope` icon accent , was missing here, and a story could be judged
   clean while the real card drew differently. The figure face was the loudest
   case and is now fixed at the root (globals.css owns `.fig`), which is what
   makes this wrap safe rather than a second place to keep in sync: the shell
   carries no stylesheet of its own any more, only the scope and the ground. */
const body = renderToStaticMarkup(
  <SpineShell>
  <main className="mx-auto max-w-[1120px] px-4 py-10">
    <StoriesIndex instances={instances} />
    <AnswerCardStories instances={instances["answer-card"]} />
    <RankedBarsStories instances={pickRankedBarsInstances()} city={pickCityDistrictInstances(cityHero)} />
    <CompareTableStories instances={pickCompareTableInstances()} city={pickCityPeerInstances(cityHero)} />
    <CardPagerStories instances={instances["card-pager"]} />
    <CityCardsStories instances={instances["city-cards"]} />
    <TiersTableStories instances={instances["tiers-table"]} />
    <RangeStripStories instances={pickRangeStripInstances()} city={cityStrips} />
    <SpectraTableStories instances={pickSpectraTableInstances()} city={cityReads} />
    <NoteListStories instances={instances["note-list"]} />
    <TerminusStories instances={pickTerminusInstances()} city={cityCloses} />
    <PayBarsStories instances={instances["pay-bars"]} />
    <KvGridStories instances={instances["kv-grid"]} />
    <DetailPanelStories instances={instances["detail-panel"]} />
    <IncomeBreakdownStories instances={instances["income-breakdown"]} />
    <BentoBandStories instances={instances["bento-band"]} city={cityHero} />
    <MarkListStories instances={instances["mark-list"]} />
    <CityHeroStories instances={cityHero} />
    <CityVerdictStories instances={pickCityVerdictInstances(cityHero)} />
  </main>
  </SpineShell>,
);
const html = `<!doctype html><html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: Space Grotesk, ui-sans-serif, system-ui, sans-serif;"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Archetype stories</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap"><style>${css}</style></head><body class="bg-[var(--c-bg)] text-[var(--c-ink)]">${body}</body></html>`;
mkdirSync("scratchpad/harness", { recursive: true });
writeFileSync("scratchpad/harness/archetypes.html", mapAssets(html));
writeFileSync("scratchpad/harness/instances.json", JSON.stringify(instances, null, 2));
for (const [k, v] of Object.entries(instances)) console.log("rendered", k, v.length, "instances:", v.map((i) => i.iso2).join(" "));
}
void main();
