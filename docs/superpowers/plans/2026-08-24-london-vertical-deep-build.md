# London Vertical Deep Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. One fresh implementer subagent per SECTION, never per page, never per file. Steps use checkbox (`- [ ]`) syntax.
>
> **Read before Task 1, in this order and in full:** `E:\atlas\rules\DESIGN-RULEBOOK.md`, `E:\atlas\rules\OPERATING-MODEL.md`, `E:\atlas\rules\REVIEW-CYCLE.md`, `E:\atlas\rules\FORM-CATALOG.md`. Every commit message cites `rulebook v2 §N`. A commit citing a rule not in the current rulebook version is a defect.

**Goal:** Take the four London pages, one section at a time, from roughly a fifth of the July-3 richness to matching or beating it, by connecting data the adapters already carry to sections that already exist, and by replacing every genuinely unsourced figure with a knowable neighbour rather than deleting it.

**Architecture:** No new page types, no new verticals, no file-by-file sweeps. Each page gets a section inventory, each dark section gets a written replacement decision before any code, and each change runs one implementer subagent, the machine gates, a rendered look at three widths, and a three-lens adversarial panel before the founder sees it.

**Tech Stack:** The existing spine kit and adapters, `scripts/lib/render_pages.tsx`, `scripts/build_final_pages.tsx`, `scripts/shoot_live.mjs`, the 116-gate chain, `E:\atlas\design\registry\*.json`, `E:\atlas\rules\FOUNDER-VERDICTS.md`.

---

## 0. The measured gap, and why the work is smaller than it looks

**The four pages against the baseline the rulebook names as the richness standard (§46).** Both measured today, the current pages in a real browser inside their real shell:

| Page | July-3 baseline | London today | Gap |
|---|---|---|---|
| City | 11,077 chars, 9 headings | 1,936 chars, 6 chapters | **5.7x thinner** |
| Trade (cell) | 7,662 chars, 6 headings | 1,756 chars, 4 chapters | **4.4x** |
| Trade across places | 9,091 chars, 8 headings | 2,013 chars, 7 chapters | **4.5x** |
| Neighbourhood | 7,048 chars, 5 headings | 2,987 chars, 3 chapters | **2.4x** |

**21 of 49 section titles reach no reader on any of fifteen real pages.**

**And here is the thing that makes this tractable: the adapters already carry the data.** Counted, not assumed:

- The **trade** adapter hands over `break_even, cost_drivers, first_year, headline, margins, money_split, myth, nearby, owner, risks, seasonality, setup, verdict, wages`. Fourteen blocks. The page renders four chapters.
- Each **neighbourhood** district carries `best_trades, blurb, character, commuter_mult, demographics, lat, lng, price_tier, rent_mult, rev_vs_city_pct, tag_mult, tags, tourism_mult, verdict, walkability`. Fifteen fields, **including coordinates**, which means the map that self-omits for want of them can draw.
- Every **city** carries nine measured fields; two chapters were restored from them in the last hour and neither needed a new source.

**This is not a data-collection project. It is a connection project.** The proportion that genuinely needs a new source is small, and Task 3 is where that gets separated from the rest, per page, with evidence.

---

## 1. The four rules this plan exists to stop breaking

Written here because they were each broken, repeatedly, in the work that produced the gap above.

1. **§42, one vertical.** London/UK only. No page outside it is touched. If a shared file must change, the change is justified by a London section and its blast radius is measured before it lands (Task 6, step 3).
2. **§43, inventory-driven.** Every page starts with a section inventory. **No code is written for a page before its inventory exists.**
3. **§3, replace do not delete.** A figure with no source is replaced with a knowable neighbour that answers a similar decision. Deleting is the last resort and needs §41's two grounds.
4. **§48, the review cycle, every time.** Re-render the same session, diff approved crops, panel before founder.

---

## File Structure

| Path | Responsibility |
|---|---|
| `E:\atlas\design\inventory\london-city.md` | Section inventory for the city page. |
| `E:\atlas\design\inventory\london-cell.md` | Section inventory for the trade page. |
| `E:\atlas\design\inventory\london-hood.md` | Section inventory for the neighbourhood page. |
| `E:\atlas\design\inventory\london-industry.md` | Section inventory for trade-across-places. |
| `E:\atlas\design\replacements\<section-id>.md` | One per dark section: the t4 figure, the knowable neighbour, the source, the coverage count, the universality result. |
| `website/scripts/verify_no_silent_omission.ts` | Gate: a dropped figure needs a written, referenced replacement decision. |
| `website/scripts/probe_adapter_pool.tsx` | Prints what each adapter carries against what its page renders. The instrument that makes "connection, not collection" checkable. |
| `website/scripts/verify_london_richness.ts` | Ratchet: the four London pages may only gain sections, never lose them. |

---

## Task 1: The instrument that shows carried-but-unrendered data

Everything downstream depends on knowing what is already in hand. Build the instrument before trusting any claim about it.

**Files:** Create `website/scripts/probe_adapter_pool.tsx`

- [ ] **Step 1: Write it**

```tsx
/**
 * probe_adapter_pool , what does each adapter carry, and what does its page use?
 *
 * The gap between those two is the whole backlog. On 2026-08-24 the trade adapter
 * handed over fourteen blocks and its page rendered four chapters, which means
 * most of the work is connecting what exists rather than sourcing anything new.
 *
 * WHAT THIS CANNOT DISTINGUISH: a block that is carried and correctly unused from
 * one that is carried and wrongly ignored. It reports CARRIED BUT NOT RENDERED,
 * which is a candidate list, and every entry has to be opened.
 *
 * See scripts/lib/render_pages.tsx for how to run anything that imports it.
 */
import { renderAll, text, reportFailures } from "./lib/render_pages";
import { buildSpineCitySeed } from "../src/lib/spine/adapt_city";
import { buildSpineCellSeed } from "../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../src/lib/spine/adapt_industry";
import { buildSpineHoodSeed } from "../src/lib/spine/adapt_hood";

void (async () => {
  const pages = await renderAll();
  reportFailures(pages);
  const byName = new Map(pages.filter((p) => !p.failed).map((p) => [`${p.kind}:${p.name}`, text(p.html)]));

  const targets: Array<[string, string, any]> = [
    ["city:London", "city", await buildSpineCitySeed("london")],
    ["cell:london/restaurants", "cell", await buildSpineCellSeed("gb", "london", "restaurants")],
    ["industry:restaurants", "industry", await buildSpineIndustrySeed("restaurants")],
    ["hood:london", "hood", await buildSpineHoodSeed("london")],
  ];

  for (const [key, kind, data] of targets) {
    if (!data) { console.log(`\n  ${key}: adapter returned nothing`); continue; }
    const rendered = byName.get(key) ?? "";
    console.log(`\n  ${key}  , ${Object.keys(data).length} block(s) carried, page renders ${rendered.length} chars`);
    for (const k of Object.keys(data).sort()) {
      const v = (data as any)[k];
      const size = Array.isArray(v) ? v.length : v && typeof v === "object" ? Object.keys(v).length : v == null ? 0 : 1;
      if (!size) continue;
      /* A carried block counts as USED when any of its own string values shows up
         in the rendered text. Crude, and it is the right crudeness: it asks what a
         reader can see, not what the tree holds. */
      const strings = JSON.stringify(v).match(/"([^"]{6,40})"/g) ?? [];
      const used = strings.some((s) => rendered.includes(s.slice(1, -1)));
      console.log(`      ${used ? "used     " : "CARRIED, NOT RENDERED"}  ${k}  (${size})`);
    }
  }
  console.log(`\n  Every "carried, not rendered" line is a CANDIDATE. Some are correctly\n  unused. Open each before acting.\n`);
})();
```

- [ ] **Step 2: Run it and record the output verbatim into the city inventory later**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/probe_adapter_pool.tsx
```

Expected: a per-page list. **Record the count of "CARRIED, NOT RENDERED" blocks per page. That number is the plan's real backlog and every later task refers to it.**

- [ ] **Step 3: Commit**

```bash
git add scripts/probe_adapter_pool.tsx && git commit -m "probe: what each adapter carries against what its page renders (rulebook v2 §43)"
```

---

## Task 2: A section inventory per London page

§43's required artefact. **No code is written for a page before its inventory exists.** Four inventories, one per page, written in this order: city, trade, neighbourhood, trade-across-places.

**Files:** Create `E:\atlas\design\inventory\london-<page>.md`

- [ ] **Step 1: List what the page CAN render**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/sweep_dead_sections.tsx
```

- [ ] **Step 2: List what it DOES render**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx
```

- [ ] **Step 3: Open the July-3 baseline for that page and read it**

`E:\atlas\CITY-PREVIEW.html`, `CELL-PREVIEW.html`, `HOOD-PREVIEW.html`, `INDUSTRY-PREVIEW.html`. **Every section in the baseline that the page does not render is a regression with a name.** This step is not optional and is the step that was skipped for six weeks.

- [ ] **Step 4: Write the inventory**

Every column filled. An empty cell is a plan failure.

```markdown
| # | Section a reader sees | Goal, the decision it serves | Visual form | Tier | Renders? | In July-3? | Data carried? | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | The rent, district by district | where is space cheapest | focal + strip | t1 | yes | yes | yes | keep |
| 2 | The lease terms | what will the landlord want | fact list | t4 | NO | yes | no | REPLACE |
| 3 | Busy months and quiet months | when does the money arrive | month bars | t2 | NO | yes | **YES, seasonality** | CONNECT |
```

Five verdict words, and only these: `keep`, `rework`, `CONNECT`, `REPLACE`, `cut`.

- **`CONNECT`** is the new one and it is the cheapest win: the adapter already carries the data and the page does not render it. **Do every CONNECT in a page before any REPLACE in that page.**
- **`cut`** requires §41's two grounds, fails credibility or fails differentiation, and nothing else.

- [ ] **Step 5: Commit each inventory as it is written**

```bash
git add ../design/inventory/london-city.md && git commit -m "inventory: the London city page, section by section (rulebook v2 §43)"
```

---

## Task 3: A replacement decision for every REPLACE row

**Files:** Create `E:\atlas\design\replacements\<section-id>.md`

- [ ] **Step 1: Write one, completely**

The shape, with a real filled example:

```markdown
# lease-terms

**The decision this serves:** how much cash do I need before the doors open?

**What it asks for and cannot have:** deposit months, typical lease length,
rent-free months, per city. Tier 4. No public source carries these per city and
the seed's values are illustrative.

**The knowable neighbour:** the city's cost-of-living rank against all 252 cities,
paired with local average salary, presented as "what it costs to be here".

**Why it answers a similar question:** both tell a reader how much runway a place
demands before revenue arrives. The lease terms say it in months of deposit; this
says it in how expensive the place is relative to everywhere else covered.

**Where it comes from:** `data/cities/city_list_v1.json`, fields
`cost_of_living_index` and `avg_gross_salary_usd_year`.

**Coverage, counted:** 252 of 252 for both.

**Tier:** t1 both.

**SampleTag (§4A):** not required, both measured, transform is a rank.

**Universality (§21):** renders for Kinshasa, Dhaka, Tirana, La Paz? Checked below.
```

- [ ] **Step 2: Verify the source really covers the set, before writing the file**

```bash
node -e "const {cities}=require('./data/cities/city_list_v1.json');for(const f of ['cost_of_living_index','avg_gross_salary_usd_year'])console.log(f.padEnd(28), cities.filter(c=>c[f]!=null).length+'/'+cities.length)"
```

**If a field is missing for a large share, the neighbour is wrong. Pick another and re-run. Never proceed on a field most entities lack.**

- [ ] **Step 3: Run the universality test explicitly**

```bash
node -e "const {cities}=require('./data/cities/city_list_v1.json');for(const s of ['dhaka','tirana','lagos','mumbai']){const c=cities.find(x=>x.slug===s);console.log(s.padEnd(9), c?(c.cost_of_living_index??'ABSENT'):'NOT IN LIST')}"
```

- [ ] **Step 4: Repeat for every REPLACE row on the page**

- [ ] **Step 5: Commit them together, per page**

```bash
git add ../design/replacements/ && git commit -m "replacements: knowable neighbours for the London city page (rulebook v2 §3)"
```

---

## Task 4: The gate that makes silent omission impossible

§3 has been law since July and was broken 21 times because nothing enforced it.

**Files:** Create `website/scripts/verify_no_silent_omission.ts`

- [ ] **Step 1: Write the gate**

```ts
/**
 * verify_no_silent_omission , rulebook v2 §3.
 *
 * "A t4 figure is REPLACED, not deleted: research the topic and put a knowable
 * neighbour metric in its place." §2: "a page of dashes is a failure, not a
 * virtue."
 *
 * In force since 2026-07-12 and broken 21 times, because an adapter could drop a
 * field with a code comment and nothing ever asked why. The comment is no longer
 * sufficient: an omission needs a written, referenced decision.
 *
 * WHAT THIS CANNOT DISTINGUISH: a good replacement from a bad one. It checks that
 * a decision was WRITTEN and REFERENCED, never that it was wise. The panel and the
 * founder judge the wisdom.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";

const ADAPTERS = ["src/lib/spine/adapt_city.ts", "src/lib/spine/adapt_cell.ts",
                  "src/lib/spine/adapt_industry.ts", "src/lib/spine/adapt_hood.ts"];
const DECISIONS = "../design/replacements";

const known = existsSync(DECISIONS)
  ? new Set(readdirSync(DECISIONS).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")))
  : new Set<string>();

const offences: string[] = [];
for (const file of ADAPTERS) {
  readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (!/OMITTED|DELIBERATELY absent/i.test(line)) return;
    const ref = line.match(/replacements\/([a-z0-9-]+)/);
    if (ref && known.has(ref[1])) return;
    offences.push(`${file}:${i + 1}  ${line.trim().slice(0, 96)}`);
  });
}

if (offences.length) {
  console.error(`\nFAIL , ${offences.length} figure(s) dropped with no written replacement decision.`);
  console.error(`Rulebook v2 §3: a t4 figure is REPLACED, not deleted.\n`);
  for (const o of offences) console.error(`  ${o}`);
  console.error(
    `\nFor each: write ${DECISIONS}/<id>.md naming the knowable neighbour that takes\n` +
      `its place, then reference it on the line as "see replacements/<id>". If the\n` +
      `figure genuinely has no neighbour, say so IN THAT FILE, with the reason.\n`,
  );
  process.exit(1);
}
console.log(`PASS no-silent-omission , every dropped figure has a written replacement decision.`);
```

- [ ] **Step 2: Run it and expect FAIL**

```bash
npx tsx scripts/verify_no_silent_omission.ts
```

Expected: a list. **Record the count. That is the backlog in one number.**

- [ ] **Step 3: Do NOT register it in the chain yet**

It fails today by design. It joins `GATES` in Task 8, once the four pages are answered. Registering a failing gate only tempts someone to weaken it.

- [ ] **Step 4: Commit**

```bash
git add scripts/verify_no_silent_omission.ts && git commit -m "gate: a dropped figure needs a written replacement decision (rulebook v2 §3), not yet wired"
```

---

## Task 5: The richness ratchet

Stops the next pass quietly thinning a page again, which is exactly what happened.

**Files:** Create `website/scripts/verify_london_richness.ts` and `website/scripts/london_richness_baseline.json`

- [ ] **Step 1: Write the gate**

```ts
/**
 * verify_london_richness , the four London pages may gain sections, never lose
 * them.
 *
 * The pages thinned from the July-3 baseline to roughly a fifth of it, one
 * self-omitting section at a time, and nothing noticed because every individual
 * omission was correct behaviour. A count that may only rise is what notices.
 *
 * WHAT THIS CANNOT DISTINGUISH: a section that is rich from one that merely
 * exists. It counts rendered chapter and section headings, not quality.
 *
 * Run with --write to lower nothing and raise the floor after a genuine gain.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { renderAll, reportFailures } from "./lib/render_pages";

const BASELINE = "scripts/london_richness_baseline.json";
const WATCH = ["city:London", "cell:london/restaurants", "industry:restaurants", "hood:london"];

void (async () => {
  const pages = await renderAll();
  reportFailures(pages);
  const counts: Record<string, number> = {};
  for (const p of pages) {
    const key = `${p.kind}:${p.name}`;
    if (!WATCH.includes(key) || p.failed) continue;
    counts[key] = (p.html.match(/<h2\b/g) ?? []).length + (p.html.match(/<h3\b/g) ?? []).length;
  }

  if (process.argv.includes("--write")) {
    writeFileSync(BASELINE, JSON.stringify(counts, null, 2) + "\n", "utf8");
    console.log(`wrote ${BASELINE}: ${JSON.stringify(counts)}`);
    process.exit(0);
  }

  const base = JSON.parse(readFileSync(BASELINE, "utf8")) as Record<string, number>;
  const lost = Object.entries(base).filter(([k, v]) => (counts[k] ?? 0) < v);
  if (lost.length) {
    console.error(`\nFAIL , a London page lost sections. This floor only rises.\n`);
    for (const [k, was] of lost) console.error(`  ${k}: ${was} -> ${counts[k] ?? 0}`);
    console.error(`\nRulebook v2 §2: a page of dashes is a failure, not a virtue.\n`);
    process.exit(1);
  }
  const gained = Object.entries(counts).filter(([k, v]) => v > (base[k] ?? 0));
  console.log(
    gained.length
      ? `PASS london-richness , gained on ${gained.map(([k, v]) => `${k} ${base[k]}->${v}`).join(", ")}. Run --write to raise the floor.`
      : `PASS london-richness , unchanged.`,
  );
})();
```

- [ ] **Step 2: Seed the baseline at today's counts and negative-test it**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/verify_london_richness.ts --write
```

Then edit `london_richness_baseline.json` by hand, raise one number by five, re-run without `--write`, and **confirm it FAILS**. Restore the file afterwards. A gate that has never been seen to fail is not known to work.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify_london_richness.ts scripts/london_richness_baseline.json && git commit -m "gate: the four London pages may only gain sections (rulebook v2 §2, §46)"
```

---

## Task 6: Build, one section per subagent

**The core loop. One fresh implementer per section. Never batch. Never two pages at once.**

Order within a page: **every `CONNECT` first, then every `REPLACE`, then every `rework`.** Connects are cheap and they are the fastest route to a page that reads whole.

**Files:** the section's component and, when a `CONNECT` or `REPLACE`, its adapter.

- [ ] **Step 1: Dispatch one implementer with a complete brief**

The brief carries, verbatim, so the implementer never has to go looking:

1. The section's inventory row.
2. Its replacement decision file, if it has one.
3. **The rulebook rules that bind it**, quoted, not referenced. Always §0, §3, §11, §14, §17, §21, §26, §29A, §32, §37. Plus the form-specific ones.
4. The matching entries from `E:\atlas\rules\FOUNDER-VERDICTS.md`.
5. **The scope fence:** one section. Not another section, not the shared kit unless the inventory says so, never an `approved` registry entry.

**Two things the implementer must be told explicitly, because both were got wrong today:**

- **Read the module that produces every number before using it.** The city trade ranking looked usable until its score turned out to blend a banned per-city margin with a term its own comment labels crowding.
- **Never guess an identifier from a sibling module.** A filter written from a neighbouring file's naming matched nothing on every city, silently.

- [ ] **Step 2: Machine gates**

```bash
npx tsc --noEmit && npm run prebuild:serial
```

Expected: 116 passed, 0 failed.

- [ ] **Step 3: Measure the blast radius if a shared file changed**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/sweep_empty_chapters.tsx
```

**§42 is a fence, not a preference.** A kit change is allowed when a London section needs it, and its effect on every other page must be looked at, not assumed.

- [ ] **Step 4: Re-render the same session, and LOOK at it**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx
node scripts/shoot_live.mjs "file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html" scratchpad/shots --widths 375,768,1280 --settle 800 --prefix S-
```

**Open the images and read them.** Two faults in a section written today, a repeated title and an item stranded beside a blank half, were both invisible to 116 gates and obvious in the picture.

- [ ] **Step 5: Adversarial panel, three lenses, before the founder**

Three judges on the changed section, each armed with `FOUNDER-VERDICTS.md` and the approved crops:

1. **Rulebook lens** , cite the rule number for every objection or withdraw it.
2. **Corpus lens** , has he rejected something like this before? Quote the entry.
3. **Universality lens** , §21: does this hold for Kinshasa, Dhaka, Tirana, La Paz?

**A judge that cannot cite a rule or a corpus entry has no objection.** Two of three refusing sends it back to step 1.

- [ ] **Step 6: Commit, citing the law**

```bash
git commit -m "city: <section> connects <block> already carried (rulebook v2 §3, §43)"
```

- [ ] **Step 7: Next section. Never two at once.**

---

## Task 7: The founder's touchpoint, per page

- [ ] **Step 1: Build the review sheet for the finished page**

Every changed section, before and after, at 375 and 1280, one APPROVE/REJECT control each.

- [ ] **Step 2: Hand over one file. No server, no browser, no dashboard.**

- [ ] **Step 3: Apply the pasted verdict string**

APPROVE locks the section in the registry and its crop becomes the new baseline. REJECT records the reason in `FOUNDER-VERDICTS.md` and requeues it. **A bare REJECT with no reason is legal.**

- [ ] **Step 4: If a verdict changes a rule, edit the rulebook IN PLACE first**

Version bump, reversal logged in the changelog table, **before** any code is written to it.

---

## Task 8: Wire the gates, raise the floor, and only then move on

- [ ] **Step 1: Confirm the page's omissions are answered**

```bash
npx tsx scripts/verify_no_silent_omission.ts
```

- [ ] **Step 2: Register both new gates**

Add to `GATES` in `scripts/prebuild_all.ts`:

```js
  { name: "no-silent-omission", script: "scripts/verify_no_silent_omission.ts" },
```

- [ ] **Step 3: Raise the richness floor to the new counts**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/verify_london_richness.ts --write
```

- [ ] **Step 4: Regenerate counts and run the chain**

```bash
npx tsx scripts/counts.ts --write && npm run prebuild:serial
```

- [ ] **Step 5: Build and report the REAL exit code**

```bash
npm run build > scratchpad/build.log 2>&1; echo "EXIT=$?"
```

**Do not chain anything after `npm run build` that can mask its exit code.** A failed build was reported as a success on 2026-08-24 because a trailing `tail` returned zero.

- [ ] **Step 6: Move to the next London page. Repeat Tasks 2 through 8.**

**Page order: city, then trade, then neighbourhood, then trade-across-places.** City first because it is furthest from the baseline. Neighbourhood third despite being closest, because its districts carry coordinates and the map that self-omits for want of them is the single biggest visual win in the vertical.

---

## What this plan will not do

- **It will not touch a second vertical.** London/UK only.
- **It will not run file-by-file sweeps.** §43, and it is what produced the gap.
- **It will not delete a section** to make a rule pass. §41, two grounds only.
- **It will not invent a visual or a metric.** §0. Forms come from `FORM-CATALOG.md`, the kit, or the July-3 baseline.
- **It will not use a number without reading the module that produces it.**
- **It will not skip the review cycle.** §48.

---

## Self-review

**Spec coverage.** Four asks. *A full plan for the next few hours*: eight tasks, each with runnable commands and complete code. *Detailed backend*: Tasks 1, 3, 4 and 5 are all backend, and Task 1 exists specifically because the backend already holds more than the pages show. *Massive advancement, deep and broad*: the target is the July-3 bar on four pages, which is between two and six times the current content, and the CONNECT verdict is what makes that reachable in hours rather than weeks. *One vertical, unique pages*: §42 is the first rule in §1, the page order is fixed, and Task 6 step 3 measures the blast radius whenever a shared file is touched.

**Placeholder scan.** Task 6 steps 1 and 5 describe briefs and judges rather than printing code, because both are prompts to subagents and their content is the quoted rulebook, which already exists on disk. Everything else that changes code shows the code.

**Type consistency.** `renderAll`, `text` and `reportFailures` come from the existing shared renderer and are used with those names in Tasks 1 and 5. The five verdict words are defined in Task 2 and used in Tasks 3 and 6. The page keys (`city:London`, `cell:london/restaurants`, `industry:restaurants`, `hood:london`) are identical in Tasks 1 and 5.

**The gap I am naming rather than hiding.** The four July-3 baselines are single HTML files of about 3MB each, and their character counts include navigation and footer chrome that the current measurements do not. **The ratios in §0 are therefore an upper bound on the gap, not a precise multiple.** Task 2 step 3 replaces the ratio with a named list of missing sections per page, which is the number the work is actually driven by.
