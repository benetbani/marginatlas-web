# Session Handoff — 2026-05-27

**Working tree state at handoff:** `main` at `5b96ec0`. All 12 commits
from today pushed. Working tree clean except for auto-regenerated
audit / quality JSON files (`data/audit/*.json`, `data/quality/*.json`,
`tsconfig.tsbuildinfo`) which the prebuild gates rewrite on every run.
Ignore those.

**Session arc (one paragraph):** Started by addressing a transplanted
"senior engineer audit" prompt that turned into a real architecture
audit. Shipped the four lowest-risk refactors first (feature flags,
FX module, types index, layering gate), then four more (architecture
README, parallel prebuild runner, comment-noise sweep, partial
decomposition of the 1,321-line `cells.ts`). Mid-session the user
reported the site was returning 500 on every route — diagnosed it as
a Next.js App Router param-name collision between `[country]/[city]`
and `[country]/[geo]`, merged the routes, brought the site back.
Performance pass after that (middleware memory bound, slow-query
trim, wider edge-cache coverage). Then a scaling artifact: a
Supabase index migration the user needs to apply manually. Then a
security pass: locked `/admin/data-quality`, added rate limits to
write endpoints, added security headers. Then the big one — a
design-system effort with 8 phases. Shipped 6 of 8: tokens, state
primitives, core primitives (Money/Percent/Number/Pill/InlineLink/
Disclosure), motion vocabulary, `/_design` catalog page,
`GUIDELINES.md`. Deferred Phase 6 (axe-core a11y gate) and Phase 7
(8-10 hot-component migrations) for a fresh session.

---

## 1. What shipped today (12 commits, chronological)

| # | Commit | Title | Files |
|---|---|---|---|
| 1 | `9323c9f` | Architecture audit + 4 targeted refactors | Audit doc + feature_flags.ts + finance/fx.ts + types/index.ts + verify_layering.ts |
| 2 | `d9163e2` | Strategies D + E + H: docs, parallel prebuild, comment cleanup | docs/architecture/README.md + scripts/prebuild_all.ts + scripts/strip_plan_comments.ts + 117 file comment sweep |
| 3 | `9649007` | Strategy F (partial) + wire parallel prebuild | cells/geo.ts + cells/time_series.ts + cells.ts trim (1321→1146) + package.json prebuild wired to parallel runner |
| 4 | `cad3fce` | Fix site-wide 500: collapse `[city]` route tree into `[geo]` | NeighborhoodOverview.tsx + new `[sub]` segment + deleted `[country]/[city]/` tree + layering allowlist update |
| 5 | `f5c7a28` | Perf pass: cap middleware memory, trim slow query, widen edge cache | middleware.ts BUCKET sweep + cells.ts `getSameIndustryAcrossStates` (800→200 rows) + CACHEABLE_PATTERNS extended |
| 6 | `0252d3f` | Stage Supabase perf indexes + scale checklist | **db/migrations/2026-05-27-perf-indexes.sql** (PENDING APPLICATION) + architecture/README.md scale checklist |
| 7 | `64cc79e` | Security pass: lock admin, harden API routes, add security headers | `/admin/data-quality` auth gate + src/lib/rate_limit.ts + per-route rate limits on /api/correction, /api/newsletter, /api/export-csv + next.config.ts security headers + email regex tightening + timingSafeEqualString helper |
| 8 | `53f83fa` | Design system Phase 0: inventory + token extraction | docs/design-system/{PLAN, INVENTORY, TOKENS}.md |
| 9 | `ebac15e` | Design system Phase 1: typed token module | src/lib/design-tokens.ts + tailwind.config.ts refactored to import from it |
| 10 | `489ab89` | Design system Phase 2: state primitives | ui/{skeleton, empty-state, error-state, spinner}.tsx + 5 legacy files refactored to delegate |
| 11 | `8c50e0d` | Design system Phase 3: core primitive expansion | ui/{money, percent, number, pill, inline-link, disclosure}.tsx |
| 12 | `2e02ede` | Design system Phase 4: motion vocabulary | src/lib/motion.ts + ui/motion/{FadeIn, SlideUp, Stagger}.tsx + 2 new keyframes in tailwind.config.ts |
| 13 | `70376b6` | Design system Phase 5: internal `/_design` catalog route | src/app/_design/page.tsx + prebuild_all.ts default concurrency 6→4 |
| 14 | `5b96ec0` | Design system Phase 8: GUIDELINES.md | docs/design-system/GUIDELINES.md |

That's 14 commits, not 12 — recount earlier was off. The full diff
spans ~30+ new files and material changes to ~120 existing files
(mostly the H comment sweep, which was 240 PM-tag prefixes stripped).

---

## 2. What's pending, ranked

### P0 — manual action, no Claude needed

**Apply the Supabase performance indexes.** File:
`db/migrations/2026-05-27-perf-indexes.sql`. Six `CREATE INDEX
CONCURRENTLY IF NOT EXISTS` statements + three `ANALYZE` calls.
**Paste each statement into the Supabase SQL Editor one at a time.**
`CONCURRENTLY` does not work inside a transaction so don't wrap them.

Expected impact (documented in the file header):
- `getNudgeNeighbor`: 4s+ timeout → ~30ms
- `getSameIndustryAcrossStates`: 4s+ timeout → ~50ms
- `getCellBySlugRaw` US path: ~500ms → ~5ms
- `getCellVariants` US: ~800ms → ~10ms
- `getRegionalCell` non-US: ~300ms → ~8ms
- `getTopIndustriesForCountry` US: ~1.5s → ~80ms

Build-log evidence: ~20 `getNudgeNeighbor` timeouts and ~9
`getSameIndustryAcrossStates` timeouts per build of 615 pages today.
Those disappear after the indexes ship.

Each `CREATE INDEX CONCURRENTLY` on the 722k-row `cells_master` takes
30-90 seconds on Supabase Pro. Non-blocking.

### P1 — Design system Phase 6: accessibility gate (~2-3 hours)

**Goal:** add `@axe-core/react` plus a prebuild gate that fails the
build on any WCAG AA violation in the `/_design` catalog page.

**Plan:**
1. `npm install --save-dev @axe-core/react jsdom` (or use Playwright
   if available)
2. Write `scripts/verify_a11y.ts` that:
   - Boots a Next.js dev server on a free port, OR static-renders the
     catalog page via the standalone `next export` output
   - Runs axe-core against the rendered HTML
   - Filters for AA-impact violations only
   - Exits 1 on any violation, 0 on clean
3. Add the gate to `scripts/prebuild_all.ts` GATES array
4. Write `docs/design-system/A11Y.md` documenting the floor (4.5:1
   body / 3:1 large, 2px+ focus rings, aria-labels on icon-only
   buttons, keyboard nav everywhere, motion-reduce respect)

**Risk:** running axe in CI is non-trivial because it needs a DOM.
The simplest path is: render the catalog with `react-dom/server` to
a string, then parse with jsdom, then axe against the jsdom window.
That avoids spawning a real browser.

### P1 — Design system Phase 7: migrate 8-10 hot components (~4-6 hours)

**Goal:** convert the highest-traffic existing components to use the
new primitives so the design system stops being theoretical.

**Priority order (the plan says these, in order):**
1. `KeyBenchmarkBanner` (cell-page hero)
2. `DenseCellHero`
3. `RevenueDistribution`
4. `SmartWaterfall`
5. `NavigatorForm` (homepage CTA)
6. `HomepageHero`
7. `CellWarningChips`
8. `CoverageIndicator`
9-10. TBD

**Each migration is its own commit.** The pattern: replace inline
hex / pixel / motion values with token references and replace ad-hoc
chips / states with the new `<Pill>` / `<Skeleton>` / `<EmptyState>`
primitives. **The public API of each component does not change.**
Internal call sites continue to work.

Also resolve the **v1/v2 schism**: `src/components/v2/FeaturedCardV2.tsx`
and `src/components/v2/SectorCardV2.tsx` exist. Find the v1 versions,
decide which wins, delete the loser.

**Risk:** these are the most-visited surfaces on the site. Any visual
drift is immediately user-visible. Run the catalog page side-by-side
with production for each migration. Use Playwright or a manual visual
review before pushing.

### P2 — Strategy F follow-on: finish the cells.ts decomposition (~3-4 hours)

`cells.ts` is at 1,146 lines (was 1,321). Still big. The remaining
decomposition: `cells/lookup.ts` (the core `getCellBySlug*` chain),
`cells/synthesis.ts`, `cells/variants.ts`. The blocker named in the
audit doc is that these functions share a dense web of private
helpers (`applyRollforward`, `applyTaxonomy`, `normalizeRow`,
`normalizeRegionalRow`) that need an `_internal.ts` module first.

This is medium-risk because `cells.ts` is the data-access spine of
the site. Stop at any phase boundary if anything feels off. The
existing `cells.ts` stays as a thin re-export so external imports
never break.

### P2 — Architecture: resolve grandfathered layering violations (~2 hours)

`scripts/verify_layering.ts` has 14 grandfathered entries in its
allowlist (presentation files that import `data/*.json` directly,
bypassing the domain layer). Each entry should be migrated to fetch
its data through a `src/lib/*` accessor instead. The allowlist
shrinks as each is fixed. Low-risk per file but tedious.

### P3 — Documentation polish

- Update `docs/architecture/README.md` Known Debt section to reflect
  what the design-system effort changed (the file map has new entries
  under `src/components/ui/` and `src/lib/design-tokens.ts`)
- Cross-link `GUIDELINES.md` from `CONTRIBUTING.md` if the project
  ever creates one

---

## 3. The file map — where everything lives

### Design system (new this session)

| Concern | File |
|---|---|
| Master plan | `docs/design-system/PLAN.md` |
| What existed before the effort | `docs/design-system/INVENTORY.md` |
| Token reference | `docs/design-system/TOKENS.md` |
| Authority document (rules + anti-patterns) | `docs/design-system/GUIDELINES.md` |
| Typed tokens | `src/lib/design-tokens.ts` |
| Motion helpers | `src/lib/motion.ts` |
| Tailwind config (imports tokens) | `tailwind.config.ts` |
| System primitives | `src/components/ui/*` |
| Motion primitives | `src/components/ui/motion/*` |
| Catalog page (gated) | `src/app/_design/page.tsx` |

### Architecture (new this session)

| Concern | File |
|---|---|
| Newcomer orientation | `docs/architecture/README.md` |
| Full audit + roadmap | `docs/strategy/2026-05-27-architecture-audit.md` |
| Feature flag accessors | `src/lib/feature_flags.ts` |
| FX rate registry | `src/lib/finance/fx.ts` |
| Domain type re-export | `src/lib/types/index.ts` |
| Layering enforcement | `scripts/verify_layering.ts` |
| Parallel prebuild runner | `scripts/prebuild_all.ts` |
| Comment-noise codemod | `scripts/strip_plan_comments.ts` |
| Geo helpers (split from cells.ts) | `src/lib/cells/geo.ts` |
| Time-series helpers (split from cells.ts) | `src/lib/cells/time_series.ts` |

### Security + perf (new this session)

| Concern | File |
|---|---|
| Per-route rate limit + timing-safe compare | `src/lib/rate_limit.ts` |
| Supabase indexes (PENDING APPLICATION) | `db/migrations/2026-05-27-perf-indexes.sql` |
| Bounded middleware rate-limit map | `src/middleware.ts` |
| Security headers + HSTS + frame-ancestors | `next.config.ts` |
| Admin auth pattern (use as reference) | `src/app/admin/data-quality/page.tsx` |

### Routes (changed this session)

| Concern | File |
|---|---|
| Cell page (gained early neighborhood-overview dispatch) | `src/app/[country]/[geo]/[industry]/page.tsx` |
| Neighborhood cell page (renamed from `[city]/[neighborhood]/[industry]`) | `src/app/[country]/[geo]/[industry]/[sub]/page.tsx` |
| Neighborhood overview component (extracted) | `src/components/NeighborhoodOverview.tsx` |
| `[city]/` tree | **DELETED** |

---

## 4. Manual actions you need to take

1. **Apply Supabase indexes** — paste each statement from
   `db/migrations/2026-05-27-perf-indexes.sql` into the Supabase SQL
   Editor. Each one takes 30-90s, runs non-blocking. Do it once.
   Until you do, the site has the slow-query timeouts documented
   above; the codebase is otherwise production-fine.

2. **Verify the design-system catalog renders correctly on prod.**
   After Vercel redeploys, visit
   `https://www.marginatlas.com/_design?key=<ADMIN_KEY>`. Expected:
   the catalog page renders every primitive in every state. Without
   the key: 404.

3. **No env var changes required.** `ADMIN_KEY` was already set
   (used by the existing `/admin/review` and `/admin/anomalies`
   routes); the new `/_design` and `/admin/data-quality` routes use
   the same env var.

---

## 5. Conventions the new session MUST follow

These are not preferences. They are enforced by prebuild gates or by
user constraints stated explicitly in earlier conversations.

### Must-do

- **No em-dashes in user-visible source.** Use period, comma, or
  colon. JSDoc + inline-code comments are exempt. The
  `verify_no_em_dashes` gate enforces; running afoul of it fails the
  build. If a primitive needs a real em-dash for a specific case,
  append `// allow-em-dash` to the line.
- **No source-agency names in user-facing UI** (Eurostat, BLS, ATO,
  etc.). `verify_no_source_agencies` enforces.
- **Tokens, not arbitrary values.** Use `src/lib/design-tokens.ts`
  for any color, font size, spacing, radius, shadow, motion timing,
  or z-index. See `docs/design-system/GUIDELINES.md` §3.
- **`forwardRef` + `displayName` + `cva`** on every new `src/components/ui/*`
  primitive. See `Button` as the reference.
- **`useless-tile-ok` comment** if a tile-pattern catalog sample
  legitimately needs it. The `find_useless_tiles` gate flags
  count-of-things UI; suppress with `/* useless-tile-ok: <reason> */`
  on the line immediately preceding the offending JSX.
- **WCAG AA accessibility floor**: 4.5:1 contrast, 2px+ focus rings,
  aria-labels on icon-only buttons, semantic heading hierarchy,
  motion-reduce variants on animations. See GUIDELINES.md §4.2.

### Must-not-do

- **Never rename a URL slug.** Months of SEO equity ride on existing
  URLs. Add new URLs alongside; never rename.
- **Never use `--no-verify` to skip pre-commit hooks**, never use
  `--no-gpg-sign`, never force-push to main.
- **Never commit `.env.local`** or any file with real secrets.
  `.gitignore` covers `.env*` already; honor it.
- **Never put domain logic in a component.** Domain logic lives in
  `src/lib/`. Components consume the lib layer.
- **Never use the parallel `prebuild_all.ts` at concurrency >4 on
  Windows.** The default is 4 because 6 segfaulted intermittently
  (Windows access violation 0xC0000005). Pass `--concurrency=3` if
  the machine is loaded.

### Should-prefer

- **`npm run prebuild`** before any commit that touches `src/` or
  `data/`. Wall-clock ~28-30s for 25 gates. If the parallel runner
  is flaky on the current machine, `npm run prebuild:serial` (same
  gates, ~60s, single-process).
- **Run `npx tsc --noEmit`** before any commit. ~30-60s. Catches
  typings before the build does.
- **Atomic commits**: one phase / one concern per commit. Each
  commit should leave the codebase in a clean buildable state.

---

## 6. Known gotchas

| Gotcha | What you'll see | Why it happens | How to handle |
|---|---|---|---|
| Parallel prebuild segfaults at concurrency=6 on Windows | `exit 134` or `exit 3221226505` on random gates | Windows resource pressure with too many simultaneous tsx processes | Default is now 4. If still flaky, use `prebuild:serial`. |
| `tsconfig.tsbuildinfo` and `data/audit/*.json` show as dirty | git status lists them as modified | Prebuild gates regenerate these files every run | Ignore. Never commit them. Not in `.gitignore` because they DO need to ship in some contexts. |
| `getNudgeNeighbor` / `getSameIndustryAcrossStates` timeouts in build log | `[cells] X exceeded 4000ms budget, falling back` | Unindexed Supabase queries | **Will disappear once you apply the migration.** Functional, just slow. |
| `npm run prebuild` shows DEP0190 deprecation warning | `DeprecationWarning: Passing args to a child process with shell option true...` | Required for `npx.cmd` on Windows; Node 22+ refuses to spawn .cmd without `shell: true` | Documented in `scripts/prebuild_all.ts`. Ignore. |
| `/admin/*` and `/_design` 404 without the right `?key=` | Empty 404 page | By design: `notFound()` not `401` so the URL doesn't advertise its existence | Pass `?key=<ADMIN_KEY>` |
| 32+ files import from `@/lib/cells` directly | Lots of imports across `src/app/` and `src/components/` | `cells.ts` is the data-access spine; the decomposition keeps it as a thin re-export so these don't break | Don't try to "clean up" the imports unless you're doing the F decomposition |
| `v2/FeaturedCardV2` and `v2/SectorCardV2` exist with no obvious v1 | Stalled refactor from earlier work | Resolved differently for each: check git log on the file to find the v1 | Pick the winner per Phase 7 of the design-system plan |
| Layering allowlist has 14 entries | `scripts/verify_layering.ts` ALLOWLIST set | Pre-design-system files that import `data/*.json` directly | Migrate one at a time when the file is touched for other reasons. Don't add new entries. |
| Design-system catalog at `/_design` is admin-gated and `noindex` | Won't appear in sitemaps or search | By design — it's internal | Bookmark the URL with your `?key=` for fast access |

---

## 7. The starter prompt for the new conversation

Paste this verbatim into the first message of the new conversation.
It self-bootstraps the new Claude with everything needed.

```
I'm continuing work on marginatlas.com — a Next.js 15 + React 19
+ Supabase Pro small-business benchmarking site. Repo lives at
E:\atlas\website. Earlier today I had a long session with another
Claude that shipped 14 commits across architecture, perf,
security, route fix, and 6/8 phases of a design-system effort.

Before doing anything else, read these three files in order. They
are the contract for this session:

1. docs/handoff/2026-05-27-session-handoff.md
   The session-state snapshot. Tells you what shipped, what's
   pending with priority, the file map, manual actions I owe,
   conventions to follow, and known gotchas.

2. docs/design-system/PLAN.md
   The 8-phase design-system plan. 6 phases shipped, 2 deferred
   (Phase 6 axe-core a11y gate, Phase 7 migrate 8-10 hot
   components).

3. docs/design-system/GUIDELINES.md
   The authority document for any UI work. Decision tree for
   new components, token-vs-arbitrary-value rules, props API
   conventions, the accessibility floor, anti-patterns we don't
   ship, the pre-merge checklist.

Quick orientation if those don't load fast enough:
- 25 prebuild gates protect data invariants; `npm run prebuild`
  is the canonical pre-commit check. Wall-clock ~28-30s.
- No em-dashes in user-visible source. Period, comma, colon
  instead. Gate enforces.
- No source-agency names in user-facing copy. Gate enforces.
- Single source of truth for tokens: `src/lib/design-tokens.ts`.
  Tailwind imports from it. No raw hex codes in components.
- Vercel pinned to `fra1`, Supabase Pro in `eu-west-1`.
- Catalog: `/_design?key=<ADMIN_KEY>` shows every primitive
  shipped under the design system in every state.

My priority for this session is [INSERT HERE — pick from the
"What's pending, ranked" section of the handoff doc, or describe
something new]. If unclear, ask one clarifying question. If clear,
start with a quick recon (read the relevant code, check git log
for context) and then propose a tight plan before touching code.

The previous session emphasized: careful upgrade not breaking the
current structure; focus on backend and data filling; the focus
is NOT on salaries; mobile is the highest-priority failure point.
```

---

## 8. End-of-session sanity check

- [x] All 14 commits pushed to `main`
- [x] `main` at `5b96ec0`
- [x] Working tree clean (modulo auto-regenerated audit files)
- [x] Most recent prebuild passed: 25/25 gates at concurrency=3
- [x] Most recent build succeeded: 615 static pages prerendered
- [x] `/_design` route gates correctly: 200 with `?key=`, 404 without
- [x] Site responds 200 on representative routes (homepage, cell
      page, country page, city page, neighborhood overview,
      neighborhood cell page, /api/go redirect)
- [ ] Supabase indexes applied (PENDING — manual action above)
- [ ] Design-system Phase 6 (a11y gate) shipped (DEFERRED)
- [ ] Design-system Phase 7 (component migrations) shipped (DEFERRED)
