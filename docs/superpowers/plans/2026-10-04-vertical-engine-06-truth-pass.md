# Plan 06: the truth pass (the vertical wired) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** every figure the labels audit found wrong on the UK pages (QUEUE.md section I, the `truth:` rows) prints the register's
figure, the engine's estimate, or nothing; and UK pages credit their sources on one page.

**Architecture:** the vertical engine (merged on branch `truth-pass`, commit 4c0f5f71) holds the UK law, the register slices
(`data/uk/registers/*.json`, Greater London = `E12000007`) and the profit model (`src/lib/uk/pnl/*`, `src/lib/uk/present/*`). This
plan adds two small server-side accessors over the slices and changes the page builders to read them. No page imports the slices
directly; builders do.

**Tech Stack:** Next.js 15 server components, TypeScript, tsx test scripts (`npx tsx tests/...`, PASS lines and `red()` from
`scripts/lib/red`), the prebuild gate chain (`scripts/prebuild_all.ts`), the offline harness renders
(`scripts/harness/render_page.tsx`, see "Render checks" below).

---

## Rulings this plan carries (rules/FOUNDER-VERDICTS.md, 2026-10-04 evening; do not re-ask)

1. London is **Greater London (E12000007)** on every page.
2. UK sources are named on **one Sources and licences section**; every UK page's foot links to it with the licence sentence;
   cards, titles and headings stay free of agency names.
3. A London trade page leads with **break-even** ("a business needs X a year to carry an average London [premises]; Y of 100
   registered businesses take that"), with **what the middle business keeps as a sole trader** beside it and the company's figure
   under the plus.
4. **Period survival first**, the 2019 cohort's record beside it once.
5. Currency (his "idk-push", the loop's reading): dollars on the pages, converted once at the site's pound rate
   (`convertToUsd("GBP", x)`, 1.3265); a law prints in pounds where it already does.

## Copy rules every task obeys (gated: copy-plain, no-caps-labels, ROW SENTENCE, no-em-dashes, no-source-agencies)

Plain words; labels at most three words on a row (an answer card's label may be four); no sentence as a label; never the words
"modelled", "withheld", "measured"; no agency names on cards; no capitals in a card; no em dashes. The word **"estimate"** stands
beside engine money (the engine's rule: its ranges cover the band shape only). Money prints **once rounded**, through
`honestRound(mid, lo, hi)` (`src/lib/uk/present/precision.ts`) on the dollar value: convert the unrounded pounds (mid, lo and hi)
first, then round once. Never re-round a stored, already rounded figure.

## The engine facts this plan relies on (from the maps of 2026-10-04; re-verify before relying on a number)

- `data/uk/registers/turnover.json`: `trades[slug] = { sic: string[], match: "exact"|"shared"|"approx", by_geography }`, 137 slugs;
  `R = by_geography.E12000007` has `enterprises`, `local_units`, `turnover_bands_k` (counts by band, £000 edges), `median_range_k`
  `[lo, hi]`, `quantiles_in_open_band`. Restaurants: 7,865 enterprises, 9,560 local units, median 281,941.82 (range 280.66k to
  283.23k). The hair and beauty code 96020 is shared by barbershops, brow-lash-studios, hairdressers-beauty and nail-salons
  (9,695 enterprises, median 78,625.81).
- `src/lib/uk/pnl/banded.ts`: `bandQuantile(counts, q, shape = "log-flat") -> { k, band, openBelow, openAbove } | null` (k in £000),
  `bandCdf(counts, xK)`, `inOpenBand(xK)`. A quantile below 50k or above 50m prints only in words.
- `src/lib/uk/pnl/london.ts`: `londonWithholding(slug): string | null`, `londonTradeSummary(slug, form?)`,
  `londonTradeRanges(slug, form?) -> { anchorSales, breakEven, shareAbove, keepsQ50, marginAtMedian }` (each `{ lo, mid, hi }`).
  Recipes: barbershops, nail-salons, restaurants, bakeries-retail, sports-fitness, auto-repair-shops, dental-practices. **Money
  prints only where `londonWithholding(slug) === null` and the recipe's `utilitiesCarried` is true: nail-salons, restaurants,
  sports-fitness** (plan 06 rule (g); the engine does not enforce it, the page does). Restaurants: break-even 556,017.36 (535,523.20
  to 577,038.50), share above 0.3212, sole trader keeps 13,756.27 (11,198.28 to 16,056.34).
- `data/uk/registers/survival.json`: `trade_groups[slug] -> string[]` (3-digit SIC groups); `groups[code] = { name,
  births_2019, cohort_2019_five_years, period[5] }`, `period[i] = { year, cohort, hazard, survival, lo, hi }` (i = t - 1, fractions);
  UK-wide, not London. Restaurants (group 561): period 0.940, 0.503, 0.293 at 1, 3, 5 years; cohort 2019 five years 0.391.

## Render checks (every page-changing task)

Render: `node node_modules/tsx/dist/cli.mjs --tsconfig scripts/tsconfig.harness.json --require ./scripts/harness/env.cjs --require
./scripts/spikes/stub_next_font.cjs scripts/harness/render_page.tsx cell gb london restaurants` (also `cell gb london barbershops`,
`cell gb london cafes-coffee-shops`, `cell gb manchester restaurants`, `cell de berlin restaurants`, `country GB`, `city london`).
Photograph with `node scratchpad/reform/shoot_file.mjs <file> <out-prefix> 375,1280 1600` and look at the changed section at both
widths. The probe `node scratchpad/reform/_probe_files.mjs <files>` must show no sideways scroll and no same-tone neighbours.

## Gates and fixtures

Each task names the existing gates whose fixtures pin the old behaviour. Update a fixture to the new behaviour with the reason in a
comment; never weaken a check and never raise a ratchet baseline. New tests are tsx scripts registered in `GATES`
(`scripts/prebuild_all.ts`), then `npx tsx scripts/counts.ts --write`.

---

## WAVE A: the trade pages

### Task A1: the London register accessor

**Files:**
- Create: `src/lib/uk/registers/london_trade.ts`
- Create: `tests/uk/registers/london_trade.test.ts`
- Modify: `scripts/prebuild_all.ts` (register gate `uk-london-trade`)

The one place a builder reads a London trade's register figures. Server only (the slices are 2 MB).

- [ ] **Step 1: Write the failing test** `tests/uk/registers/london_trade.test.ts` in the style of `tests/uk/pnl/london.test.ts`
  (PASS lines, `red({ rule: "uk-london-trade", file, detail, remedy })`, exit 1 on a failure):

```ts
import { londonTradeRegister, londonTradeSales } from "../../../src/lib/uk/registers/london_trade";
// restaurants: exact code, Greater London
const r = londonTradeRegister("restaurants")!;
check("restaurants: 7,865 enterprises and 9,560 local units in Greater London", r.enterprises === 7865 && r.localUnits === 9560);
check("restaurants: an exact match, no shared name", r.match === "exact" && r.sharedGroup === null);
const s = londonTradeSales("restaurants")!;
check("restaurants: the median from the band counts, 281,941.82 pounds", Math.abs(s.medianGbp - 281941.82) < 0.01);
check("restaurants: the median's range from the file, in pounds", s.medianRangeGbp[0] < s.medianGbp && s.medianGbp < s.medianRangeGbp[1]);
check("restaurants: quartiles 124,596.43 and 759,125.14, none in an open band", Math.abs(s.q25.gbp - 124596.43) < 0.01 && Math.abs(s.q75.gbp - 759125.14) < 0.01 && !s.q25.open && !s.q75.open);
check("restaurants: 0.181 take under 100,000 pounds", Math.abs(s.shareUnder100k - 0.181) < 0.001);
// barbershops: the shared hair and beauty code
const b = londonTradeRegister("barbershops")!;
check("barbershops: the shared code's 9,695 enterprises, named as the group", b.enterprises === 9695 && b.match === "shared" && b.sharedGroup === "hair and beauty");
check("an unknown trade has no register row", londonTradeRegister("no-such-trade") === null);
```

- [ ] **Step 2: Run it, expect failure** (`npx tsx tests/uk/registers/london_trade.test.ts`: module not found).
- [ ] **Step 3: Implement** `london_trade.ts`:
  - `londonTradeRegister(slug): { sic: string[]; match: "exact" | "shared" | "approx"; sharedGroup: string | null; enterprises: number; localUnits: number } | null`
    from `turnover.json` `trades[slug].by_geography.E12000007`. `sharedGroup` is a plain lower-case group name for a shared code
    (a map in this file: `"96020": "hair and beauty"`; add any other shared code the file holds, found by listing every
    `match: "shared"` slug and its codes; a shared code without a name in the map makes the function return the row with
    `sharedGroup: "the trades sharing its code"`, and the test lists them so a name is added, never guessed).
  - `londonTradeSales(slug): { medianGbp: number; medianRangeGbp: [number, number]; q25, q50, q75: { gbp: number; open: false } | { open: "below" | "above"; edgeGbp: number }; shareUnder100k: number } | null`
    with `bandQuantile(R.turnover_bands_k, q)` (`k * 1000`), the median range from `R.median_range_k` (× 1000), the share under
    100k from `bandCdf(R.turnover_bands_k, 100)`; an open quantile carries its edge (50,000 or 50,000,000) and no figure.
  - Both return null when the slug has no Greater London row.
- [ ] **Step 4: Run the test, expect PASS.**
- [ ] **Step 5: Register** `{ name: "uk-london-trade", script: "tests/uk/registers/london_trade.test.ts" }` beside the other `uk-` gates; `npx tsx scripts/counts.ts --write`.
- [ ] **Step 6: Commit** `uk registers: the London trade accessor (counts, median and quartiles from the band counts, the share under 100k, shared codes named)`.

### Task A2: UK trade survival by trade group

**Files:**
- Create: `src/lib/uk/registers/survival.ts`
- Create: `tests/uk/registers/survival.test.ts`
- Modify: `src/lib/spine/lasts_rows.ts` (`buildLasts`, line ~68), `src/components/spine/cell/turn-two.tsx` (`LastsCard`, ~133) only if
  the card needs a cohort slot, `src/lib/spine/copy.ts`
- Modify: `scripts/prebuild_all.ts` (gate `uk-trade-survival`)

- [ ] **Step 1: Failing test:**

```ts
import { tradeSurvivalUk } from "../../../src/lib/uk/registers/survival";
const r = tradeSurvivalUk("restaurants")!;
check("restaurants: one group, 561", r.group === "561");
check("restaurants: period survival 0.940, 0.503, 0.293 at 1, 3 and 5 years", [r.period[1].survival, r.period[3].survival, r.period[5].survival].map((x) => x.toFixed(3)).join(",") === "0.940,0.503,0.293");
check("restaurants: the 2019 starters, 0.391 after five years", r.cohort2019Five.toFixed(3) === "0.391");
check("bakeries map to two groups: no single figure", tradeSurvivalUk("bakeries-retail") === null);
check("an unmapped trade: null", tradeSurvivalUk("pool-service-maintenance") === null);
```

- [ ] **Step 2: Run, expect failure.**
- [ ] **Step 3: Implement** `tradeSurvivalUk(slug)`: null unless `trade_groups[slug]` holds exactly one code; returns
  `{ group, groupName, period: { 1, 3, 5: { survival, lo, hi } }, cohort2019Five }`. One group only: a two-group trade has no single
  figure, and a weighted mix would be a model of ours.
- [ ] **Step 4: Run, expect PASS; register the gate; counts.**
- [ ] **Step 5: Wire `buildLasts`:** on a GB page (`iso2 === "GB"`, any city), when `tradeSurvivalUk(slug)` is non-null, the card's
  focal is the period five-year share ("After five years"), its two companions the period one- and three-year shares ("after one
  year", "after three years"), and one more companion the cohort ("2019 starters", its five-year share); the basis line names the
  group in plain words, lower case, and says the rates are recent: `UK ${groupName}, at recent rates.` Shares print as whole
  percentages unless `decimalsForColumn` (precision.ts) on the column's values and ranges asks for one decimal. On a GB page with no
  single group, **the card does not draw** (the shard's world figure is not the UK's). Off GB, unchanged. **Its zone keeps its
  partner:** `cell-view.tsx`'s clears level draws only when both cards hold (`clears && lasts`); change it to draw what holds
  (`keep([...])`), so covering the costs stands alone at two thirds rather than leaving with it.
- [ ] **Step 6: Fixtures:** search `scripts/` and `tests/` for `buildLasts` and `survival.yr` fixtures; update any GB fixture to the
  new figures.
- [ ] **Step 7: Render check** London restaurants (29%, 94%, 50%, 2019 starters 39%), London bakeries (no card; its zone partner
  stands alone at two thirds), Berlin restaurants (unchanged).
- [ ] **Step 8: Commit** `trade pages: UK survival by trade group, period first and the 2019 starters beside (his ruling of 2026-10-04)`.

### Task A3: the copied bill withheld

**Files:**
- Modify: `src/lib/cells.ts` (~line 294, where the matched row's `rowInd` is known, and the `Cell` type ~84-169)
- Modify: `src/lib/spine/adapt_cell.ts` (`setupItemsFromCell`, ~694-719)
- Create: `tests/cells/bill_own_trade.test.ts`; register gate `bill-own-trade`

- [ ] **Step 1: Failing test** of a pure helper `billFromOwnTrade(cell)` exported from `adapt_cell.ts` (or a small new module it
  imports): a cell whose `_matchedIndustryId` is `"restaurants"` and whose `industry_id` is `"cafes-coffee-shops"` returns null; the
  same cell with both `"restaurants"` returns the nine items totalling 426,020; a cell with no `_matchedIndustryId` (older rows,
  the extrapolated paths) returns its items as today.
- [ ] **Step 2: Run, expect failure.**
- [ ] **Step 3: Implement:** carry the matched row's industry id on the cell as a transient `_matchedIndustryId` (beside the
  existing transient `_revenueFilled`) where `rowInd` is known (cells.ts ~294 and the variants path ~356); `setupItemsFromCell`
  returns null when it differs from the cell's `industry_id`. The parent fallback stays (tests/cells/industry_resolution.test.ts
  pins it): every other figure the parent row lends is unchanged by this task.
- [ ] **Step 4: Run, expect PASS; register; counts.**
- [ ] **Step 5: Render check** London cafes (no $426K bill: the card falls back to its baseline estimate, Task A6) and London
  restaurants (the bill stands).
- [ ] **Step 6: Commit** `trade pages: a bill prints only on its own trade (the restaurants bill reached ten other trades by the parent fallback)`.

### Task A4: the trade head and share card

**Files:**
- Modify: `src/app/[country]/[geo]/[industry]/page.tsx` (`generateMetadata`, ~255-294)
- Modify: `src/app/og/cell/route.tsx` (~63-138)
- Create: `src/lib/spine/trade_head.ts` (pure: the head's figure and words) and `tests/spine/trade_head.test.ts`; gate `trade-head`

- [ ] **Step 1: Failing test** of `tradeHeadFigure({ iso2, isLondon, slug, revenuePerFirm, revenueFilled })`:
  - London restaurants: `{ money: "$374K", words: "typical yearly sales" }` (the register median 281,941.82 pounds and its range
    converted, then `honestRound` once; assert the exact string the function prints).
  - London barbershops: `"$104K"`, and the words name the group for a shared code: `"typical yearly sales for hair and beauty"`.
  - A filled revenue (`revenueFilled: true`) anywhere: `null` (no figure in the head).
  - A real, unfilled revenue off London: `{ money: usd(revenuePerFirm), words: "typical revenue" }`.
  - A median in an open band: words only (`"under $66K a year"` for under 50,000 pounds).
- [ ] **Step 2: Run, expect failure. Step 3: Implement** `trade_head.ts` with `londonTradeSales` (Task A1). **Step 4: PASS; register; counts.**
- [ ] **Step 5: Wire `generateMetadata`:** the description becomes `${figure.money} ${figure.words} for ${ind} in ${geoName}.`
  when a figure exists, else the existing fallback words; **remove "Bottom-10%, typical, and top-10% benchmarks."** (the page holds
  no such percentiles); the title is unchanged. OpenGraph and Twitter take the same description.
- [ ] **Step 6: Wire the share card** (`og/cell/route.tsx`): the figure and its label from `tradeHeadFigure`; no figure, no range
  line and no "Range p10 – p90" when the figure is null or the revenue is filled.
- [ ] **Step 7: Check** by rendering `generateMetadata` for London restaurants, London cafes (was the constant $675K) and Berlin
  restaurants through a tsx probe; print the three descriptions in the task report.
- [ ] **Step 8: Commit** `trade head: the register's median or no number (a constant $675K stood on 103 London trades)`.

### Task A5: the London trade hero and sales strip from the register and the engine

The largest task. **Files:**
- Modify: `src/lib/spine/adapt_cell.ts` (`loadCellView` ~108-288, `buildSpineCellSeed` ~335-690), `src/lib/cells/cell_view.ts`
  (`moneyShown` ~261, the invented London band ~277-291), `src/lib/spine/trade_hero_facts.ts` (~71-109),
  `src/lib/spine/trade_spread_rows.ts`, `src/lib/spine/trade_net.ts`, `src/lib/spine/copy.ts`
- Create: `src/lib/spine/london_trade_hero.ts` (pure) and `tests/spine/london_trade_hero.test.ts`; gate `london-trade-hero`

**What a London trade page prints after this task** (geo = the London alias, GB; every one of the 137 register slugs):

| | engine trades (restaurants, nail-salons, sports-fitness) | every other London trade with a register row |
|---|---|---|
| answer label | `Sales to break even` | `Typical yearly sales` |
| answer figure | `honestRound` of break-even (lo, mid, hi) in dollars | the register median (Task A1), once rounded |
| answer words | `a year, to carry an average London ${premisesNoun}` | `for a registered ${tradeNoun} in London` (shared code: `for a hair and beauty business in London`) |
| cells | `Take that much`: `${round(shareAbove.mid*100)} of 100`; `Middle one keeps`: the sole trader's `keepsQ50` once rounded, note `as a sole trader, an estimate`; `Registered businesses`: enterprises | `Registered businesses`: enterprises; `Take under $133K`: `${round(shareUnder100k*100)} of 100` |
| plus (the card's `detail`) | `As a company`: the company's `keepsQ50` once rounded, note `paying itself out, an estimate` | none |
| foot | `Registered businesses in London, March 2026.` | the same |

- The sales strip (`Spread`): three marks, `Lower quarter`, `Middle`, `Upper quarter`, from `londonTradeSales` (q25, q50, q75), each
  rounded once with `honestRound(value)` (no range in the file for the quartiles); a quartile in an open band prints `under $66K`
  or `over $66M` and no money for its business; basis `Yearly sales of registered businesses in London.` **The invented band
  (0.5 x, 1.8 x) is deleted**, with its comment.
- **The curated London money leaves the trade page:** no take-home, net margin, firm count or sales from `london_market_v1.json`,
  and none from the City of London's database row; `moneyShown` is false on London for every money figure the cell row or the
  curated file feeds (worth, the split's net, clears where it reads them: each card that loses its input self-omits, as it does
  off London). The premises noun comes from the engine's premises category (restaurant, shop, salon, gym: a small map in
  `london_trade_hero.ts` from the category; a category without a noun prints no money).
- `COPY.tradeNet.notes.engine` ("from this city's own figures") no longer reaches a London page. Off London it stays where its
  claim is true (a trusted local row).
- The business rate supplement (master plan, plan 06 notes): print no quartile keeps (only the median's), so the restaurants'
  upper quartile, which the supplement reaches, never prints.

- [ ] **Step 1: Failing test** of `londonTradeHero(slug)` returning the table above as data (strings for labels, figures and notes):
  restaurants `"$740K"` break-even (556,017.36 x 1.3265 with its range, once rounded; assert the function's exact output and
  print the arithmetic in the test's label), `"32 of 100"`, `"$18K"` sole trader keeps, `"7,865"`; barbershops `"$104K"` typical
  yearly sales, `"9,695"`, `"63 of 100"`, the hair and beauty words; a slug with no register row returns null.
- [ ] **Step 2: Run, expect failure. Step 3: Implement** `london_trade_hero.ts`. **Step 4: PASS; register; counts.**
- [ ] **Step 5: Wire** the seed and the hero facts so the London branch reads `londonTradeHero` and the strip reads
  `londonTradeSales`; delete the invented band; set London's money off the curated and cell sources.
- [ ] **Step 6: Fixtures:** `scripts/verify_archetype_copy.ts:1063-1075` and `scripts/verify_model_laws_copy.ts:694-714` pin the old
  London restaurants hero (36,000 / 13,000 / 720,000, the 0.5/1.8 strip, "this city's own figures"): replace each fixture with
  the new figures and words, keeping every check's intent (three hero cells, three strip marks, the label sweep).
- [ ] **Step 7: Render check** London restaurants, barbershops, nail salons, cafes, grocery (no recipe), shoe repair (state B
  before): every London trade with a register row now leads with a figure; no "Not known yet" on these pages.
- [ ] **Step 8: Commit** `London trade pages: break-even and the middle owner's keeps from the engine on three trades, the register's sales, quartiles and counts on every trade (his rulings of 2026-10-04)`.

### Task A6: licences and the cost to open on UK pages

**Files:**
- Modify: `src/lib/spine/permits_rows.ts` (`buildPermits`, ~96), `src/lib/spine/open_rows.ts` (`buildOpen` baseline ~235-244,
  `buildOpenFormats` ~165), `src/lib/spine/rivals_rows.ts` (~105-113), `src/lib/spine/copy.ts`
- Create: `tests/spine/uk_open_permits.test.ts`; gate `uk-open-permits`

- [ ] **Step 1: Failing test:** `buildPermits(industryId, "GB")` is null for every trade (the shard's lists are the trade's anywhere
  in US terms; no UK list keyed by trade exists yet); off GB unchanged. `buildOpen` on a London barbershops seed prints the keyed
  baseline times London's place factor (60,000 x 0.75 = 45,000 printed `$45K`) with the word estimate in its basis; an unkeyed
  trade prints no baseline (never the 80,000 default); the rivals' "To open" figures carry the same factor.
- [ ] **Step 2: Run, expect failure. Step 3: Implement:** GB pages never print the trade's licence list, **and the open card keeps its level**: `cell-view.tsx`'s
  permits level draws only when both hold (`permits && open`); change it to draw what holds, so the cost to open stands alone; the baseline is
  `startupCapitalArchetypeKeyed(slug) * placeFactor({ costOfLivingIndex: getCityCostOfLivingIndex(geo) })` (never
  `placeAdjustedStartupCapital`, which returns the 80,000 default for unkeyed trades), basis `An estimate for ${cityName}.`; the
  formats scale from the adjusted figure; rivals the same, with a basis line `Estimates for ${cityName}.`
- [ ] **Step 4: PASS; register; counts. Step 5: Fixtures:** `verify_archetype_copy.ts:1148` pins restaurants' baseline at 300,000
  and `:1930-1933` the industry page's cost: the industry page is not a place, so it keeps the unadjusted figure (assert that);
  move the trade-page fixture to the adjusted figure.
- [ ] **Step 6: Render check** London barbershops (`$45K`, no licences card, its zone partner at two thirds), Berlin restaurants
  (licences unchanged).
- [ ] **Step 7: Commit** `UK trade pages: no licence list in another country's terms, and the cost to open at London's prices, called an estimate`.

### Wave A close

- [ ] Full chain (`npx tsx scripts/prebuild_all.ts --concurrency=1 --no-bail`, with `NODE_OPTIONS=--require=./scripts/lib/pw_edge_fallback.cjs`), every red fixed at its cause.
- [ ] Photographs at 375 and 1280 of London restaurants, barbershops, cafes and Manchester restaurants.

---

## WAVE B: the country page, the city page, the sources

### Task B1: the UK hero's labels and rows

**Files:** `src/lib/spine/hero_board.ts` (~159-201), `src/lib/spine/copy.ts` (`:59`, `:343-347`, `:625`, `:1249`), fixtures in
`scripts/verify_model_laws_copy.ts:220-221`. Test: `tests/spine/hero_rows.test.ts`, gate `hero-rows`.

- [ ] Test first: no hero board row reads `ease_of_doing_business_index` (the index was discontinued in 2021) or `setup.total_days`
  (a modelled day count; on the UK it is the bank-account step); the salary row's label is `Typical salary` (it is the median); the
  answer's label is `Tax on profit` (no "Total", no "burden": the figure is a rate, not a sum).
- [ ] Implement for every country (the two rows are stale or modelled everywhere); `COPY.pay.average` and the peers' column head
  become `Typical salary`.
- [ ] Render check GB, DE, AF at 1280 and 375: the board with five rows or fewer leaves no blank beside its picture (if it does,
  the rows column takes the picture's height; look before deciding).
- [ ] Commit `heroes: the typical salary, tax on profit, and no stale index or modelled day count`.

### Task B2: no world median

**Files:** `src/components/spine/archetypes/WorldRange.tsx` (`:84`, `:105`, `:123`, `:133`, `:167`), the call sites in
`country-view.tsx` (`:568`, `:582`, `:641`), `copy.ts` `:548`, `:871`. Test: extend the WorldRange story check or add
`tests/spine/world_range_no_median.test.ts`, gate `world-range-no-median`.

- [ ] Test first: a rendered WorldRange prints no median word, no median tick and no median in its label (PART 9 clause 46: a fill
  value or an interpolation is not a statistic).
- [ ] Implement: remove `medianWord` and the median's tick and words; the range's ends and the hairlines stay.
- [ ] Commit `world tracks: no median (fill values and interpolated countries made it)`.

### Task B3: London is Greater London on the city page

**Files:** `src/lib/spine/city_hero_board.ts` (~106-164), `src/lib/spine/fact_rows.ts` (`buildCitySeason` ~451),
`src/lib/spine/adapt_city.ts` (peers ~514-528), the market card's builder (`city_market_rows.ts`), `copy.ts`.
Test: `tests/spine/london_city.test.ts`, gate `london-city`.

- [ ] Test first: London's hero visitors read `data/sections/people.json` (`GB.cities.london.visits`: 20.9M, 2024) and print
  `20.9M`; the peers table's London row prints the same figure; a peers row whose visitors are not a read value
  (`isVisitorsRead` false: Munich, Osaka) prints a dash; London's hero has no "Per 10,000 residents" row (531,000 modelled firms
  over the 14.3M metro); London's season card does not draw (no sourced residents and visitors split exists); London's "Who is
  already trading" prints the register's Greater London enterprises for its trades (Task A1, the shared code named) with no focal
  total and no plus of modelled births and closures.
- [ ] Implement; fixtures: `verify_archetype_copy.ts:282` and `:529-531` (the peers table's heads and the visitor cell's rule:
  keep the heads, move the fixture's London row to 20.9M).
- [ ] Render check London at 375 and 1280.
- [ ] Commit `London city page: Greater London's visits and registered businesses; the modelled densities and split off`.

### Task B4: Sources and licences (R-002 as ruled)

**Files:** `src/app/(site)/about-data/page.tsx` (a new section `id="sources"`), create `src/lib/spine/uk_sources.ts` (the list,
one module, allow-listed in `verify_no_source_agencies` the way that gate allows a named file), create
`src/components/spine/SourcesFoot.tsx`, each spine view (country, city, cell, how-to, hood) renders `<SourcesFoot iso2=... />`
after its last zone. Test: `tests/spine/uk_sources.test.ts`, gate `uk-sources`.

- [ ] Build the list from the repo's own records only: every `publisher` in `data/sections/*.json`, the register slices'
  `manifest.json`, and the official rows' research note (`E:/atlas/design/loop/build/research/2026-09-25-uk-official-figures.md`);
  each entry: the publisher, what the pages print from it, its link, and its attribution line where its licence is known (the
  Open Government Licence v3.0 statement for the statistics office, the valuation statistics, GOV.UK and the Gazette; the
  publisher's own line otherwise; never a licence the files do not name).
- [ ] The foot, on UK pages only: `Contains public sector information licensed under the Open Government Licence v3.0.` and a
  link `Sources and licences` to `/about-data#sources`; 12px, muted, under the last band.
- [ ] Test: the list names every publisher the section files name; the foot draws on a GB render and not on a DE render; the
  source-agencies gate stays green with the one module allowed.
- [ ] Commit `UK sources on one page, linked from every UK page's foot (his ruling of 2026-10-04 on R-002)`.

### Task B5: the provenance ratchet

**Files:** the builders this plan touched stamp `data-src` (a slice and key, e.g. `uk/registers/turnover.json:restaurants:E12000007`)
and `data-kind` (`counted`, `worked out`, `estimate`, `looked up`) on each figure they print; create
`scripts/harness/check_provenance.mjs` over the nine harness renders, counting rendered figures without both attributes; baseline
file `scripts/provenance_baseline.json` seeded at today's count per page; gate `provenance` (browser, after `pages-fresh`), may
only fall; planted (remove one stamp, see it red) before registering.

- [ ] Commit `provenance: every figure the truth pass prints says where it came from, and a ratchet on the rest`.

### Wave B close

- [ ] Full chain; photographs; QUEUE section I statuses updated; MODEL.md PART 10 or the relevant part notes the rules; the
  state record and memory updated; the founder asked before any push.
