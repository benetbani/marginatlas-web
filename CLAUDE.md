# CLAUDE.md — entry point for Claude sessions on marginatlas.com

This file is a navigation index, not the source of truth. The authority documents are in `docs/`. Read them when their topic comes up; don't re-derive what's already written.

## Project at a glance

- **Stack:** Next.js 15.5, React 19.2, TypeScript 5, Tailwind 3.4, Supabase Pro (eu-west-1), Vercel (`fra1`), Sentry
- **Project root:** `E:\atlas\website\` (its own git repo on `main`; the parent `E:\atlas\` is the data-pipeline project)
- **Production:** marginatlas.com (615 static pages prerendered at last build)
- **Component count:** 322 TS/TSX in src/; 136 .tsx components specifically
- **Routes:** 56 — see `src/app/`

## Top-level folder map

```
website/
├── src/
│   ├── app/            # Next.js App Router pages + API routes
│   ├── components/     # 3 layers: ui/ (system), motion/ (animation), root + sections/ + mobile/ (application)
│   ├── lib/            # Domain layer — cells, design-tokens, motion, finance/fx, feature_flags, types
│   ├── styles/         # globals.css + homepage-visual-tokens.css
│   └── middleware.ts   # Rate-limit + edge-cache rules
├── scripts/            # 25-gate prebuild verifiers + audit/ + maintenance codemods
├── data/               # Static data fixtures, audit outputs, quality reports
├── docs/               # AUTHORITATIVE — handoff, design-system, architecture, ingest, strategy
├── db/migrations/      # Supabase SQL — apply manually
└── content/blog/       # Markdown blog posts
```

## Read these first (in order) for any session

0. `docs/verification-protocol.md` — THE DEFINITION OF DONE. Run it before delivering ANY work to the founder: instruction fidelity (do the asked-thing, never silently substitute), gates, data honesty, SEE it (screenshot via the Playwright MCP), honest reporting, ship discipline. This is non-negotiable.
1. `docs/handoff/<latest>-session-handoff.md` — current state, pending tasks, gotchas, what shipped
2. `docs/design-system/GUIDELINES.md` — authority for any UI work
3. `docs/architecture/README.md` — domain/layer boundaries, the file map
4. `docs/brand/section-constitution.md` (the per-type section spine) + `docs/brand/cohesion-master-plan.md` (the one visual language)

## Canonical patterns (do not invent variations)

### Components rendering statistical data

- **Pages:** server-fetch via `getCellBySlug()` (or sibling lib accessor). If missing, call `notFound()` — never a "coming soon" stub.
- **Visualizations:** accept nullable inputs (`p10?: number | null`, etc.). If data is insufficient, `return null` — graceful silent omission, no placeholder. Never display raw `undefined` or `NaN`.
- **Pre-rendered pages:** no client loading skeletons; pages are static. Skeletons live in client components that fetch via API routes.

### Supabase queries

- Live in `src/lib/cells.ts` (or its child modules in `src/lib/cells/`); never in components.
- Each query wraps with `withBudget(query, ms)` — fail-soft fallback, never crash.
- Stale queries should ship as migrations to `db/migrations/<date>-<purpose>.sql`. Apply manually in Supabase SQL Editor (CONCURRENTLY does not work in transactions).

### Design-system primitives (`src/components/ui/*`)

- `forwardRef` + `displayName` + `cva` mandatory. `Button` is the reference shape.
- Tokens, not arbitrary values — see GUIDELINES §3.
- WCAG AA floor — see GUIDELINES §4.2.
- Catalog story in `src/app/_design/page.tsx` mandatory before merge.

### Layering

- Application (pages, sections) imports from Domain (`src/lib/`); Domain imports from System (`src/components/ui/`); System imports from Tokens (`src/lib/design-tokens.ts`).
- Upward only. `scripts/verify_layering.ts` enforces app-to-data; 14 grandfathered violations in the allowlist — migrate when touched, do not add new entries.

## Hard constraints (enforced by gates or user)

- **No em-dashes** in user-visible source (period/comma/colon). Gate: `verify_no_em_dashes`. Override: `// allow-em-dash` on the line.
- **No source-agency names** in user-facing copy (Eurostat, BLS, ATO, etc.). Gate: `verify_no_source_agencies`.
- **No URL slug renames** — SEO equity rides on existing URLs. Add new, never rename.
- **No raw hex/pixel/ms values** in components — pull from `design-tokens.ts` or `motion.ts`.
- **No `--no-verify`, `--no-gpg-sign`, force-push to main.**
- **Parallel prebuild concurrency ≤4 on Windows** (6 segfaults intermittently).

## Verification commands (ask permission before running)

- `npm run prebuild` — 25 gates, parallel, ~28-30s wall-clock
- `npm run prebuild:serial` — same gates, single-process, ~60s (use if parallel is flaky)
- `npx tsc --noEmit` — typecheck only, ~30-60s
- `npm run build` — full Next.js build (after prebuild); minutes

## Latest handoff

- **`docs/handoff/2026-06-16-session-handoff.md` is THE current handoff — READ IT FIRST, especially section 0.** The governing rule now: the FOUNDER designs each page in their own tool; the AI PORTS it 1:1 and wires the real data, and does NOT invent visuals (a week of AI-invented design was rejected as slop). The Brand Design Constitution + the full reformation plan are in `docs/superpowers/plans/2026-06-16-reformation/`; the Foundation (F1-F5) is built + committed on `reform-v2/r6-forward`; the P1 prototype `/dev/cell-reform` was rejected. The handoff carries the full state, every file's role, the constraints, and a paste-in bootstrap prompt.
- `docs/handoff/2026-06-14-session-handoff.md` (R6.5 live + the held engraved direction) and `2026-06-12` are prior handoffs, superseded by the 2026-06-16 pivot.

## Manual actions outstanding

- Supabase perf indexes (`db/migrations/2026-05-27-perf-indexes.sql`): APPLIED 2026-06-02. DB healthy. If high-CPU/Unhealthy recurs, verify the indexes still exist before anything else, then consider bumping compute off NANO.
- Sentry: cancel the trial (free tier already configured in code; no card on file = auto-drops to free).
