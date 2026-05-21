# 15 · Session 5 Update — Plan v15 + R-003 hotfix

> **Captured at end of session 5 (2026-05-21).** This file is the
> authoritative delta over chapters 00–14. When chapters 00–14 contradict
> this file, this file wins until they are reconciled.
>
> Read this file LAST in the handoff sequence — after 00 through 14.

---

## 0 · TL;DR for a new session

- Site is **live at `https://www.marginatlas.com`**. DNS blocker B-001 is resolved.
- 13 commits shipped this session. HEAD = **`c4d99b4`**.
- All eight blocks of Plan v15 (founder's site-coherence pass) shipped + one R-003 catastrophic hotfix.
- Working tree clean except for auto-generated noise (`next-env.d.ts`, `tsconfig.tsbuildinfo`, `data/images/cities_manifest.json`) and untracked data files / plan docs left for the founder to decide on.
- No background agents running. Two obsolete debug scripts removed (`scripts/probe_urls.sh`, `scripts/repro_500.ts`).

---

## 1 · Live state — what actually changed since chapter 04

| Field | Was (session 4) | Now (session 5) |
|---|---|---|
| `marginatlas.com` | ❌ Cloudflare 522 | ✅ 200 (resolves to Vercel) |
| `www.marginatlas.com` | ❌ Cloudflare 522 | ✅ 200 (canonical host; apex 308→www) |
| Vercel project | `marginatlas-web` | **`marginatlas-web-twtl`** (the duplicate `marginatlas-web` was deleted by the founder mid-session; the `-twtl` project owns the domain) |
| Sentry | Active via `withSentryConfig` wrapper | **Wrapper DISABLED** in `next.config.js` (RangeError on every SSR — see D-100 below) |
| Plausible | Wired | **Replaced by Microsoft Clarity** (free; script id `wtu315an8b` in `src/app/layout.tsx`) |
| Ask Atlas | Preview-stub only | **Live** (routes through Vercel AI Gateway when `ANTHROPIC_AI_GATEWAY_KEY` set, falls back to direct Anthropic) |
| Editorial tone | Undecided | **Locked** per `docs/specs/2026-05-19-site-editorial-style-guide.md` (826 lines, 195 country + 207 city anchors) |
| Per-cell narratives | None | **2,259 cached editorial paragraphs** at `data/content/cell_narratives_v1.json` (Haiku-generated bulk, Sonnet quality pass on top 200) |

The Vercel deployment is healthy, the production URL responds, and Cloudflare is no longer in the path.

---

## 2 · Decisions added this session

Following the `D-NNN` convention from chapter 03, these are appended.

### D-100 · Sentry webpack wrapper disabled
- **What:** `module.exports = withSentryConfig(...)` in `next.config.js` is commented out; the file exports the bare `nextConfig`.
- **Why:** `@sentry/nextjs` 11.x + Next 15.5.18 combination throws `RangeError: Maximum call stack size exceeded` at `Set.add` on every SSR request. The bundled instrumentation overflows the call stack.
- **Side effect (important):** Sentry's `beforeSend` filter in `sentry.server.config.ts` was silently swallowing `DYNAMIC_SERVER_USAGE` digest errors. Removing the wrapper let those errors surface as hard 500s — leading directly to R-003 (next item).
- **When:** Session 5, Block 1a (commit `c5a7e73`)
- **Status:** active — re-enable after upstream fix lands or after pinning a known-good `@sentry/nextjs`. The runtime configs (`sentry.server.config.ts`, `sentry.client.config.ts`) still init Sentry in production only, so events would flow if the wrapper is restored. Until then, no source-map upload + no SDK injection at build time.

### D-101 · `/[country]/[geo]/[industry]` is fully dynamic
- **What:** Removed `export const revalidate = 21600` and `export const dynamicParams = true`. Added `export const dynamic = "force-dynamic"`.
- **Why:** Page reads `searchParams` (size + year switcher). Next 15.5.18 strictly classifies that combination as `DYNAMIC_SERVER_USAGE` and hard-throws unless the page is declared dynamic. Only the top-100 pre-rendered URLs (no query params at build time) survived; every other benchmark page 500'd on first SSR. Sentry was previously hiding this via `beforeSend` — when D-100 disabled Sentry's wrapper, the error surfaced as cached Vercel-edge 500s.
- **Cost:** Lost Next's ISR pre-render for top 100 popular pages. Every benchmark request now hits the Vercel function. Vercel's CDN can still cache via response headers — separate optimisation when time permits.
- **When:** Session 5, R-003 hotfix (commit `c4d99b4`)
- **Status:** active. **Follow-up S-100 below** captures the proper fix (move size/year into a client-side `useSearchParams` so the page can re-become static-ISR).

### D-102 · Inflation roll-forward at the data layer
- **What:** `applyRollforward(cell)` in `src/lib/cells.ts` is now called by all six cell normalizers. Every revenue percentile + payroll/employee is multiplied by a country-specific cumulative CPI factor from the cell's source year up to `INFLATION_TARGET_YEAR = 2025`. The cell's `year` field is bumped to 2025 so downstream consumers see a consistent current-year snapshot.
- **Why:** Founder explicit: "the last acceptable number that we can state is 2025". Underlying releases are typically 1-3 years stale; un-adjusted figures undermine the "current" framing of the whole site.
- **How:** `src/lib/stats/inflation.ts` ships a `COUNTRY_CPI` table for 43 economies (2020-2025 YoY %) + a 3.0 % YoY default for everything else. Enterprise/employee counts are NOT inflated (stock measures).
- **When:** Session 5, Block 8b (commit `bbd2859`)
- **Status:** active. If you ever need to know the source vintage, query Supabase directly — the in-memory cell.year is now always 2025.

### D-103 · Pareto-tail extrapolation for top 1% / top 0.1%
- **What:** `src/lib/stats/pareto.ts` fits a single-parameter power-law to the (p50, p90) anchors and returns p99, p99.9. Surfaced on every benchmark page in `RevenueTiles` as a "Modeled tail" strip beneath the Bottom 10 / Typical / Top 10 row. Also returned in the `/api/ask` `query_cells` tool response so Claude can answer "what does the top 1% earn?".
- **Why:** Founder asked for visibility into Pareto distributions per industry. Two anchors are enough for a defensible upper-tail estimate.
- **Guard rail:** Helper returns null when α ≤ 1 (infinite-mean regime) — no number is shown when we can't stand behind it.
- **When:** Session 5, Block 8a (commit `d89877b`)
- **Status:** active

### D-104 · Microsoft Clarity replaces Plausible
- **What:** `<Script id="ms-clarity" src="https://www.clarity.ms/tag/wtu315an8b" strategy="afterInteractive" />` in `src/app/layout.tsx`. No Plausible script anywhere.
- **Why:** Clarity is free forever (Microsoft), gives heatmaps + session recordings out of the box. Plausible's value-add was minimal for a pre-revenue site.
- **When:** Session 5, Wave 7
- **Status:** active

### D-105 · Vercel AI Gateway routing for /api/ask
- **What:** `src/app/api/ask/route.ts` prefers `ANTHROPIC_AI_GATEWAY_KEY` (routes through `https://ai-gateway.vercel.sh`); falls back to `ANTHROPIC_API_KEY` direct to Anthropic when gateway is absent.
- **Why:** Gateway gives per-query observability in the Vercel dashboard. Same Claude models, same response shape.
- **Model:** Bumped to `claude-sonnet-4-6` (was `claude-sonnet-4-5`).
- **System prompt:** Rewritten — Lorem-ipsum placeholders removed, voice locked, "cell" jargon banned in AI responses, year-citation suppressed (since data is now roll-forward to 2025 per D-102).
- **When:** Session 5, Wave 7 + Block 8d (commits `adab45a`)
- **Status:** active

### D-106 · Country-page hero is on cream, not ink-900
- **What:** `src/app/[country]/page.tsx` hero uses `bg-cream-100` (not the previous dark `bg-ink-900`). Tagline reads from `getCountryAnchor(iso2, countryName)` in `src/lib/content/country-anchors.ts` (10 seeded anchors for US/GB/DE/FR/JP/BR/IN/MX/ES/IT; falls back to "Small-business benchmarks across {country}." for the other 185).
- **Why:** Founder walked the live site, called the dark hero "inappropriate" against a cream site palette; called the hand-written taglines off-tone.
- **Tier chip:** "Estimated only / Coverage tier D" pill removed from the hero entirely. Quality info still surfaces lower on the page.
- **When:** Session 5, Block 4 (commit `aa96eed`)
- **Status:** active

### D-107 · Sitewide language standardised
- **What:** No user-visible "cell" / "cells", no `p10/p50/p90` notation, no year strings (2020-2024), no country-count numbers ("191 countries", "195 countries"). Standard distribution labels: **Bottom 10% / Typical / Top 10%** with ▼ ⓘ ▲ icons.
- **Where enforced:** Blocks 2, 6 across 41 files (commits `23767a5`, `5224338`).
- **Internal names preserved:** `FeaturedCellTile`, `CellOfTheWeek`, `getCellBySlug` etc. — component / function names referencing "cell" remain; only user-visible copy was changed.
- **When:** Session 5, Blocks 2 + 6
- **Status:** active. Follow-up S-101 below to rename internal component identifiers (low priority, no user impact).

### D-108 · Hero is a two-line editorial masthead with rotating words
- **What:** Direction A — typographic broadsheet hero on cream. Line 1: "How much does a {BUSINESS}". Line 2: "make in {CITY}?". Each line is its own `<span className="block w-full">` inside an `<h1 class="... flex flex-col">` for defensive vertical stacking. City span uses `min-w-[8ch]` (just enough for "New York"). Cormorant Garamond display serif via `next/font`.
- **Why:** Founder rejected the dark "cinematic frame" hero. Also fixed a "bakerymake" rendering bug where the two rotating words concatenated on some viewport widths.
- **When:** Session 5, Blocks 3 + 5 (commits `0b8992c`, `7563fab`)
- **Status:** active

### D-109 · Three dead homepage components removed
- **What:** `src/components/FirstFrameStrip.tsx`, `RecentlyAddedStrip.tsx`, `SpotlightCountry.tsx` deleted. The homepage no longer imports them.
- **Why:** Block 3 restructured the homepage; these three were orphaned. `RecentlyAddedStrip` carried the only horizontal-scroller-inside-page (founder asked for none).
- **When:** Session 5, Block 7 (commit `b517417`)
- **Status:** active

---

## 3 · Blockers — what's resolved, what's still open

### Resolved this session

- **B-001 Cloudflare DNS** → resolved. Site responds at `www.marginatlas.com`.
- **B-002 Editorial tone undecided** → resolved. Style guide is at `docs/specs/2026-05-19-site-editorial-style-guide.md`.
- **B-002b ANTHROPIC_API_KEY not in Vercel** → resolved. `/api/ask` is live (preview-stub path only triggers when key is genuinely absent).
- **The "every-benchmark-page 500s" catastrophic regression** (this session's R-003) → resolved by D-101.

### Still open / new

- **B-008 Real product images** → still on `SmartImage` placeholders. Unsplash production tier was applied for; not approved as of session-end. 50-req/hr demo cap throttles bulk image rebuilds.
- **B-100 (new) Sentry webpack wrapper disabled.** Re-enable when `@sentry/nextjs` ships a fix for the Next 15.5.18 RangeError or after pinning a known-good combination. Until then: no source-map upload, no SDK injection at build time. Runtime init still active in production.
- **B-101 (new) Benchmark pages bypass Next ISR.** Hotfix D-101 makes the route fully dynamic. Vercel function cost grows linearly with traffic. Follow-up S-100 restores caching.

---

## 4 · Plan v15 — what shipped (chronological)

Twelve blocks, each its own commit. All pushed to `origin/main`.

| Commit | Block | Headline |
|---|---|---|
| `c5a7e73` | 1a | Sentry wrapper disabled — fixed RangeError SSR crash on every route |
| `fedd49e` | 1b | Top-nav "World" → "Regions" |
| `23767a5` | 2 | Purge of year strings, "cell" / "cells", and country counts (31 files) |
| `0b8992c` | 3 | Homepage restructure — 2 prominent CTAs, inline methodology, cities placeholder, blog rail; Albania off featured grid; trimmed to symmetric 8 tiles |
| `aa96eed` | 4 | Country-page hero — cream bg, flag padding, style-guide tagline lookup, tier chip removed |
| `7563fab` | 5 | Hero — `min-w-[8ch]`, defensive `flex flex-col` line stacking, Surprise Me button parity |
| `5224338` | 6 | Distribution wording — Bottom 10% / Typical / Top 10% with ▼ ⓘ ▲ icons |
| `b517417` | 7 | Deleted 3 dead scroller components (367 lines), footer `mt-20` removed, `text-ink-700/80,85` → `text-ink-800` across 50+ files |
| `d89877b` | 8a | Pareto-tail extrapolation — top 1% / top 0.1% surfaced on every benchmark page |
| `bbd2859` | 8b | Inflation roll-forward at the data layer — all 6 normalizers wrapped, 43 countries seeded with 2020-2025 CPI series, 3% YoY fallback |
| `94e9145` | 8c | Stylized world-dots SVG in cities placeholder |
| `adab45a` | 8d | AskWidget AI — Lorem ipsum killed, model bumped to `claude-sonnet-4-6`, modeled top 1% / top 0.1% piped into the tool response |
| `c4d99b4` | R-003 | Catastrophic 500 hotfix — benchmark page declared dynamic |

---

## 5 · Files added / changed / removed this session

### Added

- `src/lib/stats/pareto.ts` (D-103)
- `src/lib/stats/inflation.ts` (D-102)
- `src/lib/content/country-anchors.ts` (D-106 — 10 seeded anchors + fallback helper)
- `src/components/CitiesDotsMap.tsx` (Block 8c)
- `docs/specs/2026-05-19-site-editorial-style-guide.md` (D-107)
- `data/content/cell_narratives_v1.json` (2,259 cached editorial paragraphs)
- `docs/handoff/15_SESSION_5_UPDATE.md` (this file)

### Deleted

- `src/components/FirstFrameStrip.tsx`
- `src/components/RecentlyAddedStrip.tsx`
- `src/components/SpotlightCountry.tsx`
- `scripts/probe_urls.sh` (Block 1 debug helper)
- `scripts/repro_500.ts` (R-003 debug helper)

### Materially changed

- `src/lib/cells.ts` — all 6 normalizers wrapped with `applyRollforward` (D-102)
- `src/components/RevenueTiles.tsx` — Bottom 10 / Typical / Top 10 labels + modeled tail (D-103, D-107)
- `src/components/RevenueDistribution.tsx` — same label normalisation
- `src/app/page.tsx` — homepage rebuilt (D-108, Block 3, Block 8c)
- `src/app/layout.tsx` — Clarity script added (D-104), top-nav Regions rename, footer `mt-20` removed
- `src/app/[country]/page.tsx` — D-106
- `src/app/[country]/[geo]/[industry]/page.tsx` — D-101 (force-dynamic)
- `src/app/api/ask/route.ts` — D-105 + Lorem ipsum purge
- `next.config.js` — D-100 (Sentry wrapper disabled)
- Across 50+ files: `text-ink-700/85,80` → `text-ink-800` contrast bump (Block 7)

---

## 6 · Untracked files in the working tree (founder decision needed)

These are **not in git** at session end. They're not breaking anything (loaders use `try/catch` fallbacks), but the founder should decide whether to commit them.

| Path | What it is | Recommendation |
|---|---|---|
| `data/images/countries_manifest.json` | Output of `scripts/images/build_manifests.py` (per `src/lib/images.ts`) | **Commit** if you want builds to ship with image lookups; else add to `.gitignore` |
| `data/images/industries_manifest.json` | Same | **Commit** |
| `data/quality/commercial_rent_verified_v1.json` | Loaded by `/admin/review` | **Commit** (used by founder-facing admin page) |
| `data/quality/industry_margins_verified_v1.json` | Same | **Commit** |
| `docs/specs/2026-05-19-plan-v13-wave3-image-system-plan.md` | Historical record of completed work | **Commit** for posterity |
| `docs/specs/2026-05-19-plan-v14-roadmap.md` | Historical record of completed work | **Commit** for posterity |
| `.claude/` | Local Claude session config | **Add to `.gitignore`**; do not commit |
| `next-env.d.ts`, `tsconfig.tsbuildinfo` | Auto-generated on every build | Already gitignored; safe to leave |

---

## 7 · Recommended next steps (extends chapter 11)

### S-100 (highest leverage) · Restore ISR caching on benchmark pages

- **Effort:** 2-4 hours
- **Unblocks:** Vercel function cost stops scaling linearly with crawler traffic
- **How:** Move the size/year reading out of the server page component. Make the `DimensionSwitcher` a client component that reads `useSearchParams()` and triggers a client-side data refetch (or a route hop). Once `searchParams` is no longer awaited at the page level, restore `export const revalidate = 21600; export const dynamicParams = true;` and drop `export const dynamic = "force-dynamic"`.
- **Risk:** If you re-introduce `revalidate` + `searchParams` at the same time, the catastrophic R-003 regression returns. Sentry's `beforeSend` would NOT swallow it now (the wrapper is disabled). Test with `npm start` + curl on a non-pre-rendered URL before pushing.

### S-101 (cosmetic) · Rename internal component identifiers

- **Effort:** 30 min
- **What:** `FeaturedCellTile` → `FeaturedBenchmarkTile`. `CellOfTheWeek` → `BenchmarkOfTheWeek`. `getCellBySlug` → `getBenchmarkBySlug`. Etc. No user impact, just hygiene against D-107.
- **Why later:** Pure code-style win; no functional or UX gain.

### S-102 · Bulk-import the remaining country anchors

- **Effort:** 1 hour
- **What:** Extend `src/lib/content/country-anchors.ts` from 10 seeded entries to all 195. Source: `docs/specs/2026-05-19-site-editorial-style-guide.md` §4.
- **Why:** Removes the generic "Small-business benchmarks across {country}." fallback for 185 countries.

### S-103 · Re-enable Sentry

- **Effort:** 15 min once upstream is fixed
- **What:** Bump `@sentry/nextjs` to a known-good version, re-enable `withSentryConfig(...)` in `next.config.js`. Verify no RangeError on a dev SSR request before pushing.
- **Why:** Real error monitoring + source-map upload. The runtime configs still init Sentry; only the build wrapper is disabled.

### S-104 · AskWidget streaming UX

- **Effort:** 3-4 hours
- **What:** Replace the single-response `await fetch + JSON.parse` in `src/components/AskWidget.tsx` with a Server-Sent Events / streaming response. Surface the answer token-by-token.
- **Why:** Current single-response feels slow even when total latency is fine.

### S-105 · CPI table maintenance

- **Effort:** 30 min quarterly
- **What:** Refresh `COUNTRY_CPI` in `src/lib/stats/inflation.ts` from IMF / World Bank / national statistical-office releases. Bump `INFLATION_TARGET_YEAR` to 2026 when the founder is ready to state 2026 numbers.
- **Why:** Inflation factors drift; keeps roll-forward honest.

---

## 8 · Things to NEVER do (extends chapter 10)

- **Never re-add `export const revalidate` AND `await searchParams` to the same page.** That's R-003. The fix is in commit `c4d99b4`; the same commit's diff explains the trap.
- **Never re-enable `withSentryConfig(...)` without verifying SSR doesn't crash.** D-100 / B-100. RangeError on every request.
- **Never display calendar years in user-facing copy.** D-107. The roll-forward in D-102 makes years actively misleading.
- **Never bulk-modify percentile labels without searching for `p10/p50/p90` first.** Block 6 normalised these; reintroducing the raw `p` notation breaks the editorial voice.
- **Never edit the eight blocks of Plan v15 individually after the fact.** They were shipped as a coherent pass; re-touching one breaks the consistency of the others. Make new blocks instead.

---

## 9 · Where everything lives — quick reference

| Thing | Location |
|---|---|
| Source code | `E:\atlas\website\src\` |
| Local env secrets | `E:\atlas\website\.env.local` (**never commit**; template in `.env.example`) |
| Production env vars | Vercel dashboard → project `marginatlas-web-twtl` → Settings → Environment Variables |
| Supabase service-role key | Rotated to `sb_secret_ev09CibYR_-1hPPX_0UJuw_QeOdV7nk` mid-session 5. Used as `SUPABASE_SERVICE_ROLE_KEY`. |
| GitHub repo | `github.com/benetbani/marginatlas-web` (private, default branch `main`) |
| Vercel project | `marginatlas-web-twtl` (the older `marginatlas-web` was deleted) |
| Supabase project | `npfqasdghbffqgmzgxzr.supabase.co` (Pro tier, ~960k rows across 3 tables) |
| Microsoft Clarity tag | `wtu315an8b` (in `src/app/layout.tsx`) |
| Style guide | `docs/specs/2026-05-19-site-editorial-style-guide.md` (826 lines) |
| Per-cell narratives cache | `data/content/cell_narratives_v1.json` (2,259 entries) |
| Country anchors | `src/lib/content/country-anchors.ts` (10 seeded, rest fall back) |
| CPI table | `src/lib/stats/inflation.ts` (43 countries + 3% default) |
| Pareto helper | `src/lib/stats/pareto.ts` |
| Inflation helper | `src/lib/stats/inflation.ts` |

---

## 10 · Verification URLs (extends chapter 12)

Smoke test these after any change to `src/app/[country]/[geo]/[industry]/page.tsx` or `src/lib/cells.ts`:

```
https://www.marginatlas.com/                                  → 200
https://www.marginatlas.com/us/california/restaurants          → 200
https://www.marginatlas.com/fr/fr10/restaurants                → 200  (was 500 pre-R-003)
https://www.marginatlas.com/gb/gb/legal-services               → 200  (was 500 pre-R-003)
https://www.marginatlas.com/mx/mexico/wholesale-food-beverages → 200  (was 500 pre-R-003)
https://www.marginatlas.com/in/india/software-development      → 200
https://www.marginatlas.com/jp/japan/restaurants               → 200
```

Use a real browser User-Agent header (`curl -A "Mozilla/5.0..."`) — the middleware blocks plain curl with 403.

To verify locally:

```
cd E:\atlas\website
rm -rf .next                      # important: stale .next causes phantom errors
npm run build && npx next start --port 3009
# then curl the URLs above against localhost:3009
```

---

## 11 · End of session 5

- Total session commits: **13** (12 Plan v15 blocks + 1 R-003 hotfix)
- HEAD: `c4d99b4` on `main`
- Working tree: clean (only auto-generated noise + untracked files in §6)
- Background agents: none running
- Skills used: `diagnose` (for R-003)
