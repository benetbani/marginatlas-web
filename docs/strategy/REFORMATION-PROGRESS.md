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
- Gated: tsc clean, all 25 gates green. Preview built and **Ready** (warm-cache build, 14 min). The reformed cell page is viewable.

## Notes / constraints discovered
- **Preview builds are slow when cold** (24 min: 606 pages prerendered, each
  hitting Supabase, queries hitting their budgets; Italy's country page even
  hit the 300s per-page cap once). Confirmed: warm-cache builds run about
  14 min (cold was 24 min), so Vercel's cache helps but builds are still slow.
  If this stays a velocity problem, raise with founder: candidate fixes are on-demand
  ISR for the data-heavy routes, or a Supabase compute bump for build bursts.
  Not changing prerender strategy or infra autonomously.
- **Preview deployments are behind Vercel SSO** (HTTP 401 to anonymous). The
  founder can view preview URLs on logged-in devices; automated screenshots
  cannot. Verification here is gate-based (tsc + 25 gates + the score test) plus
  code review. To enable visual self-checks, founder could add a Protection
  Bypass token or relax preview protection (their call; a security setting).

## Fan-out status
Each page uses the proven pattern: a pure `src/lib/scores/*_verdict.ts` synthesis
module (no queries, invents nothing, self-omits on null) feeding a warm server
component (SectionEyebrow + serif lead + semantic `dl`, tokens only). Every page
is reviewed and re-gated (tsc + 25 gates) before push. One page in flight at a
time so builds and the working tree stay clean.

- [x] Flagship cell page `/[country]/[geo]/[industry]` (Ready). VerdictHero + ScorePanel + scores/{index,verdict}.ts.
- [x] Country page `/[country]` (Ready). CountryViabilityLede + country_verdict.ts.
- [x] Industry page `/industries/[industry]` (building). IndustryModelLede + industry_verdict.ts.
- [ ] City/geo page `/[country]/[geo]` (drafting).
- [ ] Home `/`, Compare `/compare`, Calculator `/calculator`, Sectors `/sectors`.

How to continue the fan-out: dispatch a general-purpose agent per page with the
same brief shape used for country/industry (read bible Section 5 + GUIDELINES +
the live page + the reformed siblings; build the verdict-module + warm-component
pattern; preserve SEO/ids/order; gate tsc + prebuild:serial; do not push). Then
review the two new files, re-gate, commit, push. Build times warmed down from
24 min (cold) to 9 min as Vercel's cache filled.

## Preview URLs (Vercel, founder-viewable when logged in)
- Warm design system (Ready): marginatlas-web-twtl-8brab97ma-benets-projects-3110e8e1.vercel.app
- Flagship cell page (Ready): marginatlas-web-twtl-d32qh7pdo-benets-projects-3110e8e1.vercel.app
