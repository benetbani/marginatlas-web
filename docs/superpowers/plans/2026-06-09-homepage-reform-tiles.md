# Homepage Reform, Sub-project 1: Cuts + Reorder + Example Tiles, Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's pointed-question list with a row of ~6 curated, recognizable business-in-city example tiles that each show a REAL headline number, cut the thesis strip and the earnings leaderboard, and reorder the front door so the tiles lead right under the hero.

**Architecture:** One new server-side loader (`src/lib/home/example_tiles.ts`) resolves six curated cells to a tile shape `{ business, city, href, headline }`, reusing the same owner-take-home source of truth the city/country pages use (revenue fallback), budget-wrapped and self-omitting on a miss. One new presentational server component (`src/components/home/ExampleTiles.tsx`) renders the grid. The homepage `src/app/page.tsx` drops three sections (thesis, earnings leaderboard, editorial questions+methodology) and mounts the tiles directly under the hero.

**Tech Stack:** Next.js 15.5 App Router (server component, ISR), TypeScript 5, the existing `getCellBySlug` + `withBudget` cell layer, Vercel remote preview build as the integration check. No local `npm run build` / `tsc` (RAM); the remote preview is the typecheck. The example tiles do I/O (resolve cells), so they are verified on the preview + a screenshot, not a pure unit test.

---

## Context the engineer needs

- **Branch + ship (no worktree):** work on `reform-v2/palette-brick`. Commit per task. Ship by `git push origin reform-v2/palette-brick:main` (fast-forward, auto-builds production). Use `git -C E:/atlas/website ...` (the shell cwd can reset to the parent between turns).
- **Verification:** do NOT run `npm run build`/`prebuild`/`tsc` locally. Deploy `vercel deploy --yes --cwd "E:/atlas/website"` (remote, ~3 min, runs all gates + tsc + pages, prints a `Preview:` URL). Curl the preview with header `x-vercel-protection-bypass: IyEPkYA7KNev2bootY3kFz5O1vEltR8o` + a browser UA. Screenshot via PowerShell: `Set-Location "E:\atlas\website"; $env:BYPASS="IyEPkYA7KNev2bootY3kFz5O1vEltR8o"; node scripts/shot_preview.mjs <preview-url> "/"`.
- **Constraints:** no em-dashes in user-visible strings (period/comma/colon), no source-agency names, tokens only (no raw hex), remove genuinely-unused imports (the build fails on them).
- **Existing helpers (read their signatures, do not reimplement):** `getCellBySlug(country, geo, industry, opts)` + `withBudget(promise, fallback, ms, label)` from `@/lib/cells`; `ownerTakeHomeForCell(cell, annualIncome): number | null` from `@/lib/scores/country_board`; `getCountryEconomicsSnapshot(iso2)` (has `.avgMonthlySalary`) from `@/lib/economics/country_metrics`; `fmtMoney(n)` from `@/lib/format/money`; the `atlas-card` utility class.
- **The homepage today** (`src/app/page.tsx`, read it first): hero+navigator -> world map (`WorldMapSection`) -> `WhatAtlasWeighs` (thesis) -> `BreakInBeat` (easiest/hardest) -> neighborhood proof -> `MoneyBeats` (earnings leaderboard) -> `HomepageEditorialBlocks` (the `HOME_QUESTIONS` pointed-question list + a methodology pipeline) -> blog rail. `loadHomepageBeats()` resolves `beats` (used by BOTH `BreakInBeat` and `MoneyBeats`).

## File Structure

- `src/lib/home/example_tiles.ts` (CREATE): the `ExampleTile` type, the curated six-cell list, and `loadExampleTiles()` (resolves cells + headline number, budget-wrapped, self-omits a tile on a miss).
- `src/components/home/ExampleTiles.tsx` (CREATE): the presentational grid (server component). Self-omits below three tiles.
- `src/app/page.tsx` (MODIFY): import + call `loadExampleTiles`, render `<ExampleTiles>` under the hero, REMOVE the `WhatAtlasWeighs`, `MoneyBeats`, and `HomepageEditorialBlocks` sections + their imports + the `HOME_QUESTIONS` const + the `AtlasQuestion` import. Keep `loadHomepageBeats`/`beats` (still feeds `BreakInBeat`).

---

### Task 1: The example-tiles loader + component

**Files:**
- Create: `src/lib/home/example_tiles.ts`
- Create: `src/components/home/ExampleTiles.tsx`

- [ ] **Step 1: Write the loader**

Create `src/lib/home/example_tiles.ts`:

```ts
/**
 * src/lib/home/example_tiles.ts
 *
 * The homepage's curated example tiles: six recognizable business-in-city cells,
 * each resolved to a real headline number (owner take-home, revenue fallback) so
 * a first-time visitor can open a concrete one instead of typing. Budget-wrapped
 * and self-omitting on a miss, so the homepage never blocks or shows a blank
 * number. The take-home uses the same source of truth the city/country pages use
 * (ownerTakeHomeForCell), so the headline matches that cell's own page.
 */
import { getCellBySlug, withBudget } from "@/lib/cells";
import { getCountryEconomicsSnapshot } from "@/lib/economics/country_metrics";
import { ownerTakeHomeForCell } from "@/lib/scores/country_board";
import { fmtMoney } from "@/lib/format/money";

export type ExampleTile = {
  business: string;
  city: string;
  href: string;
  /** Pre-formatted headline, e.g. "Owner keeps about $48K a year". */
  headline: string;
};

type Curated = {
  business: string;
  city: string;
  country: string;
  geo: string;
  industry: string;
};

/** Six curated, recognizable cells (the same set the old home questions used,
 * known to resolve). Familiar over maximally-varied, per the design. */
const CURATED: Curated[] = [
  { business: "Restaurants", city: "Barcelona", country: "es", geo: "es511", industry: "restaurants" },
  { business: "Software developers", city: "San Francisco", country: "us", geo: "california", industry: "software-development" },
  { business: "Law firms", city: "the UK", country: "gb", geo: "gb", industry: "legal-services" },
  { business: "Hotels", city: "Cancun", country: "mx", geo: "mx-roo", industry: "hotels-lodging" },
  { business: "Metal manufacturers", city: "Bavaria", country: "de", geo: "de21", industry: "fabricated-metal-mfg" },
  { business: "Restaurants", city: "California", country: "us", geo: "california", industry: "restaurants" },
];

function isNum(n: number | null | undefined): n is number {
  return n != null && Number.isFinite(n);
}

export async function loadExampleTiles(): Promise<ExampleTile[]> {
  const resolved = await Promise.all(
    CURATED.map(async (c): Promise<ExampleTile | null> => {
      const cell = await withBudget(
        getCellBySlug(c.country, c.geo, c.industry, { sizeBand: null, year: null }),
        null,
        4_000,
        `home-tile:${c.country}/${c.geo}/${c.industry}`,
      );
      if (!cell) return null;
      const href = `/${c.country}/${c.geo}/${c.industry}`;
      const snap = getCountryEconomicsSnapshot(c.country.toUpperCase());
      const annualIncome = isNum(snap?.avgMonthlySalary) ? snap.avgMonthlySalary * 12 : null;
      const takeHome = ownerTakeHomeForCell(cell, annualIncome);
      const revenue = cell.revenue_per_firm ?? cell.rev_p50 ?? null;
      let headline: string | null = null;
      if (isNum(takeHome) && takeHome > 0) {
        headline = `Owner keeps about ${fmtMoney(takeHome)} a year`;
      } else if (isNum(revenue) && revenue > 0) {
        headline = `About ${fmtMoney(revenue)} a year in revenue`;
      }
      if (!headline) return null;
      return { business: c.business, city: c.city, href, headline };
    }),
  );
  return resolved.filter((t): t is ExampleTile => t !== null);
}
```

- [ ] **Step 2: Write the component**

Create `src/components/home/ExampleTiles.tsx`:

```tsx
/**
 * ExampleTiles — the homepage's lead data hook. Six curated business-in-city
 * tiles, each with a real headline number, that open the cell directly. Doubles
 * as the "I do not know what to search" helper under the search box. Self-omits
 * below three resolved tiles so the homepage always renders. Server component,
 * tokens only.
 */
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import type { ExampleTile } from "@/lib/home/example_tiles";

export function ExampleTiles({ tiles }: { tiles: ExampleTile[] }) {
  if (tiles.length < 3) return null;
  return (
    <section className="py-8 md:py-10">
      <SectionEyebrow size="md" className="mb-2">Or open a real one</SectionEyebrow>
      <h2 className="font-display text-xl md:text-2xl font-medium tracking-tight text-ink-900 mb-5">
        See what a business actually keeps
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tiles.map((t) => (
          <a key={t.href} href={t.href} className="group atlas-card block px-5 py-4">
            <div className="text-sm font-semibold text-ink-900 group-hover:text-atlas-700 transition-colors">
              {t.business} in {t.city}
            </div>
            <div className="mt-1.5 text-sm text-cocoa-700">{t.headline}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git -C E:/atlas/website add src/lib/home/example_tiles.ts src/components/home/ExampleTiles.tsx
git -C E:/atlas/website commit -m "feat(home): example-tiles loader + component (curated cells, real headline number)"
```

---

### Task 2: Wire the homepage (cuts + reorder + tiles)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Swap the imports**

In `src/app/page.tsx`, REMOVE these three import lines:

```ts
import { WhatAtlasWeighs } from "@/components/home/WhatAtlasWeighs";
import { MoneyBeats } from "@/components/home/MoneyBeats";
import HomepageEditorialBlocks, { type AtlasQuestion } from "@/components/HomepageEditorialBlocks";
```

ADD these two:

```ts
import { ExampleTiles } from "@/components/home/ExampleTiles";
import { loadExampleTiles } from "@/lib/home/example_tiles";
```

Keep `BreakInBeat`, `loadHomepageBeats`, and every other import.

- [ ] **Step 2: Delete the HOME_QUESTIONS const**

Delete the entire `const HOME_QUESTIONS: AtlasQuestion[] = [ ... ];` block (the six pointed-question objects). It is replaced by the curated tiles.

- [ ] **Step 3: Resolve the tiles in the component**

In `HomePage()`, next to the other loaders (after `const beats = await loadHomepageBeats();`), add:

```ts
  const exampleTiles = await loadExampleTiles();
```

- [ ] **Step 4: Mount the tiles under the hero**

Immediately AFTER the hero `ToneBand` (the `<ToneBand tone="home-hero"> ... </ToneBand>` block that ends right before the world map) and BEFORE the world-map `ToneBand`, insert:

```tsx
      {/* Lead data hook: curated business-in-city example tiles with real
          headline numbers, the "open a real one" helper right under the search.
          Replaces the old pointed-question list. Self-omits below three. */}
      <ToneBand tone="home-featured">
        <ExampleTiles tiles={exampleTiles} />
      </ToneBand>
```

- [ ] **Step 5: Remove the three cut sections**

Delete these three rendered blocks (with their comments):
1. The `<ToneBand tone="home-featured"><WhatAtlasWeighs /></ToneBand>` (the thesis strip).
2. The `<ToneBand tone="home-featured"><MoneyBeats beats={beats} /></ToneBand>` (the earnings leaderboard).
3. The `<HomepageEditorialBlocks questions={HOME_QUESTIONS} />` line (the pointed questions + methodology pipeline).

Leave `BreakInBeat` (easiest/hardest), the neighborhood-proof section, and the blog rail exactly as they are. `beats` is still used by `BreakInBeat`, so keep `loadHomepageBeats`.

The resulting order is: hero+search -> example tiles -> world map -> BreakInBeat -> neighborhood proof -> blog rail. (The marketing band slots in between the proof and the blog in SP2.)

- [ ] **Step 6: Deploy a preview (typecheck + gates)**

Run: `vercel deploy --yes --cwd "E:/atlas/website"` (background; ~3 min). Expected: build succeeds, 29 gates PASS. If `WhatAtlasWeighs`, `MoneyBeats`, `HomepageEditorialBlocks`, `AtlasQuestion`, or `HOME_QUESTIONS` is flagged as unused/undefined, you missed a removal, fix and redeploy.

- [ ] **Step 7: Verify the render**

Curl the preview root (PowerShell), substituting the URL:

```powershell
$base = "<preview-url>"
$h = @{ "x-vercel-protection-bypass"="IyEPkYA7KNev2bootY3kFz5O1vEltR8o"; "User-Agent"="Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
$html = (Invoke-WebRequest -Uri "$base/" -UseBasicParsing -Headers $h -TimeoutSec 60).Content
"tiles_heading = " + ($html -match 'See what a business actually keeps')
"tile_number   = " + ($html -match 'Owner keeps about|a year in revenue')
"thesis_gone   = " + (-not ($html -match 'what eats it first'))
"breakin_kept  = " + ($html -match 'break in')
```

Expected: tiles_heading True, tile_number True (real numbers resolved), thesis_gone True, breakin_kept True. Then screenshot `/` and confirm the tiles sit right under the search, the thesis + earnings leaderboard + question list are gone, and the easiest/hardest beat + neighborhoods + blog remain.

- [ ] **Step 8: Commit**

```bash
git -C E:/atlas/website add "src/app/page.tsx"
git -C E:/atlas/website commit -m "feat(home): lead with example tiles, cut thesis + earnings leaderboard + question list, reorder"
```

---

### Task 3: Ship sub-project 1

**Files:** none (git only)

- [ ] **Step 1: Confirm the tree + the two commits**

Run: `git -C E:/atlas/website log --oneline -3 && git -C E:/atlas/website status --short`. Expected: the two homepage commits on top; clean tree.

- [ ] **Step 2: Fast-forward main**

Run: `git -C E:/atlas/website push origin reform-v2/palette-brick:main`. Expected: `... -> main`. Production rebuilds the verified code.

- [ ] **Step 3: Confirm production**

After ~3 min, curl `https://marginatlas.com/` and confirm `See what a business actually keeps` is present and the thesis line is gone, as on the preview.

---

## Self-Review

**1. Spec coverage (against `2026-06-09-homepage-reform-design.md`, SP1):**
- "Cut the thesis line (WhatAtlasWeighs)" -> Task 2 step 5.1. Covered.
- "Cut the earnings leaderboard (MoneyBeats)" -> Task 2 step 5.2. Covered.
- "Replace the pointed-question list with ~6 example tiles, business + city + a real number, curated/familiar" -> Task 1 (six curated cells, take-home with revenue fallback) + Task 2 steps 2,3,4. Covered.
- "Reorder so the tiles lead right under the hero" -> Task 2 step 4 (tiles before the world map) + step 5. Covered.
- "Tile number is real or the tile is swapped/dropped" -> `loadExampleTiles` returns null for an unresolved tile and `.filter`s it; `ExampleTiles` self-omits below three. Covered (honest no-blank-number).
- NOT in SP1 (correctly deferred): the marketing band (how-it-works, who-it-is-for, upgrade, newsletter) is SP2; the search cascade is SP3. The methodology pipeline removed with `HomepageEditorialBlocks` matches the new order (no methodology section; trust = demonstrated breadth).

**2. Placeholder scan:** No TBD/TODO; every code step shows complete code. The cut blocks in Task 2 step 5 are identified by their exact components (`WhatAtlasWeighs`, `MoneyBeats`, `HomepageEditorialBlocks`).

**3. Type consistency:** `ExampleTile` is defined once (Task 1) and imported by both the component and the page. `loadExampleTiles(): Promise<ExampleTile[]>`; the page awaits it into `exampleTiles` and passes `tiles={exampleTiles}`. `ownerTakeHomeForCell(cell, annualIncome)` and `getCountryEconomicsSnapshot(iso2).avgMonthlySalary` match their real signatures. `beats` stays (BreakInBeat); only the MoneyBeats render is removed.

---

## Follow-on plans (SP2 + SP3, each its own plan)

- **SP2, the marketing band:** the 3-step how-it-works; the who-it-is-for audience band (PE + investors, marketing agencies, management consultants, founders + operators, audience categories, not invented logos); the free-vs-premium upgrade table + CTA to /pricing; the prominent free-report newsletter. Inserted between the neighborhood proof and the blog rail.
- **SP3, the search cascade:** rework the navigator into country -> city -> business with a rotating pre-fill and forgiving input. Its own plan because it is the interactive component change.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-09-homepage-reform-tiles.md`. Two execution options:

1. **Subagent-Driven (recommended)** - a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - execute the tasks in this session with checkpoints.

Which approach?
