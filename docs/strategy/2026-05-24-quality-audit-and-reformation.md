# Quality audit + reformation plan (v32)

> Page-by-page audit and reformation roadmap for marginatlas.com. Editorial
> standard: Stripe-level polish, FT-grade restraint. Calm, dense,
> trustworthy. No marketing fluff, no decorative cards, no scroll fatigue.
>
> Audit conducted 2026-05-24. Companion to:
>   - `2026-05-24-research-prompt.md` (monetization brief)
>   - `2026-05-24-monetization-research.md` (research first-pass)
>   - `2026-05-24-typography-prompt.md` (typography brief)

---

## The editorial bar

Three rules every page is judged against. If a section fails any of them,
it's flagged for reformation.

1. **Every section earns its place.** If it can be removed without losing
   meaning, it should be. Editorial sites have 5-8 sections on a homepage;
   ours has 17.
2. **No card that says nothing.** A card with a marketing claim where a
   number should be (e.g. "Worldwide" instead of "194 countries") is a
   self-inflicted wound on trust.
3. **No duplication.** If two sections say the same thing, one of them
   gets cut.

---

## Verdict at a glance

| Page | Verdict | Rationale |
|---|---|---|
| Homepage `/` | **REFORM** | 17 sections, multiple duplicates, marketing-fluff stats strip, unprovable "№ 1" claim |
| `/[country]` | **POLISH** | Recently rebuilt (v32). At-a-glance row is good; sector pages below are fine. Minor copy polish needed. |
| `/[country]/[geo]/[industry]` (cell) | **POLISH** | Largest surface; structurally sound after v23-v30 work; minor duplication around CoverageIndicator + EditorialNote + narrative. |
| `/browse` | **POLISH** | Just rewritten (v32). Looks solid. |
| `/coverage` | **POLISH** | Just rewritten (v32). |
| `/world` | **POLISH** | Just touched (v32). Map needs the zoom button visual confirmation. |
| `/industries` | **REFORM** | Founder explicitly called the "By sector" pill-chip layout "a dump." Confirmed. |
| `/sectors/[sector]` | **POLISH** | Header_color square next to icon is toy-like; the rest is fine. |
| `/calculator` | **REFORM** | Generic form. No personality. Founder explicitly queued for redesign. |
| `/compare` | **REFORM** | Bare header + Suspense fallback. Page presents almost no value above the fold. |
| `/pricing` | **REVIEW** | Pricing is $19 / $79; research suggests $29 / $99-$149. Tier names and features are reasonable. Decide pricing direction first. |
| `/about-data` | **POLISH** | Placeholder image at top should die. "40+ countries" copy is stale (we have 194). Coverage-tier blocks use bright color boxes (emerald/sky/amber) that read as cheap. |
| Footer | **DONE (v32)** | Now uses atlas-paper-dark. |
| Header | **POLISH** | Nav label fixed in v32. Search bar styling fine. |

---

## Section 1: Homepage reformation (highest priority)

### Current section inventory (17 sections, too many)

In render order:

1. Hero (rotating-word headline)
2. NavigatorForm
3. WorldMapSection (the interactive globe)
4. ExploreCards (image-card explore section)
5. Cities band (London photo)
6. FEATURED grid (6 tiles)
7. DidYouKnow (rotating factoids)
8. SectorMasterMenu
9. CellOfTheWeek
10. TaxOverlayTeaser
11. AskWidget (Ask Atlas)
12. HomepageEditorialBlocks (3 sub-blocks)
13. QualityLegend
14. Stats strip
15. Methodology paragraph block
16. Blog rail
17. NewsletterSignup

### Specific findings

**1. KILL: the "Stats strip" (page.tsx lines 324-337).**

```jsx
{[
  ["Worldwide", "every country covered"],
  ["Every SMB industry", "from cafés to manufacturing"],
  ["Free", "to browse"],
].map(...)
```

This renders the word "Worldwide" in a 3xl tabular-nums font as if it
were a number. It's marketing copy formatted as a stat tile. Founder
rule: cards that don't carry numbers should not look like numerical
cards. **Kill the whole section.**

**2. KILL: the "№ 1 site for tracking small to medium business
benchmarks globally" eyebrow (page.tsx line 140).**

Unprovable claim. Brand-corrosive. Marketing-fluff voice on an editorial
site. Replace with a quiet eyebrow like "Worldwide small-business
benchmarks" or just drop the eyebrow entirely and let the headline carry
the page.

**3. KILL or RELOCATE: the "Methodology paragraph block" (lines 344-383).**

Three paragraphs of methodology on the homepage. Belongs on `/about-data`.
The homepage already has Block B of `HomepageEditorialBlocks` ("Every
cell carries one of three coverage tiers"). That's the same content
twice. Pick one — recommend the editorial-block version stays
(more visual) and the paragraph block goes to `/about-data` proper.

**4. KILL: `HomepageEditorialBlocks` Block C (the audience archetypes).**

If it exists. Audience-archetype blocks are SaaS-landing-page muscle,
not editorial. Skim and confirm.

**5. KILL: `QualityLegend` on the homepage (line 320).**

Legend for the coverage tier vocabulary. Useful in context (on a cell
page where the chip appears) but on the homepage it's a lecture before
any context. Cut.

**6. KILL: `TaxOverlayTeaser` (line 294).**

Teases a feature ("there's a tax overlay!") rather than showing data.
Editorial sites don't have feature-teaser sections. If the tax overlay
matters, it shows up where the user encounters tax (cell pages).

**7. DEFER or KILL: `AskWidget` (line 300).**

If "Ask Atlas" is live, it's a strong differentiator. If it's not live
or returns generic LLM answers without data citation, it's a liability.
Check live status; defer if not ready, kill if it's a half-product.

**8. CONSIDER MERGE: `CellOfTheWeek` + `DidYouKnow` + Blog rail.**

Three "editorial novelty" sections on one page. Pick one as the
editorial signature. Recommend: keep the blog rail (the article-card
grid feels editorial and ranks for SEO), drop `CellOfTheWeek` and
`DidYouKnow` as standalone bands. The "interesting fact" content can
live inside a single curated rail.

**9. POLISH: `SectorMasterMenu` placement.**

If it's the 8th section in scroll order, most users never see it. Move
it earlier — right after the world map or under the hero. The sector
menu is one of the three primary navigation paths and deserves the
real estate.

**10. POLISH: `ExploreCards` (line 198).**

Image-card explore section. Founder previously flagged photos as making
the site look unprofessional. Confirm what images are in `ExploreCards`
and whether they're stock or stylized. If stock, drop them.

### Recommended homepage after reformation (8 sections, ranked by user flow)

1. **Hero** — quiet eyebrow + rotating-word headline + 1-line tagline.
   No marketing claim.
2. **Navigator** — the primary entry form. Country + industry + city.
3. **World map** — secondary navigation path; visual + interactive.
4. **Featured benchmarks** — 6 hand-picked cells, the "start with
   something familiar" framing.
5. **Sector master menu** — the third navigation path. Moved up from
   8th to 5th position because it's a primary intent.
6. **How the numbers are built** — the 3-step pipeline (existing Block
   B), reframed as a single section instead of part of the editorial
   block trio.
7. **From the notebook** — blog rail of 6 posts.
8. **Newsletter** — calm signup.

That's 8 sections, with one parchment newsletter strip + dark footer
endzone. Right length for an editorial homepage.

### Editorial-tone copy rewrites (homepage)

| Current | Reformed |
|---|---|
| "№ 1 site for tracking small to medium business benchmarks globally" | "Worldwide small-business benchmarks" |
| "How much does a [BUSINESS] make in [CITY]?" | Keep — strong rotating headline. |
| "Revenue, margins, and what they actually mean, for the businesses behind every street." | Keep — strong tagline. |
| "Start with something familiar" (featured grid header) | Keep — calmly editorial. |
| "Browse everything →" (featured grid link) | Keep. |
| "Drilled to the neighborhood" (cities band) | Keep — strong. |
| "Built differently than what you've seen before" (methodology h2) | "How we build the numbers." Drop the comparison. |
| "Atlas combines machine-learning aggregation over hundreds of public and closely-held data streams..." | "Atlas pulls from official small-business statistics, primary filings, and on-the-ground correspondents. Every benchmark is cross-validated and carries a quality grade A through D, so you always know how directly it was sourced." (cut the "machine-learning aggregation" jargon and the redundant second paragraph) |
| "Worldwide / every country covered" (stats strip) | KILL the whole strip. |
| "Every SMB industry / from cafés to manufacturing" | KILL. |
| "Free / to browse" | KILL. |

---

## Section 2: `/industries` reformation

### Current state

Three sections:
- **Popular industries** — 12 emoji+name tiles. Visually busy, all the
  same weight, no information density.
- **By sector** — every sector with its industries as pill-chips below
  the sector heading. Founder's literal call: "the industry part is
  again, just a dump and impossible to be understood."
- **A-Z** — 192 industry names in 4-column list, alphabetical. Useful
  as an index but not as a default experience.

### Specific findings

- The pill-chip cloud under each sector reads as "we have a lot of
  things" instead of "here's where to start." Visual noise hides
  meaning.
- No data anywhere on the page. An industries directory with zero
  numbers feels like a sitemap.
- "Popular industries" tiles are redundant with the homepage Featured
  grid.
- The pillar shape (Popular → By sector → A-Z) puts the heaviest dump
  (By sector) in the middle, hiding the cleanest entry point (A-Z) at
  the bottom.

### Reformation

Replace with a structure that mirrors what `/browse` does:

1. **Hero**: "Every industry, ranked by typical revenue worldwide"
2. **Top 20 by global revenue** — a numerical table, not a chip cloud.
   Industry name, sector, typical revenue worldwide (the same data we
   show on the homepage Featured tiles, but for the top 20). Sort by
   revenue. This is the IBISWorld move — turn the index into a ranking.
3. **By sector** — 20 sector tiles (NOT pill-chips). Each tile shows
   the sector name, icon, 3 example industries, and a count.
4. **A-Z** — the existing 4-column alphabetical list. Useful as
   a structural fallback for SEO.

Skip the standalone "Popular industries" section entirely — duplicates
the homepage.

---

## Section 3: `/calculator` reformation

### Current state

Bare form. Eyebrow + h1 + 1-paragraph tagline + the form + two link
cards at the bottom + a footer disclaimer. Total page is 79 lines.
Founder explicitly queued for redesign with phrase "denser first frame,
detailed personalized output."

### Reformation (sketch)

The calculator should be a *page* not a form. Restructure:

1. **Hero**: 2-column layout. Left: title + tagline. Right: a real-time
   compact form (country / industry / your revenue).
2. **Result panel**: appears on the right under the form when filled.
   Shows the percentile, the median, the 10th, the 90th, and a small
   bar chart with the user's position marked. This is the personalized
   output the founder wants.
3. **What this means**: 2-3 sentences of editorial framing of the
   result. Auto-generated from the percentile (e.g. "You're in the
   top quartile for restaurants in California. Half of restaurants
   make less than $X; the top 10% clear $Y.").
4. **Next**: clear CTA to view the full cell page.
5. **Related calculators**: 4-6 nearby industries / cities to try
   next. Each is a one-click pre-filled link to the calculator with
   the new parameters.

Implementation note: this is medium-effort (the result panel needs
real distribution data and percentile math). Defer until the v33
sprint; ship the polish round first.

---

## Section 4: `/compare` reformation

### Current state

26 lines. Bare h1 + tagline + Suspense fallback for the client
component. The page above the fold is two lines of text.

### Reformation

Compare is one of the most powerful tools we have and the page is
embarrassed by it. Restructure:

1. **Hero**: clear value prop — "Side by side. Same industry across
   countries, or different industries in the same place."
2. **Default state**: show a meaningful example out of the box.
   Pre-loaded with 2 cells (e.g. Restaurants in NYC vs Restaurants
   in London). User can replace either, or add up to 4.
3. **Comparison table**: tabular, dense, all the data points (revenue,
   payroll, owner take, employees, sample size, distribution).
4. **Quick swaps**: a row of suggested comparisons under the table
   ("Add Tokyo restaurants?" "Compare to Cafes in NYC?").
5. **Save / share**: persistent URL with the comparison encoded, so
   shared links work.

---

## Section 5: `/about-data` polish

### Specific findings

- **Placeholder image at top** (`SmartImage` with glyph "📈"). The
  founder rule from v32 is no decorative images on overview pages.
  Delete.
- **"40+ countries" copy is stale**. We have 194 countries in the
  taxonomy. Replace with a dynamic count or "every country."
- **5-star quality rating section** — uses literal star characters
  (★) which read as a hotel review widget. Doesn't match the rest of
  the site's coverage-tier vocabulary (Measured / Regional /
  Estimated / Modeled). Reconcile.
- **Coverage-tier color blocks** — emerald-50, sky-50, amber-50,
  stone-50 backgrounds. Bright pastel boxes feel like a SaaS
  documentation page, not editorial. Recommend: switch all four to
  the neutral atlas-paper-card surface with a small color dot.
  Founder palette is vermillion accent on neutral surfaces; no
  emerald, no sky.
- The page is one long article on a `max-w-2xl` column. That's fine
  for an article. But it could carry a small sticky TOC on the right
  for jump-navigation.

---

## Section 6: `/pricing` decision required

### Current state

3 tiers: Free / Pro $19 / Team $79. Feature matrix with 27 rows. FAQ.
Page is well-built structurally.

### Decision required (founder)

Two questions before any pricing-page work:

1. **What's the right price?** v32 research recommends $29-$39 for Pro
   and $99-$149 for Professional. Current page is $19/$79. Decide
   before shipping.
2. **Are the tiers right?** Current Pro is built around saved cells,
   alerts, exports. Research recommends Pro should be built around
   **resolution unlock** (decile distribution, city-cut, sub-industry,
   time-series-history). The two product shapes are different.

Recommend pausing pricing-page changes until the research-prompt
external responses are in and the founder makes the call.

---

## Section 7: Cell page polish (`/[country]/[geo]/[industry]`)

The cell page is the heaviest, most-trafficked surface. Structurally
sound after v23-v30 work. Specific polish items:

1. **`CoverageIndicator` + `EditorialNote` + narrative paragraph** — three
   pieces of editorial framing stacked at the top. Confirm they're
   distinct (CoverageIndicator = tier chip, EditorialNote = one-line
   context, narrative = data-cited paragraph). If two of them say
   similar things, merge.
2. **`AtlasScore`** — composite 1-10 score. Was demoted in v30 to a
   single-row chip; confirm it's still visually quiet.
3. **"Send a correction" section** — at the bottom of every cell page.
   Useful for trust but should be small, late, low-key. Confirm placement.
4. **Related-cells / related-industries / across-states-or-countries**
   — three "related" sections. Risk of feeling repetitive. Sequence
   so each adds a distinct angle (geographic neighbors → industry
   siblings → cross-country same-industry).
5. **Cell page is 894 lines.** Worth a refactor pass — extract each
   section into its own component for legibility.

---

## Section 8: Dark pattern application — done in v32

Footer now uses `atlas-paper-dark`. Other candidates for the dark
pattern that were considered and deferred:

- **Newsletter signup bar** — stays parchment for now (the cream→dark
  transition under it reads cleanly).
- **Hero on heavy editorial pages** (blog covers, "Decade of X"
  articles) — strong candidate. Apply when those pages ship.
- **Pricing page** "compare plans" band — dark would frame the matrix
  nicely.
- **Methodology page hero** — dark + the LogoMark in white would
  feel like an authored masthead.

No section currently maps to the `ink-dark` tone in `SECTION_TONES`,
so adding a dark hero just means setting one in that table.

---

## Sprint plan

### Sprint A (immediate — ship in this session)

Highest-impact / lowest-effort items from the audit. Quick wins to
demonstrate movement.

- [ ] **A1.** Kill the homepage Stats strip (lines 324-337). 5 min.
- [ ] **A2.** Kill the unprovable "№ 1 site for tracking..." eyebrow
  (line 140). Replace with calm editorial eyebrow. 5 min.
- [ ] **A3.** Move `SectorMasterMenu` from 8th to ~5th in scroll
  order. 10 min.
- [ ] **A4.** Polish the methodology paragraph block (drop the
  "Built differently than what you've seen before" comparison +
  "machine-learning aggregation" jargon). 10 min.
- [ ] **A5.** Fix `/about-data` stale "40+ countries" copy and kill
  the decorative top image. 10 min.

### Sprint B (this week — concrete reformations)

- [ ] **B1.** Reform `/industries`: replace pill-chip cloud with
  a top-20-by-revenue table + sector tiles + A-Z. ~3 hrs.
- [ ] **B2.** Drop `QualityLegend` from homepage; replace with a small
  inline link to `/about-data#coverage` where it belongs. 15 min.
- [ ] **B3.** Drop `TaxOverlayTeaser` from homepage. 5 min.
- [ ] **B4.** Drop `CellOfTheWeek` standalone band (consolidate
  curated content into the blog rail). 15 min.
- [ ] **B5.** Audit & decide on `DidYouKnow` and `AskWidget` (kill,
  defer, or polish based on live state). 30 min.
- [ ] **B6.** Reform `/about-data` coverage-tier blocks to neutral
  surfaces with color dots. 30 min.
- [ ] **B7.** Cell page polish: merge `CoverageIndicator` + `EditorialNote`
  + narrative into a cleaner single editorial header. ~1 hr.

### Sprint C (next sprint — bigger lifts)

- [ ] **C1.** Calculator redesign (real-time form + result panel +
  editorial framing). ~1 day.
- [ ] **C2.** Compare redesign (default-state example + denser
  comparison table + share URLs). ~1 day.
- [ ] **C3.** Cell page component extraction (894 lines → modular
  components). ~half day.
- [ ] **C4.** Pricing decision + tier-shape pivot pending research
  responses.

### Sprint D (dependent on external research)

- [ ] **D1.** Apply font pairing from typography research once external
  prompt answers are in.
- [ ] **D2.** Ship first paywall pattern (probably the locked-time-
  series treatment, since it's the lowest-risk gate).
- [ ] **D3.** Methodology page formal launch (will become the trust
  destination for SEO).
- [ ] **D4.** Glossary page (queued).

---

## Sprint A — execution log (running)

Items completed in the v32 session this plan was written in:

- Sprint A1, A2, A3, A4 — addressed in commit following this plan.
- Footer dark pattern — done in commit `0601947`.

Items still open: A5, all of Sprint B, C, D.

---

## How to use this doc

Treat the Sprint plan as the canonical to-do list for the next two
sprints. Each item has a file path or section reference back into the
audit so you can pick any item and execute it without re-deriving
context.

When you ship an item, mark the checkbox here so the next session knows
what's done.

For deletions: do the deletion in one commit, not bundled with
reformations. Deletions are reversible only via git, so an isolated
commit is the safety net.
