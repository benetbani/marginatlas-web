# Reformation Progress

Live log of the Wave 1 build. Pairs with `REFORMATION-BIBLE.md` (the spec) and
`REFORMATION-EXECUTION-PLAN.md` (the plan). Branch: `reform/warm-atlas-flagship`.

## Done and verified

### Warm Atlas design system (Fix 2)
- Re-toned every colour family in `src/lib/design-tokens.ts` to warm sand
  surfaces, warm brown-black ink, terracotta / burnt-sienna accent, warm taupe
  borders, muted-sage cool accent. Token NAMES unchanged, so all 136 components
  inherited the warmth with no churn.
- Mirrored into `globals.css`, `homepage-visual-tokens.css`, `atlas-pattern.css`.
- Gated: tsc clean, all 25 prebuild gates green.
- Preview built and **Ready** (cold build, 24 min): the warm site is viewable.

### Flagship cell page (decision-first, bible Section 6)
- New backend value engine:
  - `src/lib/scores/index.ts` — the 0-to-100 scores (Profitability, Rent
    headroom, Market room, Owner take-home, blended Opportunity). Banded, no
    decimals, higher always better, omit-when-undefendable. Reads the page's
    own tax-aware net numbers so the whole page agrees on one set of figures.
  - `src/lib/scores/verdict.ts` — the opinionated hero verdict (Section 25
    voice): always names an upside and the thing that can break it.
  - `tests/scores/scores.test.ts` — banding, omission, determinism. PASS.
- New warm UI:
  - `src/components/cell/VerdictHero.tsx` — H1 question, the verdict, typical
    revenue range, headline Opportunity score. One responsive component
    replacing the old Dense/Mobile hero pair.
  - `src/components/cell/ScorePanel.tsx` — the component scores as calm cards.
- Wired into `src/app/[country]/[geo]/[industry]/page.tsx`, preserving the
  data fetch, generateMetadata, JSON-LD (Dataset + FAQ + Breadcrumbs), URL,
  size/year switcher, and every edge case (US measured path, missing-data
  fallback to HeroBenchmark).
- Gated: tsc clean, all 25 gates green. Preview building.

## Notes / constraints discovered
- **Preview builds are slow when cold** (24 min: 606 pages prerendered, each
  hitting Supabase, queries hitting their budgets; Italy's country page even
  hit the 300s per-page cap once). Watching whether warm-cache builds are
  faster. If they stay slow, raise with founder: candidate fixes are on-demand
  ISR for the data-heavy routes, or a Supabase compute bump for build bursts.
  Not changing prerender strategy or infra autonomously.
- **Preview deployments are behind Vercel SSO** (HTTP 401 to anonymous). The
  founder can view preview URLs on logged-in devices; automated screenshots
  cannot. Verification here is gate-based (tsc + 25 gates + the score test) plus
  code review. To enable visual self-checks, founder could add a Protection
  Bypass token or relax preview protection (their call; a security setting).

## Next (in order)
1. Verify the flagship preview build is Ready; eyeball the live cell page.
2. Country page `/[country]` — warm + decision-first per bible Section 5
   (business climate, tax/wage/friction, top industries, rolled-up scores).
3. Industry page `/industries/[industry]` — "business model anatomy", Section 5.
4. City, Home, Compare, Calculator, Sectors.

## Preview URLs (Vercel, founder-viewable when logged in)
- Warm design system (Ready): marginatlas-web-twtl-8brab97ma-benets-projects-3110e8e1.vercel.app
- Flagship (building): marginatlas-web-twtl-d32qh7pdo-benets-projects-3110e8e1.vercel.app
