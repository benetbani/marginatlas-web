# Plan v30 — Design system overhaul + accuracy fixes + scope trimming

**Status:** drafted 2026-05-23, awaiting approval
**Predecessor:** v29 (cost engine — beautiful waterfall shipped, the user explicitly likes it)
**Trigger:** founder walkthrough of `/es/madrid/restaurants` and `/it/lazio/hotels_lodging` with detailed UI/UX critique.

## The diagnosis

Three honest problems compound on every page:

1. **Scope creep** — features shipped that don't belong yet (CSV, Embed, Save, 5-year trend). They clutter the UI and confuse the eye before content is even good.
2. **Catastrophic data errors slip through** — Lazio displayed instead of Rome (popular-name override missed); $101M revenue per employee for Rome hostels; 31.8% net margin for hostels (cap should have caught it). The Plan v28 guardrails are present but not yet plumbed into every code path.
3. **Visual hierarchy is flat** — every section looks the same weight, the H1 is oversized and left-shifted, numbers in the elegant display font are unreadable, the first frame gives almost nothing, the page is too vertical and too spread out. There is no rhythm guiding the eye.

The user explicitly likes the Smart Waterfall (v29) — that's the visual style to extend across the site. Everything else needs to align to that level.

## The strategy

**Buy, don't build.** Adopt Tailwind UI ($299 one-time) as the canonical pattern library. Every section on every page maps to a proven Tailwind UI pattern. v0.dev for AI-assisted redesign of problem pages over 1 month, then cancel.

**Strip before polish.** Phase 1 removes everything that doesn't earn its place. The remaining surface is smaller and easier to make beautiful.

**Fix accuracy before design.** No amount of polish saves a page showing $101M revenue per employee. Phase 2 is the data-correctness sweep.

**Quality gates on every phase.** Each phase has a checklist that must pass before merge. The skills installed in Claude Code (ui-styling, copy-editing, code-reviewer) are invoked as gates, not as ornaments.

## Phase 0 — Resource setup (you, ~1 hour)

| Step | Action | Quality check |
|------|--------|---------------|
| 0.1 | Purchase Tailwind UI Personal lifetime license ($299) | License email confirmed |
| 0.2 | Download Tailwind UI components zip, extract to `~/design-systems/tailwindui` | Folder present |
| 0.3 | Subscribe v0.dev Pro ($20/mo, set calendar reminder to cancel in 30 days) | First v0 prompt runs |
| 0.4 | (Optional) Polypane trial ($9/mo) | Trial registered |

Output: license assets accessible, AI tools ready. I'll consume them in subsequent phases.

## Phase 1 — Strip the noise

Goal: remove every feature that's premature or risky.

### 1.1 Remove the four action buttons

The Save / Copy link / CSV / Embed cluster goes from every cell page. These features:
- Save — requires auth, not built
- Copy link — redundant with browser address bar
- CSV — premature; data isn't ready for export-as-truth
- Embed — premature; we'd be embedding numbers we just clamped

**Action:** delete the component that renders them. Strip imports.

**Quality checks (1.1):**
- ✅ Component file deleted, not just hidden
- ✅ No orphan imports remain (`grep -r "SaveButton\|ShareButton\|CsvButton\|EmbedButton" src/`)
- ✅ Bundle size drops by at least the component weight
- ✅ Visual diff: action area absent on `/us/california/restaurants`, `/de/berlin/cafes_coffee_shops`, `/es/madrid/restaurants`

### 1.2 Remove the 5-year trend graphic

Per founder: "very, very risky." The trend synthesizer applies a CAGR table to revenue, which is informed speculation, not measurement.

**Action:** remove `TrendSparkline` component import + render. Keep the file in place so we can revive it later if calibrated.

**Quality checks (1.2):**
- ✅ Sparkline not present on any cell page
- ✅ No layout shift where it lived (spacing collapses cleanly)
- ✅ Search engines won't punish — sparkline was decorative, not indexed

### 1.3 Remove the redundant MarginWaterfall

Below the Net Profit Summary there's a small "profit waterfall" that shows only the gross margin band — useless next to the full SmartWaterfall.

**Action:** delete `<MarginWaterfall ... />` from the cell page template. Component file stays (used elsewhere?).

**Quality checks (1.3):**
- ✅ No double waterfall on cell page
- ✅ Smart Waterfall remains intact
- ✅ Inspect 10 cell pages — no orphan element

### 1.4 Strip "canonical URL" text and the menu duplicate

The "showing hotels and logic" duplicate header and the leaked "canonical URL" text are both bugs from the cell-page layout.

**Action:** trace through `[country]/[geo]/[industry]/page.tsx` and the header components. Remove the duplicate header logic + the canonical URL string leak.

**Quality checks (1.4):**
- ✅ Visit `/it/lazio/hotels_lodging` — no "showing hotels and logic" anywhere
- ✅ View source — `<link rel="canonical">` is in `<head>` only, never rendered in body
- ✅ All 10 page types verified

### 1.5 Strip the "Send a correction" link (if redundant)

Decide: keep one feedback path, not three. If "Send a correction" is the keeper, remove the others.

**Action:** consolidate to one feedback link in the footer.

**Quality checks (1.5):**
- ✅ Exactly one feedback path per page
- ✅ Link points to a working URL

## Phase 2 — Fix the catastrophic errors

Goal: zero pages render impossibly wrong numbers or names.

### 2.1 Rome / Lazio override

The popular-name table has overrides for Mexico, Germany, etc., but Italy's regions weren't all wired through. Confirm:

```json
"it/lazio": "Rome",
"it/campania": "Naples",
"it/sicilia": "Palermo",
```

These exist in the JSON. **The bug** must be in how the override is applied — likely the route is hitting a code path that bypasses `geoNameFromSlug`.

**Action:**
1. Read `/it/lazio/hotels_lodging` server-side render path top to bottom.
2. Find where `geo_name` is set and verify `getPopularPlaceName('it', 'lazio')` fires.
3. Apply override in every code path (regional, extrapolated, synthesized, and the metadata title).

**Quality checks (2.1):**
- ✅ `/it/lazio/hotels_lodging` — H1 says "Rome", page title says "Rome"
- ✅ Same for `/it/lombardia/...` → Milan, `/it/sicilia/...` → Palermo
- ✅ Same pattern across 20 spot-check geo slugs (10 Italian, 10 other countries)
- ✅ Sitemap shows the canonical popular-name slug, not both

### 2.2 The $101M-per-employee bug

This is a unit error — somewhere a number is being multiplied or shown as USD when it's an aggregate, or per-firm-revenue-as-per-employee, or similar.

**Action:**
1. Reproduce on staging.
2. Add a hard assertion in `enforceSanity`: `revenue_per_employee = revenue_per_firm / n_employees`; if > $1M/employee, log and clamp.
3. Audit script that probes every page type for revenue-per-employee in (10k, 1M) USD.

**Quality checks (2.2):**
- ✅ No cell page shows revenue per employee > $1M
- ✅ Audit script runs clean on all 200 cities × top 30 industries
- ✅ Specific spot-check: `/it/lazio/hotels_lodging`, `/es/madrid/restaurants`, `/de/berlin/cafes_coffee_shops`

### 2.3 The 31.8% hotel net margin bug

Hotels are capped at 20%. The fact that 31.8% rendered means the cell page is bypassing the v28 + v29 clamp on at least one code path.

**Action:**
1. Trace which component rendered the 31.8% — likely the legacy `NetProfitSummary` (not the new SmartWaterfall).
2. Replace any remaining legacy margin display with the v29 engine output.
3. Add a render-time assertion: if a displayed net margin is above the industry hard cap, throw a visible warning in dev mode and clamp in production.

**Quality checks (2.3):**
- ✅ No cell page in any country renders a net margin above its sector's `hard_cap`
- ✅ Hotel net margins across 20 spot-check countries all ≤ 20%
- ✅ Smoke-test script: enumerate (10 sectors × 20 countries × 3 size bands) and assert margin ≤ cap

### 2.4 Audit pipeline for future regressions

**Action:** write `scripts/audit/page_render_audit.ts` that:
1. Hits 100 representative cell pages
2. Parses out: H1 text (must match popular name), revenue per employee, displayed net margin, sector tag
3. Asserts each against the rules
4. Outputs a report and fails CI if any assertion trips

**Quality checks (2.4):**
- ✅ Audit runs in under 5 minutes
- ✅ Catches every Phase 2 bug
- ✅ Runs in CI on every PR (config later)

## Phase 3 — Typography and visual hierarchy reset

Goal: the page reads with rhythm. Eye lands on the headline number, then the percentile band, then the people/wage, then the breakdown.

### 3.1 Typography scale audit

Current state (informal): H1 is `text-7xl md:text-8xl` ish — oversized. Display font is applied to numbers in the headline, which makes 7-digit dollar figures unreadable.

**Action:**
1. Lock the type scale:
   - H1: `text-3xl md:text-5xl` (down from 7xl-8xl)
   - H2 / section headlines: `text-2xl md:text-3xl`
   - Section labels (the orange-cap "THE SPREAD" style): `text-xs uppercase tracking-wide`
   - Body: `text-base md:text-lg`
   - Numbers in hero: `text-5xl md:text-6xl` (down from 7xl), tabular-nums
   - Numbers in tiles: `text-2xl md:text-3xl`, tabular-nums
2. Use the elegant display font for HEADLINES and SUBTOTALS only. Body numbers go in tabular-nums sans-serif.
3. Apply consistent vertical rhythm: every section gets `py-8 md:py-10` minimum, not `py-12 md:py-16`.

**Quality checks (3.1):**
- ✅ H1 fits in 2 lines on mobile (390px) across 20 longest titles
- ✅ Hero number reads at glance — no squinting
- ✅ Section labels visibly differ from body text
- ✅ No text larger than H1 anywhere on the page

### 3.2 Number readability fix

The user specifically called out that the elegant font on numbers is unreadable. Pattern:
- Use display font for **the one hero number** ($387K)
- Every other number on the page uses `font-sans tabular-nums`

**Action:**
1. Audit every component that renders money (`Money`, `fmtMoney`, etc.) — confirm tabular-nums.
2. Strip `font-display` from any non-hero number.
3. Add `font-feature-settings: "tnum"` to the tabular-nums utility.

**Quality checks (3.2):**
- ✅ Side-by-side: $1.32M renders cleanly in tabular-nums
- ✅ No "elegant" rendering on tile numbers, percentile bands, waterfall values
- ✅ The one place the elegant font stays: the giant hero number ($387K)

### 3.3 Horizontal alignment fix (H1 not shifted left)

The H1 floats too far left in the current page-container layout. Likely the page container is `max-w-7xl` but content uses `max-w-3xl` aligned to start.

**Action:**
1. Add a centered container with consistent left/right padding.
2. H1 sits inside a `max-w-4xl mx-auto` container, with the same gutter as the data sections below.

**Quality checks (3.3):**
- ✅ H1 left edge aligns with the data tiles below it on desktop
- ✅ Same on tablet
- ✅ On mobile, gutter is 4 (16px) on both sides

### 3.4 Mobile H1 always 2 lines

Spec rule already exists in CLAUDE.md. The fix is to test every page type at 390px and adjust title sizing or word breaks.

**Action:**
1. Set H1 to `text-3xl` on mobile (current is too large).
2. For long titles ("How much does a small home-care agency make in Mexico City?"), use `text-balance` and `max-w-md`.
3. Test the 10 longest industry × city combinations at 390px.

**Quality checks (3.4):**
- ✅ Every H1 wraps to exactly 2 lines on mobile
- ✅ No 3-row H1 anywhere
- ✅ No 1-row H1 (looks broken)

### 3.5 Sector / category icons

Per founder: "the designation should only be preceded by a symbol that makes everything easier to understand and identify."

**Action:**
1. Map 25 sectors → Phosphor icons (already installed):
   - `food_drink` → `ForkKnife`
   - `hospitality` → `Bed`
   - `retail_shops` → `Storefront`
   - `professional_services` → `Briefcase`
   - `construction` → `Hammer`
   - `trades_home` → `Wrench`
   - `beauty_wellness` → `Sparkle`
   - `health_clinics` → `FirstAid`
   - `software_tech` → `Code`
   - (etc.)
2. Add icon next to "FOOD & DRINK" tag on cell pages.
3. Add icon next to sector chips on /sectors and homepage mosaic.

**Quality checks (3.5):**
- ✅ All 25 sectors have an icon
- ✅ Icons are 16px (`size={16}` in Phosphor), `text-atlas-700` color, weight regular
- ✅ Icon-text gap = 6px
- ✅ Icons present on cell page, /sectors hub, homepage mosaic, knowledge base navigation

## Phase 4 — First-frame density redesign

Goal: above the fold on desktop, the user sees the headline AND the key data points AND the visual orientation. No more scrolling to find what the page is about.

### 4.1 Hero block redesign

Current hero (~70vh tall):
- Tag (FOOD & DRINK · MADRID · SPAIN)
- H1 ("How much does a restaurants make in Madrid?")
- Subtitle (Includes: cafés...)
- "A TYPICAL ONE EARNS ABOUT"
- $387K a year (huge)

Proposed hero (~55vh tall, denser):
```
┌─────────────────────────────────────────────────────────────┐
│ [icon] FOOD & DRINK · 🇪🇸 MADRID · SPAIN     [coverage chip]│
│                                                             │
│ How much does a restaurant make in Madrid?                  │
│ Includes: cafés · bistros · fast food · fine dining        │
│                                                             │
│ ┌──────────────────┬─────────┬─────────┬────────────────┐  │
│ │                  │ MEDIAN  │ TOP 10% │ BOTTOM 10%     │  │
│ │     $387K        │ $387K   │ $1.32M  │ $97K           │  │
│ │   typical year   │         │         │                │  │
│ ├──────────────────┼─────────┼─────────┼────────────────┤  │
│ │  4 employees · $32K median wage  · 12% net margin     │  │
│ └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

The hero now packs:
- Identity (sector + geo)
- Coverage chip (top-right corner)
- Question
- Industry inclusions
- Headline median (anchor visual weight)
- Percentile spread inline
- Headcount + wage + net margin one-liner
- All above the fold on a 13" laptop

**Action:**
1. Build `<HeroDense />` component.
2. Replace the current hero block on cell pages.
3. The legacy components (Distribution band, Typical firm card, ATLAS SCORE card) move BELOW the fold as deep-dive sections.

**Quality checks (4.1):**
- ✅ On a 1440×900 viewport, the user can read median + p10 + p90 + employees + wage + margin without scrolling
- ✅ On a 1280×800 laptop, same
- ✅ On 390×844 mobile, the hero is approximately 1 viewport height
- ✅ Visual hierarchy: the eye lands on $387K first, then p10/p90, then the one-liner

### 4.2 Section ordering rewrite

After the dense hero:
1. **The breakdown** (Smart Waterfall — already beautiful, stays as-is)
2. **The spread** (distribution band — refined per Phase 5)
3. **Editorial note** (1 calm paragraph)
4. **Across states / Across countries** (comparator strip)
5. **More in this sector** (related industries)
6. **Sister cities** (ribbon)
7. **About these numbers** (single footer link)

Cut: ATLAS SCORE card (move to a hover/tooltip on the coverage chip), profit waterfall mini, the 5-year trend, the action buttons (already in Phase 1).

**Quality checks (4.2):**
- ✅ Page has at most 8 sections (was ~14)
- ✅ Each section has a distinct visual treatment (background, alignment, density)
- ✅ No two adjacent sections look the same

### 4.3 Compact "The Typical Firm" block

Currently three big cards in a horizontal strip with $2.9B "revenue per employee" (a bug — that's the total revenue, not per-employee).

**Action:**
1. Fix the math: `revenue_per_employee = revenue_per_firm / employees`. If employees is null, suppress the line.
2. Visual: a single horizontal card with 4 stats inline: People · Revenue · Wage · Revenue per employee.
3. Drop the "Revenue minus wages" line — not a standard metric.

**Quality checks (4.3):**
- ✅ Revenue per employee never exceeds $500K (the SMB-physical ceiling)
- ✅ Math is correct: rev_per_firm / n_employees
- ✅ Block height < 120px on desktop (currently ~280px)

## Phase 5 — Component polish

### 5.1 "Where every business lands" distribution band

Current state:
- The bar is too thick (a fat rectangle).
- Spacing shifted left, looks odd against the cream background.
- Labels ("BOTTOM 10% EARN AROUND", "TYPICAL", "TOP 10% EARN ABOVE") aren't aligned to the value positions.

**Action:**
1. Bar height: from current ~120px to **24px** — a thin, solid band.
2. Use a single rounded rectangle with three color stops (light cream / cream / amber) and a clear "median" tick mark.
3. Labels below the bar, each aligned to the value they describe (left-edge of bottom 10%, center of typical, right-edge of top 10%).
4. The band sits inside a centered container so it doesn't visually drift left.

Sketch:
```
BOTTOM 10%                    TYPICAL                    TOP 10%
$97K                          $387K                      $1.32M
   ↓                            ↓                          ↓
 ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│░░░░░░░░░░░░░░░░░░░░░░░░░▓
```

**Quality checks (5.1):**
- ✅ Bar is visibly thinner — under 30px
- ✅ Each value sits directly above its position on the bar
- ✅ Centered horizontally, equal left/right gutter
- ✅ Looks good on mobile (bar may collapse to 32px height)

### 5.2 Smart Waterfall — keep, with one tweak

Founder explicitly likes this. Don't break it. Minor refinement:
- Confidence chip placement: currently top-right of section heading. Looks good.
- Lines: keep.
- Tooltip on hover: keep, this is the magic.
- Sidebar "what changes here": keep.

**One refinement:** the section title "Cost structure" could be more evocative. Try "Where every dollar goes" (which is already the kicker label) as the H2.

**Quality checks (5.2):**
- ✅ Waterfall renders identically post-refactor
- ✅ All tooltips still fire
- ✅ "What changes here" sidebar present on every cell page

### 5.3 ATLAS SCORE card — demote

Currently a big card with a 77 score, "Strong" tag, and 4 sub-dimensions. Founder didn't praise it; it consumes a lot of space; it's vague.

**Action:**
1. Replace the standalone card with a small chip near the coverage indicator: "Atlas Score 77/100 — Strong" with hover-to-explain.
2. Move the detailed breakdown to `/about-data#atlas-score`.

**Quality checks (5.3):**
- ✅ Atlas Score chip present, < 80px wide
- ✅ Tooltip explains the score
- ✅ Link to methodology

## Phase 6 — Mobile audit and final polish

### 6.1 Mobile-first sweep

Walk 10 page types at 390×844 (iPhone 13 width):
- Homepage
- Cell page (US, EU, emerging market)
- Country page
- Industry page
- Sector page
- City metropolis page
- Neighborhood hub
- Curiosities page
- City-vs-city comparison
- Knowledge base article

**Quality checks (6.1):**
- ✅ Every page has 2-line H1
- ✅ No horizontal overflow on any page
- ✅ Touch targets ≥ 44px
- ✅ Type readable without zoom

### 6.2 Tablet breakpoint

Same 10 pages at 768×1024.

**Quality checks (6.2):**
- ✅ Layout neither full-mobile nor full-desktop — proper mid-state
- ✅ Two-column sections collapse to one column gracefully

### 6.3 Desktop dense layout

Same 10 pages at 1440×900.

**Quality checks (6.3):**
- ✅ Above-the-fold density target met (≥12 data points visible)
- ✅ Max-width respected, no edge-to-edge content
- ✅ Visual rhythm is consistent

### 6.4 Polypane regression (if subscribed)

Run Polypane multi-viewport view on every page type. Snapshot before/after. Diff.

**Quality checks (6.4):**
- ✅ Multi-viewport screenshots saved
- ✅ Each viewport viable

## Phase 7 — Content / language audit

### 7.1 Copy editing pass

Invoke the `copy-editing` skill on every page-template body string. Targets:
- Editorial blurbs (125 of them)
- Section descriptions
- Tooltip / provenance strings (13 per cell page × all combos — template-level)
- Knowledge base articles (54 of them)

**Quality checks (7.1):**
- ✅ No em-dashes (already R-020 enforced)
- ✅ No "utilize" / "leverage" / "synergy" / startup-speak
- ✅ Tone matches CLAUDE.md voice rules

### 7.2 Universal-terms verification

Verify the universal-terms rule sticks across every page string. No leaked Mehrwertsteuer / Gewerbesteuer / IMSS / Predial / IVA / TVA / etc. in any user-facing text.

**Quality checks (7.2):**
- ✅ Grep across every page template comes back clean
- ✅ Spot-check 5 country pages, 5 cell pages, 5 KB articles

### 7.3 Sector category labels

Every sector tag uses the universal English name + the new Phosphor icon. The category designation always reads "[icon] SECTOR NAME · COUNTRY".

**Quality checks (7.3):**
- ✅ "FOOD & DRINK · MADRID · SPAIN" pattern present on all cell pages
- ✅ Icon always precedes the sector name
- ✅ Sector name capitalization is consistent (all-caps with letter-spacing)

## Phase 8 — Continuous quality pipeline

### 8.1 The skills as gates

Set up a per-PR routine:
1. Invoke `ui-styling` skill on every component touched
2. Invoke `copy-editing` skill on every user-visible string touched
3. Invoke `code-reviewer` agent before final commit
4. Invoke `Plan` agent for any change > 50 lines

**Quality checks (8.1):**
- ✅ Routine documented in `CLAUDE.md`
- ✅ At least 3 PRs use the full routine before this plan closes

### 8.2 Automated visual regression

Add a Playwright script that screenshots 20 representative pages at 3 breakpoints, commits the baselines, and fails the build on > 5% pixel diff.

**Quality checks (8.2):**
- ✅ Baseline screenshots committed
- ✅ Diff script runs in CI
- ✅ A real test PR triggers the diff and either passes or shows the change

### 8.3 Data-correctness audit on every deploy

Re-run `page_render_audit.ts` from Phase 2.4 as a deploy gate.

**Quality checks (8.3):**
- ✅ Audit runs post-deploy
- ✅ Failures alert me

### 8.4 Weekly walk-through

Founder does a 30-min walk-through every Monday on 10 random pages. Anything ugly or wrong becomes a P0 ticket.

**Quality checks (8.4):**
- ✅ First walk-through completed within 2 weeks of plan landing
- ✅ Issues triaged within 24 hours

## Sequencing

Total realistic effort: ~45 hours over **6-8 sessions** (not 6-8 weeks).

| Phase | Effort | Sessions | What ships |
|-------|--------|----------|------------|
| 0 — Resources | 1h (founder) | n/a | Tailwind UI + v0.dev access |
| 1 — Strip the noise | 3h | 1 | CSV/Save/Embed/Trend gone; redundant waterfall gone |
| 2 — Catastrophic fixes | 5h | 1 | Lazio→Rome, $101M bug, 31.8% bug |
| 3 — Typography reset | 6h | 1 | New scale + tabular numbers + sector icons |
| 4 — Hero redesign | 8h | 2 | Dense first frame across page types |
| 5 — Component polish | 4h | 1 | Distribution band thin, ATLAS score demoted |
| 6 — Mobile audit | 4h | 1 | 10 pages × 3 breakpoints verified |
| 7 — Copy editing | 3h | 1 | All strings reviewed |
| 8 — QA pipeline | 4h | 1 | Visual regression + skill-gate routine |

**Total: ~38h core work + ~4h follow-up + 1h purchase.** Ship Phases 1 + 2 + 3 in one session. Phase 4 takes the most thinking because the hero redesign is creative.

## Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Tailwind UI patterns don't match Atlas voice | Customize after copy-paste; the patterns are starting points, not finals |
| v0.dev outputs feel generic | Use it for layout structure only; rewrite copy in Atlas voice |
| Stripping CSV/Save loses returning users | They didn't exist as features users relied on — none of these are wired to data |
| Mobile fixes regress desktop | Polypane multi-viewport during dev |
| Catastrophic fixes uncover deeper data issues | Audit script catches; treat as discoveries, not failures |
| Skills become ceremony, not value | Use them on real code only; don't invoke for trivial changes |

## Acceptance criteria

- [ ] CSV / Save / Embed / 5-year trend / redundant MarginWaterfall removed everywhere
- [ ] Zero pages render any of: > $1M revenue per employee, net margin above sector cap, admin1 name instead of popular city name, "canonical URL" string leaks, duplicate header rows
- [ ] H1 typography: ≤ text-5xl on desktop, ≤ text-3xl on mobile, always 2 lines on mobile
- [ ] All numbers use tabular-nums except the one hero figure (display font OK there)
- [ ] First frame above fold on 1440×900 shows ≥ 12 data points (median, p10, p90, employees, wage, margin, coverage, sector, geo, country, sub-segment, industry tag)
- [ ] All 25 sectors have a Phosphor icon paired with the label, sitewide
- [ ] Distribution band thinned to ≤ 30px height, value labels aligned to band positions
- [ ] No regression on Smart Waterfall (founder's favorite component)
- [ ] Lighthouse mobile score ≥ 90 on a sample of 10 pages
- [ ] Visual regression baseline committed; future diffs gate the build
- [ ] `page_render_audit.ts` returns zero block-severity issues across 200-cell sample

## Anti-scope (what this plan deliberately does NOT do)

- No new database tables; this is design + data-correctness only
- No new features — explicit retreat, not expansion
- No re-design of Smart Waterfall (founder likes it)
- No new pages — fix the existing 500
- No new country research cards (Plan v29 Tier A backlog; separate cadence)
- No paid stock photography or AI illustration (Plan v28 deferred)

## Locked decisions (approved 2026-05-23)

1. **Tailwind UI**: deferred. Use free options first (shadcn + Cult UI + Aceternity UI). Revisit if free options hit a wall in Phase 4.
2. **Phasing**: 3 separate sessions — Phase 1 (strip), then Phase 2 (fix), then Phase 3 (typography). Each session ships a coherent change.
3. **ATLAS SCORE**: demote to chip with hover-explain.
4. **Distribution band**: fix per Phase 5.1 — thin 24px band, labels aligned, centered.
5. **v0.dev / Polypane**: deferred; reconsider when Phase 4 starts.

## What ships next session

**Phase 1 — strip the noise.** Remove CSV / Save / Embed / Copy-link buttons, the 5-year trend, the redundant mini margin waterfall, the canonical-URL string leak, and the duplicate header row. The page won't be redesigned yet, but the clutter is gone and the eye has less to fight.
