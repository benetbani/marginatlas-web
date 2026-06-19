# Page architecture: Industry / activity (e.g. restaurants)

> SUPERSEDED ORDER. The approved section list + order is in `00-APPROVED-REFORM-2026-06-18.md` (built from the deep analysis in `analysis/`, founder-approved 2026-06-18; note: how-it-makes-money becomes a flow-of-money diagram, the cost stack becomes a table, the standalone cost-drivers section dissolves). The per-section visual detail and honesty rules below remain valid reference; where the section SET or ORDER below conflicts with the approved-reform file, that file wins.

> Route: `/industries/[industry]`. Live exemplar: **Restaurants** (the one trade with a real US-state revenue band, real margins, and written character, so the page renders at full richness). Mockup deliverable: a self-contained, double-click-openable `.html` (Newsreader + Inter via a Google Fonts link, the section-2 token map as `:root` vars), modeled on `london-prototype-v1.html`.
>
> **Authority note.** This file reconciles the LOCKED section spec (`07-industry.md`) with the FOUNDER'S 40 RATIFIED DECISIONS. Where they differ, the ratified decisions WIN, and each such override is called out inline as **[QUIZ OVERRIDE]**. The two material overrides: (1) **How-it-works is a FLOW DIAGRAM**, not the locked signal-word `BeatCard` grid; (2) **Margin (cut by cut) is a TABLE**, not the locked `MarginWaterfall`. The chart grammar in `01-component-and-chart-system.md` is the default; the quiz overrides it where they differ (notably: charts are **shadcnblocks chart components**, re-skinned via the one token map, with the honesty rules applied ON TOP, rather than the bespoke visx kit).

---

## Purpose & the one job

**The one job:** for one trade with **no place picked yet**, answer *how does this kind of small business make money, and how little of each sale survives to the owner.*

The reader lands, reads one opinionated verdict thesis, sees one anchor figure (the typical-revenue band from the US-state cohort), then walks down the money's path: the flow of a sale through each cost stage, the per-$100 split, the margin cut by cut, where the trade earns most by US state, what moves the cost, and a calm hand-off. They leave with **the cost shape in their head** and a **place picker** to turn the model into real numbers for one city.

**Single focal point:** the Newsreader **verdict thesis** (a real opinion, no number, ending in a full stop, e.g. *"Restaurants run on volume, and almost none of it survives the kitchen."*) sitting over **one anchor number** (the typical-revenue band; or, when that band is too thin to defend, the kept-per-$100 share as a true structural ratio, never an invented dollar).

**What this page is NOT:** it never picks a place, never shows a tier/confidence chip (an activity carries no single confidence read), never fills with London data, never ranks trades against each other, and never ranks across borders. The **only ranked entity is US states** (one currency, one tax system), and the honesty-rail copy that says so is load-bearing.

---

## The full section + subsection list (in visual order)

Per the ratified decisions: **full navbar site-wide**, **each section in its OWN bordered card**, **rich multi-column footer site-wide**, **shadcnblocks blocks reused as much as possible**, and the **universal shared assets** (world-map motif, consistent icon set, section dividers) present. Density is **information-rich** (denser, almanac-like), fixed with BOTH two-column section layouts AND more sections.

| # | section | subsection(s) | EXACT chosen visual (founder's decision; shadcnblocks block where applicable) | layout | data realness | hierarchy weight |
|---|---------|---------------|------------------------------------------------------------------------------|--------|---------------|------------------|
| 0 | **Global chrome — top navbar** | logo + topic dropdown menus (**Countries, Industries, Cities, Compare**) + **search** + a **primary CTA** | shadcnblocks `navbar1` (logo, menu[] with dropdowns, search slot, auth/CTA button; mobile sheet built in) | full-width sticky bar, blurred cream backdrop | chrome (real nav) | quiet (always present, never competes with hero) |
| 1 | **Hero — verdict model read** | (a) pictogram + sector eyebrow; (b) **verdict thesis H1**; (c) one-line answer; (d) **typical-revenue BAND** anchor — US cohort, **no place, no tier chip**; (e) supporting stat tiles; (f) **place picker** (primary action); (g) quiet across-cities secondary link | **Answer-hero pattern**: a quiet hero (Newsreader H1) + shadcnblocks `stats-card1` row for the tiles, with the signature `RangeStrip` band under the anchor number; `ActivityPlacePicker` control. **[QUIZ: hero = verdict-thesis line + typical-revenue band, no place, no tier chip]** | full-bleed masthead band (not a bordered card — it is the page header); inner content max-width, two-zone (thesis+number left/top, picker below) | modeled (real verdict + real US-state band; **GATE id**). No invented dollars. | **HERO** |
| — | chip-row section nav (mobile / <1280) | jump links to every section below | horizontal scrolling chip row (`navbar`-adjacent pattern) | full-width scroller under hero | chrome | quiet |
| 2 | **The honest take** | one short serif verdict line + up to two plain watch-out points | shadcnblocks `cta10` re-skinned as a **calm accent panel** (buttons omitted); collapses to `SectionEmpty` when unheld | **own bordered card**; stacked, warm atlas-50 ground, generous padding, no icons | modeled | secondary (quiet) |
| 3 | **How it makes money (model anatomy)** | section lead + **the flow of a sale through each cost stage** (input cost load → operating overhead → capital → what the owner keeps), money flowing stage to stage | **[QUIZ OVERRIDE] FLOW DIAGRAM** (stage-to-stage, the money flowing through each cost stage). Built as a coded horizontal flow-of-money diagram (nodes = stages, connectors = the shrinking money passed on), reusing shadcnblocks `feature43`/`feature108` as the card scaffold but re-laid-out as a flow, NOT the locked signal-word `BeatCard` grid. | **own bordered card**; **two-column** (text lead left, flow diagram right at desktop) OR stacked flow under the lead on mobile | modeled (**GATE id**); always renders (margins fall back to a conservative default), each stage self-omits on a missing input | **PRIMARY** (the distinctive move; give it the most room) |
| 4 | **Where the money goes (per $100)** | section lead + one **per-$100 100-unit horizontal bar** + a legend of cost rows + kept row | shadcnblocks **chart component** — `chart-card1` 100%-wide stacked bar — re-skinned, honesty rules on top (kept slice in moss, cost rows in cocoa/ink, never a pie). Direct labels, tabular figures. | **own bordered card**; stacked (full-width bar + multi-column legend grid) | modeled (renders only when the split forms a credible ~$100 sum of ≥2 cost stages + kept; else self-omits). Shares labeled **place-stable**. | primary |
| 5 | **The margin, cut by cut** | section lead + a **table** of the margin cuts: **gross / operating / net**, each with its cut and what survives | **[QUIZ OVERRIDE] a TABLE** (gross/operating/net). Built on shadcnblocks `data-table1`, re-skinned: row per stage, columns = stage / what it takes / what survives / % of revenue. NOT the locked `MarginWaterfall`. The gap between top (gross) and bottom (net) is the punchline, stated in a caption. | **own bordered card**; stacked (full-width table + a one-line punch caption) | modeled (**GATE id**); always present from the curated margins; notes line shown only if real editorial | primary |
| 6 | **Where it earns most** | section lead + **ranked like-for-like bars** (US states only) + the honesty rail | shadcnblocks **chart component** — a ranked horizontal bar chart over the **US-state cohort ONLY**, ordered by modeled **after-tax take-home**. Honesty rail copy is load-bearing. Rows open the cell page. **[QUIZ: ranked like-for-like bars, US states only, after-tax take-home, honesty caveat]** | **own bordered card**; stacked (lead, ranked bar list, honesty rail beneath) | **real** (**GATE id**); `SectionEmpty` when <2 states resolve. **NEVER a cross-country rank.** | primary |
| 7 | **A typical operator** | section lead + plain term/value rows (survives direct cost, reaches owner per $, capital to start, first-year survival) | shadcnblocks `data-table1` sibling re-skinned as **`PlainTerms`** (term/value dl rows, no chart); `SectionEmpty` below 2 facts | **own bordered card**; stacked, lots of line-height, no chart | modeled (**GATE id**); self-omits below 2 facts. No fabricated headcount/covers. | secondary (quiet) |
| 8 | **What moves the cost** | section lead + the few **levers** (largest non-kept lines), ranked by impact, all pointing down | shadcnblocks `feature43`-style **impact rows** re-skinned as `CostDrivers` (ranked driver bars, cocoa fill, down arrows). **No new numbers** — the same per-$100 cost lines re-cast. | **own bordered card**; stacked (ranked driver rows) | modeled; the block's own honest empty state when no cost structure, never a fabricated lever | secondary (quiet) |
| 9 | **Go deeper (related activities)** | section lead + uniform **sibling-trade tiles** (pictogram + name + examples) | shadcnblocks `cta10` / Gallery grid of sibling cards; `SectionEmpty` when no measured siblings. **A taxonomy rail, NOT a ranking.** | **own bordered card**; **two-column** grid of tiles (1-col on mobile) | **real** (**GATE id**); never implies one trade beats another | secondary (quiet) |
| 10 | **One thing to remember** | one serif sentence + a small muted `lastChecked` date | `OneThing` close block | **own bordered card** (narrow), stacked, lots of air — the page exhales here | modeled (the verdict close) | quiet |
| — | sticky section-nav rail (xl / 1280+) | "On this page" jump list of sections 2–10 | sticky right-rail `<aside>` | second grid column at ≥1280 | chrome | quiet |
| 11 | **Global chrome — rich footer** | multi-column **link columns** + **newsletter** + **legal** | shadcnblocks `footer7` (logo, sections[], newsletter, social, legal) | full-width, multi-column | chrome | quiet |

> **Two honesty-system demonstration sections** appear in the *mockup only* (not in the live page), proving the thin-trade behaviour without faking data:
> - a **collapse strip** folding the unheld London-rich sections (pay by role, cost to open, through the year, first-year survival, operator voices) into one calm "still filling in" strip; and
> - an **annotated thin-trade variant** showing the hero leading with the **kept-share fallback** (a structural ratio, moss-treated, never a dashed/invented number) plus one section collapsed to its calm `SectionEmpty`.

---

## Visual hierarchy & density

The page is **information-rich and almanac-like** (the ratified density target), but stays readable through three disciplines: **weighting**, **per-section internal layout choice**, and **a deliberate rhythm of loud and quiet cards**.

**Weighting (loud → quiet).**
- **Hero (loudest):** the Newsreader verdict H1 at `clamp(30px,4.4vw,48px)` over one display-tabular anchor number at `clamp(56px,9vw,92px)` in atlas-700, the `RangeStrip` a single thin band under it. One focal point, one accent color.
- **Three primaries (big, but each a distinct shape — see the bar-soup rule below):** the **flow diagram** (most room of any section — the distinctive move), the **per-$100 bar**, the **margin table**, and the **where-it-earns ranked bars**.
- **Quiet/secondary:** the honest-take panel, the typical-operator plain terms, the cost-driver levers, the related-sibling grid.
- **Quietest:** the one-thing close (a single serif line with maximum air) and all chrome (navbar, rails, footer).

**Per-section internal layout (chosen per section, the ratified rule).** Two-column (text lead + visual) is used where a visual benefits from a paragraph beside it: the **flow diagram** (lead left, flow right) and the **related-tiles** grid. Stacked (lead above a full-width visual) is used where the visual wants the full measure: **per-$100 bar**, **margin table**, **where-it-earns bars**, **plain terms**, **cost drivers**. The honest-take and one-thing are stacked text cards.

**The rhythm / where it breathes.** Every section is its **own bordered card** (ratified), separated by `space-y-6 md:space-y-8` and a thin **section divider** rule (a shared asset). Breathing comes from generous in-card padding and line-height, NOT from dropping sections — the density target means *more* sections, packed but legible. Body copy is held to **65–75ch**. Cards alternate loud/quiet so three data-heavy cards never stack into a wall.

**Bar-soup avoidance (page-specific QA, load-bearing).** Four sections are quantitative and could read as repetitive bars. They are deliberately differentiated so no two share a shape:
1. **Flow diagram** — a left-to-right *flow of money* through stage nodes (not a bar at all).
2. **Per-$100** — a single horizontal **100-unit** stacked bar.
3. **Margin cut-by-cut** — a **table** (rows, not bars).
4. **Where-it-earns** — a **ranked vertical list of horizontal bars** (a leaderboard shape).
Card rhythm is varied (different internal layouts, different paddings) so they never form an identical grid.

**How sample / unheld sections appear (the ratified honesty choice).** Most industry pages are NOT London-rich, so several sections are thin. They never stack into a wall of empty boxes:
- Each unheld **required** section (honest-take, typical-operator, where-it-earns, related-links) renders **ONE calm `SectionEmpty`** at its anchor — identical in shape across all of them: eyebrow = the section label, heading = a calm "still filling in for {trade}", a one-line note. Never a fake line, never a fabricated row.
- The **conditional** sections (per-$100 `money`, cost-drivers) simply **self-omit** when their inputs do not form.
- The hero's `RangeStrip` + anchor **vanish together** when the band is thin; the hero then leads with the **kept-share fallback** (thesis + the structural ratio + place-stable shares), so it never shows a dashed number.
- Result: a confident template with a few quiet "still filling in" notes, reading as **one calm system**, never a broken page.

---

## The signature graphics (exact spec)

For each non-trivial visual: the chosen type (per the ratified decisions), the shadcnblocks block/chart it maps to, the data shape, and the correctness notes (computed geometry + honesty rule applied). All charts read **only** the shadcn semantic vars and `--chart-1..5` per the one token map, so they inherit the warm look; the honesty rules are applied **on top**.

### A. Hero RangeStrip (typical-revenue band)
- **Type:** one thin horizontal band with ticks at true data x (the site-wide signature spread). Not from shadcnblocks — the KEEP-kit `RangeStrip`, polished.
- **Data shape:** `{ lowerUSD, typicalUSD, higherUSD }` over the US-state cohort.
- **Computed geometry:** tick x-position = `(value - lower) / (higher - lower) * 100%`. **Exemplar:** lower **$420K** → 0%, typical **$1.0M** → `(1.0 - 0.42)/(2.3 - 0.42) = 30.9%`, higher **$2.3M** → 100%. The typical tick sits at **30.9%**, not centred — geometry must reflect the real distribution.
- **Honesty:** US-cohort only; no place; labeled "across the US markets we measure." When the band is too thin to defend, the whole strip + anchor self-omit and the hero swaps to the kept-share fallback (moss-treated structural ratio, "per $100 of sales, before any place is picked," never revenue styling).

### B. Flow diagram — "How it makes money" **[QUIZ OVERRIDE: flow diagram, not signal-word beats]**
- **Type:** a **stage-to-stage flow diagram** showing the money flowing through each cost stage — the founder chose a flow over signal-word beats. Read left-to-right (or top-to-bottom on mobile): each node is a cost stage; each connector carries the *shrinking* money passed to the next stage, so the visual narrates the sale getting smaller as it flows.
- **Maps to:** shadcnblocks `feature43`/`feature108` card scaffold, re-laid-out as a connected flow (nodes + arrowed connectors), with the shared icon set on each node. Coded as a reusable flow component, not hand-built per instance.
- **Data shape:** ordered `stages[] = { id, label, role (input cost / operating overhead / capital / kept), takesPct, survivesPct, note }`.
- **Computed geometry / correctness:** the money carried on each connector = the *survives* figure entering the next node; each node's "takes" + the onward "survives" must reconcile to the upstream survives. **Exemplar (canonical split, must reconcile to one source of truth):** start $100 → after direct costs (−$35) **$65 survives** → after running costs (−$46) **$19 survives** → after rent & tax (−$12) **$7 kept**. The numbers MUST equal the per-$100 split and the margin table exactly (one canonical split: 35 + 46 + 12 + 7 = 100, with the per-$100 legend decomposing the $46 running-cost block into payroll $33 + rent/premises $12 + everything-else $13 where the page chooses that finer cut — all readings resolve to ONE canonical source).
- **Honesty:** qualitative tone-coloring allowed (moss = light/kept, atlas = heavy/thin, cocoa = neutral), but no fabricated number — each stage self-omits on a missing input; margins fall back to a conservative default so the diagram always renders.

### C. Per-$100 stacked bar — "Where the money goes"
- **Type:** one horizontal **100-unit** stacked bar; kept slice in moss, cost slices in cocoa/ink shades. **Never a pie** (brand law).
- **Maps to:** shadcnblocks `chart-card1` (100%-wide stacked/bar variant), re-skinned via the token map.
- **Data shape:** `segments[] = { label, dollars, colorVar }` summing to 100, with exactly one `kept` segment.
- **Computed geometry:** each segment width = its dollar value as a percent (since the total is $100, width% == dollars). **Exemplar:** Cost of goods **$35**, Payroll **$33**, Rent & premises **$12**, Everything else **$13**, Owner keeps **$7** → 35 + 33 + 12 + 13 + 7 = **100**. Direct labels on the three biggest segments; full legend below with tabular figures.
- **Honesty:** renders only when the split is a credible ~$100 sum of ≥2 cost stages + kept; shares stated as **place-stable** ("these shares hold roughly wherever the trade runs, before any place is picked"). The owner-kept slice is emphasized (the ratified honesty rule: emphasize the owner-kept slice).

### D. Margin table — "The margin, cut by cut" **[QUIZ OVERRIDE: a table, not a waterfall]**
- **Type:** a **table** of the margin cuts (gross / operating / net) — the founder chose a table over a waterfall.
- **Maps to:** shadcnblocks `data-table1`, re-skinned.
- **Data shape / columns:** `rows[] = { stage, takes (the cut), survives (running balance), pctOfRevenue }` for the three margins plus the revenue start row.
- **Correctness:** the running "survives" must equal revenue minus cumulative cuts at each row, and must match the flow diagram and per-$100 split exactly. **Exemplar:** Revenue **$100** → less direct costs **−$35** → **Gross $65 (65%)** → less running costs **−$46** → **Operating $19 (19%)** → less rent & tax **−$12** → **Net $7 (7%)**. The **gap between gross ($65) and net ($7)** is the punchline, stated in a one-line caption beneath the table.
- **Honesty:** modeled from the curated margins; the notes line is shown only when it is real editorial (never a TODO/clone marker).

### E. Where-it-earns ranked bars — "Where it earns most"
- **Type:** **ranked like-for-like horizontal bars** over the **US-state cohort ONLY**, ordered by modeled **after-tax take-home** (the ratified decision).
- **Maps to:** shadcnblocks ranked bar **chart component**, re-skinned, with the load-bearing honesty rail.
- **Data shape:** `stateRows[] = { state, takeHomeUSD, href }` sorted descending; bar width = `value / max * 100%`.
- **Computed geometry / correctness:** the top row is the max and anchors 100%; every other bar = its take-home as a percent of the max. **Exemplar:** New York **$118K** → 100%, California **$111K** → `111/118 = 94.1%`, Florida **$96K** → 81.4%, Texas **$92K** → 78.0%, Illinois **$84K** → 71.2%, Ohio **$74K** → 62.7%. Every width must be recomputed from the real value, not eyeballed.
- **Honesty (non-negotiable):** US states only; one currency, one tax system; the rail copy ("one currency, one tax system, so we do not rank across borders … US states only, read on the same footing") stays. **NEVER** merge in a country cohort or rank across borders. Each row opens that place's cell page. `SectionEmpty` when <2 states resolve.

### F. Cost-driver levers — "What moves the cost"
- **Type:** ranked **impact rows** (the same non-kept cost lines re-cast as levers), all pointing **down**, ranked by weight.
- **Maps to:** shadcnblocks `feature43`-style impact rows, re-skinned as `CostDrivers`.
- **Data shape:** `drivers[] = { rank, label, dollars }` = the per-$100 cost lines (Cost of goods $35, Payroll $33, Everything else $13, Rent & premises $12), bar width = `dollars / maxDollars * 100%` (CoGS $35 = 100%, Payroll $33 = 94.3%, Everything else $13 = 37.1%, Rent $12 = 34.3%).
- **Honesty:** **no new numbers** — these are exactly the per-$100 cost lines re-ranked. The block's own honest empty state when there is no cost structure; never a fabricated lever.

> The **per-$100 bar (C)**, the **margin table (D)**, the **where-it-earns bars (E)**, and the **cost-driver levers (F)** all decompose ONE canonical margin split. They must be cross-consistent to the dollar: any change to the split changes all four together.

---

## Shared assets used

The three ratified universal assets, and exactly where each appears:

- **Consistent icon set** — appears in: (a) the **hero eyebrow** as the `AtlasPictogram` for the sector (Food and drink · Restaurants); (b) each **node of the flow diagram** (one stage glyph per node); (c) each **related-sibling tile** (a small pictogram per sibling trade — cafes, bars, bakeries, pubs); (d) the **navbar** dropdown affordances and **search** icon. One coherent stroke style (1.3–1.4px, round caps), one accent treatment (atlas-700 on atlas-50 chips).
- **Section dividers** — the thin rule between every bordered section card (the `section.block + section.block` top-border rhythm), giving the almanac cadence without heavy chrome. Used between all of sections 2–10.
- **Stylized world-map motif** — used sparingly as a faint premium backdrop. On THIS page it appears at most once, as a quiet watermark behind the **where-it-earns** card (a US-states context cue) or behind the hero band; kept very low-contrast so it never competes with the one accent color and never reads as decoration over data. It must NOT appear behind a quantitative chart in a way that reduces legibility. (If in doubt, omit — the page is data-first.)

These shared assets are **coded reusable components**, not hand-generated per instance (the section-constitution rule).

---

## Exemplar data to fill (the live Restaurants values the mockup carries)

The mockup is filled with **Restaurants** at full richness. Every number below resolves to ONE canonical margin split; they must stay mutually consistent.

**Sector / eyebrow:** Food and drink · Restaurants. Pictogram = the fork/spoon glyph.

**Hero:**
- Verdict thesis H1: *"Restaurants run on volume, and almost none of it survives the kitchen."*
- One-line answer: *"A restaurant is a cash-rich, margin-poor business that punishes every mistake in food and labor."*
- Anchor number: **$1.0M** typical revenue/year (across the US markets we measure); owner keeps **~7¢ on the dollar**.
- RangeStrip: lower **$420K** (0%), typical **$1.0M** (30.9%), higher **$2.3M** (100%).
- Stat tiles: Net margin typical **7%**; Survives direct costs **65%**; Owner take-home low→high **$32K to $190K**.
- Place picker default country: **United States**, city = unset ("Pick a city"); CTA "See this place"; secondary link "see how restaurants compare across every city we measure."

**Honest take:** verdict line: *"A few points of food waste, a slow week, or one extra body on the rota flips a thin margin negative, and rent does not care how many covers you served."* Two points: (1) food sells for far more than it costs to plate, but food + labor eat most of the gross before rent arrives; (2) cash comes in fast, which masks how little stays.

**Flow diagram (how it makes money):** lead — about **65%** survives the direct cost of a sale; after staff, overhead, rent, tax, roughly **7%** is left. Stages: ① Input cost load = **Light** (direct ~35% of revenue); ② Operating overhead = **High** (~46% of revenue in staff + overhead); ③ Capital to start = **Light** (asset-light); ④ What the owner keeps = **Thin** (~7%). Money carried node-to-node: **$100 → $65 → $19 → $7**.

**Per-$100 split:** Cost of goods **$35**, Payroll **$33**, Rent & premises **$12**, Everything else **$13**, Owner keeps **$7** (= 100).

**Margin table (cut by cut):** Revenue **$100** → less direct costs **−$35** → Gross **$65 (65%)** → less running costs **−$46** → Operating **$19 (19%)** → less rent & tax **−$12** → Net **$7 (7%)**. Punch caption: a hundred dollars of sales walks out as roughly **$7**.

**Typical operator (plain terms):** Survives direct cost of a sale **65%**; Reaches owner per dollar of sales **7¢**; Capital to start **Light**; Still open after one year **80 in 100**. Caveat: read from the place-stable cost structure, not a count of staff or covers.

**Where it earns most (US states, after-tax take-home):** New York **$118K** (100%), California **$111K** (94.1%), Florida **$96K** (81.4%), Texas **$92K** (78.0%), Illinois **$84K** (71.2%), Ohio **$74K** (62.7%). Honesty rail present. Each row opens that place's restaurant cell page.

**What moves the cost (levers, all down):** ① Cost of goods **$35** (100%), ② Payroll **$33** (94.3%), ③ Everything else **$13** (37.1%), ④ Rent & premises **$12** (34.3%).

**Related (siblings, taxonomy not ranking):** Cafes and coffee shops (espresso bars, neighborhood roasters); Bars and nightclubs (cocktail bars, late-night venues); Retail bakeries (bread shops, patisseries); Pubs and taverns (gastropubs, wet-led locals). Caveat: a family of trades, not a league table; none beats another here.

**One thing to remember:** *"High margin on paper, thin once the bills are paid. The operators who fail treat a workable margin as a forgiving one."* `lastChecked`: Model last checked May 2026.

**Honesty-proof variants (mockup only):**
- Collapse strip chips: Pay by role · Cost to open · Through the year · First-year survival · Operator voices — under the line "Still filling in for restaurants, before a place is picked."
- Thin-trade variant: kept-share fallback hero — eyebrow "Kept by the owner" (moss-700), thesis *"When there is no revenue band to stand on, the share that survives is the honest anchor,"* number **7 on the $100** (moss-700, NOT the revenue anchor styling), caption "per $100 of sales, before any place is picked. A structural ratio, not a revenue figure." Plus one `SectionEmpty` for "Where it earns most" reading "Still filling in for this trade."

**Constraints reaffirmed:** no em-dashes; no source-agency names (the margins JSON source field is internal-only); tokens only (the section-2 token map); ONE terracotta accent (moss = kept/positive, amber = caution); tabular lining figures on every number; Newsreader only for the verdict thesis + the one hero number, Inter elsewhere; legible at 1280 and 375 with 44px tap targets and no horizontal scroll on mobile.

---

Source files this architecture was built from (all absolute):
- `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\07-industry.md` (locked section spec)
- `E:\atlas\industry-restaurants.html` (current mockup / exemplar data source)
- `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\01-component-and-chart-system.md` (token map + block/chart grammar)
