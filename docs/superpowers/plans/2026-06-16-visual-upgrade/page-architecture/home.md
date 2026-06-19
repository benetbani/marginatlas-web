# Page architecture: Home (the marketing front door)

> SUPERSEDED ORDER. The approved section list + order is in `00-APPROVED-REFORM-2026-06-18.md` (built from the deep analysis in `analysis/`, founder-approved 2026-06-18; note: neighbourhood travel cards are cut, an anatomy-of-a-benchmark + how-we-get-the-number trust strip + honest-read pull-quote are added). The per-section visual detail and honesty rules below remain valid reference; where the section SET or ORDER below conflicts with the approved-reform file, that file wins.

## Purpose & the one job

The Home page exists to make one claim legible on sight and prove it is not marketing air: **this tool tells you what a specific business actually makes in a specific place, with real numbers.**

- **The one job:** answer the visitor's unspoken question ("does this thing actually have real numbers for the business and place *I* care about?") with a single focal point, then let everything below it function as proof, not as competing claims.
- **The focal point is a sentence, not a number.** The hero is a rotating Newsreader question, "How much does a [trade] make in [city]?", sitting directly on top of the search navigator. The question stands in for a hero number because the homepage has no single canonical figure to crown. The first real numbers appear one band down, in the example tiles, deliberately, so the focal point stays singular and the page does not read like an almanac at the top.
- **The conversion path is the search itself.** The primary call to action is the in-band `NavigatorForm` (business + place + "Show the numbers"). The secondary path is "open a real one" via the example tiles and the world map. Newsletter is the quiet exhale at the bottom; pricing is a teaser, never a checkout.
- **This is the one page with extra brand freedom** (founder's ratified decision). Universal assets (world-map motif, icon set, dividers) may appear here first and most expressively. But the honesty law and the density/typography discipline below still bind absolutely.

This page must satisfy the founder's four QA questions on sight: sense at a glance (yes, via the rotating question + search), no cringe (achieved by deliberately varying card grammars and breaking them with the full-bleed map + the panel newsletter), clean typography (one Newsreader hero moment, stepped Inter below, tabular figures on every number), and "can it be quieter" (yes: numbers held off the hero, tiles trimmed to three, fragile sections self-omit).

---

## The full section + subsection list (in visual order)

Density target per the founder's ratified decisions: **information-rich, almanac-like, more per screen** while staying readable. Each section is its OWN bordered card/band. The page deliberately *alternates* dense numeric bands with airy editorial bands so it never stacks two stat grids back to back. Charts use **shadcnblocks chart components** with the honesty rules applied on top; the one exception is the bespoke `WorldMapSection`, which is KEPT (never swapped for a block) because it is a brand-signature surface.

| # | Section | Subsection(s) | The exact chosen visual (founder's decision; named block where applicable) | Layout | Data | Hierarchy weight |
|---|---------|---------------|---------------------------------------------------------------------------|--------|------|------------------|
| 0a | **Global chrome: full navbar** | Logo (Margin Atlas wordmark) · topic dropdown menus (Countries, Industries, Cities, Compare) · search · primary CTA ("Get the data") · mobile hamburger sheet | shadcnblocks `navbar1` (logo, menu[], auth; mobile sheet built in) | Sticky bar, full width; blurred cream backdrop, hairline bottom border | n/a (site chrome) | quiet (always present, never competes) |
| 1 | **Hero: rotating question + search** | (a) eyebrow line · (b) rotating Newsreader question H1 with two atlas-700 rotating slots · (c) one-line Inter subtitle · (d) `NavigatorForm` search card (Business field, Place field, "Show the numbers" submit) | shadcnblocks `hero2` shape (heading + sub + single CTA) with the `NavigatorForm` preserved verbatim as the in-band primary action; the rotating slots use `RotatingWord` over `HERO_BUSINESSES`/`HERO_CITIES` | Card-band, **stacked + centered**, generous top air; warm atlas-50 → cream gradient ground | real (rotating question + live search); mockup freezes one frame | **hero** |
| div | Section divider | universal hairline / engraved divider between hero and proof | shared divider asset | full-width 1px cream-300 rule | n/a | quiet |
| 2 | **Live example tiles** | three business-in-city tiles, each: business name · city/place · one real headline take-home number · "Open this benchmark →" link | **Stats-Card grid**, `stats-card1` shape, **3-up** (the only high-up numbers) | Card-per-section; **stacked** heading + 3-up tile grid inside | real (`loadExampleTiles()`, real take-home/revenue, sanity-floored at $15K); **self-omits below three** | primary (numeric) |
| div | Section divider | hairline | shared divider | full-width rule | n/a | quiet |
| 3 | **World map city picker** | eyebrow · H2 · the stylized clickable world-map SVG with accent pins on covered regions · plain invitation caption | **Bespoke `WorldMapSection`** = the shared stylized world-map asset, KEPT (do NOT swap for a block); accent pins on covered cities | **Full-bleed paper band**, **stacked + centered**, the largest spatial beat; generous vertical padding | real (covered regions/cities); the map is an exploratory surface, not a data viz | **primary (the largest spatial beat / second loudest after hero)** |
| div | Section divider | hairline | shared divider | full-width rule | n/a | quiet |
| 4 | **State comparison** | eyebrow · H2 · lead line · like-for-like horizontal bars (same trade across 3–4 US states) · honesty caveat line | **KEEP kit `LikeForLikeBars` / `ComparisonBars`** (the honesty rail is load-bearing; do NOT replace with a generic Recharts bar) | Card-per-section; **two-column-capable but rendered stacked** (lead block, then bar rail ≤680px) | real (`loadStateComparisons()`, trusted-local US states, distinct-values gate); **self-omits when thin** | secondary (numeric) |
| div | Section divider | hairline | shared divider | full-width rule | n/a | quiet |
| 5 | **Neighbourhood proof cards** | eyebrow · H2 · three editorial gallery cards, each: district + city heading · "Known for" line · "Don't miss" specific line · price-tier chip | **Gallery cards, 3-up**, from flavor data (`feature` gallery shape) | Card-per-section; **stacked** heading + 3-up gallery grid | real (`loadNeighborhoodCards()`, real flavor data only, no fabricated place detail); **self-omits below four** | secondary (editorial, no numbers) |
| div | Section divider | hairline | shared divider | full-width rule | n/a | quiet |
| 6 | **Audience band** | eyebrow · H2 · four role cards, each: one terracotta icon · Newsreader role name · Inter use-line | **Feature block `feature43` icon grid, 4-up** | Card-per-section; **stacked** heading + 4-up icon grid | editorial (real positioning, 4 real audience categories; PE/consulting framed as clients, never subjects; no fake logos/quotes) | quiet (the breathing "selling" beat) |
| div | Section divider | hairline | shared divider | full-width rule | n/a | quiet |
| 7 | **Pricing teaser** | eyebrow · H2 · lead line · three tier cards (Free / Basic / Premium) with price, description, feature checklist, per-card CTA · "See everything in each tier →" link | **Three tier cards, `pricing2` mini**, prices from the shared `TIERS` constant; CTA to /pricing (no checkout) | Card-per-section; **stacked** heading + 3-up tier-card grid | editorial (real prices: Free $0 / Basic $37 / Premium $77 from `TIERS` so they cannot drift) | secondary |
| div | Section divider | hairline | shared divider | full-width rule | n/a | quiet |
| 8 | **Blog rail** | eyebrow + H2 + "All posts →" text link (header row) · three blog cards, each: token-gradient cover with title initial · date · Newsreader title · 2-line excerpt clamp | **Blog/Gallery cards, 3-up** (`feature` gallery shape) | Card-per-section; header row is a **two-part baseline-aligned row** (heading left, "All posts" right); body **stacked** 3-up grid | real (`getAllPosts()`; `BLOG_FALLBACK` with token-gradient covers when no image) | quiet |
| div | Section divider | hairline | shared divider | full-width rule | n/a | quiet |
| 9 | **Newsletter / free report** | eyebrow · Newsreader heading · three plain bullets · `LeadMagnetForm` (email input + "Send me the report") · a real sample-report preview render | **`cta10` / Banner accent panel** + a real sample-report preview image (a true miniature per-$100 stacked bar, never a placeholder slot) | Card-per-section; **two-column inside the panel** (copy + form left, sample-report preview right); collapses to stacked on mobile | real (`HomeNewsletter` + `LeadMagnetForm`; sample-report preview is a real render) | secondary (the quiet exhale before the footer) |
| 0b | **Global chrome: rich footer** | wordmark + blurb column · Explore link column · Product link column · Company link column · (newsletter slot reused/condensed) · legal strip | shadcnblocks `footer7` (logo, sections[], social, legal) | Dark band, **multi-column** (1.4fr / 1fr / 1fr / 1fr → 2-col → 1-col responsive) + legal sub-strip | n/a (site chrome) | quiet |
| X | **Failure-state variant (review-only)** | *Not part of the live page.* A labelled demo of the single collapse the home page can show: when sections 4 AND 5 both fail to resolve, they fold into one calm "More comparisons are filling in" strip | `SectionEmpty` collapse strip | Card-band, stacked, clearly labelled "Failure state (shown for review only)" | n/a (demonstration of the empty state) | quiet (review artifact, not shipped) |

Notes that bind the table:
- **Universal assets used on this page:** the stylized world-map motif (section 3, the brand-signature surface and the boldest expression of the shared map asset), the consistent icon set (section 6 audience icons + navbar/footer glyphs + the "→" affordance + the hamburger glyph), and section dividers (the hairline `cream-300` rules between every band). All three are the founder's ratified shared site-wide visual assets.
- **One terracotta accent only.** atlas-600/atlas-700 is the single accent across hero rotating slots, CTAs, pins, the "Open" affordance, and the featured pricing card. Moss (`--moss-600`) appears ONLY as kept/positive in the sample-report "Owner keeps" segment. Amber (`--amber-600`) is caution only (it appears here merely as a blog-cover gradient, carrying no semantic weight). No second loud color competes with the hero.
- **No em-dashes, no source-agency names** anywhere in copy.

---

## Visual hierarchy & density

The page is **information-rich** (founder's ratified global decision: denser, almanac-like, more per screen, NOT spacious) yet readable. Readability at high density is achieved by four levers:

**1. A strict three-tier weighting so density never becomes noise.**
- **Hero (loudest, type):** the rotating question is the single largest Newsreader step (`clamp(32px, 5vw, 58px)`). It is the ONE display-type moment and the ONE "number-shaped" hero element. It carries **no number** on purpose.
- **Primary spatial beat (loudest, space):** the full-bleed world-map band is the largest spatial moment. It is loud through *air and width*, not through type size, so it never fights the hero typographically.
- **Primary/secondary numeric:** example tiles (section 2) and state-comparison bars (section 4) are the only two places tabular figures cluster. Both are kept to **3–4 items, 3-up**, so they read calm, not dense.
- **Quiet/editorial:** neighbourhood cards, audience band, pricing teaser, blog rail, newsletter all sit at lower contrast, on generous padding, fewer-but-bigger.

**2. Two-column vs stacked, chosen per section (founder's ratified per-section rule).**
- **Stacked:** hero (centered, single column for one clean focal point), example tiles (heading then grid), world map (centered exploratory surface), neighbourhood cards, audience grid, pricing grid.
- **Two-column / split rows:** the state-comparison section pairs a lead block with the bar rail; the blog rail uses a two-part baseline-aligned header row (heading left, "All posts →" right); the **newsletter panel is genuinely two-column** (copy + form on the left, the live sample-report preview on the right) — this two-column panel is one of the deliberate rhythm-breakers.
- The grids themselves are multi-column (3-up tiles/cards, 4-up audience), satisfying the founder's "fix sparseness with BOTH two-column layouts AND more sections."

**3. Deliberate rhythm so five card grids never read as five clones.** This is the page's biggest cringe risk (a SaaS home tempts a wall of identical card grids: tiles, audience, pricing, blog, neighbourhoods are all card-shaped). The defense is **varying the card grammar** and **interrupting it with non-card bands**:
- numeric stats-cards (section 2) → **full-bleed map, no cards** (section 3) → horizontal honesty bars, not cards (section 4) → editorial gallery cards (section 5) → icon feature cards (section 6) → pricing cards (section 7) → blog cards (section 8) → **a single two-column panel, not a grid** (section 9).
- So the sequence reads: cards → map → bars → cards → cards → cards → cards → panel. The map (section 3) and the panel (section 9) are the two structural circuit-breakers that keep the middle run of cards from feeling like an AI card-wall, and each card *type* is visually distinct (numeric vs editorial-with-cover vs icon vs price).

**4. Where it breathes.** Every band is separated by a full-width hairline divider and/or a tone shift (the hero's atlas-50 gradient ground, the map band's `cream-100` paper, the newsletter's atlas-50 panel). Vertical padding is generous (the spec's `py-12 / md:py-16+` register; the mockup uses `52px` section padding and `60–64px` on the full-bleed map). The page alternates **dense (tiles/bars) with airy (map/audience/blog)** so it never stacks two stat grids back to back.

**Typography discipline (the second-biggest risk: two display moments fighting).** Only the hero question is Newsreader-large. Every section H2 steps down clearly (`clamp(26px, 3.2vw, 36px)`) with a ≥1.25 ratio gap from the hero, so nothing competes. Every number — on tiles, bars, prices, dates, the sample report — uses **tabular lining figures** (`.num` → `font-variant-numeric: tabular-nums lining-nums`). Body copy stays a controlled 60–75ch measure. Newsreader for headlines + the hero; Inter for everything else; loaded via one Google Fonts link in the mockup, `--font-display` / `--font-sans` in the app.

**How sample/unheld sections appear (the founder's choice + the spec's collapse rule).** This page is almost entirely real or editorial, so it carries **no long run of unheld sections and no fake-number risk.** Two sections are structurally fragile:
- **State comparison (4)** and **neighbourhood cards (5)** each **self-omit silently** (the loader returns nothing → the band simply does not render; no stub, no skeleton, no "coming soon").
- If — and only if — *both* fail at once, they **collapse into a single calm `SectionEmpty` strip**: a muted `cream-100` panel with one line "More comparisons are filling in." in Inter muted, no number, no skeleton, no stub.
- The **default mockup shows everything filled** (both fragile sections resolve). A **second, smaller, clearly-labelled mockup state** demonstrates the single collapsed "filling in" strip for the founder, marked "Failure state (shown for review only)."
- The newsletter's sample-report image must be a **real preview render** (the live miniature per-$100 bar), **never a placeholder image slot** (the cloudfront-placeholder ban from the constraint flags).

---

## The signature graphics (exact spec)

There are three non-trivial graphics on this page. Each names its grammar, its block/chart mapping, its data shape, and the correctness/honesty rule applied.

### G1 — The world-map city picker (section 3)
- **Chosen type:** a stylized, calm, **clickable world map** with accent pins on covered regions. This is the brand-signature surface and the founder's ratified "stylized clickable world map" decision.
- **Block/chart mapping:** **KEEP the bespoke `WorldMapSection`** — do NOT swap it for a shadcnblocks block, and do NOT render it as a data viz (no choropleth, no bubble-by-value). It is an exploratory navigation surface.
- **Data shape:** `{ continents: SVGPath[] }` (static, muted geometry) + `pins: { city: string, x: number, y: number, href: string }[]` placed on covered regions only.
- **Computed geometry (correctness):** the map uses a `viewBox="0 0 880 420"`. Each pin transform must sit **inside its continent blob**, not floating in the ocean. The mockup's verified placements: San Francisco `translate(150,150)` inside the North-America blob; Barcelona `translate(458,138)` inside the Europe blob; Lagos `translate(470,250)` inside West Africa; Tokyo `translate(788,150)` at the eastern edge of the Asia blob. When adding pins, compute the centroid of the target continent path and keep the label `text-anchor="middle"` with `y="-22"` above the dot so labels never collide.
- **Pin construction:** three stacked circles per pin — an outer `r=14` atlas-500 at 16% opacity (halo), an `r=6` atlas-600 solid (the dot), an `r=2.4` cream-50 center (the highlight). Continents are `cocoa-300` at 55% opacity with a `cream-400` hairline stroke. **One loud accent only**, and only on the marked cities; the continents stay quiet.
- **Honesty rule applied:** no coverage vanity counter ("190 countries!"), the caption is a plain invitation ("Open a country, then a city, then the trade. Every pin leads to real take-home numbers, not an estimate."). Pins lead only to real, covered cities — never to a region with no data behind it.
- **Accessibility:** `role="img"` with `aria-label="A simplified world map with four city pins"`; pin labels are real `<text>` (legible, not decorative). At 375 the SVG scales to a calm static image (`width:100%`).

### G2 — The state-comparison like-for-like bars (section 4)
- **Chosen type:** **like-for-like horizontal bars** — the same trade across 3–4 comparable US states. No winner crown.
- **Block/chart mapping:** **KEEP kit `LikeForLikeBars` / `ComparisonBars`** (visx + hand-SVG on warm tokens). The honesty rail is load-bearing; do **not** substitute a generic shadcnblocks/Recharts bar, which would silently crown a leader and lose the empty state. (Founder's chart decision says "shadcnblocks charts throughout" with the honesty rules ON TOP — here the honesty rail wins and the kit primitive is retained, per the chart-system rule that the kit is KEPT where the rail is load-bearing.)
- **Data shape:** `rows: { label: string /* state */, value: number /* typical revenue/yr, same currency */, widthPct: number }[]`, 3–4 rows, all USD, one trade.
- **Computed geometry (correctness):** bar widths are proportional to the **largest value** in the set. In the mockup, California `$1.18M` = 100%, New York `$1.07M` = 91%, Florida `$945K` = 80%, Texas `$902K` = 76%. Every percentage must be `round(value / max * 100)`. End labels are direct, right-aligned, tabular figures.
- **Honesty rules applied (non-negotiable):**
  - **No winner crown, no league-table ordering.** On the home page the user has picked nothing, so there is **no subject bar** — all bars are neutral `cocoa-300`, and the row order is deliberately **not pure descending** so it never reads as a ranking. (When this same primitive runs on a cell/report page where the user *did* pick a subject, that one bar becomes atlas-500 and the rest stay neutral; on home, none is the subject.)
  - **Never rank across business × geography.** This is one trade across like states only.
  - **Like-for-like caveat is mandatory:** "Same trade, same currency, four comparable US states. Not adjusted for local prices or rent, so this is a like-for-like read, not a ranking of where to open."
- **Empty/collapse behavior:** if the distinct-values gate fails (values too similar or too few), the whole section self-omits; if both this and section 5 fail, the single collapse strip shows.

### G3 — The sample-report preview: miniature per-$100 split (section 9)
- **Chosen type:** a **true miniature per-$100 stacked horizontal bar** plus a legend — a real shrunk render of the cell page's per-$100 money-split grammar, used as the lead-magnet's proof-of-payload. (This is the page's "where every $100 of revenue goes" graphic, reusing the kit `Waterfall` / 100%-wide stacked grammar; **never a pie**.)
- **Block/chart mapping:** the cell page's `.bar100` grammar (kit per-$100 split), shrunk into the `cta10`/Banner panel as the sample image. It is a real render, satisfying the "no placeholder image slot" rule.
- **Data shape:** `segments: { label: string, dollars: number, color: token }[]` that **must sum to exactly 100**.
- **Computed geometry (correctness):** segment widths are the dollar values themselves (they are out of $100, so width% = dollars). The mockup: Cost of goods `$30`, Payroll `$33`, Rent `$18`, Everything else `$12`, Owner keeps `$7` → `30 + 33 + 18 + 12 + 7 = 100`. Verify the sum on every fill. The legend repeats the five segments with right-aligned tabular dollar values; "Owner keeps" is the emphasized row (bolder, darker label).
- **Honesty rule applied:** **moss (`--moss-600`) is the kept/positive segment** ("Owner keeps $7") — the one place moss appears on the page. Cost mass is cocoa/ink/cream neutrals. The "$7" callout sits on the moss segment so the owner-kept slice is emphasized (the honesty rule: emphasize the owner-kept slice). The block is explicitly tagged "Sample preview" and captioned "A preview of the layout, not a live read." so it is never mistaken for a live figure.

---

## Shared assets used

The founder ratified three site-wide shared visual assets (a stylized world-map motif, a consistent icon set, section dividers). The Home page is the first and most expressive home for all three.

1. **The stylized world-map motif** — appears once, at full strength, as the section-3 city picker (`WorldMapSection`). This is the boldest expression of the shared map asset anywhere on the site; the same simplified continent geometry + accent-pin grammar is reused (smaller, quieter) on other page types. Quiet `cocoa-300` continents, single-accent pins, no data-viz coloring.
2. **The consistent icon set** — used in: the navbar (search glyph, dropdown chevrons, hamburger), the audience band (4 role icons, one terracotta `atlas-700` glyph on `atlas-50` chip per card), the "→" forward affordance on every "Open this benchmark", "All posts", and CTA, and the footer. All icons are the same stroke weight (`1.8`), same `stroke-linecap="round"` / `stroke-linejoin="round"`, same 22–24px box.
3. **Section dividers** — a hairline `1px cream-300` rule (`section.block + section.block { border-top }`) between every band, plus tone-shift grounds (atlas-50 hero gradient, `cream-100` map paper, atlas-50 newsletter panel) that act as heavier dividers between the loud bands. These are what let the page run information-dense without bands bleeding into each other.

The hero question rotation is powered by `RotatingWord` over the shared `HERO_BUSINESSES` / `HERO_CITIES` arrays (a shared data asset, frozen to one frame in the mockup). Pricing reads the shared `TIERS` constant. The footer/navbar are the shared `footer7` / `navbar1` blocks themed by the one token map.

---

## Exemplar data to fill

These are the exact real / London-UK exemplar / clearly-sampled values each section carries in the default (filled) mockup. All numbers are tabular figures; all are illustrative of the filled exemplar in the static mockup (the legal strip says so), and all map to real cells in production.

**Section 1 — Hero (rotating question + search), frozen frame:**
- Eyebrow: "The atlas of local profit intelligence"
- Question H1 (one frozen frame of the rotation): "How much does a **coffee shop** make in **Barcelona**?" (rotating slots in atlas-700)
- Subtitle: "Know if a business works before you risk your money."
- Navigator (resting state): Business = "Coffee shop"; Place = "Barcelona, Spain"; submit = "Show the numbers →"

**Section 2 — Live example tiles (3-up, the first real numbers):**
- Eyebrow "Or open a real one"; H2 "Numbers people actually search for"
- Tile 1: Restaurants · Barcelona, Spain · **$31K** · "Owner keeps about this a year"
- Tile 2: Software developers · San Francisco, California · **$118K** · "Owner keeps about this a year"
- Tile 3: Law firms · United Kingdom · **$96K** · "Owner keeps about this a year"
- Each carries "Open this benchmark →". (Numbers sanity-floored at $15K; these are absolutes, not deltas, so no change-arrows.)

**Section 3 — World map city picker:**
- Eyebrow "Pick a country"; H2 "Start anywhere on the map"
- Four accent pins: **San Francisco, Barcelona, Lagos, Tokyo** (placed inside their continent blobs per G1 geometry)
- Caption: "Open a country, then a city, then the trade. Every pin leads to real take-home numbers, not an estimate."

**Section 4 — State comparison (like-for-like bars, USD, one trade, neutral bars):**
- Eyebrow "The same trade, different states"; H2 "Restaurants across four large US states"; lead "Typical revenue a year, read each on its own terms. No league table here."
- Texas **$902K** (76%) · California **$1.18M** (100%) · Florida **$945K** (80%) · New York **$1.07M** (91%) — order intentionally non-descending; all bars neutral cocoa.
- Caveat: "Same trade, same currency, four comparable US states. Not adjusted for local prices or rent, so this is a like-for-like read, not a ranking of where to open."

**Section 5 — Neighbourhood proof cards (3-up editorial, no numbers):**
- Eyebrow "Down to the neighbourhood"; H2 "The texture behind the numbers"
- Card 1: **Queens, New York** · tier "Mid" · Known for "Immigrant-owned restaurants, specialty grocers, car repair" · Don't miss "Flushing has the second-largest Chinatown in the country and, many argue, the best Chinese food in it."
- Card 2: **Le Marais, Paris** · tier "Expensive" · Known for "Design boutiques, small museums, kosher bakeries" · Don't miss "Place des Vosges, from 1612, is the oldest planned square in Paris and one of the most elegant in Europe."
- Card 3: **Shitamachi, Tokyo** · tier "Mid" · Known for "Craft shops, traditional sweets, family-run inns" · Don't miss "Yanaka Ginza, where you can buy the same fish cake from the same family that has made it since the 1940s."
- (Covers are token gradients only; no fabricated place detail; no numbers in this band.)

**Section 6 — Audience band (4-up icon grid, editorial positioning):**
- Eyebrow "Who it's for"; H2 "Built for the people who price a business for a living"
- Private equity and investors — "Size a market and sanity-check a target before the first call."
- Marketing and growth agencies — "Understand a client's real economics before pitching a budget."
- Management consultants — "Benchmark an industry in minutes instead of a research week."
- Founders and operators — "See what a business keeps before risking your own money."
- (PE/consulting/agencies framed as clients, never as subjects to badmouth.)

**Section 7 — Pricing teaser (3 tier cards, prices from `TIERS`):**
- Eyebrow "Free and paid"; H2 "Every benchmark is free to read"; lead "Paid tiers add deeper quartiles, saved cells, comparison, and the data out of the page."
- **Free $0** — "Read any cell: the median, the top decile, and the bottom decile." Checks: Median/top/bottom decile ✓; Lower & upper quartile −; Year-over-year change −; Saved cells −. CTA "Start reading".
- **Basic $37 / month** — "The quartiles, the year-over-year moves, and your saved cells." Checks: Everything in Free ✓; Lower & upper quartile ✓; Year-over-year change ✓; Up to 25 saved cells ✓. CTA "Choose Basic".
- **Premium $77 / month** (featured, badge "Most picked") — "Side-by-side comparison, CSV export, and the deeper bands." Checks: Everything in Basic ✓; Side-by-side comparison ✓; CSV export ✓; Unlimited saved cells ✓. CTA "Choose Premium".
- Footer link "See everything in each tier →". Checks render in moss (`--moss-600`); dashes/off-rows in faint cocoa (`--cocoa-300`). Tabular figures on prices.

**Section 8 — Blog rail (3-up):**
- Eyebrow "Writing"; H2 "From the Atlas notebook"; header link "All posts →"
- "Why bakery margins in Tokyo are half what they are in Paris" — May 12, 2026 — "Rent per square meter, flour pricing, and a labor market that punishes scale." (cover initial "W", atlas gradient)
- "The new mid-market: services firms in 100-employee tiers" — May 5, 2026 — "Where the headcount band stopped being a back-office detail and started shaping margin." (cover initial "T", moss gradient)
- "PPP vs FX: which one belongs in a margin comparison" — April 19, 2026 — "A short, opinionated case for using PPP when the question is about lived economics." (cover initial "P", amber gradient)
- (Dates in tabular figures; excerpts clamped to 2 lines; token-gradient covers from `BLOG_FALLBACK` when no image.)

**Section 9 — Newsletter / free report (two-column panel + real sample preview):**
- Eyebrow "Free benchmark report"; heading "The state of small-business margins, once a month"
- Bullets: "One free benchmark report, no card required." / "A new trade or city pulled apart in plain language." / "The honest read: what the owner actually keeps."
- Form: email placeholder "you@company.com" + "Send me the report"
- Sample-report preview (right column, tagged "Sample preview"): title "Restaurants, Barcelona"; subtitle "Where every $100 of revenue goes"; per-$100 bar Cost of goods **$30** / Payroll **$33** / Rent **$18** / Everything else **$12** / Owner keeps **$7** (moss, callout on bar); caption "A preview of the layout, not a live read." (Segments sum to 100; "Owner keeps" emphasized.)

**Global chrome:**
- Navbar wordmark "Margin **Atlas**" (Atlas in atlas-700); menu Countries / Industries / Cities / Compare; CTA "Get the data".
- Footer wordmark + blurb "What a business actually makes, in a specific place, with real numbers. Read any benchmark free."; columns Explore (Countries/Industries/Cities/Compare), Product (Pricing/The data/Notebook/Free report), Company (About/Methodology/Contact/Terms); legal strip "Home page mockup, Wave 1. Example numbers and the Barcelona, UK and US figures are illustrative of the filled exemplar, not a live read. The sample-report block is a labelled preview."

**Failure-state variant (review-only, not shipped):** eyebrow "Failure state (shown for review only)"; H2 "If both comparison sections fail to resolve at once"; explainer; single strip line "More comparisons are filling in."

---

File written from grounding only; no edits made to the repo. Source files read: `E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/02-home.md`, `E:/atlas/home.html`, `E:/atlas/website/docs/superpowers/plans/2026-06-16-visual-upgrade/01-component-and-chart-system.md`.
