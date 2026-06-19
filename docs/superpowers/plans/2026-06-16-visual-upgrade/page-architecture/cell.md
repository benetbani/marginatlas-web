# Page architecture: Cell (activity-in-place, e.g. restaurants in London)

> SUPERSEDED ORDER. The approved section list + order is in `00-APPROVED-REFORM-2026-06-18.md` (built from the deep analysis in `analysis/`, founder-approved 2026-06-18; note: money split stays a DONUT per founder override, plus exit-valuation + confidence beats added). The per-section visual detail and honesty rules below remain valid reference; where the section SET or ORDER below conflicts with the approved-reform file, that file wins.

> Route: `/[country]/[geo]/[industry]` (canonical example `/gb/london/restaurants`). This is the **X-in-Y** page and the most complete page-type in the atlas. It is the only page that mounts the make-it-yours calculator, the full chart run, and the live take-home echo.
> Authority chain: this file extends `05-cell.md` (locked section order) and `01-component-and-chart-system.md` (token map + block/chart grammar). Where the founder's 40 ratified decisions differ from `01`/`05`, the decisions win — the only material override on this page is **the money split is a DONUT/PIE** (founder override of the prior "never a pie" rule), kept honest by emphasizing the owner-kept slice + a legend. Everything else (no em-dashes, no source-agency names, tokens only, one terracotta accent, moss = kept, amber = caution, cities-only-scored, no district-vs-city, no fabricated numbers) is unchanged and non-negotiable.
> The current `E:/atlas/cell-london-restaurants.html` is the live mockup; this file is its spec. Where the mockup currently renders a waterfall for the money split, that section is to be REBUILT as a donut per the ratified decision (see "The signature graphics").

---

## Purpose & the one job

**The one job:** answer, for a person weighing *this exact trade in this exact place*, two questions in one breath: **what does a [trade] in [place] actually take in, and what would the owner keep?**

- The single focal point is the masthead: one oversized Newsreader **typical-revenue-a-year** number, sitting on a **distribution curve** (the ratified upgrade from a bare spread bar), with the **owner take-home** as its immediate one-beat echo.
- The single interactive affordance is the **make-it-yours calculator**, mounted directly under the hero, framed as "your scenario", with a live result line.
- Everything after the calculator is the *evidence*: where the money goes, what moves it, what the owner keeps, when you break even, what to watch, what it pays, what it costs to open, when the trade comes in, how the first year runs, the same trade nearby, voices, the world, and the hand-off.
- There is **no marketing CTA button competing with the hero number.** The CTA tone (one terracotta) lives only on the calculator result line and the final "compare two places" hand-off.

This page must read as the **almanac-dense, information-rich** surface the founder ratified: more sections, two-column interiors where they fit, each section in its own bordered card, never dense-to-unreadable, never sparse.

---

## The full section + subsection list (in visual order)

Legend for **data**: `real` = the real gated figure (shown only when `moneyShown = isLondon || isTrustedLocal`); `London-UK exemplar` = filled only on London (or a founder-sanctioned exemplar), self-omits elsewhere; `modeled` = shape honest, dollars derived from national pattern and flagged directional; `sample/placeholder` = never fabricated, routes to the collapse strip when unheld.
Legend for **hierarchy weight**: `hero` (owns first screen) / `primary` (full chart-card weight) / `secondary` (one visual, calm) / `quiet` (palate-cleanser / strip).

| # | Section | Subsection(s) | EXACT chosen visual (founder decision; shadcnblocks block where applicable) | Layout | Data | Hierarchy weight |
|---|---------|---------------|-----------------------------------------------------------------------------|--------|------|------------------|
| — | **Global: Full navbar** | logo + topic dropdown menus (Countries, Industries, Cities, Compare) + search + primary CTA | shadcnblocks `navbar1` (re-skinned; sticky, blur, mobile sheet built in) | site-wide chrome, sticky top | n/a | chrome |
| 0a | **Masthead** | breadcrumb; eyebrow (trade · place · country); plain-sentence headline; hero revenue number; take-home echo; **distribution curve**; three KPI stat tiles | bespoke masthead + `stats-card1` KPI row + **DISTRIBUTION CURVE** (visx-family density curve with TYPICAL marker, replacing the bare RangeStrip per ratified decision) | full-bleed tinted band; stacked (number left, caption right); tiles in a 3-col grid | real (gated `moneyShown`) | **hero** |
| 0b | **Make-it-yours calculator** | sliders (rent, staff, owner's draw); a switch (count owner's draw as cost); live result line | bespoke calc card (shadcn `card` + `input`/slider + `switch`); **sliders + live result** | own bordered card; single-column rows; **directly under the hero** | real (mounts only when real take-home + revenue held) | **primary** |
| 1 | **The honest take** | verdict line; three lever bullets; **break-in score**; modeled-figures note | `cta10` calm accent panel (buttons omitted) + `ScoreBand` break-in tick | bordered accent card; two-column on wide (verdict+bullets left, ScoreBand right), stacks on mobile | London-UK exemplar (verdict derived) | primary |
| 2 | **In context** | two-sentence narrative | quiet prose block, no chart, narrow measure (~62ch) | bordered card; single-column, narrow | modeled (live-derived from page figures) | **quiet** |
| 3 | **In plain terms** | three tangible-unit cards (covers/day, average spend, people on payroll) | `feature43` icon grid re-skinned as unit cards | bordered card; 3-col unit grid (stacks to 1-col) | modeled (gated `moneyShown`) | secondary |
| 4 | **Where the money goes** | per-$100 split; legend with kept slice emphasized | **DONUT / PIE** (founder override) + legend; owner-kept slice in moss, all cost lines in cocoa/ink neutrals | bordered card; **two-column** (donut left, legend + kept-callout right) | modeled (gated `moneyShown`) | **primary** |
| 5 | **What moves the cost** | ranked cost lines, largest first | ranked horizontal bars, single-series (`ComparisonBars`-family from the kit) | bordered card; stacked ranked rows; lighter than #4 (rides off it) | modeled (derived from the money split) | secondary |
| 6 | **What the owner keeps** | take-home dollar (repeated); kept-vs-gone bar | kept-vs-gone single bar (kept slice moss); take-home in tabular Newsreader | bordered card; stacked (big figure over the bar) | real (gated `moneyShown`) | primary |
| 7 | **Break-even** | one sentence; **threshold gauge** with break-even + typical-day ticks | **THRESHOLD GAUGE** (amber below / moss above; lone atlas break-even tick; quiet typical-day tick) | bordered card; stacked (sentence over gauge) | modeled (gated, floor ≥ 2/day) | **primary** |
| 8 | **What to watch (risks)** | severity rows: serious / watch / rare | **SEVERITY LADDER** (`SeverityGlyph` rows: glyph + title + one calm note) | bordered card; ladder rows (glyph / title / note grid) | London-UK exemplar | secondary |
| 9 | **Pay by role (wages)** | role rows with low–median–high; same-scale caveat | **FLOATING RANGE ROWS** per role, dot at median (new dumbbell primitive) | bordered card; range rows (role / track / value grid) | London-UK exemplar | secondary |
| 10 | **Cost to open (startup)** | total (Newsreader weight); stacked cost components | single horizontal stacked cost bar + legend (kit stacked / `chart-card1` stacked) | bordered card; stacked (total over bar over legend) | modeled | secondary |
| 11 | **Through the year (seasonality)** | 12-month curve; busiest / quietest labels | **GRADIENT AREA CHART** over 12 months (port shadcn `chart-area-gradient` shape, single atlas series, stripped axes) | bordered card; stacked (SVG area full-width + month axis) | London-UK exemplar | secondary |
| 12 | **Your first year** | four milestones; break-even node emphasized | **HORIZONTAL TIMELINE RIBBON** (`TimelineRibbon`; break-even node = lone vermillion dot) | bordered card; horizontal ribbon (4-col, 2-col on mobile) | London-UK exemplar | secondary |
| 13 | **The same business nearby** | like-for-like comparable places; honesty caveat rail | `LikeForLikeBars` (kit; honesty rail load-bearing) — subject in atlas, peers neutral | bordered card; ranked rows (place / bar / value) | real (suppressible) | secondary |
| 14 | **Operator voices** | static quote wall (London) or strip line | static quote wall (no avatars, no fake names) on London; else folds into collapse strip | bordered card; 3-col quote grid (stacks) | placeholder/exemplar | quiet |
| 15 | **Versus the world** | global-median peer tick when held; else strip line | `ScoreBand` vs global median (site-wide grammar) when held; else **collapse strip** | bordered card OR folded into strip | placeholder | quiet |
| — | **Collapse strip** | "still filling in" band listing unheld section names + one honest line | calm low-contrast strip (chips + one muted line) | full-width strip card; consecutive unheld sections fold into ONE strip | n/a | quiet |
| — | **One thing to remember** | closing line (reuses the honest-take verdict lever) | quiet Newsreader closing line, narrow measure | bordered/quiet card; single-column, narrow | modeled (reused) | quiet |
| 16 | **Related** | link tiles (other trades here; same trade elsewhere); one compare CTA | `cta10` / quiet gallery grid of link tiles + one terracotta "Compare two places" CTA | bordered card; 2-col tile grid + CTA | real | quiet |
| — | **Global: Rich footer** | logo + blurb; link columns (Explore, Product, Company); newsletter; legal line | shadcnblocks `footer7` (re-skinned, multi-column) | site-wide chrome, bottom; 4-col → 2-col → 1-col | n/a | chrome |

**Universal assets used on this page:** the consistent **icon set** (in-place at navbar menu, plain-terms unit cards, severity glyphs, related tiles), **section dividers** (the 1px `--cream-300` hairline between every `section.block`), and the **stylized world-map motif** (subtle, on the masthead band backdrop and/or the "versus the world" section only — see Shared assets). Each section sits in its **own bordered card** per the ratified global rule.

---

## Visual hierarchy & density

The page is **information-rich (almanac-like)**, not spacious. It stays readable through a deliberate rhythm of weight, not through emptiness.

**The weight ladder (top to bottom):**
1. **Hero (0a):** owns the first screen, carries the *most whitespace on the page*. One oversized Newsreader revenue number, the distribution curve beneath it, the take-home echo, three calm KPI tiles. This is the only place that breathes wide. The eye must land here first and nowhere else.
2. **Two primary anchors get full chart-card weight: money (#4, the donut) and break-even (#7, the gauge).** These two are the mid-page anchors with real charts and breathing room. Owner-keeps (#6) and the calculator (0b) are primary but visually quieter than these two.
3. **Secondary one-visual-each run (#3, #5, #8, #9, #10, #11, #12, #13):** a calm cadence of single-visual cards. **Never two charts fighting on one screen.** Each is its own bordered card with a clear eyebrow + Newsreader subhead + one visual.
4. **Quiet palate-cleansers (#2 narrative, the strip, the one-thing line, #14/#15/#16):** the lowest-contrast bands. Narrative (#2) is deliberately the *smallest, plainest* band — two sentences at ~62ch, `--ink-600`, generous lead. These sit between chart runs so the reader gets a beat of rest.

**Two-column vs stacked, decided per section (per the ratified "internal layout chosen per section" rule):**
- **Two-column:** honest-take (#1: verdict+bullets | ScoreBand), money (#4: donut | legend+kept callout), plain-terms (#3: a 3-up unit grid is its "columns"), related (#16: tile grid). The founder's "fix sparseness with BOTH two-column layouts AND more sections" directive is honored by pairing text with its visual wherever the section carries both.
- **Stacked:** masthead, calculator, narrative, cost-drivers, owner-keeps, break-even, risks, wages, startup, seasonality, first-year, nearby, voices, vs-world. These are either a single dominant visual (gauge, area, ribbon) or a vertical list (ranked bars, wage rows, risk ladder) where stacking reads cleaner than a forced column.

**Where it breathes:** the masthead (top), and a half-card of air above each primary anchor (#4, #7). Everywhere else the spacing is tight and almanac-dense — section padding `52px 0`, hairline dividers, no double-gap between cards.

**Density guardrails (so dense never becomes unreadable):**
- One hero number only, rounded to the nearest $1,000 — no false precision.
- Tabular lining figures on **every** number (`.num`).
- The take-home is **repeated** (hero echo, KPI tile, calculator result, owner-keeps) — never multiplied into new variants.
- Newsreader is reserved strictly for the page headline + the one hero number + section subheads + the closing line; Inter for all body and labels.
- Type steps ≥ 1.25; body measure 62–75ch.
- Charts run is broken up: only #4 and #7 get full chart weight; #5 rides off #4 as a lighter list; #2 and the strip are palate-cleansers.

**How sample / unheld sections appear (the collapse mechanism, per the founder's choice):**
Every section is always *present*, but unheld or placeholder sections do **not** each render an empty card. **Consecutive unheld sections fold into ONE calm "still filling in" strip** — a single low-contrast band that lists the section names as muted chips plus one honest line ("These fill in as we hold a local read for this place. We will not show a fabricated number."). On a thin (non-London) cell, that strip absorbs operator-voices, vs-world, and any London-exemplar section that does not fill (wages, seasonality, first-year, risks, plus nearby if suppressed). This is the single mechanism that stops a thin cell from reading as a wall of dashes while honoring "every section always present". The mockup must render the full filled London flow once (the ceiling) **and** one rendition of the collapse strip in the same document so the calm-placeholder behavior is visible.

---

## The signature graphics (exact spec)

For each non-trivial chart, the chosen type (per the ratified decisions), its block/chart mapping, the data shape, and the correctness notes (computed geometry + honesty rule applied). All colors are token vars; geometry must be arithmetically correct (no eyeballed widths).

### A. Hero distribution curve (Masthead 0a) — RATIFIED UPGRADE
- **Type:** a **distribution curve** (density curve), NOT just a spread bar. This is the founder's override of the bare RangeStrip: render a smooth distribution silhouette (a single atlas-tinted density area) with the **TYPICAL marker** as a vertical atlas tick, and quiet p10 / typical / p90 value labels beneath.
- **Maps to:** the visx `RangeStrip` family re-shaped into a density curve (hand-SVG area on the warm tokens). No shadcn block — this is the site signature, kept in the kit.
- **Data shape:** `{ p10, typical, p90, curve: number[] }` where `curve` is the normalized density samples across the p10→p90 domain (for London restaurants, a right-skewed silhouette peaking at typical). Hero number = `typical` rounded to nearest $1,000.
- **Computed geometry:** the TYPICAL marker's `left%` = `(typical − p10) / (p90 − p10) × 100`. For the London exemplar: `(503 − 252) / (905 − 252) = 38.44%` — the marker sits at **38.44%**, matching the current mockup's RangeStrip. The curve's peak x aligns to that same 38.44%. The area is closed to a baseline; line uses `vector-effect="non-scaling-stroke"`.
- **Honesty:** only renders when `moneyShown`. Number rounded to $1,000 (no false precision). One accent only (atlas for the curve + marker; neutrals elsewhere). The curve is a *distribution of comparable places*, not a fabricated probability — label it as the spread of like-for-like operators.

### B. Make-it-yours calculator (0b)
- **Type:** sliders + a switch + a live result line (the ratified "sliders + live result").
- **Maps to:** bespoke card (shadcn `card` + slider inputs + `switch`), not a block.
- **Data shape:** inputs `{ monthlyRent, staffCount, ownerWeeklyDraw, drawCountsAsCost: bool }`; output `estimatedTakeHome`. Resting (static-mockup) state: rent $9,000 (55%), staff 12 (48%), draw $1,000/wk (40%), switch ON, result **$48K**.
- **Computed geometry:** slider fill `width%` and thumb `left%` are equal and equal to the input's position on its own min→max domain. The result must be internally consistent with the masthead take-home at the resting inputs ($48K = $48K).
- **Honesty:** **mounts only when real take-home + revenue are held** — mounts silently when data absent (no empty shell). One terracotta tone on the result line only.

### C. Where-the-money-goes (#4) — DONUT / PIE (FOUNDER OVERRIDE)
- **Type:** a **DONUT (pie)** of the per-$100 split. This is the founder's explicit override of the earlier no-pie rule (recorded in `05-cell.md` / `01`). The current mockup renders a waterfall here; **rebuild it as a donut** for this page.
- **Maps to:** a shadcnblocks **chart** component (the purchased chart library, per "use shadcnblocks CHART components throughout") — the donut/pie chart variant — re-skinned to the token map (`--chart-1..5`). Pair with a **legend** (the ratified "+ a legend").
- **Data shape:** per-$100 segments `[{label:'Cost of goods', value:30}, {label:'Payroll', value:33}, {label:'Rent and premises', value:15}, {label:'Everything else', value:12}, {label:'Owner keeps', value:10}]`. Sum MUST equal 100.
- **Computed geometry:** each segment's arc sweep = `value / 100 × 360°`. The **owner-kept slice (10% → 36°)** is the emphasized slice: rendered in **moss (`--chart-2` / `--moss-600`)**, pulled/offset slightly or annotated with a direct "Owner keeps $10" callout in the donut's center or in a bold legend row. All cost slices in cocoa/ink neutrals (`--chart-3`, `--chart-4`, plus `--cocoa-300`, `--cream-400`). No second accent.
- **Honesty rule applied (load-bearing for this override):** the pie is allowed ONLY because the owner-kept slice is *unmistakably emphasized* (moss + center/legend callout) and a full legend names every slice with its $-value. Modeled gating (`moneyShown`) applies. The cross-geography caveat is not triggered here (single place), but the modeled-figures note from the honest-take still governs ("read as a starting point"). Direct labels, tabular figures, no gradient fills on the slices.

### D. Cost-drivers (#5)
- **Type:** ranked horizontal bars, single-series, largest first.
- **Maps to:** kit `ComparisonBars`-family (single-series). Reads as a *continuation* of #4, lighter, no competing chart shell.
- **Data shape:** the non-kept cost lines sorted desc: Payroll $33, Cost of goods $30, Rent and premises $15, Everything else $12.
- **Computed geometry:** each bar `width%` = `value / max × 100`, max = the largest line (Payroll $33). London: Payroll 100%, Cost of goods 90.9%, Rent 45.5%, Everything else 36.4%. Bars in `--cocoa-500` (cost mass), no accent.

### E. Owner-keeps (#6)
- **Type:** kept-vs-gone single bar (the take-home repeated in tabular Newsreader). Optional margin radial is **not** used here (the bar earns the moment; keep it calm).
- **Maps to:** kit single-bar / `ScoreBand` sibling.
- **Data shape:** kept 10% (moss), gone 90% (neutral). Take-home figure $48K.
- **Computed geometry:** kept-slice `width%` = net margin = 10%. Kept slice `--moss-600`, gone `--cream-200`.

### F. Break-even threshold gauge (#7) — RATIFIED
- **Type:** **THRESHOLD GAUGE** — amber below the line, moss above, a lone atlas tick at break-even, a quiet ink "typical day" tick to the right.
- **Maps to:** kit `ThresholdGauge` (no shadcn equivalent; honesty-encoding primitive).
- **Data shape:** `{ breakEven: 95, typical: 140, capacity: 180 }` covers/day.
- **Computed geometry:** track spans 0→capacity. Break-even tick `left%` = `95/180 = 52.78%` (amber fills 0→52.78%, moss fills 52.78%→100%). Typical-day tick `left%` = `140/180 = 77.78%`. Matches the current mockup exactly.
- **Honesty:** gated `moneyShown`; modeled with a floor of ≥ 2/day so a degenerate place never prints a nonsense break-even. Amber = caution, moss = above-the-line; atlas for the break-even tick only.

### G. Severity ladder (#8) — RATIFIED
- **Type:** **SEVERITY LADDER** — rows graded serious / watch / rare, each with a small three-bar glyph + title + one calm note.
- **Maps to:** kit `SeverityGlyph` rows.
- **Data shape:** ordered rows `[{sev:'serious', title:'Rent resets on renewal', note}, {sev:'watch', title:'Holding good staff', note}, {sev:'watch', title:'A quiet stretch in the calendar', note}, {sev:'rare', title:'A supplier or energy shock', note}]`.
- **Geometry/cues:** glyph is three ascending bars (8/13/18px). `serious` = all three atlas-500; `watch` = first two amber-600; `rare` = first one cocoa-500. Never an alarmist red wall; calm, neutral notes.

### H. Wages floating range rows (#9) — RATIFIED
- **Type:** **FLOATING RANGE ROWS** per role (a dumbbell/range primitive), with the **median as a dot**.
- **Maps to:** the NEW compact range primitive (RangeStrip sibling; neither shadcn nor the existing kit had it — build it).
- **Data shape:** roles on **one shared $0–$80K scale** `[{role:'Head chef', low:45, med:60, high:78}, {role:'Server', low:26, med:31, high:36}, {role:'Kitchen porter', low:23, med:24, high:26}]` (London exemplar, $K).
- **Computed geometry (shared scale = honesty rule):** every position is `value / 80 × 100`%. Head chef fill `left 56.25% width 41.25%` (45→78 of 80), median dot at `75%` (60/80). Server fill `left 32.5% width 12.5%`, median `38.75%`. Porter fill `left 28.75% width 3.75%`, median `30%`. The shared scale is stated in a caveat ("all roles on the same $0–$80K scale, so a head chef's bar is honestly longer than a porter's") so the bar lengths are an honest comparison, not a re-based illusion. Median dot atlas, track neutral.

### I. Startup stacked cost bar (#10)
- **Type:** single horizontal stacked cost bar + legend, one total in Newsreader weight.
- **Maps to:** kit stacked primitive / `chart-card1` stacked shape.
- **Data shape:** `[{Fit-out:180}, {Kitchen kit:90}, {Deposits, legal:40}, {Opening float:40}]` ($K), total $350K.
- **Computed geometry:** each segment `width%` = `value/total × 100`. Fit-out 51.43%, kit 25.71%, deposits 11.43%, float 11.43%. Calm cocoa/ink stack, one atlas-tinted total figure.

### J. Seasonality gradient area (#11) — RATIFIED
- **Type:** **GRADIENT AREA CHART** over 12 months, single atlas series, stripped axes, one direct busiest/quietest label.
- **Maps to:** port the shadcn `chart-area-gradient` **shape** (gradient `<defs>`, tickless axes), single atlas series.
- **Data shape:** 12 monthly index values Jan→Dec (London: trough Jan/Feb, peaks summer + December).
- **Computed geometry:** path points map month→x evenly (0→720 over 12 nodes) and index→y (higher index = lower y). Gradient stop atlas at 0.28 → 0.02 opacity, closed to baseline; line `--atlas-500`, `non-scaling-stroke`. Busiest dot at the Dec peak (atlas), quietest dot at Jan (ink). Keep it serene.

### K. First-year timeline ribbon (#12) — RATIFIED
- **Type:** **HORIZONTAL TIMELINE RIBBON** of four time-tagged milestones; the **break-even node carries the single vermillion dot** (the one emphasis).
- **Maps to:** kit `TimelineRibbon`.
- **Data shape:** `[{at:'Mo 1-3', label:'Fit-out and open'}, {at:'Mo 3-6', label:'The fragile months'}, {at:'Mo 6-9', label:'Break-even', emphasized:true}, {at:'Mo 9+', label:'A steady room'}]`.
- **Geometry/cues:** four equal columns on a 2px connector line; only the break-even node is atlas-filled with an atlas-50 halo; the rest are neutral hollow nodes.

### L. Nearby like-for-like bars (#13)
- **Type:** like-for-like ranked bars; subject in atlas, peers neutral; honesty rail kept.
- **Maps to:** kit `LikeForLikeBars` (the honesty rail is load-bearing).
- **Data shape:** comparable UK cities, same trade, same currency: London $503K (subject), Edinburgh $412K, Bristol $392K, Manchester $352K, Birmingham $342K.
- **Computed geometry:** bar `width%` = `value / max × 100` (max = London $503K): London 100%, Edinburgh 81.9%, Bristol 77.9%, Manchester 70%, Birmingham 68%.
- **Honesty rules applied (load-bearing):** (1) **comparable PLACES only**, same trade — never rank across business × geography. (2) **Districts are suppressed** (no district-vs-city) via `suppressInventedPeers`; for a district cell this section folds into the strip. (3) The caveat rail is mandatory ("same trade, same currency, not adjusted for local prices — read each on its own terms, not as a league table"). (4) Cities are the only scored entity; a country never ranks its own cities, so on a country-context render this stays a like-for-like read, not a ranking.

### M. Versus-the-world ScoreBand (#15)
- **Type:** `ScoreBand` with a global-median peer tick (the single site-wide vs-world grammar) when held; otherwise the **collapse strip**.
- **Maps to:** kit `ScoreBand`.
- **Honesty:** never a fabricated world number; when the global read is not held, this reads as one calm line inside the strip.

### N. Break-in ScoreBand (within #1)
- **Type:** `ScoreBand` "easier/harder to break in" tick beside the verdict.
- **Geometry:** marker `left%` on a 0→100 easier→harder track; London exemplar marker at **78%** ("Hard"). Atlas marker, neutral track, plain end labels.

---

## Shared assets used

Per the ratified "shared site-wide visual assets" rule, this page draws from the three universal assets:

1. **Stylized world-map motif** — used **sparingly**: a faint, low-contrast world-map texture on the **masthead band backdrop** (behind the tinted `atlas-50 → cream-75` gradient, very low opacity so it never competes with the hero number) and as the quiet motif on the **"versus the world" (#15)** card when held. It must never appear behind a chart or behind body text. This is the page's only decorative backdrop.
2. **Consistent icon set** — the single stroke-icon family appears in: the **navbar** (menu/dropdown affordances + search glyph), the **plain-terms unit cards (#3)** (covers, average-spend, payroll-people icons), the **severity glyphs (#8)** (the three-bar ladder mark), and the **related tiles (#16)** (small affordance/hand-off icons). One stroke weight (~1.8), one corner style, atlas-on-atlas-50 chips where iconed.
3. **Section dividers** — the universal **1px `--cream-300` hairline** rendered as `section.block + section.block { border-top }` between every consecutive section, plus the masthead's bottom border. This is the only divider treatment; no heavy rules, no full-bleed bands between sections other than the masthead's tinted band.

The navbar (`navbar1`) and footer (`footer7`) themselves are the site-wide chrome blocks, present on this page exactly as elsewhere, re-skinned through the one token map.

---

## Exemplar data to fill

The mockup is the **London restaurants** exemplar — every band must show its best self. The exact values each section carries:

**Masthead (0a)**
- Breadcrumb: Home / GB / London / Restaurants.
- Eyebrow: "Restaurants · London · United Kingdom".
- Headline: "A London restaurant brings in about half a million a year." (Newsreader, plain sentence.)
- Hero number: **$503K** typical revenue a year.
- Take-home echo: "The owner keeps about **$48K** of it."
- Distribution curve: lower end **$252K**, typical **$503K** (marker at 38.44%), higher end **$905K**.
- KPI tiles: **Net margin 10%** · **Owner take-home $48K** · **Restaurants in London 8,200**.

**Calculator (0b):** resting state — Monthly rent $9,000 (55%); Staff on payroll 12 (48%); Owner's weekly draw $1,000 (40%); switch "Count the owner's draw as a cost" = ON; result "Your estimated take-home a year **$48K**".

**Honest take (#1):** verdict "The headline revenue is real, but a London restaurant is a wages-and-rent business, not a high-margin one." Bullets: rent takes a bigger bite than almost anywhere; skilled kitchen staff hard to keep, wage floor rising; pricing power is the lever that makes the model work. Break-in ScoreBand: "**Hard**", marker at 78%. Modeled-figures note present (per-$100, units, break-even are modeled from the national pattern — read as a starting point).

**In context (#2):** "A typical London restaurant brings in around $503K a year. After the stock, the staff, the rent and the tax, a typical owner keeps about $48K of that. The dining room is busy; the margin is thin."

**In plain terms (#3):** ~116 covers served a day · ~$12 average spend per cover · 12 people on the payroll.

**Where the money goes (#4 — donut):** Cost of goods $30 · Payroll $33 · Rent and premises $15 · Everything else $12 · **Owner keeps $10** (moss, emphasized). Sum = $100.

**What moves the cost (#5):** Payroll $33 · Cost of goods $30 · Rent and premises $15 · Everything else $12 (largest first).

**What the owner keeps (#6):** **$48K** take-home; kept 10% (moss) vs "goes to stock, staff, rent and tax" 90%.

**Break-even (#7):** break-even **95 covers/day** (52.78%), typical day **140/day** (77.78%), capacity **180 covers/day**. Sentence: "You cover your costs at about 95 covers a day; a typical operator runs nearer 140."

**Risks (#8):** Rent resets on renewal (serious) · Holding good staff (watch) · A quiet stretch in the calendar (watch) · A supplier or energy shock (rare) — each with its one calm note.

**Wages (#9):** Head chef low $45K / median **$60K** / high $78K · Server $26K / **$31K** / $36K · Kitchen porter $23K / **$24K** / $26K. Shared $0–$80K scale; caveat stated.

**Cost to open (#10):** total **$350K**; Fit-out $180K · Kitchen kit $90K · Deposits, legal $40K · Opening float $40K.

**Through the year (#11):** quietest Jan/Feb, busiest summer + December; busiest/quietest direct labels.

**Your first year (#12):** Mo 1-3 Fit-out and open · Mo 3-6 The fragile months ("about 30 in 100 do not make it past here") · **Mo 6-9 Break-even** (emphasized vermillion node) · Mo 9+ A steady room.

**The same business nearby (#13):** London $503K (subject) · Edinburgh $412K · Bristol $392K · Manchester $352K · Birmingham $342K. Caveat: comparable UK cities, same trade, same currency, not price-adjusted, not a league table.

**Operator voices (#14):** three illustrative London exemplar quote tiles — on rent pressure ("The rent review is the date I dread, not a quiet Tuesday."), on keeping staff ("A good head chef leaving costs you more than a slow month."), on pricing power ("We don't win on covers. We win on what a table is willing to pay."). Note: illustrative exemplar, not attributed to named operators, not a live read.

**Collapse strip (demonstrated):** "Still filling in for London restaurants:" chip **Versus the world** + line "This fills in as we hold a worldwide read for this trade. We will not show a fabricated world number." (This is the one collapse-strip rendition shown in the same document.)

**One thing to remember:** "A busy room, a thin margin: the lever is **pricing power**, not volume."

**Related (#16):** tile "Other businesses here → Cafes, bars and bakeries in London"; tile "The same trade elsewhere → Restaurants in Manchester, Edinburgh, Bristol"; CTA "Compare two places".

**Footer / legal:** "Cell page mockup. London restaurants shown as the filled exemplar; figures are illustrative of the exemplar, not a live read. Modeled figures are directional, not measured local numbers."

---

**Build note for the implementer (delta from the current mockup):** the existing `cell-london-restaurants.html` already implements 0a (as a RangeStrip), 0b, #1, #2, #3, #5, #6, #7, #8, #9, #10, #11, #12, #13, #14, the strip, the one-thing line, #16, and the chrome — all correct. To bring it to the ratified spec, make exactly two changes: (1) **upgrade the masthead RangeStrip (0a) to a distribution curve** (keep the 38.44% typical marker and the $252K/$503K/$905K labels), and (2) **rebuild the money section (#4) from the current waterfall into a DONUT/PIE** with the moss-emphasized owner-kept slice + full legend (the founder's explicit override). All other sections, the token map, the navbar/footer chrome, the icon set, the dividers, and every exemplar value above are already correct and should be preserved 1:1.
