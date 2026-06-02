# Site-wide professional pass, design spec (2026-06-02)

Status: approved by founder (ambition = "unify + fix"; approach A; user-facing surfaces
only; data-confidence treatment for bad cells). Next: implementation plan via
writing-plans. No code beyond what each tranche specifies; every render/data change is
dry-run and shown before it ships.

## 0. Goal

Make marginatlas.com read as a single, professional, higher-level product by (a) unifying
the design language across every user-facing surface onto the shared primitives, (b)
fixing the concrete visual errors and brand violations the audit found, and (c) promoting
the finished v2 components after a tokenize + de-blue pass (S3). Keep the warm-earth
aesthetic. "Professional" is achieved through rigor and consistency, not a redesign.

## 1. Guardrails (carried, non-negotiable)

- No em-dashes in `src/**`; no source-agency names in user-facing copy; tokens only.
- Stage exact files, small scoped commits, never `git add -A` (avoids the `data/audit/*`
  and `tsbuildinfo` regenerated noise).
- Local `next build`/`dev` OOMs; Vercel is the compiler. A failed Vercel build does not
  promote, so production stays safe. Local proof is `tsc --noEmit` + the prebuild gates.
- Ship to production (`main`), not a preview branch. Founder reviews on the live deploy.
- Always dry-run and show before any data or render change.

## 2. Grounded audit (what this plan fixes)

From a 3-agent read-only audit (2026-06-02). Concrete, not theoretical.

### 2.1 Consistency (the largest professional lever)
- ~115 files hand-roll their own eyebrow instead of `ui/section-eyebrow`, at 5+ trackings
  (`wide`, `0.16em`, `0.18em`, `0.22em`, `wider`) and 3 colors (`atlas-600`/`atlas-700`/
  `cocoa-700/60`). User-facing offenders include `compare/CompareClient.tsx:156`,
  `cities/page.tsx:114`, `sectors/[sector]/page.tsx:87`, `industries/page.tsx:42,62`,
  `calculator/page.tsx:31`, `pricing/page.tsx:103,129,181`, `cities/[slug]/page.tsx:339,378,416`,
  `[country]/[geo]/page.tsx:136`.
- Hand-rolled card shells (different border/shadow/radius) on compare, cities, sectors,
  calculator, pricing, neighborhoods, instead of `ui/card` + `.atlas-card`.
- Section spacing drifts (`py-4` / `py-8` / `py-10` / `py-16`) with no rhythm.

### 2.2 Errors and brand violations
- BRAND BREACH: `pricing/page.tsx:236-237` button shadow uses `rgba(22,174,181,0.08)`, the
  sibling product's teal/aqua. Violates R-001. Must be retired.
- `pricing/page.tsx:278` ships "Coming soon. Drop your email below..." stub copy on a live
  surface. Violates R-016.
- `pricing/page.tsx:103,129,181,138,140,153` use `text-[11px]` and mixed trackings (token
  violation + inconsistency).
- REGION NAMES: ES511 and every EU NUTS2 region render the code, not the name.
  `data/coverage/admin1_regions_v1.json` has the names but they are not wired into
  `src/lib/cells/geo.ts geoNameFromSlug()`. One fix clears the whole class.
- `/industries` missing its Popular, A-Z, and sector-emoji sections (audit B4/B6/B7).
- Homepage missing `og:title` (E4); Speed Insights not wired (G7).
- Mobile: 4 headings size only at `md:` with no base/`sm:` scale, so 320px gets desktop
  size: `blog/page.tsx:28`, `blog/[slug]/page.tsx:50`, `not-found.tsx:29`,
  `components/SmartImage.tsx:86`.
- Neighborhood pages missing sibling links (H6) and a parent-city back-link (H9).
- Hardcoded delta-indicator hex `#14532D` `#16A34A` `#CA8A04` `#7F1D1D` in
  `cities/[slug]/neighborhoods/page.tsx:125-130`, `[country]/[geo]/[industry]/page.tsx:911-916`,
  `decide/[activity]/[city]/page.tsx:292-301`.
- No automated gate for hardcoded hex/px/ms, which is why ~47 files accumulated them.

### 2.3 Data quality (not a visual fix)
- `data/audit/page_sanity_audit_v1.json`: 449 extrapolated_cells with implausible revenue
  (280 rev_too_high, 137 currency_likely_local, 32 rev_too_low). All low-confidence
  synthesized rows. Needs a visible low-confidence treatment + exclusion from top/featured
  lists, not silent hiding.

### 2.4 Confirmed already-fixed (do not re-do)
- Scale-anomaly giants ($500M to $2B): fixed in `9a349876` (enforceSanity on regional read).
- D4/D8 percentile/waterfall clamps: fixed in `887aab5e`. Verify on a fresh build, do not
  re-implement.

## 3. Phase 0, Foundation (1 tranche, no visible change)

1. Add semantic delta tokens to `src/lib/design-tokens.ts`: `delta.positive` (moss),
   `delta.atpar` (atlas/neutral), `delta.caution` (atlas-300, warm), `delta.negative`
   (clay), exposed through `tailwindColors` so `text-delta-positive` etc. exist. These replace
   the hardcoded green/yellow/red multiplier hex.
2. Add `scripts/verify_hardcoded_hex.ts` and wire it into `prebuild`. It scans `src/app` and
   `src/components` `.tsx` for `#[0-9a-fA-F]{3,6}` literals, fails on new matches, and reads an
   allowlist file seeded with today's offenders (so the build stays green). Excludes
   `design-tokens.ts`, OG image routes (`og/**`, `icon.tsx`), and SVG-map fill components,
   which legitimately need raw color. Concurrency <= 4 to match the Windows prebuild rule.
3. Document the canonical choices in `docs/design-system`: card = `ui/card` + `.atlas-card`;
   eyebrow = `SectionEyebrow size="md"` (text-xs, 0.18em); section rhythm = the
   `sectionSpacing` tokens already in `design-tokens.ts`.

Verify: `tsc --noEmit` clean, `prebuild` green (gate passes on the seeded allowlist).

## 4. Phase 1, Per-surface slices

One deploy per surface, ordered by impact. Each slice, for that surface only: convert
hand-rolled eyebrows to `SectionEyebrow`; convert hand-rolled cards to `ui/card`/`.atlas-card`;
normalize section padding to the rhythm; tokenize its hardcoded hex; fix its listed bugs.

| Order | Surface | Files | Surface-specific fixes (beyond unify) |
|---|---|---|---|
| 1 | Pricing | `app/pricing/page.tsx`, `components/billing/*` | Remove the teal `rgba(22,174,181)` shadow (R-001); replace the "coming soon" stub with honest copy; drop `text-[11px]` sizes. |
| 2 | Compare | `app/compare/page.tsx`, `CompareClient.tsx`, `app/compare/cities/[pair]/page.tsx` | Replace the undefined `.card` usage; unify the header eyebrow. |
| 3 | Cities | `app/cities/page.tsx`, `app/cities/[slug]/page.tsx`, `app/cities/[slug]/neighborhoods/page.tsx`, `components/cities/*` | Tokenize the inline `rgba(76,39,18,...)` card border + the delta hex; unify the three section eyebrows. |
| 4 | Sectors | `app/sectors/[sector]/page.tsx` | Tokenize the `#F5F5F5` header fallback; normalize `py-4/py-8` rhythm; unify eyebrow. |
| 5 | Industries | `app/industries/page.tsx` | Restore Popular / A-Z / sector-emoji sections (B4/B6/B7), after confirming they were dropped unintentionally and not a deliberate removal; unify eyebrow. |
| 6 | Calculator | `app/calculator/page.tsx`, `components/CalculatorForm.tsx` | Card shell to `ui/card`; unify eyebrow; check the `grid-cols` mobile breakpoint. |
| 7 | About-data | `app/about-data/page.tsx` | Add the missing eyebrows/hierarchy so it stops reading naked. |
| 8 | Neighborhoods | `app/[country]/[geo]/page.tsx`, neighborhood views | Tokenize delta hex; unify eyebrow + card; add H6/H9 sibling and back links. |

Verify per slice: `tsc` clean, Vercel green, then curl the surface on prod with browser
headers and confirm (a) it renders 200, (b) the unified eyebrow signature (`leading-none` +
`tracking-[0.18em]`) is present, (c) the specific bug fix shows (for example, no
`rgba(22,174,181` in the pricing CSS, no "Coming soon").

## 5. Phase 2, Global fixes (targeted slices)

1. Region-name resolution: extend `geoNameFromSlug()` in `src/lib/cells/geo.ts` to load
   `data/coverage/admin1_regions_v1.json` and resolve NUTS2/admin1 codes to human names
   before the existing fallbacks. Dry-run on `/es/es511/...` (expect "Extremadura") and a
   couple of other EU regions; show before/after; then ship. This is a render change across
   many cells, so it gets its own slice and explicit verification.
2. Homepage `og:title` (add to `app/page.tsx` metadata); Speed Insights wiring.
3. Mobile text scaling: add base/`sm:` sizes to the 4 flagged headings.
4. Data-confidence treatment for the 449 implausible cells: a low-confidence banner on
   extrapolated cells whose revenue trips the page-sanity bounds, plus exclusion of those
   rows from top/featured/"popular" lists. Carefully scoped (touches cell render + list
   queries); dry-run and verify on a known bad cell and a known good cell before shipping.

## 6. Phase 3, S3 (v2 promotions)

1. Tokenize + de-blue `components/v2/CountryScorecardV2.tsx` and `components/v2/CoverageHubV2.tsx`:
   replace every hardcoded hex (incl the `#2563EB` blue tier dot) with the `tier` tokens and
   `TierDot`. (CityHeroV2/SectorCardV2/FeaturedCardV2 stay parked; see the v2 review verdict.)
2. Promote `CoverageHubV2` into a real `/coverage` hub: `app/coverage/page.tsx` currently
   redirects to `/world`. Replace the redirect with the hub, wired to real coverage data
   (countries + tier + cellCount + lastRefreshed) from the coverage lib / DB. Keep `/world`
   and cross-link. (Adds a route; no slug rename, so SEO equity is preserved.)
3. Promote `CountryScorecardV2` onto the country page, fed by `getCountryEconomicsSnapshot`,
   replacing or augmenting the current `CountryAtAGlance` + `CountrySignaturePanel` stack.
   Show before/after on a real country (for example `/de`).

Verify: each shown before/after on the live deploy; founder confirms the swap before the
next step.

## 7. Verification protocol (every tranche)

1. `npx tsc --noEmit` clean (real-project errors, ignoring the gitignored `design-assets`).
2. Dash + agency scan on changed files (`[\x{2014}\x{2013}]`, agency keywords).
3. Stage exact files; small scoped commit ending with the Co-Authored-By line; push `main`.
4. Poll the commit's Vercel status via `gh` until `success`.
5. Curl the affected prod URL(s) with browser headers; grep for the unified signature and
   the specific fix; confirm 200 and no breakage.

## 8. Risks and mitigations

- Cannot render locally: mitigated by `tsc` + small single-surface tranches + targeted prod
  curl verification; a failed Vercel build never promotes.
- Region-name and 449-cell changes touch core rendering: dry-run, verify a known-good and a
  known-bad case before and after, ship in isolation.
- The hardcoded-hex gate could block the build if the allowlist is wrong: seed it from the
  live audit list, run prebuild before pushing, keep the gate scoped to new literals only.
- `/coverage` redirect to a real page: keep `/world`, cross-link, no slug rename.

## 9. Out of scope (YAGNI)

- Internal `admin/*` and `dev/*` pages (not user-facing; skip the churn).
- A visual redesign / new aesthetic (explicitly not chosen; this is unify + fix).
- Re-implementing the already-fixed scale-anomaly and D4/D8 clamps.
- The parked v2 components (CityHeroV2, SectorCardV2, FeaturedCardV2) and `atlas-reform.css`.
- Stripe/billing, auth, editorial-tone content (all separately gated).

## 10. Tranche sequence (the commit order)

P0 foundation -> pricing -> compare -> cities -> sectors -> industries -> calculator ->
about-data -> neighborhoods -> region-names -> og/speed-insights/mobile-text ->
data-confidence treatment -> S3 de-blue -> /coverage hub -> country scorecard.

Each arrow is at least one shipped, verified deploy. Founder can halt or reorder at any
tranche boundary.
