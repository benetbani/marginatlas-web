# Page architecture: Neighbourhood overview (e.g. West End, London)

> SUPERSEDED ORDER. The approved section list + order is in `00-APPROVED-REFORM-2026-06-18.md` (built from the deep analysis in `analysis/`, founder-approved 2026-06-18; note: the squeeze (revenue-lift vs rent-lift) becomes an explicit paired-bar beat, what-thrives becomes a diverging centre-baseline bar, three wayfinding sections merge to one). The per-section visual detail and honesty rules below remain valid reference; where the section SET or ORDER below conflicts with the approved-reform file, that file wins.

> Route: `/[country]/[geo]/[industry]` when it resolves to a city + neighbourhood, e.g. `/gb/london/west-end`, `/us/los-angeles/santa-monica`.
> Mockup precedent: `E:/atlas/neighbourhood-west-end.html` (the filled West End exemplar).
> Locked spec: `E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/06-neighbourhood.md`.
> Chart grammar: `E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/01-component-and-chart-system.md` (the 40 ratified quiz decisions OVERRIDE it where they differ).

---

## Purpose & the one job

This page answers exactly one question: **"If I open here instead of elsewhere in the city, which trades does this district lift and which does it squeeze, and why?"**

A neighbourhood is, by deliberate design, a **relative read against its own city baseline** and nothing else. The whole page operates at an altitude where **no absolute money is ever shown**. Every figure is a multiple of the rest of the city (e.g. "2x or more versus the rest of London"), and the page says so out loud in three places (the gauge note, the honest-take body, the footer).

The single focal point is the **answer-first headline**: the district name as the Newsreader H1, the winning-trade verdict line in big serif beneath it, and one **multiplier gauge** under that pinning the city baseline at 1.0x and the top trade's lift on a 0.4x..3.0x track. Everything below the fold answers "why": what thrives, who the customer is, what it costs, how it stacks against next-door districts, the curated street and ground texture, and the sibling rail out to the rest of the city.

There is **no CTA button at hero altitude**. The call to action is the clickable `thrives` rows that deepen into per-trade neighbourhood cells.

The honesty contract for this page type, restated so the implementer cannot drift:
1. **No absolute money, ever.** Pounds/dollars are forbidden at this altitude.
2. **Rail-clamp every multiplier** to honest bands ("2x or more" / "less than half"). Never print a false-precise "+200%" or "1.00x".
3. **Cities are the only scored entity.** A district is never "scored"; a country never ranks its own cities; a district is never compared to a whole city. The only cross-district comparison is the like-for-like table, same rep trade, one city, with a leader mark allowed (one city, comparable prices).
4. **Three kinds of "tag" must never collide visually** (price tier vs economic tags vs character word). Three weights, ONE accent.
5. **No em-dashes, no source-agency names, tokens only.** Moss = kept/positive, amber = caution, ONE terracotta (atlas) accent.

---

## The full section + subsection list (in visual order)

Legend for hierarchy weight: **hero** (owns the first screen) · **primary** (a data-heavy workhorse block) · **secondary** (supporting text-led beat) · **quiet** (calm closer, rail, or scaffolding).

| # | section (id) | subsection(s) | the EXACT chosen visual (founder decision; shadcnblocks block where applicable) | layout | data realness | hierarchy weight |
|---|---|---|---|---|---|---|
| 0a | **Full navbar** (global chrome) | logo + topic dropdowns (Countries, Industries, Cities, Compare) + search + primary CTA | shadcnblocks `navbar1` (re-skinned to the token map; mobile sheet built in). Mockup currently renders a reduced bar (logo + flat nav words + "Get the data" dark button); the production build MUST upgrade this to the full `navbar1` with real dropdown menus + a search affordance + the primary CTA. | sticky bar, full-bleed, blurred cream background | n/a (chrome) | quiet (persistent) |
| 0b | **Breadcrumb** | Home / GB / London / All neighbourhoods / West End | owned inline markup (`.crumbs`), city + country + "all neighbourhoods" links sit here and quiet in the eyebrow | inline, top of masthead | real (route coordinates) | quiet |
| 1 | **District hero / `headline`** (answer-first) | (a) eyebrow with the AtlasPictogram place glyph + coordinate line; (b) district name H1; (c) winner verdict line; (d) single Newsreader hero figure + caption; (e) **the multiplier gauge**; (f) the gauge "relative read by design" note; (g) the three-weight pill row | re-skinned `AnswerFirstMasthead` (maps to a Hero block, `hero2`-class) + a KEEP-kit `ScoreBand` re-skinned as the **multiplier gauge** (0.4x..3.0x track, 1.0x baseline pinned); pills from `pricing`-style pills | **card-less hero band** (tinted atlas-50→cream gradient masthead, its own bordered region by virtue of the bottom hairline); internally stacked, gauge constrained to `max-width:680px` | modeled (`getNeighborhoodMultiplier` top-trade `final`, tags, character) | **hero** |
| 2 | **The honest take / `honest-take`** | verdict line + up to 3 plain points + the modeled-not-measured caveat body | shadcnblocks `cta10` calm accent panel (buttons omitted) / kit `HonestTakeBox` (`.panel`, atlas-500 left stripe) | **own bordered card**, stacked, single column, constrained narrow measure | london-exemplar (editorial brand beat from the view's `honestTake`) | primary (the conscience of the page) |
| 3 | **What thrives here / `thrives`** | (a) lead (eyebrow + serif H2 + intro); (b) **ranked multiplier bars** (rail-clamped); (c) caveat; (d) **one-trade decomposition card** (commuter / tourism / character-tags) scoped to ONE trade | KEEP-kit `LikeForLikeBars` (rail-clamped, rows clickable into cells) + a `stats-card1`-style mini-grid for the decomposition (`.decomp`) | **own bordered card**; bars stacked full-width (max 680px); decomposition is a nested bordered sub-card; chart and intro stacked (not two-column, density via row count) | modeled (ranked per-trade `final` vs city) | **primary** (the workhorse) |
| 4 | **Who lives and shops here / `who`** | (a) lead; (b) 2–3 "who the customer is" visual-list lines (skew / what they spend on / what already works) | KEEP-kit `WhatLocalsKnow` visual list (`.whoknows`, quiet atlas-50 icon tiles), NOT a prose wall | **own bordered card**, stacked, single column, generous row gaps | real (`flavor.demographic_skew` + food scene + signature businesses) | secondary |
| 5 | **Cost to operate / `operating-cost`** | (a) lead with the "+Xx vs rest of city" headline in the H2 + the "revenue lift ≠ profit lift" caution; (b) **single mini horizontal bar vs the pinned 1.0x baseline**; (c) caveat | kit `BreakEvenLine` headline + a one-row `LikeForLikeBars`-against-baseline mini bar (`.opbar`, 0..2x domain, baseline tick at 50%) | **own bordered card**, stacked, single column; bar constrained to 560px | modeled (`rentMultiplier` vs the 1.0x city baseline) | secondary |
| 6 | **Versus next door / `adjacent`** | (a) lead; (b) **like-for-like table**: this district column-one, up to 3 curated siblings, one rep trade row + one character row; (c) caveat/footnote | kit `LikeForLikeTable` (`.lft`, self column atlas-tinted, leader mark allowed, horizontal scroll within its own track) | **own bordered card**, stacked, table inside an `overflow-x` scroll rail | modeled (siblings' rep-trade `final`, curated siblings only) | **primary** (the cross-district payoff) |
| 7 | **Prime streets / `streets (prime)`** | (a) lead with the place glyph; (b) 2-col card grid of curated streets, each: name + what it sells + optional rent-vs-city + spend-per-visit chips | a 2-col card grid (owned markup, `feature`-grid skin, `.feat`/`.featcard`); per-street rent/spend chips self-omit when no real figure | **own bordered card**; internally **two-column** card grid (collapses to one column at ≤680px) | real (curated `neighborhood_economics.prime_streets` only) | secondary |
| 8 | **On the ground / `ground`** | (a) lead; (b) two short columns: **Food scene** / **Don't miss** | a 2-col owned `feature`-style text grid (`.feat`/`.featcard`, no chips) | **own bordered card**; internally **two-column** text grid (collapses to one at ≤680px) | real (`flavor.food_scene` + `dont_miss` only) | quiet (knowledgeable local aside) |
| 9 | **The businesses here / `businesses-here`** (sibling rail) | (a) lead ("equal weight, no ranking"); (b) uniform equal-weight tiles linking other districts of the same city, each with a plain character word | kit `BeatCard` shell wrapping a uniform tile grid (`.sibgrid`/`.sibtile`); cocoa dot, atlas hover, NO scores | **own bordered card**; internally a 3-col tile grid (→2 at ≤760px, →1 at ≤480px) | real (sibling neighbourhood records) | quiet |
| 10 | **Still filling in** (the collapse strip) | a single calm band of stacked `SectionEmpty` rows for the genuinely-thin sections, in their locked order. On the filled West End exemplar only `street-by-street` collapses here. | kit `StreetCharacter`/`SectionEmpty` empty rows folded into one strip (`.strip`/`.emptyrow`) | **own bordered card** (cream-100, single unified band), stacked rows | placeholder + real-absent (per-street character has NO data source anywhere; other reals fold here when absent) | quiet (intentional scaffolding) |
| 11 | **One thing to remember / `one-thing`** | (a) eyebrow; (b) the warm last word (reuses the held district verdict); (c) freshness ("Modeled, June 2026") + "Flag it" | kit `OneThing` closer (`.onething`, ink-900 dark card, atlas-300 eyebrow) | **own dark card**, stacked, single column, constrained measure | london-exemplar (reuses the honest-take verdict) | primary (the warm close) |
| 12 | **Related / hand-off** | (a) lead; (b) two tiles ("All London neighbourhoods" / "London business overview"); (c) "Compare two districts" accent button | `cta10` / Gallery-grid hand-off (`.reltiles`/`.reltile`) + one `btn-accent` | **own bordered card**; two-col tiles (→1 at ≤680px) + a single CTA | real (route hand-offs) | quiet |
| F | **Rich footer** (global chrome) | link columns + newsletter + legal + the modeled-relative disclaimer | shadcnblocks `footer7` (re-skinned). Mockup currently renders a reduced single-column footer with the mark + the modeled-relative disclaimer paragraph; the production build MUST upgrade to the full multi-column `footer7` (link columns + newsletter + legal) and KEEP the disclaimer paragraph. | full-bleed, multi-column | n/a (chrome) | quiet (persistent) |

**Section count note.** The locked spec lists 11 numbered sections and reuses `streets` for both id 4 (street-by-street character, the placeholder) and id 8 (prime streets, the curated card grid). In the mockup those resolve to: the **prime-streets card grid renders in full** (section 7 above) and the **street-by-street character placeholder folds into the collapse strip** (section 10 above). Keep both distinct in the build: prime streets is real curated data; street-by-street character is the one section with no data source anywhere and always reads as "not mapped yet."

---

## Visual hierarchy & density

The founder's ratified bar is **information-rich / almanac-like**, NOT spacious, but **never dense-to-the-point-of-unreadable**. This page reconciles that with the relative-read discipline by concentrating density in two data blocks and letting short text beats breathe between them.

**The three visual zones (the page is read as three movements, not eleven memos):**

1. **The opening (hero + honest-take).** The masthead owns the first screen end to end: district name, winner line, the one gauge. The honest-take card immediately reframes the reader's money expectation. These two are the loudest things on the page.
2. **The data core (thrives + operating-cost + adjacent).** The two modeled workhorse blocks (`thrives` ranked bars and the `adjacent` like-for-like table) are the densest, most tabular moments. `operating-cost` is the quiet hinge between them: one sentence, one mini bar. The `who` block sits as a short text beat just before this core to let the page breathe between the gauge and the bars.
3. **The texture + close (prime streets + ground + sibling rail + collapse strip + one-thing + related).** Real curated flavor, then the equal-weight rail, then the calm scaffolding, then the warm last word.

**Per-section layout choice (two-column vs stacked), reasoned:**
- **Stacked** wherever the visual IS a horizontal-bar or gauge instrument that wants the full content width: hero gauge, `thrives` bars, `operating-cost` mini bar, `honest-take` panel, `who` list, `adjacent` table, `one-thing`, the collapse strip. These read top-to-bottom and stacking keeps the bars long enough to register magnitude.
- **Two-column (internal card grid)** for the genuinely card-like content: `prime streets` (2-col card grid), `on the ground` (2-col Food / Don't-miss), `related` (2 tiles). The sibling rail is a 3-col tile grid. These satisfy the founder's "fix sparseness with two-column section layouts" without forcing a bar chart into a cramped half-width.

**The rhythm.** Each `section.block` carries `padding:52px 0` and a `border-top:1px solid cream-300` between consecutive blocks (the "card-per-section" affordance at the section seam). The hero is a tinted gradient band; everything below is cream-75 ground with each section's real card (panel / decomp / featcards / sibgrid / strip / onething) carrying its own `cream-300` border + radius. Generous row heights on the tabular blocks (`.lflrow` min-height 44px, `.lft` cells 15px padding). Body measure on every text beat is held to **65–75ch** (`.lead p` 60ch, `.panel li` 64ch, `.caveat` 64ch, `.hero-cap`/`.verdict` 24ch for the hero punch).

**Where it breathes.** `who`, `operating-cost`, and `ground` are short text-led beats with at most one mini bar, set in generous whitespace so the page exhales between the two data-heavy moments (gauge → bars). The sibling rail and one-thing close calm.

**How sample / unheld sections appear (the founder's chosen grammar).** This page type has several genuinely-thin sections on a typical (uncurated) district. They do **NOT** each become a full dashed card. They fold into **ONE** calm "still filling in" strip: a single bordered cream-100 band holding stacked `SectionEmpty` rows (eyebrow + heading + a "Not held yet" pill with a dot-plus-words non-colour affordance), placed in their locked order but visually unified as one quiet band. On the filled London exemplar almost nothing collapses (only `street-by-street`). On a bare district, only hero + honest-take + thrives carry weight and everything else is one tidy strip. Placeholders read as cream ground + parchment hairline + cocoa-700 text clearing AA, never as brokenness and never as a real-looking number. The mockup deliberately shows BOTH the filled state and the collapse strip in one document so the founder sees the placeholder grammar.

---

## The signature graphics (exact spec)

### Graphic 1 — The multiplier gauge (HERO; the one chart in the first screen)

- **Chosen type:** a 0.4x..3.0x linear track with the city baseline pinned at 1.0x and the top trade's lift marked at its rail-clamp position. This is the ratified "MULTIPLIER GAUGE + a winner line" hero.
- **Maps to:** KEEP-kit `ScoreBand` re-skinned (per the chart-system "Versus the world = ScoreBand with a tick"). NOT a generic Recharts radial. Owned static markup in the mockup (`.mgauge`).
- **Data shape:** `{ topTradeLabel: string, topTradeClampBand: "2x or more" | "less than half" | …, modelValue: number (clamped) }`. The gauge consumes the CLAMPED model value, not a raw multiplier.
- **Computed geometry (load-bearing, do not eyeball):**
  - Position function: `pct(v) = (v - 0.4) / (3.0 - 0.4) * 100`.
  - Anchor points: `0.4x = 0%`, `1.0x = 23.077%`, `2.0x = 61.538%`, `3.0x = 100%`.
  - The live atlas span runs from the baseline `23.08%` to the clamp `61.54%`, width `38.46%`.
  - The hatched "clamped beyond here" band runs from the clamp `61.54%` to the ceiling `100%`, width `38.46%` (repeating cream diagonal, signalling "we stop reading past here").
  - The pinned city baseline is a dark `ink-700` vertical tick at `23.08%` (1.0x).
  - The top-trade marker is an atlas-600 dot seated at the clamp `61.54%`.
  - The scale labels (0.4x / 1.0x / 2.0x / 3.0x) and the two key captions ("London baseline 1.0x", "Hotels, 2x or more — clamped at the model ceiling") sit at their `pct()` positions, `translateX(-50%)`.
- **Honesty rule applied:** the gauge is explicitly a vs-city-baseline instrument (1.0x pinned, labelled "versus the rest of the city"). The note states no absolute money is shown by design and that the strongest trades pin to the ceiling and read as "2x or more," not a false-precise multiple. This designs out the "mistaking a relative page for an absolute one" risk AND the "+200% everywhere" risk at the hero.

### Graphic 2 — What-thrives ranked multiplier bars (PRIMARY workhorse)

- **Chosen type:** ranked multiplier bars, rail-clamped to honest bands, winners on top, the lone winner accented. This is the ratified "RANKED MULTIPLIER BARS, rail-clamped to honest bands ('2x or more','less than half'), lone winner accented."
- **Maps to:** KEEP-kit `LikeForLikeBars` (the honesty rail is load-bearing). Owned markup `.lfl`/`.lflrow` (3-col grid: 120px label / 1fr bar / 96px value).
- **Data shape:** `rows: { tradeLabel, band: "2x or more" | "less than half" | …, barWidthPct, isSubject, href }[]`, pre-sorted with winners on top.
- **Computed geometry & honesty rules:**
  - Trades that pin to the ceiling render at `width:100%` and read `"2x or more"`. Suppressed trades render `"less than half"` at a consistent sub-50% width (e.g. 30–34%) — **less than half = under 50% of the ceiling bar**, kept visually consistent.
  - The lone leader (the trade the catchment rewards most directly, e.g. Hotels) carries the **single atlas fill** + `.subject` class (atlas label + atlas value); every other bar is **cocoa-300**.
  - When multiple trades pin to the ceiling, **none is crowned above the others** — the caveat states "four trades sit at the model's ceiling, so none is crowned; the band is the honest reading," and the lead mark is reserved for the one trade carried in the decomposition. This is the core defence against "+200% everywhere" cringe.
  - Rows are clickable (`a.lflrow`) and deepen into the per-trade neighbourhood cell. Tabular figures (`.num`), generous 44px row height.

### Graphic 2b — One-trade decomposition card (nested inside thrives)

- **Chosen type:** a small `stats-card1`-style mini-grid, **scoped explicitly to ONE trade** so a flat part never reads as a claim about the whole district.
- **Maps to:** owned `.decomp` card; 3-part `dl` grid (commuter pull / tourism pull / character tags) + a clamped total row.
- **Data shape:** `{ tradeScoped: string, parts: { commuter: band, tourism: band, tags: band }, total: clampBand }`. The parts use **qualitative bands** (Moderate / Very high / Strong), never numeric `1.00x`, so no part reads as a false-precise claim.
- **Honesty rule applied:** the heading and a sub-line both say it is scoped to a single trade on purpose ("A band below is about restaurants, never a claim about the whole district"). The total is rail-clamped ("2x or more"). This designs out risk #3 of the page-specific QA (a flat decomposition part over-claiming).

### Graphic 3 — Operating-cost mini bar (SECONDARY)

- **Chosen type:** a single mini horizontal bar vs the pinned 1.0x city baseline (a one-row `LikeForLikeBars` against "rest of city = 1.0x").
- **Maps to:** owned `.opbar`; the kit `BreakEvenLine` headline + this single bar.
- **Data shape:** `{ rentMultiplierBand: "2x or more" | …, hasHonestRentSignal: bool, priceTier?: string }`.
- **Computed geometry:** the track domain is **0..2.0x** (the clamp = the full track). The pinned city baseline tick (`ink-700`) sits at exactly **50%** of the track (1.0x). West End rent clamps to the **full bar** (≥ 2x). Captions: "Rest of London" (left), "1.0x baseline" (centre), "2x or more" (right, atlas).
- **Honesty rule applied:** the baseline is a vertical TICK, not a competing bar. The caveat states rent is modeled from the area's land character and that "a revenue lift here is not a profit lift; the rent is the reason." **Self-omits to `SectionEmpty`** when there is no honest rent signal AND no price tier.

### Graphic 4 — Versus-next-door like-for-like table (PRIMARY; the cross-district payoff)

- **Chosen type:** a like-for-like table, this district first, one rep trade, one city. This is the ratified "LIKE-FOR-LIKE TABLE (this district first, one rep trade, one city)."
- **Maps to:** kit `LikeForLikeTable`. Owned `.lft` markup inside an `.lfscroll` horizontal-scroll rail.
- **Data shape:** `{ repTrade: string, columns: [subject, ...curatedSiblings (max 3)], rows: [ { repTradeBand per column, leaderColumn }, { characterWord per column } ] }`.
- **Computed geometry & honesty rules:**
  - **This district is ALWAYS column one**, atlas-tinted (`th.self`/`td.self` on atlas-50).
  - Up to 3 curated siblings beside it, on the SAME rep trade and on character.
  - Each rep-trade cell is **rail-clamped uniformly** ("2x or more" rather than false-precise percentages) — when all districts pin to the ceiling, the figures read as bands, not numbers.
  - **Leader mark allowed** (the `.leadmark::after` "leads" pill) because this is one city with comparable prices — the only place a cross-district leader is honest. The subject carries the lead mark as the set's strongest catchment.
  - The character row gives each area's dominant pull (Tourist trade / Office and finance / etc.).
  - Table has `min-width:560px` and scrolls inside its own track at 375 (no page horizontal scroll).
  - **Falls to `SectionEmpty`** when no sibling carries data.

### Graphic 5 — Prime-streets cards (SECONDARY; real only)

- **Chosen type:** CARDS with rent/spend chips, **only where a real figure is held**. This is the ratified "Prime streets = CARDS with rent/spend chips (only where a real figure is held)."
- **Maps to:** owned 2-col `feature`-grid skin (`.feat`/`.featcard`).
- **Data shape:** `streets: { name, sells, blurb, rentVsCityBand?, spendPerVisit? }[]` — **curated only**.
- **Honesty rule applied:** mounts ONLY with a curated streets record; each chip (rent-vs-city / spend-per-visit) **self-omits** when no real figure is held. Rent chips are bands ("3x or more", "2x or more"), spend is qualitative ("high"). No card without a real record.

### Non-chart visual instruments (for completeness)
- **Pill row (hero):** three weights, one accent — `.pill-tier` (price tier, captioned atlas-tinted: "Cost: Luxury"), `.pill-tag` (economic tags, quiet cream: "Tourist zone", "Luxury district", "Nightlife", "Transit hub"), `.pill-char` (the character word, ink-900 break-in chip with an atlas-300 dot). This is the resolution of risk #3 (three kinds of tag colliding).
- **Who-list:** `.whoknows` visual list with one consistent quiet atlas-50 icon tile per row (not a chart, not a prose wall).
- **Sibling rail tiles:** `.sibgrid`/`.sibtile`, equal-weight, cocoa dot + character word, atlas hover, **no scores, no ranking**.

---

## Shared assets used

Per the ratified "shared site-wide visual assets" decision (a stylized world-map motif, a consistent icon set, section dividers), this page uses:

- **The consistent icon set.** The **AtlasPictogram place glyph** (a map-pin/place mark with a centre dot, stroked in atlas-700) appears in the hero eyebrow and in the Prime-streets eyebrow — it replaces any star/decorative glyph and signals "a place." The `who`-list uses one repeated quiet ring icon as the consistent list marker. All icons are inline SVG on `currentColor`/atlas tokens, `aria-hidden`.
- **Section dividers.** The `border-top:1px solid cream-300` between consecutive `section.block` elements IS the consistent section divider rhythm, paired with each section's own bordered card.
- **The world-map motif (optional, sparing).** Permitted as a faint background-pattern backdrop behind the hero band only (the "subtle premium backdrop", Background/Pattern 52), at very low opacity so it never competes with the gauge. The current mockup does not yet render it; if added it must stay a quiet texture, never a literal map with claims on it.
- **Global chrome.** The full `navbar1` (logo + Countries/Industries/Cities/Compare dropdowns + search + primary CTA) and the rich multi-column `footer7` (link columns + newsletter + legal + the modeled-relative disclaimer) are the site-wide shared assets, present on every page type including this one.

The token map (section 2 of the chart-system doc) is the single shared mechanism that themes every block and chart warm; declare it in `:root` for the mockup and in `globals.css` for the app.

---

## Exemplar data to fill (the real London West End values)

These are the confirmed-in-repo West End exemplar values the mockup carries; the build fills these verbatim for London and resolves the equivalents per district elsewhere.

- **Hero.**
  - H1: **West End**.
  - Breadcrumb: Home / GB / London / All neighbourhoods / West End.
  - Eyebrow coordinate line: **London · GB · All neighbourhoods** (with the place glyph).
  - Verdict line: **"Hotels earn about 2x or more versus the rest of London here."** (winning trade in atlas).
  - Hero figure: **2x+**, caption "The top trade's revenue versus the rest of London. A relative read, never a pound figure."
  - Gauge: top trade **Hotels**, lift **2x or more**, marker at the clamp (61.54%), baseline pinned at 1.0x (23.08%).
  - Pills: **Cost: Luxury** (atlas-tinted tier), **Tourist zone**, **Luxury district**, **Nightlife**, **Transit hub** (cream tags), **Theatre and tourist heart** (ink character chip).
- **Honest take.**
  - Verdict: "Treat this as a read on the West End specifically, not the London average."
  - Points: (1) the pull here is visitors, which is why some trades lift hard and others get squeezed; (2) the same trade can read very differently a few streets over, so a West End read is not a London read; (3) a revenue lift here is not a profit lift, the rent that buys the footfall takes much of it back.
  - Caveat body: figures are modeled from commuter + visitor intensity and local character, set against the city baseline; the shape (which trades lift / which get squeezed) is the useful part; read exact multiples as directional.
- **Thrives.**
  - Subject/leader: **Hotels** (atlas, "2x or more").
  - At the ceiling: **Restaurants, Cafes, Bars** ("2x or more", cocoa, no crown).
  - Suppressed ("less than half"): **Grocery** (~34%), **Doctors** (~30%), **Home cleaning** (~30%).
  - Caveat: four trades sit at the model ceiling, none crowned, Hotels carries the lead mark.
  - Decomposition (scoped to **restaurants in the West End**): Commuter pull **Moderate** (weekday office + shopping footfall); Tourism pull **Very high** (one of the busiest visitor zones in Europe); Character tags **Strong** (tourist, luxury, nightlife, transit combined); Total **2x or more** (clamped).
- **Who lives and shops here.**
  - Skew: "tourist-heavy, evening and weekend, and toward affluent shoppers."
  - What they spend on: pre-theatre set menus to late-night Soho institutions, the densest run of restaurants in the country, fierce competition for a table.
  - What already works: restaurants and bars, theatre, luxury and flagship retail, hotels, creative studios.
- **Cost to operate.**
  - Headline H2: "Rent runs about 2x or more versus the rest of London."
  - Mini bar: rent fills the full 0..2x track; baseline tick at 50% (1.0x); right cap "2x or more".
  - Caution: budget for the premium before the revenue lift talks you into the site; "a revenue lift is not a profit lift; the rent is the reason"; reads as a luxury area to operate in.
- **Versus next door (table).**
  - Columns: **West End** (self, column one, leader) · City of London · South Bank · West London.
  - Rep-trade row (Restaurants vs city): all four **2x or more** (West End leads).
  - Character row: West End **Tourist trade**; City of London **Office and finance**; South Bank **Tourist trade**; West London **Luxury and old money**.
- **Prime streets (cards).**
  - **Oxford Street** — Flagship and high-street retail; busiest shopping street in Europe by footfall; rent vs city **3x or more**, spend per visit **high**.
  - **Covent Garden** — Restaurants, theatre and tourists; pedestrianised draw; rent vs city **2x or more**, spend **high**.
  - **Regent Street** — Curved flagship boulevard; single-landlord stretch; rent vs city **3x or more**, spend **high**.
  - **Old Compton Street** — Soho food and nightlife; the spine of Soho's evening trade; rent vs city **2x or more**, spend **high**.
- **On the ground.**
  - Food scene: pre-theatre set menus to late-night Soho institutions; the densest concentration of restaurants in the country; fiercest competition for a table.
  - Don't miss: the crowd thins fast off the main parades; walk Soho's back streets after the theatres empty to see where locals actually eat once the visitors have gone.
- **Sibling rail.**
  - City of London — Office and finance; South Bank — Culture and riverside; West London — Luxury and old money; East London — Creative and regenerating; North London — Residential and media; South London — Residential and rising.
- **Collapse strip (shown for demonstration).**
  - Single row: **Street by street** — "Per-street character is not mapped yet" — "Not held yet" pill.
- **One thing to remember.**
  - "The West End rewards the trades that live off the crowd, hotels, restaurants, cafes and bars, but the rent that buys that crowd is why a revenue lift is not the same as a profit lift. One street off the main drag is often where the model actually works."
  - Freshness: **Modeled, June 2026** · "Something look off? Flag it".
- **Related.**
  - "All London neighbourhoods" (zoom out) · "London business overview" (the city itself) · "Compare two districts" (accent CTA).
- **Footer disclaimer (keep in the production `footer7`).**
  - "Lifts are modeled from the area's commuter and visitor intensity against the London baseline and are directional, not measured. No absolute money is shown at this altitude by design: a district reads only relative to its own city."

---

## Build notes carried from the lead-designer QA (so the implementer cannot regress)

1. **"+200% everywhere" is the biggest trap.** A district like the West End pins many trades to the ceiling. The rail-clamp ("2x or more" / "less than half") carried **verbatim from the view model** is the only thing standing between this page and six identical fabricated-looking "+200%" rows. Never compute and print a raw percentage anywhere on this page.
2. **No absolute money, by design.** State it at the gauge note, in the honest-take body, and in the footer. The absence must read as discipline, not a missing feature.
3. **Three tag roles, three weights, one accent** (price tier / economic tags / character word) — keep the differentiated pill treatment.
4. **No wall of dashes** on thin districts — one collapse strip, never per-section dashed cards.
5. **Typography discipline.** ONLY the district name (H1) and the one gauge hero figure are Newsreader; every label, percent, and body line is Inter with tabular figures (`.num`) and a ≥1.25 type step. Body measure 65–75ch on text beats. No flat scales.

The static-HTML deliverable precedent is `london-prototype-v1.html` / the existing `neighbourhood-west-end.html`: a single self-contained file, Newsreader + Inter via one Google Fonts link, the token map in `:root`, openable by double-click, legible at 1280 and 375 (bars and gauge keep label-over-bar stacking, the table scrolls within its own track, the pill row wraps).

Relevant files (absolute):
- Mockup precedent: `E:/atlas/neighbourhood-west-end.html`
- Locked section spec: `E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/06-neighbourhood.md`
- Chart + component grammar: `E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/01-component-and-chart-system.md`
