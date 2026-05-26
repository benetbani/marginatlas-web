# Visual upgrade §6 — 320/375px mobile audit sweep

Date: 2026-05-26.
Author: ben + atlas-bot.
Status: PASS — one real fix shipped, all remaining findings triaged as intentional.

## What this sweep does

§6 is the explicit mobile-safety pass after §1-§5 landed visual primitives
and typography tokens. CLAUDE.md project rule: **"Mobile is the most
critical failure point."** Every new component must verify against
320/375px viewports.

This sweep uses the existing static audit (`scripts/audit/mobile_static_audit.ts`)
plus manual review of:
1. The three primitives shipped in §1-§4 (StatCard, BarList, ProgressBar).
2. The pages where they're wired (cell, decide, coverage).
3. Any source-level patterns that historically broke mobile.

## Audit script: rules

The script scans 282 source files for 5 mobile-failure patterns:

1. **fixed-px-width** — `w-[800px]`, `min-w-[1200px]`, `style={width: "1024px"}`
   that would force horizontal scroll at 320px. `max-w-` excluded
   (caps large screens, lets small ones use 100%).
2. **large-text-no-mobile** — text-5xl through text-9xl appearing as
   the unprefixed base with no smaller text-N companion on the same
   line. Mobile-prefixed components and the typography token registry
   are exempt.
3. **high-col-no-breakpoint** — `grid-cols-4+` without `sm:/md:/lg:`
   responsive prefix.
4. **tiny-tap-target** — `text-xs` buttons with `p-1`/`py-0.5` padding.
5. **nowrap-on-content** — `whitespace-nowrap` on text that isn't
   small/truncated/tabular. Comment lines and button/tabs primitives
   are exempt.

## Findings (after audit tuning)

| Category                | Count | Action                              |
| ----------------------- | ----- | ----------------------------------- |
| fixed-px-width          | 0     | -                                   |
| large-text-no-mobile    | 2     | Reviewed -> intentional (see below) |
| high-col-no-breakpoint  | 12    | Reviewed -> all intentional         |
| tiny-tap-target         | 0     | -                                   |
| nowrap-on-content       | 14    | Reviewed -> all intentional         |

## Real fix shipped

**`src/components/v2/CityHeroV2.tsx:140`** — city name H1 was bare
`text-5xl` with no mobile fallback. Long city names ("San Francisco",
"Buenos Aires") would overflow the column at 320-375px. Fixed to
`text-4xl sm:text-5xl`.

## Tolerated findings (with reasoning)

### large-text-no-mobile (2)

- `not-found.tsx:29` — `text-6xl sm:text-7xl` on a centered "404"
  display number (single 3-char string, leading-none, aria-hidden).
  ~180px at text-6xl, fits inside 272px content width at 320px.
  Audit can't tell single-char displays from H1s. **Tolerated**.
- `SmartImage.tsx:86` — `text-5xl md:text-6xl` on a single glyph icon
  (aria-hidden). Same reasoning. **Tolerated**.

### high-col-no-breakpoint (12)

All intentional:
- `download/2026-benchmarks:199`, `CalculatorForm:268`,
  `QuartileMarkers:90` — 5-quartile or 12-column horizontal compare
  bars where stacking destroys the whole comparison.
- `comparison/*` — 12-column comparison table layouts; the grid IS
  the comparison.
- `LoadingSkeleton.tsx` — skeleton placeholders, only visible during
  brief loads.
- `mobile/*` — already-mobile-specific components.
- `MobileShareSheet:153` — 4-up share-button grid; fine at 320px
  because the row contents are icons not text.

### nowrap-on-content (14)

All intentional pill buttons, short labels, table cells, or chart
axis tick labels:
- `account/page.tsx:108` — button chip
- `cities/[slug]:310,316,322` — three decide-wizard CTA pills with
  short labels ("Restaurants", "Pharmacies", "Other activity")
- `CountryAtAGlance:118` — short country name link
- `DecideActivitySelector:33` — short label
- `DenseCellHero:199` — small italic suffix
- `DistributionVisual:233/250/263` — chart axis tick labels
  ("Bottom 10%", "Typical", "Top 10%")
- `MultiCellComparisonTable:156` — `<td>` cell preserving number-line
  integrity
- `SectionDivider:46`, `FailureModes:66` — section divider labels
- `TruncatedTease:60` — accent badge

## Manual review of shipped primitives

Reviewed at 320px viewport (the worst-case modern phone):

**StatCard** (`src/components/ui/stat-card.tsx`):
- Default `md` size = `px-4 py-3`. Content width inside a 320px parent
  with normal page padding: ~288px. ✓
- Value uses `text-xl md:text-2xl` = 20px on mobile. Even "$1,200,000"
  fits. Label and sub use `truncate`. ✓
- `lg` size value = `text-2xl md:text-3xl` = 24px on mobile. Fits with
  truncation if needed. ✓

**BarList** (`src/components/ui/bar-list.tsx`):
- Grid: `minmax(0, 1fr) auto`. The `min-w-0` allows the name column
  to shrink, value column always sized to content. ✓
- Name uses `truncate`. Bar is `w-full`. ✓
- `size="compact"` for tight contexts (18px bar) works at 320px.

**ProgressBar** (`src/components/ui/progress-bar.tsx`):
- Always `w-full`. Heights are 6/8/12px. ✓
- Optional label + valueLabel in `flex justify-between` with `mb-1`.
  At 320px, label and value share the row with small text-xs. ✓

## Wired-in sites: spot check

- **Coverage page tier bars** (`coverage/[iso2]:152-178`): grid is
  `[60px,1fr,80px]`. At 320px the middle bar gets ~(320-60-80-padding)
  = ~168px. Comfortable. ✓
- **Cell breakeven panel** (`[country]/[geo]/[industry]:786-823`):
  outer grid is `grid-cols-2 md:grid-cols-4`. Each tile gets ~140px
  on mobile. ProgressBar fits at sm size with ~120px effective width. ✓
- **Decide top-3 cards** (`decide/[activity]/[city]:274-340`): outer
  grid is `grid-cols-1 md:grid-cols-3`. Each card is full-width on
  mobile (~288px). ProgressBar fits comfortably. ✓

## Conclusion

§6 sweep complete:
- 1 real mobile bug fixed (CityHeroV2 H1).
- 28 audit findings reviewed and triaged as intentional.
- 3 new primitives (StatCard, BarList, ProgressBar) verified mobile-safe.

The static audit catches the patterns it can without a headless
browser. For runtime layout overflow at exact 320/375/414px, the next
sweep should use Playwright or a similar headless probe. That work is
queued behind §7 (post-ship QA).

## Audit tuning shipped

- Skip pure comment lines (//, *, /*, {/*) in all rules.
- Skip the typography token registry (it defines sizes, doesn't use
  them).
- `large-text-no-mobile`: exempt files under `/mobile/` (already
  mobile-specific by definition).
- `nowrap-on-content`: skip lines without `className=` (comment text);
  exempt `ui/button.tsx` + `ui/tabs.tsx` (the canonical pills where
  nowrap is the whole point of the variant).
- `fixed-px-width`: excluded `max-w-` (caps don't break mobile).

## Next workstream

§7 post-ship QA (tsc, prebuild, lighthouse, sentry) — small.
Data expansion research doc — medium.
