# Plan v25 — Universal Fill: every page rendered, no exceptions

> Founder direction 2026-05-22 after walkthrough: "fill every page as if
> you had all the data. The interface has to look sharp and fine at this
> moment. Data checking and improving happens later." The Block 1-12 v24
> work caught the data-integrity bugs; v25 closes the visual presence gap.

## Goal

After v25, every URL on Margin Atlas that should render a benchmark
renders a complete one. No "Click for details" placeholders, no
half-filled profit waterfalls, no blank distributions, no 404s where a
plausible average could ship instead. Synthesized data is clearly
badged (Estimated / Sector average) but never absent.

## Founder's eight specific complaints (this session)

| # | Problem | Block |
|---|---|---|
| 1 | `/industries` page links go to `/us/california/...` instead of `/industries/[industry]` (global) | 7 |
| 2 | Featured tiles still show "Click for details" for some cells | 6 |
| 3 | Profit waterfall renders partially (Gross filled, Operating/Net empty boxes) | 4 |
| 4 | Profit waterfall hidden behind summary; should be visible by default | 4 |
| 5 | Software dev California $525K with $99K wage/employee makes no common sense | 2 |
| 6 | Right-side "On this page" TOC is too close to center; needs to shift right | 9 |
| 7 | "Show me the numbers" button on /de/de30/nightclubs/?size=10-49 is not clickable | 8 |
| 8 | Some regional pages say "no deeper subdivisions covered" — should fall through to country default fill | 3 |

Plus the universal-fill thesis: synthesize defaults so EVERY page is full.

## Architecture shift

**Old behavior:** `getCellBySlug(country, geo, industry)` returns a Cell
on hit, returns `null` on miss → page 404s or shows fallback chrome.

**New behavior:** `getCellBySlug` ALWAYS returns a Cell. The fallback
chain extends:

```
regional_cells → extrapolated_cells → sector_fallback → SYNTHESIZED
```

Synthesized cells are tagged `coverage_tier="X"`, `quality_score=20`,
and a new field `is_synthetic=true`. The UI renders them like real
cells but with an "Estimated" badge and a disclosure footer.

All other render layers (RevenueTiles, MarginWaterfall, DistributionVisual,
NetProfitSummary, AcrossCountriesStrip) now require a non-null value for
every field. Missing fields are synthesized at the data layer before the
render layer ever sees them.

## The twelve blocks

| Block | Focus | Effort | Output |
|---|---|---:|---|
| 1 | Defaults engine: `src/lib/cells/fill_defaults.ts` | 3-4h | New module + tests |
| 2 | Common-sense math: revenue ≥ payroll × employees | 2h | Sanity helper in fill_defaults.ts |
| 3 | Always-render Cell guarantee in `getCellBySlug` | 2-3h | cells.ts patches |
| 4 | Profit waterfall full fill + always-visible | 2-3h | MarginWaterfall.tsx + cell page |
| 5 | Distribution full fill (synthesize log-normal spread) | 1-2h | fill_defaults.ts + RevenueDistribution |
| 6 | Featured tiles: every tile renders with $X | 2h | page.tsx FEATURED + tile component |
| 7 | `/industries` page links to global pages + sector icons | 2h | industries/page.tsx |
| 8 | "Show me the numbers" button click bug fix | 1-2h | Cell page form handler |
| 9 | Right TOC position offset | 30min | Layout component |
| 10 | Sector icons everywhere (chips, tiles, lists) | 2-3h | Audit + add missing icons |
| 11 | "Estimated" / synthetic badging UX | 2h | QualityDots + new badge |
| 12 | End-to-end verification | 2h | Audit run, prod curl, founder review |

Total: ~24-30 hours of focused work.

## Block details

### Block 1 — Defaults engine

`src/lib/cells/fill_defaults.ts` exports `synthesizeCell(iso2, industrySlug)`:

```typescript
export function synthesizeCell(
  iso2: string,
  industrySlug: string,
  geoName?: string,
): Cell {
  // 1. Look up industry → use industry_margins.json for margins
  // 2. Look up country → use country_payroll.json (NEW) for wages
  // 3. Look up sector → use sector_averages.json (NEW) for typical revenue
  // 4. Apply per-industry rev_per_firm base from REVENUE_PER_FIRM_BOUNDS midpoint
  // 5. Synthesize log-normal spread: p10=0.25x, p25=0.55x, p50=1x, p75=1.85x, p90=3.4x
  // 6. Apply currency from country
  // 7. Stamp is_synthetic=true, coverage_tier="X", quality_score=20
}
```

Input data files to build/use:
- `industry_margins_verified_v1.json` (already exists)
- `country_payroll_v1.json` (NEW — per-country median wage)
- `country_smb_baseline_v1.json` (NEW — per-country small-business revenue baseline)
- `REVENUE_PER_FIRM_BOUNDS` from `src/lib/qa/smb_bounds.ts` (use midpoint as default)

### Block 2 — Common-sense math

Add `enforceSanity(cell)` helper that:
1. Computes `total_payroll = (n_employees || synthesized_employees) × payroll_per_employee`
2. If `revenue_per_firm < total_payroll × 1.4` (i.e. not enough margin for cost-of-goods + overhead + profit), bump revenue to `payroll × 1.6` minimum
3. Ensure net profit positive: `revenue × net_margin > 0`; if not, set net_margin to industry default

The founder's example: software dev California $525K revenue, $99K wage. If 4 employees → $396K payroll. Sanity check: $525K / $396K = 1.32 → too tight. Bump revenue to $396K × 1.6 = $634K. Now numbers add up.

### Block 3 — Always-render Cell guarantee

Modify `getCellBySlug` in `src/lib/cells.ts`:

```typescript
export async function getCellBySlug(...) {
  // existing chain: regional → extrapolated → sector fallback
  const existing = await /* existing chain */;
  if (existing) return existing;
  // NEW: synthesize from defaults
  return synthesizeCell(country, industrySlug, geoNameFromSlug(country, geo));
}
```

Same for `getRegionalCell`, `getExtrapolatedCell`, `getSectorFallbackCell` —
all become non-nullable.

The cell page (`src/app/[country]/[geo]/[industry]/page.tsx`) no longer
needs the 404 branch.

### Block 4 — Profit waterfall full fill + above-fold

Two changes to MarginWaterfall.tsx:

1. **Never partial-render.** If gross/operating/net are missing,
   synthesize from industry defaults at the data layer (Block 1). The
   component is guaranteed three non-null values.

2. **Always render the three bars.** Remove the `g != null && ...`
   guards. The bars are always shown.

In the cell page, **promote MarginWaterfall above the related-cells
section** — the founder said it shouldn't be hidden behind a summary.
Check current placement and move if needed.

### Block 5 — Distribution full fill

In `RevenueDistribution` component (and `DistributionVisual`):
- Require non-null p10/p25/p50/p75/p90
- If a percentile is missing, synthesize using log-normal spread from the
  point estimate: `p10 = p50 × 0.25`, `p25 = p50 × 0.55`, `p75 = p50 × 1.85`,
  `p90 = p50 × 3.4`. These multipliers come from observed SMB revenue
  distributions across industries.

Same defaults applied at the data layer (Block 1).

### Block 6 — Featured tiles always rendered

In `src/app/page.tsx`, the FEATURED array currently has 6 entries.
After Block 3's always-render guarantee, all 6 will resolve with
either real or synthesized data. Verify by running the prebuild
verifier (`scripts/verify_featured_tiles.ts`).

The `FeaturedCellTile` component still has a `revenue == null ? "Click
for details" : fmtMoney(revenue)` branch. **Remove the fallback string
entirely** — with Block 3 in place, revenue is never null for a valid
cell.

### Block 7 — `/industries` page fix

Change `src/app/industries/page.tsx`:
- Replace `href={`/us/california/${slug}`}` with `href={`/industries/${slug}`}`
- Sector icons are already on POPULAR (✓ has glyph field). Audit the
  "By sector" section: each sector group needs its own icon at the
  heading.

Also verify `/industries/[industry]/page.tsx` is the right landing —
should show "How {industry} earns across the world" with country
comparison and global typical revenue.

### Block 8 — "Show me the numbers" button click bug

The button on `/de/de30/nightclubs/?size=10-49` (or wherever) isn't
clickable. Likely causes:
- Form submit handler not wired
- Button covered by an invisible overlay element
- z-index issue with the right TOC

Investigation: open the cell page in Chrome DevTools, inspect the
button's hit-test, find what's intercepting the click.

### Block 9 — Right TOC offset

The "On this page" floating TOC ("orienting factor") is positioned too
close to center. Find the layout component (likely in the cell page
template) and adjust:
- Currently: `right-8` or similar
- Target: `right-4` or even `right-2` (further right, smaller gap to
  viewport edge) AND/OR increase the gap between main content and TOC
  via `pr-N`

### Block 10 — Sector icons everywhere

Audit every place a sector or industry is named and confirm an icon
appears next to it:
- Featured tiles (already has icon — verify)
- Industries page Popular section (✓)
- Industries page By sector (NEEDS — heading-level)
- Country page top industries grid
- Sector page header
- Cell page related industries strip
- Search results

Reuse the emoji glyphs from `POPULAR` and add a `SECTOR_ICONS` map.

### Block 11 — Synthetic data badging

Create a clear visual indicator on synthesized cells:
- Top of cell page: small badge `Estimated · based on national averages`
- QualityDots show 1 dot (lowest tier)
- Footer disclosure: "Direct measurements for this cell aren't yet
  covered. The numbers above are synthesized from country and industry
  averages."

The existing 5-dot system handles this via `quality_score=20` →
1-dot rendering. Verify it works.

### Block 12 — End-to-end verification

Run after all 11 blocks land:
1. Re-run `scripts/audit/page_fill_from_supabase.ts` — expect ≥99% ok
2. Grep production rendered HTML for "Click for details" — expect 0
3. Spot-check 10 cells visually: `/de/de30/nightclubs`,
   `/jp/jp-13/restaurants`, `/cl/cl/restaurants`, `/li/li/utilities`,
   `/us/california/software-development`, etc.
4. Verify production sitemap finally serving populated XML
5. Founder review before declaring v25 complete

## Quality gates per block

- `npx tsc --noEmit` passes
- `npm run prebuild` passes (taxonomy, em-dashes, source-agencies,
  dead-links, featured-tiles)
- Local prod build returns 200 on top 20 cell URLs
- Each block's commit message includes block number + scope
- Commit + push after each block
- Wait for Vercel deploy
- Smoke-test ≥3 representative cells post-deploy

## Quality gate at end of Block 6

Founder review checkpoint: synthesized cells should render
indistinguishably from real cells visually (with the Estimated badge
clearly visible). If the visual quality of synthesized cells isn't
good enough, refine before continuing to Block 7+.

## Critical safety

1. **Never mutate source data.** Synthesis is render-layer only.
   `cells_master`, `regional_cells`, `extrapolated_cells` stay untouched.
2. **Synthetic data is clearly badged.** Users must be able to tell at a
   glance whether they're looking at measured or estimated numbers.
3. **The disclosure footer is always present** on synthesized cells.
4. **Common-sense math is enforced** — no $525K revenue cells with
   $99K wage and 4 employees. Either the revenue is bumped or the
   employees are reduced.
5. **All numbers stay within SMB-physical bounds** from
   `src/lib/qa/smb_bounds.ts`. Synthesis honors the same envelope as
   the scale-sanity scanner.

## Out of scope (deferred to a future plan)

- Real-image commissioning for unmapped cells
- Auth / Stripe (B-011)
- New data ingest (the founder explicitly said: data improving comes
  later in a separate process)
- Multi-language alt text
- API endpoint coverage for synthesized cells (still serves real-only)
