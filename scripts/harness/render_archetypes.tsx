/* THE HARNESS RENDERER. Renders the archetype stories to one static HTML file
   over the site's own compiled stylesheet, without Next and without the
   network, so the checks measure what the site would draw.
   usage, from E:/atlas/website:
     npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/harness/render_archetypes.tsx
   writes scratchpad/harness/archetypes.html and instances.json
     ... render_archetypes.tsx --only=<kind>[/<key>]
   renders ONE KIND's stories (with a key: that kind's static stories and the one
   city the key names; without one: every story of the kind) to
   scratchpad/harness/archetypes-only.html and its census to instances-only.json,
   leaving the full sheet and its census untouched. A kind or key that matches
   nothing stops with exit 2, the kinds, and the keys of the nearest kind.

   THE TARGETED FORM, plan step 21 (2026-09-17), measured on this machine
   with 1.5 to 2.2 GB free, each to a file with date +%s before and after:
     npm run harness -- --only=ranked-bars/london:districts   14 s compiling the stylesheet, 6 s reusing it
     npm run harness:page -- --only=city --section=districts  19 s
     npm run harness:archetypes (the sheet, 107 stories)      29 s
     npm run harness (the sheet, then the three listed pages) 43 s
   Where the full render's time goes: loadCityHeroInstances scans forty city
   seeds for the one-tile city (about 9 s of its 10), the stylesheet compile is
   4 s, tsx starts in 2 s, and the React render of every story is milliseconds.
   So the targeted form loads only the city its key names, and reuses the
   compiled stylesheet when it is provably newer than every input Tailwind
   reads (src/**, the config, the lockfile); the full form still compiles it
   every time, unchanged, and so does render_page.tsx, which is 4 s of the
   targeted page form's 19. */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync, readFileSync, mkdirSync, existsSync, statSync, readdirSync, utimesSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
/* Site-root asset paths (src="/cities/x.jpeg") resolve only under a server; a static file needs the public folder spelled out. */
const PUBLIC_URL = pathToFileURL(process.cwd() + "/public/").href;
const mapAssets = (html: string) => html.replace(/(src|href)="\/(cities|countries|spine|flags)\//g, (_m, a, d) => `${a}="${PUBLIC_URL}${d}/`);
import { StockTiersStories, SurvivalCurveStories, ObstaclesStories, SpendByIncomeStories, SpendByAgeStories, LocalAppsStories, MarketHoldStories, JobMarketStories, ThresholdsStories, AgeMixStories, CustomersComeStories, OriginStories, AnswerCardStories, HeroBoardStories, DonutStories, RingStories, WorkedFigureStories, StepperStories, SegmentBarStories, MonthBarsStories, ShareBarStories, RankedBarsStories, pickCityDistrictInstances, CompareTableStories, CardPagerStories, CityCardsStories, TiersTableStories, RangeStripStories, SpectraTableStories, NoteListStories, TerminusStories, PayBarsStories, KvGridStories, DetailPanelStories, IncomeBreakdownStories, BentoBandStories, BentoMetricStories, MarkListStories, BlockedSeatStories, CityHeroStories, pickRankedBarsInstances, pickCompareTableInstances, pickRangeStripInstances, pickSpectraTableInstances, pickTerminusInstances, pickCityStripInstances, pickCityCloseInstances, pickAllInstances, StoriesIndex, pickCityPeerInstances } from "../../src/components/spine/archetypes/stories";
import type { CityHeroInstance } from "../../src/lib/spine/city_hero_facts";
import { loadCityHeroInstances } from "../../src/lib/spine/city_hero_facts";
import { CELL_INSTANCES, loadCellHeroInstances, type CellHeroInstance } from "../../src/lib/spine/trade_hero_facts";
import { INDUSTRY_INSTANCES, servesSlate, SLATE_BLOCKS, loadIndustryPlacesInstances, type IndustryPlacesInstance } from "../../src/lib/spine/industry_hero_facts";
import { SpineShell } from "../../src/components/spine/shell";
import { preflight } from "./preflight.mjs";

/* THE GROUND FIRST (sys:harness-preflight, run 24): the site root, free memory printed; a wrong ground stops here with the remedy. */
preflight({ name: "render_archetypes" });

const CSS_PATH = "scratchpad/pages/site.css";
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice("--only=".length) ?? null;
const ONLY_HTML = "scratchpad/harness/archetypes-only.html";
const ONLY_CENSUS = "scratchpad/harness/instances-only.json";
const CENSUS = "scratchpad/harness/instances.json";

/* THE STYLESHEET IS REUSED ONLY WHEN IT IS PROVABLY FRESH, and only by the
   targeted form: newer than every file Tailwind's content glob reads (src/**),
   its config, the lockfile that pins its plugins, and the tokens module the
   config imports (under src already). One file newer than the sheet, or no
   sheet at all, and it is compiled exactly as the full form compiles it. */
function newestUnder(dir: string): number {
  let newest = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    const t = e.isDirectory() ? newestUnder(p) : statSync(p).mtimeMs;
    if (t > newest) newest = t;
  }
  return newest;
}
function stylesheetFresh(): boolean {
  if (!existsSync(CSS_PATH)) return false;
  const css = statSync(CSS_PATH).mtimeMs;
  const inputs = [newestUnder("src"), ...["tailwind.config.ts", "postcss.config.js", "package-lock.json"].map((f) => (existsSync(f) ? statSync(f).mtimeMs : 0))];
  return Math.max(...inputs) < css;
}
if (ONLY != null && stylesheetFresh()) {
  console.log(`stylesheet ${CSS_PATH}: reused, newer than every input Tailwind reads`);
} else {
  try {
    execFileSync(process.execPath, ["node_modules/tailwindcss/lib/cli.js", "-i", "src/app/globals.css", "-o", CSS_PATH, "--minify"], { stdio: "pipe" });
    /* THE COMPILE IS STAMPED. Tailwind's CLI leaves the file alone when the
       CSS it produced is byte-identical (measured 2026-09-17: "Done in 4275ms"
       and the mtime unmoved), so the mtime would record the last CHANGE and
       not the last compile, and the freshness test above would recompile on
       every targeted run after any edit anywhere under src, forever. The
       stamp says "compiled against the inputs as of now", which is the fact. */
    const now = new Date();
    utimesSync(CSS_PATH, now, now);
  } catch {
    /* a stale stylesheet still renders */
  }
}
const css = readFileSync(CSS_PATH, "utf8");

/* THE SHEET, IN ORDER, ONCE. The full render draws every entry; the targeted
   render draws one. Each entry says what it takes from the city set so the
   targeted form can load exactly that: "keyed" kinds take the cities the key
   names, "london" is the bento clusters (BentoBandStories reads London by
   name), "none" is a kind that never reads a city seed. */
/* THE CELL SEEDS (plan step 33's first dispatch, 2026-09-18): the trade page's
   `00 take` and `01 spread` stories draw off real cell seeds the way the city
   hero draws off city seeds, keyed cell:<handle>:<block> over the handles
   trade_hero_facts.ts names (London, California, Mumbai cafes). A kind that
   reads them says `cell: "keyed"`; the targeted form loads the one handle the
   key names, the full form all three. The suits stories need no seed. */
type Ctx = { instances: Record<string, { iso2: string; why: string }[]>; cityHero: CityHeroInstance[]; cellHero: CellHeroInstance[]; industryPlaces: IndustryPlacesInstance[] };
type Entry = { kind: string; city: "keyed" | "london" | "none"; cell?: "keyed"; industry?: "places"; render: (c: Ctx) => React.ReactNode };
const SHEET: Entry[] = [
  { kind: "answer-card", city: "none", cell: "keyed", render: (c) => <AnswerCardStories instances={c.instances["answer-card"]} cell={c.cellHero} /> },
  /* The country masthead to his design of 2026-09-20 (HeroBoard.tsx), over the answer card's country instances. */
  { kind: "hero-board", city: "none", render: (c) => <HeroBoardStories instances={c.instances["hero-board"]} /> },
  /* The donut, his B9 and the gold standard's B28 (Donut.tsx, 2026-09-20): the trade's mix and the industry's channels off the cell seeds and the shards. */
  { kind: "donut", city: "none", cell: "keyed", render: (c) => <DonutStories cell={c.cellHero} /> },
  /* The ring, his B4 and the gold standard's B31 (Ring.tsx, 2026-09-20): the trade's share of a day off the cell seeds. */
  { kind: "ring", city: "none", cell: "keyed", render: (c) => <RingStories cell={c.cellHero} /> },
  /* The worked figure (WorkedFigure.tsx, 2026-09-20 night): the trade's `16 customers`, one customer's year over the pair it is worked out from, off the cell seeds. */
  { kind: "worked-figure", city: "none", cell: "keyed", render: (c) => <WorkedFigureStories cell={c.cellHero} /> },
  /* The steps to register (Stepper.tsx, 2026-09-23): the how-to page's sequence at its longest, its common shape and its floor. */
  { kind: "stepper", city: "none", render: () => <StepperStories /> },
  /* The segmented bar, his gold standard's B27 (SegmentBar.tsx): the city's among-cities and season cards, drawn by the page's own components. */
  { kind: "segment-bar", city: "none", render: () => <SegmentBarStories /> },
  /* The month columns and the share bar, his gold standard's B30 and B29 (MonthBars.tsx, ShareBar.tsx, 2026-09-20 late evening): the trade market bento's swing and dayparts cells off the cell seeds. */
  { kind: "month-bars", city: "none", cell: "keyed", render: (c) => <MonthBarsStories cell={c.cellHero} /> },
  { kind: "share-bar", city: "none", cell: "keyed", render: (c) => <ShareBarStories cell={c.cellHero} /> },
  /* The cost to open's held state (cell/turn-one.tsx) reads a cell seed since plan step 33's second dispatch (2026-09-18). */
  { kind: "ranked-bars", city: "keyed", cell: "keyed", render: (c) => <RankedBarsStories instances={pickRankedBarsInstances()} city={pickCityDistrictInstances(c.cityHero)} cell={c.cellHero} /> },
  /* The trade's peers table (cell/turn-one.tsx PeersCard) reads a cell seed since plan step 33's fourth dispatch (2026-09-18). */
  /* The industry's places table (industry/turn-two.tsx PlacesTable) reads the slate the sheet resolves since plan step 34's third dispatch (2026-09-19); its seated state is on blocked-seat. */
  { kind: "compare-table", city: "keyed", cell: "keyed", industry: "places", render: (c) => <CompareTableStories instances={pickCompareTableInstances()} city={pickCityPeerInstances(c.cityHero)} cell={c.cellHero} industry={c.industryPlaces} /> },
  { kind: "card-pager", city: "none", render: (c) => <CardPagerStories instances={c.instances["card-pager"]} /> },
  { kind: "city-cards", city: "none", render: (c) => <CityCardsStories instances={c.instances["city-cards"]} /> },
  /* The team (cell/turn-one.tsx) reads a cell seed since plan step 33's third dispatch (2026-09-18); the seven-row planted key needs none. */
  { kind: "tiers-table", city: "none", cell: "keyed", render: (c) => <TiersTableStories instances={c.instances["tiers-table"]} cell={c.cellHero} /> },
  /* The city strips build by the slug since plan step 32's fourth dispatch (2026-09-18), so the kind reads no city seed. */
  { kind: "range-strip", city: "none", cell: "keyed", render: (c) => <RangeStripStories instances={pickRangeStripInstances()} city={pickCityStripInstances()} cell={c.cellHero} /> },
  { kind: "spectra-table", city: "none", render: () => <SpectraTableStories instances={pickSpectraTableInstances()} /> },
  { kind: "note-list", city: "none", render: (c) => <NoteListStories instances={c.instances["note-list"]} /> },
  /* The trade's close (cell/exit.tsx CloseCard) reads a cell seed since plan step 33's sixth dispatch (2026-09-18); the industry's close (industry/turn-three.tsx) reads the slate the sheet resolves since plan step 34's fourth dispatch (2026-09-19), so its city door is drawn exactly where the places table is. */
  { kind: "terminus", city: "keyed", cell: "keyed", industry: "places", render: (c) => <TerminusStories instances={pickTerminusInstances()} city={pickCityCloseInstances(c.cityHero)} cell={c.cellHero} industry={c.industryPlaces} /> },
  { kind: "pay-bars", city: "none", render: (c) => <PayBarsStories instances={c.instances["pay-bars"]} /> },
  /* The permits (cell/turn-one.tsx) read a cell seed since the same dispatch. */
  { kind: "kv-grid", city: "none", cell: "keyed", render: (c) => <KvGridStories instances={c.instances["kv-grid"]} cell={c.cellHero} /> },
  { kind: "detail-panel", city: "none", render: (c) => <DetailPanelStories instances={c.instances["detail-panel"]} /> },
  /* The split (cell/turn-one.tsx) reads a cell seed since the same dispatch. */
  { kind: "income-breakdown", city: "none", cell: "keyed", render: (c) => <IncomeBreakdownStories instances={c.instances["income-breakdown"]} cell={c.cellHero} /> },
  /* The trade's market cluster (cell/market.tsx) reads a cell seed since plan step 33's fifth dispatch (2026-09-18); the three older clusters still read London's city seed. */
  { kind: "bento-band", city: "london", cell: "keyed", render: (c) => <BentoBandStories instances={c.instances["bento-band"]} city={c.cityHero} cell={c.cellHero} /> },
  /* The cost to open's baseline and withheld states read a cell seed since the same dispatch. */
  { kind: "bento-metric", city: "none", cell: "keyed", render: (c) => <BentoMetricStories instances={c.instances["bento-metric"]} cell={c.cellHero} /> },
  /* The trade's rivals list (cell/exit.tsx RivalsCard) reads a cell seed since the same dispatch; its withheld state is on bento-metric. */
  { kind: "mark-list", city: "none", cell: "keyed", render: (c) => <MarkListStories instances={c.instances["mark-list"]} cell={c.cellHero} /> },
  { kind: "blocked-seat", city: "none", industry: "places", render: (c) => <BlockedSeatStories instances={c.instances["blocked-seat"]} industry={c.industryPlaces} /> },
  { kind: "city-hero", city: "keyed", render: (c) => <CityHeroStories instances={c.cityHero} /> },
  /* THE NEW SECTIONS OF 2026-09-25, page-agnostic (his message that night: "Create all these sections page agnostically, we will
     decide later where to put them"): each drawn at a full card's width over the data file its builder reads. */
  { kind: "stock-tiers", city: "none", render: () => <StockTiersStories /> },
  { kind: "survival-curve", city: "none", render: () => <SurvivalCurveStories /> },
  { kind: "obstacles", city: "none", render: () => <ObstaclesStories /> },
  { kind: "spend-by-income", city: "none", render: () => <SpendByIncomeStories /> },
  { kind: "spend-by-age", city: "none", render: () => <SpendByAgeStories /> },
  { kind: "local-apps", city: "none", render: () => <LocalAppsStories /> },
  { kind: "market-hold", city: "none", render: () => <MarketHoldStories /> },
  { kind: "job-market", city: "none", render: () => <JobMarketStories /> },
  { kind: "thresholds", city: "none", render: () => <ThresholdsStories /> },
  { kind: "age-mix", city: "none", render: () => <AgeMixStories /> },
  { kind: "customers-come", city: "none", render: () => <CustomersComeStories /> },
  { kind: "origin", city: "none", render: () => <OriginStories /> },
  /* "city-verdict" left the sheet on plan step 32 (2026-09-18): MODEL.md 8.3 dissolves the rent verdict into the masthead's answer. */
];
function shell(body: string): string {
  return `<!doctype html><html lang="en" style="--font-sans: Geist, ui-sans-serif, system-ui, sans-serif; --font-serif: Space Grotesk, ui-sans-serif, system-ui, sans-serif;"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Archetype stories</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap"><style>${css}</style><style>/* THE SHEET'S PAGE IS THE DESKTOP PAGE (2026-09-20, the evening the prose measure was capped at half the page, globals.css --measure-half): a story stands at the width its seat takes on the page at 1280 and is checked at three viewports without re-laying, so the half it measures against is the desktop's 536px at every viewport; the viewport-relative token read 360px at 768 on a 653px story and put a blank half beside every wrapped line (eleven LONE STAT reds that no page shows). The pages are measured by the page laws at real widths. */:root{--measure-half:536px}</style></head><body class="bg-[var(--c-bg)] text-[var(--c-ink)]" style="font-family: var(--font-body);">${body}</body></html>`;
}

/* ONE CITY BY NAME, for the targeted form: the seed the sheet would have built
   for it, and nothing scanned. */
async function loadOneCity(slug: string): Promise<CityHeroInstance[]> {
  const { buildSpineCitySeed } = await import("../../src/lib/spine/adapt_city");
  const seed = await buildSpineCitySeed(slug);
  return seed ? [{ slug, why: "the city the --only key names", seed }] : [];
}

/* The edit distance, for naming the nearest kind on a miss. */
function distance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

/* THE MISS, LOUD: exit 2 (the ground's exit, never a finding's 1), every kind,
   and the keys of the nearest kind from the last full render's census when one
   exists (the complete list, cities included), else from the live static picks. */
function miss(kind: string, key: string | null, live: Record<string, { iso2: string }[]>): never {
  const kinds = SHEET.map((e) => e.kind);
  const nearest = kinds.includes(kind) ? kind : kinds.slice().sort((a, b) => distance(a, kind) - distance(b, kind))[0];
  const census: Record<string, { iso2: string }[]> = existsSync(CENSUS) ? JSON.parse(readFileSync(CENSUS, "utf8")) : live;
  const source = existsSync(CENSUS) ? `from the last full render's census, ${CENSUS}` : "from the live picks, no full render's census on disk";
  console.error(`render_archetypes --only=${kind}${key ? `/${key}` : ""}: no such ${kinds.includes(kind) ? "key" : "kind"} on the sheet.`);
  console.error(`  kinds: ${kinds.join(", ")}`);
  console.error(`  keys of ${nearest} (${source}): ${(census[nearest] ?? []).map((i) => i.iso2).join(", ") || "(none)"}`);
  process.exit(2);
}

async function main() {
if (ONLY != null) {
  const slash = ONLY.indexOf("/");
  const kind = slash === -1 ? ONLY : ONLY.slice(0, slash);
  const key = slash === -1 ? null : ONLY.slice(slash + 1);
  const entry = SHEET.find((e) => e.kind === kind);
  if (!entry || (key != null && key === "")) miss(kind, key, pickAllInstances([]));
  /* THE CITIES THIS STORY NEEDS, and no scan: a key whose first segment is a
     city slug loads that city; a whole keyed kind loads the sheet's set; the
     bento clusters load London; the rest load nothing. */
  const cityList = (JSON.parse(readFileSync("data/cities/city_list_v1.json", "utf8")) as { cities: { slug: string }[] }).cities.map((c) => c.slug);
  const slug = key != null ? key.split(":")[0] : null;
  const cityHero: CityHeroInstance[] =
    entry!.city === "london" ? await loadOneCity("london")
    : entry!.city === "none" ? []
    : key == null ? await loadCityHeroInstances()
    : slug != null && cityList.includes(slug) ? await loadOneCity(slug)
    : [];
  /* THE CELLS THIS STORY NEEDS: a key whose first segment is "cell" loads the
     handle its second segment names (nothing for a handle the table does not
     hold, such as the planted "none"); a whole keyed kind loads all three. */
  const cellHandle = key != null && key.startsWith("cell:") ? key.split(":")[1] : null;
  const cellHero: CellHeroInstance[] =
    entry!.cell !== "keyed" ? []
    : key == null ? await loadCellHeroInstances()
    : cellHandle != null && cellHandle in CELL_INSTANCES ? await loadCellHeroInstances([cellHandle])
    : [];
  /* THE SLATE THIS STORY NEEDS (plan step 34's third dispatch, the close
     added by the fourth): a key whose first segment is "industry" and whose
     block reads the slate ("places", or "close", whose city door is the
     table's top row) resolves the one handle its second segment names
     against the database; a whole keyed kind resolves every handle serving
     either block; the rest load nothing. */
  const industryHandle = key != null && key.startsWith("industry:") && SLATE_BLOCKS.some((b) => key.endsWith(`:${b}`)) ? key.split(":")[1] : null;
  const industryPlaces: IndustryPlacesInstance[] =
    entry!.industry !== "places" ? []
    : key == null ? await loadIndustryPlacesInstances()
    : industryHandle != null && industryHandle in INDUSTRY_INSTANCES && servesSlate(industryHandle) ? await loadIndustryPlacesInstances([industryHandle])
    : [];
  const all = pickAllInstances(cityHero, cellHero, industryPlaces);
  const held = all[kind] ?? [];
  const selected = key == null ? held : held.filter((i) => i.iso2 === key);
  if (selected.length === 0) miss(kind, key, all);
  const body = renderToStaticMarkup(
    <SpineShell>
    <main className="mx-auto max-w-[1120px] px-4 py-10">
      {entry!.render({ instances: all, cityHero, cellHero, industryPlaces })}
    </main>
    </SpineShell>,
  );
  mkdirSync("scratchpad/harness", { recursive: true });
  writeFileSync(ONLY_HTML, mapAssets(shell(body)));
  writeFileSync(ONLY_CENSUS, JSON.stringify({ [kind]: selected }, null, 2));
  console.log(`rendered ${kind}, ${key == null ? `every story of the kind (${held.length})` : `the story ${key}`}, with ${cityHero.length} city seed(s), ${cellHero.length} cell seed(s) and ${industryPlaces.length} industry slate(s) loaded, to ${ONLY_HTML}`);
  return;
}
const cityHero = await loadCityHeroInstances();
const cellHero = await loadCellHeroInstances();
const industryPlaces = await loadIndustryPlacesInstances();
const instances = pickAllInstances(cityHero, cellHero, industryPlaces);
/* THE SHEET MOUNTS THE SAME SHELL THE PAGE DOES (sys:sheet-mounts-shell,
   2026-09-11). render_page.tsx has always wrapped its output in SpineShell and
   this file did not, so a story and the card it stands for rendered under
   different stylesheets: everything the shell owned , the grey ground, the
   `.spine-scope` icon accent , was missing here, and a story could be judged
   clean while the real card drew differently. The figure face was the loudest
   case and is now fixed at the root (globals.css owns `.fig`), which is what
   makes this wrap safe rather than a second place to keep in sync: the shell
   carries no stylesheet of its own any more, only the scope and the ground. */
const ctx: Ctx = { instances, cityHero, cellHero, industryPlaces };
const body = renderToStaticMarkup(
  <SpineShell>
  <main className="mx-auto max-w-[1120px] px-4 py-10">
    <StoriesIndex instances={instances} />
    {SHEET.map((e) => <React.Fragment key={e.kind}>{e.render(ctx)}</React.Fragment>)}
  </main>
  </SpineShell>,
);
mkdirSync("scratchpad/harness", { recursive: true });
writeFileSync("scratchpad/harness/archetypes.html", mapAssets(shell(body)));
writeFileSync(CENSUS, JSON.stringify(instances, null, 2));
for (const [k, v] of Object.entries(instances)) console.log("rendered", k, v.length, "instances:", v.map((i) => i.iso2).join(" "));
}
void main();
