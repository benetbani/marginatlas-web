# Page architecture: City (metro, e.g. London)

> SUPERSEDED ORDER. The approved section list + order is in `00-APPROVED-REFORM-2026-06-18.md` (built from the deep analysis in `analysis/`, founder-approved 2026-06-18; note: three market sections merge into one customer band, best-areas is reinvented as a suits-shortlist with rent/footfall meters, plus a cost-to-open beat). The per-section visual detail and honesty rules below remain valid reference; where the section SET or ORDER below conflicts with the approved-reform file, that file wins.

## Purpose & the one job

The City page answers exactly one question for an operator scouting a metro: **is this a friendly place to open a small business, and what kind of market am I selling into?** The single focal point is the **Business Climate Score** — the one 0-100 number Atlas gives a city, the only scored entity on the whole site — read against its peers on the identical scale.

Everything else on the page exists to give that score context and to let the operator act on it: who the customer is, what space costs, who the footfall is, what owners actually keep across trades, where to set up, which districts to start in, how the place is shifting, and which rival metros to compare against. The page is a **market briefing built around one verdict**, not a dashboard of vanity metrics.

The page is information-rich and almanac-dense per the founder's global density decision, but it stays readable by alternating heavy data bands with quiet prose/verdict bands, and by collapsing unfilled sections into a single calm strip rather than a wall of gray boxes. London is the flagship exemplar (fully filled, founder-sanctioned invented-but-plausible where data isn't measured); thinner cities soften the score to a break-in chip and fold unheld sections.

The honesty floor is absolute: the score never reads as a ranking across geographies or business types; cities are only ever compared to cities on the one shared 0-100 scale; districts are never put on that scale against whole cities; the space index is a cost character (not a rent quote); the visitor split is a footfall proxy (not spend); one terracotta accent only; moss = kept/positive, amber = caution; no em-dashes; no source-agency names.

---

## The full section + subsection list (in visual order)

Every row below is a section. Each content section sits in **its own bordered card** (the founder's "each section in its own bordered card" decision), separated by the rhythm in the next part. The global chrome (full navbar, rich footer) and universal assets are listed at the boundaries where they appear.

| # | section | subsection(s) | the EXACT chosen visual (founder decision; named shadcnblocks block where applicable) | layout | data | hierarchy weight |
|---|---------|---------------|------------------------------------------------------------------------------------------|--------|------|------------------|
| — | **Global navbar (chrome)** | logo + topic dropdowns (Countries, Industries, Cities, Compare) + search + primary CTA | shadcnblocks **`navbar1`** (Navbar 20), full variant with dropdown menus + search field + one primary CTA button; mobile sheet built in | sticky full-width bar, not a card | static site chrome | chrome (sticky) |
| — | **Breadcrumb + world-map motif band** | Home / Cities / London crumb; faint stylized world-map motif as the masthead backdrop | crumb text + the shared **world-map motif** (universal asset) as a low-opacity backdrop behind the hero | full-bleed masthead ground (gradient atlas-50 → cream-75), not a bordered card | static + place name | quiet |
| 1 | **headline — Hero + Business Climate Score** | (a) country flag + country eyebrow; (b) verdict headline (the sentence the score generates); (c) the **big score number + 0-100 BAND with peer-city ticks**; (d) three quiet supporting stats (population, salary, visitors) | **Big number (Newsreader hero) + a 0-100 BAND with peer-city ticks** = KEEP kit `ScoreBand`; ONE optional re-skinned shadcn **radial** for the hero score moment only. Supporting stats = `stats-card1` quiet KPI row | masthead, **two-column at 1280** (left: flag/headline/score number + caption; right: radial OR the band owns the right column), **stacked at 375** (score above its band, stats below). The whole hero sits on the masthead ground; the three stat tiles are individually bordered cards | modeled (score, stats); peer ticks are real peer scores | **HERO** |
| — | **Section divider** | thin engraved rule | universal **section divider** asset (1px cream-300 top-border between bands) | full-width rule | — | — |
| 2 | **honest-take — The honest take** | (a) Newsreader verdict line; (b) up to three Inter bullets | shadcnblocks **`cta10`** calm accent panel, **buttons omitted** | **bordered accent card (atlas-50 ground)**, stacked, tighter 60ch measure, set apart by whitespace | london-exemplar (invented-but-plausible for London; verdict-only elsewhere) | primary (editorial heartbeat) |
| 3 | **customer — Who the local customer is** | (a) section heading + lead; (b) two big tabular key stats (median resident income, net wealth per adult); (c) the **income spread strip** | **An INCOME SPREAD STRIP + two key stats** = stat pair in a `chart-card1` shell + KEEP visx **`RangeStrip`** ("what residents earn a year"); resident median tick accented | **bordered card**, **two-column at 1280** (left: the two stats + note; right: the RangeStrip), **stacked at 375** | modeled stats; income spread (p10-p90) real for London only, strip self-omits elsewhere | primary |
| 4 | **space — What space costs** | (a) plain-English truth line (Newsreader); (b) body explaining it is a cost character; (c) one cost-character stat vs a 100 baseline | KEEP kit **`RealityCheck`** (character read) + a small 1-2 stat `data-table1`-style dl | **bordered card**, stacked (narrow 680px measure), the index sits as a small bordered sub-tile inside | modeled (cost-of-living character; no quoted rent) | secondary |
| 5 | **visitors — Tourist money vs local money** | (a) section heading (the headline doubles as the read); (b) lead note keeping it honest as footfall not spend; (c) **one proportion bar** | **ONE PROPORTION BAR (resident slice accented)** = KEEP kit `VisitorSplit`, never a pie | **bordered card**, stacked (the bar is full-measure ≤680px) | modeled (arrivals-vs-population footfall proxy; London curated) | secondary |
| 6 | **owners-keep — What owners keep across trades** | (a) heading; (b) column key row; (c) **ranked bars + take-home + per-row break-in chip**; (d) honesty caveat rail | **RANKED BARS + take-home + a break-in chip per row (links to cell)** = KEEP kit `OwnerKeepTable` / `LikeForLikeBars` (Data Table grade) | **bordered card**, stacked table grid (4 columns: trade / bar / margin / take-home+chip), right-aligned money, no zebra | real (cell engine, trusted-local only); self-omits below three rows | **PRIMARY (a heavy data band)** |
| 7 | **best-areas — Best areas to set up** | (a) heading; (b) the reinvented treatment (see "The signature graphics" — recommended: **Area × trade-fit shortlist with a suits pictogram + mini rent/footfall read**) | **FRESH REINVENTION** (founder-mandated): the recommended treatment is a **ranked area shortlist, each row = district + the trade it suits + a "suits" pictogram + a mini rent/footfall read + the why**. Two alternatives proposed below. | **bordered card**, **divided list (NOT a card grid)** to differentiate from §8 and §10 | london-exemplar (BEST_AREAS curated, London only); `SectionEmpty` elsewhere | primary |
| 8 | **neighbourhoods — Neighbourhoods** | (a) heading; (b) up to four featured cover cards; (c) "Explore all" text link | **Cover cards** (`NeighborhoodCover`), up to four featured | **bordered card** containing a cover-card grid: **2-col at 375 → 4-col at 1280**, lift-on-hover | real (`neighborhoods_v1.json` + flavour); `SectionEmpty` if none | secondary |
| 9 | **changing — How the city is changing** | (a) heading; (b) insight verdict + body; (c) optional three-bullet up/down rail | KEEP kit **`ContrarianInsight`** trend card; `SectionEmpty` elsewhere | **bordered card** (cream-50), stacked, low-contrast | london-exemplar (londonChanging, London only); self-omits to calm strip on non-exemplar cities | secondary (quiet) |
| 10 | **peers — Rival and peer cities** | (a) heading; (b) **CARDS per peer city** (founder chose cards over ranked bars); (c) the VsWorld peer-median read; (d) honesty caveat rail | **CARDS per peer city** = KEEP kit `CityPeers` cover cards (flag + score + step-sideways link). The `ComparisonBars` + `VsWorld` peer-median ride here as a supporting read with the honesty rail. | **bordered card**, **two-column at 1280** (left: ranked ComparisonBars + caveat + VsWorld read; right OR below: the peer cards grid 2→4-col), **stacked at 375** | real (buildCityPeers + each peer's own score); self-omits below two peers | **PRIMARY** |
| 11 | **one-thing — One thing to remember** | (a) single closing line; (b) freshness stamp ("June 2026"); (c) flag-it affordance | KEEP kit **`OneThing`** close card | **bordered card** (cream-100 ground), full-width, stacked, generous air above | modeled (view.masthead.answer) | quiet (quietest on the page) |
| — | **Collapse-behaviour (thin-city) — only shown in the mockup as proof** | softened hero (break-in chip, not a /100); the single "still filling in" strip standing in for best-areas + changing + operator-voices, anchors preserved | dashed inset + the calm **strip** pattern with preserved section-id anchor pills | bordered dashed inset (mockup proof only; in production this is the live collapse, not a separate section) | placeholder demonstration | quiet |
| — | **Rich multi-column footer (chrome)** | link columns (Countries / Industries / Cities / Company) + newsletter signup + legal row + social | shadcnblocks **`footer7`** (Footer 44), multi-column variant + newsletter + legal | full-width, not a card | static site chrome | chrome |

**Note on the "operator-voices" anchor.** The collapse strip references `operator-voices` as a foldable anchor. It is **not** a top-level locked section in the 11-section spine; it is one of the future-content anchors that exists only to be preserved inside the calm strip when unfilled. Do not add a 12th full-grade section for it.

---

## Visual hierarchy & density

The page is **information-rich and almanac-dense** (founder's global decision — pack more in, keep it readable), and the sparseness of earlier drafts is fixed by **both** two-column section internals **and** more sections. It stays readable through five disciplined moves:

**1. One hero, one Newsreader hero number.** Exactly one figure on the entire page is set big in Newsreader: the Business Climate Score (e.g. 78). Plus the headline verdict sentence. Every other number on the page is Inter with tabular lining figures (income spread, take-home, margins, the cost index, peer scores). Nothing competes with the score. This is the anchor that lets the rest get dense without becoming noise.

**2. Weighting (hero → primary → secondary → quiet).**
- **Hero:** §1 headline + ScoreBand. Generous top air, biggest type, owns the masthead.
- **Primary (the heavy data bands + the editorial heartbeat):** §2 honest-take, §3 customer (RangeStrip), §6 owners-keep (the ranked-bar table), §7 best-areas, §10 peers. These carry the most ink and the signature graphics.
- **Secondary:** §4 space, §5 visitors, §8 neighbourhoods, §9 changing. Smaller, supporting.
- **Quiet:** the three hero stat tiles, the space sub-tile, §11 one-thing close.

**3. Alternating bands = the breathing rhythm.** No two heavy data bands sit adjacent without a prose/verdict band between them. The cadence is deliberately A-B-A-B:
`hero (data) → honest-take (prose) → customer (data) → space (prose-read) → visitors (data) → owners-keep (heavy data) → best-areas (structured list) → neighbourhoods (cards) → changing (prose) → peers (heavy data) → one-thing (prose close)`.
Generous 6-8 unit (≈52px) vertical gaps between bands; a 1px engraved divider (the shared divider asset) between consecutive bands.

**4. Two-column vs stacked, chosen per section (founder: internal layout per section).**
- **Two-column at 1280** (text/stats left, visual right): §1 hero (headline+score | radial/band), §3 customer (two stats+note | RangeStrip), §10 peers (bars+VsWorld | peer cards).
- **Stacked:** §2 honest-take (panel), §4 space (read + sub-tile), §5 visitors (full-measure bar), §6 owners-keep (full-width table), §7 best-areas (full-width divided list), §8 neighbourhoods (card grid), §9 changing (insight card), §11 one-thing (full-width close).
- **At 375 everything stacks one column**, no horizontal scroll. Hero score sits above its band; the neighbourhood grid drops to two columns; the owners-keep table reflows (bar drops below the trade label, margin and take-home right-align).

**5. No repeated card grids in a row.** The three "many small things" sections each use a *different* shape so the page never reads as repeated template tiles: best-areas is a **divided list with a suits pictogram**, neighbourhoods are **cover cards**, peers are **cards (with a supporting bar read)**. This is the single biggest defense against the page feeling like a dense tile-wall.

**How sample / unheld sections appear (the collapse rule — founder's choice).** A non-exemplar city legitimately has honest-take (verdict-only), best-areas, and changing unfilled, plus possibly owners-keep, neighbourhoods, peers. Rather than three to six separate gray boxes, **consecutive unheld sections render as ONE calm "still filling in" strip**: a single muted bordered band, one quiet line ("We are still filling in the local detail for {city}: the best areas, how it is changing, and operator voices."), with the section ids preserved as **anchor pills inside it** so the locked order and sticky nav stay intact. A section that is genuinely filled (the modeled customer/space/visitors always are) **breaks the strip** and renders full-grade. The score itself softens on a thin city: it demotes to a quiet **break-in chip** and the hero leads on the place, never a confident /100 we don't hold.

**Realness tagging is visible, never faked.** Every figure is tagged in the copy by its honesty class: modeled figures are shown plainly but framed ("cost character, not a quote"; "a rough share of footfall, not spend"; "the model rates it strong"); london-exemplar sections carry the exemplar register; real sections (owners-keep, neighbourhoods, peers) are the trusted-local ones and say so in their caveat rails. Never a fake number, never a blank, never a stub headline pretending to data.

---

## The signature graphics (exact spec)

For each non-trivial graphic, the chosen type (per the founder's decisions), the block/chart it maps to, the data shape, and the correctness notes (computed geometry + honesty rule). All bars/strips are **div-based static SVG/CSS** in the mockup; in the Next app they are the KEEP kit primitives (visx / hand-SVG), with shadcnblocks **chart components** used for the seasonality-style area shapes elsewhere. **The score radial is the ONE permitted re-skinned shadcn radial, hero-only.**

### A. Hero score — big number + 0-100 ScoreBand with peer ticks (§1)
- **Type:** big Newsreader number + the KEEP kit **`ScoreBand`** (a 0-100 track), optional re-skinned shadcn **radial** for the number moment only.
- **Maps to:** `ScoreBand` (kit) for the band; `--chart-1` (atlas-500) for the subject mark; if the radial is used it is the single shadcn radial allowed on this page-type.
- **Data shape:** `{ score: 78, label: "Strong", peers: [{name:"Paris",score:74},{name:"Amsterdam",score:73},{name:"Berlin",score:71},{name:"Dublin",score:69}], bands:[Weak,Fair,Good,Strong] }`.
- **Computed geometry:** the track is 0→100 left-to-right. Subject mark sits at `left: score%` (78 → `left:78%`). Each peer tick sits at `left: peerScore%` (74→74%, 73→73%, 71→71%, 69→69%). The four band zones (Weak/Fair/Good/Strong) are quartiles by default OR the model's break-in cutoffs; in the London mockup they are even quarters with the colour ramp cream-400 → amber-300 → moss-300 → moss-600. The subject caption ("London 78") is absolutely positioned at `left: score%` with `translateX(-50%)`.
- **Honesty rule:** the band and peer ticks **only ever compare cities to cities on the identical 0-100 scale** — the only place that scale is held constant. Peer ticks are faint (ink-500), the subject mark is the lone atlas accent. The caption says "Same 0 to 100 scale, only cities are scored." No "best city" crown. On a thin city the number does not render as a confident /100.

### B. Income spread strip — RangeStrip (§3 customer)
- **Type:** **income spread strip** (founder decision) = KEEP visx **`RangeStrip`**, the site-wide signature spread shape.
- **Maps to:** `RangeStrip` (kit). Span fill = cocoa gradient (cocoa-300 → cocoa-500, the "cost/neutral mass"); the median tick is the lone atlas accent.
- **Data shape:** `{ p10: 24000, median: 52000, p90: 140000, currency:"$" }` (London real spread; modeled/self-omitting elsewhere).
- **Computed geometry:** axis runs p10 (=$24K) at 0% to p90 (=$140K+) at 100%. The full span bar fills 0→100%. Median tick position = `(median − p10) / (p90 − p10)` = `(52−24)/(140−24)` = `28/116` = **24.1%**. Three tick labels: `$24K` at 0% (left-anchored), `$52K median` at 24.1% (atlas accent, centered with translateX(-50%)), `$140K+` at 100% (right-anchored). Label row above: "Lower earners | What residents earn a year | Higher earners".
- **Honesty rule:** real spread for London only; strip self-omits everywhere else (the two stats still carry the section so it never reads empty). It is a within-city distribution, never compared across geographies. Tabular figures.

### C. Visitor split — one proportion bar (§5 visitors)
- **Type:** **ONE proportion bar** (founder decision), resident slice accented = KEEP kit **`VisitorSplit`**. **Never a pie.**
- **Maps to:** `VisitorSplit` (kit). Resident slice = atlas-500 (the lone accent, because residents are the dominant everyday-trade slice); visitor slice = cocoa-300 (neutral).
- **Data shape:** `{ residents: 0.72, visitors: 0.28 }`.
- **Computed geometry:** a single horizontal bar; resident segment `width:72%` with inline label "Residents 72%", visitor segment `width:28%` with inline label "Visitors 28%". One bar, two segments, summing to 100%.
- **Honesty rule:** the note states explicitly "A rough share of footfall, not spend." This is the figure most likely to be mis-read as revenue, so the framing is load-bearing. ALWAYS rendered (modeled). Never drawn as a pie or donut.

### D. Owners-keep — ranked bars + take-home + per-row break-in chip (§6)
- **Type:** **RANKED BARS + take-home + a break-in chip per row** (founder decision) = KEEP kit **`OwnerKeepTable` / `LikeForLikeBars`** (Data Table grade).
- **Maps to:** `OwnerKeepTable` (kit). Subject/own-trade rows in atlas-500; other trades cocoa-300. Apply the honesty rules ON TOP of any shadcnblocks chart styling: emphasize the owner-kept slice.
- **Data shape:** `rows: [{trade, margin, takeHome, breakIn:"easy|moderate|hard", cellHref}]`, ordered by take-home descending. London exemplar rows:
  - Dental practice — margin 18% — take-home $95K — moderate
  - Law firm — 22% — $88K — hard
  - Accountants — 21% — $72K — moderate
  - Restaurant — 9% — $48K — hard (links to cell-london-restaurants.html)
  - Cafe — 7% — $34K — easier
- **Computed geometry:** the **bar encodes take-home only**, scaled to the max in the set. Max = $95K = 100%. Each bar width = `takeHome / 95 × 100`: $95K→100%, $88K→92.6%, $72K→75.8%, $48K→50.5%, $34K→35.8%. Margin and take-home are separate right-aligned tabular columns; the bar is NOT the margin. The break-in chip sits beside the take-home figure: easy→moss-300/moss-700, moderate→amber-300/ink-800, hard→atlas-50/atlas-700.
- **Honesty rule:** "Ordered by take-home, not by what is best. Different trades, read each on its own terms." This is the one place the page lists multiple business types — the caveat rail forbids reading it as a ranking of which business is best, and forbids cross-geography comparison. Each row links to its **cell page** (founder: break-in chip links to cell). Self-omits to `SectionEmpty` below three real rows. After-tax owner take-home + net margin, trusted-local only.

### E. Best-areas — the REINVENTION (§7) — three fresh treatments + recommendation

This section is founder-flagged as requiring a fresh, exquisite reinvention (not a card-grid clone of neighbourhoods or peers). Three treatments, honest (London exemplar; `SectionEmpty` everywhere else):

**Treatment 1 (RECOMMENDED) — "Suits" shortlist: a ranked area list with a fit pictogram + a mini rent/footfall read.**
Each row is one district presented as a calm divided-list line (border-top + border-bottom, no card box), with four cells:
1. a small **suits pictogram** (the universal icon-set glyph for the trade it suits — restaurant/fork, professional/briefcase, cafe/cup, luxury/star), atlas-500 stroke;
2. the **district name** (Newsreader, e.g. "Soho");
3. **the trade it suits** (atlas-700, e.g. "Restaurants, nightlife");
4. a **mini rent/footfall read** = two tiny inline meters (a 4-segment "rent" pip and a 4-segment "footfall" pip, e.g. rent ●●●● high, footfall ●●●○), plus the **why** in cocoa body.

  *Data shape:* `areas:[{district, suits, suitsIcon, rent:0-4, footfall:0-4, why}]`. *Geometry:* the rent/footfall pips are 4-segment static meters (filled segments = level), atlas-500 for filled, cream-300 for empty; no axis, just a glanceable read. *Honesty:* the rent/footfall pips are explicitly a **relative read within this city** (a 0-4 character, not a quoted £/sqft and not a cross-city comparison), labelled "rent / footfall, relative within London." London exemplar; `SectionEmpty` elsewhere. *Why recommended:* it adds genuinely new information (a rent vs footfall trade-off the operator can scan) without a chart that pretends to a precision we don't hold, it reads as a calm divided list (distinct from §8 cards and §10 cards per the "no repeated grids" rule), and the pictogram makes the trade-fit instant.

**Treatment 2 — Area × trade-fit matrix (a small heat-grid).**
A compact matrix: rows = 4-5 districts (Soho, The City, Shoreditch, Mayfair, ...), columns = 4-5 trade families (Food & drink, Professional services, Creative, Luxury/advisory, Retail). Each cell is a small fit glyph (strong / fair / weak fit), atlas-500 ramp.
  *Data shape:* `matrix:[district][trade] = fit:0-3`. *Geometry:* a CSS grid, each cell a tinted square (fit 3 = atlas-500, fit 2 = atlas-300, fit 1 = atlas-50, fit 0 = cream-100). *Honesty:* fit is a within-city relative read, never a score, never cross-city. *Trade-off:* most information-dense (good for the almanac brief) but riskiest for cringe — a heat-grid can read as a fabricated-precision scorecard, and at 375 a 5×5 grid is cramped. Use only if the founder wants maximum density and accepts the matrix idiom.

**Treatment 3 — District cards with a "suits" pictogram + a one-glance rent/footfall read.**
The same content as Treatment 1 but as a 2→4-col card grid (district name, suits-pictogram, the trade, two mini meters, the why).
  *Trade-off:* visually richest, but it **clones the neighbourhood and peer card grids** and violates the founder's "no two identical card grids in a row" density rule. Rejected for that reason unless §8 and §10 change shape.

**Recommendation: Treatment 1 (the suits shortlist with rent/footfall mini-meters).** It is the most exquisite-yet-calm option, adds a real decision input (rent vs footfall fit per trade), keeps best-areas as a *divided list* so the three "many-things" sections each stay visually distinct, and is the easiest to keep honest (relative 0-4 reads, explicitly within-city, London exemplar only). The current mockup's plainer divided list (district / suits / why) is the floor; the mini rent/footfall meters are the upgrade that makes it sing.

### F. Peers — cards per peer city + supporting ComparisonBars + VsWorld (§10)
- **Type:** **CARDS per peer city** (founder chose cards over ranked bars as the primary). The **`ComparisonBars`** ranked read + the **`VsWorld`** peer-median read ride along as the honest supporting visual on the shared 0-100 scale.
- **Maps to:** `CityPeers` cover cards (kit) for the cards; `ComparisonBars` (kit) for the ranked read; `ScoreBand`-grammar `VsWorld` for the median read.
- **Data shape:** `peers:[{city, score, flag, href}]` + `subject:{city:"London", score:78}` + `peerMedian:72`.
- **Computed geometry:** **Cards** — one per peer, each carrying flag + "Score 74" + "Step sideways →". **ComparisonBars** — bar width = `score%` directly on the 0-100 scale (London 78→78%, Paris 74→74%, Amsterdam 73→73%, Berlin 71→71%, Dublin 69→69%); London's bar is the lone atlas accent, peers cocoa. **VsWorld** — subject fill `width:78%`, peer-median tick at `left:72%`, captions "London 78" (atlas) and "Peer median 72" (ink).
- **Honesty rule:** the caveat rail is **load-bearing**: "Compared on the one shared 0 to 100 Business Climate Score, the only place that score is held constant, so a leader mark here is honest." VsWorld note: "Not adjusted for local prices, so read it as a relative climate signal, not a cost comparison." A country never ranks its own cities — this is peer metros against the subject metro, cities-to-cities only. Self-omits below two peers.

### G. (Supporting reads, not "charts" but specified for geometry)
- **Space cost-character tile (§4):** a single Inter index number (132) vs a stated 100 baseline, in a small bordered sub-tile. **Geometry:** none beyond the number; it is deliberately NOT drawn as a bar/gauge so it can never be mis-read as a measured rent. Framed "a read on how dear the ground is, not a rent quote."
- **Changing up/down rail (§9):** three list rows each with a ▲ (moss-600, rising) or ▼ (ink-500, falling) glyph + a one-line trend. **Honesty:** never a speculative trend on a non-exemplar city (self-omits to the calm strip there); London exemplar only.

---

## Shared assets used

The page uses all three universal/shared site-wide assets (founder: "shared site-wide visual assets — a stylized world-map motif, a consistent icon set, and section dividers"):

- **Stylized world-map motif.** Appears once, as a faint low-opacity backdrop behind the §1 masthead/hero (the atlas-50 → cream-75 ground), reinforcing the "atlas" identity without competing with the hero score. Used sparingly (the "subtle premium backdrop" note from the chart-system menu); never repeated lower on the page.
- **Consistent icon set.** Used in: the navbar dropdown carets + search glyph + mobile menu; the §7 best-areas **suits pictograms** (fork = food, briefcase = professional, cup = cafe, star = luxury); the §9 changing up/down arrows (drawn from the same set); the footer social icons. One stroke weight, atlas-500 for accent glyphs, ink for neutral.
- **Section dividers.** The 1px engraved cream-300 top-border between every consecutive band (the rhythm rule). Plus the masthead's bottom border. These are the "section dividers" universal asset; they carry the band-to-band cadence and are the visual seam between the bordered section cards.

The **flags** (UK Union Jack in the eyebrow; peer flags on the §10 cards; the moss/amber/atlas chip palette) are part of the icon/asset system and appear in §1 (country flag), §10 (peer flags).

---

## Exemplar data to fill

The real / London-UK exemplar values the mockup carries, section by section (these are the founder-sanctioned invented-but-plausible London figures already in `city-london.html`; keep them as the canonical exemplar set):

**§1 Hero / Business Climate Score**
- Country eyebrow: **United Kingdom** (Union Jack flag).
- Verdict headline: "London is a **strong** place to start a small business, if you can fund a slow start."
- Score: **78 / 100**, label band **Strong**. Caption: "Business Climate Score. Deep demand, expensive ground. The model rates it strong on the balance."
- ScoreBand peer ticks: **Paris 74, Amsterdam 73, Berlin 71, Dublin 69** ("Same 0 to 100 scale, only cities are scored.").
- Three quiet stats: **Population 8.9M · Average salary $52K · Annual visitors 20M**.

**§2 Honest take (london-exemplar)**
- Verdict line: "London rewards the operator who can fund a slow start and hold a premium. It punishes the under-capitalised."
- Bullets: (1) "The deepest, most reliable customer demand of any UK city, across almost every trade." (2) "The rents and wages that come with that demand take most of the upside back." (3) "The winners pick the right street and the right price, not just the right idea."

**§3 Customer**
- Heading: "A deep, broad spending base." Lead: "Comfortable on the whole, with a long top tail that the premium trades live on."
- Two stats: **Median resident income $52K · Net wealth per adult $220K**.
- RangeStrip: **p10 $24K → median $52K (at 24.1%) → p90 $140K+**. Labels: "Lower earners | What residents earn a year | Higher earners."

**§4 Space (modeled)**
- Truth line: "Among the most expensive places in the country to take a lease."
- Body: "Treat rent as the first line of the budget, not the last. This is a cost character, not a quoted figure: London sits well above the national baseline, and the gap between a prime street and one block over is large."
- Cost character: **132** against a **100** UK baseline ("A read on how dear the ground is, not a rent quote.").

**§5 Visitors (modeled)**
- Heading: "Mostly a residents' city." Note: "A rough share of footfall, not spend: residents carry the everyday trade, visitors lift the centre."
- Split: **Residents 72% (accented) · Visitors 28%**.

**§6 Owners-keep (real)**
- Heading: "Take-home by business, the everyday trades."
- Rows (ordered by take-home): **Dental practice — 18% — $95K — moderate** (bar 100%); **Law firm — 22% — $88K — hard** (92.6%); **Accountants — 21% — $72K — moderate** (75.8%); **Restaurant — 9% — $48K — hard** (50.5%, links to the restaurant cell); **Cafe — 7% — $34K — easier** (35.8%).
- Caveat: "After-tax owner take-home and net margin, trusted local measurements only. Ordered by take-home, not by what is best. Different trades, read each on its own terms."

**§7 Best-areas (london-exemplar; Treatment 1 — add rent/footfall mini-meters to the existing four rows)**
- **Soho** — suits Restaurants, nightlife — rent high / footfall high — "Dense evening footfall and a name that carries a premium, at a premium rent."
- **The City** — suits Professional services — rent high / footfall mid (weekday-skewed) — "Weekday corporate demand; quiet at weekends, so build around the working week."
- **Shoreditch** — suits Cafes, creative — rent mid-rising / footfall mid-high — "Younger crowd, strong daytime trade, rents rising as it matures."
- **Mayfair** — suits Luxury retail, advisory — rent top / footfall mid — "The top of the market; only works at a genuine premium position."

**§8 Neighbourhoods (real)**
- **West End** — Tourist and nightlife core — Oxford St, Regent St (links to neighbourhood-west-end.html).
- **Shoreditch** — Creative, daytime cafes — Redchurch St.
- **Camden** — Markets and music — Camden High St.
- **Greenwich** — Residential, visitor draw — Greenwich Church St.
- "Explore all neighbourhoods" text link.

**§9 Changing (london-exemplar)**
- Heading: "The centre is tilting to mixed-use." Verdict: "The week is flattening. The trades that flex across both dayparts are the ones gaining ground."
- Body: "As offices empty some days of the week, evening and weekend trade is rising where weekday lunch trade fell. A site that only works Monday to Friday is harder to justify than it was."
- Rail: ▲ "Evening and weekend trade rising in the centre" · ▼ "Weekday lunch trade falling near office cores" · ▲ "Flex-daypart trades, all-day cafes and bars, gaining."

**§10 Peers (real)**
- Heading: "London versus comparable metros."
- ComparisonBars: **London 78 (accent), Paris 74, Amsterdam 73, Berlin 71, Dublin 69.** Caveat: "Compared on the one shared 0 to 100 Business Climate Score, the only place that score is held constant, so a leader mark here is honest."
- VsWorld: **London 78 vs peer median 72** ("a touch above the median ... a relative climate signal, not a cost comparison").
- Peer cards (flag + score + "Step sideways →"): **Paris 74, Amsterdam 73, Berlin 71, Dublin 69.**

**§11 One thing (modeled)**
- Line: "London gives you the demand. Whether you keep any of it depends on the rent deal and the price you can hold."
- Stamp: **June 2026**. Flag-it: "Spot something off? Flag it."

**Collapse-proof inset (thin-city demonstration)**
- Example city: **Leeds**. Softened hero: "Break-in: moderate" chip + "Score held back until the local read is firm" (no /100).
- Strip line: "We are still filling in the local detail for Leeds: the best areas, how it is changing, and operator voices." Preserved anchor pills: **best-areas · changing · operator-voices.**

---

**Grounding files** (all absolute):
- Locked section list: `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\04-city.md`
- Current mockup ported here: `E:\atlas\city-london.html`
- Chart grammar + token map + block menu: `E:\atlas\website\docs\superpowers\plans\2026-06-16-visual-upgrade\01-component-and-chart-system.md`
- Linked cell/neighbourhood mockups the page points to: `E:\atlas\cell-london-restaurants.html`, `E:\atlas\neighbourhood-west-end.html`
