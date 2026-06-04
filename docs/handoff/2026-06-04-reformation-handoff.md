# Reformation Handoff (2026-06-04)

Read this top to bottom before doing anything. It is the synthesis of a very
long working session that took Margin Atlas through a full visual + editorial
reformation, now LIVE in production. Nothing here is optional context.

---

## 0. One-paragraph state

The Margin Atlas reformation is DONE and LIVE on marginatlas.com. 17 pages were
rebuilt to a warm, decision-first, opinionated design plus a new design-token
system. It is merged to `main` (merge commit `30d55754`) and deployed to
production on Vercel. Rollback is one command: `git revert -m 1 30d55754` + push.
Stack: Next.js 15.5, React 19, TypeScript 5, Tailwind 3.4, Supabase (Postgres,
eu-west-1), Vercel (project `marginatlas-web-twtl`, team `benets-projects-3110e8e1`).
Project root: `E:\atlas\website`.

---

## 1. The vision (what Margin Atlas IS now)

Not "Numbeo for margins" or "Statista for small business." The category is
**Local Profit Intelligence**: the product answers one painful question, "can a
specific business actually make money in a specific place, after rent, wages,
taxes, competition, and local friction?" Free decision-first portal now; paid
viability reports + a Pro SaaS workspace later. The editorial voice is blunt,
practical, skeptical of easy money, and never calls a market good without naming
what can kill it. The full thesis lives in the bible (next section).

---

## 2. The canon (READ THESE FIRST, in order)

1. `CLAUDE.md` (root) — navigation index for the repo.
2. **`docs/strategy/REFORMATION-BIBLE.md`** — THE SPEC. The founder's ~1600-line
   reformation plan: positioning, the 0-to-100 proprietary scores (Section 10),
   the Founder Opportunity blend (Section 21), the 29-module entity blueprint
   (Section 6), the content voice (Section 25), data confidence model (Section 9),
   trust/methodology (Section 19), MVP scope (Section 17), data model (Section 18).
   Every reformed page traces back to a section of this. When in doubt, the bible
   wins.
3. `docs/strategy/LONGTERM-STRATEGY.md` — deep-research answer on monetization,
   free-vs-paid, AI-era SEO, moat, infrastructure-at-scale, and failure modes.
   This is the roadmap AFTER the visual reform: the $79 report, Pro tiers, and
   the build-cost fix.
4. `docs/strategy/REFORMATION-PROGRESS.md` — the live build log: what shipped per
   wave, the reusable pattern, build-time notes.
5. `docs/design-system/GUIDELINES.md` — UI authority (tokens, primitives, a11y,
   anti-patterns, the layering rules).
6. This file.

---

## 3. The design system (Warm Atlas)

Founder direction: warm, cozy, lifestyle feeling with terracotta, while still
delivering serious data value. NOT cold SaaS navy.

- **`src/lib/design-tokens.ts`** — single source of truth. The colour families
  were re-toned (NOT renamed): `atlas` = terracotta / burnt sienna (accent);
  `cream` = warm sand and warm-white surfaces; `ink` = warm brown-black text;
  `cocoa` = re-warmed browns; `teal` = muted sage (the one cool accent);
  `parchment` = warm taupe border; `clay` = held as a true red for danger.
  Token NAMES are unchanged, so all 136 components inherited the warmth with zero
  churn. Tailwind config imports from here.
- Mirrored in `src/app/globals.css` (the shadcn CSS variables + the
  `--atlas-surface-*` paper/card system), `src/styles/homepage-visual-tokens.css`,
  and `src/styles/atlas-pattern.css`. If you change a colour, change it in all of
  these in lockstep.

### The proven page pattern (reuse it for every page)
A pure synthesis module feeds a warm server component:
- **Synthesis module**: `src/lib/scores/*_verdict.ts` (or `*_economics.ts`,
  `*_atlas.ts`, `*_directory.ts`, `*_decision.ts`). Pure, no Supabase, no other
  domain modules at runtime (Cell is a type-only import), invents NO numbers,
  self-omits every clause when its input is null. Trivially testable; cannot trip
  the layering gate.
- **Warm component**: a server component using `SectionEyebrow` + serif lead +
  semantic `<dl>` / cards, tokens only, that renders the synthesis output and
  drops silently when there is nothing to show.

### The scores engine
- **`src/lib/scores/index.ts`** — `computeScores(cell, ctx)` returns the 0-to-100
  banded scores: Profitability, Rent headroom, Market room, Owner take-home, and
  a blended Opportunity. Higher always = better; bands 80+/60-79/40-59/20-39/<20;
  no decimals; a score is returned ONLY when defensible from data on hand (hide
  weakness). It reads the page's authoritative net margin / take-home via the ctx,
  so the whole page agrees on one set of numbers.
- **`src/lib/scores/verdict.ts`** — the cell hero verdict (names an upside and the
  thing that can break it).
- **`tests/scores/scores.test.ts`** — banding, omission, determinism. Run:
  `npx tsx tests/scores/scores.test.ts`.

---

## 4. The reformed pages and the role of each file

| Page | Route | Page file | New components / modules |
| --- | --- | --- | --- |
| Cell (flagship) | `/[country]/[geo]/[industry]` | `src/app/[country]/[geo]/[industry]/page.tsx` | `src/components/cell/VerdictHero.tsx`, `src/components/cell/ScorePanel.tsx`, `src/lib/scores/{index,verdict}.ts` |
| Country | `/[country]` | `src/app/[country]/page.tsx` | `src/components/countries/CountryViabilityLede.tsx`, `src/components/countries/CountryTaxReality.tsx`, `src/lib/scores/country_verdict.ts` |
| Industry | `/industries/[industry]` | `src/app/industries/[industry]/page.tsx` | `src/components/industries/IndustryModelLede.tsx`, `src/lib/scores/industry_verdict.ts` |
| City / geo | `/[country]/[geo]` | `src/app/[country]/[geo]/page.tsx` | `src/components/geo/GeoViabilityLede.tsx`, `src/lib/scores/geo_verdict.ts` |
| Home | `/` | `src/app/page.tsx` | `src/components/home/WhatAtlasWeighs.tsx` |
| Compare | `/compare` | `src/app/compare/page.tsx`, `src/app/compare/CompareClient.tsx` | `src/lib/scores/compare_verdict.ts` |
| Calculator | `/calculator` | `src/app/calculator/page.tsx` | `src/components/CalculatorForm.tsx` (rewritten), uses `src/lib/economics/breakeven.ts` |
| Sectors | `/sectors` | `src/app/sectors/page.tsx` | `src/lib/scores/sector_economics.ts` |
| Methodology | `/methodology` | `src/app/methodology/page.tsx` | (in-file; trust front door, `/about-data` is the annex) |
| World | `/world` | `src/app/world/page.tsx` | `src/lib/scores/world_atlas.ts` |
| Cities | `/cities` | `src/app/cities/page.tsx` | `src/lib/scores/city_directory.ts` |
| Learn | `/learn` | `src/app/learn/page.tsx` | (in-file) |
| Blog | `/blog` | `src/app/blog/page.tsx` | (in-file helpers) |
| Decide | `/decide` | `src/app/decide/page.tsx` | `src/components/decide/FounderDecisionLede.tsx`, `src/lib/scores/founder_decision.ts` |

The cell, country, and industry keystones also got a "deepen" pass (tightened
density, sharpened the decision-first order, promoted break-even, added a
"what kills weak operators" / tax-reality module).

Data layer (unchanged by the reform, preserve it): `src/lib/cells.ts`
(`getCellBySlug`, `getCellVariants`, `getComparableCells`, `getTopIndustriesForCountry`,
`withBudget`...), `src/lib/cells/fill_defaults.ts` (`resolveEconomics`,
`synthesizeCell`, `enforceSanity`), `src/lib/cells/extrapolated_aggregation.ts`
(the firm-share-weighted all-sizes blend). Country-specific economics live in
`src/lib/finance/country_industry_economics.json` and `industry_margins.json`.

---

## 5. Hard constraints (enforced by the prebuild gates)

- NO em-dashes in user-visible copy (period/comma/colon; em-dash allowed only in
  code comments). The founder dislikes em-dashes everywhere, chat included.
- NO source-agency names in user copy (no Eurostat/BLS/ONS/Census/ATO/etc.;
  describe source TYPES like "national business statistics").
- NO raw hex/px/ms in components; use design tokens (Tailwind classes like
  `text-atlas-700`, `bg-cream-50/100`, `border-parchment`, `text-ink-900`,
  `text-graphite`, `text-cocoa-500`, `text-moss-700`, `text-clay-700`).
- Headings use canonical typography tokens, or `data-typography="custom"` /
  `SectionEyebrow` for small uppercase eyebrow labels.
- HIDE WEAKNESS: omit a thin module (`return null`); never a "low confidence" or
  "thin data" badge, never an apologetic placeholder, never a fabricated number or
  ranking. This is the founder's explicit rule and the trust thesis.
- FREE only this round: no paywalls, auth, or Stripe.
- Mobile-first, WCAG AA, real `h1/h2/h3` tags, no slug renames, preserve SEO
  (generateMetadata, JSON-LD, canonical) and ISR `revalidate`.

---

## 6. The build/review workflow (reuse exactly)

To reform or deepen a page:
1. Dispatch a general-purpose subagent with a tight brief: read the relevant
   bible section + GUIDELINES + the live page + the reformed siblings; build the
   verdict-module + warm-component pattern; PRESERVE generateMetadata / JSON-LD /
   URL / ids / order / revalidate / functionality; gate `npx tsc --noEmit` and
   `npm run prebuild:serial`; DO NOT commit or push; report files + structure +
   the green gate lines + data gaps.
2. Review the 2 new files yourself, re-gate the WHOLE tree (the subagents share
   the working tree, so re-gate before pushing), commit, push.
3. Batch the builds: commit several pages locally, push once = one Vercel build.

Subagents have consistently shown good judgment (refusing to fabricate scores
where data is thin, removing paywalls for free-only, honoring anti-fake-precision).
Trust but re-gate.

---

## 7. Verification, builds, and visual QA

- `npx tsc --noEmit` must be 0. `npm run prebuild:serial` must end `GATE: PASS`
  exit 0 (it does NOT run tsc; run both). 25 gates, ~60s.
- Do NOT run local `npm run build` (the 8GB box OOMs on data-heavy routes). All
  real builds happen on Vercel. Builds warmed to ~2 min (cache); cold was 14-24 min.
- **Visual QA via the bypass token** (the unlock): preview deployments sit behind
  Vercel SSO. The founder generated a **Protection Bypass for Automation** secret
  (Vercel project Settings -> Deployment Protection). Ask the founder to paste it
  each session; do NOT commit it. Then screenshot with
  `scripts/shot_preview.mjs <baseUrl> <route> [--mobile]`, run with
  `BYPASS=<secret>` and `MSYS_NO_PATHCONV=1` (git-bash mangles a leading-slash
  route into a path otherwise). Production (marginatlas.com) is public; no token
  needed (use a browser UA; the middleware 451/403s bot UAs).
- To find deployments / URLs / status: `vercel ls marginatlas-web-twtl`.

---

## 8. Git and deploy state

- Production = `main` at merge commit `30d55754` ("Merge reform..."), deployed to
  marginatlas.com.
- The reform branch `reform/warm-atlas-flagship` still exists (full history).
- Local HEAD is on `main` after the merge.
- Rollback the entire reform: `git revert -m 1 30d55754` && `git push origin main`.
- Commit message footer convention (from the session): `Co-Authored-By: Claude ...`.

---

## 9. Known gotchas (do not relearn these the hard way)

- Local dev server OOMs on cell/country (data-heavy) routes. Use Vercel previews,
  never local rendering, for those pages.
- `MSYS_NO_PATHCONV=1` is required for the screenshot script's route arg.
- Parallel subagents share one working tree, so each one's prebuild can report
  transient "drift" in files ANOTHER agent is mid-editing. Ignore those; re-gate
  the whole tree yourself before pushing.
- Loose pre-existing working-tree changes exist and predate the reform:
  `data/audit/*`, `package.json`, `scripts/prebuild_all.ts`, `tsconfig.tsbuildinfo`,
  an untracked `tests/cells/extrapolated_all_sizes_blend.test.ts`, and
  `src/app/dev/pricing/`. They were never committed and are NOT in any Vercel
  build (Vercel builds committed commits). Leave them or clean them separately;
  do not assume they are part of the reform.
- The `src/app/dev/*` pages are throwaway pre-reform mockups. They were patched
  only to pass gates. Consider deleting them.
- Memory rule: do NOT run `npm run build` / heavy builds without the founder's
  permission.

---

## 10. Founder profile

Wants hands-off, fast, "push harder." Approves via previews, not micro-decisions.
Not a designer; relies on the locked system + the agent fan-out. Chose
warm/cozy/terracotta over cold SaaS navy (a research model pushed navy + a
Relume/v0 tooling switch; the founder and the assistant decided NOT to switch
tooling because the warm system + agent fan-out already solve the "I can't
assemble" problem). Sometimes triggers `/caveman` (terse replies). Strongly
dislikes em-dashes.

---

## 11. Open items / next frontiers (priority order)

1. **Monetization (LONGTERM-STRATEGY Section 1-2):** ship the **$79 Industry +
   Place Viability Report** first (fastest revenue; a report is a SaaS prototype
   in a PDF). Then a Pro subscription. v0 by Vercel is fine for the greenfield
   paid-report / pricing / marketing pages (NOT the data pages).
2. **Build-cost fix (LONGTERM-STRATEGY Section 5):** today ALL ~606 pages
   prerender against the DB on a cold build (slow, fragile). Move to: pre-render
   only top pages, ISR the long tail, separate page rendering from data refresh,
   and store materialized per-page JSON payloads. This is the durable scaling fix.
3. **Remaining un-reformed long-tail pages (lower priority):** coverage,
   countries index, city detail (`/cities/[slug]`), check, browse, about-data,
   sub-cell, `/decide/[activity]/[city]`, `/compare/cities/[pair]`. Same pattern.
4. **Design problems to watch:** the cell page is data-rich and long even after
   the deepen (acceptable for a flagship, but watch density); verify the keystones
   on 390px mobile via screenshots (the token makes this easy now); the home
   desktop screenshot occasionally needs a retry due to a Playwright profile lock.

---

## 12. Start the new session

Read the canon in Section 2, then this file. Ask the founder for the Vercel bypass
token to enable visual QA. The reform is live; the next real work is monetization
and the build-cost fix, both detailed in LONGTERM-STRATEGY.
