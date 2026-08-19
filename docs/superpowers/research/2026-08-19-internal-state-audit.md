# Internal state audit, 2026-08-19

Read-only. No source file was edited, nothing was committed, nothing was pushed.
Every claim below names a file. Where a statement is an inference rather than an
observation it says so in the sentence.

---

## Executive summary, twelve lines

1. **102 page routes exist: 49 reader-facing, 50 workbench (47 `/dev` + 3 non-routable `_design`), 3 admin.** `CLAUDE.md` says 56; it is stale by 46.
2. **The chain is 102 gates in the working tree and 101 at HEAD, and gate 102's script is untracked.** Four documents state four different numbers (`CLAUDE.md` 95, `docs/verification-protocol.md` 31, charter 99, handoff 101). `npm run prebuild:serial`, offered as the Windows fallback, runs **43**. Tick 4's work, including gate 102 and the `--font-display` fix, is uncommitted, against the loop's own rule 7.
3. **Ten design gates scan bodies no reader can reach.** `bar-budget`, `no-bold-display`, `no-eyebrow`, `subsection-icons`, `banned-patterns`, `sample-tags` and `trade-set` point at `src/app/dev/spine-*` (two-file wrappers) plus the flag-OFF `home2-view.tsx`; `v2-scales`, `spacing-scale` and `paragraph-budget` point mostly at `spine2`/`city2`/`country2`/`dev`. `.env.local` sets no spine or home reform flag, so every one of those bodies is dark. The founder's 2026-07-11 rulebook is enforced against the workshop.
4. **`verify_section_order` is effectively vacuous on three of its four page types.** Its extractor needs `<section` and a literal `id="..."` on one line: the country page yields **1** id against a 22-item canonical list, the cell page 1 of 7, the industry page 1 of 10. The industry page is **written to that limitation on purpose** and says so in its own comments at `:412`, `:530`, `:690`.
5. **`verify_page_sections` covers 7 page types and satisfies itself with a substring match on unstripped source**, so a section id in a comment counts as rendered. It also holds a 6-id country contract while `section-order.ts` holds a 22-id one. Three registries disagree with each other and with the code.
6. **§4 "pages should not be bloated with text" is unenforced on every page the founder looks at.** `verify_paragraph_budget` does not scan `src/app/page.tsx`, `[country]/page.tsx`, `cities/[slug]/page.tsx` or `src/components/kit/`.
7. **Four of seven ratchets rely on discipline, not code.** `hardcoded-hex`, `geo-link-construction` and `take-home-identity` write their baseline unconditionally; `no-stock-imagery` has no writer. Only `no-cream`, `palette-membership` and `paragraph-budget` refuse a raise.
8. **12 registered gates roll their own comment detection** instead of the tested `scripts/lib/strip_comments` (15 use it), including `verify_no_em_dashes` and `verify_no_source_agencies`, the two oldest founder constraints.
9. **The homepage is measured, not guessed: 11 bands declared, 11 emitted, 764 words, nine bands between 59 and 76 words.** The defect is flatness, not count. It is also absent from both section registries, so no gate defends its bands.
10. **`/world` and `/industries` render neither `SiteChrome` nor `SpineShell`, and `route-chrome-contract` passes them anyway** because it substring-matches unstripped source and both files discuss `SiteChrome` in their header comments. They carry their own masthead, `<main>`, `spine2/Place` background and a **second `SiteFooter`**, with no `AtlasFrame`. Four component systems ship in parallel (`kit`, `kit/engraved`, `board`, `spine`/`spine2`) sharing no code.
11. **Seven of the country page's declared sections can never render.** Six inputs are hardcoded by a `notHeld<T>()` helper at `[country]/page.tsx:784-793` whose own comment says the atlas does not hold them "for any country"; a seventh is gated on a field null for 194 of 195 countries.
12. **Two ratified rules contradict each other and neither is gated:** self-omission (CLAUDE.md, charter §8) versus the 2026-07-27 completeness inversion that forbids `return null`. Separately, the "never create two similar sister pages" rule is **not recorded in this repo in that phrasing**, and the repo's own "sister page" vocabulary means the opposite; the overlap findings in §1.5 stand on their own evidence.

---

# PART 1 - THE SURFACE INVENTORY

## 1.1 Route enumeration

Counted from `find src/app -name page.tsx` (102) and `-name route.ts` (16).

### Reader-facing data tree (12 page routes, outside any route group)

| Route | File |
|---|---|
| `/` | `src/app/page.tsx` |
| `/[country]` | `src/app/[country]/page.tsx` |
| `/[country]/industries` | `src/app/[country]/industries/page.tsx` |
| `/[country]/[geo]` | `src/app/[country]/[geo]/page.tsx` |
| `/[country]/[geo]/industries` | `src/app/[country]/[geo]/industries/page.tsx` |
| `/[country]/[geo]/[industry]` | `src/app/[country]/[geo]/[industry]/page.tsx` |
| `/[country]/[geo]/[industry]/[sub]` | `src/app/[country]/[geo]/[industry]/[sub]/page.tsx` |
| `/[country]/[geo]/[industry]/opening` | `src/app/[country]/[geo]/[industry]/opening/page.tsx` |
| `/[country]/[geo]/[industry]/buy-or-start` | `src/app/[country]/[geo]/[industry]/buy-or-start/page.tsx` |
| `/world` | `src/app/world/page.tsx` |
| `/industries` | `src/app/industries/page.tsx` |
| `/embed/[country]/[geo]/[industry]` | `src/app/embed/[country]/[geo]/[industry]/page.tsx` |

`/world` and `/industries` were promoted OUT of `SiteChrome`, which is why
`verify_main_landmark` exists (`scripts/verify_main_landmark.mjs:6-11`).

### `(site)` route group (40 page routes, of which 3 admin)

`/about-data /account /admin/anomalies /admin/data-quality /admin/review /blog
/blog/[slug] /browse /calculator /check /cities /cities/[slug]
/cities/[slug]/neighborhoods /compare /compare/cities/[pair] /contact /cookies
/countries /coverage /coverage/[iso2] /decide /decide/[activity]/[city]
/download/2026-benchmarks /extremes /faq /industries/[industry]
/industries/[industry]/across /learn /learn/[slug] /margin-index /methodology
/methodology/key-benchmarks /pricing /privacy /saved /signin /status /terms
/tools /you`

### Workbench (50 page routes, none shipping)

47 under `src/app/dev/`: `/dev`, `/dev/brand-glyphs`, `/dev/calculator`,
`/dev/catalogue`, `/dev/cell2`, `/dev/charts`, `/dev/cities`, `/dev/city2`,
`/dev/compare2`, `/dev/country2`, `/dev/decide`, `/dev/decide-v2`,
`/dev/distribution-states`, `/dev/font-showcase`, `/dev/gold-mine`,
`/dev/home3`, `/dev/hood2`, `/dev/index-cities`, `/dev/index-countries`,
`/dev/index-extremes`, `/dev/index-world`, `/dev/industries2`, `/dev/industry2`,
`/dev/kit`, `/dev/lock-states`, `/dev/london-commercial`, `/dev/options/*` (11),
`/dev/pricing2`, `/dev/spine`, `/dev/spine2-tracks`, `/dev/spine-cell`,
`/dev/spine-city`, `/dev/spine-hood`, `/dev/spine-industry`, `/dev/spine-kit`,
`/dev/v0`, `/dev/world2`.

3 under `src/app/_design/` (`page.tsx`, `monetized`, `v2-review`). `_design` is a
Next.js private folder and is **not routable at all** - the cohesion audit found
two "fixes" that landed on components only `_design/v2-review` imports
(`docs/superpowers/plans/2026-08-17-cohesion-audit.md` §2 item 2).

`scripts/verify_dev_routes_sealed.mjs` enforces that nothing outside
`src/app/dev` imports from it, and that robots.txt disallows `/dev/`.

### Route handlers (16)

`/(site)/decide/go`, `/random`, `/auth/callback`, `/auth/signout`, and 12 under
`/api/` (`cell-lookup`, `cell-snapshot`, `cell-take-home`, `contact`,
`correction`, `export-csv`, `go`, `newsletter`, `popular-cell-snapshot`,
`saved-cells`, `stripe/checkout`, `stripe/webhook`).

## 1.2 The flag state that decides which body renders

`.env.local` sets exactly one public flag: `NEXT_PUBLIC_WARM_FRAME=1`. Therefore,
read off `src/lib/feature_flags.ts`:

| Flag | Default | Effect |
|---|---|---|
| `isHomeReformEnabled()` | **false** (`:126-128`) | `Home2View` (`src/components/home/home2-view.tsx`) never renders; `src/app/page.tsx`'s legacy body does |
| `isSpineReformEnabledFor("cell")` | **false** | spine-2 cell body dark |
| `...("industry")` / `("city")` / `("hood")` | **false** | adapters marked real, never run |
| `...("region")` / `("country")` | **false, and the master cannot enable them** (`:190-196`) | reason recorded in code: "Illustrative hero has no honest country-level source" |
| `isWarmFrameEnabled()` | **true** | `HeroWash` bands paint |

**Consequence for this inventory: every "spine" and "spine2" body is dead code at
today's configuration.** That is observed from `.env.local` plus the defaults in
`feature_flags.ts`; it is an inference only insofar as production's Vercel
environment variables are not visible from this repo.

## 1.3 Site chrome every page inherits

**Root layout** (`src/app/layout.tsx`) gives every route: `globals.css`, the
**Newsreader + Inter** font pair (`:15`), `Organization` structured data,
`PaywallModalRoot`, `AtlasGutters`, Sentry/SpeedInsights. It does NOT render the
masthead or footer.

**`SiteChrome`** (`src/components/SiteChrome.tsx`) renders, in order:

| Order | Element | Form | Line |
|---|---|---|---|
| 1 | `<AtlasFrame />` - the fixed background | backdrop | `:64` |
| 2 | Masthead, `max-w-content px-6`, wordmark + nav + search | nav | `:71` |
| 3 | `<main className="relative max-w-content mx-auto px-6 pt-4">` | container | `:150` |
| 4 | Newsletter bar | form/interactive | `:160` |
| 5 | `<footer className="relative bg-black text-white">`, five link columns | list | `:172-173` |
| 6 | `<WatchTray />` | interactive | `:274` |

The `relative` on `<main>` and on the two chrome elements outside it is the
structural fix for the paint rule (V1) and carries a comment saying so
(`:135`, `:148`, `:160`).

**Two mount paths.** Routes inside `(site)` get `SiteChrome` from
`src/app/(site)/layout.tsx:21`. The `[country]` tree cannot use a route group
(*"a group cannot split a dynamic segment"*), so **eight page files mount
`SiteChrome` themselves**: `src/app/page.tsx:350`, `[country]/page.tsx:1543`,
`[country]/industries/page.tsx:171`, `[country]/[geo]/page.tsx:414`,
`[country]/[geo]/industries/page.tsx:177`,
`[country]/[geo]/[industry]/buy-or-start/page.tsx:174`, and siblings.
`/world` and `/industries` render it too but were once promoted out, which is
why `verify_main_landmark` exists.

**`AtlasFrame`** (`src/components/AtlasFrame.tsx`) paints **two**
`position: fixed` layers at `z-index: 0` (`:123`, `:133`): an opaque white base
and `/spine/_skyline.jpeg` at `opacity: 0.32` (`:140`). **Its own header still
documents three layers including a `.16`/`.82` passe-partout it no longer
renders** (`:55-57`), and still calls `--atlas-surface-card` opaque `#ffffff`
when it is now `rgba(255,255,255,0.955)`. That is contradiction #4 on
`docs/loop/STATE.md`'s own list, still open.

## 1.4 Section inventory per page type

Prose word counts are estimates from counting literal copy strings in source
(headings, ledes, captions), not from a render. **Stated blind spot: this cannot
distinguish a string a component holds from a string a reader sees**, it does not
execute the per-place dynamic prose (`view.honestTake`, `view.decisive`,
`character_paragraph`), and it cannot see a section that self-omits at runtime.
The single exception is the homepage, where a real render was measured
(`docs/loop/artifacts/home-band-census-2026-08-18.md`).

### Homepage - `src/app/page.tsx` (804 lines)

Measured, not estimated: **11 bands declared, 11 emitted with real data, 0
absent, 764 visible words.**

| # | Band | Component | Form | Words |
|---|---|---|---|---|
| 1 | hero | H1 + `NavigatorForm` | hero + form/interactive | 63 |
| 2 | specimen | `Specimen` | stat-row (one real answer) | 59 |
| 3 | example-tiles | `ExampleTiles` | card-grid | 67 |
| 4 | ledger | `AtlasLedger` | table | 63 |
| 5 | catalog-plates | `CatalogPlates` | card-grid / marks | 72 |
| 6 | world-map | `WorldMapSection` | chart (map) | **14** |
| 7 | state-comparison | `StateComparison` | table | 74 |
| 8 | neighborhoods | `NeighborhoodCards` | card-grid | 72 |
| 9 | audience | `AudienceBand` + `UpgradeTeaser` | card-grid + cta | 76 |
| 10 | blog-rail | inline rail | card-grid | 71 |
| 11 | newsletter | `HomeNewsletter` | form/interactive | **133** |

**The measured defect is flatness, not count.** Nine of eleven bands sit between
59 and 76 words; `newsletter` at 133 is 17% of all language on the page and sits
last; `world-map` at 14 is the only band that shows inventory rather than
describing it. `catalog-plates` emits 87,140 characters of markup for 72 words,
26x its neighbours.

**Two word counts exist for this page and they are not in conflict.** The 764 is
all visible rendered text: figures, unit labels, table headers, member-name
lists. A prose-only hand count of the literal editorial strings (headings, ledes,
paragraphs, excluding numbers and labels) lands at roughly **376**. The census
answers "how much text does a reader see"; the hand count answers "how much of it
is authored copy". §4's rule is about the first.

A second body exists (`src/components/home/home2-view.tsx`, mounted at
`src/app/page.tsx:312`) behind `isHomeReformEnabled()`, which is OFF.

### Country - `src/app/[country]/page.tsx` (1547 lines)

**24 declared sections; 18 can render; 6 are structurally dead.**

Order: hero -> scorecard -> country shape (chart) -> decisive (table) -> hiring
(chart) -> talent reality -> who has money (stat-row) -> how far you reach ->
peers/neighbours (table) -> opportunity gap -> here vs abroad -> special zones ->
licences -> ground under you (list) -> cities (card-grid) -> easiest to break in
(table) -> character, two spectrum tables -> what locals know (list) -> your life
here -> vs the world (chart) -> honest take (prose) -> gut check (interactive) ->
one thing (prose) -> related/compare CTA.

**Six sections can never render for any country.** `talentSignals`,
`opportunityTrades`, `abroadPair`, `specialZones`, `licenceItems` and
`lifeDimensions` are all assigned by `notHeld<T>()` at
`src/app/[country]/page.tsx:784-793`, a helper defined at `:215` whose comment
calls it "the marker for a section input this atlas does not hold for any
country". Their blocks are gated on those values. **A seventh, "One thing", is
gated on `view.honestTake?.body`, which the file's own comment records as null
for 194 of 195 countries.** The cohesion audit counted this as seven sections
(`docs/superpowers/plans/2026-08-17-cohesion-audit.md` §3); by the `notHeld`
helper it is six plus two `GroundUnderYou` factors hardcoded to
`score: 0.5, sample: true`.

Prose: roughly 900-1400 words on a well-filled country, far less on a thin one.

**Component family: `src/components/kit/engraved/*`, used by no other page type.**
Only `AddToWatch`, `StickySectionNav`, `FreshnessStamp` and `FlagIt` are shared.

**One documented exception to the workshop seal:** `:109` imports
`SpineCountry from "@/app/dev/spine/page"`. `scripts/verify_dev_routes_sealed.mjs`
carries an explicit allowance for this one file and reports
`PASS known leak still present and still allowed` (run 2026-08-19). It is the
only shipping file importing from `src/app/dev`; 628 files were scanned.

### Region - `src/app/[country]/[geo]/page.tsx` (418 lines)

**6 sections:** hero -> best/hardest businesses (`GeoViabilityLede`, prose) ->
city character (`CityCharacter`) -> neighborhoods (card-grid) -> cities in region
(card-grid) -> easiest to break in (table). Roughly 150-300 words.

`REGION_PAGE_SECTIONS` in `src/lib/page-layout/section-order.ts` still lists
`top-industries`, which the page's own header says was removed. The gate passes
because an absent id is legal in a subsequence test.

### Cell (flagship) - `src/app/[country]/[geo]/[industry]/page.tsx` (1428 lines)

**Three bodies**, resolved by flag AND data: legacy (default); spine-2 (flag ON
plus a hand-filled file, rendered **bare, with no `SiteChrome`**); spine-1
illustrative seed (flag ON, no file).

Legacy: 18 page-level sections wrapping `CellDecisionStack`, which is itself the
content-map spine of **16 sections** mapped from `CELL_SECTIONS` with an
always-present `SectionEmpty` fallback: honest-take -> narrative -> plain-terms
-> money (chart) -> cost-drivers -> owner-take-home -> break-even -> wages ->
startup-cost (table) -> seasonality -> first-year -> nearby -> risks ->
locals/contrarian/myths/fit (curated only) -> related -> one-thing.

**Total 34; 14 of the 34 self-omit on a thin cell.** Roughly 500-900 words filled.

**Two manifest sections never fill.** `CELL_SECTIONS` declares `operator-voices`
and `vs-world`; `src/components/cells/CellDecisionStack.tsx`'s content map has no
key for either, so both always fall to the empty placeholder.

### Sub-industry cell - `src/app/[country]/[geo]/[industry]/[sub]/page.tsx` (721 lines)

**8 page-level + the same 16 decision-stack sections = 24.** Its own header says
it "composes the SAME answer-first masthead + decision stack the main cell page
uses". Absent versus the cell page: `DimensionSwitcher`, `CityHero`,
`CellWarningChips`, `AudienceCaveat`, `CoverageBadge`/`CurrencySwitcher`,
`CellFallbackBanner`, `AuPrimaryDataBadge`, `ComparableCitiesRibbon`,
`CorrectionForm` and all JSON-LD. Its one bespoke element is a
neighborhood-adjustment band.

### Opening - `.../[industry]/opening/page.tsx` (189 lines)

**5 sections:** hero (`OpeningHero`) -> payback (stat-row) -> break-in breakdown
(3 driver bars, chart) -> checklist (stat-row) -> comparisons (two table strips).
Roughly 120-220 words. Built on the **`board`** family, not `kit`.

### Buy-or-start - `.../[industry]/buy-or-start/page.tsx` (178 lines)

**3 sections:** hero -> start vs buy compare (table) -> the catches (card-grid).
Roughly 100-180 words. Also `board`.

### Country industries index - `src/app/[country]/industries/page.tsx` (175 lines)

**2 sections:** masthead -> one card per sector, each a grid of industry links.
40-60 words.

### Geo industries index - `src/app/[country]/[geo]/industries/page.tsx` (181 lines)

**2 sections:** identical shape. 30-50 words.

### City - `src/app/(site)/cities/[slug]/page.tsx` (1022 lines)

**16 sections:** masthead -> keep-on-watchlist -> climate score band ->
honest-take -> your customer -> what space costs -> tourist vs local (chart) ->
what owners keep (table) -> best areas (list) -> city signature panel (spectrum
table) -> neighbourhoods (card-grid) -> all districts (`CityDistrictPicker`,
interactive) -> how it's changing -> rival/peer cities (chart + card-grid) -> vs
its peers (chart) -> one thing. Roughly 600-1000 words on a curated city.

A second body (`SpineCityBody`) exists behind `NEXT_PUBLIC_SPINE_REFORM_CITY`,
which is unset. The cohesion audit rendered both for four cities and resolved the
fork: legacy 11 anchors on all four, spine 3-4, three chapters structurally
unreachable (see D16).

### Neighborhood hub - `src/app/(site)/cities/[slug]/neighborhoods/page.tsx` (333 lines)

**2 sections:** masthead -> one card per district. 30-60 words plus per-district
data prose. Its spine body resolves for **London only**.

### Industry - `src/app/(site)/industries/[industry]/page.tsx` (886 lines)

**9 sections (10 counting the nested `money` id):** hero -> honest take -> how it
makes money -> typical operator -> where it earns most (table) -> the cost stack
(`MarginWaterfall`, chart) -> cost drivers (list) -> related activities
(card-grid) -> one thing. Roughly 500-750 words, the most prose-dense of these
pages.

### Industry across-cities - `src/app/(site)/industries/[industry]/across/page.tsx` (544 lines)

**5 sections** (3 on the thin-data path): breadcrumb -> hero -> where to break in
-> side-by-side comparison (a real HTML `<table>` with `SpreadBar` per city) ->
closing CTA. Roughly 180-260 words. **`board` family; shares no component with
the industry page it is a sub-route of.**

### The index and tool surfaces

`/browse` is **not a page**: `src/app/(site)/browse/page.tsx` is a 308
`permanentRedirect("/world")`. Its header is the clearest existing statement of
the anti-duplicate-surface principle in the repo:

> "/Browse repeated the homepage navigator's 'pick a country / sector / city'
> entry pattern and added lists that were already covered by /world (countries),
> /industries (sectors), and /cities (cities). The page served no purpose
> distinct from the others."

`/world` (`src/app/world/page.tsx`, 378 lines) and `/industries`
(`src/app/industries/page.tsx`, 246 lines) **do not render `SiteChrome`**. They
render their own `<main>` (`world:190`, `industries:83`), their own
`<header className="mast">` (`world:169`), `spine2/Place` for a background
(`world:167`), and **`spine2/SiteFooter`** (`world:374`, `industries:242`) - a
second footer implementation. So these two shipping routes have a different
masthead, a different footer and a different background treatment from every
other page, and no `AtlasFrame`. The cohesion audit named this defect only for
the flag-gated spine-2 cell page; **it is live on two routes today.**

`/cities` (428 lines) was rebuilt on 2026-08-17: 20,459px to 5,152px, 30 screens
to 7, all 252 URLs kept, prose cut from five blocks to two (charter §10).
It uses `cities/CitiesWorldMap`, `cities/CitySearchBox`, `board/StatCard`.

`/countries` (268 lines) imports one component, `CountryFlag`. `/coverage`
delegates entirely to `v2/CoverageHubV2`.

| Index page | Sections in order | Count | Prose |
|---|---|---|---|
| `/cities` | hero (h1 + lede + 2 stats + `CitiesWorldMap` + `CitySearchBox`) -> "The biggest markets", 12 ranked `StatCard`s (card-grid) -> "Every city", 6-region grouped link list -> provenance note | 4 | ~61-78 |
| `/countries` | header (eyebrow + h1 + lede + 3 stats) -> 6 continent card-grids | 2 types / 7 blocks | ~23 |
| `/world` | opening (h1 + lede + 3-stat panel) -> "Where the map goes furthest" (stat-row) -> "Every country with a page" (region-column link grid) -> "Where to go from here" (cta) | 4 | ~129 |
| `/industries` | opening (h1 + lede + 3-stat panel) -> "What actually shapes a margin", 6 sampled trade notes (card-grid + prose) -> "Every trade with a page" (sector-column link grid) | 3 | ~100 |
| `/coverage` | header -> four tier groups (deep / good / starter / modeled), each h2 + explainer + pill grid | 5 | ~79-86 |
| `/coverage/[iso2]` | header -> empty-state prose OR 4-stat row -> confidence-tier distribution (table) -> 2 CTA links | 3-4 | ~44 empty / ~4 filled |

### The decision and comparison surfaces

| Page | Sections in order | Count | Prose |
|---|---|---|---|
| `/tools` | hero card -> 3-card grid linking `/decide`, `/check`, `/calculator` | 2 | ~115-120 |
| `/decide` | hero -> `FounderDecisionLede` (prose + ranked dl) -> `DecideWizard` (3-step picker) -> worked-example cards -> methodology footnote | 5 | ~650-700 |
| `/decide/[activity]/[city]` | `ZoomControl` -> breadcrumb -> hero -> `DecideActivitySelector` -> top-3-by-margin cards -> all-neighborhoods table -> footnote | 7 | ~135-145 |
| `/calculator` | breadcrumb -> hero -> `CalculatorForm` -> 2-card cross-link grid -> footnote | 5 | ~250-260 |
| `/compare` | hero card -> `CompareClient` (matchup setter, revenue spread, side-by-side table, weighting panel) | 2 top level, ~6 inside | ~47 wrapper; `CompareClient` is 1790 lines and was not read in full |
| `/compare/cities/[pair]` | side-by-side hero photos -> h1 + hook -> 6-row stat comparison -> ten-activity diverging bars (chart) -> 2-card deep-link grid | 5 | ~60-80 |
| `/extremes` | hero -> up to five lenses behind a client filter (Collections, Cost-to-open, Take-home, Break-in, Crowding), each eyebrow + title + intro + ranked cards | 6 | ~300+ |
| `/margin-index` | h1 + lede -> `MarginIndexControls` -> `MarginIndexView` (one ranked leaderboard) | 3 | ~45 |

### The editorial surfaces

| Page | Sections | Count | Prose |
|---|---|---|---|
| `/blog` | breadcrumb -> header (hero + 2 stats) -> featured post -> index by subject, 6-7 card-groups each heading + list | 4 | ~64 template |
| `/blog/[slug]` | back-link -> masthead + cover -> markdown body -> "Read more", 4 related | 4 | ~0 template; 70 posts average 116.7 words, only 4 of 70 use sub-headings, 0 of 70 embed an image |
| `/learn` | breadcrumb -> header -> three reading tracks, each heading + blurb + list -> closing disclaimer | 4 | ~361 template, 5.6x `/blog`'s |
| `/learn/[slug]` | hero/overview -> P&L breakdown (chart) -> revenue spread (chart) -> honest take -> explanation -> other businesses -> benchmark deep-links -> related questions -> sticky nav | 9 | ~45 template; 54 articles average 100.7 words; only 11 of 54 have a P&L section |

Two defects found while reading `/learn/[slug]`, reported as observed, not
verified by render: the "Other businesses" section is composed with a heading and
~21 words of copy but the call site never passes the `format` prop
`SameBusinessNearby` requires, so it renders empty on every article with adjacent
data (`learn/[slug]/page.tsx:294-306` against `sections.tsx:489`); and "revenue
spread" and "honest take" carry no `id`, so the page's own sticky nav never lists
them.

### The trust and tertiary surfaces

`/methodology` (313 lines) and `/about-data` (191 lines) carry a **stated**
division, not an accidental one: `/methodology`'s own header calls itself "the
editorial front door" and `/about-data` "the long-form annex". `/about-data` was
recently moved onto the shared `LegalPage` card shell after being found painting
directly onto the fixed photograph with no card under it - the paint rule again.
`/faq` (327 lines, 8 questions) derives its `FAQPage` JSON-LD programmatically
from the same React nodes as the visible copy, "so there is no second copy to
fall out of step". `/pricing` (305 lines) reads the same `TIERS` /
`paywall_copy.ts` source as the homepage's `UpgradeTeaser`, so the two cannot
drift. `/check` (58 lines) is a client-only ratio checker; `/status` (198 lines)
is a live dependency dashboard, `force-dynamic`.

Tertiary, one line each (classified from file headers, not deep reads):
`/account` auth, `/admin/*` admin (3), `/contact` tertiary with a real form,
`/cookies` `/privacy` `/terms` legal on the shared `LegalPage` shell,
`/download/2026-benchmarks` lead-magnet landing, `/saved` auth, `/signin` auth,
`/you` auth/tertiary.

The cohesion audit's finding still holds for this whole set: `/coverage`, `/faq`,
`/pricing`, `/tools`, `/learn`, `/blog` and `/about-data` carry **zero icons of
any of the four systems**, and `/about-data`'s h1 is the only h1 on the site not
set in the display face
(`docs/superpowers/plans/2026-08-17-cohesion-audit.md` §2 item 8).

## 1.5 Shared components, bespoke one-offs, and overlap

### Four parallel component systems power the data pages, sharing no code

| System | Path | Used by |
|---|---|---|
| **`kit`** | `src/components/kit/*` (minus `engraved/`) | cell, sub-cell, city, industry |
| **`kit/engraved`** | `src/components/kit/engraved/*` | **country page only** |
| **`board`** | `src/components/board/*` + `src/lib/ui/typography.ts` | opening, buy-or-start, industry-across, `/cities` stat cards |
| **`spine` / `spine2`** | `src/components/spine/*`, `src/components/spine2/*` | the non-default bodies of country, region, cell, city, hood, industry; **plus the live `/world` and `/industries` footers and background** |

Each renders conceptually equivalent things - a masthead, a verdict box, a
comparison table, a closing CTA - with zero shared component code. This is
charter §7's cohesion problem stated as an import graph.

### Overlap findings

The founder's rule as quoted to this audit ("we only go vertically, never create
2 similar sister pages") **is not recorded in this repository in that phrasing**,
and the repo's existing "sister page" vocabulary means the opposite: in
`docs/specs/2026-05-19-plan-v13-credibility-fix-design.md` §P5 and
`src/lib/page-layout/section-order.ts:4-6`, a sister page is the same template
with different data, and the ratified rule is that sisters MUST render identical
sections in identical order. The overlaps below are therefore reported on their
own evidence, ranked by how much of one page another page already contains.

| Rank | Pair | What overlaps | Evidence |
|---|---|---|---|
| 1 | **Cell <-> sub-industry cell** | The **entire** `CellDecisionStack`, all 16 content sections, plus `AnswerFirstMasthead`, `MakeItYoursPanel`, `ZoomControl`, `AddToWatch`, `StickySectionNav`, `FreshnessStamp`, `FlagIt`. The sub-cell is the cell page minus 10 chrome elements plus one band. | `[sub]/page.tsx` header comment: "composes the SAME answer-first masthead + decision stack the main cell page uses" |
| 2 | **Country industries index <-> geo industries index** | Near-identical template: masthead card + lede + one card grid per sector. Matching class names and near-verbatim code comments. Differ only in scope and breadcrumb. | `src/app/[country]/industries/page.tsx` vs `src/app/[country]/[geo]/industries/page.tsx` |
| 3 | **City page <-> neighborhood hub** | The complete per-district dataset renders **three times**: 4 featured cards in the city page's `neighbourhoods` section, the complete list via `CityDistrictPicker` on the same page, and the complete list again as the hub page. | `src/components/cities/CityDistrictPicker.tsx:3-23`: "The list is not truncated. The city page already features four districts as cards above; this is the complete set, which is the half the separate pages were carrying." |
| 4 | **Opening <-> buy-or-start** | Same hero/compare/catches shape, same `board` family, and a **byte-identical 20-entry `generateStaticParams` array** that both files' comments say must be kept in sync by hand. | `opening/page.tsx:64-94`, `buy-or-start/page.tsx:67-97` |
| 5 | **Cell <-> city <-> industry** | `AnswerFirstMasthead`, `HonestTakeBox`, the `BeatCard` grammar, `OneThing`, `StickySectionNav`. Cell's `plain-terms` IS industry's `typical-operator` (both render `PlainTerms`); cell's `money` IS industry's nested `money` (both `MoneyGoesBreakdown`); **cell's `cost-drivers` and industry's `cost-drivers` are the same component under the same id**. | the `src/components/kit` barrel |
| 6 | **Country <-> city, duplicated implementations** | `VsWorld` and `OneThing` each exist **twice** - `kit/blocks/*` and `kit/engraved/*` - same export name, same job, different files. And the country's `CharacterPanel` (gov + culture spectra) is the same construct as the city's `CitySignaturePanel`, which even falls back to `country_signature_v1.json`. | `grep "export function VsWorld\|export function OneThing"` returns 4 definitions; `src/components/cities/CitySignaturePanel.tsx:18-19` |
| 7 | **Industry <-> industry-across** | Sub-route of the same trade's economics, sharing **no** component with its parent - `across` is `board`, the parent is `kit`. | `across/page.tsx` imports `board/format.ts`, `lib/ui/typography.ts` |
| 8 | **`/world` <-> `/countries`** | Both render "every country the atlas covers, grouped, linked", off the same reader (`getCoverageRows()`), through two unrelated pipelines that **disagree on the region taxonomy**. Three incompatible schemes ship across three pages, verified by reading the bucket names: `src/lib/regions/world_region.ts` uses Africa / Americas / Asia / Europe plus a Middle East ISO2 list; `src/app/(site)/countries/page.tsx` hardcodes Africa / Asia / Europe / MENA / North America / Oceania / South America with a ~140-entry ISO2 fallback typed into the page; `src/lib/scores/world_atlas.ts` uses Africa / Asia and the Pacific Rim / Caribbean / Central and Eastern Europe / Europe / Middle East and North Africa / North America / Oceania. **No bucket name is shared by all three.** | measured 2026-08-19 |
| 9 | **`/browse` - already resolved, and it is the precedent** | Deleted and 308'd to `/world` on the stated ground that it "repeated the homepage navigator's entry pattern and added lists that were already covered by /world, /industries and /cities. The page served no purpose distinct from the others." This is first-party evidence the team has enforced the anti-duplicate rule once. | `src/app/(site)/browse/page.tsx:4-9` |
| 10 | **`/extremes` take-home lens <-> `/margin-index`** | Both rank places by owner take-home for a trade, through **two unrelated codebases with no shared import**: `/extremes` runs on `src/lib/extremes/leaderboards.ts`, `/margin-index` on `src/lib/scores/recommend.ts` + `margin_index.ts`. Two leaderboard implementations of one problem, with nothing to keep them in sync. | each file's import block |
| 11 | **The recommender has three homes and none of them is `/decide`** | `src/lib/scores/recommend.ts`, whose own header says "Presentation lives at the /decide route", is imported by `src/app/page.tsx` (behind the OFF home flag), `src/app/(site)/margin-index/*` and `src/app/dev/decide-v2/*`. Grepping all three decide route files for `recommend\|composite\|rankPlaces` returns **zero matches** (verified 2026-08-19). The headline "where to open X" tool of the ratified strategy is live under a different URL, previewed at an unpromoted dev route, and flagged off on the homepage. | measured 2026-08-19 |
| 12 | **`/blog` <-> `/learn`** | Same silhouette (hero -> grouped list, no flat card wall), **zero shared list/card/group components**: `PostRow`/`FeaturedPost`/`groupPosts` against `ArticleList`/`TRACKS`, all page-local and unexported. Both were independently rebuilt to the same shape. | direct file comparison |
| 13 | **`/blog/[slug]` <-> `/learn/[slug]` are NOT siblings** | `learn/[slug]` shares `MoneyGoesBreakdown`, `RangeStrip`, `HonestTakeBox`, `SectionEmpty`, `StickySectionNav` with the numeric data pages; `blog/[slug]` uses a bespoke `LongformArticle` with no other call site. Zero shared components, under URLs that read as siblings. | direct file comparison |
| 14 | **Opening <-> buy-or-start <-> industry-across** | All three re-implement the break-in badge locally rather than sharing one component (`OpeningComparisons.tsx`'s local `BandBadge` against inline badge markup in `across/page.tsx`). | direct file comparison |

### The pattern the repo has independently rediscovered four times

The "uniform tile ribbon, one card per entity, no end" shape has been rejected
and rebuilt **four separate times**, each rebuild citing the founder rather than
a shared fix: `/world` and `/industries` (2026-08-03/08-07, *"all those repeated
country ribbons are just ugly"*), `/cities` (2026-08-17, *"it's just a big list of
cities... executed completely, completely awful way"*), and `/blog` (2026-08-18,
whose own comment reads "the same shape the founder rejected on /cities in his
own words", `src/app/(site)/blog/page.tsx:5-7`). **`/countries` still ships that
exact pattern** - a uniform bordered-tile grid grouped by continent, one card per
entity - and is the only index that has not been through the rebuild.

### Three section registries disagree with each other and with the code

| Page type | `section-order.ts` | `page-sections.ts` | Actually rendered |
|---|---|---|---|
| cell | 7 ids, of which `revenue-tiles`, `revenue-distribution`, `margin-waterfall`, `tax-and-cost-panel`, `related-cells` **no longer exist** (retired in WS3) | `CELL_SECTIONS`, current, but `operator-voices` and `vs-world` have no renderer | 16 stack sections + 18 page-level |
| country | 22 ids | 6 ids | 24 declared, 18 renderable |
| industry | 3 ids (`hero`, `how-it-works`, `margin-waterfall`) | 4 ids, only `margin-waterfall` shared with the first | 10 |
| region | 8 ids incl. a removed `top-industries` | not covered | 6 |

**And the industry page is deliberately written to evade its own gate.** Ten ids
are rendered but only `hero` is a literal `<section id=>`; the rest are
`<div id=>` or a `BeatCard id=` prop, and the file says so in its own comments at
`:412-413`, `:530` and `:690-691`. That is not a defect hidden from the author -
it is a documented accommodation to a gate whose extractor cannot see anything
else (see Part 3, Tier 3).

---

# PART 2 - THE PAST-ERRORS CORPUS

Sources: the charter
(`docs/superpowers/plans/2026-08-17-founder-brief-and-loop-charter.md`), the
2026-08-18 handoff (`docs/handoff/HANDOFF-marginatlas-2026-08-18.md`),
`CLAUDE.md`, `docs/verification-protocol.md`, the cohesion audit
(`docs/superpowers/plans/2026-08-17-cohesion-audit.md`), the ten `docs/loop/`
step files, seven 2026-07/2026-08 plans and specs, and 120 commit subjects.

## (a) HARD RULES the founder has ratified

Quoted where the source quotes him verbatim.

### Process

| # | Rule | Source |
|---|---|---|
| A1 | **Work on the newest version in the repo; do not chase the live site.** *"your challenge is not to put everything in an update... Do not worry about the live page."* | charter §0.1 |
| A2 | **Quality over speed.** *"you're just addressing the fast without, you know, thinking about the quality of what you're doing, okay? That's a very big problem still."* | charter §0.2 |
| A3 | **Measure before you change; read the module that produces a number before acting on it.** | charter §0.3, CLAUDE.md "Working method" 1 |
| A4 | **State the instrument's blind spot before quoting it** - write "this measurement cannot distinguish X from Y". | CLAUDE.md "Working method" 2, `docs/loop/00-OPERATING-RULES.md` §4.2 |
| A5 | **One change, one verification, before the next change.** | CLAUDE.md "Working method" 3 |
| A6 | **A ratified rule becomes a gate in the same session, or is written down as not machine-checkable with the reason.** | CLAUDE.md "Working method" 4 |
| A7 | **Never push. Never deploy. Never run `npm run build` as cadence.** `npx tsc --noEmit` and `npm run prebuild` are the cadence. | charter §8, §9.5; `docs/loop/00-OPERATING-RULES.md` §1.1-1.2 |
| A8 | **Never raise a ratchet baseline to make it pass.** Widening a detector is a different operation, permitted only when the rise is arithmetically explained. | charter §8; handoff §9; `00-OPERATING-RULES.md` §1.3 |
| A9 | **Never fabricate a figure; never reconcile two figures by averaging.** A gap is recoverable, a wrong number is not. | handoff §9; `00-OPERATING-RULES.md` §1.4 |
| A10 | **Never drop or butcher an agreed section.** | charter §8; `docs/verification-protocol.md` §0 |
| A11 | **Never run `git stash` / `checkout .` / `reset --hard`** while agents share a tree. | charter §9.3.1; `00-OPERATING-RULES.md` §1.6 |
| A12 | **`.mcp.json` is intentionally dirty; never commit it.** | charter §8 |
| A13 | Reporting: under ten lines, lead with what was wrong and what was measured, numbers over adjectives. | handoff §9; `00-OPERATING-RULES.md` §8 |

### Design and copy

| # | Rule | Source |
|---|---|---|
| B1 | **The background photograph is fixed, covers the screen, is NOT behind the header, shows at full strength at the edges, still reads in the centre, and the softening comes from the CARDS.** *"we put everything in those cards."* Six checkable requirements B1-B6. | charter §1 |
| B2 | **Cream is banned outright.** *"to remove completely this creamy color from the page. That's totally not allowed."* | charter §2 |
| B3 | **The homepage H1 is settled and locked.** *"you changed the H1 of the homepage, which is a big mistake, it was just perfect."* | charter §3 |
| B4 | **The homepage is institutional, text-heavy and detached; cut text, add elements.** *"It lacks flavor, it lacks elements. It just has a lot of text, when it should not."* And: *"our pages should not be bloated with text."* Models named: Airbnb, airlines, premium rentals. | charter §4 |
| B5 | **Country and city pages are not updated.** *"the country pages, they are totally not updated... The city pages, the city pages are also not updated."* | charter §5 |
| B6 | **`/cities` is broken.** *"it's just a big list of cities which doesn't end, and it's executed completely, completely awful way. And the map of the world is not even visible."* | charter §6 |
| B7 | **Cohesion.** *"you should check about how cohesive all the pages are."* One frame, one card treatment, one type scale, one palette, one density. | charter §7 |
| B8 | **Terracotta plus cool neutrals ONLY.** No green, no amber, no brown, no cream. | charter §8 |
| B9 | **No em-dashes in user-visible copy.** | charter §8, CLAUDE.md |
| B10 | **No source-agency names in user-facing copy.** | charter §8, CLAUDE.md |
| B11 | **No URL slug renames** - SEO equity rides on existing URLs. | CLAUDE.md; `2026-08-04-overnight-50.md` Hard constraints |
| B12 | **No raw hex / px / ms in components. Tokens only.** | charter §8, CLAUDE.md |
| B13 | **No stock imagery.** | charter §8 |
| B14 | **Exactly two surface levels.** *"Text should always be in some form of card, stronger white. When no card we have a lighter version of white which makes the same image in the background more visible. That's it."* (2026-08-01) | `scripts/verify_two_surface_levels.ts:6-8` |
| B15 | **Homepage: at least ten sections.** *"continuation on the homepage work, homepage should have at least 10 sections, currently very deficitary and bland"* | `docs/loop/10-HOMEPAGE.md` |
| B16 | **Home spine ratified at eight sections.** *"Home spine: Approved. Eight sections, build on it."* Superseded in count by B15; the two are not reconciled anywhere. | `2026-08-07-overnight-design.md` Task B1 |
| B17 | **Icons are too small and too few.** *"too small and too few"* - section head 18 to 24px, inline 13 to 16px, tile 24 to 32px, plus a 40px drawing anchor; no glyph repeats across two chapters on one page. | `2026-08-07-visual-reform-design.md` §4.2 |
| B18 | **Text budget: one drawing plus at most 20 words of prose, counted per PARAGRAPH.** *"Now the pages are publishable, but they are not digestible. They feel like statistical reports that are so ugly."* `Statblock` banned as the default answer, capped at 4 rows. | `2026-08-07-visual-reform-design.md` §1, §3, §4.1 |
| B19 | **Banned words:** turnover (say revenue), covers (say orders), pp / percentage points. Canonical phrase: "what the owner keeps". | `scripts/verify_banned_vocabulary.ts:15-19` |
| B20 | **No first person** ("we/us/our/I"), not even in FAQ answers. | `2026-08-04-overnight-50.md` Hard constraints. **Not gated.** |
| B21 | **The founder designs; the agent ports and never invents visual identity.** A week of AI-invented design was rejected in June 2026. | `2026-08-04-overnight-50.md` Global Constraints; `2026-07-27-five-page-types-design.md` Phase 3 |
| B22 | **Good-versus-bad is shown with intensity in ONE hue, never two.** The one correct implementation is `src/lib/scores/band_tone.ts`. | handoff §5.7 |
| B23 | **Ink on the backdrop is fine at any size; terracotta on the backdrop only above roughly 24px.** Measured: backdrop darkest luminance 0.4179, `ink-900` 7.78:1, `atlas-700` 3.79:1. | charter §9.1.1 |
| B24 | **Radius scale `--r-lg/md/sm/xs` = 10/8/6/4; motion 90/150/200ms; nothing carrying data animates; one 14-value spacing scale; 40px minimum tap targets; no eyebrow above a heading.** | `2026-08-07-overnight-design.md` Global Constraints |

### The one contradiction inside (a)

**Self-omission versus the completeness inversion.** CLAUDE.md ("If data is
insufficient, `return null` - graceful silent omission, no placeholder"), charter
§8 ("Prefer self-omission to a number you cannot source") and the handoff glossary
("self-omission: rendering nothing rather than a placeholder. Sanctioned and
preferred") all say omit. `docs/superpowers/specs/2026-07-27-five-page-types-design.md`
ratified the opposite on 2026-07-27: a page is always complete, missing data
renders a designed gap state in place, never `return null`, quoting the founder
*"Try to write something in all of them, even if it is not true, because we care
about the visual aspect."* Nothing in the repo reconciles these, and no gate
encodes either. Flagged, not resolved.

## (b) DEAD ENDS - tried and ruled out, with the reason

| # | Dead end | Reason | Source |
|---|---|---|---|
| D1 | **Carding the homepage section headings.** | Measured: `ink-900` clears AAA at 7.78:1 on the backdrop's darkest point. A visual pass nearly restructured eight bands for nothing, and it would have cost the "backdrop reads between the cards" look. | charter §9.1.1; handoff §6 |
| D2 | **Asserting `take-home == margin x revenue`.** | The resolver returns `max(structuralNetProfit, marginFloor)` then a larger-firm floor. Equality fails on correct data; the contract is a floor in one direction. | handoff §6 |
| D3 | **"Fixing" the cell-page data bands that self-omit locally.** | Documented latency artifact: cell lookups exceed a 4s budget from this machine to eu-west-1. They render in production. | charter §9.3; handoff §6 |
| D4 | **Lowering `verify_palette_membership`'s 93% lightness escape to catch cream.** | It re-catches every warm and cool white on the site. `verify_no_cream` exists separately for this reason. | charter §11; handoff §6 |
| D5 | **Importing the take-home resolver into a formatter to empty the bypass list.** | Dishonest; the remaining entries are measurably clean and the list is not meant to reach zero. Rebuilt into two buckets instead. | handoff §4, §6 |
| D6 | **Changing the H1** (including the argument "motion competes with the search"). | Already made and rejected. | charter §3 |
| D7 | **Folding a label into a caption class because they share a size.** | One such "third duplicate" was `--text-body` at weight 600 and a different role. | handoff §6 |
| D8 | **The `featured-tiles` gate.** | Guarded a grid deleted from the home page; a stale 22-May snapshot could fail a Vercel build for a feature that no longer exists. Deleted, not left unregistered. | `scripts/prebuild_all.ts:132-143` |
| D9 | **The `recommender-flag` test.** | Asserted a flag parses to false when unset; nothing consumed the flag. Died with its subject. | `scripts/prebuild_all.ts:252-257` |
| D10 | **Adopting CodeFronts components.** | Every item carrying visual identity was refused: the site has a ratified visual world and it is not CodeFronts'. | `2026-08-04-overnight-50.md` Task 5 |
| D11 | **Emoji flags for country markers.** | Windows renders regional-indicator emoji as letter boxes. Use the `CountryFlag` SVG component. | `2026-08-07-overnight-design.md` Task E2 |
| D12 | **Adopting Vitest.** | The repo already has a working bare-`tsx` test idiom; a framework adds a dependency, a config and a 16-file migration to gain nothing. | `2026-08-09-sharpen-the-axe.md` Corrections #2 |
| D13 | **Two proposed URL-validity gates** ("industry must resolve", "country + geo must resolve"). | The first would 404 269 of 800 real cell URLs; the second does not discriminate (`geoResolves("us","nowhere")` returns true). Only "country segment in COUNTRIES" measured clean. | `2026-08-09-sharpen-the-axe.md` |
| D14 | **Collapsing all box-shadows into one elevation token.** | 34 of the declarations are 1px borders/rules (`0 0 0 1px`, `inset 0 1px 0`), not elevation. | `2026-08-04-overnight-50.md` Task 22 |
| D15 | **`build_facts.py`'s metric-path scheme.** | Folding each row key into the metric-path string inflated 593 true metrics into 21,273 names and truncated 48% of row keys at 28 characters. | `2026-08-09-fact-warehouse-reform.md` |
| D16 | **Flipping `NEXT_PUBLIC_SPINE_REFORM_CITY`.** | Measured on real data for four cities: the legacy body renders 11 sections for every city, the spine body 3 to 4, and three of its seven chapters are STRUCTURALLY unreachable because the adapter deliberately omits their inputs. It also brings a nested `<main>`, an opaque `--c-card`, a second font pair and a third terracotta. | cohesion audit §5 |
| D17 | **Grepping rendered markup for the word "cream".** | One of the businesses the atlas covers is an ICE CREAM shop, visible in the homepage trade chips. Scope the check to attributes. | charter §11 |
| D18 | **A "totals-shaped object vs array length" gate written broadly.** | The obvious version produced 16 hits of which 15 were false, because every data/quality report states a POPULATION beside a SAMPLE. A gate that cries wolf gets switched off. | `scripts/prebuild_all.ts:339-350` |

## (c) RECURRING TRAPS - mistakes made more than once

### Tooling traps

| # | Trap | Evidence |
|---|---|---|
| T1 | **The Bash CWD resets to `E:\atlas`, the parent repo.** A gate run without `cd /e/atlas/website` fails with `ERR_MODULE_NOT_FOUND` and looks like a defect. | `00-OPERATING-RULES.md` §3; `2026-08-07-overnight-design.md` §1.3 |
| T2 | **Never run an untargeted `grep -r` from `E:\atlas`.** `page-data/` alone is over a thousand files. One such search burned ten minutes of a thirty-minute tick and timed out. | `00-OPERATING-RULES.md` §3 |
| T3 | **Compile the stylesheet AFTER writing the file.** Tailwind emits only classes it can see; a class written after the compile emits NO RULE and renders unstyled. **Cost twice in one day** (a `lg:columns-2` index measured taller at 1280 than 768; `--atlas-header-h` read as empty). | charter §9.3; handoff §5.6 |
| T4 | **Resizing the viewport without reloading lies about height.** `/blog` reported 12,282px where a fresh load of the identical file gave 32,114. | charter §9.3; handoff §5.5 |
| T5 | **Bash heredocs eat backslashes**; nested code fences break them outright. Python heredocs turned `\a` into a bell character and `\b` into a backspace, silently disabling three of four regex patterns. | charter §9.3; `2026-08-07-overnight-design.md` §1.3 |
| T6 | **`grep -c` returning 0 exits status 1**, silently breaking an `&&` chain and skipping the commit meant to follow it. **`$?` after a pipe reports the last command's status**, not the gate's; use `${PIPESTATUS[0]}`. | `2026-08-07-overnight-design.md` §1.3; handoff §11 |
| T7 | **The browser preview pane has a 0x0 hidden viewport**: `.focus()` does nothing, IntersectionObserver never fires, layout measurements are all zero. Verify interactive things in jsdom. | charter §9.3 |
| T8 | **`file:` is blocked in the browser tools.** Serve the scratch dir AND `public/` from one static server. | charter §9.1 |
| T9 | **Three render shims are traps, not defects:** `next/font/google` is a build-time transform and is not a function at runtime; `useRouter`'s invariant throws with no app router; `.css` and image imports must be stubbed. **Stub only the three router hooks - leave `notFound` and `redirect` real**, or the harness reports a 404 route as rendering. | charter §9.1; `00-OPERATING-RULES.md` §5 |
| T10 | **Prebuild concurrency must stay at or below 4 on Windows.** 6 segfaults intermittently; two agents crashed on Windows OOM. A gate failing with a Go runtime trace and `TransformError: The service was stopped` is esbuild dying under load, not an assertion failing - re-run it alone before reporting red. | CLAUDE.md; `00-OPERATING-RULES.md` §3 |
| T11 | **Playwright writes screenshots to `E:\atlas`**, the parent repo, not the website repo. | handoff §11 |
| T12 | **Tree-wide git commands sweep up other agents' work.** One `git stash` took two agents' uncommitted work; a stash holding a PRE-DELETION state silently restores lines a commit deliberately removed. | charter §9.3.1 |
| T13 | **`npx tsc --noEmit` and `npm run prebuild` are also tree-wide.** A red gate may belong to another agent mid-write; the take-home gate failed twice this way and passed on re-run. | charter §9.3.2 |
| T14 | **Git Bash rewrites bare `/...` arguments into Windows paths** (`/dev/industries2` becomes `C:/Program Files/Git/dev/industries2`). | `2026-08-07-overnight-design.md` §1.3 |

### Verification traps

| # | Trap | Evidence |
|---|---|---|
| V1 | **A `position: static` element on this site is not drawn at all.** Not dimmed - absent. `AtlasFrame` paints fixed layers at `z-index: 0`. **Nothing in the source was wrong**: every class correct, every token correct, 98 of 98 gates green, and the entire site footer unpainted on every page for weeks. Only a rendered pixel finds this class of defect. | charter §9.2; handoff §5.1 |
| V2 | **`strip_comments` blinded the whole chain three times.** A naive `startsWith("//")` understood the first line of a block comment and none of the rest (two gates hit it in one sitting). Then a `/*` inside a STRING literal opened a block comment: on `src/app/_design/page.tsx` it hid **195 of 451 lines**, including 45 `className` lines, and every gate reported PASS. It did not run to EOF - an unrelated real `*/` closed it - so the damage window had no relationship to the bug. | charter §11; `scripts/prebuild_all.ts:159-171` |
| V3 | **A gate that cannot observe its subject reports it absent, confidently, with a figure attached.** `verify_palette_membership` knew 3 colour names of 19 (`bg-emerald-700` was invisible) and had never scanned `src/lib`, so it had never read the file that defines the palette. Its 165 cream baseline "could not have moved in either direction". | charter §11; handoff §4 |
| V4 | **A gate that skips directories by bare NAME will eventually skip real source.** `verify_no_internal_notes` skipped anything named `coverage` and reported PASS for months about files it had not opened. | CLAUDE.md corollaries |
| V5 | **A test file that nothing runs is not coverage.** `tests/` held 16 files; 4 were wired. Twelve were written, committed, and executed by nothing, reading as coverage from the outside. | `scripts/prebuild_all.ts:215-229`; `2026-08-09-sharpen-the-axe.md` |
| V6 | **Checking one width is not checking.** Three separate defects existed at exactly one breakpoint: an anchor offset verified at 1440 left three bands broken; a country row verified at desktop gave its value column 37px at 375 and sliced words; `/industries` was fine at desktop and a blank sheet on a phone, across 200 routes. | handoff §5.2 |
| V7 | **A banned colour hides under a permitted name.** Four times in one session: `parchment` WAS `cream-300` across 419 call sites; `teal` measured hue 150 (green); `delta.positive` held moss-700; `--pos` held it again. Cream had five names and 380 hairline uses spelled with one that does not contain the word. | handoff §5.3; charter §11 |
| V8 | **Tailwind's content scan does not strip comments.** Naming a retired utility in prose re-emits it into the stylesheet; a comment written in the same commit resurrected `.border-cream-300`. | charter §11 |
| V9 | **Trusting flag/component code instead of rendered HTML.** Fetching six live page types and grepping for the design's own DOM markers showed the design live on exactly ONE of six page types. | `2026-08-16-design-rollout-to-all-pages.md` §1-3 |
| V10 | **A dead dev server returns a 0-byte response**; grepping an empty file prints nothing, which reads exactly like a pass. Two dev routes with no route file served HTTP 200 with 594 characters of stale chrome for days while an audit tool called them clean. | `2026-08-07-overnight-design.md` §1.2, Segment D |
| V11 | **`withBudget` logs on TIMEOUT only**, so a fast-failing query is silent. That distinction cost three firings and hid a three-month outage (a rotated service-role key; every page fell back to synthesised figures and nothing said a word). | CLAUDE.md; `scripts/verify_db_credential.mjs` |
| V12 | **Nothing the build runs may read outside this repository.** It has killed deploys twice: two prebuild scripts reading `../design/mockups/*` (nine dead deployments) and **five dev routes reading `../page-data/*` with `fs` at module scope** (forty consecutive failed deploys). The second survived an audit run specifically looking for the first, because that audit searched `scripts/` and never looked in `src/`. | `scripts/verify_no_parent_repo_reads.ts:1-40` |
| V13 | **A ratchet that can never reach zero gets read as noise.** The take-home bypass list stuck at six read as six outstanding defects when the true number was zero; rebuilt into `unreviewed` (must be empty) and `reviewed` (carries evidence). | `scripts/verify_take_home_identity.ts:44-60` |
| V14 | **The gate count is the chain, not any document.** "A gate count that reads low is how a missing gate hides." | charter §9.2; `00-OPERATING-RULES.md` §3 |

### Measurement traps

| # | Trap | Evidence |
|---|---|---|
| M1 | **A naive grep counts a sweep's own explanatory COMMENTS as both conversions and defects.** "112 atlas-card uses against 41 hand-rolled" was really **83 against 103**, and the 103 was itself the wrong question (20 were chips, 14 were form inputs). Two gates in the chain carry headers about exactly this mistake and the coordinator made it anyway. | charter §12 |
| M2 | **Never let a test depend on the ORDER classes are written in.** A classifier matching `rounded-* ... border-* ... bg-white` in that written order reported ZERO hand-rolled homepage cards; the blog rail spells `rounded-md bg-white border border-parchment` and rendered **six times**, the only opaque white surface left on the page the founder looks at. | charter §12 |
| M3 | **Comparing rounded DISPLAY values invents defects.** Seven apparent take-home breaches were the money formatter's abbreviation. | handoff §5.4 |
| M4 | **A stored total counts what was ALLOCATED, not what carries evidence.** `regional_cells + extrapolated_cells` looked like a benchmark count at three call sites and was a slot count at all three: 169 rows of the coverage report are an empty 44x6 grid. Gated by `verify_no_slot_counting`. | CLAUDE.md corollaries |
| M5 | **A stated total drifts from the array it counts.** `city_list_v1.json` said `totals.total: 200` and a `continent_split` summing to 200 while its array held 252, using region codes present nowhere in the data. Deleted rather than recomputed. | `scripts/prebuild_all.ts:339-350` |
| M6 | **Counting a text budget per SUBSECTION instead of per PARAGRAPH** lets a 60-word block average out against two empty ones and read terribly while passing. | `2026-08-07-visual-reform-design.md` §4.1 |
| M7 | **A ratchet keyed by file PATH reads a pure file MOVE as new violations.** `verify_hardcoded_hex` read 78 new hex against a baseline of 0; reconciled by asserting entry-count and hex-total were identical before and after (28 and 294), never by raising the baseline. | `2026-08-09-sharpen-the-axe.md` Task 1.3a |
| M8 | **A stale 79MB git worktree inflated every repo-wide `find`**, and corrupted a "24 tests" claim down to a real wired count of 4. | `2026-08-09-sharpen-the-axe.md` |
| M9 | **An instrument that reads source lines sees the class a component MENTIONS, not the pixel a reader SEES.** It cannot tell a class behind an off flag from one that renders, nor resolve which of two overlapping grounds wins. | charter §11; cohesion audit §0 |
| M10 | **A ratchet's own net can test for something that no longer exists.** The cream rgb net held one hand-written pattern for a page ground the migration had already deleted: zero hits across all of src, a passing line contributed for nothing, while the one file still literally painting cream was the one file it could not see (it understood only `rgb(a, b, c)`, not the `rgb(a b c)` form CSS equally accepts). | charter §11 |
| M11 | **Six measurement artifacts have died to "read the module that produces a number before acting on it".** | charter §0.3; CLAUDE.md |
| M12 | **SVG text is measured in USER UNITS, not pixels.** `CountryShape`'s ring words rendered 9.92px on desktop and **5.86px on a phone**, because "8.5px" inside a viewBox scales with the container. An earlier small-type census of 108 missed them; the real number is 114. | charter §13 |

### The defect corpus in the commit log

`git log --format='%s' -120` is written as "what was wrong", so it is a defect
register in its own right. The recurring shapes, counted by hand across those 120
subjects:

- **Palette / banned-hue leakage: ~30 subjects.** The purge ran from "24 greens and ambers rendering on the live country page, in a form no gate reads" through "a banned green was hiding under a permitted name" to "the ramp is called paper now, and nothing on this site is called cream".
- **A gate or instrument that was blind: ~12 subjects**, e.g. *"gate: a ratchet stuck at six read as six defects when the true number was zero"*, *"palette: the gate had never read the file that defines the palette"*, *"strip_comments: one quoted /* switched off every gate for 195 lines"*, *"palette gate: it knew three colour names out of nineteen, and its writer had a hole"*.
- **A figure contradicting another figure on the same surface: ~10 subjects**, e.g. *"compare: the take-home column contradicted the margin column beside it, on 55% of the input shape"*, *"london: the curated take-home contradicted its own net margin on all 20 activities"*, *"extremes: the ranked take-home was not the number its own cell page prints"*.
- **Something that did not paint at all: ~8 subjects**, e.g. *"chrome: the footer has not been drawn on any page since the frame went site-wide"*, *"cities: the world map drew at 72% of its frame with Antarctica clipped flat"*, *"tokens: 26 colour classes that emitted nothing"*.
- **Mobile-only breakage: ~6 subjects**, e.g. *"industry: the trade pages were a blank white sheet on a phone, all 200 of them"*, *"country: a two-column row at 375 gave the value 37px and sliced the words"*.
- **Dead code kept alive: ~5 subjects**, e.g. *"activity board: 239 lines of board scaffold the industry page never read"*, *"cell board: delete the A-J sections, computed on every cell and read by nobody"*.
- **Prose bloat: ~6 subjects**, e.g. *"home: the blog rail was 84% of the ink on the page"*, *"country: six ledes that said the heading again"*, *"copy: two sentences each page said to the reader twice"*.

## (d) OPEN QUESTIONS still unanswered

All seven live questions are in `docs/loop/DECISIONS-NEEDED.md`, each written to
be answerable in one word. None has been answered ("## Answered - _(nothing yet)_").

| Q | Question | Recommendation on file |
|---|---|---|
| Q1 | **The type floor.** 114 nodes compute under 12px; the live decision is the 10px step, 31 nodes, 24 of them the character panel's load-bearing spectrum end labels. | **B** - 10px goes to 10.5px, a size already in the ladder |
| Q2 | **`--text-faint`.** `#87745d` measures 4.48:1 on white and 4.35:1 over the card's worst backdrop; AA is 4.5, and 82 of the 114 small nodes are this one token. Nothing exists between it and `--text-muted` at 9.58:1. | **B** - accept 4.48 and write down why |
| Q3 | **Do the gates run on a Vercel deploy?** No `vercel.json` exists, so the build command is a dashboard setting; if Vercel runs `next build` directly the npm `prebuild` hook is bypassed and all gates are skipped in CI while passing locally. | **A** - add `{ "buildCommand": "npm run build" }` |
| Q4 | **May the loop remove a claim from a live page?** | **A** - remove and state it, since a wrong claim costs more than a missing one |
| Q5 | **The homepage band count.** Ten asked for; eleven declared. | **A** - build to twelve or thirteen declared |
| Q6 | **91 tracked screenshots at the parent repo root, 16.5 MB**, committed 2026-07-27, classified by naming family and never opened. | **A** - sample a dozen, confirm, delete in one parent-repo commit |
| Q7 | **The break-in word.** A 10% move in one real input changes the printed word **14.1%** of the time across 1,764 combinations; on 3 of 4 call sites time-to-open has no place argument, so **24% of the score is a per-trade constant identical in every city**. Four of five production callers hard-code `restsOnModeled` to true and exactly ONE component shows the reader. | **A** - carry the caveat and the driver bars to every surface printing the word |

### Open questions outside `DECISIONS-NEEDED.md`

- **Which stylesheet order production actually serves**, and therefore how much of the live site a reader currently sees in the wrong face after the `--font-display` self-reference fix. (`docs/loop/STATE.md`, "Leads, resolved")
- **Whether to name spine-2 or the legacy system as the convergence target.** The cohesion audit calls this the founder's decision and says any per-property convergence will be relitigated on every page until one system is named. (cohesion audit §2 item 5)
- **The meaning-scale for `--moss/--amber/--clay`** against the banned-hue rule. (`2026-08-09-sharpen-the-axe.md` Task 2.2)
- **The `/dev` prototype keep/retire list** (37 routes) and the stale 79MB worktree. (`2026-08-09-sharpen-the-axe.md`; `docs/loop/STATE.md` item 9)
- **The ten-shape drawing catalogue** needs a one-time keep/kill/fix verdict per shape before any gate is written. (`2026-08-07-visual-reform-design.md` §2, §7)
- **Two Supabase migrations written and never applied.** `newsletter_signups` and `corrections` do not exist; every signup and every reader correction has been silently discarded while four forms told the reader it worked. `db/migrations/2026-08-16-*.sql`, both idempotent. Named in the handoff as "the highest-value non-code item in the repo".

---

# PART 3 - THE GATE INVENTORY

## 3.0 The count, and the four stale numbers

`scripts/prebuild_all.ts` registers **102 gates** (counted programmatically over
the `GATES` array, not by eye). What the documents say:

| Document | States | Status |
|---|---|---|
| `CLAUDE.md:92`, `:99` | 95 gates | **stale** |
| `docs/verification-protocol.md` §1 and the checklist | "prebuild 31/31" | **stale by 71** |
| charter §9.2 | 99/99 | stale |
| `docs/handoff/HANDOFF-marginatlas-2026-08-18.md` §3 | 101/101 | stale by one |
| `docs/loop/STATE.md` | **102/102** | current |

`docs/loop/STATE.md` already lists items 1 and 2 on its own contradiction list.
The chain is the authority; a count reading low is how a missing gate hides
(charter §9.2).

### The 102nd gate is not committed, and its script is untracked

Measured 2026-08-19:

```
git show HEAD:scripts/prebuild_all.ts | grep -c '{ name: "'   ->  101
grep -c '{ name: "' scripts/prebuild_all.ts                    ->  102
git ls-files --error-unmatch scripts/verify_no_self_referential_css_vars.ts
  ->  error: did not match any file(s) known to git
```

**HEAD registers 101 gates. The working tree registers 102, and gate 102's
script is untracked.** So `docs/loop/STATE.md`'s "prebuild 102/102" and its tick-4
entry ("Added gate 102 ... Chain is now 102/102") describe an uncommitted working
tree, and the 2026-08-18 handoff's 101 is correct about HEAD. Five other files
from the same tick are modified and uncommitted (`scripts/prebuild_all.ts`,
`src/app/globals.css`, `src/app/layout.tsx`,
`src/components/brand/LogoWordmark.tsx`, plus the loop's own step files).

This directly breaks the loop's own rule 7, *"One commit per landed change,
incremental, never batched. Every agent that batched has lost work; every agent
that checkpointed has kept it"* (`docs/loop/00-OPERATING-RULES.md` §7). An
untracked gate script is one `git clean` from gone, and the fix for the
self-referential `--font-display` defect goes with it. **Nothing in this audit
touched those files; they were already in this state at its start.**

**`npm run prebuild:serial` in `package.json:46` runs 43 gates, not 102.** It is a
hand-maintained `&&` chain that has not tracked the parallel runner. `CLAUDE.md`
offers it as the fallback "if parallel is flaky", and on Windows parallel IS
flaky (`00-OPERATING-RULES.md` §3). A fallback that silently runs 42% of the
chain is a gate-coverage hole in itself.

## 3.1 The 102 gates

Ratchet column: **R** = baseline that may only shrink; **H** = hard gate;
**R\*** = ratchet whose baseline writer will NOT refuse a raise.

Rows follow registration order in `scripts/prebuild_all.ts`. Two rows collapse a
run of individually registered test files, so the row labels are not gate
indices; the registered total is **102**.

| Row | Gate | Enforces | Type |
|---|---|---|---|
| 1 | `taxonomy` | Structural invariants of the industry/sector taxonomy | H |
| 2 | `no-em-dashes` | No U+2014 in JSX text or string literals under `src/` | H |
| 3 | `no-source-agencies` | No known source-agency name outside comments under `src/` | H |
| 4 | `cell-lattice` | The number relationships (PORT-CONTRACT M1-M9) over every real cell JSON. **Reports 3 deferred checks by design; deferred is not passed** | H |
| 5 | `derived-accents` | M5: the terracotta accent is derived, never hand-placed | H |
| 6 | `spine-css-fresh` | `src/styles/atlas-spine.css` is not stale against the mockup stylesheet | H |
| 7 | `glyphs-fresh` | The generated glyph module is not stale against `design/mockups/glyphs.js` | H |
| 8 | `cell-data` | Arithmetic reconciliation of the one hand-filled data file | H |
| 9 | `banned-vocabulary` | turnover / covers / pp, on the REACT source. **Scoped to `src/components/spine2` + `src/lib/cells`** | H |
| 10 | `no-fixture-in-routes` | Mockup fixture data may never reach a reader | H |
| 11 | `dead-anchors` | An `href="#id"` names a section that exists (the fragment half of dead-links) | H |
| 12 | `export-columns` | `/api/export-csv` emits only allowlisted columns, never a raw provenance string | H |
| 13 | `population-mix` | POPs vocabulary is a closed set; the mix sums to 100 | H |
| 14 | `district-wealth` | District wealth ships as one of five bands, never an index number | H |
| 15 | `district-mix` | Capped vocabulary, max five types, ordered largest first, every district covered | H |
| 16 | `subtypes` | Max ten subtypes per trade; five facts as a figure or an honest null; repeat frequency banded, never counted | H |
| 17 | `district-geometry` | District coordinates are relatively plausible (catches a flipped longitude) | H |
| 18 | `no-hardcoded-hex` | No NEW hex literal in `src/app` / `src/components` `.tsx` | **R\*** |
| 19 | `token-contrast` | WCAG AA on every token that carries text (247 of 251 clean when written) | H |
| 20 | `dead-links` | Every literal `href="/..."` resolves to a route in `src/app` | H |
| 21 | `render-guards` | The render-time data-quality fixes are wired | H |
| 22 | `deepening` | Deepening-framework integrity | H |
| 23 | `monetization-coverage` | No monetization gate is RED | H |
| 24 | `v34-research-rules` | The 20-item anti-pattern register from v34 Part 8 | H |
| 25 | `no-internal-notes` | No "Cloned from X"-class internal note in user-visible source | H |
| 26 | `no-slot-counting` | A slot count is never published as an evidence count | H |
| 27 | `page-has-h1` | Every shipping page has an `h1` | H |
| 28 | `no-dev-links` | No shipping page links into `/dev` | H |
| 29 | `api-endpoints-exist` | Every fetched API path has a route handler | H |
| 30 | `industry-refs` | An industry reference resolves rather than fuzzy-matching to something | H |
| 31 | `no-hardcoded-place` | No London seed baked into a component's links | H |
| 32 | `no-district-as-trade` | A district never occupies the trade segment of a cell URL | H |
| 33 | `retired-claims` | A claim corrected in a body is also corrected in the metadata | H |
| 34 | `no-stock-imagery` | No stock photo; in-source allowlist that may only shrink | R |
| 35 | `no-cream` | Cream references per file, counting down only. **33 across 16 files** | R |
| 36 | `take-home-identity` | A printed take-home never sits BELOW the dollars its shown margin implies; plus a two-bucket bypass list (`unreviewed` must be empty) | H + **R\*** |
| 37 | `token-steps` | No colour class naming a ramp step the palette does not publish | H |
| 38 | `no-self-referential-css-vars` | A custom property may not reference itself | H |
| 39 | `strip-comments` | The shared comment stripper, 9 test cases | H |
| 40-51 | `top-industries-plausibility`, `all-sizes-blend`, `geo-region-name`, `industry-resolution`, `search-cascade`, `research-drop-schema`, `facts-store`, `facts-shard`, `facts-confidence` | Data / adapter regression tests | H |
| 52 | `search-params-suspense` | `useSearchParams` without a Suspense boundary opts the whole route into client rendering while reporting as prerendered | H |
| 53 | `sitemap-no-redirects` | A sitemap URL is not a redirect and does not set noindex | H |
| 54 | `main-landmark` | Every shipping page emits a `<main>`. **Absence only - the duplicate-landmark rule was removed after a false positive** | H |
| 55-60 | `break-in-for-cell`, `composite`, `country-board`, `margin-index`, `recommend-core`, `scores`, `wave2-flags` | Score-engine tests | H |
| 61 | `robots` | robots.txt policy | H |
| 62 | `route-chrome-contract` | Every route gets the chrome it is supposed to (the home page once shipped with no masthead) | H |
| 63 | `no-silent-db-errors` | A failing Supabase read may not be silent | H |
| 64 | `dev-routes-sealed` | Nothing outside `src/app/dev` imports from it; robots disallows `/dev/` | H |
| 65 | `palette-membership` | Banned hues by NAME and by HUE BAND. **Returns legal above 93% lightness by design, so it cannot see cream.** Baseline records the ban list it was measured with; a rise is permitted only when arithmetically explained | R |
| 66 | `top-level-segments` | The country wildcard list matches `src/app`; fails in BOTH directions | H |
| 67 | `junk-url-rule` | The middleware 404 rule catches nothing the site publishes | H |
| 68 | `useless-tiles` | No tile that says nothing | H |
| 69 | `typography` | Every `h1/h2/h3` with a className carries a canonical typography token. **Escape hatch: `data-typography="custom"`, which every spine masthead uses** | H |
| 70 | `signature-quality` | 12 checks across 5 tiers on the signature panel | H |
| 71 | `cost-share-invariant` | The cost-share invariant per sector plus the default fallback | H |
| 72 | `key-benchmark` | Every sector has a valid, resolvable key-benchmark designation | H |
| 73 | `comparative-voice` | Flags descriptive-voice openers. **Soft / warn-only** | soft |
| 74 | `turnover-bands` | Structure of `turnover_bands_v1.json` | H |
| 75 | `wage-source` | Integrity of the wage source-of-truth file | H |
| 76 | `db-credential` | A REJECTED Supabase key fails the build; an unreachable host does not; no key is a skip | H |
| 77 | `fx-freshness` | Display FX rates warn at 92 days, fail at 183 | H |
| 78 | `city-wages` | Integrity of `city_wage_premium_v1.json` | H |
| 79 | `industry-medians` | Integrity of `industry_medians_v1.json` | H |
| 80 | `econ-profile-integrity` | Five economic-profile data files used by render code | H |
| 81 | `au-industry-map` | Every parsed ATO industry has a map entry | H |
| 82 | `au-anchor-render` | The AU primary-data anchor resolves end to end | H |
| 83 | `layering` | App imports Domain imports System imports Tokens, upward only. **14 grandfathered violations in the allowlist** | H |
| 84 | `section-order` | Rendered `<section id>` ids are a subsequence of the canonical order. **4 page types; see 3.3** | H |
| 85 | `cross-geography-guard` | No surface ranks or compares across business x geography | H |
| 86 | `page-sections` | Every page type renders its full content-map section set. **7 page types; see 3.3** | H |
| 87 | `bar-budget` | Bar-family graphic instances per page group, against a per-group budget | H |
| 88 | `no-bold-display` | Display weight tops out at semibold | H |
| 89 | `banned-patterns` | The retired "keep index" family and other banned metrics/copy | H |
| 90 | `registry` | The design section registry contract in `E:/atlas/design/registry/`. **PASSES when the directory is missing, which is every build server** | H |
| 91 | `no-eyebrow` | Rulebook rule 11: chapter index plus one plain title, no eyebrow | H |
| 92 | `subsection-icons` | Rulebook rule 12: an `AtlasIcon` tile left of every subsection title | H |
| 93 | `trade-set` | Rulebook rule 32: one fixed set of example businesses | H |
| 94 | `sample-tags` | Rulebook rule 4: anything modeled or sampled carries a visible `SampleTag` | H |
| 95 | `no-parent-repo-reads` | Nothing in `src/` reads outside the repository | H |
| 96 | `two-surface-levels` | Every white surface FILL is `var(--card)` or `var(--air)`. **Scans `src/styles/atlas-spine.css` and the parent mockup CSS only** | H |
| 97 | `page-metadata` | Every shipping route declares its own metadata; dated allowlist for four | H |
| 98 | `canonical-urls` | Every shipping route nominates its own canonical; allowlist ships EMPTY | H |
| 99 | `stated-totals` | A stated total may not disagree with the array it counts. Deliberately narrow | H |
| 100 | `paragraph-budget` | No NEW paragraph over 20 words. **Scoped to spine2 / city2 / country2 / world / industries / four dev workbenches** | R |
| 101 | `v2-scales` | The icon scale (18/13/24/14/16) and the radius scale, on the v2 surface | H |
| 102 | `spacing-scale` | Spacing comes from the 39-value scale, on `city2` / `country2` / `spine2` | H |
| 103 | `shared-revenue` | One revenue figure may not be the answer for seven cities. Repaired and flipped to `--strict` | H |
| 104 | `geo-link-construction` | A geo URL is built via `resolveGeoPage` / `countryPagePath`, not hand-assembled. **Registered as "(KNOWN DEFECT)"; still a ratchet, not `--strict`** | **R\*** |

_(The `40-51` and `55-60` rows each collapse a run of individually registered
test files. Counted programmatically over the `GATES` array, the registered total
is **102**.)_

## 3.2 The ratchets, and which of them can be raised

Seven baselines exist on disk:

| Baseline file | Gate | Refuses a raise? |
|---|---|---|
| `scripts/cream_baseline.json` | `no-cream` | **YES** (`verify_no_cream.ts:376`) |
| `scripts/palette_baseline.json` | `palette-membership` | **YES**, and it distinguishes widening the detector from raising the baseline, arithmetically (`verify_palette_membership.mjs:318-345`) |
| `scripts/paragraph_budget_baseline.json` | `paragraph-budget` | **YES**, unless `--force` (`verify_paragraph_budget.mjs:192-207`) |
| `scripts/hardcoded_hex_baseline.json` | `no-hardcoded-hex` | **NO** - `--update-baseline` writes unconditionally (`verify_hardcoded_hex.ts:104-118`) |
| `scripts/geo_link_construction_baseline.json` | `geo-link-construction` | **NO** - writes unconditionally at `:651`, and its own failure message says "Lower the baseline: ... --update-baseline" |
| `scripts/take_home_bypass_baseline.json` | `take-home-identity` | **NO** on seed (`:179`); the design leans on `unreviewed` being empty instead |
| in-source allowlist | `no-stock-imagery` | no writer; entries are removed by hand in the same change |

**So the founder's ratified rule A8 ("never raise a ratchet baseline to make it
pass") is machine-enforced on three of seven ratchets and relies on human
discipline on the other four.** The repo already knows the failure mode: the
paragraph-budget gate's own comment names it - *"A baseline that can be raised is
not a ratchet, it is a suggestion, and the first inconvenient failure reseeds
it"* (`scripts/verify_paragraph_budget.mjs:192-194`).

## 3.3 WHAT IS NOT COVERED BY ANY GATE

This is the part that matters. Each row names the ratified rule, what covers it
today, and what is left to human vigilance.

### Tier 1 - a ratified rule with NO gate at all

| Rule | Source | Gate | Note |
|---|---|---|---|
| **B1: the background is fixed, not behind the header, visible at the edges, softened in the centre BY THE CARDS** | charter §1, six requirements B1-B6 | **none** | The most-repeated founder ruling in the corpus. Verified only by a screenshot a human takes and reads. The paint rule (V1) that this ruling created is also ungated: nothing checks that a new surface is `position: relative`, and the failure mode is total invisibility, not a visual regression. |
| **B3: the homepage H1 is locked** | charter §3 | **none in the chain** | `scripts/audit/comprehensive_qa.ts:119` tests `/How much does/` but that script is not registered in `prebuild_all.ts`. A locked value with no lock. |
| **B11: no URL slug renames** | CLAUDE.md, overnight-50 | **none** | Nothing compares the route tree against a previous route tree. |
| **B20: no first person** ("we/us/our/I") | overnight-50 Hard constraints | **none** | Grepped: no gate mentions first person. |
| **B15/B16: the homepage section count** (ten asked for, eight ratified earlier) | `10-HOMEPAGE.md`, overnight-design B1 | **none** | The homepage is absent from `PAGE_SECTION_MANIFESTS` (`src/lib/page-sections.ts:116-122`) and from `PAGE_SECTION_ORDER` (`src/lib/page-layout/section-order.ts:118-125`). `10-HOMEPAGE.md` says every new band "must be added to the section registry so the section gates defend it" - there is no home entry to add it to. |
| **B7: cohesion** - one content width, one card system, one type scale, one terracotta, one font pair, one icon system | charter §7 | **none** | The cohesion audit measured **seven content widths** (1072/1024/996/976/848/720/672), **four card systems**, **three body scales** (16px / 12px / 14px), **three terracottas** (`#e62200`, `#fb8469`, `#c23a22`), **two font pairs** and **four icon systems**, all shipping. No gate reads any of these. `verify_typography_consistency` would be the natural home and its `data-typography="custom"` escape is exactly what the spine mastheads use. |
| **B22: good-versus-bad in ONE hue** | handoff §5.7 | **none directly** | `palette-membership` bans hues, but two legal hues used as a good/bad pair would pass. |
| **B14 on the pages that ship** | `verify_two_surface_levels.ts` | **partial, and pointed the wrong way** | The gate scans `src/styles/atlas-spine.css` (the flag-OFF spine-2 stylesheet) and the parent-repo mockup CSS. It never reads `globals.css` or any `.tsx`, so the **69 hand-rolled opaque cards** the cohesion audit counted outside the homepage are invisible to it. |
| **A9: never fabricate a figure** | handoff §9 | **partial** | `no-fixture-in-routes`, `no-slot-counting`, `shared-revenue`, `stated-totals` and `sample-tags` each cover one shape. Nothing covers the general case, and the seven country sections hardcoded to `null`/`sample` (cohesion audit §3) pass every one of them. |
| **The self-omission / completeness-inversion contradiction** | see Part 2 (a) | **none** | Neither rule is encoded. |

### Tier 2 - a gate exists but does not reach the surfaces the founder looks at

This is the largest and least visible gap. **Ten registered design gates scan
bodies that no reader can reach at today's flag configuration** (§1.2).

| Gate | Scans | Reader-facing? |
|---|---|---|
| `bar-budget` | `src/app/dev/spine/page.tsx`, `tsxIn(src/app/dev/spine-{city,cell,industry,hood})`, `spine/NeighborhoodExplorer.tsx`, `home/home2-view.tsx` | **no.** Those `dev/spine-*` directories hold **2 files each** (`page.tsx` + `layout.tsx`); the real bodies are 5, 5, 3 and 2 files under `src/components/spine/{cell,city,industry,hood}/` and the gates read files by PATH, not by import graph |
| `no-bold-display` | same list plus `NavigatorForm.tsx` | **no**, except `NavigatorForm` |
| `no-eyebrow` | same list | **no**, except `NavigatorForm` |
| `subsection-icons` | same list | **no**, except `NavigatorForm` |
| `banned-patterns` | same list | **no** |
| `sample-tags` | `src/components/spine/<type>` + `src/app/dev/spine-<type>` + `dev/spine/page.tsx` | **no** - reaches the real spine bodies, which are flag-OFF |
| `trade-set` | spine surface + `NavigatorForm.tsx` (exempt) | **no** |
| `v2-scales` | `spine2`, `city2`, `country2`, six `/dev` workbenches | **no** - `city2` and `country2` are imported only by `/dev` routes |
| `spacing-scale` | `city2`, `country2`, `spine2` | **no** |
| `paragraph-budget` | `spine2`, `city2`, `country2`, `src/app/world`, `src/app/industries`, four `/dev` workbenches | **partly** - only `/world` and `/industries` ship |
| `banned-vocabulary` | `src/components/spine2` + `src/lib/cells` | **partly** |

**The consequence, stated plainly.** The founder's 2026-07-11 rulebook (bar
rationing, no eyebrow, subsection icons, the trade set, sample tags, no bold
display) and his 2026-08-07 text budget are enforced almost entirely against the
workshop. `src/app/page.tsx`, `src/app/[country]/page.tsx`,
`src/app/(site)/cities/[slug]/page.tsx`, `src/app/(site)/industries/[industry]/page.tsx`,
`src/app/[country]/[geo]/page.tsx` and all of `src/components/kit/` are outside
every one of those scan lists. That is the mechanical reason a rule can be green
in the chain and visibly broken on the page.

### Tier 3 - a gate exists and is weaker than it reads

| Gate | Weakness | Evidence |
|---|---|---|
| `section-order` | Its extractor is `/<section[^>]*\sid="([a-z0-9-]+)"/g` - one line, literal id. **Measured on the four pages it checks:** country page yields **1** id (`hero`) against a 22-item canonical list; cell page **1** (`narrative`) against 7; industry page **1** (`hero`); region page **3** against 8. The country page carries 15 ids in the file, but 14 arrive through a wrapper as `id={id}` (`src/app/[country]/page.tsx:377`) or split across lines. A subsequence test over a 1-element list is vacuously true. | measured 2026-08-19 with the gate's own regex |
| `page-sections` | Pattern B is `src.includes('"<id>"')` on **unstripped source**. A section id mentioned in a comment satisfies it. Its `CANONICAL` country list has **6** ids while `COUNTRY_PAGE_SECTIONS` has **22**: two contracts of different length for one page type. Covers 7 page types; home, region, sub-cell, opening, buy-or-start and every index and tertiary page are outside it. | `scripts/verify_page_sections.ts:27-42, 95-100` |
| `registry` | Passes with a note when `E:/atlas/design/registry/` is missing. That directory is in the parent repo, which Vercel never clones, so on a build server this gate is an unconditional pass. | `scripts/verify_registry.ts:17-20` |
| `two-surface-levels` | Same shape: the mockup source is "checked when present and skipped with a loud message when not". Only the generated `atlas-spine.css` is always checked. | `scripts/verify_two_surface_levels.ts:25-29` |
| `main-landmark` | Absence only. The duplicate/nested-`<main>` rule was deliberately removed after one false positive, and the cohesion audit found **four** spine views nesting `<main>` inside `SiteChrome`'s. | `scripts/verify_main_landmark.mjs:17-28`; cohesion audit §2 item 6 |
| `palette-membership` | Returns legal above 93% lightness by design, so no paper-tone defect is visible to it. The amber and moss wash gradients in `globals.css:637-655` sit below that threshold and, per the cohesion audit §4, were never checked against it. | charter §11; cohesion audit §4 |
| `comparative-voice` | Registered as a soft, warn-only gate. A warn-only gate in a 102-gate chain is a line of output. | `scripts/verify_comparative_voice.ts` header |
| **`route-chrome-contract`** | **NEW FINDING, 2026-08-19.** Its check is `src.includes("SiteChrome") \|\| src.includes("SpineShell")` on **unstripped source** (`tests/app/route_chrome_contract.test.ts:61`). `src/app/world/page.tsx` and `src/app/industries/page.tsx` render **neither** - `grep -c SpineShell` returns 0 for both, and every occurrence of the string `SiteChrome` in each file is inside a header comment (`world:9,13,184`; `industries:9,14,77`). Both are shipping routes, neither is on the `EXEMPT` list, and the gate reports `PASS ... every shipping route has chrome or is exempt by name`. This is the exact failure the gate was written for - "the home page shipped with no masthead and nobody noticed for weeks" - passing on two routes because they discuss the thing they do not render. | measured 2026-08-19 |
| **12 gates roll their own comment detection** | `verify_no_em_dashes`, `verify_no_source_agencies`, `find_dead_links`, `verify_v34_research_rules`, `verify_comparative_voice`, `verify_bar_budget`, `verify_no_bold_display`, `verify_banned_patterns`, `verify_no_eyebrow`, `verify_subsection_icons`, `verify_v2_scales`, `verify_geo_link_construction` do not import `scripts/lib/strip_comments`. 15 files do. CLAUDE.md's own corollary says to use the shared one; `verify_no_bold_display.ts:50-58` is a textbook `trimmed.startsWith("//")`. | measured 2026-08-19 |

### Tier 4 - the chain may not run at all

`Q3` is unanswered and it subsumes everything above. There is no `vercel.json`
(`ls vercel.json` returns not-found), so the build command is a dashboard
setting. The gates hang off npm's `prebuild` lifecycle hook, which fires only
when the build is invoked as `npm run build`. If Vercel is configured to run
`next build` directly, **all 102 gates are skipped on every deploy while passing
locally** - the cost of maintaining them and none of the protection. `CLAUDE.md`
records the one-line fix and leaves it to the founder because it is a deploy
decision. `prebuild_all` itself is verified correct: it exits 1 when any gate
fails, including under `--no-bail`.

## 3.4 The gap list, ranked

If only five things were fixed, these are the five, ordered by how much ratified
rule they would put under machine control:

1. **Repoint the ten design gates at the bodies that ship.** One edit per gate's
   scan list, from `src/app/dev/spine-*` to `src/app/page.tsx`,
   `src/app/[country]/page.tsx`, `src/app/(site)/cities/[slug]/page.tsx`,
   `src/app/(site)/industries/[industry]/page.tsx`, `src/app/[country]/[geo]/page.tsx`
   and `src/components/kit/`. Expect a large first count; ratchet it rather than
   fixing it in the same change, per A5.
2. **Fix `section-order`'s extractor** so it sees multi-line tags and
   `id={CONST}` forms, and reconcile `page-sections`' 6-item country contract
   with `section-order`'s 22-item one. Until then "never drop an agreed section"
   is unenforced on the country, cell and industry pages.
3. **Add the missing baseline refusals** to `hardcoded-hex`,
   `geo-link-construction` and `take-home-identity`, copying
   `verify_paragraph_budget.mjs:192-207`.
4. **Add a homepage entry to the section registry** so the band list is defended
   at all, and put `src/app/page.tsx` inside `paragraph-budget`'s roots so B4 and
   B18 become checkable on the page the founder judges.
5. **Answer Q3** and commit `vercel.json`, or accept in writing that the chain is
   a local-only instrument.

**And one cheap fix that is smaller than all five and finds real defects today:**
put `scripts/lib/strip_comments` into the 12 gates that roll their own, starting
with `tests/app/route_chrome_contract.test.ts`. That single import turns a
passing line into two named offenders (`/world`, `/industries`) on a rule the
founder's own eye caught last time. The repo's working method already says to do
this; CLAUDE.md's corollary names the library by path.

Two things that are NOT worth gating, stated so they are not proposed again:
**B1 (the background) and B7 (cohesion) are judgement**, and the corpus already
records that the instrument for both is a rendered screenshot read by a human
(charter §9.1, cohesion audit §0 and §4). What CAN be gated out of them is
narrow and mechanical: content width against `max-w-content`, card class
membership, terracotta token count, font-pair count.
