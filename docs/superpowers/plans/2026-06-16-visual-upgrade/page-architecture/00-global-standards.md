# Global standards (all page types)

> Authority note. This file is the site-wide standard for the visual-upgrade master plan. Where it conflicts with `00-ideology-and-design-law.md` or `01-component-and-chart-system.md`, **this file wins** — it carries the founder's 40 ratified design decisions, which downgrade the old "spacious / Stripe-calm" framing to an **information-rich, card-per-section, full-chrome almanac-grade SaaS** look. The honesty boundary (§4 of `00`) and the LOCKED section orders (§5 of `00`) are unchanged and still bind every page. The validated reference implementation is `E:\atlas\cell-london-restaurants.html`; its `:root`, type scale, and primitives are the proven baseline this file generalizes.

---

## 1. The visual thesis (updated)

### What we are now building
A **premium, information-rich commercial SaaS almanac**. The page should feel like an expensive, confidently-designed product that *also* rewards a reader who wants to stay and read. More per screen, in clear order, every block exquisite. Think of a high-craft research terminal or a Bloomberg-grade product page reskinned in warm paper: dense with real numbers, never a wall of mush.

The four ship questions from `00` §0 still gate every page:
1. Does it answer at a glance (one focal point, the answer first)?
2. Is it cringe / "AI made that"? Redo if yes.
3. Does the typography work (scale, hierarchy, rhythm, measure, tabular figures)?
4. Can it be quieter, cleaner, better? If yes, do that, then ask again.

### What changed vs the old framing (explicit, so nobody reverts)

| Dimension | OLD (00/01, now downgraded) | NEW (ratified, binding) |
| --- | --- | --- |
| Density target | "Spacious, calm, Stripe whitespace; less-dense by fewer-bigger sections" | **Information-rich, almanac-like, more per screen.** Pack more in, keep it readable. |
| Fix for sparseness | Whitespace + collapse unheld sections | **BOTH two-column section layouts AND more sections.** |
| Section container | Implicit / shared rhythm | **Every section in its OWN bordered card.** |
| Section internals | Mostly stacked | **Per-section choice: two-column (text+visual) OR stacked, whichever fits.** |
| Charts | Bespoke visx kit is the spine | **shadcnblocks CHART components throughout** (maximize the purchased library), honesty rules applied on top. |
| Chrome | Light nav, simple footer | **Full navbar (logo + dropdowns + search + CTA) and rich multi-column footer, site-wide.** |
| Shared assets | None specified | **World-map motif + one icon set + section dividers**, used universally. |

### What did NOT change (still law)
- **One focal point per screen.** Density is *information* density, not *visual-noise* density. Dense-to-the-point-of-unreadable fails the bar exactly as hard as sparse does.
- **Restrained color.** ONE terracotta accent. Moss = kept/positive only. Amber = caution only. Neutrals (cream / ink / cocoa) carry the mass. Never a second loud color.
- **The honesty boundary** (§4 of `00`): real / London-UK exemplar / clearly-tagged SAMPLE; never a fabricated-looking number; never a blank; long unheld runs collapse to ONE calm "still filling in" strip; cities are the only scored entity; a country never ranks its own cities; districts are never compared to whole cities; never badmouth an industry; consulting / PE are clients not subjects.
- **The LOCKED section orders** (§5 of `00`). We upgrade the look, not the information architecture.
- **No em-dashes. No source-agency names. No URL-slug renames. Tokens only (no raw hex / px / ms / font-name in components).**
- **Motion:** minimal, ease-out only, the shared `ds-slide-up` under `motion-safe`. No bounce, no decorative animation, no meteors / beams / sparkles / gradient-text / glassmorphism.

### The density reconciliation (how "rich" and "one focal point" coexist)
Richness is delivered by **more bordered section-cards in sequence** and by **two-column internal layouts** (a number/verdict beside its visual), NOT by cramming one card. Each card still has exactly one focal point. The page gets long and substantial; each screen stays legible. A reader skims the card headlines top to bottom and gets the whole story; a reader who stops on any card gets a complete, calm sub-answer.

---

## 2. The token system (`:root` map, type scale, figures)

### 2.1 The one token map (themes the whole shadcnblocks library)
Declared once — in `globals.css` for the app, in the mockup `:root` for static HTML — and the entire block + chart library inherits the warm look with zero per-block color edits. **Atlas raw tokens** (the source of truth, proven in the reference file):

```css
:root{
  /* paper + neutral mass */
  --cream-50:#ffffff; --cream-75:#fbfaf7; --cream-100:#f7f6f4; --cream-200:#efeeeb;
  --cream-300:#e4e2dd; --cream-400:#c3bfb7;
  /* warm near-black text ladder */
  --ink-500:#7d6c58; --ink-600:#5d4d3b; --ink-700:#463726; --ink-800:#2c2015; --ink-900:#211810;
  /* the ONE loud accent */
  --atlas-50:#fff1ee; --atlas-300:#fb8469; --atlas-500:#e62200; --atlas-600:#c11c00; --atlas-700:#991600;
  /* muted neutral / cost mass */
  --cocoa-300:#c3b39c; --cocoa-500:#87745d;
  /* kept / positive ONLY */
  --moss-300:#bcd96a; --moss-600:#5c781e; --moss-700:#4a6018;
  /* caution ONLY */
  --amber-300:#f5bd5c; --amber-600:#b06a08;
  /* destructive only */
  --clay-700:#5c1813;
  /* elevation */
  --shadow-subtle:0 1px 2px rgb(33 24 16 / .05), 0 2px 6px rgb(33 24 16 / .04);
  --shadow-card:0 1px 2px rgb(33 24 16 / .04), 0 14px 30px -18px rgb(33 24 16 / .20);
  --radius:1rem;
}
```

**The Atlas-to-shadcn semantic bridge** (this is what lets shadcnblocks blocks + shadcn charts inherit the brand). Map these once:

| shadcn var | Atlas token | hex |
| --- | --- | --- |
| `--background` | cream-75 | `#fbfaf7` |
| `--card` / `--popover` | cream-50 | `#ffffff` |
| `--foreground` / `--card-foreground` | ink-900 | `#211810` |
| `--muted` | cream-100 | `#f7f6f4` |
| `--muted-foreground` | ink-500 | `#7d6c58` |
| `--border` / `--input` | cream-300 | `#e4e2dd` |
| `--primary` | atlas-700 | `#991600` |
| `--primary-foreground` | cream-50 | `#ffffff` |
| `--accent` | atlas-50 | `#fff1ee` |
| `--accent-foreground` | atlas-700 | `#991600` |
| `--ring` | atlas-700 | `#991600` |
| `--secondary` | cream-100 | `#f7f6f4` |
| `--destructive` | clay-700 | `#5c1813` |
| `--chart-1` | atlas-500 `#e62200` | the subject / spotlight |
| `--chart-2` | moss-600 `#5c781e` | kept / positive |
| `--chart-3` | cocoa-500 `#87745d` | cost mass |
| `--chart-4` | ink-500 `#7d6c58` | neutral data |
| `--chart-5` | amber-600 `#b06a08` | caution |
| `--radius` | radius.lg | `1rem` |

**Chart-color discipline (load-bearing, honesty rule):** `--chart-1` is reserved for the *subject* being explained; `--chart-2` is reserved for the owner-kept / positive slice; `--chart-3/4` carry cost mass and neutral peers; `--chart-5` is caution only. A chart never assigns the loud `--chart-1` to a peer or a rival, because that would read as "this one wins" across geographies. Cost slices never get moss; kept slices never get cocoa.

### 2.2 Fonts
- `--font-display` = **Newsreader** (`opsz,wght 6..72, 400;500;600`) — page headline, section headlines (`h2`), and the single hero number per page only.
- `--font-sans` = **Inter** (`400;500;600;700`) — everything else: body, labels, eyebrows, table figures, captions.
- Static mockups load both via one Google Fonts link:
  `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap`

### 2.3 Type scale (proven steps; every step ≥ 1.25 ratio, no flat scale)
| Token / role | Family | Size | Weight / details |
| --- | --- | --- | --- |
| Page H1 (masthead) | Newsreader | `clamp(30px,4.2vw,46px)` | 500, line-height 1.08, letter-spacing −.015em, max 18ch |
| Hero number (one per page) | Newsreader | `clamp(56px,9vw,92px)` | 500, line-height .92, color atlas-700, letter-spacing −.02em |
| Section H2 | Newsreader | `clamp(26px,3.2vw,36px)` | 500, line-height 1.12, letter-spacing −.01em |
| Accent-panel verdict | Newsreader | `clamp(20px,2.6vw,28px)` | 500, line-height 1.25, max 26ch |
| Secondary big number (tile/unit/result) | Newsreader | 28–30px | 500 |
| Lead paragraph | Inter | 18px | 400, ink-600, max 60ch |
| Narrative / long body | Inter | 18px | 400, ink-600, line-height 1.7, measure **65–75ch** |
| Body / row label | Inter | 14–15px | 400/500, ink-700 |
| Caption / caveat / footnote | Inter | 12–13px | 400, ink-500 |
| Eyebrow (kicker) | Inter | 12px | 700, letter-spacing .16em, UPPERCASE, atlas-700 |
| Column / tile label | Inter | 12px | 500, letter-spacing .04em, UPPERCASE, ink-500 |

Base body line-height 1.55. Long-form measure is **65–75ch**; data-row labels are short.

### 2.4 Tabular figures (mandatory on every number)
Every numeral the reader compares or scans aligns. Apply `font-variant-numeric: tabular-nums lining-nums` via a `.num` utility on every figure — hero numbers, tiles, table cells, chart labels, legends, axis ticks, percentages, currency. Non-negotiable: columns of numbers must align by digit. (The reference file's `.num` class is the pattern.)

---

## 3. The frame: card-per-section + per-section layout + hierarchy/density

### 3.1 Card-per-section frame (ratified)
Every section sits in its **own bordered card**. The card is the unit of rhythm.

- Card surface: `--card` (`cream-50`) on the `--background` (`cream-75`) page, so cards lift gently off the paper.
- Border: `1px solid --border` (`cream-300`); radius `--radius` (1rem / use 14–18px on inner sub-cards).
- Elevation: `--shadow-subtle` for resting cards; `--shadow-card` only for the masthead hero figure and interactive/raised cards (calculator). Most cards rest flat-to-subtle so the page doesn't read as a deck of floating tiles.
- Internal padding: generous and **rhythm-varied** — roughly 28–52px vertical, 24–32px horizontal at desktop; tighten proportionally below 560px. Padding is *not* uniform across all cards; vary it so the page breathes between dense and airy cards.
- Between cards: a 1px `--border` rule or a clear gap (see §5 dividers). Adjacent cards must never visually merge.
- Masthead is the one full-bleed exception: a warm `linear-gradient(to bottom, atlas-50, cream-75)` band with a bottom hairline, carrying H1 + hero number + range strip + scorecard tiles.

### 3.2 Per-section internal layout (two-column OR stacked, chosen per section)
Pick the layout that serves the section's single focal point. Two patterns:

- **Two-column (text + visual):** a left rail with eyebrow + H2 + lead/verdict, a right (or wider) column with the chart/figure. Use when a number or chart wants a verbal frame beside it (money split, break-even, score-and-explain, wages, owner-keeps). This is the primary lever for *information richness* — it packs a verdict and its evidence into one screen without crowding.
- **Stacked:** eyebrow + H2 + lead across the top, the visual full-width below. Use for wide visuals that need the horizontal room (seasonality area, timeline ribbon, like-for-like rows, waterfall, risk ladder) or for short narrative cards.

Default desktop grid for two-column: a `[text 5fr | visual 7fr]` or `[text 320–360px | visual 1fr]` split with a 32–48px gutter. **All two-column layouts collapse to a single stacked column at ≤768px**, text first.

### 3.3 Visual-hierarchy + density rules
- **One focal point per card.** The biggest type or the loudest accent in a card is the answer; everything else supports it. Two competing focal points in one card = redo.
- **Answer-first ordering** inside every card: verdict / number first, mechanism / chart second, caveat / footnote last.
- **Eyebrow → headline → lead → visual → footnote** is the standing internal vertical grammar.
- **Rich, not crammed:** more cards and two-column packing deliver density; within a card, whitespace and a clear measure keep it legible. The page may be long; no single card may be a wall.
- **Section rhythm varies:** alternate dense two-column data cards with airier stacked narrative/quote cards so the eye gets relief. Never run six identical card grids in a row (banned in `00` §2).
- **Accent budget per card:** terracotta appears once or twice per card (the focal number, one marker/tick, or one CTA), never as a field of red. Moss only on the kept slice; amber only on a caution marker.
- **375px floor:** legible with NO horizontal scroll; 44px tap targets; WCAG AA contrast; visible focus rings (`2px solid atlas-700`, offset 2px); real empty / loading / error states.

---

## 4. Full chrome: navbar + footer (site-wide)

### 4.1 Full navbar (built from shadcnblocks `navbar1`, Navbar category)
Sticky, site-wide, on every page type. Structure:

- **Left:** logo lockup — "Margin **Atlas**" in Newsreader, the word "Atlas" in atlas-700 600-weight (the reference `.mark` shape).
- **Center:** primary nav with **topic dropdown menus** (shadcn `navigation-menu`): **Countries**, **Industries**, **Cities**, **Compare**. Each is a dropdown panel listing top entities + an "all" link. Compare may open a two-slot picker.
- **Search:** an inline search affordance (input or a search-icon button that expands) for jumping to a country / city / industry / cell.
- **Right:** ONE primary CTA (the dark `btn-dark` "Get the data" pill, or "Start free"). Exactly one CTA; no competing buttons.
- **Mobile:** the dropdowns + search + CTA collapse into a `sheet` (hamburger at ≤820px), built into `navbar1`. The hamburger is a 44×44 tap target.
- **Skin:** `background: rgba(cream-75, .86)` with `backdrop-filter: blur(8px)`, bottom hairline `rgba(cream-300,.7)`, sticky `top:0`. Links ink-600 → atlas-700 on hover.

### 4.2 Rich multi-column footer (built from shadcnblocks `footer7`, Footer category)
Site-wide, ink-900 ground (the reference footer). Structure:

- **Brand column (widest, ~1.4fr):** logo lockup (atlas-300 accent on dark) + one-line product blurb ("What a business really earns, and what the owner keeps, place by place.").
- **Link columns (3+):** **Explore** (Countries / Cities / Industries / Compare), **Product** (Pricing / The data / Methodology), **Company** (About / Blog / Contact). Add **Legal/Resources** as a fourth column as content grows.
- **Newsletter block:** a short email capture ("Get new places as we add them") with one input + one button, honesty-safe copy.
- **Legal strip:** a bottom rule + small-print line carrying the exemplar/modeled caveat and copyright.
- **Skin:** desktop grid `1.4fr 1fr 1fr 1fr`, collapsing to `1fr 1fr` ≤760px and `1fr` ≤460px. Column headers 12px .1em uppercase cream-400; links cream-300 → cream-50 on hover.

### 4.3 Block-reuse principle
Everything is based on shadcnblocks blocks and reused as much as possible. Marketing slugs are `word+number` (`navbar1`, `footer7`, `hero2`, `feature43`, `pricing2`, `cta10`); app slugs are hyphenated (`chart-card1`, `data-table1`, `stats-card1`). Always confirm a slug from its category page before fetch (concatenated/guessed slugs 404). Lift any hardcoded content (`compare1`, `testimonial14`, `stats5`) to props and **scrub it for the honesty rules** before use.

---

## 5. Shared universal assets

Three site-wide assets give every page type one identity. All are coded/token-driven (no per-instance hand-art), all use only the token palette.

### 5.1 The stylized world-map motif
A faint, abstract dotted/graticule world-map (or simplified continent silhouettes) in cream-200/cocoa-300 at low opacity.
- **Where:** as the *subtle premium backdrop* (shadcnblocks Background `pattern52`) behind the **home hero** and the **Compare** picker; as a small locator glyph in **country/city mastheads**; as the empty-state texture behind the "still filling in" strip. Used **sparingly** — it is texture, never foreground, and never competes with a chart.
- **Honesty:** decorative only. It never encodes data (no choropleth shading that implies a measured world value), so it can never imply a fabricated cross-geography number.

### 5.2 The consistent icon set
One line-icon family (lucide-react in app; matching inline SVGs in mockups), 1.8–2px stroke, round caps/joins, 22px default in a 44px rounded atlas-50 chip (the reference `.unit .ico` pattern).
- **Where:** plain-terms unit cards, methodology/feature grids, footer social, nav dropdown item glyphs, risk/severity affordances.
- **Rule:** one family only; never mix icon styles; icons clarify, never decorate. Color is ink/atlas per role, never a second hue.

### 5.3 Section dividers
The boundary between section-cards.
- **Primary divider:** a `1px solid --border` (cream-300) hairline between stacked cards (the reference `section.block + section.block` rule), or a clear gap when cards are visually separated tiles.
- **Accent divider (sparing):** a short atlas-600 tick / eyebrow kicker introduces a new movement of the page (e.g., the shift from "the answer" to "the mechanics"). Used 1–2 times per page, not between every card.
- **Collapse-strip divider:** the calm `cream-100` "still filling in" strip (the reference `.strip`) is itself the divider that absorbs all unheld sections into one block.

---

## 6. Chart library mapping (shadcnblocks charts + honesty rule per statistic)

We use **shadcnblocks CHART components throughout** to maximize the purchased library, and apply the honesty rules ON TOP. shadcnblocks charts are Recharts-based and inherit `--chart-1..5` from §2.1, so the warm palette and the subject/kept/cost color discipline come for free. Each statistic type below names the shadcnblocks chart/block it is built from, the geometry note, and the honesty rule layered on.

> Geometry rule for all of these: **the chart computes its own geometry from the data** (Recharts scales, or computed CSS percentages in static mockups). No eyeballed bar widths, no hand-fudged tick positions. See §7.

| Statistic | shadcnblocks chart / block it is built from | Honesty rule applied on top |
| --- | --- | --- |
| **Spread / distribution** (revenue range) | `chart-card1` shell wrapping a **horizontal bar/range** with a marker reference line for "typical" (Recharts `ReferenceLine`); the signature site-wide RangeStrip shape | Show low–typical–high; mark the typical with the lone atlas tick. Tag whether the spread is real or modeled. Never imply a precision the data lacks. |
| **Money donut** (per-$100 split / owner-keeps) | shadcnblocks **stacked bar** in `chart-card1` (100%-wide stacked) **— prefer the stacked bar over an actual donut**; if a ring is used it is a single owner-keeps radial for a hero moment only | NEVER a multi-slice pie that hides the kept slice. The owner-kept slice is `--chart-2` (moss) and is always labeled; cost mass is cocoa/ink. The kept slice is the focal point. |
| **Threshold gauge** (break-even) | shadcnblocks **gauge / progress** block, or a 2-segment stacked bar in `chart-card1` with a reference marker | amber below the line, moss above, a lone atlas tick at break-even plus a neutral ink tick at "typical day". Label both ticks. Never claim a measured break-even where it is modeled. |
| **Range rows** (wages by role / pay) | shadcnblocks **`data-table1`** for the numbers, paired with a compact **dumbbell/floating-range row** (a bar chart with a min/median/max marker) on one shared scale | All roles on ONE shared scale so a senior role's bar is honestly longer; median marked with the atlas dot. Tag "illustrative London exemplar" where exemplar. Never normalize bars to hide the real gap. |
| **Gradient area** (seasonality) | shadcnblocks **area chart** (`chart-area-gradient` shape): single atlas series, gradient fill atlas-500 .28→.02, stripped axes, direct "busiest/quietest" labels | One series only; relative shape, not absolute claims. Direct-label the peak/trough rather than a busy axis. Modeled monthly pattern tagged as directional. |
| **Timeline ribbon** (first year) | shadcnblocks **timeline / stepper** block (horizontal node row on a hairline) | Nodes are phases, not precise dates; the break-even node is the lone atlas emphasis. Survival/attrition figures stated as ranges ("about 30 in 100"), never false precision. |
| **Severity ladder** (risks / what to watch) | shadcnblocks **feature/list** block rows, each with a 3-bar severity glyph (serious=atlas, watch=amber, rare=cocoa) | Severity is a calibrated 3-level glyph, not invented stars. Never badmouth an industry; frame risks as operating realities, neutral tone. |
| **Ranked bars** (cost drivers) | shadcnblocks **`chart-card1`** horizontal bar, sorted descending | Bars share one scale; longest = biggest cost (cocoa mass), not the accent. The accent is reserved for the subject/answer, so ranked *cost* bars stay cocoa, avoiding a "this is good" read. |
| **Score band** (how-hard-to-break-in / climate, versus-the-world) | shadcnblocks **gauge / single-bar** block with a subject marker and a peer reference tick | ONE grammar site-wide: one track, atlas subject marker, an ink peer/global-median tick. **Cities are the only scored entity; a country never scores its own cities; districts never compared to whole cities.** Versus-the-world collapses to the calm strip until a real worldwide read is held. |
| **Multiplier gauge** (relative cost / "Xx vs national") | shadcnblocks **radial / gauge** block | A single multiplier vs a stated, like-for-like baseline; baseline always named. Never a cross-currency or cross-geography multiplier presented as a ranking. |
| **Flow diagram** (revenue → costs → kept; methodology flow) | shadcnblocks **waterfall / stepped-bar** (descending steps) + a companion 100%-stacked bar | The waterfall steps each cost down to the moss kept slice; the kept slice is the destination and the focal point. Never a flow that loses the empty/unheld state. |
| **Margin table** (the numbers, peers, like-for-like) | shadcnblocks **`data-table1`** (TanStack) | Like-for-like only (same trade, same currency, comparable places); a leading caveat that it is "not a league table"; subject row highlighted in atlas, peers neutral. NEVER rank across business × geography. |

**Three honesty rails that bind every chart, regardless of type:**
1. **Subject-only spotlight:** `--chart-1` (atlas) is only ever the subject being explained; a peer/rival never gets it.
2. **Empty/unheld is a first-class state:** if data is insufficient, the chart returns nothing and the section folds into the calm "still filling in" strip — never a fabricated-looking number, never a blank rectangle.
3. **Cross-currency / cross-geography caveat travels with the chart:** any comparison across places carries the "read each on its own terms, not a league table" caveat in-card.

> Note on the existing visx kit: it already encodes these rails (one accent, no pie, cross-currency caveat, direct labels, tabular numerals, filled+empty states, server-renderable). Where a shadcnblocks chart cannot meet a rail (e.g., it would draw a pie or crown a cross-currency leader), the kit primitive is kept and reskinned to the shadcnblocks visual grade rather than replaced. The honesty rail always wins over library convenience.

---

## 7. Correctness methodology (computed geometry, no eyeballed SVG)

Every visual is **derived from the data, not drawn by eye**. A number on the page and its bar/marker must agree to the pixel.

1. **Compute, never eyeball.** Every bar width, segment width, marker offset, tick position, and SVG path coordinate is *calculated* from the underlying values. In the app, Recharts/visx scales do this. In static mockups, percentages are computed: `left = (value − min) / (max − min) × 100%`, segment widths sum to exactly 100%, a `$48K of $503K` kept slice is `48/503 = 9.5%` wide, not "about a tenth." (The reference file's range marker at `38.44%` and waterfall steps are computed this way.)
2. **One scale per comparison.** All bars in a ranked set, all roles in a wage chart, all peers in a like-for-like set share a single min/max domain. Never per-row autoscaling that visually equalizes unequal values.
3. **Labels match geometry.** The printed number, the bar length, and the axis tick are the same value. If they can't be reconciled, the data is wrong — fix the data, not the drawing.
4. **Tabular figures everywhere** (`tabular-nums lining-nums`) so computed columns actually align.
5. **SVG uses computed coordinates + `vector-effect:non-scaling-stroke`** so responsive scaling never distorts line weight or geometry (the reference seasonality path pattern).
6. **Rounding is honest and consistent:** round display values, but compute geometry from the unrounded number so a "10%" slice and a "$10 of $100" bar are the same width.
7. **Verify before ship:** spot-check that each chart's largest/smallest element corresponds to the largest/smallest datum, that stacked segments sum to the total, and that the subject is the only element in the accent color. Run the page through the four ship questions (§1) and the 375px / AA / focus / empty-state checks.
```

Reference files (all absolute):
- Source design law: `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\00-ideology-and-design-law.md`
- Source component/chart system: `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\01-component-and-chart-system.md`
- Validated reference implementation (token map, type scale, primitives, 16-section composition): `E:\atlas\cell-london-restaurants.html`

Note for the master-plan owner: the founder's 40 ratified decisions genuinely conflict with `00` §1 (which still says "spacious / Stripe-calm / explicitly NOT almanac density") and `01` §5 (which says keep the visx kit, do not use generic Recharts). The standards file above resolves both conflicts in favor of the ratified decisions (information-rich; shadcnblocks charts throughout) while preserving the honesty rails via the per-chart honesty column in §6 and the "kit kept only where a shadcnblocks chart would break a rail" carve-out. If you want `00`/`01` themselves amended to match, that is a separate edit — I did not modify those source files.
