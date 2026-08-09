# Sharpen the Axe , Foundations Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the surface area a change has to be correct across, and put a net under it, so that shipping a page stops being an act of vigilance.

**Architecture:** Four independent phases, each shipping working software on its own. Phase 0 is a working method and costs no code. Phase 1 removes the parasitic half of the route surface. Phase 2 collapses four styling sources into one. Phase 3 puts behaviour tests under the five things that have actually broken. Nothing here rewrites working product code.

**Tech Stack:** Next.js 15.5 App Router, React 19.2, TypeScript 5, Tailwind 3.4, Supabase, Vercel.

---

## CORRECTIONS TO THIS PLAN, made while executing it

Three things in the audit above were wrong or incomplete. They are corrected in
place below; the originals are struck rather than deleted, because a plan that
quietly rewrites its own premises teaches nothing.

**1. "24 tests" was 16, and the real number is 4.** My `find` swept a stale git
worktree at `.claude/worktrees/reverent-noether-12586a` (79MB, detached HEAD),
which contributed 8. Of the 16 real files, **only 4 were wired into anything.**
No test runner is installed; the idiom is a bare `tsx` script that exits 1, so a
file not named in `prebuild_all.ts` never runs. **Twelve test files were written,
committed, and executed by nothing.** DONE: 11 now registered, the 12th excluded
because it needs a secret.

**2. Phase 3 does not need Vitest.** The plan specified it; the codebase already
has a working idiom and adding a framework would mean a dependency, a config and
a 16-file migration to gain nothing. All new tests follow the existing shape.

**3. `/dev` IS NOT THE WORKSHOP. It is load-bearing production code.** Three
shipping routes import their page bodies out of it:

```
src/app/(site)/cities/[slug]/neighborhoods/page.tsx  <- @/app/dev/spine-hood/hood-view
src/app/(site)/cities/[slug]/page.tsx                <- @/app/dev/spine-city/city-view
src/app/(site)/industries/[industry]/page.tsx        <- @/app/dev/spine-industry/industry-view
```

**This is the single most important architectural finding in the audit and it
rewrites Task 1.3.** Deleting from `/dev` is not housekeeping; three live page
types render from there. It also explains a large share of the "it clashes a
lot" feeling: production code sits in a directory everyone treats as disposable,
so every rule about "shipping pages" either misses it or has to special-case it.

**Task 1.3 is therefore replaced by Task 1.3a below.** Retirement cannot be
assessed until production code is out of the workshop.

### Task 1.3a: DONE 2026-08-09, and it was five page types, not three

**Corrected while doing it.** I had grepped for `spine-hood|spine-city|spine-industry`,
so I never looked for `spine-cell` or `spine`. The gate written in step 4 found
the two I missed, which is the argument for writing the gate before trusting the
survey:

```
src/app/[country]/[geo]/[industry]/page.tsx  <- @/app/dev/spine-cell/cell-view   THE CELL PAGE
src/app/[country]/page.tsx                   <- @/app/dev/spine/page             a whole route
```

**20 modules moved** to `src/components/spine/{hood,city,industry,cell}/`,
filenames intact, four commits. `/gb/london/restaurants`, the one live v2 page,
had been rendering from the workshop.

**One leak remains, named in the gate with an exit condition.**
`[country]/page.tsx` mounts a 112KB dev *route* as a component. That is a
rewrite, not a move, and it sits behind a flag whose own comment says it can
never be enabled. The gate fails if the allowance ever stops being needed.

**Two gates broke and both were right to.** `verify_sample_tags` resolves a seed
to its render group by folder and correctly reported the emptied folders as
having no `SampleTag`; it now checks both locations.
`verify_hardcoded_hex` is a ratchet keyed on file path, so 7 moved files read as
new files with 78 hexes against a baseline of 0. **`--update-baseline` was NOT
run** , it absorbs genuinely new hex along with the moved kind. The keys were
renamed under an assertion that the entry count and hex total came out
identical: 28 and 294, before and after.

**Full chain 81/81. The KEEP/RETIRE sheet is now safe to produce.**

<details><summary>The original task text, kept for the trail</summary>

#### Move the three production view modules out of `/dev`

**Files:**
- Move: `src/app/dev/spine-hood/hood-view.tsx` → `src/components/spine/hood-view.tsx`
- Move: `src/app/dev/spine-city/city-view.tsx` → `src/components/spine/city-view.tsx`
- Move: `src/app/dev/spine-industry/industry-view.tsx` → `src/components/spine/industry-view.tsx`
- Modify: the three importing routes above, plus the `/dev` preview routes that also render them

- [ ] **Step 1: Confirm the full import graph of each of the three before moving anything.** A view may have siblings in its `/dev` folder that move with it.
- [ ] **Step 2: Move one module, update every importer, `npx tsc --noEmit`, commit.** One module per commit, so any single move is revertable.
- [ ] **Step 3: Repeat for the second and third.**
- [ ] **Step 4: Add a gate**: nothing outside `src/app/dev/` may import from `src/app/dev/`. Hard gate once the three are moved.
- [ ] **Step 5: Only then** produce the KEEP/RETIRE sheet, which is now safe to reason about.

</details>

### THE JUNK-URL RULE, MEASURED CLEAN. Needs his nod because it is a 404.

Found by deleting the 15 superseded prototypes: those paths did not start
404ing, they fell through to `/[country]/[geo]` and rendered a synthesised
region page. A control proves it is not about `/dev` at all:

```
/dev/totally-made-up-xyz   200  fresh   "totally-made-up-xyz: small-business benchmarks"
/zz/qq                     200  fresh   "qq: small-business benchmarks"
```

**Every two-segment path on the site returns a plausible page for a place that
does not exist.** Pre-existing, not caused by the deletions. Contained for now:
those pages carry `noindex`, and `/dev/` is disallowed in robots since today.

**The handoff rejected two rules after measuring them.** "Industry must resolve"
would 404 **269 of 800** real cell URLs, because a third use raw NAICS
descriptions. "Country + geo must resolve" does not discriminate, because
`geoResolves("us","nowhere")` is `true`.

**Nobody tested the country segment ON ITS OWN. It comes out clean.**

| tested against | result |
|---|---|
| 800 real cell URLs (shards 1, 2) | 2 distinct first segments: `us`, `gb`. **0 false positives** |
| **all 2,847 declared URLs** | 2,061 sit under a 2-letter code (195 distinct, all real countries); the other 786 sit under 13 named static prefixes (`cities`, `coverage`, `learn`, `compare`, `browse`, `world`, `pricing`, `about-data`, `faq`, `blog`, `you`, `status`, root) , **every one a real static route, which out-ranks `[country]` in the router anyway. 0 false positives.** |

**The rule: the `[country]` segment must be a member of `COUNTRIES`, else
`notFound()`.** One check, provably zero false positives across every URL the
site declares.

**Not shipped. It is a 404, which is outward-facing and hard to reverse**, and
the standing guidance is that a wrong `noindex` is recoverable where a wrong 404
is not. Two shapes to choose from:

- **404** , correct end state, and the measurement supports it.
- **`noindex` first** , recoverable, then promote to 404 after a few weeks of
  Search Console showing nothing real got caught.

**Residual risk either way, stated plainly:** the test covers URLs the sitemap
declares. A legitimate inbound link to a country-tree URL that is NOT declared
would still be caught. Nothing measured suggests one exists, and nothing
measured rules it out.

### Also found, not acted on

**A stale git worktree, 79MB**, at `.claude/worktrees/reverent-noether-12586a`,
detached at `381bb3ab`. It is a real parasitic artifact: it inflates every
repository-wide `find` and it is what corrupted the test count above. Removing it
is `git worktree remove`, but it is not mine to discard without checking whether
anything in it is unmerged.

---

## The measurement first, because the diagnosis is not what it looks like

Every number below was read off the repository or production today, not estimated.

| | |
|---|---|
| `page.tsx` routes | **113 total, 58 under `/dev`, 55 shipping** |
| `/dev` on production | **200 and crawlable.** `robots.txt` blocks `/api/`, `/_next/`, `/admin`. It does **not** block `/dev/` |
| `/dev/cell2` served weight | **202,840 bytes**, publicly |
| Cell-page prototypes alive | **5** , `cell`, `cell2`, `cell-reform`, `cell-v2`, `spine-cell` |
| `spine2` experiment routes | **8** , `spine2`, `-chartsa`, `-chartsb`, `-client`, `-hard`, `-servera`, `-serverb`, `-tracks` |
| TS/TSX in `src` | 690 files, **144,022 LOC** |
| **Orphaned modules** | **21 of 690 (3%), 3,550 LOC** |
| **Tests** | **24**, for 144,022 LOC |
| Prebuild gates | **68** |
| Styling sources of truth | `globals.css` 1,786 + `atlas-spine.css` 1,895 + `design-tokens.ts` 425 + `design/mockups/atlas.css` 1,893 = **~6,000 lines across 4 files that must agree by hand** |
| Feature flags declared | **16**. Set in `.env.local`: **1** |

### What this says, plainly

**The codebase is not rotten and the dead-code theory is wrong.** 97% of modules are imported by something. There is no forest of abandoned components to clear. Deleting "pointless code" would recover 3,550 lines of 144,022, which is not where the pain is. **Chasing it would be four hours spent sharpening the wrong edge.**

**The pain is surface area, and it is measurable.** 51% of the routes in this repository are experiments, they are served publicly, and they are crawlable. Every shared component change lands on 58 pages nobody reviews. That is the mechanical cause of "it clashes a lot": there is no such thing as a small change when half the surface is unreviewed.

**The second cause is that nothing catches a regression before you do.** 24 tests against 144,022 lines means the detector of last resort is your eyes on production. That is exactly the loop you are describing as "so many errors, so many debugging": find it live, diagnose it, fix it. Three separate firings this week were spent diagnosing symptoms in production that a test would have named at commit time.

**The third cause is that the rules and the tokens disagree.** The ratified palette is terracotta plus cool neutrals. The token layer declares `--moss-*` (green), `--amber-*` and `--cocoa-*` as a first-class scale. Both are "the standard". Nothing can reconcile them because nothing owns them, which is why an amber landed on your home page.

**Honest counter-note on the 68 gates.** They look like bloat and they are not. Each one is a past failure that cannot recur, and they are the reason the content rules hold at all. They are also the wrong instrument for behaviour: a gate checks a rule about source text, it cannot tell you a page stopped rendering. **Phase 3 adds the missing kind, it does not replace these.**

---

## Phase 0 , the working method

**This is the axe. It costs no code and it is the highest-value item on the page.**

Every delay in the last two days reduces to one failure, and it is the same one three times:

| What happened | The rule it broke |
|---|---|
| Three firings concluded "build timeout" from a log that only logs timeouts | Acted on an aggregate without reading what produces it |
| Measured the v2 flag on a URL that can never serve v2 | Same. `spine2_loader.ts` says so in its first paragraph |
| Verified a perf fix with a counter that swings 30 to 2 on identical code | Same. Never established the instrument could see the thing |

So the method is four mechanical rules, not aspirations:

1. **Read the module that produces a number before acting on the number.** Every artifact caught in this project, and there have been six, died to this one step.
2. **State the instrument's blind spot before quoting it.** "This counter cannot distinguish X from Y." If that sentence cannot be written, the measurement is not ready.
3. **One change, one verification, before the next change.** No batching a fix behind another fix.
4. **When a rule is ratified, it becomes a gate in the same session, or it is written down as not machine-checkable with the reason.** Four of your rulings came back twice because they lived in a conversation.

- [ ] **Step 1: Write the method into the repo where it is read, not into a doc nobody opens**

Append to `E:\atlas\website\CLAUDE.md` under a new `## Working method` heading, the four rules above verbatim.

- [ ] **Step 2: Commit**

```bash
cd E:\atlas\website && git add CLAUDE.md && git commit -m "method: read the source before acting on the aggregate, and three more rules"
```

---

## Phase 1 , stop shipping the workshop

**Problem, measured:** 58 of 113 routes are experiments, served at 200, crawlable, and `/dev/cell2` alone is 202KB of public HTML.

**Not proposed: deleting them.** `/dev/options/*` is where the three-drawings-per-subsection deal lives and is your review surface. Prototypes are how you rule on a design. **The fix is that they stop being production, not that they stop existing.**

### Task 1.1: Block `/dev/` in robots.txt

**Files:**
- Modify: `E:\atlas\website\src\app\robots.ts`
- Test: `E:\atlas\website\tests\app\robots.test.ts` (create)

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import robots from "@/app/robots";

describe("robots.txt", () => {
  it("blocks the dev workshop from every crawler", () => {
    const out = robots();
    const groups = Array.isArray(out.rules) ? out.rules : [out.rules];
    for (const g of groups) {
      const disallow = Array.isArray(g.disallow) ? g.disallow : [g.disallow ?? ""];
      expect(disallow).toContain("/dev/");
    }
  });
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
cd E:\atlas\website && npx vitest run tests/app/robots.test.ts
```

Expected: FAIL, `expected [ '/api/', '/_next/', '/admin' ] to contain '/dev/'`.

- [ ] **Step 3: Add `/dev/` to every disallow list in `src/app/robots.ts`**

- [ ] **Step 4: Run it and watch it pass**

```bash
cd E:\atlas\website && npx vitest run tests/app/robots.test.ts
```

- [ ] **Step 5: Commit**

```bash
cd E:\atlas\website && git add src/app/robots.ts tests/app/robots.test.ts && git commit -m "seo: the workshop stops being crawlable"
```

### Task 1.2: A gate that fails when a `/dev` route is reachable in production

**Files:**
- Create: `E:\atlas\website\scripts\verify_dev_routes_sealed.mjs`
- Modify: `E:\atlas\website\scripts\prebuild_all.ts` (register it)

- [ ] **Step 1: Write the gate**

It asserts two things and prints the count either way: `robots.ts` disallows `/dev/` in every group, and no file outside `src/app/dev/` imports from `src/app/dev/`. Exit 1 on either.

- [ ] **Step 2: Run it against the current tree, expect PASS after 1.1**

```bash
cd E:\atlas\website && node scripts/verify_dev_routes_sealed.mjs
```

- [ ] **Step 3: Negative-test it** by temporarily removing `/dev/` from one robots group; expect exit 1; restore.

- [ ] **Step 4: Register and commit**

```bash
cd E:\atlas\website && node scripts/loop/gate.mjs dev-routes-sealed --heap 384
git add scripts/ && git commit -m "gate: the workshop cannot become public again by accident"
```

### Task 1.3: Retire the superseded prototypes , YOUR LIST, NOT MINE

**This task does not run until you mark the list.** These are your review surfaces and I will not guess which ruling still needs its evidence standing.

- [ ] **Step 1: Produce the retirement sheet**

Generate `E:\atlas\design\loop5\DEV-ROUTE-RETIREMENT.md`: one row per `/dev` route, its size, its last commit date, and which ratified decision it produced. You mark each `KEEP` or `RETIRE`.

Candidates on the face of it, because a newer generation of the same page exists: `cell-reform`, `cell-v2`, `spine-cell`, `home`, `home2`, `spine2-chartsa`, `spine2-chartsb`, `spine2-servera`, `spine2-serverb`, `spine2-client`, `spine2-hard`. That is 11 of 58.

**Certainly KEEP regardless:** `options/*`, `cell2`, `industry2`, `hood2`, `city2`, `home3`, `catalogue`, `kit`, `charts`.

- [ ] **Step 2: Delete only the rows marked RETIRE, one commit per route**, so any single one is revertable on its own.

**Done when:** `/dev/*` returns 200 to you and is invisible to crawlers; the route count is what you chose.

---

## Phase 2 , one place a colour is decided

**Problem, measured:** ~6,000 lines across four files define the same palette. The ratified rule bans green, amber and brown; `globals.css` declares all three as tokens; an amber shipped to your home page footer.

### Task 2.1: A hue gate, because a name gate cannot see `#6f8f25`

**Files:**
- Create: `E:\atlas\website\scripts\verify_palette_membership.mjs`
- Create: `E:\atlas\website\src\lib\palette-law.ts`

- [ ] **Step 1: Write the law as data**

```ts
/** The ratified palette, as hue bands rather than names. A gate that greps for
 *  the word "green" never sees #6f8f25, which is exactly how one shipped. */
export const ALLOWED_HUE_BANDS: Array<{ name: string; hMin: number; hMax: number; sMax?: number }> = [
  { name: "terracotta", hMin: 0, hMax: 22 },
  { name: "neutral", hMin: 0, hMax: 360, sMax: 12 },
  { name: "ink/cocoa ladder", hMin: 22, hMax: 40, sMax: 40 },
  { name: "teal", hMin: 150, hMax: 200 },
];
export const BANNED_EXAMPLES = ["#6f8f25", "#eda12f", "#96b448", "#4a6018", "#8a510a"];
```

- [ ] **Step 2: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { isPaletteLegal } from "@/lib/palette-law";
import { BANNED_EXAMPLES } from "@/lib/palette-law";

describe("palette law", () => {
  it("rejects every colour the founder has rejected", () => {
    for (const hex of BANNED_EXAMPLES) expect(isPaletteLegal(hex), hex).toBe(false);
  });
  it("accepts the brand and the neutrals", () => {
    for (const hex of ["#e62200", "#991600", "#463726", "#efeeeb", "#345a47"]) {
      expect(isPaletteLegal(hex), hex).toBe(true);
    }
  });
});
```

- [ ] **Step 3: Implement `isPaletteLegal(hex)`** , hex to HSL, then band membership.

- [ ] **Step 4: Run the test, expect PASS**

```bash
cd E:\atlas\website && npx vitest run tests/lib/palette-law.test.ts
```

- [ ] **Step 5: Write the gate over `src/components/**` and `src/styles/**`**, reporting every illegal hex with its file and line.

- [ ] **Step 6: Measure before deciding whether it is a hard gate or a ratchet.** If the count is zero it is a hard gate. If it is not, it is a ratchet with the offenders recorded, because a gate that reds every page on day one gets switched off. **Do not raise a baseline to make it pass.**

- [ ] **Step 7: Commit**

### Task 2.2: Decide the meaning scale , YOUR CALL, one question

`--moss-*`, `--amber-*` and `--clay-*` exist to encode positive / caution / low on data surfaces. The palette rule bans two of the three hues. **These cannot both be true and I will not pick.**

The two coherent answers: encode meaning with terracotta intensity plus neutrals and delete the scale, or keep the scale as a named, gated exception used only for data encoding and never for decoration.

- [ ] **Step 1: Put both to him with a rendered example of each.** Nothing else in Phase 2 depends on this.

---

## Phase 3 , a net under the five things that actually break

**Problem, measured:** 24 tests, 144,022 lines. **This is the axe-sharpening item and it is why the debugging never ends.**

Not proposed: a coverage target. Proposed: a test for each class of failure that has actually cost time, and nothing else. YAGNI.

### Task 3.1: The data layer must not fail silently , the three-month one

**Files:**
- Create: `E:\atlas\website\tests\lib\cells-failsoft.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect, vi } from "vitest";
import { dbFailed } from "@/lib/cells";

describe("dbFailed", () => {
  it("logs and reports true when the query errored", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(dbFailed("someReader", { message: "Unregistered API key" })).toBe(true);
    expect(warn).toHaveBeenCalledOnce();
    expect(String(warn.mock.calls[0][0])).toContain("Unregistered API key");
    warn.mockRestore();
  });

  it("stays silent and reports false on a genuinely empty table", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(dbFailed("someReader", null)).toBe(false);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
```

- [ ] **Step 2: Run it, expect PASS** (`dbFailed` already exists; this pins the behaviour so it cannot regress)

```bash
cd E:\atlas\website && npx vitest run tests/lib/cells-failsoft.test.ts
```

- [ ] **Step 3: Add a source gate**: every `.from(` in `src/lib/cells*` whose destructure includes `error` must pass it to `dbFailed`. Fails on a new reader that swallows.

- [ ] **Step 4: Commit**

### Task 3.2: Every shipping route renders , the header class of bug

**Files:**
- Create: `E:\atlas\website\tests\app\route-contract.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

/** Every route that is not under /dev and not on the exempt list must opt into
 *  chrome. The home page silently lost its masthead for weeks because it sits
 *  at the app root, in neither (site)/ nor the per-page opt-in list. */
const CHROME_EXEMPT = new Set([
  "src/app/[country]/[geo]/[industry]/page.tsx", // serves the spine, carries its own
]);

function shippingRoutes(dir = "src/app", out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) { if (e.name !== "dev") shippingRoutes(p, out); }
    else if (e.name === "page.tsx") out.push(p);
  }
  return out;
}

describe("route contract", () => {
  it("every shipping route has chrome or is exempt by name", () => {
    const missing = shippingRoutes().filter((f) => {
      if (CHROME_EXEMPT.has(f)) return false;
      if (f.includes("(site)/")) return false; // the group layout provides it
      return !fs.readFileSync(f, "utf8").includes("SiteChrome")
          && !fs.readFileSync(f, "utf8").includes("SpineShell");
    });
    expect(missing, `routes with no chrome: ${missing.join(", ")}`).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it. It will list every route in the same position the home page was in.**

```bash
cd E:\atlas\website && npx vitest run tests/app/route-contract.test.ts
```

- [ ] **Step 3: Read each one before fixing it.** Some will be deliberate. Those go on `CHROME_EXEMPT` **with a reason on the line**, which is the whole point of the list.

- [ ] **Step 4: Commit**

### Task 3.3: The sitemap declares what exists

- [ ] **Step 1:** Promote `scripts/loop/sitemap.mjs`'s shape check into a test over `sitemap.ts`: every id in `generateSitemaps()` either returns rows or is in the `WITHDRAWN` map. Runs offline, no network.
- [ ] **Step 2: Commit**

### Task 3.4: Wire the tests into the chain

- [ ] **Step 1:** Add `vitest run` to `prebuild`, after the gates, so a failing behaviour test blocks a deploy the same way a failing gate does.
- [ ] **Step 2: Commit**

---

## Phase 4 , collapse the flag surface

**Problem, measured:** 16 flags declared, 1 set in `.env.local`. Every unset flag is a live branch that must be reasoned about and is never exercised.

- [ ] **Step 1: Read the 16 against Vercel's environment and classify each: LIVE (both sides real), DECIDED (one side has won, fold it in), DEAD (nothing reads it).**
- [ ] **Step 2: Fold each DECIDED flag into its winning branch, one commit per flag.** A flag whose losing branch is deleted stops being a combination.
- [ ] **Step 3: Delete each DEAD flag.**

**Not started until Phase 1 is done**, because retiring a prototype route usually retires a flag with it.

---

## Sequencing, and what it costs

| Phase | Depends on | Needs you |
|---|---|---|
| **0 , method** | nothing | no |
| **1 , seal the workshop** | nothing | **yes, the KEEP/RETIRE sheet** |
| **2 , palette law** | nothing | **yes, one question: the meaning scale** |
| **3 , the net** | nothing | no |
| **4 , flags** | Phase 1 | no |

**0, 1.1 and 1.2 can start immediately and are the fastest wins.** Phase 3 is the one that ends the debugging cycle and needs nothing from you.

## What this plan deliberately does NOT do

- **It does not chase dead code.** 3% orphan rate. That edge is already sharp.
- **It does not touch the 68 gates.** They are why the content rules hold.
- **It does not restructure the domain layer.** `cells.ts` at 1,472 lines is large and it is not what has broken.
- **It does not rewrite a working page to a nicer shape.** The bar is measurably better, not differently built.
