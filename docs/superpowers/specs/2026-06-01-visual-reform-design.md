# Visual reform — design spec (2026-06-01)

Status: DRAFT for founder async review. No code written yet. No builds run.

## TL;DR (the surprise)
The four dropped zips (`Margin Atlas (17)..(20)`) are **iterative re-exports of the
same design system that past sessions already integrated**. ~90% of the components
already live in `src/`. So this is **not** a greenfield reskin. It is three smaller,
safer jobs:

1. **Port** selective visual improvements from the newest iteration (set_20) into the
   ~8 live components whose export version changed meaningfully.
2. **Fix** the constraint violations the export would reintroduce on port (em-dashes,
   hardcoded hex, the Atlas Score).
3. **Decide + add** the handful of genuinely net-new pieces (editorial blog layouts,
   a texture pack, a few cell sections) — most are redundant or against a founder
   steer and should be skipped.

Saved, extracted, inventoried under `design-assets/incoming/set_17..20`. set_20 is the
superset/newest.

## Evidence (the diff)
Against the repo, set_20/src contains:

**Net-new (not in repo):** `billing/UpgradeModal`, `CostStructure`, `MethodologyBlock`,
`PeerCells`, `RolePay`. Earlier sets also carry net-new `BlogCoverCard`,
`DecadeArticleLayout`, `styles/atlas-reform.css`, and a "Niche Markers / Districts"
HTML mockup.

**Changed, large diff (real visual iteration, worth porting):** `WorldMapPicker`
(+98/-186), `HomepageHero` (+57/-65), `SectorIcon` (+56/-69), `EmptyState` (+50/-23),
`empty/CellDataMissingEmpty` (+62/-42), `empty/SectorUnderConstructionEmpty` (+42/-25),
`SectionDivider` (+40/-17), `LoadingSkeleton` (+40/-54), `DenseCellHero` (+40/-26),
`empty/ComingSoonPlaceholderCard` (+24/-16), `mobile/MobileCellHero` (+17/-13),
`billing/PricingFAQ` (+16/-31), `RotatingWords` (+11/-50), `HomepageEditorialBlocks`
(+4/-8).

**Changed, trivial diff (already effectively integrated — skip):** all four
`comparison/*` (1-4 lines), `mobile/MobileNavDrawer` / `MobileShareSheet` (1-3 lines),
`newsletter/NewsletterSignupVariants` (1 line).

## Constraints the export VIOLATES (must fix on every port)
- **Em-dashes in 15 export files.** Repo versions already had these stripped; that is
  part of why they read as "changed." A blind copy reintroduces them and fails the
  `verify_no_em_dashes` gate. Every ported line gets em-dashes converted.
- **Hardcoded hex in 8 export files.** Violates the tokens-only rule. Map to
  `design-tokens.ts` / Tailwind tokens on port.
- **Atlas Score in `DenseCellHero`.** Founder ruling: the Atlas Score is too risky.
  It is still live (hero prop + a separate `<AtlasScore>` row on the cell page).
  Resolve as part of this work (see Decision 1).
- **No source-agency names** in any copy added/ported (gate `verify_no_source_agencies`).
- **Section-order gate** + **layering gate** still apply to any wired component.

## Scope decision (what is IN / OUT and why)

### IN — Tier 1 (port + constraint-fix; low risk, high polish)
- **Empty / coverage states.** Port the visual upgrades to `EmptyState` + the three
  `empty/*` components (high diff, clearly on-brand, matches the "honest not-yet"
  philosophy). Wire the redesigned `not-found.tsx` (404). This is the cleanest win.
- **Cell hero.** Port `DenseCellHero` visual deltas, **minus** the Atlas Score, pending
  Decision 1. Keep mobile/desktop split as-is.
- **Mobile.** Port the small `MobileCellHero` delta; NavDrawer/ShareSheet diffs are
  trivial, skip.

### IN — Tier 2 (port; medium risk)
- **Homepage.** Port `HomepageHero`, `HomepageEditorialBlocks`, `RotatingWords`
  improvements. Confirm totals come from real data, not hardcoded counts.
- **Geo / decorative.** Port `WorldMapPicker` (largest diff — verify it does not
  regress current behavior), `SectorIcon`, `SectionDivider`, `LoadingSkeleton`.
- **Comparison + v2 geo (LondonRoadmap, CoverageHubV2, scorecards).** Already in repo;
  diffs trivial. Action is **wiring/verification**, not porting: confirm each is
  actually rendered on its route; if a strong component sits unused, wire it.

### DECIDE then maybe add — net-new
- **Editorial blog (`DecadeArticleLayout` + `BlogCoverCard`).** Genuinely net-new,
  genuinely useful for `/blog`. Recommend ADOPT (Decision 2).
- **`atlas-reform.css` texture pack.** Adopt **additively** (new optional utility
  classes), never ripping the current `atlas-pattern.css` / `homepage-visual-tokens.css`
  (Decision 4).
- **Niche district markers** (HTML mockup): could enrich `NeighborhoodOverview` /
  `CitiesDotsMap`. Low priority; evaluate after Tier 1+2.

### OUT — skip (redundant or against a founder steer)
- **`RolePay`** (annual pay by role). Founder steer: the site is **not** salary-focused.
  Skip unless Decision 3 overrides.
- **`CostStructure`** (P&L stacked bar). Redundant with the live `SmartWaterfall` +
  `AnnualCostStack`. Skip.
- **`PeerCells`, `MethodologyBlock`.** Redundant with the live comparables section +
  `CoverageBadge`/`CoverageIndicator`/`about-data`. Skip unless a clear visual win is
  found during the port pass.

### HOLD — Tier 3 (monetization)
- **`UpgradeModal`, `PricingFAQ`, pricing/account/billing refresh.** Founder is cautious
  on monetization. Hold for a dedicated later pass (Decision 5).

## Method (how each port is done safely)
For every CHANGED file:
1. `diff repo vs set_20`. Classify each hunk as **visual improvement** vs **local fix**
   (token swap, em-dash strip, Atlas-Score removal, prop wiring).
2. Apply only the visual-improvement hunks; preserve every local fix.
3. Re-run the constraint pass on the result: em-dash, hex-to-token, source-agency.
4. Component renders are **shown before commit** (per the always-dry-run-and-show rule).
   Because the user is away, ports are staged on a branch and previewed via the
   `/_design` catalog route or screenshots, never pushed live unreviewed.

For every NEW file: assess fit + redundancy, wire only if it earns its place, same
constraint pass, same preview-before-commit.

## Guardrails (hard)
- No `npm run build` / `prebuild` / `tsc` without explicit permission.
- No live render change without showing first.
- Tokens only (no raw hex/px/ms in components).
- No em-dashes; no source-agency names in copy.
- Respect layering + section-order gates.
- Small commits, reviewable; founder approves before anything ships to `main`/live.

## Sequencing (phases)
- **P0** Decisions (founder): Atlas Score, blog editorial, RolePay, texture pack,
  monetization timing.
- **P1** Tier 1 ports (empty states + 404, DenseCellHero minus Atlas Score, MobileCellHero).
- **P2** Tier 2 ports (homepage, WorldMapPicker, SectorIcon, dividers, skeleton) + wire-audit of comparison/v2.
- **P3** Net-new adopted in P0 (blog editorial, texture pack additive).
- **P4** (optional/held) monetization refresh.
Each phase: branch, port, constraint-pass, preview, founder review, commit.

## Decisions needed (async)
1. **Atlas Score** — remove entirely (recommend) and replace with coverage-confidence
   wording, or keep demoted?
2. **Blog editorial** (`DecadeArticleLayout` + `BlogCoverCard`) — adopt for `/blog`?
   (recommend yes)
3. **RolePay** (pay-by-role) — confirm skip given the not-salaries steer? (recommend skip)
4. **`atlas-reform.css`** — adopt additively, or leave current texture untouched?
   (recommend additive)
5. **Monetization** (Tier 3) — hold for later (recommend), or include now?

## Execution log (2026-06-02, branch `visual-reform`)
Founder answered the 5 decisions and said execute. Done on branch, not merged/live:
1. **Atlas Score killed** (`194555f`). Removed the strip + the `atlasScore` prop +
   deleted `AtlasScore.tsx`. Hero now shows a coverage word: loud on strong tiers
   (Measured data / Regional benchmark), silent on weak tiers.
2. **Longform blog adopted** (`471079b`). New `editorial/LongformArticle.tsx`,
   re-skinned to Atlas tokens, wired on every blog post. `BlogCoverCard` skipped
   (demo-hardcoded, not data-driven).
3. **RolePay skipped.** No code. Confirmed no salary speculation added.
4. **atlas-reform.css NOT adopted.** It is mockup-showcase CSS with a CONFLICTING
   palette under the same var names (terracotta `--atlas-700` vs live amber) and
   generic class names that risk collisions. The real texture pack (8 atlas SVGs +
   atlas-pattern.css) is already in the repo. Adopting it would be a regression, not
   an enrichment, so it was correctly declined.
5. **Gated free/paid design** (`28f566f`, dashes fixed `5fd3fa6`). New
   `lib/monetization/free_paid_map.ts` (the Free/Basic/Premium visibility plan, pure
   data) + admin-gated `/_design/monetized` preview showing fog, ghost bars,
   redaction, a key cue, and the full table on mock data. Live cell-page wiring
   deliberately deferred: an earlier gating wire broke the page (reverted
   2026-05-25), so it is a separate tested step. Key cue added per founder, distinct
   from the v34 no-padlock rule.

Pending: verify (tsc + prebuild), founder review of branch + `/_design/monetized`,
then merge + deploy. Tier-1/2 component PORTS from the spec (empty states,
WorldMapPicker, homepage polish) are NOT in this branch yet; they are the next pass.

## Verification (when implementation runs, with permission)
- `npm run prebuild` (26 gates) green, incl. em-dash, source-agency, section-order, layering.
- `npx tsc --noEmit` clean.
- `/_design` catalog updated for any changed/new UI primitive.
- Visual diff (screenshots) of every touched surface, desktop + mobile, shown before commit.

## Tier-1/2 PORT AUDIT (2026-06-02): SKIP ALL. The export is stale, not newer.

A direction-classification pass diffed every Tier-1/2 target (repo vs `set_20`) and
overturned the spec's core premise. The spec assumed a larger diff meant a newer export
worth porting FROM. The opposite is true: `set_20` is a snapshot taken BEFORE the
2026-05-27 design-system refactor, so the large diffs are the repo moving AHEAD
(adopting shared primitives, stripping hex, removing the Atlas Score), not the export
adding anything. Porting any target backward is a regression. Evidence per file:

| Target | Verdict | Regression the export would reintroduce |
|---|---|---|
| `EmptyState`, `empty/CellDataMissingEmpty`, `empty/SectorUnderConstructionEmpty` | SKIP | Repo composes the `ui/empty-state` primitive (Phase 2). Export re-inlines markup, hardcodes hex (`#F8F2E4`), and DROPS the suggestion-chip focus-visible ring (WCAG AA). Primitive already has the amber left-rule + hatched variant the export "adds". |
| `app/not-found.tsx` (404) | SKIP (dangerous) | Export reintroduces Phosphor `/dist/ssr` barrel imports, the exact shape that ENOENT-killed every Vercel deploy on `4348a23`+`4680afc`+`34b9e61`. Repo is deliberately minimal HTML+Tailwind. Also adds inline `clamp()` px. |
| `DenseCellHero` | SKIP | Reintroduces the killed Atlas Score (`atlasScore` prop) plus hardcoded hex. |
| `mobile/MobileCellHero` | SKIP | Strips the shared `HowWeKnowThis` primitive, re-inlines the old coverage chip. |
| `HomepageHero` | SKIP | Restores hardcoded stat counts the repo removed by design. |
| `WorldMapPicker` | SKIP | Loses zoom/pan (ZoomableGroup -> Marker) + 10 hardcoded hex colors. |
| `RotatingWords` | SKIP | Drops the `prefers-reduced-motion` a11y guard. |
| `LoadingSkeleton` | SKIP | Abandons the `ui/skeleton` primitive for inline `#F4EAD5` hex. |
| `SectorIcon`, `SectionDivider`, `HomepageEditorialBlocks` | SKIP | Inline styles, em-dashes, spacing downgrades; no visual gain. |

Conclusion: there is no porting work. The reform's genuinely-new value (Atlas Score
removal `194555f`, longform blog `471079b`, `free_paid_map` `28f566f`) was already
merged. PART 10 item #3 ("Tier-1/2 visual component PORTS") is hereby CLOSED as
"audited, do not port." `design-assets/incoming/set_17..20` are a historical artifact
only; do not port from them. The forward path for visual improvement is net-new design
inside the current (superior) primitive system, not backward ports. The one survivor
from the spec's Tier-2 is the non-port "wire-audit": confirm the strong v2 geo
components (`LondonRoadmap`, `CoverageHubV2`, City/Country scorecards) and `comparison/*`
are actually rendered on their routes, and wire any strong orphan that sits unused.
