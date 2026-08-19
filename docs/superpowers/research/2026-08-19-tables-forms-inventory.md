# The tables, forms and stat-surfaces inventory, 2026-08-19

Every table, every form and input, and every dashboard-like stat surface in
`E:\atlas\website`, with what it shows, how it is structured, and which live
routes render it.

The subject matter is financial: revenue, costs, margin, tax, owner take-home,
rent, wages, break-even, startup cost. Tables, dashboards and forms are the three
places where the presentation rules change most in a financial context, which is
why they are inventoried separately here. **This file passes no judgement on
fitness.** It answers only the prior question: what is there, what shape is it in,
and where does it render. The review that asks "is this the best way to present
this" is built on top of it.

Companion files in this directory:

- `2026-08-19-graphics-inventory.md` — the same treatment for charts, bars,
  gauges, maps and bespoke SVG. Its method section (route tracing, the two
  traps) is the method used here; that method was independently re-implemented
  for this file and reproduces its component counts exactly (see §0).
- `2026-08-19-graphics-rendered-observations.md` — written from the rendered page
  rather than from source. Where this file says "static reading cannot tell",
  that file is the one that can.

---

## 0. Method, and how to re-derive every route claim

### The render graph

Import reachability is the wrong tool in this repo, in **both** directions.
`src/app/layout.tsx` imports `@/components/kit`, whose `index.ts` re-exports the
whole family, so plain reachability makes every kit table look site-wide. And
name-grep finds same-name local components that were never imported.

So route attribution here uses a **render graph**: an edge `A -> B` exists only
when file `A` imports a binding, that binding resolves through barrel
re-exports to the file `B` that *defines* it, **and** `A` mounts it as JSX
(`<B ...>`). A locally-defined component of the same name produces no edge.
Reachability is then computed from the App Router entrypoints, and any route
under `src/app/dev/` or `src/app/_design/` is excluded from "LIVE".

Re-derivable check: over `src/components/**`, the graph yields

```
components: 343 | LIVE 226 | DEV/DESIGN-ONLY 52 | NO CALL SITE 65
```

which matches the companion graphics inventory's independently produced
`LIVE 226 | NO-CALL-SITE 65 | DESIGN-ONLY 31 | DEV-ONLY 21` (31 + 21 = 52).
Two implementations agreeing is the reason the route columns below can be
trusted.

**One known blind spot in the graph, patched by hand.** The graph parses static
`import` statements only, so `next/dynamic` call sites are invisible to it. There
is exactly one in live code, and it is corrected manually below:

```bash
cd /e/atlas/website && grep -rn "dynamic(" src/app src/components --include=*.tsx | grep -v "^src/app/dev"
# src/app/[country]/[geo]/[industry]/page.tsx:56  ->  @/components/CorrectionForm
```

### The 51 live page routes

```bash
cd /e/atlas/website && find src/app -name "page.tsx" | grep -v "/dev/" | grep -v "_design" \
  | sed 's|src/app||; s|/page.tsx||; s|/(site)||; s|^$|/|' | sort
```

`/`, `/[country]`, `/[country]/industries`, `/[country]/[geo]`,
`/[country]/[geo]/industries`, `/[country]/[geo]/[industry]`,
`/[country]/[geo]/[industry]/[sub]`, `/[country]/[geo]/[industry]/opening`,
`/[country]/[geo]/[industry]/buy-or-start`, `/about-data`, `/account`,
`/admin/anomalies`, `/admin/data-quality`, `/admin/review`, `/blog`,
`/blog/[slug]`, `/browse`, `/calculator`, `/check`, `/cities`, `/cities/[slug]`,
`/cities/[slug]/neighborhoods`, `/compare`, `/compare/cities/[pair]`,
`/contact`, `/cookies`, `/countries`, `/coverage`, `/coverage/[iso2]`,
`/decide`, `/decide/[activity]/[city]`, `/download/2026-benchmarks`,
`/embed/[country]/[geo]/[industry]`, `/extremes`, `/faq`, `/industries`,
`/industries/[industry]`, `/industries/[industry]/across`, `/learn`,
`/learn/[slug]`, `/margin-index`, `/methodology`, `/methodology/key-benchmarks`,
`/pricing`, `/privacy`, `/saved`, `/signin`, `/status`, `/terms`, `/tools`,
`/world`, `/you`.

Three of those are **not public**. `/admin/review`, `/admin/data-quality` and
`/admin/anomalies` each `notFound()` unless `?key=` matches `process.env.ADMIN_KEY`
under a timing-safe compare. They hold the largest tables in the repo and are
inventoried in §1.4 separately, because they are operator tooling and should not
be judged by product design rules.

---

## 1. The second axis: eight runtime gates

"LIVE" is necessary but not sufficient. Eight live surfaces branch at runtime on
a flag, and the two branches render **different tables, different forms and
different stat surfaces on the same URL**.

```bash
cd /e/atlas/website && grep -n "^export function is" src/lib/feature_flags.ts
cd /e/atlas/website && grep -rn "isSpineReformEnabledFor\|isHomeReformEnabled\|isGatingEnabled\|isMarginIndexEnabled\|isAuthEnabled\|isWarmFrameEnabled\|isAccountPreviewEnabled" src/app src/components --include=*.tsx | grep -v "/dev/"
```

| Gate | Env var | Default | What it switches |
| --- | --- | --- | --- |
| `isHomeReformEnabled` | `NEXT_PUBLIC_HOME_REFORM` | OFF | `/` renders `components/home/home2-view.tsx` instead of the legacy homepage body |
| `isSpineReformEnabledFor("cell")` | `NEXT_PUBLIC_SPINE_REFORM_CELL`, else master | OFF | `/[country]/[geo]/[industry]` renders Spine 2 `CellPage` (when a reconciled cell file exists) or spine v1, instead of the legacy cell body |
| `isSpineReformEnabledFor("city")` | `..._CITY`, else master | OFF | `/cities/[slug]` renders `spine/city/city-view.tsx` |
| `isSpineReformEnabledFor("hood")` | `..._HOOD`, else master | OFF | `/cities/[slug]/neighborhoods` renders `spine/hood/hood-view.tsx` (London only) |
| `isSpineReformEnabledFor("industry")` | `..._INDUSTRY`, else master | OFF | `/industries/[industry]` renders `spine/industry/industry-view.tsx` |
| `isSpineReformEnabledFor("country")` | `..._COUNTRY` only | OFF, master hard-blocked | `/[country]` renders `app/dev/spine/page.tsx` (a dev module imported into a live page) |
| `isSpineReformEnabledFor("region")` | `..._REGION` only | OFF, master hard-blocked | `/[country]/[geo]` renders the illustrative city body |
| `isMarginIndexEnabled` | `NEXT_PUBLIC_MARGIN_INDEX` | OFF, but **only enforced when the var is set** — an unset var leaves `/margin-index` reachable | `/margin-index` `notFound()`s |
| `isGatingEnabled` | (paywall) | — | swaps figures for `RedactedNumber` / `LockPill` on `/compare` |
| `isAuthEnabled` | (auth) | — | `/account`, `/signin`, `/pricing` checkout, header auth |

**What this repository cannot tell us.** With no environment set, every gate
resolves OFF. The per-page variables are absent from `.env.local`, there is no
`vercel.json`, and the live values live in Vercel project settings. **Whether
marginatlas.com today serves the legacy surface or the reformed one cannot be
determined by reading the code.** Every row below that sits behind a gate is
tagged `GATED`, with the gate named. Rows with no tag are unconditional.

---

## 2. Three censuses that apply across every surface

These are properties that either exist or do not, repo-wide. They are counted
once here rather than repeated in every row.

### 2.1 Tabular figures — the cheapest credibility property in a financial table

The house rule is written into `src/app/globals.css` at line 12:

> Tabular, lining figures on all data numerals (tables, stats, the calculator)
> so columns align and numbers do not jitter as they change. Apply
> `.tabular-figures` or `data-numeric="true"` to any scanned numeric run.

The two utilities that rule names are declared in `@layer utilities`, and then
used **zero times**:

```bash
cd /e/atlas/website && grep -rn "tabular-figures" src/app src/components --include=*.tsx | wc -l   # 0
cd /e/atlas/website && grep -rn 'data-numeric'    src/app src/components --include=*.tsx | wc -l   # 0
```

The house rule is therefore not enforced by the mechanism it documents. Tabular
figures on the live site arrive by **three unrelated mechanisms**, each covering a
different slice, with no single place that guarantees the property:

| Mechanism | Where it is defined | What it covers |
| --- | --- | --- |
| Tailwind `tabular-nums` applied by hand, per element | inline in components | **104 of the 340 live-reachable `.tsx` files** contain it at least once (138 across all of `src/`) |
| `.fig { font-variant-numeric: tabular-nums lining-nums }` in an **inline `<style>` tag inside `SpineShell`** | `src/components/spine/shell.tsx:66` | every `<Fig>` from the spine v1 kit, on any route wrapped in `SpineShell` |
| `.av2 .fig`, `.statblock .row .v`, `.eight .e .v`, `table.tb td` and six more | `src/styles/atlas-spine.css`; `.eng-*` rules in `src/app/globals.css` | Spine 2, plus `/world` and `/industries` which import `atlas-spine.css` directly, plus the engraved country blocks |

```bash
# mechanism 1 coverage, repo-wide
cd /e/atlas/website && grep -rl "tabular-nums" src --include=*.tsx | wc -l    # 138
# mechanism 2 and 3 definitions
cd /e/atlas/website && grep -n "font-variant-numeric" src/components/spine/shell.tsx src/styles/*.css src/app/globals.css
# the two live routes that import the spine stylesheet outside a gate
cd /e/atlas/website && grep -rn "atlas-spine" src/app --include=*.tsx | grep -v "/dev/"
```

Three consequences worth carrying into the review:

1. **`src/components/Money.tsx` carries none.** It is the client component every
   currency-switchable figure passes through, and its entire return is
   `<span suppressHydrationWarning>{formatMoney(usd, currency)}</span>`. It is
   mounted at 15 live call sites across `components/cells/CellDecisionStack.tsx`,
   `components/DistributionVisual.tsx`, `components/spine/cell/cell-view.tsx`,
   `components/spine/industry/industry-view.tsx`,
   `app/(site)/industries/[industry]/page.tsx` and `app/(site)/learn/[slug]/page.tsx`.
   Whatever figure treatment a caller wants, `Money` does not carry it, and it is
   the one component whose whole job is printing money that changes on toggle —
   the exact case tabular figures exist for.
2. **The property is a per-component accident, not a system property.** Which of
   the three mechanisms applies depends on which shell a route happens to sit in.
   The per-surface `tabular-nums` column in §3, §4 and §5 is where this is
   recorded case by case; there is no shortcut.
3. `src/styles/v0-tokens.css` (`.v0-fig`) is imported by `src/app/dev/*` only, so
   it contributes nothing live.

### 2.2 Sticky headers on long tables

**Vertically: none.** No `<thead>`, `<tr>` or `<th>` anywhere in the repo carries
`position: sticky` on the top axis. Every table long enough to scroll past its
own header loses the header, and the reader is left with bare numbers in unnamed
columns.

```bash
cd /e/atlas/website && grep -rn "sticky top-" src/app src/components --include=*.tsx | grep -iE "thead|<th|table"
# (no output)
```

`src/components/kit/StickySectionNav.tsx` is a page-level section rail, not a
table header, and does not change this.

**Horizontally: exactly one table.** `/industries/[industry]/across` pins its
metric column so the row labels survive a sideways scroll:

```bash
cd /e/atlas/website && grep -rn "sticky left-0" src/app src/components --include=*.tsx | grep -v "/dev/"
# 5 hits, all in src/app/(site)/industries/[industry]/across/page.tsx
```

That is the only table on the site where a reader scrolling a wide comparison can
still see what the row is. Every other wide table loses its row label on the same
gesture.

### 2.3 Header semantics (`<th scope>`)

```bash
cd /e/atlas/website && grep -rn 'scope="col"\|scope="row"' src/app src/components --include=*.tsx | grep -v "/dev/" | awk -F: '{print $1}' | sort | uniq -c | sort -rn
cd /e/atlas/website && for f in $(grep -rl "<table" src/app src/components --include=*.tsx | grep -v "/dev/"); do grep -q 'scope=' "$f" || echo "$f"; done
```

`scope` appears in six files. Four are the `kit/tables` family
(`OwnerKeepTable` 6, `AtlasTable` 3, and the two that render nowhere,
`WeightedCompare` 5 and `RangeTable` 4); the other two are single uses in
`home/UpgradeTeaser.tsx` and `(site)/pricing/page.tsx`.

**Thirteen files contain a `<table>` and no `scope` at all**, including every
hand-rolled page table: `/compare`, `/decide/[activity]/[city]`,
`/industries/[industry]/across`, `cities/BusinessFormationCosts.tsx`,
`kit/engraved/Compare.tsx`, `sections/AnnualCostStack.tsx`, the three spine2
tables, and all three admin pages. In the `across` table the metric column is a
`<td>` rather than a `<th scope="row">`, so the one table with a pinned row-label
column does not announce that column as a header.

The split is clean and worth noting for the review: the **kit primitives get
table semantics right and are barely used**; the **tables people actually built
into pages get them wrong**.

### 2.4 Sorting

Interactive column sorting exists in exactly three components, and `aria-sort`
appears three times repo-wide:

```bash
cd /e/atlas/website && grep -rn "aria-sort" src --include=*.tsx | wc -l    # 3
```

| Component | Mechanism | Where it renders |
| --- | --- | --- |
| `src/components/spine/kit-index.tsx` (`SortHeader`, `ControlRail`) | click-to-sort header + a sort-key button rail, `aria-sort`, `aria-pressed` | `/margin-index` (via `margin-index-controls.tsx`), and the gated spine index surfaces |
| `src/components/spine/cell/interactive.tsx` | `setSortKey` buttons with `aria-sort` | `/[country]/[geo]/[industry]` — **GATED** on `cell` |
| `src/components/spine/atlas-index.tsx` | full `SortState` with URL sync | **dev-only** (`/dev/index-*`) |

Everywhere else, row order is fixed server-side (`.sort()` in the page or
adapter) and the reader cannot change it.

### 2.5 Focus visibility

```bash
cd /e/atlas/website && grep -rn "focus-visible:" src/components src/app --include=*.tsx | grep -v "/dev/" | wc -l   # 50
cd /e/atlas/website && grep -rn "outline-none" src/components src/app --include=*.tsx | grep -v "/dev/" | grep -v "focus-visible" | wc -l   # 15
```

Of the 15 `outline-none` uses without a `focus-visible` on the same line, most
pair with a `focus:ring-*` on the same class string and are fine. The ones that
strip the outline and put **nothing** back are: `ComboField.tsx:221` (the inner
input; the shell around it may carry the ring — INFERRED, needs a rendered
check), `GlobalSearch.tsx:288`, `spine/kit-index.tsx:422`, and
`signin/SignInForm.tsx:97` (border-colour change only, no ring).

---

## 3. PART 1 — TABLES

_(filled below)_

---

## 4. PART 2 — FORMS AND INPUTS

38 controls. "Decisions" counts the choices a reader must make before **any**
number or result appears; a control that pre-fills a working default scores 0.

### 4.1 Site chrome — mounted on every route

`src/components/SiteChrome.tsx` and `src/app/layout.tsx` are the mount points;
each was confirmed by reading the JSX, not by reachability.

| # | Control | Path | Controls / returns | Type, and does it fit | Labels | Validation / error / empty / loading | Keyboard + focus | Decisions | Live routes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `GlobalSearch` (via `HeaderSearch`) | `src/components/GlobalSearch.tsx` | site search over industries + countries; returns `router.push` to `/industries/{slug}` or `/{iso2}` | text input opening a modal listbox — correct for 200+ options | `aria-label` only, no visible label | no validation (nothing to reject); empty-query suggestion chips; no-match copy; no loading (sync filter) | full `role="combobox"` + `aria-activedescendant`, Ctrl/Cmd+K, arrows, Enter, Esc. **`outline-none` with no replacement ring** — the caret is the only focus cue | 1 keystroke, then 1 select | all `(site)` + `[country]` routes. On `/` it is suppressed until the hero scrolls out (IntersectionObserver) |
| 2 | `MobileNav` | `src/components/MobileNav.tsx` | nav disclosure; returns nothing | button toggle — correct for a binary | `aria-label` swaps open/close | n/a | `aria-expanded`/`aria-controls`, Esc closes, `focus-visible:ring-2` throughout | 0 | all chrome routes |
| 3 | `HeaderAuth` | `src/components/HeaderAuth.tsx` | sign-in link | plain `<a>` | — | — | — | 0 | mount exists in `SiteChrome`, but `isAuthEnabled()` defaults false and the component `return null`s. **Renders nothing today** |
| 4 | `WatchTray` + `AddToWatch` | `src/components/kit/WatchTray.tsx` | a localStorage watch list (`atlas:watch:v1`) of cells/cities/trades; hands items to `/compare?q=` | floating pill → disclosed panel, per-row `aria-pressed` toggles | every icon-only button carries `aria-label` | self-hides at count 0; no loading (sync); no error | real buttons, `role="dialog"`, Esc closes, focus returns to the pill, `focus-visible:ring-2` throughout | 0 | tray on all chrome routes (`SiteChrome.tsx:274`); `AddToWatch` on `/[country]`, `/[country]/[geo]/[industry]`, `/[country]/[geo]/[industry]/[sub]`, `/cities/[slug]` |
| 5 | `FooterNewsletterBar` | `src/components/newsletter/NewsletterSignupVariants.tsx` | email capture; `POST /api/newsletter` | `type="email"` + submit — correct | `sr-only` `<label htmlFor>` present + visible placeholder | client regex; `aria-invalid` sets **a red border and no message text**; loading spinner; success copy | native input/button | 1 | all chrome routes (`SiteChrome.tsx:153`) |
| 6 | `PaywallModalRoot` | `src/components/monetization/PaywallModalRoot.tsx` | dialog with two tier CTAs, opened by a `window` event | modal, 2 link CTAs + close | `aria-labelledby` | open/closed only | Esc + backdrop close. `aria-modal` was **deliberately removed** because nothing traps focus — a documented, self-declared defect | 0 | `src/app/layout.tsx:200`; the event that opens it fires only under `isGatingEnabled()`, false today |

### 4.2 The homepage

| # | Control | Path | Controls / returns | Type, and does it fit | Labels | Validation / error / empty / loading | Keyboard + focus | Decisions | Live routes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 7 | `NavigatorForm` | `src/components/NavigatorForm.tsx` | country → city → business cascade; `router.push('/{country}/{geo}/{industry}')`, no-JS fallback `GET /api/go` → 302 | 3× `ComboField` (text + filtered listbox) — correct; a native select at 195 countries would not be usable | real visible `<label htmlFor>` per field, plus example placeholders | **a blocking browser `alert()`** when Business is empty (`NavigatorForm.tsx:131`) — not an inline error; spinner + `aria-busy` on submit | full ARIA combobox; focus shown via a container ring keyed to `open`, not `:focus-visible` | **0** — all three fields pre-fill a working example (restaurants, Los Angeles) | `/` (unconditional, not behind the home-reform gate) |
| 8 | `WorldMapPicker` (via `WorldMapClient`/`WorldMapSection`) | `src/components/WorldMapPicker.tsx` | click a country; `router.push('/{iso2}')` | SVG map + explicit zoom buttons, degrading to a 30-market button grid on fetch failure | `role="application"` with an instruction `aria-label`; zoom buttons labelled | `loaded`/`errored` states drive a skeleton or the fallback grid | hand-rolled roving focus: arrows step alphabetically, Enter/Space select. Path `outline: none`, but `onFocus` reuses the hover fill, so keyboard focus is visible as a colour change, not a ring | 1 | `/` |
| 9 | `HomeNewsletter` → `LeadMagnetForm` | `src/components/newsletter/LeadMagnetForm.tsx` | email; `POST /api/newsletter` | same as #5 | `sr-only` label + placeholder | same as #5 | native | 1 | `/`, `/download/2026-benchmarks` |
| 10 | `Home2View` internals | `src/components/home/home2-view.tsx` | a second copy of `NavigatorForm` + `WorldMapClient`, plus `RankBars` link lists | no new control types | — | — | — | — | `/` — **GATED** on `isHomeReformEnabled`, default off |

### 4.3 The decision tools

| # | Control | Path | Controls / returns | Type, and does it fit | Labels | Validation / error / empty / loading | Keyboard + focus | Decisions | Live routes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 11 | `CheckForm` | `src/app/(site)/check/CheckForm.tsx` | industry + up to 5 dollar figures; returns a client-computed verdict (`computeVerdict`, no network) | text filter feeding a grouped native `<select>` (~150 industries with `<optgroup>`) + 5 `inputMode="numeric"` fields — a defensible compromise, stated in the file | search box has `<label htmlFor>`; the `<select>` itself has `aria-label` only; the 5 money fields use wrapped visible labels | `required` on industry + revenue, and **no error messaging at all**: revenue ≤ 0 leaves the verdict null with no explanation. No `aria-invalid`, no `role="alert"` | native controls, browser default focus ring intact | **2 required** (industry, revenue); 4 optional refine | `/check` |
| 12 | `CompareClient` pickers | `src/app/(site)/compare/CompareClient.tsx` | 3 slots × (country `ComboField` + region `<select>` + industry `ComboField`); `fetch('/api/cell-lookup')` per slot; state round-trips through `?q=` | combobox for the long lists, native select for the short bounded region enum — both correct | visible `<label htmlFor>` on all nine fields | per-slot `loading` renders as a `th` text cell with no spinner; **no error state distinct from "no data"** — both render an empty column | native + combobox | **0** — `DEFAULT_SLOTS` (US restaurants, CA/TX/NY) render server-side | `/compare` |
| 13 | Weighting sliders (`WeightingPanel` on `kit/controls/Slider`) | `src/app/(site)/compare/CompareClient.tsx`, `src/components/kit/controls/Slider.tsx` | 5 weights 0–100 step 5 + a lock per metric; live client re-rank (`scoreByWeights`); all weights in the URL | `type="range"` **paired with a `type="number"`** sharing one value — the right pattern for a continuous weight | `<label htmlFor>` + `<output htmlFor>` per slider | clamped, cannot go out of range; no loading/error (pure client math) | native range (arrows work), `aria-valuetext` carries the formatted value, lock buttons are `aria-pressed`, `focus-visible:ring-2` on both inputs | 1 click to disclose, then 0 required | `/compare` |
| 14 | `DecideWizard` | `src/app/(site)/decide/DecideWizard.tsx` | trade, then place; URL state + a client-derived headline + a link to `/decide/{trade}/{place}` | curated `Segmented` chips **paired with** a full native `<select>` for the long tail — the strongest control-fit decision on the site | `<legend>` per `<fieldset>`, `ariaLabel` on the group, visible label on the fallback select | nothing to reject | `Segmented` is the only complete WAI-ARIA radiogroup here: `role="radiogroup"`, `aria-checked`, single roving tabstop, Left/Right/Up/Down/Home/End, `focus-visible:ring-2` | **2 required** before the headline discloses; a 3rd click to reach the deep page | `/decide` |
| 15 | `DecideActivitySelector` | `src/components/DecideActivitySelector.tsx` | swap activity, same city; `router.push` | native `<select>`, ~150 activities — acceptable | wrapped visible label | `pending` disables the select and shows "Loading…" | native | 1 | `/decide/[activity]/[city]` (no spine branch on this route) |
| 16 | `CalculatorForm` | `src/components/CalculatorForm.tsx` | country / region / industry / size / revenue; `fetch('/api/cell-lookup')` for the percentile spread + a fully client `computeBreakeven()` | 4 native `<select>` (country grouped by "With benchmarks" / "No benchmarks yet") + 1 numeric text field — all correct, none long enough to need a combobox | wrapped visible labels on every field, consistently | **the most complete validation on the site**: `role="alert"` messages for zero revenue, missing industry, missing region, and "no cell found"; submit disabled until region + revenue; loading label swap | native throughout | **2 required** (region, revenue); country, industry, size pre-fill | `/calculator` |
| 17 | `CompareToMeClient` | `src/app/(site)/you/CompareToMeClient.tsx` | activity `ComboField` + region `<select>` (15 US states) + your-revenue text; `fetch('/api/cell-lookup')` → a percentile comparison computed in-browser | correct types throughout | explicit `htmlFor`/`id` on all three, added as a documented a11y fix | **no validation on revenue** — non-numeric silently parses to 0; loading text; empty-state copy; **a failed fetch collapses into the same empty-state text as "nothing picked yet"** | native + combobox | **0** for the baseline (defaults to restaurants / California and auto-fetches); 1 to see your own marker | `/you` |

### 4.4 Page-level filters and pivots

| # | Control | Path | Controls / returns | Type, and does it fit | Labels | Validation / error / empty / loading | Keyboard + focus | Decisions | Live routes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 18 | `MarginIndexControls` → `ControlRail` | `src/app/(site)/margin-index/margin-index-controls.tsx`, `src/components/spine/kit-index.tsx:410` | free-text query + a 2-way direction `Segmented`; both write to the URL via `useUrlStateMap` | segmented for a true binary — correct, avoids the dropdown-for-a-binary mismatch | **PLACEHOLDER-ONLY.** The wrapping `<label>` at `kit-index.tsx:420` contains a decorative search icon and the input, and no text. The only name is a placeholder that itself changes with the direction toggle | none — but see the note below | `Segmented` full radiogroup; the input has `outline-none` with no replacement ring | 0 | `/margin-index` |
| 19 | `LensFilter` | `src/components/extremes/LensFilter.tsx` | which leaderboard lens shows; pure client `hidden` toggling — every lens is already in the DOM | chip row, `role="group"`, real `<button aria-pressed>` — correct for 4–6 exclusive states | `aria-label` on the group | self-hides below 2 lenses, so no dead filter row | roving `tabIndex` + ArrowLeft/Right with wraparound, hand-rolled and correct | 0 (defaults to All) | `/extremes` |
| 20 | `CitySearchBox` | `src/components/cities/CitySearchBox.tsx` | filter 250+ cities by name; `router.push('/cities/{slug}')` | combobox — correct | `sr-only` `<label htmlFor>` + a separate visible placeholder | no-match copy present | full combobox wiring; uses `:focus` not `:focus-visible` (looser, still visible) | 1 | `/cities` |
| 21 | `CitiesWorldMap` | `src/components/cities/CitiesWorldMap.tsx` | covered cities as clickable dots at real lat/lon + zoom buttons | SVG map of real `<a>` links — correct, and Tab-reachable by construction | per-marker `aria-label`, labelled zoom buttons | `interacted` hides the hint; no loading/error (server data) | real anchors, `onFocus` drives the same tooltip. No arrow-key stepping, reasonable at 250 dots | 1 | `/cities` |
| 22 | `CityDistrictPicker` | `src/components/cities/CityDistrictPicker.tsx` | which district's figures show; client state only, all districts pre-computed server-side | `role="tablist"` of `role="tab"` chips | `aria-label` on the tablist | returns null with no districts | **role/keyboard mismatch**: declares the ARIA tabs roles but implements none of the tabs keyboard pattern — no arrow keys, no roving `tabIndex`, so every district is its own Tab stop | 0 (first pre-selected) | `/cities/[slug]` |
| 23 | `DimensionSwitcher` | `src/components/DimensionSwitcher.tsx` | industry / type / region / size band; three `router.push` to a new cell URL, size appends `?size=` to the same cell | 4 native `<select>` over short bounded enums — correct | **inconsistent**: industry + region use `sr-only` span + `aria-label`; type + size have visible labels | `useTransition` `pending` disables all four and shows "Loading…" | native | 0 required; any change is 1 | `/[country]/[geo]/[industry]`, `/[country]/[geo]/[industry]/[sub]` |
| 24 | `CurrencySwitcher` | `src/components/CurrencySwitcher.tsx` | display currency for money on the page, persisted to localStorage; fires `atlas:currency-change`, which `Money` listens for and reformats **in place** | 6 plain `<button>`s — right shape, wrong primitive | the visible currency code is the label; `title` gives the full name | n/a | fully operable, but **no `role="radiogroup"`, no `aria-pressed`, no roving tabstop** — 6 separate Tab stops, inconsistent with the `Segmented` primitive used for the identical shape elsewhere | 1 | `/[country]/[geo]/[industry]` |
| 25 | `ZoomControl`, `StickySectionNav` | `src/components/kit/ZoomControl.tsx`, `src/components/kit/StickySectionNav.tsx` | altitude ladder / in-page jump list — **navigation dressed as a control row**, not client state | real `<a>` elements, correctly not buttons | `nav aria-label` on both | n/a | native anchors, `focus-visible:ring-2` | 0 | ZoomControl: `/cities/[slug]`, `/decide/[activity]/[city]`, `/[country]/[geo]/[industry]`, `/[country]/[geo]/[industry]/[sub]`. StickySectionNav: those plus `/compare`, `/industries/[industry]`, `/[country]` |
| 26 | `ActivityPlacePicker` | `src/components/industries/ActivityPlacePicker.tsx` | country + city; `router.push('/{country}/{city}/{activity}')` | 2× `ComboField` — correct | real visible labels | `required`; Go disabled until both set; city disables with "No covered city" when a country has none; spinner + `aria-busy` | combobox | **1 required** (country pre-fills US, city does not) | `/industries/[industry]` |

### 4.5 The in-page money models

| # | Control | Path | Controls / returns | Type, and does it fit | Labels | Validation / error / empty / loading | Keyboard + focus | Decisions | Live routes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 27 | `MakeItYoursPanel` → `MakeItYours` | `src/components/cells/MakeItYoursPanel.tsx`, `src/components/kit/MakeItYours.tsx` | rent / payroll / owner draw levers, only where the page holds real anchors; a pure client linear model (`canonical − rentDelta − staffDelta`); levers in the URL; the result feeds the "you" marker on `RangeStrip` | `type="range"` + paired number input — correct for continuous dollars | `<label htmlFor>` + `<output>` per lever | clamped; the assumptions are printed under the sliders so the model is not a black box | native range, `aria-valuetext` formatted as dollars | 1 click to disclose, then live on every drag, no Apply | `/[country]/[geo]/[industry]`, `/[country]/[geo]/[industry]/[sub]` — **ungated, live today** |
| 28 | `CorrectionForm` | `src/components/CorrectionForm.tsx`, mounted via `next/dynamic` at `src/app/[country]/[geo]/[industry]/page.tsx:56` | "this looks off?"; `POST /api/correction` | disclosure → textarea + email + submit | wrapped visible labels | client floor at 10 chars with inline error text; server repeats it; distinct idle/open/sending/done/error copy | native | 1 | `/[country]/[geo]/[industry]` |
| 29 | Contact form | `src/app/(site)/contact/page.tsx` | topic radios + optional page ref + message + optional email; a plain `<form action="/api/contact" method="post">` with **zero JavaScript**, 303 back to `/contact?sent=1` or `?error=<code>` | 2 radios for a binary + 3 text fields — correct | explicit `<label htmlFor>` on every field plus `aria-describedby` hints. The cleanest labelling in the repo | server-side only; `?error=short` and `?error=rate` render a `role="alert"` box in plain language | fully native | 1 (message ≥ 10 chars; topic pre-checked) | `/contact` |

### 4.6 Controls behind gates, and controls that render nowhere

| Control | Path | Status |
| --- | --- | --- |
| `FormatPicker` (3-tab segmented over restaurant formats, propagates through the money chapter by context) | `src/components/spine/cell/format-picker.tsx` | **GATED** `cell`, default off |
| `Nearby` (the only click-to-sort table on a content page) | `src/components/spine/cell/interactive.tsx` | **GATED** `cell`, default off |
| `Calc` (a *second*, different calculator: up to 6 config-driven sliders, `computeKeep`, `?c=vol:60,rent:70000` URL state, a live-resorting leverage list, and a self-omit that returns null — in dev, throws — if the config cannot reproduce the page's own published take-home) | `src/components/spine2/Calc.tsx` | **GATED** `cell`, default off |
| "Pay yourself" slider driving hero + chapter 3 + chapter 7 from one `CellStoreProvider` context | `src/components/spine2/page/store.tsx` | **GATED** `cell`, default off |
| `NeighborhoodExplorer` (rent-strip rows + map pins as two synced selectors), `NeighborhoodCompare` (pick up to 3, oldest drops on the 4th) | `src/components/spine/NeighborhoodExplorer.tsx` | **GATED** `hood`, default off |
| `SignInForm` (email magic link). Its email input is `aria-label`-only with a visible placeholder — **the placeholder-only pattern** | `src/app/(site)/signin/SignInForm.tsx` | route exists, but `isAuthEnabled()` false ⇒ renders a static "Coming soon". Effectively not rendered |
| `AccountPreview` (6-tab `role="tablist"`, `role="switch"` notification toggles, a settings sub-form) — built to a good standard | `src/app/(site)/account/AccountPreview.tsx` | `isAccountPreviewEnabled()` false ⇒ static "Coming soon" |
| `CheckoutButton` | `src/components/monetization/CheckoutButton.tsx` | only mounted when `isAuthEnabled() && STRIPE_SECRET_KEY`; both false ⇒ not in the DOM, `/pricing` shows a newsletter CTA instead |
| `ProfileChip` (a complete masthead "your context" popover: home country, budget, venue, premises, currency) | `src/components/kit/ProfileChip.tsx` | **NO CALL SITE.** The only `<ProfileChip` in `src/` is inside its own doc comment. A name-grep trap |
| `SubTypeSwitcher`, `VenueSwitcher` | `src/components/kit/` | **NO CALL SITE** |
| `WeightedCompare` | `src/components/kit/tables/WeightedCompare.tsx` | **NO CALL SITE** (barrel re-export only) |
| `InlineMidArticle`, `ExitIntentModal` | `src/components/newsletter/NewsletterSignupVariants.tsx` | **NO CALL SITE.** A comment in the cell page records that `InlineMidArticle` was live once and pulled |
| `AtlasIndex` (a complete browse shell: search + sort + facets + pager + compare tray + per-row multi-select) | `src/components/spine/atlas-index.tsx` | **dev routes only** (`/dev/index-*`) — no flag makes it live |

`/coverage` (`components/v2/CoverageHubV2.tsx`) has zero interactive controls;
`/browse` is a `permanentRedirect("/world")` and never renders a body.

### 4.7 What each form actually returns, at the API boundary

This is the part of Part 2 with product consequences beyond design.

| Route | Consumers | Behaviour |
| --- | --- | --- |
| `POST /api/contact` | contact form | inserts into Supabase `contact_messages`, **which exists**; 303 or `{ok}`; never echoes input |
| `POST /api/newsletter` | `FooterNewsletterBar`, `LeadMagnetForm`/`HomeNewsletter` | validates, rate-limits, inserts into `newsletter_signups` — **the table does not exist**. Returns `{ok:true}` unconditionally (by design, so it cannot leak whether an address is already subscribed), so **every signup today is dropped while the reader is shown success** |
| `POST /api/correction` | `CorrectionForm` on cell pages | inserts into `corrections` — **the table does not exist**. `route.ts:82` reads `if (!r.ok && r.status !== 404)` before logging, so a 404 is the one failure it does not even log |
| `GET /api/cell-take-home` | gated take-home reveal | returns `{value:null}` unless `isGatingEnabled() && isAuthEnabled()` and the session is a paid tier — all false today |
| `GET /decide/go`, `GET /api/go` | the no-JS fallbacks for `DecideWizard` and `NavigatorForm` | 302 after slug validation, else back to `/decide` / `/random` |

The two missing tables are the repository's own finding, not this inventory's:
`CLAUDE.md` lines 156-177 list `newsletter_signups` and `corrections` as
**MISSING**, `contact_messages` as applied, and name
`db/migrations/2026-08-16-corrections.sql` as never written.

---

## 5. PART 3 — STAT SURFACES

_(filled below)_

---

## 6. What this inventory cannot distinguish

This file is written from source. Six classes of question it cannot answer, and
what would answer them.

1. **Whether a well-formed table actually receives rows at runtime.** A table can
   have correct `<th scope>`, right-aligned tabular figures, units in the header
   and a stacked mobile reflow, and still render as a wall of dashes, or not
   render at all, because the accessor returned nothing for that country. Several
   components in §3 self-omit (`return null`) below a held-data threshold —
   `ComparisonTable` drops out under 50% held cells, `OwnerKeepTable` when nothing
   is held, `Calc` when its config cannot reproduce the page's own figure. Static
   reading tells you the guard exists; it cannot tell you how often it fires. The
   companion `2026-08-19-graphics-rendered-observations.md` is the file written
   from rendered pages.
2. **Which branch of a gate production actually serves.** §1 lists eight runtime
   gates. Their values live in Vercel project settings, not in this repository:
   `.env.local` carries none, `.env.example` has them commented out, and there is
   no `vercel.json`. Every `GATED` row below may be the live surface or may be
   invisible. One `curl` of a live URL settles it; nothing in `src/` does.
3. **States that only exist on interaction.** Hover washes, focus rings, the
   open state of every combobox listbox, validation messages that appear after a
   bad submit, the "sending"/"sent" copy on the four newsletter forms, the
   paywall modal — all are in the source, none were observed. Where a control is
   marked as having an error state, that means the code path exists, not that it
   was seen to fire.
4. **Whether a placeholder-only control is genuinely unlabelled to a screen
   reader.** `ControlRail`'s search input (§4.4 #18) has a wrapping `<label>` with
   no text; whether the browser then falls back to the placeholder for the
   accessible name is a rendering-engine behaviour, not a source fact. Marked as a
   defect pattern on the strength of the missing text, not on an axe run.
5. **Real overflow behaviour at 375px.** `overflow-x-auto` vs `overflow-hidden`
   vs a stacked reflow is read from class names and CSS. Whether a given table's
   content actually exceeds 375px depends on the data in its cells — a long city
   name or a nine-digit figure changes the answer. The one hard case found here
   (`/decide/[activity]/[city]`, a five-column table inside `overflow-hidden`)
   is a clipping *risk* established from source; a phone confirms it.
6. **Anything reached only through a dynamic import.** The render graph parses
   static `import` statements. There is exactly one `next/dynamic` call site in
   live code and it is patched by hand (§0), but a future one would be invisible
   to the same method.

One further limit worth stating plainly: **this file passes no judgement.** A
table recorded here as "real `<table>`, `<th scope>`, right-aligned,
`tabular-nums`, units in the header, stacked below `sm`" is *well-formed*, which
is not the same as *the right way to present that figure*. That question is the
review this inventory exists to feed.
