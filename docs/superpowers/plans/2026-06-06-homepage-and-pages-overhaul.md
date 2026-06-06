# Homepage + Pages Overhaul — Creative + Build Plan

**Date:** 2026-06-06
**Role:** creative strategist + copywriter + UI/UX lead.
**Branch:** `reform-v2/palette-brick`. Execute autonomously, ship to PREVIEW only; founder reviews and approves the production go-live on waking. Nothing auto-deploys to main.
**Authority docs:** `docs/strategy/REFORMATION-BIBLE.md`, `docs/strategy/PAGE-SKELETONS.md`.

## Creative thesis

The homepage and the front-facing hubs are failing one test: they describe instead of *show*. The Bible is blunt about the gap. "The white space is not data availability. Data exists. The gap is translation." And "the free portal must be useful enough to trust." Right now the free pages translate too little: they hand the visitor abstract framings (the average margin is the least useful number, market "mega", local "comfortable") instead of concrete, real, surprising figures that make a stranger feel the product in one screen.

The rule for every change below: **carry a real number, name the upside and the thing that can kill it, and make it scannable in seconds.** No card that does not carry a figure should look like a figure card. No whole-world averages. No stock imagery. Boring goes in deep pages; the front pages are curated, digestible, and a little addictive.

One consistent device runs through the whole plan: a **single branded table/stat-card language** (a tightened `StatGrid`/`DataSection`, plus a new `StatCard` and `RankRow`), so the homepage cards, the city cards, the country small-tables, and the activity tables all read as one family.

---

# PART 1 — Homepage (`src/app/page.tsx`)

Target flow (render order). KEEP hero + map + blog; rework the three vague middles; add three data-rich sections; simplify the methodology copy.

### 1.1 Hero — keep, minor
Rotating H1 + navigator stay. Tighten nothing further. (Already lifted + white.)

### 1.2 World map "Pick a country" — keep.

### 1.3 Rework: "The average margin is the least useful number" (`WhatAtlasWeighs`)
Problem: vague, gives no feeling; reads as a lecture. Keep the eight-factor spine the Bible names (rent, wages, taxes, competition, pricing power, owner take-home, survival, friction) but make each factor **concrete and felt** by attaching a one-line real consequence, not an abstraction. New H2 (copy direction): **"Eight forces decide whether you keep anything."** Each factor becomes a compact row: the force + a blunt felt line in the Bible's register (e.g. Rent pressure: "In the wrong street, rent alone can eat a fifth of every sale." Competition: "Forty barbershops in one district means nobody is full."). Remove any generic house/car/customer iconography; use a single restrained mark per row or none. Background white; separation by hairline.

### 1.4 "Drilled to the neighborhood" — keep, fix surface
Founder likes it. Change the light-gray band to white; remove the house/car/customer imagery feel (the `/london-cities.png` stylized map stays only if it reads as data, not decoration; otherwise replace with a neighborhood stat snippet). Keep the "Browse cities" CTA to `/cities`.

### 1.5 Replace: "See where the money actually is" -> THREE indicative editorial cards
This is the founder's idea and it is the right one. Replace the six featured tiles with **three large editorial cards**, each a real industry-in-place with real figures, written to grab:
- **Restaurants in Barcelona**
- **Legal services in the United Kingdom**
- **Gyms in Miami**
Each card: the place + business as the headline, then 2-3 real figures pulled live from the cell (typical revenue, owner take-home, survival to year 5 or break-even), then a one-line editorial hook that names the upside AND the killer (Bible rule), then a quiet "See the full read" link to the cell. Editorial voice, attention-first, but every claim is a real number from `getCellBySlug`. New eyebrow "Three real reads" / H2 direction: **"The same question, three very different answers."** Data: live cells (`/es/barcelona/restaurants`, `/gb/london/legal-services` or the UK default geo, `/us/miami/sports-fitness`); if a slug does not resolve, fall back to the nearest resolvable tuple and log it (never render a broken card).

### 1.6 NEW: a ranked "leaderboard" strip (addictive, real)
A horizontal ranked strip that rewards browsing: **"Where a [rotating business] pays the most"** — top 5-7 places by owner take-home for one business, ranked 1..7, each a `RankRow` (rank + place + figure + a one-word texture). Rotates the business (or is server-picked) so it feels alive. Pulls from the same across-places reads the activity page already uses (`getSameIndustryAcrossStates` / `getSameIndustryAcrossCountries`), trimmed by the existing outlier fence so no garbage tails. This is the "browse the world like a reference book" hook the Bible's curious-reader audience wants, and it carries hard numbers.

### 1.7 NEW: one "surprising spread" line (editorial, real)
A single wide editorial statement card built from a real comparison: e.g. "A gym in Miami can clear more than a law firm in [city]" with the two real take-home figures beneath, and a quiet link to the compare view. One per load, server-selected from a small curated set of true comparisons (verified against live cells at build, never invented). This is the addictive, share-worthy beat. Strictly one, so it stays special.

### 1.8 Rework: "The simple questions a working operator asks" (Block A)
Less vague. Keep the six decision-first questions but give each a **teaser answer** — the question plus the shape of the answer it lands on (a number or a verdict word), so it reads as "ask this, get this" not a list of prompts. Each still links to a live cell.

### 1.9 Rework: methodology / "three coverage tiers" (Block B) — plain-language copy
Too technical. Rewrite in operator language. New H2 direction: **"How we know, and how sure we are."** Three steps in plain words: "Measured where governments publish it. Benchmarked from the region next door where they do not. Estimated, and labelled as such, for the long tail." Keep the link to `/methodology`. No jargon, no pipeline-speak.

### 1.10 Blog — keep as is.

### 1.11 Homepage section additions from the Bible (the "more sections" ask)
The Bible's homepage skeleton plus its "free pages build trust and drive sharing" mandate support adding, in priority order: (a) the three editorial cards [1.5], (b) the ranked leaderboard [1.6], (c) the surprising-spread beat [1.7]. If more length is wanted, a fourth data-rich beat: a compact **"What surprises operators"** row of 3 true, numeric findings (e.g. "Barbershops out-earn many consultancies, per owner"), each linking to proof. All carry numbers; none are SaaS filler. The removed sections (DidYouKnow, stats strip) are NOT revived in their old number-less form.

---

# PART 2 — Cities directory (`/cities`, `src/app/cities/page.tsx` + `city_directory.ts`)

### 2.1 Map at top — already done (confirmed `CitiesWorldMap` is first). No change.

### 2.2 Replace qualitative signals with real city CARDS (single column)
Kill the "market mega / local comfortable / visitors popular" word-signals — they tell nothing. Each city becomes a **card in a single column**, carrying three real hero stats (all already in `city_list_v1.json`, no sourcing):
- **Visitors / year** (`tourist_arrivals_m`)
- **Average salary** (`avg_gross_salary_usd_year`)
- **Metro GDP** (`gdp_b`, add this row; currently loaded but unrendered)
Card = city name (link) + flag + the three stats as a tight branded stat row. Modeled-data footnote where the file flags approximation. Drop HDI per founder.

### 2.3 "Where customers are visitors, not locals" -> ranked top-10 horizontal
Turn the soft middle card into a real **ranked 1..10 horizontal strip**: the ten cities worldwide with the most extreme visitor-to-resident ratio (`tourist_arrivals_m / pop_m`), ranked, each showing the ratio. This is a genuine, surprising, browsable leaderboard. Reuse the `visitorLed` computation, raise the cap to top 10, present as `RankRow`s.

### 2.4 Scrap the grouped directory dump
Remove the "Global metropolises / Major and capital / Secondary cities" grouped list entirely — it duplicates the country pages and reads as a dump. `/cities` becomes: map -> header -> the ranked visitor-led top-10 -> the single-column city cards (2.2). Curate the card set to the covered/notable cities rather than every row, so it is a showcase, not a directory.

---

# PART 3 — Global activity page (`/industries/[industry]`)

### 3.1 Lead with a geography selector, not universal numbers
The generic, place-agnostic numbers at the top are not relevant to a visitor who clicked their own business. Replace the top with a prominent **"See it for your place"** selector: pick a **country**, then a **city**, then go — routing to `/[country]/[city]/[slug]` (the cell). This is the decision-first answer the Bible demands ("lead with the answer"). The selector is the hero of this page. Keep the economics numbers the founder likes, but DEMOTE them below the selector and frame them as "the shape, before you pick a place" (the cross-place range stays, per the no-worldwide-average rule).

### 3.2 Put the qualitative sections in their own tables
Market structure, pricing power, labor and skills, survival baseline each become **its own small branded table** (the shared table language), not a flat dashed row list. Populate from the curated activity archetypes where they exist (survival has the London-derived archetype); where a field is genuinely unheld, the table shows the dash, but the structure reads as an intentional table, not an empty block. (Curating the worldwide archetypes to fill these is a follow-on data task, noted below.)

---

# PART 4 — Country pages (`/[country]`)

### 4.1 Everything in small branded tables
The country data must read as a set of **distinct small tables**, one per section (climate, tax, friction, labor, market), all sharing the one site-wide table format — not one undifferentiated grid. Apply the shared table language so a country page, an activity page, and a cell page all feel like the same product.

### 4.2 Restore the hero background image
Country pages lost their photo hero in the board rebuild. Bring back a tasteful country hero image (the existing Wikimedia hero path, `CityHero`-equivalent) behind the masthead, duotone or low-opacity so the white system still reads and the data stays legible. This is the deliberate exception to pure-white: the country masthead carries an image; the body stays white. Same treatment available to city and activity mastheads if it reads well.

### 4.3 Symmetry: culture and government both at six metrics
Culture has 6 spectrum metrics, government has 5 score metrics — that is the height asymmetry. Add a sixth government metric: an **innovation / R&D capacity** score (institutional output: research, R&D intensity, patents), framed distinctly from the existing cultural `innovation` spectrum so they never read as duplicates. Source by curating a 0-10 value for all 196 countries in `data/cities/country_signature_v1.json` `government` blocks, derived from the Global Innovation Index family already cited as an anchor (no new data source, no agency name in visible copy). Add the `ScoreBar` row + the `Government` type field. Result: 6 vs 6, equal columns, symmetric.

---

# PART 5 — The shared table/stat language (cross-cutting, do FIRST)

Before the page work, lock one branded primitive set so everything lands consistent:
- Tighten `StatGrid` / `DataSection` into the canonical small-table look (label left, value right, hairline rows, tabular-nums, modeled footnote slot).
- Add `StatCard` (a titled white card wrapping a StatGrid, for the homepage editorial cards + city cards).
- Add `RankRow` (rank numeral + label + figure + texture word) for the leaderboards (homepage 1.6, cities 2.3).
All tokens-only, white, hairline-separated, mobile-first. Every later part composes these.

---

# Execution order (autonomous, branch, preview-verified)

1. **Part 5** — the shared StatCard / RankRow / table primitives (foundation).
2. **Part 2** — cities directory (cards + ranked top-10 + scrap dump). High impact, data exists.
3. **Part 1.5-1.7** — homepage three cards + leaderboard + surprising spread (the addictive core).
4. **Part 1.3, 1.8, 1.9** — rework the vague sections + plain-language methodology copy.
5. **Part 4.1-4.2** — country small-tables + restore hero image.
6. **Part 3** — activity geography-selector + qualitative tables.
7. **Part 4.3** — the sixth government metric (curation: 196 values) — the one net-new data item; dry-run the value set into the JSON, spot-check a few countries.
8. Screenshot every changed page desktop + mobile; fix drift; assemble a single preview for founder review.

Each step: fresh subagent, light gates green, preview screenshot, commit to branch. No fast-forward to main — the founder approves the production ship on waking.

# Open data / curation items (flagged, not blocking)
- Activity worldwide archetypes (market structure / pricing / labor) to fill Part 3.2 tables beyond dashes — curate later, like London.
- The sixth government innovation metric — 196 curated values (Part 4.3), derived from the existing innovation anchor.
- The homepage "surprising spread" + "what surprises operators" — a small curated set of true comparisons, each verified against live cells at build.

# Hard constraints (unchanged)
No em-dashes, no source-agency names, tokens only, no URL renames, no stock imagery, self-omit (never "coming soon"), decision-first order, never name an upside without its killer.
