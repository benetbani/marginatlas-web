# Margin Atlas — Session Handoff (2026-06-08)

> Read this top to bottom before doing anything. It is fully self-contained: a
> new session should be able to start from this file alone and have complete
> context. Where it points to other docs, those are the deeper source of truth.
> When this conflicts with an older handoff, THIS file wins.

---

## 0. One-paragraph state

Margin Atlas (marginatlas.com) is a free "Local Profit Intelligence" data product:
it answers, for any business in any place, **"can I break in and actually make
money here, after rent, wages, taxes, competition, and local friction?"** It is
LIVE in production on Vercel. The big multi-session "page-sections" reform plan is
**COMPLETE (14/14 steps shipped)** plus a follow-on fix. The working tree is
**clean**. Current `main` tip: **`f6e0413e`**. Stack: Next.js 15.5 (App Router),
React 19.2, TypeScript 5, Tailwind 3.4, Supabase Pro (Postgres, eu-west-1, NANO),
Vercel (project `marginatlas-web-twtl`, team `benets-projects-3110e8e1`, region
`fra1`), Sentry. **Project root: `E:\atlas\website\`** (its own git repo). The
parent `E:\atlas\` is a SEPARATE repo (the data pipeline) — do not confuse them.

---

## 1. What this product IS (the thesis)

Not "Numbeo for margins," not "Statista for small business." The category is
**Local Profit Intelligence** — a decision engine for local business economics.
The output is never "here is the average margin"; it is **"this business can work
here, but only under these conditions."** Audience: buyers and investors judging
"is this market worth entering or buying," served warmly enough that a nervous
first-timer also belongs. Free decision-first site for reach + citation; a paid
API / gated premium depth is the money (this-year goal). The map (breadth × depth)
is the moat.

**The #1 product bar, absolute and non-negotiable: no visibly-wrong numbers.** A
premium reference cannot show a wrong figure. Every number is either real, or
DASHED, or the whole surface self-omits / `notFound()`s. Modeled numbers are
always labelled "modeled." We dash, we never guess.

**Voice / register (important nuance):** the long-term north star is "warm,
magazine-rich reference," BUT the founder's settled choice for the **data
surfaces (cell / opening / buy-or-start / scores)** is a **clean data tool**:
numbers lead, minimal prose, warmth only in short copy, NOT a magazine. Craft and
editorial atmosphere live on flagship country/city pages, not on the dashboard
cells. When you humanize any written report copy, aim for a **"finance student"**
voice (earnest, practical), not a polished pro-analyst voice.

---

## 2. The canon — READ THESE, in order

1. `CLAUDE.md` (repo root) — navigation index for the codebase.
2. **`docs/strategy/REFORMATION-BIBLE.md`** — THE SPEC ("the Bible"). The founder's
   ~1600-line plan: positioning, the 0-100 proprietary scores (Sec 10), the Founder
   Opportunity blend (Sec 21), the 29-module entity blueprint (Sec 6), content voice
   (Sec 25), data-confidence model (Sec 9), trust/methodology (Sec 19), MVP scope
   (Sec 17), data model (Sec 18). When in doubt, the Bible wins.
3. **`docs/strategy/2026-06-06-VISION-AND-ROADMAP.md`** — the north star, derived
   from three 20-question founder taste-and-vision passes. Read the "Update
   2026-06-07 (third taste pass)" at the bottom — it is the most current vision and
   overrides earlier conflicts.
4. `docs/strategy/LONGTERM-STRATEGY.md` — monetization, free-vs-paid, AI-era SEO,
   moat, the report/Pro tiers.
5. `docs/design-system/GUIDELINES.md` — UI authority: tokens, primitives, a11y,
   the layering rules, anti-patterns.
6. `docs/handoff/2026-06-04-reformation-handoff.md` — the prior big handoff (visual
   reformation). Good background; this file supersedes its state.
7. **`docs/superpowers/specs/2026-06-07-page-sections-design.md`** — the DECIDED
   per-page-type section design (from a 34-question pass). What each page type
   should contain.
8. **`docs/superpowers/plans/2026-06-07-page-sections-execution-plan.md`** — the
   14-step execution plan THIS work delivered. Header marked COMPLETE. Read it to
   understand the per-step ship discipline that worked.

---

## 3. Stack, infrastructure, connections

- **Frontend repo:** `E:\atlas\website\` (git, branch model below). 56 routes, ~322
  TS/TSX in `src/`. Production prerenders a bounded static set + ISR.
- **Production:** https://marginatlas.com — **307-redirects to https://www.marginatlas.com**.
  Always follow the redirect (curl `-L`, or PowerShell `Invoke-WebRequest
  -MaximumRedirection 5`). A non-following fetch reads empty bodies and will make
  you mis-report "no wrong number." This bit us once.
- **Vercel:** project `marginatlas-web-twtl`, team `benets-projects-3110e8e1`,
  region `fra1`. `vercel` CLI is authed in this environment. `vercel ls
  marginatlas-web-twtl --yes` lists deployments (newest first; status column has a
  `●` glyph; the table comes through stderr in non-TTY shells, so capture `2>&1`).
- **Supabase:** Pro, region `eu-west-1`, compute NANO. Postgres. Perf indexes were
  applied 2026-06-02 (`db/migrations/2026-05-27-perf-indexes.sql`). If DB goes
  Unhealthy/high-CPU, verify those indexes exist first, then consider bumping off
  NANO. Queries live ONLY in `src/lib/cells.ts` (+ children), each wrapped with
  `withBudget(query, ms)` (fail-soft). Env vars live in `.env.local` (local) and
  Vercel project env (cloud). `npx tsx` audit/dry-run scripts read `.env.local`.
- **Sentry:** free tier configured in code; no card on file.

---

## 4. Secrets, tokens, env

- **Vercel preview protection-bypass token:** `IyEPkYA7KNev2bootY3kFz5O1vEltR8o`
  Send on PREVIEW deployments as headers `x-vercel-protection-bypass` +
  `x-vercel-set-bypass-cookie: true` (and a browser User-Agent, or the app
  middleware may 451/403). Production (marginatlas.com) is public — no bypass
  needed there, just follow the www redirect with a browser UA.
- **App secrets** (Supabase URL/keys, etc.) live in `E:\atlas\website\.env.local`
  and in Vercel's project env. Do NOT print or commit them. `docs/handoff/06_API_KEYS_AND_SECRETS.md`
  documents what exists (not the values).
- **The parent `E:\atlas\secrets.env`** belongs to the data repo, not the website.

---

## 5. MCP servers & tools available

- **shadcn MCP** — registered in `E:\atlas\website\.mcp.json` (committed this
  session, commit `f6e0413e`). Runs via `npx shadcn@latest mcp`. Tools surface as
  `mcp__Shadcn_UI__*` (list/get components, blocks, themes). Use for component
  reference; this is a Tailwind/Radix/cva codebase, so adapt rather than paste.
- Environment also exposes general MCPs (Windows-MCP, computer-use, Claude-in-Chrome,
  shadcn). For THIS project the only one you normally need is shadcn. A browser
  screenshot is done with the local Playwright script (Section 8), not an MCP.
- **No dedicated Supabase/Vercel MCP** — use the `vercel` CLI and the `src/lib/cells`
  accessors / `npx tsx` dry-runs instead.

---

## 6. Repo map

```
E:\atlas\website\
├── CLAUDE.md                      # repo navigation index (read first)
├── .mcp.json                      # shadcn MCP config (committed)
├── src/
│   ├── app/                       # Next.js App Router routes (page types below)
│   ├── components/
│   │   ├── ui/                    # design-system primitives (forwardRef+cva)
│   │   ├── board/                 # the DATA BOARD KIT (see §10)
│   │   ├── open/                  # cost-to-open page components
│   │   ├── buy/                   # buy-vs-start page components (NEW this session)
│   │   ├── cities/ extremes/ check/ ...  # per-surface components
│   ├── lib/
│   │   ├── cells.ts + cells/      # ALL Supabase queries + cell resolution + trust
│   │   ├── open/                  # opening_page.ts, dealbreakers.ts, buy_vs_start.ts
│   │   ├── scores/                # break_in_rating.ts, city_attractiveness.ts, *_board.ts
│   │   ├── finance/               # owner_take_home.ts (single source of truth)
│   │   ├── qa/                    # plausibility_suppression.ts (dash guards)
│   │   ├── design-tokens.ts       # the ONLY place raw hex/px/ms may live
│   │   ├── taxonomy.ts            # industryToSlug, INDUSTRIES, slugToIndustry
│   │   └── ui/typography.ts       # T_H1 etc. typographic tokens
│   ├── middleware.ts              # rate-limit + edge-cache
│   └── styles/                    # globals.css + tokens css
├── scripts/                       # ~38 verify_*.ts gates + audit/ + dry-runs
│   ├── prebuild_all.ts            # parallel gate runner (Vercel prebuild)
│   ├── shot_preview.mjs           # remote-preview screenshot (Playwright)
│   └── audit/                     # dry-runs (dryrun_*.ts) + audits
├── docs/                          # AUTHORITATIVE prose (canon in §2)
└── db/migrations/                 # Supabase SQL, applied by hand
```

**Route map (page types — `src/app/.../page.tsx`):**
- `/[country]` — country page (one tax-and-setup section; climate-led; break-in panel).
- `/[country]/[geo]` — region page = a clean **index of its cities** (points into rich city pages).
- `/[country]/[geo]/[industry]` — **the cell page** (the core: numbers-only data board).
- `/[country]/[geo]/[industry]/opening` — **cost-to-open** page (capital, time, permits, dealbreaker).
- `/[country]/[geo]/[industry]/buy-or-start` — **buy-vs-start** page (NEW this session).
- `/[country]/[geo]/[industry]/[sub]` — sub-industry cell.
- `/industries/[industry]` and `/industries/[industry]/across` — industry hub + comparison.
- `/cities`, `/cities/[slug]` (+ /neighborhoods, /curiosities) — cities directory + rich city page (0-100 city score).
- `/extremes` — leaderboard hub (cost-to-open-led, client lens filter).
- `/tools`, `/decide`, `/check`, `/calculator` — the tools hub + the three tools.
- `/compare`, `/countries`, `/world`, `/coverage`, `/methodology`, `/blog`, `/learn`, etc.

---

## 7. The hard constraints (enforced by gates OR by the founder — never violate)

**RAM budget — the 600MB rule.** The local machine NEVER does heavy compilation.
Locally you run ONLY: `git`, a single `npx tsx scripts/<gate-or-dryrun>.ts` (one
modest node process), a `curl`/`Invoke-WebRequest` HTML fetch, and at most ONE
targeted/mobile screenshot. **NEVER run `npm run build`, `npm run prebuild`, or
`npx tsc` locally — they need multiple GB and OOM.** The full Next.js build + tsc +
the ~29-gate prebuild run **on Vercel in the cloud**, triggered by the push. Vercel
IS the real typecheck and gate. Prefer HTML-content extraction over screenshots;
never a giant desktop full-page render (it OOM'd once) — use `--mobile`.

**Strictly sequential.** One step ships fully (verified on Vercel + screenshot +
fast-forwarded to main + confirmed live) BEFORE the next begins. Do not parallelize
heavy work. (Even with "Ultracode" on, the founder's sequential + RAM constraints
override the "fan out a Workflow" default — a Workflow fans out ~16 agents and
blows the 600MB cap.)

**Content/code bars (gates will fail the Vercel build if violated):**
- No em-dashes in user-visible source (period/comma/colon). Gate `verify_no_em_dashes`.
- No source-agency names in user-facing copy (Eurostat, BLS, ATO, etc.). Gate `verify_no_source_agencies`.
- No "money back" style copy on the break-in surface (gate exists). Use e.g. "road back to profit."
- No raw hex/px/ms in components — pull from `design-tokens.ts` / `motion.ts`. Gate `verify_hardcoded_hex`.
- No URL slug renames (SEO equity rides on existing URLs). Add new, never rename.
- Section order on the cell page is gated (`verify_section_order`); no "count of things" tile phrasing (`find_useless_tiles`).
- Layering is upward-only (app → domain → system → tokens); `verify_layering` (14 grandfathered violations in an allowlist — migrate when touched, don't add new ones).
- Never `--no-verify`, `--no-gpg-sign`, or force-push to main.
- Parallel prebuild concurrency ≤4 on Windows (6 segfaults).

---

## 8. The ship workflow (the loop that worked)

This is the proven per-change recipe. **Branch model:** work commits land on
`reform-v2/palette-brick`; production is `main`; shipping is a **fast-forward**:
`git push origin reform-v2/palette-brick:main`.

0. **`cd /e/atlas/website` FIRST, every time.** The shell cwd resets to the parent
   `E:\atlas` (the data repo) between turns. Git commands in the wrong dir touch the
   wrong repo. Always cd, or use `git -C /e/atlas/website`.
1. **Build (subagent).** Dispatch a focused subagent with the full task text. It
   edits files, runs the light single-file `npx tsx` gates it can, self-reviews,
   and does NOT commit / NOT build / NOT tsc / NOT prebuild. For any change that
   introduces NEW modeled numbers, the subagent MUST produce a dry-run table and
   confirm every value is in-bounds and plausible.
2. **Review (controller = you).** Read the diffs of the touched files yourself,
   especially anything user-facing or numeric. Re-run the dry-run.
3. **Stage precisely.** `git add` ONLY the named files. NEVER `git add -A`, NEVER
   `git add scripts/` wholesale. Bracket paths need `GIT_LITERAL_PATHSPECS=1 git add
   "src/app/[country]/[geo]/[industry]/buy-or-start/page.tsx"`. Confirm with
   `git diff --cached --name-only`.
4. **Commit + push** to `reform-v2/palette-brick`. (Commit message style: lower-case
   conventional; end with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.)
5. **Vercel gate (cloud).** Poll `vercel ls marginatlas-web-twtl --yes 2>&1` until the
   newest Preview row is `Ready` (≈2 min build). If `Error`: `vercel inspect <url>
   --logs` → find the failing gate/tsc error → fix forward → re-push.
6. **Verify content.** Hit the changed routes on the preview with the bypass headers,
   extract key strings via regex (section present, figures correct, no NaN/undefined/
   negative, modeled labels present), and take ONE mobile screenshot to eyeball layout.
7. **Ship (fast-forward).** `git fetch origin main`; if `git log --oneline
   HEAD..origin/main` is 0 (main fully contained in branch), `git push origin
   reform-v2/palette-brick:main`. Else reconcile.
8. **Confirm live** on marginatlas.com (follow the www redirect), then move on.

**Screenshot recipe (RAM-safe):**
```
# Run via PowerShell, NOT Git Bash (MSYS mangles the leading-slash route into a Windows path).
$env:BYPASS = "IyEPkYA7KNev2bootY3kFz5O1vEltR8o"
node scripts/shot_preview.mjs "<preview-url>" "/us/california/restaurants/buy-or-start" --mobile
# saves screens\..._m.png  (then Read the PNG)
```

**HTML verify recipe (PowerShell, follows the www redirect on production):**
```
$h = @{ "x-vercel-protection-bypass"="IyEPkYA7KNev2bootY3kFz5O1vEltR8o"; "x-vercel-set-bypass-cookie"="true" }
$r = Invoke-WebRequest -Uri "<preview-url>/<route>" -Headers $h -UseBasicParsing -TimeoutSec 60
# strip tags, regex for figures; note: Next.js flight-data JSON in <script> contains
# literal "null" — that is NOT a visible leak, check the VISIBLE figures.
```

---

## 9. What shipped this session (chronological, all live)

This session executed and shipped the **14-step page-sections plan** plus fixes.
Commits on `main` (newest first), each a fast-forward:

- `f6e0413e` chore(mcp): shadcn MCP config + devDependency.
- `2759882a` fix(opening): stop flagship /opening + /buy-or-start prerenders 404ing
  (the "gb/gb gap" fix — see below).
- `0a42f594` docs(plan): mark page-sections execution plan complete (14/14).
- `f485dd37` **feat(buy-or-start): the new buy-vs-start page type** (Step 7.1).
- `06ffe2c5` feat(open): conditional "do not open unless" dealbreaker line (Step 6.1).
- `5f030b2b` feat(decide): live server-resolved examples replace hardcoded (Step 5.3).
- `6e97436c` feat(check): picker 20 → 200 industries, sector fallback (Step 5.2).
- `6f14fb35` feat(tools): /tools hub; fold Decide+Check nav into one (Step 5.1).
- `123c9066` feat(city): 0-100 city score on the city masthead (Step 4.1).
- `be159aae` feat(cities): world-region grouping + predictive city search (Step 3.2).
- `ad410a45` feat(extremes): cost-to-open-led + client lens filter (Step 3.1).
- `b530567a` feat(compare): one consistent "easiest to break in" lead (Step 2.1).
- `b8b157f1` feat(industry): merge the two place-pickers into one (Step 1.4).
- `a5f1546a` feat(region): region pages become a clean city index (Step 1.3).
- `16b66df1` feat(country): three tax/registration surfaces → one (Step 1.2).
- `50b2ba37` + `4e2808e5` feat(cell): numbers-only cell page; reordered tail (Step 1.1).
- (Earlier in the broader effort: `dc5dcd43` currency-overstatement dash fix,
  `24bc62f2` narrative revenue-leak fix — two live #1-bar breaches caught + fixed.)

**The gb/gb gap fix (2759882a), in detail** (a good worked example of the bar):
country-aggregate cells like `/gb/gb/legal-services` render fine as a cell page,
but their `/opening` and `/buy-or-start` SUB-pages `notFound()` because those
builders require a TRUSTED LOCAL cell (`isTrustedLocalCell`), which a
country-aggregate isn't. Fix: (a) both flagship `generateStaticParams` lists now
use trusted **city-level** geos (LA for cafes/hairdressers/auto-repair, NY hotels,
GB/EU at city level) instead of aggregates that 404'd; (b) the cell page gates its
"cost to open" cross-link on the SAME `isTrustedLocalCell(cell, expectedIndustryId)
&& cell.industry_id` predicate the builder uses, so a working cell can never link
to a 404. Verified by `scripts/audit/dryrun_flagship_static_params.ts` (all 20
flagship URLs resolve; the removed aggregates correctly 404; the gate hides on
gb/gb, shows on gb/london).

---

## 10. Key modules — what each means

**The data board kit — `src/components/board/*`** (the shared visual language for
every data surface; clean-data-tool register):
- `BoardHero`, `DataSection`, `StatGrid` — the masthead + section + stat-tile shells.
- `BreakInScore.tsx` — exports `BreakInMasthead` (the 0-100 break-in badge),
  `CityScoreMasthead` (the city 0-100 badge), `BreakInWhy`. Reused identically on
  the cell, opening, and buy-or-start pages so a score reads the same everywhere.
- `format.ts` — `fmtUSD`, `fmtWeeksToOpen`, etc. USD-only money formatting with
  tabular figures. Use these, never hand-format money.

**Scores — `src/lib/scores/*`:**
- `break_in_rating.ts` — THE marquee 0-100 score. Payback-dominant blend (0.58
  payback / 0.24 speed / 0.18 room); bands forgiving ≥78 / manageable 60-77 /
  demanding 40-59 / brutal <40. Headlines worded off "money back" → "road back to
  profit" (a copy gate). Calibration is "Balanced."
- `city_attractiveness.ts` + `city_board.ts` — the 0-100 CITY score (demand 52% /
  room 20% / rent 18% / survival 10%, monotonic contrast-stretch, same bands).
  Cities get a score; countries and industries do NOT.
- `cell_board.ts`, `country_board.ts`, `activity_board.ts`, `city_directory.ts`,
  `world_atlas.ts` — the per-surface board builders. `*_verdict.ts` / `verdict.ts`
  — the one-line honest verdicts.
- `founder_decision.ts` — the /decide engine.

**Cost-to-open + buy — `src/lib/open/*`:**
- `opening_page.ts` — `buildOpeningPage({country, geo, industry})`. Resolves the
  cell, applies `isTrustedLocalCell`, returns null (→ route `notFound()`) otherwise.
  Owns the cost-to-open total, time-to-open, the break-in payback, owner take-home.
  EVERY other surface reuses these numbers so they can't disagree.
- `dealbreakers.ts` — `dealbreakerFor(industryId)`: a 13-key map of the single
  "do not open unless …" condition for businesses where one dominates (restaurants,
  cafes, bars, hotels, gyms, dental, doctors, vets, childcare, pharmacy, hair, etc.).
  Returns null for everything else (renders nothing).
- `buy_vs_start.ts` — `buildBuyVsStart(...)` (NEW). START side = the live
  cost-to-open numbers re-framed. BUY side = a MODELED sale price = per-industry
  **SDE/owner-earnings multiple** (food ~2.0x, retail/trades ~2.2x, services ~2.4x
  default, health/software ~3.0x; clamped [1.5, 4.0]) × the cell's live owner
  take-home, with an **ASSET FLOOR** (`salePrice = max(earnings×multiple, 0.4 ×
  startTotal)`) so a thin-earnings asset-heavy business (a hotel, a plant) can't
  read as implausibly cheap to buy. Returns null when take-home or cost-to-open is
  missing. The verdict is fact-checked against the actual cash figures and ALWAYS
  names the catch on BOTH sides (ramp/failure on start; goodwill/inherited-problems
  on buy). Dry-run: `scripts/audit/dryrun_buy_vs_start.ts`.
- `src/components/buy/*` — `BuyVsStartHero` (question + two cash figures + verdict),
  `BuyVsStartCompare` (side-by-side cash / time-to-cash-flow / risk), `BuyVsStartCatches`
  (upside + catch per side). The buy figure is labelled "To buy one, modeled."

**Data integrity — the numbers' single sources of truth:**
- `src/lib/finance/owner_take_home.ts` — `resolveOwnerTakeHome(...)` =
  `max(structuralNetProfit, clampMargin(rawNetMargin) × revenue)` then a larger-firm
  2× floor. The ONE place owner take-home is computed (cell page + opening builder
  both call it). Fixed the live negative-take-home breach.
- `src/lib/qa/plausibility_suppression.ts` — `RELATIVE_OUTLIER_DASH_MULTIPLIER = 2.5`;
  `isRelativeRevenueOutlier()`: if `revenue_per_firm / (globalMedian × country
  revenue_multiplier) > 2.5`, DASH the whole revenue waterfall. Fixed the live
  currency overstatement.
- `src/lib/cells/fill_defaults.ts` — `enforceSanity` (per-firm employee division
  BEFORE the affordability cap).
- `src/lib/cells/trust.ts` — `isTrustedLocalCell(cell, expectedIndustryId?)`: the
  gate that decides whether a cell is a real local measurement (vs aggregate /
  extrapolated). `opening`, `buy-or-start`, and the cell-page cross-link all gate
  on it.

---

## 11. Errors that must NOT be repeated (hard-won)

1. **Shell cwd resets to `E:\atlas` (the PARENT data repo) between turns.** Always
   `cd /e/atlas/website` first, or `git -C /e/atlas/website`. A `git status` showing
   `ATLAS-*.md`, `inventory.csv`, `secrets.env`, `website/` as untracked means you
   are in the wrong repo.
2. **Never `npm run build` / `prebuild` / `npx tsc` locally — OOM (>600MB).** Push;
   Vercel is the real build + typecheck + 29 gates.
3. **Precise per-file staging.** A broad `git add scripts/` once swept an untracked
   WIP test that `prebuild_all.ts` referenced → Vercel `ERR_MODULE_NOT_FOUND`. Stage
   only named files.
4. **Bracket paths need `GIT_LITERAL_PATHSPECS=1`** to `git add` (e.g.
   `src/app/[country]/[geo]/[industry]/...`).
5. **marginatlas.com 307-redirects to www** — follow the redirect or you read empty
   bodies and mis-report. (This caused a wrong "no live breach" report once.)
6. **tsc type-checks DEAD code.** A render-disabled block `{false && (() => { …
   lead.sentence … })()}` still type-errors on `lead` possibly-null → use optional
   chaining (`lead?.sentence`) even in disabled blocks.
7. **Copy gates fail the build:** "money back" tripped the break-in copy gate
   (reworded to "road back to profit"); em-dashes, source-agency names, raw hex all
   have gates. Run the light gates locally before pushing.
8. **Screenshot script must run via PowerShell**, not Git Bash (MSYS mangles the
   leading-slash route into `c/Program Files/Git/...`).
9. **`vercel ls` output comes through stderr in non-TTY** — capture `2>&1`, and the
   newest deployment is the top row; the status has a `●` glyph.
10. **Next.js flight-data JSON contains literal `null`/`undefined`** inside `<script>`
    tags — a naive tag-strip + grep flags a false "leak." Check the VISIBLE figures,
    not the serialized payload.
11. **Don't port from `design-assets/incoming/set_17..20`** — those are stale,
    pre-refactor exports; porting regresses the repo.
12. **Modeled numbers must be labelled and self-omit** — never print an invented
    figure; `notFound()` / `return null` when the data isn't trustworthy.

---

## 12. The gates (run the light ones locally; Vercel runs all)

~38 `scripts/verify_*.ts` + `scripts/audit/*`. The Vercel prebuild runs them via
`scripts/prebuild_all.ts` (parallel, ≤4 concurrency on Windows). The serial list is
in `package.json` → `prebuild:serial`. The ones you'll touch most as light
single-file checks: `verify_no_em_dashes`, `verify_no_source_agencies`,
`verify_hardcoded_hex`, `verify_section_order`, `verify_layering`,
`verify_typography_consistency`, `audit/find_useless_tiles`. Run one at a time:
`npx tsx scripts/verify_no_em_dashes.ts`. Dry-runs for the new modeled numbers:
`scripts/audit/dryrun_buy_vs_start.ts`, `scripts/audit/dryrun_flagship_static_params.ts`,
`scripts/audit/dryrun_city_score.ts`.

---

## 13. Open items / next candidates (nothing is blocking)

The 14-step plan is DONE. Honest candidates for "what's next," per the vision doc:
- **Competition-density dataset** (firms per capita / saturation) — the chosen next
  dataset; powers the break-in "room" term and a real "room to enter" read.
- **The Extremes hub** depth — more leaderboard lenses now that the scores exist.
- **The magazine/warm-voice layer** on flagship COUNTRY/CITY pages (atmosphere,
  photography, story) — explicitly NOT on the data cells (those stay clean tool).
- **The API / gated premium depth** — the money; define the free/paid line.
- **Data-quality foundation, ongoing:** tighten loose bounds, currency coverage
  beyond Mexico, the band remap + dedupe (see `MEMORY.md` extrapolated-cells note).
- **Cell → buy-or-start cross-link:** currently buy-or-start is reachable from the
  cost-to-open hero; a gated cell-page link (same `isTrustedLocalCell` gate) could be
  added if desired.
- **shadcn devDep:** committed; if it ever bloats installs undesirably it can be
  reverted (the MCP runs via npx regardless).

---

## 14. Quick-start checklist for the next session

1. `cd /e/atlas/website`; `git fetch origin main`; confirm tip is `f6e0413e` (or later).
2. Read `CLAUDE.md`, then the Bible (`docs/strategy/REFORMATION-BIBLE.md`) and the
   vision doc (`docs/strategy/2026-06-06-VISION-AND-ROADMAP.md`, esp. the 2026-06-07
   update at the bottom).
3. Confirm the working tree is clean (`git status --porcelain`).
4. Pick the next item with the founder; follow the §8 ship workflow exactly; honor
   the §7 hard constraints and the §11 errors-not-to-repeat.
5. Branch model: commit on `reform-v2/palette-brick`, fast-forward to `main` to ship.
