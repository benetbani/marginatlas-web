# Screenshot / Visual Read — design-export audit (2026-06-12)

What the founder's design-tool exports ACTUALLY look like, read render-by-render against
the brand (`docs/brand/brand-identity.md`). The brand is the single source of truth; the
exports are raw material. This audit names what is excellent and on-brand (adopt), and what
is off-brand or unfinished (discard or rework).

Source sets read: `docs/brand/assets/incoming/Margin-Atlas--5/screenshots/` (most complete)
and `Margin-Atlas--20/screenshots/` (an earlier subset of the same renders; set 5 supersedes
it). Curated sample below, ~14 renders chosen to cover every page type plus the design canvas.

---

## The verdict in one breath

The exports are, on the whole, strikingly on-brand. They land the almanac feeling the brand
asks for: warm cream paper, near-black ink, a single disciplined vermillion accent, a real
editorial serif carrying display and the headline numbers, a clean humanist sans for body and
dense figures, and a genuine cartographic through-line (engraved neighborhood maps, fine rules,
coordinate-style labels, a paper-pattern library). This is "editorial magazine with cartographic
heritage" rendered, not described. The strongest assets (the cell hero, the dataviz grammar, the
spot illustrations, the cost-structure table, the neighborhood map) are good enough to build from
almost directly. The main risks are not aesthetic but disciplinary: a couple of renders flirt with
the multi-hue gradient and one near-decorative globe the brand explicitly warns against, and a few
unfinished/blank frames in the set should not be mistaken for finished design.

---

## A. The cell / business page (the core)

Renders read: `01-cell-page.png`, `cell-hero-canvas.png`, `03-cell-page.png`, `04-cell-page.png`,
`01-dv-interact.png`, `mobile-overlays.png`.

**Hierarchy & density.** This is the export's best work. The cell hero (`01-cell-page.png`,
`cell-hero-canvas.png`) opens with a quiet eyebrow row (FOOD & DRINK · MADRID · SPAIN) and an
honest ESTIMATED pill top-right, then a large serif question headline ("How much does a restaurant
make in Madrid?"), an italic "Includes: cafes, bistros, fast food..." line, and the headline number
treated as the page's anchor: `$387K a year`, serif, tabular, sized to dominate with the `$` sign
and `K` suffix kept small so the digits carry. To its right a horizontal spread bar (BOTTOM 10% /
TYPICAL / TOP 10%, `$97K / $387K / $1.32M`) shows the distribution rather than a single number,
exactly the "always show the spread" rule. Below, a thin secondary stat row (4 employees · $32K
median wage · 12% net margin · 77/100 Atlas Score) carries supporting facts without competing.
This matches the content map's "above the fold: the bottom line plus one or two key numbers,
nothing else" almost line for line.

**The eyebrow / disclosure pattern is genuinely excellent** and should become a repo primitive:
category icon + place + country, paired with the measured-vs-estimated marker, gives every page an
honest provenance signal in the calmest possible way.

**Cost structure (`03-cell-page.png`).** A horizontal stacked bar in graduated vermillion-to-cocoa
tints sits above a ruled line-item table (LINE ITEM / SHARE / AMOUNT / NOTES). Net profit is the
single row pulled into vermillion text. This is the dataviz grammar applied: ink and cocoa for
structure and cost, vermillion reserved to mark the one number that matters (what is kept). The
"where the money goes" framing ("for every $100 of revenue...") from the content map is present.
The table is dense but calm, organized rather than minimal: the right instinct for these pages.

**Wages by role (`03-cell-page.png` lower, `04-cell-page.png` top).** Each role gets a small
range track with a median tick, then a median figure and a share percent. The track uses the same
parchment-rail + amber-fill language as the spread bar, so distribution reads consistently across
the whole page. Strong.

**Similar businesses (`04-cell-page.png`).** A 3-up card grid (SAME CITY / SAME INDUSTRY, each
tagged MEASURED / ESTIMATED / REGIONAL) with TYPICAL / MARGIN / FIRMS columns. Clean, like-for-like,
honestly labeled. Vermillion is used only for the typical-revenue figure; everything else is ink.

**Sub-type switcher (`01-dv-interact.png`).** The signature feature is realized as a quiet
segmented pill (Dine-in / Takeaway / Delivery) that re-renders the readout below (`$312k` / `16%` /
`$17 kept per $100`) with a "How it reads:" one-liner. Restrained, same chrome different reality:
exactly the brand's "quiet, precise, like turning a page" motion intent.

**Mobile (`mobile-overlays.png`).** Two phone frames (default state; long-breadcrumb + expanded
waterfall). The serif headline and the big serif `$387K` survive the narrow column beautifully.
The three-up BOTTOM/TYPICAL/TOP tiles stack into compact chips; the waterfall becomes a labeled
horizontal-bar list (Total revenue 100% $387K, Food and beverage 28%...) with a collapsing
breadcrumb ("Home > ... > Restaurants"). Mobile is treated as a first-class layout, not an
afterthought, which matches the standing mobile-emphasis constraint.

**On-brand, adopt:** the whole hero pattern, the spread bar, the eyebrow+provenance pill, the
cost-structure stacked-bar-over-table, the wage range tracks, the sub-type pill, the mobile
waterfall list.
**Watch:** the cost-structure stacked bar is the one place the multi-stop amber-to-cocoa gradient
appears at size. It works here because each stop maps to a named line item (it encodes data, not
decoration), but it must never leak into backgrounds or hero fills.

---

## B. The design canvas (dataviz grammar, icons, illustration, patterns)

This is where the export proves the brand is a real system, not a mood.

**Dataviz language — `01-dv-top.png` ("Seven ways the Atlas shows a number").** A single page
codifies the charting grammar: a swatch legend assigns fixed jobs to each colour — Vermillion =
typical / spotlight / you-are-here; Moss = profit / kept / positive; Cocoa = structure & costs;
Ink tints = neutral mass; and serif tabular figures for every value. This is the most important
asset in the set: it is the discipline that keeps colour meaningful ("accents MARK MEANING, never
decorate") written down as a usable spec. The repo's `design-tokens.ts` should encode these exact
semantic roles. Excellent.

**Icons — `icons-top.png`, `icons-g1.png`.** A single fine-line family, one consistent weight,
small soft-peach rounded-square containers. Seen in real context (`icons-top.png`): data rows
(monthly revenue, owner keeps, break-even, startup cost, staff on payroll, seasonality, spread,
risk), an action bar (Search / Compare / Calculator / Methodology / Flag / Watch / Save cell, the
last as a filled vermillion button), and editorial section markers (the honest take = an eye;
worked example = a pencil; operator voices = a speech glyph). `icons-g1.png` shows the
"Money & performance" reference grid with machine-name labels (startup-cost, owner-keeps, revenue,
range, cost-breakdown, wages, break-even, seasonality). Consistent, legible, dignified, not a
generic tech-icon set. Strong adopt.

**Spot illustrations — `spots-1.png`.** Editorial line-art with restrained peach/terracotta fills
and a moss accent: a coffee cup over a note (the honest take), four audience-role avatars, a
neighborhood street, a graticule globe with a dashed route, a suitcase-with-flag journey, a
special-zone building with a `%` flag. This is the "editorial ILLUSTRATION for abstract ideas"
the brand calls for, drawn with care, not stock. Adopt; these map cleanly to the recurring
content moves (the honest take, audience roles, vs-the-world).

**Paper pattern library — `pattern-lib-top.png` ("Twenty surfaces, one palette").** Tileable
texture surfaces (gravel dot-grid, rasp diagonal hatch, and more) built only from the locked
palette plus lighter mixes, each labeled with a machine name (pv-gravel, pv-rasp) and a use-case
caption. This is the "whisper of paper/engraving texture on a fundamentally clean surface" device
made reusable. The textures are faint and tasteful. Adopt, but use sparingly: one quiet surface
per band at most, never stacked.

---

## C. Country, city, neighborhood

**Neighborhood map — `london-v3.png`, `london-v2-full.png`, `london-v3-bottom.png`.** The
cartographic through-line at its most literal and most successful: an engraved-style London street
plan, fine grey block-fill stipple, hand-weight road lines, a heavier ink river, and district names
(MARYLEBONE, MAYFAIR, SOHO, BELGRAVIA...) set in vermillion small-caps as the only colour. It looks
like a plate torn from a field almanac. This single component does more to establish "any Atlas page
is recognizable at a glance" than anything else in the set. Strong adopt as the city/neighborhood
signature. (Note these are the map COMPONENT in isolation, not a full city page; the full city
masthead/board is not in this curated frame — `london-v2-check.png` and the `reform-01.png` /
`maptest.png` frames carry the rest and are worth a second pass when building that page.)

**Comparison / cell-list — `comp-1.png`.** Two core tables. The cell-list ("every measured trade in
a place, sortable, with markers and score"): icon + trade + operator-count, TYPICAL REVENUE /
MARGIN / STARTUP / MARKERS / SCORE, with small pill markers (Very high rev, Fat margin,
Licence-gated, Recession-proof, Seasonal) in muted peach/moss. The comparison table ("up to three
places, the leader per row takes the vermillion cell"): Dubai / Jeddah / Doha column heads with the
winning cell tinted vermillion. This is the honest like-for-like comparison rule expressed visually:
one accent marks the leader, nothing else shouts. Adopt both.

---

## D. Editorial / blog

**Blog covers — `blog-covers-v1.png` ("Three pieces, three cities").** Cover cards rendered as
line-drawn scenes (a Tokyo sushi counter, a Paris jewelry window "JOAILLERIE", a rainy New York
taxi) with a small vermillion READ kicker and a serif title. They carry the documentary-dignity
intent (real trades, drawn with respect, no stock-y gloss) into editorial. Charming and on-brand.
Caveat: the captions in this particular render overlap the artwork (a layout/z-index bug in the
export), so treat the composition as a direction, not a finished layout.

---

## E. Off-brand / unfinished — discard or rework

1. **The engraved world globe** (`01-dv-interact.png` section 07, `spots-1.png` globe). The export
   itself labels it "the house ornament... decorative, never a real data layer." Fine as a rare
   masthead ornament; it must never masquerade as data and must not become a recurring hero. Use
   with restraint or not at all.
2. **Gradient discipline.** The amber-to-cocoa multi-stop gradient is correct only where each stop
   encodes a named value (cost-structure bar, spread rail). Keep it out of backgrounds, buttons,
   and hero fills. The brand wants a calm canvas where accents mark meaning.
3. **Blank / placeholder frames.** `comparison.png` is essentially an empty graph-paper grid;
   several `Margin-Atlas--20` frames are byte-identical earlier copies of set-5 renders. These are
   scaffolding, not design — do not port them or read intent into them.
4. **Overlapping text in `blog-covers-v1.png`** (noted above) — a render bug, not a style choice.
5. **Em-dashes appear throughout the export copy** (e.g. "the typical, the spotlight — you-are-here",
   "what's kept"). The exports are design comps, but any copy lifted from them into source must be
   de-dashed to satisfy the standing em-dash ban.

---

## F. What to lift first (build priority)

1. Lock the dataviz semantic colour roles (`01-dv-top.png`) into `design-tokens.ts` — this is the
   discipline everything else depends on.
2. Build the cell hero pattern (eyebrow + provenance pill + serif headline + dominant serif number +
   spread bar + thin stat row) as the flagship business-page component.
3. Adopt the cost-structure (stacked-bar-over-ruled-table) and wage-range-track components.
4. Adopt the icon family + the action bar (Save cell as the lone filled vermillion control).
5. Make the engraved neighborhood map the city/neighborhood signature.
6. Bring in the spot illustrations and the paper-pattern surfaces, used sparingly.

---

## Summary (5 lines)

1. The exports nail the brand: warm cream + ink + a single disciplined vermillion, a real editorial
   serif on display and headline numbers, and a genuine cartographic through-line — almanac, not mood.
2. Strongest assets are the cell hero (serif headline + dominant tabular number + spread bar +
   honest provenance pill), the "seven ways to show a number" dataviz grammar, and the engraved
   neighborhood map; these are near build-ready.
3. The system is real: one fine-line icon family, editorial spot illustrations, a labeled
   paper-pattern surface library, and like-for-like tables where one vermillion cell marks the leader.
4. Mobile is treated as first-class (serif headline and big number survive the narrow column; the
   waterfall becomes a clean labeled bar list), matching the standing mobile emphasis.
5. Risks are disciplinary, not aesthetic: keep the multi-stop gradient to data-encoding only, treat
   the decorative globe and the blank/duplicate frames as non-gospel, and de-dash any copy lifted
   into source.

**Three best screenshots:** `cell-hero-canvas.png`, `01-dv-top.png`, `london-v3.png`.
