# 06 — Ground Truth (the literal current state)

Extracted verbatim from the codebase on 2026-06-16. Every value here is quoted
from a real file; nothing is invented. When this doc and the source disagree,
the source wins and this doc is corrected. Sources:
`src/lib/design-tokens.ts`, `docs/brand/cohesion-master-plan.md`,
`docs/brand/section-constitution.md`, `docs/brand/design-system.md`,
`docs/superpowers/specs/2026-06-16-london-uk-section-architecture.md`,
`src/lib/page-sections.ts`, `src/lib/cells/cell_view.ts`,
`docs/verification-protocol.md`, `CLAUDE.md`.

---

## 1. The exact current token palette + fonts

Source of truth: `src/lib/design-tokens.ts` (Warm Atlas reformation 2026-06-04;
SaaS reformation 2026-06-12). All hex lowercase. The token file is the value
authority; `tailwind.config.ts` imports from it; components never type hex/px/ms.

### Palette families (full ramps as written)

**atlas** — terracotta / vivid-red brand accent (the only loud color; base `#e62200`)
- `50 #fff1ee` · `100 #ffd9d0` · `200 #ffb3a3` · `300 #fb8469` · `400 #f24e2f`
- `500 #e62200` (primary accent, surfaces, vivid red) · `600 #c11c00` (hover/pressed)
- `700 #991600` (primary accent text + headline) · `800 #701000` · `900 #4a0a00`

**cream** — warm paper ladder
- `50 #ffffff` (warm white card/popover) · `75 #fbfaf7` (warm app ground, page surface behind cards)
- `100 #f7f6f4` (warm sand muted surface) · `200 #efeeeb` · `300 #e4e2dd` (warm taupe hairline)
- `400 #c3bfb7` · `500 #8d887e`

**ink** — warm brown-black text ladder
- `50 #faf4ec` · `100 #f0e7d9` · `200 #e4d8c5` (warm border) · `300 #cbb79c`
- `500 #7d6c58` (muted) · `600 #5d4d3b` · `700 #463726` (secondary) · `800 #2c2015`
- `900 #211810` (headlines, warm near-black)

**cocoa** — text-alias family / "structure and costs" data color
- `50 #faf4ec` · `100 #f0e7d9` · `300 #c3b39c` · `500 #87745d` · `700 #534231` · `900 #221910`

**moss** — positive delta / kept / profit (the ONLY secondary accent)
- `50 #f6fbe8` · `100 #e9f6c8` · `200 #d2e899` · `300 #bcd96a` · `400 #96b448`
- `500 #6f8f25` · `600 #5c781e` · `700 #4a6018` · `900 #222e09`

**clay** — destructive / strong-danger (deep maroon, distinct from brand red)
- `50 #fbeae8` · `100 #f3c9c4` · `200 #e29c93` · `300 #cf6c5f` · `400 #b3463a`
- `500 #8c2b22` · `600 #73211a` · `700 #5c1813` · `800 #421009` · `900 #2b0a05`

**amber** — warnings / caution / soft-danger
- `50 #fff8eb` · `100 #fdecc8` · `200 #fad79a` · `300 #f5bd5c` · `400 #eda12f`
- `500 #d4860f` · `600 #b06a08` · `700 #8a510a` · `800 #653a0c` · `900 #3f2408`

**teal** — single muted-sage cool counterweight (use under 5% of surface)
- `50 #eef5f0` · `500 #4d7c64` · `600 #3d6650` · `700 #345a47`

**Standalone tokens**
- `parchment #e4e2dd` (= cream-300, warm taupe border)
- `graphite #463726` (= ink-700, warm secondary text)

**Semantic scales (never re-invent)**
- `tier` (data-confidence; reuses atlas + cocoa): `deep #991600` (=atlas-700, measured),
  `good #e62200` (=atlas-500, regional), `starter #fb8469` (=atlas-300, thin),
  `modeled #87745d` (=cocoa-500, estimated). Retires the old blue/green dots.
- `delta`: `positive #4a6018` (=moss-700, above par), `atpar #463726` (=ink-700, neutral, NOT brand-red),
  `caution #b06a08` (=amber-600, watch), `negative #8a510a` (=amber-700, below par = warning, not brand-red).

**Banned:** cyan / aquamarine (reserved for founder's other product); blue retired everywhere.

### Semantic aliases (`semanticColors`)
- `background` = cream-75 · `foreground` = ink-900 · `card` = cream-50 · `cardForeground` = ink-900
- `primary` = atlas-700 · `primaryForeground` = cream-50 · `border` = cream-300 · `ring` = atlas-700
- `success` = moss-700 / surface moss-100 · `danger` = clay-700 / surface clay-100
- `warning` = amber-700 / surface amber-100 · `muted` = ink-500 / mutedSurface cream-100

### Fonts (`fontFamily`)
- **sans** (default): `var(--font-sans)`, Inter, system fallbacks. All body, UI, every numeral outside the masthead anchor; data numerals `tabular-nums`.
- **serif / display** (same slot): `var(--font-display)`, Georgia fallback. Interim face = **Newsreader** (FACE NOT FINAL; founder re-evaluating, the cohesion plan names Fraunces as the candidate). Reserved for H1/H2/H3, the single masthead anchor number, pull-quotes, wordmark, the italic unit suffix. Never below 20px. No component may hardcode a font name; everything binds to the slot.

### Other scales (documented in the token file)
- `fontSize`: xs 12/16 · sm 14/20 · base 16/24 · lg 18/28 · xl 20/28 · 2xl 24/32 · 3xl 30/36 · 4xl 36/40 · 5xl 48/1 · 6xl 60/1
- `sectionSpacing`: tight 1rem · base 1.5rem · loose 2rem · hero 3rem · band 4rem
- `radius`: sm 8px · md 12px · lg 16px (default card) · xl 20px · 2xl 24px · full 9999px (all buttons)
- `elevation` (warm ink-tinted two-layer): flat · subtle · card (workhorse) · lift (hover) · modal
- `duration`: instant 0 · fast 150 · base 200 · slow 300 · deliberate 400 (hard ceiling 450, never >500)
- `easing`: in / out / inOut / spring / linear
- `z`: base 0 · raised 10 · sticky 20 · dropdown 30 · overlay 40 · tooltip 50 · modal 60 · toast 70
- `breakpoints`: sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536

### Chart grammar / color jobs (design-system.md §3.2, §10)
One house chart grammar, fixed color jobs (constitutional): vermillion(`atlas`) = the typical
value / spotlight / you-are-here / like-for-like leader cell / single primary action; moss = profit /
kept / positive delta; cocoa = structure and costs (neutral mass of a breakdown); ink tints = neutral
data mass / axes / labels; parchment = rails / grids / hairlines / track backgrounds; amber = caution /
below-par; clay = destructive / hard errors only. Vermillion budget: one idea per view, under 5% of
surface. atlas-700 = text accent, atlas-500 = mark/surface accent (never body text). Always show the
spread (7 gradations). Nullable in, silence out (`return null`, no placeholder charts).

---

## 2. The locked section order for EACH of the 5 page types

Verbatim from `docs/superpowers/specs/2026-06-16-london-uk-section-architecture.md`
(section ORDER locked by the founder 2026-06-16; the standing law: each type has a
FIXED ORDERED set, every section ALWAYS present in its own row, never added/removed/
reordered without the founder; every section transmits GRAPHICALLY where data allows;
a text/bullet block is a failure state used only low on the page). The machine
contract = `src/lib/page-sections.ts` + `src/lib/page-layout/section-order.ts` +
the `verify_page_sections` / `verify_section_order` gates.

### 1. HOME (the one page with extra brand freedom)
1. Hero — the rotating question + search
2. Pick a country — the world map
3. What a business actually keeps — live real examples
4. The same trade, state by state — like-for-like proof
5. The same numbers, block by block — neighbourhood proof
6. Built for the people who price a business — the audience
7. Free to read, paid to go deeper — pricing
8. From the notebook — a few articles
9. Get the free benchmark report — newsletter

### 2. UNITED KINGDOM (country)
1. Hero
2. At a glance — eight headline metrics
3. The country's shape — the nine lenses
4. Cost + rules to set up
5. Licences *(moved up beside setup)*
6. Where the margin leaks
7. Hiring + the cost of a team
8. The talent reality
9. Who has money to spend
10. How far you can reach
11. Versus the neighbours
12. The opportunity gap
13. Same business, here vs abroad
14. Special zones
15. The ground under you
16. Cities
17. Character
18. What locals know
19. What your life looks like here
20. Versus the world
21. The honest take
22. Gut-check
23. One thing to remember
24. Related countries

### 3. LONDON (city)
1. Hero + Business Climate Score
2. At a glance — metro metrics
3. Who the local customer is
4. Tourist money vs local money
5. What space costs
6. What owners keep across trades
7. Best areas to set up
8. Neighbourhoods
9. How the city is changing
10. Rival + peer cities
11. Operator voices
12. One thing to remember

### 4. LONDON RESTAURANTS (activity / cell)
0. *(above the body)* Make-it-yours calculator — directly under the masthead number
1. Masthead — typical revenue + its spread
2. The honest take
3. In plain terms — the number in tangible units
4. Where the money goes
5. What moves the cost
6. What the owner keeps
7. Break-even
8. What to watch — the risks *(moved up, after the money block)*
9. Pay by role
10. Cost to open
11. Through the year
12. Your realistic first year
13. The same business nearby
14. Operator voices
15. Versus the world
16. The story in plain words *(moved low: a quiet prose beat)*
17. One thing to remember
18. Related

### 5. LONDON NEIGHBOURHOODS (neighbourhood)
1. The district hero
2. Street by street
3. What thrives here and why
4. Who lives and shops here
5. Cost to operate
6. Versus next door
7. The businesses here
8. Operator voices
9. One thing to remember

### Round-2 visual treatment (LOCKED 2026-06-16) — key notes
Vocabulary: five Phase-0 primitives (LikeForLikeBars, ThresholdGauge, TimelineRibbon,
SeverityGlyph, TierBar) + existing family (RangeStrip, MoneyGoesBreakdown, engraved
gauges/dials, nine-lens radar, opportunity scatter, ComparisonBars, VisitorSplit,
OwnerKeepTable, setup route-line, character spectrum, seasonality bars, wage rails).
`[NEW]` = small new builds (kept-vs-gone bar, icon-unit cards, ease/difficulty +
multiplier gauges, three-bar "leak", framed gut-check cards, trend-direction card,
tier cards, suits-area cards). `[FRAME]` = data-not-held sections render their honest
sample/empty state but the visual frame is built so it fills when data lands.
Restaurant cell highlights: honest take = verdict + break-in difficulty gauge; where
money goes = per-$100 bar + vermillion tick on the kept row; break-even = ThresholdGauge;
what to watch = SeverityGlyph per row; first year = TimelineRibbon; nearby = LikeForLikeBars.

### Note on the manifest vs the locked spec
`src/lib/page-sections.ts` is the current machine manifest (CELL_SECTIONS,
COUNTRY_SECTIONS, CITY_SECTIONS, INDUSTRY_SECTIONS, NEIGHBOURHOOD_SECTIONS,
LEARN_SECTIONS, COMPARE_SECTIONS). It predates the 2026-06-16 spec and does NOT yet
match the new locked orders above (e.g. CELL has narrative high, risks late; the spec
moves risks up and narrative low). The spec says the manifest + `section-order.ts` +
gates are "updated to match the orders below in the same change." So: the locked
ORDER is the spec; the manifest is the thing the reformation must rewrite to match.

---

## 3. Verification methodology + gates (definition of done)

Source: `docs/verification-protocol.md` + `CLAUDE.md`. Run before delivering ANY work.
Order matters: instruction fidelity -> quality -> data honesty -> SEE it -> honest report -> ship.

0. **Instruction fidelity (cardinal rule).** Re-read the request verbatim; enumerate
   every discrete ask; do the asked-thing, never silently substitute. Never silently
   drop/reorder/rename a required section. Reconcile all of the founder's messages.
1. **Quality / gates.** `npx tsc --noEmit` clean. `npm run prebuild` **31/31** (CLAUDE.md
   also calls it "25 gates"; the protocol's count of record is 31/31). `verify_page_sections`
   + `verify_section_order` PASS (no section dropped). Hard constraints clean. The page
   renders its full section spine. Cohesion language holds (engraved frame + clean data core).
   Prebuild ~28-30s parallel (concurrency <=4 on Windows; use `prebuild:serial` if flaky).
2. **Data honesty.** No fabricated real-looking numbers (real, or a clearly-tagged SAMPLE).
   No visibly-wrong numbers. Like-for-like only; never rank across business x geography;
   never badmouth an industry; consulting/PE are clients not subjects.
3. **SEE it (Playwright MCP).** Actually render + screenshot the affected pages at desktop
   **1280** and mobile **375**, a filled exemplar (London / UK) AND a thin instance. Confirm
   with eyes: change visibly present, nothing broken/blank/washed-out/overlapping, no data
   behind imagery, answer-first hierarchy, coheres with other page types. If you genuinely
   cannot see it, SAY so; do not claim it works.
4. **Honest reporting.** Report failures with actual output; state samples, deferrals,
   judgment calls, risks. No overclaiming, no "done" when partial.
5. **Ship discipline.** Preview -> verify -> founder nod -> promote. Never promote unverified.
   Never let production fall behind verified branch work. Run vercel + gates from
   `E:\atlas\website` (CWD resets to parent); confirm the target Vercel project first.

---

## 4. The honesty boundary

Sources: `src/lib/cells/cell_view.ts` (header contract) + section-constitution.md rule 2.

- **London is the ONE fully-filled exemplar.** When a curated London entry is present
  (GB cells), every section fills, deriving rich editorial from the structured London
  fields and inventing the few specifics the dataset does not carry (role wages, the
  tangible units, the editorial beats). This invention is **explicitly sanctioned for
  London only** (`isLondon` gate). Sanctioned-invented beats: cost split, wages,
  seasonality, first-year, what-locals, contrarian, myths, right/wrong, risks,
  comparable-UK-city peers.
- **Everywhere else: real data where it exists, honest self-omit otherwise.** The
  masthead, honest take, money split, break-even, and like-for-like peers fill from real
  figures; the invented editorial beats stay off. **Never a fake number, never a wall of
  dashes.** Every field is nullable and self-omitting; the kit renders nothing for a null.
- **Constitution rule 2 (always present, never blank, never fabricated):** every section
  renders on every instance. Real data where held; where a figure is genuinely not held,
  the section shows a clearly-marked SAMPLE / illustrative state (muted, tagged), never a
  real-looking invented number, never a blank. Long runs of unheld sections collapse into
  one calm "still filling in" strip, not a wall.
- Data-not-held sections (the `[FRAME]` ones in the spec) keep their honest sample/empty
  state; the visual frame is built so it fills when the data lands. **Never fabricate.**

---

## 5. The hard constraints

Source: `CLAUDE.md` "Hard constraints" + design-system.md standing constraints.

- **No em-dashes** in user-visible source (period/comma/colon instead). Gate:
  `verify_no_em_dashes`. Override: `// allow-em-dash` on the line.
- **No source-agency names** in user-facing copy (Eurostat, BLS, ATO, etc.).
  Gate: `verify_no_source_agencies`.
- **No URL slug renames** — SEO equity rides on existing URLs. Add new, never rename.
- **Tokens only / no raw hex / px / ms / easing / font-name / z-index in components** —
  pull from `design-tokens.ts` or `motion.ts`.
- **WCAG AA floor** — 4.5:1 body text, 3:1 large text + non-text UI; visible focus rings
  never removed; no meaning by color alone.
- **375px: a designed layout, no horizontal scroll** — serif headline, anchor number, and
  spread survive a 375px column; tables reflow to labeled bar lists.
- **No `--no-verify`, no `--no-gpg-sign`, never force-push to main.**
- **Parallel prebuild concurrency <=4 on Windows** (6 segfaults intermittently).
- Layering is upward only (app -> domain -> system -> tokens); `verify_layering` enforces
  it (14 grandfathered violations in the allowlist; migrate when touched, never add new).
- Run shell commands from `E:\atlas\website` (CWD resets to the parent `E:\atlas`).

---

## 6. What is live (R6.5) vs held (engraved direction on the branch)

Source: `CLAUDE.md` latest-handoff + `docs/brand/cohesion-master-plan.md` locked decisions.

**LIVE in production (R6.5):** marginatlas.com (615 static pages at last build). The warm
frame + brand blocks + interaction. The "warm SaaS kit" grammar on cell / city / industry /
home: BeatCard, white cards on cream with the elevation scale, RangeStrip / charts / tables.
This is the current shipped product.

**HELD on `reform-v2/r6-forward` (committed, NOT shipped):** the engraved-almanac cohesion
direction — the section constitution, the engraved kit, the engraved country page, and the
R7 cohesion plan. The country page is the built reference instance of the unified language
but its promote is **held**; per the founder's locked decision (2026-06-14) it ships
together with the whole cohesive site in one go at **Wave F**.

**The unified language (locked, founder 2026-06-14):** ONE visual language =
**engraved frame + clean data core**, site-wide.
1. The engraved almanac is the IDENTITY layer (chrome, hero + section shells, motifs —
   compass / contour / rosette / divider family, the meaning scale, the display cut, the
   honest sample-state).
2. The data core stays clean (tables, charts, RangeStrip, money-goes, scorecards,
   make-it-yours calculator render crisp, opaque, high-contrast on cream; engraved texture
   lives only in the frame and shells, **never behind a number**).
3. The **warm frame ships ON by default** everywhere (gutters + per-category hero wash +
   glass chrome; gutters collapse below 1100px, never behind data).
4. The cell / business page = the **lightest engraved touch** (frame + hero + dividers
   only); the dense data board stays the star.

**Roadmap:** Wave A foundation (tokens / shells / dedupe / frame-on / one hero contract /
one 375 reflow) -> Wave B cell -> Wave C city -> Wave D industry + home -> Wave E learn +
compare + neighbourhood + directories -> Wave F verify all gates + cohesion QA at 1280 +
375 -> one comprehensive preview -> promote once. The two-language split (warm SaaS kit vs
engraved almanac) is the headline cohesion failure this reformation closes.
