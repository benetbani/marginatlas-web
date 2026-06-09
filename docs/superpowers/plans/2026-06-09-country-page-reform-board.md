# Country Page Reform, Sub-project 1: Board Reform, Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reform the country page's lead data board so it leads with a demand section, holds each economics figure exactly once, drops inflation, and removes the duplicate 5-tile at-a-glance row, with no new external data.

**Architecture:** Two edits behind one verified ship. The pure builder `src/lib/scores/country_board.ts` is restructured (test-first via a `tsx` assertion script) to emit five sections in the shared demand-first order, moving GDP-per-capita and net-wealth into a new Demand depth section and deleting the inflation row. Then the country page `src/app/[country]/page.tsx` drops the now-duplicate at-a-glance tiles and the inflation strip, and the canonical section list drops the retired `country-stats` id. The board is rendered as cards inside the `hero` section, so its internal section keys are NOT page-level section ids and do not touch the section-order gate.

**Tech Stack:** Next.js 15.5 App Router, React 19.2, TypeScript 5, `tsx` for the assertion test, Vercel remote preview build (29 prebuild gates + tsc + 628 pages) as the integration check. No local `npm run build` (RAM ceiling); the remote preview is the typecheck.

---

## Context the engineer needs

- **Branch + ship workflow (do NOT open a worktree):** work on `reform-v2/palette-brick`. Commit per task. Ship a finished sub-project by `git push origin reform-v2/palette-brick:main` (fast-forward), which auto-triggers the production build. Use `git -C E:/atlas/website ...` because the shell cwd can reset to the parent `E:/atlas` between turns.
- **The only unit test you run locally is a single `tsx` script** (low RAM, seconds): `npx tsx tests/scores/country_board.test.ts`. Do NOT run `npm run build` / `npm run prebuild` / `tsc` locally. The integration verification is a Vercel preview: `vercel deploy --yes --cwd "E:/atlas/website"` (remote, ~3 min, runs all gates + tsc + pages). It prints a `Preview:` URL.
- **Verify a preview by curl** with the bypass header + a browser UA: header `x-vercel-protection-bypass: IyEPkYA7KNev2bootY3kFz5O1vEltR8o`. Screenshot via PowerShell (set the location first): `Set-Location "E:\atlas\website"; $env:BYPASS="IyEPkYA7KNev2bootY3kFz5O1vEltR8o"; node scripts/shot_preview.mjs <preview-url> "/de"`.
- **Test pattern** (copy it): `tests/scores/scores.test.ts` is a plain `tsx` script with a local `assert(cond, msg)` that increments a `failures` counter and `process.exit(1)`s at the end if any failed. Imports use the `@/` alias (tsx resolves it).
- **Constraints:** no em-dashes in user-visible strings, no source-agency names, tokens only, no slug renames. Unused imports fail the build, remove them.

## File Structure

- `tests/scores/country_board.test.ts` (CREATE): the test-first assertion script for the new board shape.
- `src/lib/scores/country_board.ts` (MODIFY): `buildCountryBoard` restructured to five demand-first sections; drop the `fmtPct` import once inflation is gone.
- `src/app/[country]/page.tsx` (MODIFY): remove the `CountryAtAGlance` usage + import and the `country-stats` (`CountryStatsStrip`) section + import.
- `src/lib/page-layout/section-order.ts` (MODIFY): drop the retired `country-stats` id from `COUNTRY_PAGE_SECTIONS` and `SECTION_TONES`.

The current `buildCountryBoard` (read it first) returns four sections in the order `friction, labor, survival, market`, with GDP-per-capita in `labor`, net-wealth as "Household savings" in `market`, and a "Price stability" inflation row in `market`.

---

### Task 1: Restructure the country board builder (test-first)

**Files:**
- Create: `tests/scores/country_board.test.ts`
- Modify: `src/lib/scores/country_board.ts` (the `buildCountryBoard` function, currently the section blocks + the `return [...]` array, plus the `import { fmtUSD, fmtPct }` line)

- [ ] **Step 1: Write the failing test**

Create `tests/scores/country_board.test.ts`:

```ts
/**
 * tests/scores/country_board.test.ts
 * Plain assertion test for the reformed country board. Run:
 *   npx tsx tests/scores/country_board.test.ts
 */
import { buildCountryBoard } from "@/lib/scores/country_board";

let failures = 0;
function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error("  x " + msg);
    failures++;
  }
}

const econ = {
  gdpPerCapita: 50000,
  avgMonthlySalary: 4000,
  netWealthPerAdult: 120000,
  selfEmploymentPct: 15,
  daysToStart: 7,
  inflationPctYoy: 3.2,
};

// 1. Five sections, in the shared demand-first order.
{
  const keys = buildCountryBoard({ econ }).map((s) => s.key);
  assert(keys.length === 5, "country board has five sections");
  assert(
    JSON.stringify(keys) ===
      JSON.stringify(["demand", "labor", "market", "friction", "survival"]),
    "sections run demand, labor, market, friction, survival",
  );
}

// 2. Demand section leads with market size, purchasing power, customer wealth.
{
  const demand = buildCountryBoard({ econ }).find((s) => s.key === "demand");
  assert(demand != null, "a demand section exists");
  const labels = (demand?.rows ?? []).map((r) => r.label);
  assert(labels.includes("Market size"), "demand has a market-size slot");
  assert(labels.includes("Purchasing power"), "demand has purchasing power");
  assert(labels.includes("Customer wealth"), "demand has customer wealth");
  const pp = demand?.rows.find((r) => r.label === "Purchasing power");
  assert(pp?.value != null && pp.value.includes("50"), "purchasing power reads GDP per capita");
}

// 3. Inflation is gone everywhere (no price-stability row).
{
  const allLabels = buildCountryBoard({ econ }).flatMap((s) => s.rows.map((r) => r.label));
  assert(!allLabels.includes("Price stability"), "no inflation / price-stability row remains");
}

// 4. GDP and net wealth are not duplicated outside the demand section.
{
  const board = buildCountryBoard({ econ });
  const labor = board.find((s) => s.key === "labor");
  const market = board.find((s) => s.key === "market");
  assert(!(labor?.rows ?? []).some((r) => r.label === "GDP per capita"), "GDP per capita moved out of labor");
  assert(!(market?.rows ?? []).some((r) => r.label === "Household savings"), "net wealth moved out of market");
}

// 5. Null econ still yields the full five-section scaffold with dashes.
{
  const board = buildCountryBoard({ econ: null });
  assert(board.length === 5, "null econ still yields five sections");
  const demand = board.find((s) => s.key === "demand");
  assert((demand?.rows ?? []).every((r) => r.value == null), "null econ dashes every demand row");
}

if (failures > 0) {
  console.error(`\ncountry_board.test: FAIL (${failures} assertion(s))`);
  process.exit(1);
}
console.log("country_board.test: PASS. Country board demand-first, inflation dropped, no duplication.");
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx tsx tests/scores/country_board.test.ts`
Expected: FAIL. The current board returns four sections in the order `friction, labor, survival, market` with no demand section, so assertions 1, 2, 4 fail.

- [ ] **Step 3: Implement the board restructure**

In `src/lib/scores/country_board.ts`, change the import line:

```ts
import { fmtUSD } from "@/components/board/format";
```

(Drop `fmtPct`; it was only used by the inflation row being removed.)

Replace the `laborRows`, `survivalRows`, `marketRows` blocks and the final `return [...]` with the following. Insert the new `demandRows` block immediately before `laborRows`. Keep `frictionRows` and the `annualWage` const exactly as they are.

```ts
  // -- demand. Demand depth (modeled). -------------------------------------
  // Market size (population) is not held at country altitude today, so it
  // dashes (a data-phase slot). Purchasing power reads off GDP per capita and
  // customer wealth off the median net wealth per adult; both move here from
  // the labor / market sections so the board leads with the size and depth of
  // the opportunity, mirroring the cell and city boards' demand section.
  const demandRows: StatRow[] = [
    { label: "Market size", value: null, hint: "population" },
    {
      label: "Purchasing power",
      value: econ && isNum(econ.gdpPerCapita) ? fmtUSD(econ.gdpPerCapita) : null,
      hint: "GDP per capita",
    },
    {
      label: "Customer wealth",
      value: econ && isNum(econ.netWealthPerAdult) ? fmtUSD(econ.netWealthPerAdult) : null,
      hint: "net wealth per adult",
    },
  ];

  // -- labor. Labor and skills (modeled). ----------------------------------
  // Average wage comes from the snapshot's monthly salary (annualized for the
  // yearly read). GDP per head moved up to the demand section. Skills and
  // hiring are qualitative rows we do not yet hold, so they blank.
  const laborRows: StatRow[] = [
    {
      label: "Average wage",
      value: isNum(annualWage) ? fmtUSD(annualWage) : null,
      hint: "per year",
    },
    {
      label: "Monthly salary",
      value: econ && isNum(econ.avgMonthlySalary) ? fmtUSD(econ.avgMonthlySalary) : null,
    },
    { label: "Skills availability", value: null },
    { label: "Hiring difficulty", value: null },
    { label: "Minimum-wage pressure", value: null },
  ];

  // -- survival. Survival baseline (modeled). ------------------------------
  // Country-level business survival is not held today; the rows are present so
  // the field is named, and blank so nothing is invented. Filled in a later
  // sub-project (the data-phase modeled fills).
  const survivalRows: StatRow[] = [
    { label: "1-year survival", value: null },
    { label: "3-year", value: null },
    { label: "5-year", value: null },
    { label: "Closure rate", value: null },
  ];

  // -- market. Market structure (modeled). ---------------------------------
  // Informality reads off the snapshot's self-employment share. Net wealth
  // moved up to the demand section as customer wealth; inflation was dropped
  // (not central to a start-a-business decision). Concentration is a
  // qualitative summary we do not yet hold.
  const marketRows: StatRow[] = [
    {
      label: "Informality",
      value:
        econ && isNum(econ.selfEmploymentPct)
          ? `${Math.round(econ.selfEmploymentPct)}% self-employed`
          : null,
    },
    { label: "Concentration", value: null },
    { label: "Chain share", value: null },
  ];

  return [
    { key: "demand", title: "Demand depth", rows: demandRows, modeled: true },
    { key: "labor", title: "Labor and skills", rows: laborRows, modeled: true },
    { key: "market", title: "Market structure", rows: marketRows, modeled: true },
    { key: "friction", title: "Institutional friction", rows: frictionRows, modeled: true },
    { key: "survival", title: "Survival baseline", rows: survivalRows, modeled: true },
  ];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx tsx tests/scores/country_board.test.ts`
Expected: PASS. Prints `country_board.test: PASS. Country board demand-first, inflation dropped, no duplication.`

- [ ] **Step 5: Commit**

```bash
git -C E:/atlas/website add tests/scores/country_board.test.ts src/lib/scores/country_board.ts
git -C E:/atlas/website commit -m "feat(country): demand-first board, inflation dropped, no duplicate economics"
```

---

### Task 2: Drop the duplicate at-a-glance tiles and the inflation strip from the page

**Files:**
- Modify: `src/app/[country]/page.tsx` (the imports near the top, the `<CountryAtAGlance ... />` inside the `#hero` section, and the `#country-stats` section)
- Modify: `src/lib/page-layout/section-order.ts` (`COUNTRY_PAGE_SECTIONS` and `SECTION_TONES`)

- [ ] **Step 1: Remove the two imports**

In `src/app/[country]/page.tsx`, delete these two import lines:

```ts
import { CountryStatsStrip } from "@/components/CountryStatsStrip";
import { CountryAtAGlance } from "@/components/CountryAtAGlance";
```

Leave every other import (including `getToneClass`, still used by other sections).

- [ ] **Step 2: Remove the at-a-glance tiles**

In the `#hero` section, delete this line (the economics now live once, in the board above it):

```tsx
        <CountryAtAGlance iso2={iso2} topIndustries={topIndustries} />
```

Keep the `topIndustries` variable; it still feeds the industry grid and the break-in panel.

- [ ] **Step 3: Remove the inflation strip section**

Delete the entire `#country-stats` section and its comment block:

```tsx
      {/* 2. country-stats: the non-tax operating signal (inflation over the
         last 12 months). ... self-omits
         when the inflation signal is absent. */}
      <section id="country-stats" className={`py-8 ${getToneClass("country-stats")}`}>
        <CountryStatsStrip iso2={iso2} />
      </section>
```

(Match the actual comment text in the file; the section is the one rendering `<CountryStatsStrip iso2={iso2} />`.)

- [ ] **Step 4: Drop the retired section id from the canonical list**

In `src/lib/page-layout/section-order.ts`, remove `"country-stats",` from `COUNTRY_PAGE_SECTIONS`:

```ts
export const COUNTRY_PAGE_SECTIONS = [
  "hero",
  "industry-mix-grid",
  "top-cities",
  "regions",
  "tax-overview",
  "related-countries",
] as const;
```

And remove the now-dead tone entry from `SECTION_TONES` (the `"country-stats": "white",` line under the `// Country page` block). Removing a rendered section is subsequence-safe for the `verify_section_order` gate; this keeps the list honest.

- [ ] **Step 5: Deploy a preview to typecheck + run the gates**

Run: `vercel deploy --yes --cwd "E:/atlas/website"` (background it; it prints a `Preview:` URL when done, ~3 min). This is the typecheck (no local build). Expected: build succeeds, all 29 gates PASS. If `CountryStatsStrip` or `CountryAtAGlance` is reported as an unused import anywhere, you missed a usage, fix and redeploy.

- [ ] **Step 6: Verify the render on the preview**

Run (PowerShell), substituting the preview URL:

```powershell
$base = "<preview-url>"
$h = @{ "x-vercel-protection-bypass"="IyEPkYA7KNev2bootY3kFz5O1vEltR8o"; "User-Agent"="Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
$html = (Invoke-WebRequest -Uri "$base/de" -UseBasicParsing -Headers $h -TimeoutSec 60).Content
"demand_section = " + ($html -match 'Demand depth')
"purchasing_power = " + ($html -match 'Purchasing power')
"gdp_count = " + ([regex]::Matches($html,'GDP per capita').Count)
"inflation_gone = " + (-not ($html -match 'inflation'))
```

Expected: `Demand depth` present, `Purchasing power` present, `GDP per capita` count is 1 (the board's demand hint only, no duplicate tile), `inflation` absent. (Counts can read double via Next's RSC payload echo; if `gdp_count` is 2 confirm visually with a screenshot that only one GDP figure shows.)

- [ ] **Step 7: Screenshot for a visual check**

```powershell
Set-Location "E:\atlas\website"; $env:BYPASS="IyEPkYA7KNev2bootY3kFz5O1vEltR8o"; node scripts/shot_preview.mjs <preview-url> "/de"
```

Open `screens/de.png`: the board leads with a Demand depth card, the old 5-tile economics strip and the inflation strip are gone, no figure repeats.

- [ ] **Step 8: Commit**

```bash
git -C E:/atlas/website add "src/app/[country]/page.tsx" src/lib/page-layout/section-order.ts
git -C E:/atlas/website commit -m "feat(country): drop the duplicate at-a-glance tiles and the inflation strip"
```

---

### Task 3: Ship sub-project 1

**Files:** none (git only)

- [ ] **Step 1: Confirm the working tree is clean and the two task commits are present**

Run: `git -C E:/atlas/website log --oneline -3 && git -C E:/atlas/website status --short`
Expected: the two `feat(country): ...` commits on top; clean tree.

- [ ] **Step 2: Fast-forward main (ships dormant-safe; pure content reform, no flags)**

Run: `git -C E:/atlas/website push origin reform-v2/palette-brick:main`
Expected: `... reform-v2/palette-brick -> main`. The production build runs the same code the preview already verified.

- [ ] **Step 3: Confirm production**

After ~3 min, curl `https://marginatlas.com/de` and confirm `Demand depth` is present and `inflation` is absent, exactly as on the preview.

---

## Self-Review

**1. Spec coverage (against `2026-06-09-country-page-reform-design.md` section 3, sub-project 1):**
- "Consolidate the economics into the board, shown once" -> Task 1 moves GDP + net wealth into demand; Task 2 removes the duplicate tiles. Test assertion 4 guards no duplication. Covered.
- "Remove the duplicate 5-tile at-a-glance row" -> Task 2 step 2. Covered.
- "Drop inflation entirely (board row + strip)" -> Task 1 (row) + Task 2 step 3 (strip). Test assertion 3 guards the row. Covered.
- "Add the demand section slot" -> Task 1 demandRows (market-size slot dashes, data-phase). Test assertion 2. Covered.
- "Align section vocabulary, demand-first order" -> Task 1 return order. Test assertion 1. Covered.
- NOT in this sub-project (deferred to sub-project 4, correctly): filling friction + survival with modeled reads, minimum wage, the ease-of-doing-business rank. The scaffold rows stay blank here, matching the spec's sequence.

**2. Placeholder scan:** No TBD/TODO. Every code step shows complete code. The `country-stats` comment-block deletion in Task 2 step 3 says to match the file's actual comment text (the section is unambiguously the one rendering `<CountryStatsStrip />`).

**3. Type consistency:** `buildCountryBoard` signature and `CountryBoardEcon` are unchanged (the page still passes the full snapshot; the unused `inflationPctYoy` field is left on the interface, harmless). `BoardSection` keys are free-form strings. The test imports the real `buildCountryBoard`. `fmtUSD` stays imported and used; `fmtPct` removed because its only use (the inflation row) is gone.

---

## Follow-on plans (sub-projects 2-4, each its own plan)

These are separate shippable increments, planned when scheduled (the city reform shipped A-G this way):

- **Sub-project 2, redundancy cuts + reorder:** delete the "most common businesses" grid (`industry-mix-grid`); merge the two city sections into one with a best/worst-city highlight; fold the business-formation-costs block into the set-up cost block's slot; reorder the page to the spec's running order; cut the "what it is known for" read. Touches `page.tsx`, the city components, and `COUNTRY_PAGE_SECTIONS` (drop `industry-mix-grid`).
- **Sub-project 3, the set-up cost block:** corporate/business tax + days-and-cost-to-register + payroll taxes as a prominent early block (`CountryTaxReality` reshaped), sales tax demoted, a down-link to a business page instead of a worked example.
- **Sub-project 4, data-phase fills:** modeled friction + survival board rows, minimum wage, and an ease-of-doing-business rank, each rendering only when its sourced/modeled data lands (the slots are fixed by sub-projects 1-3).

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-09-country-page-reform-board.md`. Two execution options:

1. **Subagent-Driven (recommended)** - dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - execute the tasks in this session with checkpoints for review.

Which approach?
