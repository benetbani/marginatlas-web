# Plan v16 — Sitewide Reformation Implementation Plan

> **For agentic workers:** Execute block-by-block. Commit per block. Push after each block. Run `npx tsc --noEmit && npm run lint && npx tsx scripts/verify_taxonomy.ts` before every commit.

**Goal:** Fix every functional and editorial defect surfaced in the founder's 2026-05-21 walkthrough, plus install symmetry + QA-checklist discipline so volume-over-quality cadence ends.

**Architecture:** Nine sequential blocks, each scoped to one surface or one cross-cutting concern. Catastrophic functional breakage first (Block A), then hero rebuild (B), then methodology relocation + marketing rewrite (C), then secondary surfaces (D-F), then sitewide hygiene (G-I).

**Tech Stack:** Next.js 15 App Router · React 19 RC · TypeScript strict · Tailwind 3.4 · Supabase Postgres + PostgREST · existing `src/lib/cells.ts` data layer with inflation roll-forward and Pareto extrapolation.

**Verification cadence per block:**
1. `npx tsc --noEmit` — must pass
2. `npm run lint` — must pass
3. `npx tsx scripts/verify_taxonomy.ts` — must pass
4. Spot-check 3-5 production URLs after deploy
5. Commit with `Block <X>:` prefix matching Plan v15 commit style
6. Push to `origin/main`

---

## Block A — Functional breakage (production-blockers)

Ten items. All of them are things that are visibly broken to users right now.

### A1 — NavigatorForm country combobox shows all 195

**Files:**
- Modify: `src/components/ComboField.tsx` (truncation logic)
- Verify: `src/components/NavigatorForm.tsx:106-114` (countryOptions builder)

**Problem:** ComboField clamps results at 8 with a "145 more" footer.
**Fix:** Lift the cap to the full option list. Keep type-ahead filter. Render scrollable list with `max-h-[60vh] overflow-y-auto`.

### A2 — Region dropdown populates for every country

**Files:**
- Create: `src/lib/regions/regions-by-country.ts` (cascade table)
- Modify: `src/components/NavigatorForm.tsx:117-120` (regionOptions builder)

**Problem:** `NavigatorForm.tsx` line 118-120 returns `[{ value: "", label: "Country-level (sub-national coming)" }]` for everything except US.

**Fix:** Build a static `REGIONS_BY_COUNTRY` table from `regional_cells` distinct `(country, geo_id, geo_name, geo_level)` rows at build time. Populate for at least: US (states), GB (LADs grouped to regions), DE (Länder), FR (régions), IT (regioni), ES (comunidades), JP (prefectures), BR (UFs), MX (states), CA (provinces), AU (states), NL (gemeenten top-50), PL (NUTS-2), PT, BE, AT, CH, SE, NO, DK, FI, IE, GR, CZ, HU, RO, IN (states extrapolated), CN (extrapolated), RU (city overlay), other top-30 countries with regional_cells.

For countries with only extrapolated_cells, surface the country itself as a single option ("All of {country}").

### A3 — "Show me the numbers" submit fires reliably

**Files:**
- Modify: `src/components/NavigatorForm.tsx:266-272` (submit button)

**Problem:** Founder reports submit click does nothing on a non-US selection. Code path at line 164 falls into `r = countryName.toLowerCase().replace(...)`, which produces e.g. `italy` — and `/it/italy/coffee-shops` is a real URL pattern that resolves via `getExtrapolatedCell` (per `05_DATABASE_SCHEMA.md` step 4). The bug is either the route returning a 500 in some path or the button losing the click due to overlay z-index.

**Fix:**
1. Add `type="button"` to both buttons (defensive).
2. Wrap `submit` in a try/catch that logs to console + falls back to `router.push('/random')`.
3. Add `console.log("nav submit", { country, region, industry })` for one commit so we can trace from the live URL.
4. Verify on staging then strip the log on the next commit.

### A4 — "Surprise me" reactive or removed

**Files:**
- Modify: `src/components/NavigatorForm.tsx:184-186` + 259-265 (Surprise me button)

**Decision:** Keep it. Add `type="button"`, ensure `router.push("/random")` works. If `/random` is broken, fix that too.

**Check:** `src/app/random/route.ts` — confirm it 307s to a real cell URL.

### A5 — Compare page submit + render

**Files:**
- Read: `src/app/compare/CompareClient.tsx`
- Modify: as needed to add a "Compare" button and surface returned cell data.

**Problem:** Founder reports no submit button on /compare, no rendering even when slots are pre-filled.

**Fix:** Audit CompareClient end-to-end. Wire a single Compare CTA. On submit, fetch `/api/cell-lookup` per slot, render side-by-side table.

### A6 — Cell page net-profit math

**Files:**
- Read: `src/lib/finance/net_profit.ts`
- Read: `src/lib/finance/margin_floor.ts`
- Modify: `src/components/NetProfitWaterfall.tsx:86-95` (display logic)

**Problem:** "Coffee shops in Italy" shows -$34k net profit with 3% net margin. Mathematically impossible: a 3% margin on a positive revenue cannot be negative.

**Root cause (hypothesis):** `clampMargin(w.net_margin, "net")` in line 94 clamps the displayed margin to a floor (e.g. 3% minimum), but `w.net_profit` (line 91) is rendered raw. So when the model produces a negative net profit, the floor on the margin makes them inconsistent.

**Fix:**
1. If `w.net_profit < 0`, hide the entire NetProfitWaterfall section and surface a single line: "Net profit not estimable for this benchmark."
2. Never display a clamped margin alongside a raw profit. Either both are clamped or both are raw.
3. Move the "Estimate only" disclaimer above the number, not below.
4. Add a guard: if any `fixed_costs.*` is null or NaN, show the disclaimer instead of the breakdown.

### A7 — Cell page image attribution leak

**Files:**
- Read: `src/components/SmartImage.tsx`
- Read: `src/components/AtlasHeroImage.tsx`
- Read: `src/lib/images.ts`
- Read: `data/images/cities_manifest.json`, `data/images/industries_manifest.json`

**Problem:** Coffee shops in Italy renders an image attributed to "Bank of Vancouver, British Columbia." This means the image-lookup table is returning a Vancouver photo for an Italian coffee shop, AND the attribution is rendering when it should be suppressed entirely.

**Fix:**
1. Strip every visible attribution string from the image render path. Photo source/credit lives in metadata, not on the cell page.
2. Audit the image-lookup function. For (industry, country) pairs without a matching image, fall back to the cream-gradient + emoji `SmartImage` placeholder. Never serve a mismatched photo.
3. Add a guard test: if `image.country !== cell.country`, do not render that image.

### A8 — Sector tile click routes to sector landing, not California

**Files:**
- Read: `src/components/SectorMasterMenu.tsx:31-33` (tile `href`)
- Read: `src/app/sectors/[sector]/page.tsx` (landing)
- Read: `src/components/FeaturedCellTile.tsx`

**Problem:** Founder reports clicking the management-consulting sector tile routes to `/us/california/management-consulting`. Looking at `SectorMasterMenu.tsx` line 33: `href={\`/sectors/${s.id}\`}` — that should go to a sector landing, not California. The issue is likely that `/sectors/[sector]/page.tsx` immediately redirects to a US default, OR the founder clicked something on `/sectors/management_consulting` that bounced them.

**Fix:**
1. Audit `/sectors/[sector]/page.tsx` for redirects or auto-routing.
2. The sector landing must be a true landing: hero + top SMB industries within that sector + cross-country glance + "pick a country to drill in" prompt. No auto-route.
3. If clicking on an industry inside the sector landing auto-jumps to California, fix that — it should go to a global-aggregate or country-picker view.

### A9 — /world page restructure

**Files:**
- Modify: `src/app/world/page.tsx` end-to-end

**Problem:** Variable tile sizes (`col-span-2 row-span-2` for high cells, `col-span-2` for medium) are visually arbitrary. Benchmark counts and quality scores leak per founder D-107.

**Fix:** Replace with a uniform-size country grid. Remove `cells.toLocaleString()` "benchmarks · q{quality}" line entirely. Remove `chipSize` function. Keep regional grouping. Strip quality colour-coding (replace with cream-100 default + atlas-200 hover). Page becomes a clean atlas-style world directory.

### A10 — Performance pass

**Files:**
- Modify: `src/app/[country]/[geo]/[industry]/page.tsx` (search-param handling)
- Create: `src/components/DimensionSwitcherClient.tsx` (client-side switcher)

**Problem:** Cell pages slow because route is `force-dynamic` (R-003 hotfix).

**Fix:** Move `?size=` and `?year=` reading into a client component using `useSearchParams`. Drop `export const dynamic = "force-dynamic"`. Restore `export const revalidate = 21600` + `export const dynamicParams = true`. This is S-100 from chapter 15. **High risk** — must verify locally with `npm start` + curl on a non-pre-rendered URL before push.

---

## Block B — Hero + above-fold rebuild

### B1 — Eyebrow rewrite

**File:** `src/app/page.tsx:131-133`

**From:** `Small-business benchmarks · worldwide`
**To:** `№1 site for tracking small to medium business benchmarks globally`

Use the `№` glyph (U+2116) literally. Apply `text-atlas-700` + `font-semibold` + `tracking-[0.18em]`.

### B2 — Remove "Browse the whole world" and "See the methodology" text links

**File:** `src/app/page.tsx:169-184`

Delete the entire `<div className="mt-5 md:mt-6 flex flex-wrap...">` block.

### B3 — Shrink "Browse by country" / "Browse by industry" CTAs

**File:** `src/app/page.tsx:189-209`

Reduce from `text-base md:text-lg px-6 py-4 md:py-5` to `text-sm md:text-base px-5 py-3`. Force equal width with `w-[180px] md:w-[220px]` (fixed) and `flex-row` (not flex-1 stretch).

### B4 — Question-mark spacing fix

**File:** `src/app/page.tsx:154-164`

Current `min-w-[8ch]` reserves space for "New York" but leaves Dubai/Lagos with trailing whitespace. Fix: drop `min-w-` and instead anchor the question mark immediately after the rotating word using `whitespace-nowrap` on the parent span. The question mark hugs the word regardless of length.

```tsx
<span className="block w-full whitespace-nowrap">
  make in{" "}
  <span className="inline text-atlas-600">
    <RotatingWord words={HERO_CITIES as unknown as string[]} interval={2000} offset={1000} />
  </span>
  <span className="text-ink-900">?</span>
</span>
```

### B5 — Navigator form lifted into hero, button row removed

**Files:**
- Modify: `src/app/page.tsx` (move `<NavigatorForm />` directly under the hero copy; delete the standalone CTAs section above it)
- Modify: `src/components/NavigatorForm.tsx` (make subdivision + size optional-only — required = country, category, industry per founder)

The hero becomes: eyebrow → headline → tagline → navigator form (full-width). The pair of B3 CTAs becomes a secondary row below the navigator OR is dropped entirely (depending on visual density).

### B6 — Buttons that sit next to each other must be exactly equal in dimensions

Add a lint-style audit pass: search for adjacent `<button>` or `<a>` elements with `flex` parents and check that they share width/padding tokens. Document violations as follow-ups; fix any inside the hero / nav immediately.

---

## Block C — Methodology relocation + marketing rewrite

### C1 — Move methodology section below the fold

**File:** `src/app/page.tsx:211-246`

Cut the `<ToneBand tone="home-methodology">` block. Paste it after `<ToneBand tone="home-quality">` block (around line 343-346), so it sits between QualityLegend and the stats strip. Methodology is reference material, not a hero.

### C2 — Marketing rewrite

**File:** `src/app/page.tsx:215-243` (the copy)

Rewrite per founder explicit direction. New copy:

> **How we build numbers you can trust**
>
> Atlas combines machine-learning aggregation over hundreds of public and semi-public source streams with direct access to closely-held national filings and on-the-ground correspondents in hard-to-cover territories. Every benchmark is cross-validated against the most recent quantitative methodologies published by leading economic research groups.
>
> Our roll-forward pipeline keeps every figure current to the present year, so the snapshot you read is never years out of date. PPP and inflation overlays are baked in.
>
> Each benchmark carries a quality grade A through D telling you exactly how directly it was sourced and how thinly the sample was sliced. No black boxes.

(Tone: superiority, marketing copy, exaggerates capability. No source agencies named. No em-dashes.)

---

## Block D — Top-100 cities visual + copy

### D1 — Drop "Coming this summer" and "Coming soon" chips

**File:** `src/app/page.tsx:248-271`

Remove the "Coming soon" badge. Replace tagline copy with a forward-looking but committed statement:

> Manhattan blocks. Central Tokyo wards. Paris arrondissements. The same benchmarks at neighborhood resolution, rolling out city by city. Subscribe to be first.

### D2 — CitiesDotsMap render fix

**File:** `src/components/CitiesDotsMap.tsx`

**Audit + fix:** Founder reports the world map is not rendering correctly. Read the SVG, verify viewBox + ring positions are in the visible area, fix overlap/clipping. If the dot-pattern is fundamentally weak, swap to a more deliberate composition: 5-6 dots positioned over real city coordinates (NYC, London, Tokyo, São Paulo, Mumbai, Sydney) with pulsing rings.

### D3 — Visual polish

Tighten copy hierarchy. Atlas-200 border becomes atlas-500 left rule. Spacing tightened.

---

## Block E — "Start with something familiar" section

### E1 — New tile set

**File:** `src/app/page.tsx:41-50` (FEATURED array)

Replace with founder's specified set:

```ts
const FEATURED: FeaturedTileSpec[] = [
  { iso2: "US", geo: "california", industry: "software-development", title: "Software development", region: "San Francisco", glyph: "💻" },
  { iso2: "GB", geo: "gb",         industry: "legal-services",       title: "Legal services",       region: "United Kingdom",  glyph: "⚖️" },
  { iso2: "DE", geo: "germany",    industry: "metal-products-mfg",   title: "Metal manufacturing",   region: "Germany",         glyph: "🔩" },
  { iso2: "JP", geo: "jp-13000",   industry: "restaurants",          title: "Ramen shops",          region: "Tokyo",           glyph: "🍜" },
  { iso2: "US", geo: "us-06-037",  industry: "fitness-gyms",         title: "Gyms",                 region: "Los Angeles",     glyph: "🏋️" },
  { iso2: "IT", geo: "itc4c",      industry: "clothing-stores",      title: "Boutiques",            region: "Milan",           glyph: "👗" },
  { iso2: "FR", geo: "fr101",      industry: "jewelry-stores",       title: "Jewelry shops",        region: "Paris",           glyph: "💎" },
  { iso2: "ES", geo: "es511",      industry: "restaurants",          title: "Restaurants",          region: "Barcelona",       glyph: "🥘" },
  { iso2: "MX", geo: "mx-roo",     industry: "hotels-lodging",       title: "Hotels",               region: "Cancún",          glyph: "🏨" },
];
```

That's 9 — need symmetric 3×3 grid on lg. Update grid class from `lg:grid-cols-4` to `lg:grid-cols-3` and `sm:grid-cols-2` stays. Or drop one to keep 4×2. **Decision:** 3×3 (9 tiles). Update intro copy from "Eight benchmarks" to "Nine benchmarks most people recognize on sight."

### E2 — FeaturedCellTile returns null fallback verified

**File:** `src/components/FeaturedCellTile.tsx`

Confirm: if any of the 9 returns null (no data), the grid collapses asymmetrically. Audit each (iso2, geo, industry) tuple against the data layer ahead of commit. Any that doesn't resolve gets swapped or removed.

Pre-flight: for each new tuple, query `/api/cell-snapshot?country=X&geo=Y&industry=Z` against production and confirm 200 + `found: true`. Replace any that fail.

---

## Block F — Pricing default to Annual

**File:** `src/app/pricing/page.tsx`

**Current state:** Server component shows monthly price as primary, annual as small sub-line. No toggle exists yet.

**Fix:**
1. Convert `PricingPage` to a client component (`"use client"`).
2. Add `const [billing, setBilling] = useState<"annual" | "monthly">("annual")` (default annual).
3. Render toggle pill above the tier grid: `[Annual (4 months free) | Monthly]` with annual selected on first paint.
4. Switch displayed price + suffix based on `billing` state. Annual shows `$X / year` and a small "(save 33%)" caption. Monthly shows `$X / month` and a small "$Y / year if billed annually" comparison.

---

## Block G — Em-dash purge across the site

### G1 — Sitewide audit

**Approach:**
1. `grep -rn "—" src/` → enumerate every em-dash.
2. Replace `—` with appropriate punctuation: comma, colon, period, or open paren depending on rhetorical role.
3. Avoid using `–` (en-dash) in copy. Use periods, commas, or colons.

### G2 — Major pages first

Hero, home page, all top-level page.tsx, common components (QualityBadge, CellPageNav, AtlasScore, RevenueTiles). Then second-pass on lower-traffic pages.

### G3 — Lint guard

Add an ESLint custom rule or a grep-based prebuild check that fails if `—` appears in any committed `.tsx` / `.ts` / `.md` under `src/`. (Skip `docs/` so historical specs stay readable.)

---

## Block H — Symmetry audit on every card grid

### H1 — Inventory every card grid

Grep for `grid-cols-` in `src/app/` and `src/components/`. List each, note its responsive column counts (sm/md/lg/xl), and verify the data driving it always produces a multiple of the column count.

### H2 — Featured benchmarks

Covered in Block E with the move to 3×3.

### H3 — Sector master menu

20 sectors × 4 cols on lg = 5 rows of 4. Symmetric. Confirm.

### H4 — Pricing tiers

4 tiers × 4 cols on lg = 1 row of 4. Symmetric. Confirm.

### H5 — Country tiles

Various pages. Confirm sm/md/lg breakpoints all produce filled rows.

### H6 — Blog rail

6 posts × 3 cols on lg = 2 rows of 3. Symmetric. Confirm.

Any grid where the data count is unpredictable must either pad or trim to the next multiple of the column count.

---

## Block I — Per-page QA checklist + sign-off process

### I1 — Create QA checklist doc

**File:** `docs/specs/2026-05-21-per-page-qa-checklist.md`

Define a 12-point checklist every new page or page-touching commit must satisfy:

1. tsc passes
2. lint passes
3. taxonomy verify passes
4. No em-dashes in `.tsx` source (Block G lint guard)
5. No user-visible "cell" / "cells" / "p10" / "p50" / "p90" / calendar years (extends D-107)
6. No source-agency names in any string (Plan A lockdown)
7. Every card grid is symmetric at every breakpoint
8. Mobile breakpoints explicitly tested (375px, 414px, 768px)
9. Buttons next to each other share dimensions
10. No "Coming soon" or "TBD" copy
11. Image-lookup falls back to placeholder when country/industry mismatch (Block A7)
12. Page-load: first byte under 1500ms on a non-pre-rendered URL

### I2 — Add to PR template

**File:** `.github/PULL_REQUEST_TEMPLATE.md` (create if absent)

12 checkboxes mirroring I1. Founder won't merge without all 12 ticked.

### I3 — Manual run-through script

**File:** `scripts/qa/run_checklist.sh`

Run-through sequence:
1. `npm run build` (must pass)
2. Curl each of the 6 verification URLs from chapter 15 §10
3. Curl `/world`, `/compare`, `/pricing`, `/you`
4. Curl 4-5 randomly-picked benchmark URLs
5. Confirm 200 + reasonable HTML body length on each
6. Diff against a baseline output

---

## Execution order and effort estimates

| Block | Surface | Effort | Risk |
|---|---|---|---|
| A | Functional fixes (10 items) | 1.5-2 days | High; data + routing + math + image pipeline |
| B | Hero rebuild | 3-4 hours | Low |
| C | Methodology move + rewrite | 2 hours | Low (founder sign-off on copy after first draft) |
| D | Top-100 cities visuals | 3-4 hours | Medium (SVG fix may surface deeper issues) |
| E | Familiar tiles | 1-2 hours | Low (data probe needed for new tuples) |
| F | Pricing toggle | 45 minutes | Trivial |
| G | Em-dash purge | 1-2 hours | Low |
| H | Symmetry audit | 4-6 hours | Medium |
| I | QA checklist + PR template | 4 hours | Process change |

Total: ~4-5 working days end-to-end.

---

## Decisions captured ahead of time (no founder block)

- Japan example tile: **ramen shops in Tokyo** (founder explicit).
- Methodology tone: aggressive marketing, no source agencies, exaggerate capability (founder explicit).
- Pricing default: Annual (founder explicit).
- "Familiar" section grid: 3×3 (9 tiles, symmetric).
- Hero copy: founder gave eyebrow text verbatim. Headline + tagline preserved from current build except the question-mark spacing fix.
- /world page: replace variable-tile composition with uniform grid + regional grouping kept.
- Cell-page net-profit display: hide when negative (per A6 fix).

---

## What is OUT of scope for v16

- Real product images (B-008 still open; founder commissioning).
- Stripe + Auth (B-011 still deferred).
- Sub-national ingest expansion (S-10 to S-19 in chapter 11).
- Editorial blog content cadence (S-40, S-46).
- Sentry re-enable (S-103).

These remain on the chapter 11 / chapter 15 §7 roadmap.

---

## Sign-off

When all nine blocks land + push and CI is green, this plan is complete. Update `docs/handoff/15_SESSION_5_UPDATE.md` (or a new `16_SESSION_6_UPDATE.md`) at session end.
