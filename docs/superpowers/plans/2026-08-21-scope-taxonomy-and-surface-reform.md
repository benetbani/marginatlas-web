# Scope, Taxonomy and Surface Reform — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the atlas down to the businesses it should actually cover, collapse the over-split activity list, put one type ladder and one width rule across the whole site, and build the specialised per-trade sections that make a page feel like it was written by someone who knows the trade.

---

## STATUS

| Phase | State | Evidence |
|---|---|---|
| **0 — See it before you touch it** | **DONE** | `docs/loop/artifacts/before-london-restaurants/` , both widths plus `FINDINGS.md`. The review tool is built and gated (`build-compare`) |
| **1 — Scope** | **DONE, awaiting founder review** | 243 activities to **184**. 59 retired behind 308s, 13 redirect chains collapsed. `docs/loop/artifacts/scope-phase1/` |
| **2 — Taxonomy merge** | **DONE, awaiting founder review** | 184 to **138 published, 128 shown**. 46 merges. Directory 4,252px to 3,612px. **NEW FINDING: the SECTORS are now the problem**, see below |
| **3 — Presence threshold** | **DONE, mechanism only** | The machine found: the cell lookup never returns null, it fabricates. Threshold built, wired, gated, and **FAILS OPEN** (the plan had this backwards). Manifest UNGENERATED, so behaviour is unchanged until a reachable database generates it |
| 4 — Type ladder | not started | measured: 9.5px to 86px, ~25 sizes, two ladders |
| 5 — Width | not started | measured: 32 Full against 2 Narrow, middle tier unused |
| 6 — Specialised sections | not started | **cap the page at 24 sections**, see the phase note |
| 7 — Onward navigation | not started | |
| 8 — Industry page | not started | |

**Chain: 110/110.** Started at 105; Phases 0 to 2 added `build-compare`, `scope-rules`, `retired-activities`, `activity-merges` and `presence-threshold`.

**A PHASE 2 FINDING THAT NEEDS ITS OWN WORK, and is deliberately not folded in.** Cutting and merging the activities has left the **sector headings** as the visible defect. Twenty headings now carry 128 trades, and several carry almost nothing: **Software & tech holds one** (game development) while Software development itself sits under Creative & media; **Real estate holds one**; **Transport holds one**; **Construction holds three** (bricklaying, plastering, tiling) while the other building trades sit under Trades & home services; and **Farming & food production contains neither farming nor food production**, only a coffee roaster and a craft brewery. This is a sector consolidation, not an activity one, and it wants deciding rather than guessing.

**Three corrections this plan has already taken from contact with the code**, each recorded at the point it bit: there is **no vitest** in this repository; the trade page has **21 sections, not 7**; and the taxonomy JSON is an **object with an `industries` array**, not a bare array.

**A NEW WORKSTREAM ARRIVED 2026-08-21, mid-Phase-1**, and is deliberately NOT folded into this plan: site-wide UX, accounts and sign-in, and what a paying reader gets. It is a different kind of work (product surface and state, not catalogue and layout) and it wants its own plan. Named here so it is not lost.

**Architecture:** Eight phases, strictly ordered so that destructive structural work happens *before* any per-page polish (never polish a page you are about to delete). Phases 1–3 shrink and gate the catalogue. Phases 4–5 are site-wide design ladders that every later phase inherits. Phases 6–8 add surface. Every phase ends with a rendered before/after file the founder opens.

**Tech Stack:** Next.js 15.5, React 19.2, TypeScript 5, Tailwind 3.4, Supabase. Rendering harness: `scripts/serve_shot.mjs` + Playwright MCP. Gate chain: `npm run prebuild:serial`.

> **CORRECTED IN PHASE 0 — THERE IS NO VITEST IN THIS REPOSITORY.** The first draft of this plan wrote its tests in vitest. There is no test runner here at all: a test is a plain TypeScript file run with `npx tsx`, using a `failed` counter, one `console.log` per check, and `process.exit(failed === 0 ? 0 : 1)`. It becomes real by being registered in the `GATES` array in `scripts/prebuild_all.ts`. `tests/lib/strip_comments.test.ts` is the reference shape; `tests/scripts/build_compare.test.ts` was written against it in Phase 0. **Every "write the failing test" step below means that shape, not vitest.** Adding a test runner to land one file would be a larger change than the thing being tested.
>
> Two consequences that are easy to miss: a test file nothing runs is not coverage, so **registering it is part of done**; and after registering one, run `npx tsx scripts/counts.ts --write`, or the `counts-fresh` gate fails the chain on a stale number.

---

## Global Constraints

Every task's requirements implicitly include this section. Copied verbatim from the ratified rules and the 2026-08-21 founder interview.

- **Never push.** The founder pushes. This has held for 87 commits.
- **Never deploy**, never run `npm run build`, never touch Vercel.
- **Never raise a ratchet baseline** to make a gate pass.
- **Never fabricate a figure.** Replace, never cut (2026-08-21 ruling R1).
- **Never touch the homepage H1.** Locked.
- **No URL slug renames.** A retired slug becomes a 301 redirect, never a rename.
- **No em-dashes in user-visible copy.** Gate: `verify_no_em_dashes`.
- **No source-agency names in copy.** Gate: `verify_no_source_agencies`.
- **Tokens only** in components: no raw hex, px or ms.
- **Palette:** terracotta `#fb8469` plus cool neutrals. ONE accent. No green, no amber, no brown, no cream.
- **Typefaces:** Geist + Space Grotesk, Geist Mono for figures at weight 500.
- **Marks:** no visible mark on a Figure. A Band whose shape came from a *formula* carries one; a Band built from real firms does not (2026-08-21 ruling R2).
- **Bash CWD resets to `E:\atlas`.** Prefix every command with `cd /e/atlas/website`.
- **Screenshots land in `E:\atlas`**, the parent repo, not where you asked.
- **Reload after every resize** or the measured height is fiction.
- **Compile the stylesheet AFTER writing the file**, never before.
- **Use the Write/Edit tools for anything containing a regex.** Shell-quoted `node -e` eats backslashes.
- `.mcp.json` is intentionally dirty. Never commit it.

### The illustrative-content rule — READ THIS BEFORE PHASE 6

The founder said: *"you don't even need to bother with real data, it is all about design, functionality, surface, ease of use."* That collides with "never fabricate a figure." **The resolution, and it is not negotiable:**

> A new section is built and reviewed **in the workshop** (`/dev/*`, robots-disallowed, no public URL) with content clearly marked illustrative. It reaches a **reader-facing** page only when a real source exists for it.

This gives the founder the thing he wants (he can SEE the design and judge it) and ships nothing false. Any task that mounts a new section on a reader-facing route without a real source is a **plan violation** and must be rejected at review.

---

## The standing quality gate — every task runs this before it commits

This is the loop's quality check. A task that cannot produce all five lines is not done.

```bash
cd /e/atlas/website
npx tsc --noEmit                 # must be silent
npm run prebuild:serial          # must read 105/105 or higher, exit 0
git diff --stat                  # the files you touched, and only those
node scripts/loop_status.mjs     # the readiness ledger, unchanged or better
```

Plus, for any task that changes something a visitor can see:

```bash
cd /e/atlas/website
node scripts/shoot.mjs scratchpad/shot-<task-id> 8899
# then, with the Playwright MCP:
#   browser_resize 1280x900 -> browser_navigate <url> -> browser_take_screenshot type:jpeg
#   browser_resize 375x812  -> browser_navigate <url> AGAIN -> screenshot
```

**Three rules for the gate:**
1. A gate count that reads **lower** than 105 means a gate went missing. Stop and find it. Do not proceed.
2. If a gate fails, check whether the failing file is one you touched before reporting it red.
3. **Green means a gate ran, not that the site is correct.** Several gates in this chain have been measured lying. The screenshot is the authority on anything visual.

---

## File structure — what gets created and what each thing owns

| Path | Responsibility | Phase |
|---|---|---|
| `src/lib/taxonomy/scope_rules.ts` | The four scope tests, as pure predicates. The single answer to "does this business belong on this site" | 1 |
| `src/lib/taxonomy/retired.ts` | Every retired activity id, its reason, and its redirect target. The permanent record | 1, 2 |
| `src/lib/taxonomy/merges.ts` | Merge map: retired id to surviving id, with the SEO redirect | 2 |
| `src/middleware.ts` (modify) | Serve 301s for retired and merged slugs | 1, 2 |
| `src/lib/taxonomy/presence.ts` | The existence threshold: may this activity be shown for this country at all | 3 |
| `src/app/globals.css` (modify) | The one type ladder and the one prose measure, as tokens | 4, 5 |
| `src/styles/atlas-spine.css` (modify) | Same ladder, so the two stylesheets stop disagreeing | 4 |
| `scripts/verify_type_ladder.ts` | Gate: no font-size outside the ladder | 4 |
| `scripts/verify_width_earned.ts` | Gate: a Full-width section must contain a chart, table, map or 3-plus grid | 5 |
| `src/components/kit/trade/*` | The new specialised sections, one file each | 6 |
| `src/lib/cells/trade_profile.ts` | Which specialised sections a given trade gets, and in what order | 6 |
| `src/components/kit/OnwardRail.tsx` | The four-plus-one onward navigation | 7 |
| `src/lib/page-layout/section-order.ts` (modify) | The reordered cell page contract | 6, 7 |

---

# PHASE 0 — See it before you touch it

**Why first:** The founder's own answer to the last interview question. Neither of us has looked at the exemplar page in this state. Everything downstream is guesswork until we have.

### Task 0.1: Photograph the London restaurant page as it stands

**Files:**
- Create: `docs/loop/artifacts/BEFORE-london-restaurants-1280.jpeg`
- Create: `docs/loop/artifacts/BEFORE-london-restaurants-375.jpeg`

**Interfaces:**
- Produces: the visual baseline every later phase compares against. Referred to below as **the baseline shots**.

- [ ] **Step 1: Render the route**

```bash
cd /e/atlas/website
npx tsx --env-file=.env.local --require ./scripts/spikes/stub_next_font.cjs \
  scripts/spikes/render_home_to_scratch.tsx scratchpad/shot-000 \
  "[country]/[geo]/[industry]/page" '{"country":"gb","geo":"london","industry":"restaurants"}'
```

Expected: exits 0, writes `scratchpad/shot-000/home.html`.

- [ ] **Step 2: Compile the stylesheet AFTER the render, then append the spine sheet**

```bash
cd /e/atlas/website
npx tailwindcss -i src/app/globals.css -o scratchpad/shot-000/site.css --minify
cat src/styles/atlas-spine.css >> scratchpad/shot-000/site.css
```

Expected: `site.css` exists and is non-empty. If it has zero `.av2` rules, the append failed and every spine measurement below will be wrong.

- [ ] **Step 3: Serve it**

```bash
cd /e/atlas/website
node scripts/shoot.mjs scratchpad/shot-000 8899
```

Expected: prints `URL http://127.0.0.1:8899/`.

- [ ] **Step 4: Shoot both widths with the Playwright MCP**

`browser_resize` 1280x900, `browser_navigate` the URL, `browser_take_screenshot` with `type: "jpeg"`. Then `browser_resize` 375x812 and **navigate again** before the second shot. A bare resize lies about height.

- [ ] **Step 5: Move the shots out of the parent repo and commit**

The files land in `E:\atlas`, not here.

```bash
cd /e/atlas/website
mv /e/atlas/*.jpeg docs/loop/artifacts/ 2>/dev/null || true
git add docs/loop/artifacts/
git commit -m "baseline: the London restaurant page as it stands, 1280 and 375"
```

### Task 0.2: Build the before/after viewer the founder opens

**Files:**
- Create: `scripts/build_compare.mjs`

**Interfaces:**
- Consumes: two directories of shots.
- Produces: `compare(beforeDir, afterDir, outFile)` writing one self-contained HTML file. Every later phase calls this.

**Why this is a task and not a step:** the founder's chosen review format is "one file I open, before and after, full length, desktop and phone." Building it once means eight phases do not each improvise it.

- [ ] **Step 1: Write the failing test**

Create `tests/scripts/build_compare.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildCompareHtml } from "../../scripts/build_compare.mjs";

describe("buildCompareHtml", () => {
  it("embeds both images as data URIs so the file opens with no server", () => {
    const html = buildCompareHtml({
      title: "test",
      pairs: [{ label: "desktop", before: "AAA", after: "BBB" }],
    });
    expect(html).toContain("data:image/jpeg;base64,AAA");
    expect(html).toContain("data:image/jpeg;base64,BBB");
    expect(html).not.toContain("<img src=\"/");
  });

  it("renders one row per pair", () => {
    const html = buildCompareHtml({
      title: "t",
      pairs: [
        { label: "desktop", before: "A", after: "B" },
        { label: "phone", before: "C", after: "D" },
      ],
    });
    expect(html.match(/class="pair"/g)).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
cd /e/atlas/website && npx vitest run tests/scripts/build_compare.test.ts
```

Expected: FAIL, cannot resolve `build_compare.mjs`.

- [ ] **Step 3: Write it**

Create `scripts/build_compare.mjs`:

```js
#!/usr/bin/env node
/**
 * build_compare , one self-contained HTML file showing before against after.
 *
 * WHY: the founder's chosen review format. He opens a file; there is no server,
 * no install and nothing to log into. Images are embedded as data URIs for
 * exactly that reason: a file referencing /shots/a.jpeg is a file that shows
 * broken images the moment it is moved or emailed.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function buildCompareHtml({ title, pairs }) {
  const rows = pairs
    .map(
      (p) => `<div class="pair">
      <h2>${p.label}</h2>
      <div class="cols">
        <figure><figcaption>Before</figcaption><img alt="before ${p.label}" src="data:image/jpeg;base64,${p.before}"></figure>
        <figure><figcaption>After</figcaption><img alt="after ${p.label}" src="data:image/jpeg;base64,${p.after}"></figure>
      </div>
    </div>`,
    )
    .join("\n");
  return `<!doctype html><meta charset="utf-8"><title>${title}</title>
<style>
  :root{color-scheme:light}
  body{margin:0;background:#f7f7f8;color:#161616;
       font:14px/1.5 ui-sans-serif,system-ui,sans-serif}
  header{position:sticky;top:0;background:#fff;border-bottom:1px solid #e3e3e3;
         padding:14px 20px;font-weight:600;z-index:2}
  .pair{padding:20px}
  .pair h2{font-size:15px;font-weight:600;margin:0 0 10px;letter-spacing:-.01em}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
  figure{margin:0;background:#fff;border:1px solid #e3e3e3;border-radius:8px;overflow:hidden}
  figcaption{padding:7px 10px;font-size:11px;font-weight:600;letter-spacing:.1em;
             text-transform:uppercase;color:#6b6b6b;border-bottom:1px solid #e3e3e3}
  img{display:block;width:100%;height:auto}
  @media(max-width:900px){.cols{grid-template-columns:1fr}}
</style>
<header>${title}</header>
${rows}`;
}

const b64 = (p) => readFileSync(p).toString("base64");

/* CLI: node scripts/build_compare.mjs <beforeDir> <afterDir> <outFile> "<title>" */
if (process.argv[1] && process.argv[1].endsWith("build_compare.mjs")) {
  const [beforeDir, afterDir, outFile, title = "before / after"] = process.argv.slice(2);
  const names = readdirSync(beforeDir).filter((f) => /\.jpe?g$/i.test(f)).sort();
  const pairs = names.map((n) => ({
    label: n.replace(/\.jpe?g$/i, ""),
    before: b64(join(beforeDir, n)),
    after: b64(join(afterDir, n)),
  }));
  writeFileSync(outFile, buildCompareHtml({ title, pairs }));
  console.log("wrote " + outFile + "  (" + pairs.length + " pairs)");
}
```

- [ ] **Step 4: Run the test and watch it pass**

```bash
cd /e/atlas/website && npx vitest run tests/scripts/build_compare.test.ts
```

Expected: 2 passed.

- [ ] **Step 5: Standing gate, then commit**

```bash
cd /e/atlas/website
npx tsc --noEmit && npm run prebuild:serial
git add scripts/build_compare.mjs tests/scripts/build_compare.test.ts
git commit -m "review: one file the founder opens, before against after, images embedded"
```

---

# PHASE 1 — SCOPE. What businesses belong on this site.

**The founder's ruling, verbatim in substance:** *"we hunt for businesses that can be seen on the street, and you slap grain farming, all farming is not allowed, banking, financial trading, factories, etc. If a business needs 30m to open, we don't put it on our site."* Plus: consulting is out (*"we do not calculate Deloitte and McKinsey revenue here"*), and hospitals and high schools are out (*"nobody thinks of opening a school randomly"*).

**Measured starting point: 243 activities across 25 sectors.** The first five rows of the file are grain farming, fruit farming, livestock, fishing and forestry. The complaint lands on line one.

**Target after this phase: roughly 180.**

### Task 1.1: Write the scope rules as four checkable tests

**Files:**
- Create: `src/lib/taxonomy/scope_rules.ts`
- Test: `tests/lib/taxonomy/scope_rules.test.ts`

**Interfaces:**
- Produces: `isInScope(activity: ScopeInput): ScopeVerdict` where
  `ScopeInput = { id: string; name: string; sector_id: string }` and
  `ScopeVerdict = { inScope: boolean; failed: ScopeTest[] }`,
  `ScopeTest = "street" | "owner" | "capital" | "local-customer"`.
  Phase 2 and Phase 3 both import `isInScope`.

- [ ] **Step 1: Write the failing test**

Create `tests/lib/taxonomy/scope_rules.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { isInScope } from "../../../src/lib/taxonomy/scope_rules";

describe("isInScope", () => {
  it("keeps a business a passer-by can walk into", () => {
    const v = isInScope({ id: "restaurants", name: "Restaurants", sector_id: "food_drink" });
    expect(v.inScope).toBe(true);
    expect(v.failed).toEqual([]);
  });

  it("rejects all farming", () => {
    expect(isInScope({ id: "grain_farming", name: "Grain farming", sector_id: "farming_food_production" }).inScope).toBe(false);
    expect(isInScope({ id: "livestock_farming", name: "Livestock farming", sector_id: "farming_food_production" }).inScope).toBe(false);
  });

  it("rejects banking and financial trading", () => {
    expect(isInScope({ id: "banking", name: "Banking", sector_id: "finance_corp" }).inScope).toBe(false);
    expect(isInScope({ id: "securities", name: "Securities & brokerage", sector_id: "finance_corp" }).inScope).toBe(false);
  });

  it("rejects factories and heavy industry", () => {
    const v = isInScope({ id: "aerospace", name: "Aerospace & other transport mfg", sector_id: "heavy_industry" });
    expect(v.inScope).toBe(false);
    expect(v.failed).toContain("local-customer");
  });

  it("rejects hospitals and schools nobody opens on a whim", () => {
    expect(isInScope({ id: "hospitals", name: "Hospitals", sector_id: "higher_ed_hospitals" }).inScope).toBe(false);
    expect(isInScope({ id: "higher_education", name: "Higher education", sector_id: "higher_ed_hospitals" }).inScope).toBe(false);
    expect(isInScope({ id: "primary_secondary", name: "Primary & secondary schools", sector_id: "education_instruction" }).inScope).toBe(false);
  });

  it("rejects management consulting but keeps the sole-practitioner accountant", () => {
    expect(isInScope({ id: "management_consulting", name: "Management consulting", sector_id: "professional_services" }).inScope).toBe(false);
    expect(isInScope({ id: "sole_accountants", name: "Sole-practitioner accountants", sector_id: "professional_services" }).inScope).toBe(true);
  });

  it("keeps a small artisan workshop and rejects a primary metal plant", () => {
    expect(isInScope({ id: "cabinet_making", name: "Cabinet making", sector_id: "manufacturing_artisan" }).inScope).toBe(true);
    expect(isInScope({ id: "primary_metal", name: "Primary metal manufacturing", sector_id: "manufacturing_artisan" }).inScope).toBe(false);
  });

  it("names every test a rejected activity failed, so the record is auditable", () => {
    const v = isInScope({ id: "hospitals", name: "Hospitals", sector_id: "higher_ed_hospitals" });
    expect(v.failed.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
cd /e/atlas/website && npx vitest run tests/lib/taxonomy/scope_rules.test.ts
```

Expected: FAIL, cannot resolve `scope_rules`.

- [ ] **Step 3: Write the rules**

Create `src/lib/taxonomy/scope_rules.ts`:

```ts
/**
 * src/lib/taxonomy/scope_rules.ts
 *
 * THE SINGLE ANSWER to "does this business belong on this site".
 *
 * Founder ruling, 2026-08-21: "we hunt for businesses that can be seen on the
 * street ... all farming is not allowed, banking, financial trading, factories
 * ... If a business needs 30m to open, we don't put it on our site." Plus:
 * management consulting is out (we do not model McKinsey's revenue), and
 * hospitals and schools are out (nobody opens a school on a whim).
 *
 * FOUR TESTS. An activity stays only if it passes all four.
 *
 *   street          a passer-by can see the premises from a public street
 *   owner           one person can plausibly own and run it
 *   capital         it can open for under 30 million USD (his stated ceiling)
 *   local-customer  its customers are identifiable local people or businesses,
 *                   not a national balance sheet or a global supply chain
 *
 * WHY FOUR AND NOT ONE. The capital ceiling alone does not remove a small
 * factory, a wholesale depot or a bank branch, all of which open for far less
 * than 30 million. The local-customer test is what actually does the work on
 * those, and the street and owner tests are what remove hospitals and schools.
 * Each rejection therefore records WHICH tests it failed, so the list can be
 * argued with rather than merely obeyed.
 *
 * THIS FILE IS A LIST, DELIBERATELY. A classifier that infers scope from a name
 * would be wrong in both directions and unarguable when it was. An explicit
 * list is auditable: the founder can read it and point at a line.
 */

export type ScopeTest = "street" | "owner" | "capital" | "local-customer";

export interface ScopeInput {
  id: string;
  name: string;
  sector_id: string;
}

export interface ScopeVerdict {
  inScope: boolean;
  failed: ScopeTest[];
}

/** Whole sectors that fail on every activity inside them. */
const OUT_OF_SCOPE_SECTORS: Record<string, ScopeTest[]> = {
  finance_corp: ["street", "owner", "local-customer"],
  heavy_industry: ["street", "owner", "capital", "local-customer"],
  higher_ed_hospitals: ["owner", "capital"],
  mining_energy: ["street", "owner", "capital", "local-customer"],
  telecom_broadcasting: ["street", "owner", "capital", "local-customer"],
};

/**
 * Individual activities that fail even though their sector survives. Keyed by
 * the activity NAME as it appears in industries.json, because ids in that file
 * are not stable across the merge in Phase 2 and a name is what a human reads.
 */
const OUT_OF_SCOPE_NAMES: Record<string, ScopeTest[]> = {
  // All farming. Commodity output, no walk-in customer, no street presence.
  "Grain farming": ["street", "local-customer"],
  "Vegetable & fruit farming": ["street", "local-customer"],
  "Livestock farming": ["street", "local-customer"],
  "Fishing & aquaculture": ["street", "local-customer"],
  "Forestry & logging": ["street", "local-customer"],

  // Production at scale. A retail bakery stays; a food plant does not.
  "Food manufacturing": ["street", "local-customer"],
  "Beverage manufacturing": ["street", "local-customer"],
  "Specialty food production": ["street", "local-customer"],
  "Artisan bakery (wholesale)": ["street", "local-customer"],
  "Textiles & fabric manufacturing": ["street", "local-customer"],
  "Apparel manufacturing": ["street", "local-customer"],
  "Wood products manufacturing": ["street", "local-customer"],
  "Paper & printing manufacturing": ["street", "local-customer"],
  "Plastics & rubber products": ["street", "local-customer"],
  "Fabricated metal manufacturing": ["street", "local-customer"],
  "Primary metal manufacturing": ["street", "capital", "local-customer"],
  "Electrical equipment": ["street", "local-customer"],
  "Furniture manufacturing": ["street", "local-customer"],
  "Miscellaneous manufacturing": ["street", "local-customer"],

  // Wholesale. No walk-in customer by definition.
  "Wholesale food & beverages": ["street", "local-customer"],
  "Wholesale durable goods": ["street", "local-customer"],
  "General wholesale": ["street", "local-customer"],

  // Construction at development scale. The trades below it survive.
  "Residential construction": ["street", "capital"],
  "Commercial construction": ["street", "capital"],
  "Civil engineering": ["street", "capital"],
  "Real estate leasing": ["street", "capital"],

  // Schools nobody opens on a whim. Tutoring, language and driving schools stay.
  "Primary & secondary schools": ["owner", "capital"],
  "Private K-12 schools (small)": ["owner", "capital"],

  // Consulting at a scale this atlas cannot model.
  "Management consulting": ["street", "local-customer"],

  // Transport at network scale. Couriers and sightseeing survive.
  "Trucking & freight": ["street", "local-customer"],
  "Transit & ground passenger transport": ["street", "owner", "capital"],
  "Transport support services": ["street", "local-customer"],
  "Warehousing & storage": ["street", "local-customer"],
  "Postal service": ["owner", "capital", "local-customer"],
  "Air transportation carriers": ["street", "owner", "capital", "local-customer"],
  "Rail transportation": ["street", "owner", "capital", "local-customer"],
  "Water transportation": ["street", "owner", "capital", "local-customer"],
  "Pipeline transportation": ["street", "owner", "capital", "local-customer"],

  // Utilities and waste at municipal scale.
  "Water & waste management": ["street", "owner", "capital"],

  // Sells to nobody who walks past it.
  "E-commerce & mail-order": ["street"],
};

export function isInScope(a: ScopeInput): ScopeVerdict {
  const bySector = OUT_OF_SCOPE_SECTORS[a.sector_id];
  if (bySector) return { inScope: false, failed: bySector };

  const byName = OUT_OF_SCOPE_NAMES[a.name];
  if (byName) return { inScope: false, failed: byName };

  return { inScope: true, failed: [] };
}

/** Every activity name this module rejects, for the retirement record. */
export function rejectedNames(): string[] {
  return Object.keys(OUT_OF_SCOPE_NAMES);
}

/** Every sector id this module rejects wholesale. */
export function rejectedSectors(): string[] {
  return Object.keys(OUT_OF_SCOPE_SECTORS);
}
```

- [ ] **Step 4: Run the test and watch it pass**

```bash
cd /e/atlas/website && npx vitest run tests/lib/taxonomy/scope_rules.test.ts
```

Expected: 8 passed.

- [ ] **Step 5: Print the actual damage before believing any of it**

```bash
cd /e/atlas/website && npx tsx -e "
import { isInScope } from './src/lib/taxonomy/scope_rules';
const inds = require('./src/lib/taxonomy/industries.json');
const out = inds.filter((i:any)=>!isInScope(i).inScope);
console.log('retired:', out.length, 'of', inds.length, '-> keeping', inds.length-out.length);
const bySec:Record<string,number>={};
out.forEach((i:any)=>{bySec[i.sector_id]=(bySec[i.sector_id]||0)+1;});
console.log(bySec);
"
```

Expected: retired count between 50 and 65, keeping roughly 180. **If it retires more than 80, a sector rule is too broad. Stop and read the list before continuing.**

- [ ] **Step 6: Commit**

```bash
cd /e/atlas/website
git add src/lib/taxonomy/scope_rules.ts tests/lib/taxonomy/scope_rules.test.ts
git commit -m "scope: the four tests that decide whether a business belongs on this site"
```

### Task 1.2: Retire the out-of-scope activities, with redirects, not deletions

**Files:**
- Create: `src/lib/taxonomy/retired.ts`
- Modify: `src/middleware.ts`
- Test: `tests/lib/taxonomy/retired.test.ts`

**Interfaces:**
- Consumes: `isInScope` from Task 1.1.
- Produces: `RETIRED: Record<string, { reason: string; redirectTo: string | null }>` keyed by activity slug. Task 2.2 extends the same map.

**Why redirects and not deletions:** the founder named SEO as his fear. A retired page that 404s loses whatever authority it had and produces a crawl error. A retired page that 301s to its sector hands that authority to a page that still exists. **No slug is ever renamed** — the retired slug keeps existing as a redirect.

- [ ] **Step 1: Write the failing test**

Create `tests/lib/taxonomy/retired.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { RETIRED, redirectFor } from "../../../src/lib/taxonomy/retired";

describe("retired activities", () => {
  it("every retired entry carries a reason a human can read", () => {
    for (const [slug, e] of Object.entries(RETIRED)) {
      expect(e.reason.length, slug).toBeGreaterThan(10);
    }
  });

  it("every retired entry redirects somewhere that is not itself", () => {
    for (const [slug, e] of Object.entries(RETIRED)) {
      expect(e.redirectTo, slug).toBeTruthy();
      expect(e.redirectTo, slug).not.toBe("/industries/" + slug);
    }
  });

  it("resolves a redirect for a retired slug and null for a live one", () => {
    const anyRetired = Object.keys(RETIRED)[0];
    expect(redirectFor(anyRetired)).toBeTruthy();
    expect(redirectFor("restaurants")).toBeNull();
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
cd /e/atlas/website && npx vitest run tests/lib/taxonomy/retired.test.ts
```

Expected: FAIL, cannot resolve `retired`.

- [ ] **Step 3: Generate the retirement record from the rules, then hand-check it**

```bash
cd /e/atlas/website && npx tsx scripts/gen_retired.ts
```

Create `scripts/gen_retired.ts` first:

```ts
/**
 * Generates src/lib/taxonomy/retired.ts from scope_rules. Generated rather than
 * hand-written because a hand-written list of sixty slugs drifts from the rules
 * that produced it within one tick. Re-run it whenever scope_rules changes.
 */
import { writeFileSync } from "node:fs";
import { isInScope } from "../src/lib/taxonomy/scope_rules";
import inds from "../src/lib/taxonomy/industries.json";

/* Task 2.2 extends this: a MERGED activity redirects to its survivor's page,
   which is a genuinely better destination. A SCOPE-retired activity has no
   survivor by definition, so it goes to the activity index. Do not invent a
   nearer destination for it: sending a reader to a sector page that no longer
   lists the thing they asked for is worse than sending them to the index. */
const rows: string[] = [];
for (const i of inds as any[]) {
  const v = isInScope(i);
  if (v.inScope) continue;
  const target = "/industries";
  rows.push(
    `  ${JSON.stringify(i.id)}: { reason: ${JSON.stringify(
      "out of scope: fails " + v.failed.join(", "),
    )}, redirectTo: ${JSON.stringify(target)} },`,
  );
}

writeFileSync(
  "src/lib/taxonomy/retired.ts",
  `/**
 * src/lib/taxonomy/retired.ts , GENERATED by scripts/gen_retired.ts.
 *
 * Every activity retired from the atlas, why, and where its URL now sends a
 * reader. NOTHING IS DELETED: a retired slug keeps existing and answers 301,
 * because a 404 throws away whatever search authority the page had and adds a
 * crawl error on top. Slug renames are banned; this is the sanctioned way to
 * remove an activity.
 *
 * Do not hand-edit. Change src/lib/taxonomy/scope_rules.ts and re-run the
 * generator, or the list and the rules that made it drift apart.
 */

export interface RetiredEntry {
  reason: string;
  redirectTo: string;
}

export const RETIRED: Record<string, RetiredEntry> = {
${rows.join("\n")}
};

export function redirectFor(slug: string): string | null {
  return RETIRED[slug]?.redirectTo ?? null;
}
`,
);
console.log("wrote src/lib/taxonomy/retired.ts with " + rows.length + " entries");
```

- [ ] **Step 4: Read the generated list end to end**

```bash
cd /e/atlas/website && grep -c ": {" src/lib/taxonomy/retired.ts && grep -oE '^\s+"[a-z0-9_]+"' src/lib/taxonomy/retired.ts | tr -d ' "'
```

**This step is not optional and it is not a formality.** Read every line. A wrongly retired activity is a page the founder wanted, silently gone. If any line looks wrong, fix `scope_rules.ts` and regenerate; never hand-edit the output.

- [ ] **Step 5: Wire the redirects into middleware**

Read `src/middleware.ts` first and follow its existing matcher pattern. Add, before the country-slug branch:

```ts
import { redirectFor } from "@/lib/taxonomy/retired";

// Retired activities answer 301, never 404. See src/lib/taxonomy/retired.ts.
const industryMatch = /^\/industries\/([a-z0-9-]+)\/?$/.exec(url.pathname);
if (industryMatch) {
  const target = redirectFor(industryMatch[1]);
  if (target) return NextResponse.redirect(new URL(target, request.url), 301);
}
```

- [ ] **Step 6: Run the tests and the standing gate**

```bash
cd /e/atlas/website
npx vitest run tests/lib/taxonomy/retired.test.ts
npx tsc --noEmit && npm run prebuild:serial
```

Expected: 3 passed; tsc silent; 105/105.

- [ ] **Step 7: Commit**

```bash
cd /e/atlas/website
git add src/lib/taxonomy/retired.ts scripts/gen_retired.ts tests/lib/taxonomy/retired.test.ts src/middleware.ts
git commit -m "scope: retire the businesses nobody opens on a street, with 301s not 404s"
```

### Task 1.3: Stop the retired activities being listed anywhere

**Files:**
- Modify: `src/app/industries/page.tsx`
- Modify: `src/lib/taxonomy.ts`
- Create: `scripts/verify_scope_respected.ts`

**Interfaces:**
- Consumes: `RETIRED` from Task 1.2.
- Produces: gate `scope-respected`, registered in `scripts/prebuild_all.ts`.

- [ ] **Step 1: Add the filter at the source, not at each call site**

In `src/lib/taxonomy.ts`, find the exported accessor that returns all industries and filter `RETIRED` out of it there. One filter at the source beats fourteen at the call sites, and it is the only version that cannot be forgotten by a new page.

- [ ] **Step 2: Write the gate**

Create `scripts/verify_scope_respected.ts`. It must assert: no retired activity id appears in any rendered listing. Render `/industries` with `react-dom/server` and assert zero retired ids in the markup. **Assert on the rendered tree, not on the source** — a gate that passes because a file mentions the right word is the failure mode this chain has already been caught with twice.

- [ ] **Step 3: Register it**

Add to the `GATES` array in `scripts/prebuild_all.ts`:

```ts
{ name: "scope-respected", script: "scripts/verify_scope_respected.ts" },
```

- [ ] **Step 4: Negative-test the gate**

Temporarily re-add one retired id to the listing, run the gate, confirm it FAILS, then revert. **A gate never negative-tested is a gate that has never been shown to be able to fail.**

```bash
cd /e/atlas/website && npx tsx scripts/verify_scope_respected.ts
```

- [ ] **Step 5: Standing gate and commit**

```bash
cd /e/atlas/website
npx tsc --noEmit && npm run prebuild:serial   # now 106/106
git add src/lib/taxonomy.ts src/app/industries/page.tsx scripts/verify_scope_respected.ts scripts/prebuild_all.ts
git commit -m "scope: one filter at the source, and a gate that reads the rendered page"
```

### Task 1.4: Show the founder the shorter list

- [ ] **Step 1:** Render `/industries` before and after (`git stash` is BANNED; use a second worktree or shoot the previous commit).
- [ ] **Step 2:** `node scripts/build_compare.mjs <before> <after> docs/loop/artifacts/COMPARE-scope.html "The business list, before and after the scope rules"`
- [ ] **Step 3:** Send him the file. Report in plain language: how many businesses were listed before, how many now, and name the categories that left. **No file paths, no function names, no line numbers.**

---

# PHASE 2 — TAXONOMY. Collapse the over-split list.

**The founder's ruling:** *"the types of businesses is too much ... lingerie & intimates fall in the category of clothing. The issue is long term SEO/AEO ... Right now the scroll on business list is toooo much."*

**Measured:** there are **literal duplicates** in the file today. `Plumbers` and `Plumbing services`. `Roofers` and `Roofing services`. `Painters (residential)` and `Painting services`. `Carpenters & finish work` and `Carpentry services`. `Landscaping & lawn care` and `Landscaping services`. `Indie bookstores` and `Book retailing`. `Museums & cultural` and `Small museums`. `Craft breweries & taprooms` and `Breweries & taprooms (retail)`, in two different sectors.

**Target after this phase: fewer than 130 activities.**

### Task 2.1: Merge map, duplicates first

**Files:**
- Create: `src/lib/taxonomy/merges.ts`
- Test: `tests/lib/taxonomy/merges.test.ts`

**Interfaces:**
- Produces: `MERGES: Record<string, string>` mapping a retired activity id to its surviving id, and `survivorOf(id: string): string`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { MERGES, survivorOf } from "../../../src/lib/taxonomy/merges";
import inds from "../../../src/lib/taxonomy/industries.json";

const ids = new Set((inds as any[]).map((i) => i.id));

describe("merge map", () => {
  it("every survivor is a real activity", () => {
    for (const [from, to] of Object.entries(MERGES)) {
      expect(ids.has(to), from + " -> " + to).toBe(true);
    }
  });

  it("no merge chains: a survivor is never itself merged away", () => {
    for (const to of Object.values(MERGES)) {
      expect(MERGES[to], to + " is both a survivor and merged away").toBeUndefined();
    }
  });

  it("no activity merges into itself", () => {
    for (const [from, to] of Object.entries(MERGES)) expect(from).not.toBe(to);
  });

  it("collapses the founder's own example", () => {
    expect(survivorOf("lingerie_intimates")).toBe("clothing_stores");
  });

  it("returns the id unchanged for an activity that survives", () => {
    expect(survivorOf("restaurants")).toBe("restaurants");
  });
});
```

- [ ] **Step 2: Run it, watch it fail, then write the map**

The map is written **by hand and by family**, in this order. Do the literal duplicates first: they are unarguable and they build the harness the judgement calls run through.

Families to collapse, with the survivor named:

| Family | Collapses | Survivor |
|---|---|---|
| Literal duplicates | Plumbing services, Roofing services, Painting services, Carpentry services, Landscaping services, Book retailing, Small museums, Breweries & taprooms (retail) | Plumbers, Roofers, Painters (residential), Carpenters & finish work, Landscaping & lawn care, Indie bookstores, Museums & cultural, Craft breweries & taprooms |
| Clothing (**his example**) | Clothing boutiques, Streetwear & casual apparel, Designer fashion, Children's & maternity clothing, **Lingerie & intimates**, Vintage & consignment, Shoe stores | Clothing & shoe stores |
| Restaurants | Sit-down restaurants, Fast-casual restaurants, Pizzerias, Chicken shops | Restaurants |
| Bakery | Cake shops & patisseries, Pastry & dessert shops | Bakeries (retail) |
| Bars | Wine bars, Pubs & taverns | Bars & nightclubs |
| Salon | Hair salons (full service), Hairdressers & beauty | Barbershops **or** a new `hair_salons` survivor, per rulebook rule 32 which names "salon" |
| Spa | Med spas (small), Massage therapy clinics | Day spas |
| Jewellery | Watch shops | Jewelry stores |
| Legal | Sole-practitioner law firms | Legal services |
| Accounting | Sole-practitioner accountants | Accounting & tax |
| Cleaning | Residential cleaning services, Cleaning: carpet & upholstery, Cleaning: building & industrial | Cleaning services |
| HVAC | Air conditioning & refrigeration | HVAC services |
| Pharmacy | Independent pharmacies | Pharmacies & health stores |
| Software | Web & mobile dev shops, Custom software / contract dev, IT services & MSPs (small) | Software development / IT services & hosting |
| Lodging | Independent hotels & inns, Bed & breakfasts, Guest houses & pensions | Hotels & lodging |

**Judgement rule when choosing the survivor:** keep the id a person would type and a search engine already knows. Never invent a new id where a good one exists, because a new id is a new URL and the founder named SEO as his fear.

- [ ] **Step 3: Run the tests**

```bash
cd /e/atlas/website && npx vitest run tests/lib/taxonomy/merges.test.ts
```

Expected: 5 passed. **The no-chains test is the one that matters** — a merge chain silently sends a reader two hops and search engines treat a chain as a soft 404.

- [ ] **Step 4: Commit**

```bash
cd /e/atlas/website
git add src/lib/taxonomy/merges.ts tests/lib/taxonomy/merges.test.ts
git commit -m "taxonomy: collapse the duplicates and the over-split families onto one survivor each"
```

### Task 2.2: Redirect merged slugs and fold them into the retirement record

**Files:**
- Modify: `src/lib/taxonomy/retired.ts` (via the generator)
- Modify: `scripts/gen_retired.ts`
- Modify: `src/lib/taxonomy.ts`

- [ ] **Step 1:** Extend `gen_retired.ts` so a merged id redirects to `/industries/<survivor>`, not to the sector index. A merged activity has a genuinely better destination than a retired one and must get it.
- [ ] **Step 2:** Regenerate, then assert every merged slug resolves to a live page:

```bash
cd /e/atlas/website && npx tsx scripts/gen_retired.ts && npx tsx -e "
import { RETIRED } from './src/lib/taxonomy/retired';
import { MERGES } from './src/lib/taxonomy/merges';
const bad = Object.keys(MERGES).filter(k => !RETIRED[k]);
console.log(bad.length ? 'MERGED BUT NOT REDIRECTED: ' + bad.join(', ') : 'every merged slug redirects');
"
```

Expected: `every merged slug redirects`.

- [ ] **Step 3:** Standing gate, commit.

### Task 2.3: Count it, and show him

- [ ] **Step 1:** Print the final count.

```bash
cd /e/atlas/website && npx tsx -e "
import { isInScope } from './src/lib/taxonomy/scope_rules';
import { MERGES } from './src/lib/taxonomy/merges';
const inds = require('./src/lib/taxonomy/industries.json');
const live = inds.filter((i:any)=>isInScope(i).inScope && !MERGES[i.id]);
console.log('started 243, now ' + live.length);
"
```

Expected: **under 130.** If it is above 150, the merge families were applied too timidly; go back to Task 2.1.

- [ ] **Step 2:** Re-shoot `/industries`, build the compare file, send it. Report: how long the scroll was, how long it is now.

---

# PHASE 3 — PRESENCE. The medical-equipment-in-Chad threshold.

**The founder's ruling:** *"there should be clear thresholds about not allowing certain countries to show all activities because we end up with medical equipment production in Chad (or maybe for such cases we should default to clear disclaimers that such an activity in this country barely exists)."*

He offered both answers. **Take both**, split by how much the atlas knows: hide where there is genuinely nothing, disclaim where there is a little.

### Task 3.1: The presence threshold

**Files:**
- Create: `src/lib/taxonomy/presence.ts`
- Test: `tests/lib/taxonomy/presence.test.ts`

**Interfaces:**
- Produces: `presenceOf(country: string, activity: string): "present" | "thin" | "absent"`.
  - `present` renders normally.
  - `thin` renders with a visible line saying this activity barely exists here.
  - `absent` does not render a page at all; the URL 301s to the country's activity index.

- [ ] **Step 1:** Write the failing test. It must cover all three verdicts and must assert that an unknown pair returns `absent` rather than `present` — **the safe default is to show nothing, not to show something**.
- [ ] **Step 2:** Implement on top of the existing trust gate in `src/lib/cells/trust.ts`, which already answers "may this cell's figures be printed as money". Presence is the weaker sibling question: does this activity meaningfully exist here at all. Do not duplicate the trust logic; import it.
- [ ] **Step 3:** Negative-test: assert a synthesised, tier-X, country-level read comes back `absent`.
- [ ] **Step 4:** Standing gate, commit.

### Task 3.2: The thin-market line, and where it sits

**Files:**
- Create: `src/components/kit/ThinMarketNote.tsx`
- Modify: `src/app/[country]/[geo]/[industry]/page.tsx`

**Copy, exactly, and it is not negotiable:** it must be a plain statement of fact with no hedging adverb, because vague verbal hedging costs about seven times more trust than a stated number. Draft: *"Very few businesses of this kind trade in this country. Treat the figures below as a guide to the trade, not to this market."*

- [ ] **Step 1:** Build it as a card, `position: relative`. **Anything `position: static` on this site is not drawn at all** — the fixed photograph paints over it.
- [ ] **Step 2:** Mount it directly under the hero, above the first section. A caveat below the fold is a caveat nobody reads.
- [ ] **Step 3:** Render a `thin` pair and a `present` pair and confirm the note appears on exactly one.
- [ ] **Step 4:** Standing gate, commit.

---

# PHASE 4 — THE TYPE LADDER. One scale, bounded range.

**The founder's ruling:** *"a big variability in fonts which is traumatic to the eye, the difference between H1 and the smallest font cannot be so gigantic."*

**Measured, and he is right by a distance:**

| | |
|---|---|
| Smallest type on the site | **9.5px** |
| Largest type on the site | **86px** |
| Ratio | **9.05x** |
| Distinct sizes in use | **roughly 25** |
| Ladders running at once | **two**, and they do not know about each other |

The two ladders are Tailwind's `text-*` classes and a hand-written pixel scale inside the spine stylesheet. `text-[11px]` is used 347 times, `text-[10px]` 111 times, and neither is on the declared scale, which stops at four values.

### The ladder, decided

Nine steps. The read-text range is capped at **4.4x**, down from 9.05x.

| Token | Value | Use |
|---|---|---|
| `--t-mark` | 10px | **Marks only.** Never a sentence, never a label a reader must read |
| `--t-micro` | 11px | The type floor for anything read. Axis units, chips, table column heads |
| `--t-small` | 12px | Secondary labels, captions, key halves of key/value pairs |
| `--t-body` | 13.5px | Body prose. The default |
| `--t-lead` | 15px | A lede, a card's first line |
| `--t-sub` | 18px | Subsection heading, `h3` |
| `--t-head` | 22px | Section heading, `h2` |
| `--t-focal` | 30px | A section's own focal figure |
| `--t-answer` | 48px | The page's one dominant figure, `h1`. **Nothing is larger** |

**Why 48 and not 86.** Rule 16 requires the dominant figure to be at least 1.6x any supporting stat. 48 against 30 is exactly 1.6. The extra 38 pixels bought nothing but the range the founder is complaining about. **Also:** a figure set at 4rem is a claim of importance whatever the words beside it say, so shrinking it is a content decision as much as a typographic one.

**Why 10px survives at all.** The 2026-08-21 ruling: eleven for anything a reader reads, ten for marks. This ladder is the mechanism that enforces the distinction rather than merely stating it.

### Task 4.1: Declare the ladder in both stylesheets

**Files:**
- Modify: `src/app/globals.css` (around the existing `--t-micro` block)
- Modify: `src/styles/atlas-spine.css`

- [ ] **Step 1:** Replace the four-value scale with the nine above in `globals.css`. Keep the old token names alive as aliases pointing at their nearest new step, so nothing breaks in the same commit that introduces the ladder. Removing the aliases is Task 4.4.
- [ ] **Step 2:** Declare the identical nine in `atlas-spine.css`. **They must be byte-identical values.** Two ladders that agree today and are maintained separately will disagree within a month; Task 4.2's gate is what stops that.
- [ ] **Step 3:** Compile and assert:

```bash
cd /e/atlas/website
npx tailwindcss -i src/app/globals.css -o scratchpad/ladder.css --minify
grep -oE "\-\-t-(mark|micro|small|body|lead|sub|head|focal|answer):[^;]+" scratchpad/ladder.css
```

Expected: nine lines, matching the table exactly.

- [ ] **Step 4:** Standing gate, commit.

### Task 4.2: Gate it, so the ladder cannot rot

**Files:**
- Create: `scripts/verify_type_ladder.ts`
- Modify: `scripts/prebuild_all.ts`

**Interfaces:**
- Produces: gate `type-ladder`, a **ratchet** at the current count of off-ladder sizes.

- [ ] **Step 1:** The gate scans components and both stylesheets for any `font-size` or `text-[Npx]` whose value is not on the ladder, using `scripts/lib/strip_comments` so a comment naming a size is not counted as a use. **This matters:** Tailwind's own content scan does not strip comments, and a retired utility named in prose has previously been re-emitted into the stylesheet.
- [ ] **Step 2:** Set the baseline to the measured count. **Never raise it.** The starting number will be large; that is the point of a ratchet.
- [ ] **Step 3:** Negative-test: add `text-[17px]` somewhere, confirm the gate fails, revert.
- [ ] **Step 4:** Register, standing gate, commit.

### Task 4.3: Migrate the two biggest offenders

**Files:**
- Modify: components using `text-[11px]` (347 uses) and `text-[10px]` (111 uses)

- [ ] **Step 1:** `text-[11px]` maps to `--t-micro`. It is already the floor value, so this is a naming migration with **zero pixel change**. Do it first and confirm the rendered page is byte-identical.
- [ ] **Step 2:** `text-[10px]` is the judgement call: each use is either a mark (stays at `--t-mark`) or a label a reader reads (rises to `--t-micro`). **Classify before converting.** A blind sweep either loses the distinction the ruling exists to draw, or moves 111 nodes the founder did not ask to move.
- [ ] **Step 3:** Re-shoot the exemplar page at both widths. The 11px migration must show **no visible difference**. If it does, the mapping is wrong.
- [ ] **Step 4:** Lower the ratchet baseline by the number migrated, standing gate, commit.

### Task 4.4: Bring the 86px answer down to 48, and show him

- [ ] **Step 1:** Change the answer figure's clamp to `clamp(34px, 5vw, 48px)`.
- [ ] **Step 2:** Confirm the 1.6x rule still holds against the largest supporting stat on the page, by measuring in the browser, not by reading the source.
- [ ] **Step 3:** Shoot before and after, build the compare file, send it.

**Report to him as:** the biggest text on the page used to be nine times the size of the smallest; it is now four and a half. Nothing about paths or tokens.

---

# PHASE 5 — WIDTH. Full width has to be earned.

**The founder's ruling:** *"For each subsection that currently occupies the full width there should be a check whether it actually deserves full width, full width damages readability a lot in desktop, in mobile idk it can be seen differently as treatment."* And earlier: *"some icons and sections are very wide for the eye, so the eye has to do like an angle to read all of it."*

**Measured:**

| | |
|---|---|
| Sections claiming **Full** width | **32** |
| Sections claiming **Narrow** | **2** |
| Sections using the middle tier | **0** |
| Prose capped at a fixed 672px (about 97 characters) | **142 uses** |
| Prose capped by a proper reading measure | **12 uses** |

Full width is the default, not the exception. And prose is capped eight different ways, with the wrong one winning by twelve to one.

**Interview ruling for the fix:** narrow the words, keep the pictures wide. **Two widths on one page, not one.**

### Task 5.1: One prose measure, in characters

**Files:**
- Modify: `src/app/globals.css`
- Create: `scripts/verify_prose_measure.ts`

- [ ] **Step 1:** Declare `--measure-prose: 66ch` and a `.prose-measure` utility.

**A rem or pixel cap is a width, not a measure.** `max-w-2xl` is a fixed 672px, which at this site's small type is about 97 characters. Paragraphs that already *looked* capped were the widest on the page. And **`ch` in CSS is the width of the digit zero**, not half the font size; measuring with the wrong unit overstates by about a third.

- [ ] **Step 2:** Apply it **at the section**, not at each paragraph, so a paragraph added later inherits the rule instead of needing to remember it.
- [ ] **Step 3:** Migrate the 142 `max-w-2xl` uses. Classify first: some are cards, not prose. A card is not a paragraph and must not get a reading measure.
- [ ] **Step 4:** Gate it as a ratchet on the count of competing prose caps. Register, standing gate, commit.

### Task 5.2: The full-width earning test

**Files:**
- Create: `scripts/verify_width_earned.ts`
- Modify: `scripts/prebuild_all.ts`

**The rule, stated so it is checkable:** a section may claim full width only if it contains at least one of: a chart, a table, a map, or a grid of three or more items. Everything else drops one tier.

- [ ] **Step 1:** Write the gate to assert on the **rendered tree**, not the source. It must resolve what a section actually contains, which a regex over class names cannot do.
- [ ] **Step 2:** Run it and record the count of unearned full-width sections. Expect a large number; that is the finding.
- [ ] **Step 3:** Set the ratchet at that count, register, commit the gate **before** fixing anything. A gate added after the fix cannot prove the fix worked.

### Task 5.3: Demote the unearned sections, desktop only

- [ ] **Step 1:** Work the list from the gate output. Each demotion is one section, one commit.
- [ ] **Step 2:** **Mobile is explicitly exempt.** The founder said mobile "can be seen differently as treatment". At 375 a full-width section is the only sensible treatment; the demotion applies from the tablet breakpoint upward.
- [ ] **Step 3:** After each batch of five, re-shoot at 1280 and 375 and check nothing collapsed.
- [ ] **Step 4:** Lower the ratchet, standing gate, commit.

### Task 5.4: Mobile two-up, for small number cards only

**The mandate is narrower than the complaint sounded.** In the interview he selected **small number cards only** — not the business and city cards, not label-and-figure rows, and not a site-wide rule. Build exactly that and nothing more.

- [ ] **Step 1:** Two-up the small number tiles at 375.
- [ ] **Step 2:** **Do not buy two-up with truncation.** The first attempt at this shortened cards by 29% and turned every name into "Softw…", "Legal …", "Docto…". Let names wrap and move any badge beneath the name.
- [ ] **Step 3:** **`sm:` is 640px and phones are 375 to 430.** A two-column layout gated at `sm:` is a layout no phone ever reaches. Gate it at the base and undo it upward, or use a container query.
- [ ] **Step 4:** Shoot at 375, confirm no horizontal overflow: `scrollWidth` must not exceed `clientWidth`.
- [ ] **Step 5:** Compare file, send it, commit.

---

# PHASE 6 — THE SPECIALISED SECTIONS. The thing that makes it feel expert.

**The founder's list, in his words:** tipping culture and percentage; taxes for taking public space; corruption incidence among local officials; subsidies, special regimes and zones (*"tiny details that matter"*); typical business structure (*"HVAC operators, 5 people, 2 trucks, $5000 equipment, $200 electricity"*); typical prices for the three most-sold items (*"haircut, beard trimming, face mask"*); talent availability and talent quality on a 1-to-4 scale; personas by wealth, resident type and age; licences higher up the page; burglary, lawsuit and penalty risk.

**MEASURED STARTING POINT, CORRECTED IN PHASE 0. The trade page renders 21 sections, not seven.** The seven-section figure came from `CELL_PAGE_SECTIONS` in `src/lib/page-layout/section-order.ts`, which is **stale**: four of the seven it names do not render at all. What actually renders, in order:

    honest-take, narrative, plain-terms, money, cost-drivers, owner-take-home,
    break-even, wages, startup-cost, seasonality, first-year, nearby,
    operator-voices, risks, vs-world, locals, contrarian, myths, fit,
    gut-check, one-thing

**This changes the phase materially, and the earlier draft would have made the page worse.** 21 plus 10 is 31 sections, which runs straight into the founder's own complaint that pages are unskimmable. **Four of his ten requests must REPLACE an existing section rather than add one:**

| His request | Absorbs |
|---|---|
| Burglary, lawsuit and penalty risk (6.9) | `risks` |
| Pay as a share of takings (from the interview) | `wages`, which is today the four hardcoded wage tables |
| Personas by money, residency and age (6.8) | `locals` |
| The four-plus-one onward rail (7.1) | `nearby`, which is today the four fixed multipliers |

**Six of the 21 are opinion sections clustered at the close** — `operator-voices`, `contrarian`, `myths`, `fit`, `gut-check`, `one-thing` — and that is where the length is. `one-thing` already repeats `honest-take` word for word, so the close is a duplicate before anything is added. Under "replace, never cut", these get consolidated into fewer, stronger sections; they are not deleted.

**Net section count after this phase must not exceed 24.** If a task would push it past that, it is adding where it should be absorbing.

> **RE-READ THE ILLUSTRATIVE-CONTENT RULE at the top of this plan before starting any task in this phase.** Every section below is built in the workshop first. None reaches a reader-facing page without a real source.

### Task 6.0: The trade profile — which sections a trade gets

**Files:**
- Create: `src/lib/cells/trade_profile.ts`
- Test: `tests/lib/cells/trade_profile.test.ts`

**Interfaces:**
- Produces: `profileFor(activityId: string): TradeProfile` where `TradeProfile = { sections: SectionId[]; topItems: string[]; licenceCritical: boolean }`.

**Why this exists:** the founder asked for *"other custom sections for different businesses to give the site that specialized feeling"*. That is only possible if something decides, per trade, which sections appear. Without it, every page gets every section and the specialisation is fake.

**And it is what prevents the defect that started all of this.** A section that appears on every trade regardless of relevance is how eight cards came to be badged "Easy": the shape was fixed and the content was made to fit it.

- [ ] **Step 1:** Write the failing test. It must assert that a restaurant and a dental practice get **different** section lists, and that `licenceCritical` is true for medical and childcare trades and false for a cafe.
- [ ] **Step 2:** Implement as an explicit per-trade map with a sensible default, not a keyword match on the slug. **Keyword matching on the slug is exactly how four wage tables came to serve twenty trades.**
- [ ] **Step 3:** Test, standing gate, commit.

### Task 6.1: Licences move up, for the trades that need them

**The ruling:** *"Licenses for businesses that require them should be higher in the page especially medical, daycare, etc."*

**Files:**
- Modify: `src/lib/page-layout/section-order.ts`
- Modify: the cell page

- [ ] **Step 1:** Where `profileFor().licenceCritical` is true, licences render **directly under the hero**, before the money sections. Where false, they stay in their current position.
- [ ] **Step 2:** Update `CELL_PAGE_SECTIONS` and confirm `verify_section_order` still passes. The order contract permits reordering (2026-08-21 ruling); it forbids dropping.
- [ ] **Step 3:** Render a dental page and a cafe page and confirm the order differs.
- [ ] **Step 4:** Standing gate, commit.

### Tasks 6.2 to 6.11: The sections themselves

Each is one task, one file, one commit, built in the workshop, with the same five steps: write the component with a `position: relative` card; pick its form **from the FORM-CATALOG only** (`E:\atlas\rules\FORM-CATALOG.md` — improvising a shape inline is a defect, not initiative); mount it on the workshop route; shoot it at 1280 and 375; commit.

| # | Section | What a visitor sees | Form from the catalog | Page |
|---|---|---|---|---|
| 6.2 | **Typical setup** | *"Five people. Two vans. About 5,000 in tools."* The shape of the business, not its accounts | KV rows plus a small icon set. **Not a chart** | Trade |
| 6.3 | **What things cost here** | The three most-sold items with their local price: a haircut, a beard trim, a face mask | Plain 3-column table, the founder's own best-executed element | Trade |
| 6.4 | **Tipping** | Whether tipping is expected here, and roughly what percentage | Meter, one marker on a two-end labelled track | Trade + Country |
| 6.5 | **Paying for the pavement** | What a table on the street, an A-board or a terrace costs per year | Stat, a lone number may stay a number | Trade + City |
| 6.6 | **Can you hire** | Availability of people for this specific trade in this place | EaseScale, markers on one shared left-right scale | Trade |
| 6.7 | **How skilled do they need to be** | A 1-to-4 read, explicitly simple | PriceTierBand, a discrete 4-step categorical band. **Not a continuous meter** — a continuous meter for a category is false precision | Trade |
| 6.8 | **Who walks in** | Three characteristics: money, whether they live here, and age | SpectraTable, three two-pole spectra | Trade + City |
| 6.9 | **What can go wrong** | Burglary, being sued, and being fined, beside the trade risks already there | Dots, and severity derived from held figures per the 2026-08-21 ruling | Trade |
| 6.10 | **Deals and special regimes** | Reduced social contributions, sector schemes, special zones. The *"tiny details that matter"* | CatRows. Extends the country page's existing special-zones section rather than adding a second one | Country |
| 6.11 | **How clean is the town hall** | Incidence of corruption among local officials | Meter, inverted so high reads good, per rule 29A | Country + City |

**Three constraints that apply to all ten and will each be violated at least once if not stated:**

1. **No sentence beside a chart.** The finding lives on the visual: a marker, a struck figure, the focal number. If a chart needs a sentence to be understood, the chart is wrong, not under-captioned.
2. **One scale, high reads good, everywhere.** A risk, a cost or a burden is inverted before rendering. Two boxes in one band that flip direction is a defect.
3. **Run the universality test before writing, not after.** Imagine the section rendering for Kinshasa, Dhaka, Tirana and La Paz. If the copy, the metric or the visual breaks, empties out, or becomes condescending there, it is wrong. Task 6.11 (corruption) and Task 6.4 (tipping) are the two most likely to fail this.

### Task 6.12: Show him all ten at once

- [ ] **Step 1:** Build a single workshop page mounting all ten new sections in order with illustrative content.
- [ ] **Step 2:** Shoot at 1280 and 375.
- [ ] **Step 3:** Build the compare file against the seven-section baseline from Phase 0.
- [ ] **Step 4:** Send it. **This is the phase's real deliverable** and the moment he judges whether the site feels specialised.

---

# PHASE 7 — ONWARD NAVIGATION. Predict where the reader goes next.

**The founder's ruling:** *"there should be parts where we predict the mental cycle of the visitor for example restaurants in London, there should be 4 easy clicks to see how much restaurants in neighbouring cities, neighbour capitals are making, clear redirection, and a fifth that shows choose or make it custom."*

### Task 7.1: The four-plus-one rail

**Files:**
- Create: `src/components/kit/OnwardRail.tsx`
- Test: `tests/components/OnwardRail.test.tsx`

**Interfaces:**
- Consumes: `presenceOf` from Phase 3, and the existing nearby-peer resolution.
- Produces: `<OnwardRail destinations={...} />` rendering four destination cards and one custom door.

- [ ] **Step 1:** Write the failing test. It must assert: exactly four destinations plus one custom door; **every destination resolves to a page that exists**; and a destination whose presence is `absent` is never offered.
- [ ] **Step 2:** Destinations resolve in this order, falling through when one is unavailable: nearest cities in the same country, then the capital of each neighbouring country, then the largest city in the region. **Never invent a destination to fill the fourth slot** — offer three rather than fabricate one.
- [ ] **Step 3:** The fifth door is a "somewhere else" control leading to the chooser. It must be visibly a different kind of thing from the four, not a fifth identical card.
- [ ] **Step 4:** **Every card carries a real figure or no figure.** A destination card showing an estimated number is the original defect wearing a navigation costume.
- [ ] **Step 5:** Test, shoot at both widths, standing gate, commit.

### Task 7.2: Kill the dead links first

**Measured:** the city side of the site carries **502 dead navigation entries**.

- [ ] **Step 1:** Enumerate every `href` from the rendered markup of each page type and resolve each against the route table.
- [ ] **Step 2:** Write the count down before fixing anything. This closes readiness criterion G21, currently unmeasured.
- [ ] **Step 3:** Gate it at zero for the trade page, and as a ratchet elsewhere.
- [ ] **Step 4:** Standing gate, commit.

---

# PHASE 8 — THE INDUSTRY PAGE. Raw reality.

**The founder's ruling:** *"there must be sections where it is openly discussed the raw reality of different industries and activities, where does the margin come from. Like these pages should be designed for a person that thinks 'how will I actually make money with this business'. Universal practices, raw, direct, not corporate bullshit."*

### Task 8.1: Fix the margin printed three ways

**Measured:** one industry page prints a single net margin as **7%, $6, and 6.5%**. A reader sees the owner's share change twice on one page.

- [ ] **Step 1:** Find all three printings and establish which is correct by reading the module that produces each. **Read the module that produces a number before acting on it** — six measurement artifacts in this project have died to skipping that step.
- [ ] **Step 2:** One number, one precision, one place it is computed.
- [ ] **Step 3:** Gate it: assert the same quantity never renders at two precisions on one page.
- [ ] **Step 4:** Standing gate, commit.

### Task 8.2: "Where the money actually comes from"

**Files:**
- Create: `src/components/kit/industry/MarginReality.tsx`

**The register, and it is the whole point of the section:** direct, concrete, and about mechanics. What the margin actually rests on in this trade: the one input whose price decides everything, the hours that carry the week, the thing everyone underestimates. **Rulebook rule 40 governs the voice** — calm, precise, editorial, a trusted almanac. Direct is not the same as crude, and *"not corporate bullshit"* means no abstraction, not a change of register.

- [ ] **Step 1:** Build it as schematic content: labelled rows and figures, not prose paragraphs. Rule 19 bans invented prose paragraphs inside subsections, and this section will want to become one.
- [ ] **Step 2:** Workshop first, illustrative content, per the rule at the top of this plan.
- [ ] **Step 3:** Universality test: it must work for a barber in Tirana as well as for a restaurant in London.
- [ ] **Step 4:** Shoot, standing gate, commit.

### Task 8.3: Restack the industry page around the earning question

- [ ] **Step 1:** Reorder so the page reads: what this trade is, what it earns, **where the margin comes from**, what kills it, where it works best.
- [ ] **Step 2:** Cut the four of five tiles that restate figures printed 400px above. Under "replace, never cut", each one is replaced with something the page does not already say — not deleted.
- [ ] **Step 3:** Compare file, send it.

---

## The loop that executes this

**Reconciling two founder rulings.** He ruled "directed sessions, no loop" during the interview, then asked for a loop an hour later. Both are right and they are not in conflict: what failed before was a **fast, unattended, ungated** loop whose unit of work was "find something to improve", which rewarded producing a change every twenty minutes. That is how eight cards badged "Easy" got shipped after being looked at.

**This loop is different in three specific ways:**

1. **Its unit of work is a numbered task from this plan**, never "find something to improve". It cannot invent work.
2. **It cannot finish a task without the standing gate**, and for anything visual, without a screenshot at two widths.
3. **It stops at every phase boundary** and hands the founder a compare file. It does not start the next phase until he answers.

### Loop tick contract

```
1. Read this plan. Take the LOWEST-numbered unchecked task.
2. Re-read the Global Constraints block. Every time. It is short for that reason.
3. Execute the task's steps in order. Do not skip the failing-test step:
   a test that has never failed has never been shown to test anything.
4. Run the standing quality gate. If red, check whether the failing file is
   yours before reporting it.
5. If the task changed anything visible, render and shoot at 1280 and 375,
   reloading between widths.
6. Commit with a message saying what was wrong, what changed, what was measured.
7. Tick the checkbox in this file, in the same commit.
8. If the task was the last in its phase, STOP. Build the compare file and
   hand it to the founder. Do not begin the next phase.
```

### What the loop must never do

- Push, deploy, or run `npm run build`.
- Raise a ratchet baseline.
- Run `git stash`, `git checkout .`, or `git reset --hard`. All three are tree-wide, and stash has already swept up two other agents' uncommitted work in this project.
- Mount a new section on a reader-facing route without a real source.
- Report progress to the founder in code. No file paths, no function names, no line numbers. **Tell him what a visitor sees.**

### The three ways this loop can still fail, and the guard for each

| Failure | Guard |
|---|---|
| A gate goes green while the site is wrong | The screenshot is the authority on anything visual. Several gates in this chain have been measured lying |
| A measurement reads empty and is reported as a finding | A measurement that reads empty is an instrument failure far more often than a finding. A font check once read the type tokens as the empty string and was about to be reported as "this page ships with no fonts"; the fixture had no stylesheet |
| The loop optimises for ticking boxes | Every phase ends at a founder gate. Boxes ticked without a compare file at the phase boundary do not count |

---

## Self-review against the founder's message

Every item he raised, and the task that carries it.

| His words | Where it lands |
|---|---|
| Tipping culture, how expected, percentage | 6.4 |
| Taxes for taking public space | 6.5 |
| Corruption of mayoral/government officials | 6.11 |
| Subsidies, sector deals, special zones, *"tiny details"* | 6.10 |
| Typical business structure, the HVAC example | 6.2 |
| Typical prices for the 3 most-sold items | 6.3 |
| Availability of talent for this activity here | 6.6 |
| Quality of talent needed, 1 to 4, simple | 6.7 |
| Custom sections per business, *"specialized feeling"* | 6.0 (the mechanism) plus 6.2 to 6.11 |
| Personas: wealth, resident type, age | 6.8 |
| Licences higher up for medical, daycare | 6.1 |
| Burglary, lawsuit, penalty risk | 6.9 |
| Industry pages: raw reality, where the margin comes from | 8.2, 8.3 |
| Too many business types, lingerie into clothing | 2.1 (his example is a named test case) |
| SEO/AEO fear on merging | 1.2, 2.2 (301s, never 404s; no renames) |
| Business list scroll too long | 1.3, 2.3 |
| Thresholds: no medical equipment in Chad | 3.1, 3.2 |
| Mental cycle: 4 clicks plus a custom fifth | 7.1 |
| Font variability, H1 to smallest too gigantic | 4.1 to 4.4 |
| Full width must be checked per subsection | 5.2, 5.3 |
| Mobile treated differently | 5.3 step 2, 5.4 |
| No farming, banking, trading, factories | 1.1 |
| The 30 million ceiling | 1.1, the capital test |
| No commercial centres or big real estate | 1.1 |
| Consulting is risky | 1.1 (management consulting retired) |
| Hospitals and high schools out of scope | 1.1 |

**Two open questions this plan cannot answer for him, both flagged in the tasks rather than guessed at:**

1. **The salon survivor** (Task 2.1). Three activities collapse and the rulebook names "salon" as the canonical word, but the existing ids are `Barbershops` and `Hairdressers & beauty`. Choosing a new id creates a new URL, which is the thing he is afraid of. The plan keeps an existing id and names the trade-off.
2. **Whether a borrowed spread carries a mark** (Global Constraints). A spread built from similar businesses elsewhere has a real shape that is not this business's shape. The working reading is that only a formula-built spread is marked. Unruled.
