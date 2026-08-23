# Autonomous Critique and Optimisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Find and fix the whole-page faults the one-section-at-a-time loop is structurally blind to — repeated figures, contradicting figures, headings that open onto nothing, sections that reach no reader — then finish the twenty open sections with that knowledge in hand, and leave a deploy pack the founder can act on in two minutes.

**Architecture:** Six *site-wide sweeps* run before any more per-section work. Each sweep is a script that renders real page bodies through the real adapters and measures one property across all of them at once. **Every sweep must first find a defect I already found by hand** — a calibration case — before its zeroes are trusted. The sweep results then triage the twenty open rows: dead ones close in a batch with evidence, live ones queue for the existing loop, unchanged.

**Tech Stack:** Existing harness only. `renderToStaticMarkup` + `scripts/tsconfig.harness.json`, the four real adapters (`buildSpineCellSeed`, `buildSpineCitySeed`, `buildSpineIndustrySeed`, `buildSpineHoodSeed`), the Tailwind CLI, `scripts/shoot_live.mjs`, Playwright for measurement. No new dependencies.

---

## Why this plan exists, and what changed

The founder is away from the computer and cannot do dashboard work. His instruction: *"continue on your own... optimization. Look. Critic the pages. Try to understand mistakes. Overlapping. Idiotic mistakes and so on."*

**"Overlapping" and "idiotic mistakes" are not things the loop can see.** The loop reads one surface per iteration, on purpose. Every cross-cutting fault it has found — no heading outline on any page, a rail drawn around nothing, the type-ladder trap, a rent comparison wrong on 251 of 252 cities — was found **by accident**, while looking at something else. Four of those were one glance away from shipping.

This plan makes that deliberate.

### Ground truth, counted not remembered

Counted from the ledger this session, because **the ledger's own summary line is wrong**:

| | ledger says | actually |
|---|---|---|
| replaced or retired | 7 | **5** |
| kept with evidence | 28 | 28 |
| blocked | 13 | **12** |
| still to do | 17 | **20** |

66 rows, one void. Phase 0 fixes this before anything reads it again.

### The one thing this plan cannot do

**The rebuilt pages are still switched off.** Every fix in this plan, like the 36 before it, reaches nobody until four environment variables are set in the hosting dashboard. That is the founder's to do and it needs no code. Phase 5 prepares it so it takes two minutes.

---

## File Structure

**New scripts, one responsibility each.** They live beside the 43 probe/proof scripts already in `scripts/`, follow the same header convention (what it measures, and *what it cannot distinguish*), and none of them is wired into the gate chain until Phase 4 decides which deserve to be.

| Path | Responsibility |
|---|---|
| `scripts/lib/render_pages.tsx` | The one place that renders all four page types through their real adapters for a fixed sample of entities. Every sweep imports this; none of them re-derives it. |
| `scripts/sweep_dead_sections.tsx` | Which section titles never appear in any real render. |
| `scripts/sweep_empty_chapters.tsx` | Which chapter headings open onto nothing. |
| `scripts/sweep_repeated_figures.tsx` | Which figures are printed more than once on one page. |
| `scripts/sweep_cross_page_figures.tsx` | Where the same claim disagrees between two pages. |
| `scripts/sweep_scale_ends.mjs` | Marks positioned by percentage with no edge handling. |
| `scripts/sweep_scaling_svg.mjs` | Fixed-viewBox drawings that stretch their own geometry. |
| `docs/loop/artifacts/sweeps/SWEEP-REPORT-2026-08-23.html` | One sheet carrying all six results, for the founder. |
| `docs/DEPLOY-PACK-spine-flags.md` | The two-minute deploy instruction, written while he is away. |

**Modified:**

| Path | Change |
|---|---|
| `docs/loop/shadcn-upgrade/LEDGER.md` | Corrected count; sweep results recorded; triaged rows closed. |

---

## Task 0: Correct the ledger's own arithmetic

The ledger is the loop's memory. It currently reports three of its four figures wrong. Fix before anything else reads it.

**Files:**
- Modify: `docs/loop/shadcn-upgrade/LEDGER.md` (the `## The count` section)

- [ ] **Step 1: Write the counter that will keep it honest**

Create `scripts/count_ledger.mjs`:

```js
/**
 * count_ledger , count the ledger's rows by status.
 *
 * The summary line in LEDGER.md was hand-typed and drifted: on 2026-08-23 it
 * claimed 7 replaced, 13 blocked and 17 to go against a real 5, 12 and 20. The
 * loop reads that line to decide how much is left, so a wrong line is a wrong
 * plan.
 *
 * WHAT THIS CANNOT DISTINGUISH: a row whose status cell contains two words it
 * recognises. Those are reported separately rather than guessed at.
 *
 *   node scripts/count_ledger.mjs
 */
import { readFileSync } from "node:fs";

const rows = readFileSync("docs/loop/shadcn-upgrade/LEDGER.md", "utf8")
  .split("\n")
  .filter((l) => /^\| \d+[ab]? \|/.test(l));

const tally = { TODO: 0, BLOCKED: 0, "KEPT/FIXED": 0, "REPLACED/RETIRED": 0, VOID: 0 };
const odd = [];

for (const line of rows) {
  const status = line.replace(/\*/g, "").split("|").slice(1, -1).pop().trim();
  if (status.includes("TODO")) tally.TODO++;
  else if (status.includes("VOID")) tally.VOID++;
  else if (status.includes("BLOCKED") && !status.includes("FIXED")) tally.BLOCKED++;
  else if (status.includes("DONE-REPLACED") || status.includes("RETIRED")) tally["REPLACED/RETIRED"]++;
  else if (status.includes("DONE-KEPT") || status.includes("FIXED") || status.includes("LOCKED"))
    tally["KEPT/FIXED"]++;
  else odd.push(status);
}

console.log(`\n  ${rows.length} rows`);
for (const [k, v] of Object.entries(tally)) console.log(`    ${k.padEnd(18)} ${v}`);
if (odd.length) {
  console.log(`\n  ${odd.length} status cell(s) this counter does not recognise:`);
  for (const o of odd) console.log(`    ${o}`);
}
console.log("");
```

- [ ] **Step 2: Run it and confirm it disagrees with the ledger**

Run:

```bash
node scripts/count_ledger.mjs
```

Expected: `66 rows`, `TODO 20`, `BLOCKED 12`, `KEPT/FIXED 28`, `REPLACED/RETIRED 5`, `VOID 1`, and no unrecognised cells. This disagrees with the ledger's line, which is the point.

- [ ] **Step 3: Correct the ledger's count section**

Replace the summary line in `## The count` with the counted figures, and add one sentence recording that the hand-typed line had drifted and by how much. Do not silently correct it: the drift is itself a finding about hand-maintained counts, and this repo has already paid for that lesson once (see `CLAUDE.md`, the generated-counts block).

- [ ] **Step 4: Commit**

```bash
git add scripts/count_ledger.mjs docs/loop/shadcn-upgrade/LEDGER.md && git commit -m "ledger: count the rows instead of typing the count"
```

---

## Task 1: One renderer, shared by every sweep

Six sweeps that each re-derive "render the real pages" would drift apart within a day. One module, imported by all.

**Files:**
- Create: `scripts/lib/render_pages.tsx`

- [ ] **Step 1: Write it**

```tsx
/**
 * render_pages , render every spine page type from REAL data, once, for the
 * sweeps to share.
 *
 * WHAT THIS CANNOT DISTINGUISH: it renders a FIXED SAMPLE of entities, not all
 * of them. A fault that depends on one unusual city will be missed. It answers
 * "does this happen across a spread of real pages", never "does this never
 * happen". Every sweep that imports this must repeat that limit in its own
 * output rather than assume the reader knows it.
 *
 * THE SAMPLE IS DELIBERATE: four continents, and both a high-income and a
 * low-income city, because several faults found by hand only appear at one end
 * (the rent-against-income gap is worst at a low income; the peer strip's label
 * crowding needs two cities sharing an index).
 */
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { buildSpineCitySeed } from "../../src/lib/spine/adapt_city";
import { buildSpineCellSeed } from "../../src/lib/spine/adapt_cell";
import { buildSpineIndustrySeed } from "../../src/lib/spine/adapt_industry";
import { buildSpineHoodSeed } from "../../src/lib/spine/adapt_hood";
import { SpineCityBody } from "../../src/components/spine/city/city-view";
import { SpineCellBody } from "../../src/components/spine/cell/cell-view";
import { SpineIndustryBody } from "../../src/components/spine/industry/industry-view";
import { SpineHoodBody } from "../../src/components/spine/hood/hood-view";

export type Page = { kind: string; name: string; html: string };

export const CITIES = ["london", "tokyo", "new-york", "sao-paulo", "berlin", "mumbai", "lagos", "sydney"];
export const CELLS: Array<[string, string, string]> = [
  ["gb", "london", "restaurants"],
  ["gb", "london", "hair-salons"],
  ["us", "new-york", "restaurants"],
];
export const INDUSTRIES = ["restaurants", "hair-salons", "cafes"];
export const HOODS = ["london"];

function draw(C: unknown, data: any): string {
  try {
    return renderToStaticMarkup(React.createElement(C as React.FC<{ data: any }>, { data }));
  } catch (e: any) {
    /* A page that cannot render in this harness is REPORTED, never counted as
       clean. The map is a client component and asks Next for a router that does
       not exist outside a request, which is why the bundled samples cannot be
       rendered whole here. */
    return `<!--RENDER-FAILED ${String(e?.message ?? e).slice(0, 80)}-->`;
  }
}

export async function renderAll(): Promise<Page[]> {
  const out: Page[] = [];
  for (const slug of CITIES) {
    const d = await buildSpineCitySeed(slug);
    if (d) out.push({ kind: "city", name: d.meta?.city ?? slug, html: draw(SpineCityBody, d) });
  }
  for (const [c, g, i] of CELLS) {
    const d = await buildSpineCellSeed(c, g, i);
    if (d) out.push({ kind: "cell", name: `${g}/${i}`, html: draw(SpineCellBody, d) });
  }
  for (const slug of INDUSTRIES) {
    const d = await buildSpineIndustrySeed(slug);
    if (d) out.push({ kind: "industry", name: slug, html: draw(SpineIndustryBody, d) });
  }
  for (const slug of HOODS) {
    const d = await buildSpineHoodSeed(slug);
    if (d) out.push({ kind: "hood", name: slug, html: draw(SpineHoodBody, d) });
  }
  return out;
}

/** Visible text of a render, whitespace collapsed. */
export const text = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/** Every figure a reader can see: money, percentages, plain numbers with units. */
export function figures(html: string): string[] {
  return text(html).match(/\$[\d.,]+[KMB]?|\b\d[\d.,]*\s?(?:%|pp|mo|K|M|B)\b/g) ?? [];
}
```

- [ ] **Step 2: Prove it renders something, and report what it cannot**

Create `scripts/_render_smoke.tsx`, run it, then delete it:

```tsx
import { renderAll, text } from "./lib/render_pages";
void (async () => {
  const pages = await renderAll();
  for (const p of pages) {
    const failed = p.html.includes("RENDER-FAILED");
    console.log(`  ${p.kind.padEnd(9)} ${p.name.padEnd(22)} ${failed ? "COULD NOT RENDER" : `${text(p.html).length} chars`}`);
  }
})();
```

Run:

```bash
export $(grep -E "^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=" .env.local | xargs -d '\n'); npx tsx --tsconfig scripts/tsconfig.harness.json scripts/_render_smoke.tsx
```

Expected: the eight cities render. **If any page type reports COULD NOT RENDER, that is a finding, not a blocker** — record which and why, and let the sweeps run on the rest. Do not fake a render to fill a gap.

- [ ] **Step 3: Commit**

```bash
git add scripts/lib/render_pages.tsx && git commit -m "sweeps: one renderer for every page type, shared"
```

---

## Task 2: Sweep — sections that reach no reader

Eleven of these have been found one at a time, an iteration each. This finds the rest at once, and tells the loop which of the twenty open rows are already dead.

**Files:**
- Create: `scripts/sweep_dead_sections.tsx`

- [ ] **Step 1: Write the sweep**

```tsx
/**
 * sweep_dead_sections , which section titles never reach a reader?
 *
 * A section here is a card with a title. When the module that builds a real page
 * drops that card's figures, the card omits itself, correctly, and its title is
 * never rendered. Eleven such sections have been found one at a time, an
 * iteration each. This finds the rest in one pass.
 *
 * WHAT THIS CANNOT DISTINGUISH: a title that is absent because the section
 * omitted from a title that is absent because this sample of entities happens
 * not to trigger it. It reports NEVER SEEN ACROSS THE SAMPLE, which is a
 * candidate, not a verdict. Each has to be opened, exactly like the table sweep.
 *
 * CALIBRATION: it must report "Rent against income" and "The lease terms", both
 * confirmed dead by hand. If it does not, the instrument is broken and its
 * zeroes mean nothing.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/sweep_dead_sections.tsx
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";
import { renderAll, text } from "./lib/render_pages";

/** Every literal section title written in the spine source. */
function declaredTitles(): Map<string, string> {
  const titles = new Map<string, string>();
  const files: string[] = [];
  (function walk(d: string) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      if (extname(p) === ".tsx") files.push(p);
    }
  })("src/components/spine");
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    const rel = relative(process.cwd(), f).split(sep).join("/");
    /* <Head ...>Title</Head> and <Rail kicker="Title" ... /> are the two forms a
       section title takes in this codebase. Anything interpolated is skipped:
       a title built from data is not a fixed string and cannot be searched for. */
    for (const m of src.matchAll(/<Head\b[^>]*>([^<{}]{3,60})<\/Head>/g)) titles.set(m[1].trim(), rel);
    for (const m of src.matchAll(/kicker="([^"{}]{3,60})"/g)) titles.set(m[1].trim(), rel);
  }
  return titles;
}

void (async () => {
  const pages = await renderAll();
  const rendered = pages.map((p) => ({ ...p, t: text(p.html) }));
  const titles = declaredTitles();

  const dead: Array<[string, string]> = [];
  const alive: Array<[string, number]> = [];
  for (const [title, file] of titles) {
    const hits = rendered.filter((p) => p.t.includes(title)).length;
    if (hits === 0) dead.push([title, file]);
    else alive.push([title, hits]);
  }

  console.log(`\n  ${titles.size} section titles declared in the spine`);
  console.log(`  ${alive.length} reach a reader on at least one of the ${pages.length} real pages rendered`);
  console.log(`  ${dead.length} reach NONE of them\n`);
  for (const [t, f] of dead.sort()) console.log(`    never seen   ${t.padEnd(34)} ${f}`);

  const calib = ["Rent against income", "The lease terms"];
  const missed = calib.filter((c) => !dead.some(([t]) => t === c));
  console.log(
    missed.length
      ? `\n  CALIBRATION FAILED. These are dead and this sweep did not say so: ${missed.join(", ")}.\n  Do not trust the list above.\n`
      : `\n  Calibration passed: both hand-confirmed dead sections are in the list.\n`,
  );
  console.log(
    `  Each is a CANDIDATE. This cannot tell a section that never renders from one\n` +
      `  this sample of entities does not happen to trigger. Open each before acting.\n`,
  );
})();
```

- [ ] **Step 2: Run it**

```bash
export $(grep -E "^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=" .env.local | xargs -d '\n'); npx tsx --tsconfig scripts/tsconfig.harness.json scripts/sweep_dead_sections.tsx
```

Expected: `Calibration passed`. If it prints `CALIBRATION FAILED`, stop and fix the instrument before reading its output — a sweep that misses a known positive has told you nothing.

- [ ] **Step 3: Commit**

```bash
git add scripts/sweep_dead_sections.tsx && git commit -m "sweep: sections that reach no reader, all at once"
```

---

## Task 3: Sweep — chapter headings that open onto nothing

Found by hand on the city page: **"The next move" renders with nothing under it on four of eight cities.** That is still unfixed and belongs to row 47. This generalises it to every page type.

**Files:**
- Create: `scripts/sweep_empty_chapters.tsx`

- [ ] **Step 1: Write the sweep**

```tsx
/**
 * sweep_empty_chapters , does any chapter heading open onto nothing?
 *
 * A chapter divider is a promise: a number, a title, a rule, and then the
 * sections it opens. The guard that decides whether the divider renders is
 * separate from the guards inside each section, so the two can disagree, and
 * what a reader gets is a numbered heading above a blank space.
 *
 * WHAT THIS CANNOT DISTINGUISH: a chapter holding an invisible empty container
 * from one holding nothing at all. It measures RENDERED TEXT between one heading
 * and the next, which is the right reading: the question is what a reader sees.
 *
 * CALIBRATION: it must report "The next move" empty on New York, Mumbai, Lagos
 * and Sydney, all four confirmed by hand.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/sweep_empty_chapters.tsx
 */
import { renderAll } from "./lib/render_pages";

function chapters(html: string) {
  const marks: Array<{ title: string; at: number; end: number }> = [];
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    marks.push({ title: m[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(), at: m.index, end: re.lastIndex });
  }
  return marks.map((mark, i) => {
    const slice = html.slice(mark.end, i + 1 < marks.length ? marks[i + 1].at : html.length);
    return { title: mark.title, chars: slice.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().length };
  });
}

void (async () => {
  const pages = await renderAll();
  const empties: Array<[string, string, string]> = [];
  for (const p of pages) {
    for (const c of chapters(p.html)) {
      if (c.chars === 0) empties.push([p.kind, p.name, c.title]);
    }
  }
  console.log(`\n  ${pages.length} real pages rendered`);
  console.log(`  ${empties.length} chapter heading(s) with nothing under them\n`);
  for (const [k, n, t] of empties) console.log(`    ${k.padEnd(9)} ${n.padEnd(22)} ${t}`);

  const want = ["New York", "Mumbai", "Lagos", "Sydney"];
  const got = empties.filter(([, n, t]) => t === "The next move").map(([, n]) => n);
  const missed = want.filter((w) => !got.includes(w));
  console.log(
    missed.length
      ? `\n  CALIBRATION FAILED. "The next move" is empty on ${missed.join(", ")} and this sweep did not say so.\n`
      : `\n  Calibration passed: all four hand-confirmed empty chapters are in the list.\n`,
  );
})();
```

- [ ] **Step 2: Run it**

```bash
export $(grep -E "^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=" .env.local | xargs -d '\n'); npx tsx --tsconfig scripts/tsconfig.harness.json scripts/sweep_empty_chapters.tsx
```

Expected: `Calibration passed`, and a list that includes the four known cities plus whatever else it finds on cell, industry and neighbourhood pages.

- [ ] **Step 3: Commit**

```bash
git add scripts/sweep_empty_chapters.tsx && git commit -m "sweep: chapter headings that open onto nothing"
```

---

## Task 4: Sweep — the same figure printed twice on one page

This is the founder's word: **overlapping**. Confirmed once by hand — a wage card printing three of its eight money figures twice — and never looked for anywhere else.

**Files:**
- Create: `scripts/sweep_repeated_figures.tsx`

- [ ] **Step 1: Write the sweep**

```tsx
/**
 * sweep_repeated_figures , which figures does one page print more than once?
 *
 * A reader meeting the same number twice on one page assumes they are two
 * different measurements that happen to agree, or that they have lost their
 * place. Neither is what the page means. One card is already known to print
 * three of its eight money figures twice.
 *
 * WHAT THIS CANNOT DISTINGUISH: a genuine repeat from a coincidence. Two
 * unrelated things can honestly both be $2.4K, and a figure repeated inside one
 * card as part of a total is not a fault. It reports a COUNT PER PAGE and the
 * surrounding words, so each can be judged; it does not judge.
 *
 * CALIBRATION: on the cell page it must report at least one money figure
 * appearing three or more times, the wage-bracket repeat confirmed by hand.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/sweep_repeated_figures.tsx
 */
import { renderAll, figures, text } from "./lib/render_pages";

void (async () => {
  const pages = await renderAll();
  let flagged = 0;
  for (const p of pages) {
    const counts = new Map<string, number>();
    for (const f of figures(p.html)) counts.set(f, (counts.get(f) ?? 0) + 1);
    const repeats = [...counts.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]);
    if (!repeats.length) continue;
    console.log(`\n  ${p.kind} / ${p.name}`);
    const t = text(p.html);
    for (const [fig, n] of repeats.slice(0, 8)) {
      flagged++;
      /* Show where the FIRST two land, so a repeat that is obviously innocent
         (a total restated beside its parts) can be dismissed without opening
         the file. */
      const first = t.indexOf(fig);
      const second = t.indexOf(fig, first + fig.length);
      console.log(`    ${fig.padEnd(10)} x${n}`);
      console.log(`      1: ...${t.slice(Math.max(0, first - 40), first + 40).trim()}...`);
      console.log(`      2: ...${t.slice(Math.max(0, second - 40), second + 40).trim()}...`);
    }
  }
  console.log(`\n  ${flagged} repeated figure(s) across ${pages.length} pages.`);
  console.log(
    `  A repeat is not automatically a fault: two honest measurements can agree, and\n` +
      `  a total restated beside its parts is correct. Each needs judging.\n`,
  );
})();
```

- [ ] **Step 2: Run it and judge the output by hand**

```bash
export $(grep -E "^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=" .env.local | xargs -d '\n'); npx tsx --tsconfig scripts/tsconfig.harness.json scripts/sweep_repeated_figures.tsx
```

Expected: a list per page. **Read every entry.** Write, in the ledger, how many were genuine repeats and how many were innocent — the ratio tells the next person whether this sweep is worth keeping.

- [ ] **Step 3: Commit**

```bash
git add scripts/sweep_repeated_figures.tsx && git commit -m "sweep: the same figure printed twice on one page"
```

---

## Task 5: Sweep — the same claim disagreeing between two pages

The sharpest possible version of "idiotic mistakes": London's median income on the city page, the cell page and the industry page come from three different modules. **Nothing has ever compared them.** The adapter's own comment already warns that one field name carries two different statistics.

**Files:**
- Create: `scripts/sweep_cross_page_figures.tsx`

- [ ] **Step 1: Write the sweep**

```tsx
/**
 * sweep_cross_page_figures , does the same claim disagree between two pages?
 *
 * A reader who reads the London city page and then a London restaurant page is
 * reading two modules that never speak to each other. The city adapter already
 * carries a written warning that one field name holds a median in one place and
 * a mean in another, and that "the gap between them is real". Nothing has ever
 * checked what a reader would see.
 *
 * WHAT THIS CANNOT DISTINGUISH: two figures that SHOULD differ from two that
 * should not. A city-wide median and a trade-specific median are different
 * claims and may honestly differ. It reports PAIRS THAT SHARE A LABEL AND NOT A
 * VALUE, for judging; it does not decide which is right.
 *
 *   npx tsx --tsconfig scripts/tsconfig.harness.json scripts/sweep_cross_page_figures.tsx
 */
import { renderAll, text } from "./lib/render_pages";

/** Claims worth comparing: a label a reader would read as the same question. */
const CLAIMS = [
  { label: "median income", re: /median income[^$]{0,40}(\$[\d.,]+[KMB]?)/i },
  { label: "one-bed rent", re: /one-bed rent[^$]{0,40}(\$[\d.,]+[KMB]?)/i },
  { label: "cost to open", re: /cost to open[^$]{0,40}(\$[\d.,]+[KMB]?)/i },
  { label: "rent a month", re: /(\$[\d.,]+[KMB]?)\s*a month/i },
];

void (async () => {
  const pages = await renderAll();
  /* Group by the PLACE a page is about, because that is what makes two pages
     comparable. A London cell page and the London city page answer about the
     same city; a Tokyo page does not. */
  const place = (p: { kind: string; name: string }) =>
    p.kind === "city" ? p.name.toLowerCase() : p.name.split("/")[0].toLowerCase();

  const byPlace = new Map<string, Array<{ kind: string; name: string; t: string }>>();
  for (const p of pages) {
    const k = place(p);
    if (!byPlace.has(k)) byPlace.set(k, []);
    byPlace.get(k)!.push({ kind: p.kind, name: p.name, t: text(p.html) });
  }

  let conflicts = 0;
  for (const [k, group] of byPlace) {
    if (group.length < 2) continue;
    for (const claim of CLAIMS) {
      const found = group
        .map((g) => ({ where: `${g.kind}/${g.name}`, v: (g.t.match(claim.re) ?? [])[1] }))
        .filter((x) => x.v);
      const distinct = new Set(found.map((f) => f.v));
      if (found.length >= 2 && distinct.size > 1) {
        conflicts++;
        console.log(`\n  ${k} , "${claim.label}" reads differently on two pages:`);
        for (const f of found) console.log(`    ${f.where.padEnd(24)} ${f.v}`);
      }
    }
  }
  console.log(`\n  ${conflicts} claim(s) that disagree across pages about the same place.`);
  console.log(
    `  A disagreement is not automatically a fault: a city-wide figure and a\n` +
      `  trade-specific one are different questions. Each needs judging, and the\n` +
      `  judgement belongs in the ledger with its reason.\n`,
  );
})();
```

- [ ] **Step 2: Run it**

```bash
export $(grep -E "^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=" .env.local | xargs -d '\n'); npx tsx --tsconfig scripts/tsconfig.harness.json scripts/sweep_cross_page_figures.tsx
```

Expected: either a list of conflicting pairs, or zero. **Zero here is a real and reportable result** — it would be the first evidence the three modules agree.

- [ ] **Step 3: Commit**

```bash
git add scripts/sweep_cross_page_figures.tsx && git commit -m "sweep: the same claim disagreeing between two pages"
```

---

## Task 6: Sweep — the two repeated drawing faults

Both already found four times each, one iteration at a time. These are source scans, not renders, so they run in a second.

**Files:**
- Create: `scripts/sweep_scale_ends.mjs`
- Create: `scripts/sweep_scaling_svg.mjs`

- [ ] **Step 1: Write the scale-end sweep**

```js
/**
 * sweep_scale_ends , marks placed by percentage with nothing keeping them inside
 * the box.
 *
 * A mark or a label centred on its own value at the very end of a scale has half
 * of it outside the card. FOUR separate scales in this codebase have had it. The
 * signature is a left offset written as a percentage together with a half-width
 * translate, and no sign of a clamp.
 *
 * WHAT THIS CANNOT DISTINGUISH: a scale whose values can never reach either end
 * from one whose values can. It reports the SHAPE, not the risk.
 *
 *   node scripts/sweep_scale_ends.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (extname(p) === ".tsx") files.push(p);
  }
})("src/components");

const hits = [];
for (const f of files) {
  const s = readFileSync(f, "utf8");
  const rel = relative(process.cwd(), f).split(sep).join("/");
  const pct = [...s.matchAll(/left:\s*`\$\{[^`]*\}%`/g)].length;
  if (!pct) continue;
  const centred = /-translate-x-1\/2/.test(s);
  /* A clamp looks like a comparison against a threshold near an end, or a
     Math.min/max around the position. Either counts as handled. */
  const clamped = /Math\.(min|max)\(/.test(s) || />\s*8[0-9]\b|<\s*1[0-9]\b/.test(s);
  if (centred && !clamped) hits.push([rel, pct]);
}

console.log(`\n  ${hits.length} file(s) place a mark by percentage, centre it, and show no clamp\n`);
for (const [f, n] of hits) console.log(`    ${String(n).padStart(2)} placement(s)   ${f}`);
console.log(
  `\n  This reports a SHAPE, not a defect: a scale whose values never reach an end\n` +
    `  is safe. Open each and check what its data can actually do.\n`,
);
```

- [ ] **Step 2: Write the scaling-drawing sweep**

```js
/**
 * sweep_scaling_svg , drawings that stretch their own geometry with the card.
 *
 * A fixed viewBox on a full-width element scales EVERYTHING: stroke widths,
 * marker radii, the height of the box. Measured on one card, the dots went from
 * a 2.5 pixel radius on a phone to 6.9 at reading width and the box from 67
 * pixels tall to 182. Two more charts in this codebase were rebuilt for the same
 * reason.
 *
 * WHAT THIS CANNOT DISTINGUISH: a drawing that SHOULD scale (a decorative shape,
 * a logo) from one that should not (anything carrying a measurement).
 *
 *   node scripts/sweep_scaling_svg.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, sep } from "node:path";

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (extname(p) === ".tsx") files.push(p);
  }
})("src/components");

const hits = [];
for (const f of files) {
  const s = readFileSync(f, "utf8");
  const rel = relative(process.cwd(), f).split(sep).join("/");
  for (const m of s.matchAll(/<svg\b[^>]*>/g)) {
    const tag = m[0];
    if (!/viewBox/.test(tag)) continue;
    const full = /className="[^"]*\bw-full\b/.test(tag);
    /* An explicit height stops the box growing; without one the browser takes the
       height from the viewBox ratio and the whole drawing scales. */
    const fixedHeight = /\bh-\[\d/.test(tag) || /height=/.test(tag);
    if (full && !fixedHeight) hits.push([rel, tag.slice(0, 90)]);
  }
}

console.log(`\n  ${hits.length} full-width drawing(s) with a fixed viewBox and no fixed height\n`);
for (const [f, tag] of hits) console.log(`    ${f}\n      ${tag}`);
console.log(
  `\n  A drawing that carries a measurement should not scale its own geometry.\n` +
    `  A decorative one may. Open each.\n`,
);
```

- [ ] **Step 3: Run both**

```bash
node scripts/sweep_scale_ends.mjs && node scripts/sweep_scaling_svg.mjs
```

Expected: two candidate lists. Neither is a verdict.

- [ ] **Step 4: Commit**

```bash
git add scripts/sweep_scale_ends.mjs scripts/sweep_scaling_svg.mjs && git commit -m "sweep: the two repeated drawing faults"
```

---

## Task 7: One sheet carrying all six results

The founder opens files himself. Six terminal outputs are not a deliverable.

**Files:**
- Create: `scripts/build_sweep_report.mjs`
- Create: `docs/loop/artifacts/sweeps/SWEEP-REPORT-2026-08-23.html`

- [ ] **Step 1: Capture each sweep's output to a file**

```bash
mkdir -p scratchpad/sweeps && export $(grep -E "^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=" .env.local | xargs -d '\n') && for s in dead_sections empty_chapters repeated_figures cross_page_figures; do npx tsx --tsconfig scripts/tsconfig.harness.json scripts/sweep_$s.tsx > scratchpad/sweeps/$s.txt 2>&1; done && for s in scale_ends scaling_svg; do node scripts/sweep_$s.mjs > scratchpad/sweeps/$s.txt 2>&1; done && ls -la scratchpad/sweeps/
```

- [ ] **Step 2: Write the report builder**

```js
/**
 * build_sweep_report , one sheet carrying all six sweep results.
 *
 *   node scripts/build_sweep_report.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const OUT = "docs/loop/artifacts/sweeps/SWEEP-REPORT-2026-08-23.html";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const read = (n) => esc(readFileSync(`scratchpad/sweeps/${n}.txt`, "utf8"));

const SECTIONS = [
  ["Sections that reach no reader", "dead_sections",
   "A card whose figures are dropped before the page is built omits itself, correctly. Eleven of these were found one at a time, an iteration each. This is the rest."],
  ["Chapter headings that open onto nothing", "empty_chapters",
   "A numbered heading with a blank space under it. Found by hand on four cities and never looked for on the other page types."],
  ["The same figure printed twice on one page", "repeated_figures",
   "The founder's word for this is overlapping. A reader meeting the same number twice assumes they have lost their place."],
  ["The same claim disagreeing between two pages", "cross_page_figures",
   "Three modules answer about the same city and have never been compared. Zero here would be the first evidence they agree."],
  ["Marks that can fall outside their box", "scale_ends",
   "Four separate scales in this codebase have had a mark or a label centred at the very end with half of it outside the card."],
  ["Drawings that stretch their own geometry", "scaling_svg",
   "Measured on one card: marker dots from a 2.5 pixel radius on a phone to 6.9 at reading width, and the box from 67 pixels tall to 182."],
];

const html = `<!doctype html>
<meta charset="utf-8">
<title>Six sweeps across the whole site</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;padding:32px 18px 64px;background:#fafaf9;color:#1b1b1a;
       font-family:Inter,ui-sans-serif,system-ui,sans-serif;font-size:14px;line-height:1.55}
  h1{font-size:23px;font-weight:500;letter-spacing:-.01em;margin:0 0 10px}
  h2{font-size:16px;font-weight:500;margin:34px 0 4px}
  p{color:#57575b;margin:0 0 10px;max-width:70ch}
  pre{background:#fff;border:1px solid #e7e2df;border-radius:10px;padding:12px 14px;
      overflow-x:auto;font-size:12px;line-height:1.5;font-family:ui-monospace,monospace}
  footer{margin-top:40px;font-size:12px;color:#8c8c8a;max-width:70ch}
</style>
<h1>Six sweeps across the whole site</h1>
<p><b>These look for the faults the section-by-section pass cannot see.</b> It reads
one surface at a time, on purpose, so anything that only shows up across a whole
page, or between two pages, has been found by accident until now. Four such faults
were one glance away from shipping.</p>
<p><b>Every list below is candidates, not verdicts</b>, and each sweep says in its own
words what it cannot tell apart. Four of the six also carry a calibration: they are
pointed at a fault already confirmed by hand, and if they miss it their zeroes mean
nothing.</p>
${SECTIONS.map(([title, file, blurb]) => `<h2>${title}</h2>\n<p>${blurb}</p>\n<pre>${read(file)}</pre>`).join("\n")}
<footer>Nothing on this sheet is published anywhere. Every figure in it was
produced by rendering the real pages through the real data modules.</footer>
`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, html, "utf8");
console.log(`  wrote ${OUT}`);
```

- [ ] **Step 3: Build it and look at it at three widths**

```bash
node scripts/build_sweep_report.mjs && node scripts/shoot_live.mjs "file:///E:/atlas/website/docs/loop/artifacts/sweeps/SWEEP-REPORT-2026-08-23.html" scratchpad/shots-sweeps --widths 320,760,1024 --settle 500 --prefix SWEEP-
```

Expected: three images. **Open them and read them.** A report that does not fit on a phone is not a report.

- [ ] **Step 4: Commit and send the sheet to the founder**

```bash
git add scripts/build_sweep_report.mjs docs/loop/artifacts/sweeps/ && git commit -m "sweeps: one sheet carrying all six results"
```

---

## Task 8: Triage the twenty open rows against the sweep results

This is where the sweeps pay for themselves. Some of the twenty are already dead and can close in one batch with evidence, instead of costing an iteration each.

**Files:**
- Modify: `docs/loop/shadcn-upgrade/LEDGER.md`

- [ ] **Step 1: Cross the dead-section list against the twenty open rows**

For each of rows 40 to 63 still marked TODO, check whether its section title appears in the `sweep_dead_sections` list. **Open each match and confirm by hand** — the sweep reports candidates. A row confirmed dead closes as `DONE-KEPT` with the evidence line: which pages were rendered, and that the title appeared on none of them.

- [ ] **Step 2: Write the triage into the ledger as one block**

Record, in the ledger, three lists: rows closed by the sweep (with the count of pages checked), rows the sweep touched but that survived opening (with why), and rows the sweep says nothing about. **State the number of iterations this saved.** If it saved none, say that too — it is the honest measure of whether the sweeps were worth building.

- [ ] **Step 3: Re-run the counter and correct the count section**

```bash
node scripts/count_ledger.mjs
```

- [ ] **Step 4: Commit**

```bash
git add docs/loop/shadcn-upgrade/LEDGER.md && git commit -m "ledger: triage the open rows against the sweeps"
```

---

## Task 9: Run the loop on what survives

Unchanged process, one surface per iteration, in ledger order. The sweeps do not replace it; they tell it where to look first.

**Files:** whichever the row touches.

- [ ] **Step 1: Take the first surviving TODO row in ledger order**

Row 40 is next unless triage closed it. It already has evidence gathered: its bar claims to sum to 100 with nothing checking that it does, and all eight cities happen to land on exactly 100 today. **That is the fourth "correct by coincidence" this week** and the fix is the one rule 5(e) asks for: draw nothing when the identity does not close.

- [ ] **Step 2: Run the full iteration as specified in the loop prompt**

Research the surface and the module that makes its numbers, search the catalogue, decide with a recorded reason, then all seven quality checks: typecheck, the 114 gates serially, content diff, render and **look at it** at 320/480/760, assert the identity, keyboard and no-pointer, and the adversarial sentence.

- [ ] **Step 3: Deliver the sheet, update the ledger, commit, stop**

One commit per surface, so any of it reverts alone.

- [ ] **Step 4: Repeat for each surviving row, in order**

Never reorder the ledger to reach something easier.

---

## Task 10: Open the twelve table candidates

**The library's landing zone, and the thing the founder specifically asked for.** Three times the paid catalogue has been the right answer and all three were the same fault: a section laid out as a table with no table under it. The sweep says up to twelve more, across 27 pinned grids.

**Files:**
- Modify: whichever candidate is a real table.

- [ ] **Step 1: List the candidates**

```bash
node scripts/probe_tabular_surfaces.mjs
```

- [ ] **Step 2: Open them in order of reach, most-used file first**

`src/components/spine/kit.tsx` (4 grids) and `src/components/spine/kit-index.tsx` (5) come first: they are used by every page, so one fix there lands everywhere. Then `city-view.tsx` (4), `NeighborhoodExplorer.tsx` (4), then the rest.

- [ ] **Step 3: For each real table, replace with the library's Table primitive**

The pattern is established and identical in all three previous cases: cells down the side, one measure across the top, a header row drawn to look like one with no table under it. Wrap in the primitive, keep every word and figure, let the figure column size itself instead of being pinned, and move any row-level link onto the first cell (a row cannot be wrapped in a link inside a table).

- [ ] **Step 4: For each one that is NOT a table, record why in the ledger**

Two candidates have already been opened and were false positives. **Recording the misses is what makes the twelve an honest number rather than a hopeful one.**

- [ ] **Step 5: One commit per candidate**

---

## Task 11: The deploy pack, written while he is away

He cannot do dashboard work right now. He can do it in two minutes when he is back, if the instruction is already written.

**Files:**
- Create: `docs/DEPLOY-PACK-spine-flags.md`

- [ ] **Step 1: Write it**

The document must carry, in plain language with no file paths: the four environment variable names and their value; where they go; that a redeploy is needed after; the single command that proves it worked afterwards; and the recommendation to switch the city page on first, alone, because that is the page this loop has just been through end to end.

It must also carry **the second, separate question**: there is no build-command file in the repo, so whether the 114 gates run on a deploy is a dashboard setting nobody has checked. One line of configuration settles it permanently. That is a deploy decision, so it stays his call, but the line and its consequence must be written down for him.

- [ ] **Step 2: Commit**

```bash
git add docs/DEPLOY-PACK-spine-flags.md && git commit -m "deploy: the two-minute pack for switching the rebuilt pages on"
```

---

## Task 12: Decide which sweeps become gates

`CLAUDE.md`: *"A ratified rule becomes a gate in the same session, or it is written down as not machine-checkable with the reason."* A sweep that found something real and can run offline in seconds belongs in the chain. One that needs judgement does not.

**Files:**
- Modify: `scripts/prebuild_all.ts` (only for sweeps that qualify)
- Modify: `CLAUDE.md` (the generated counts block)

- [ ] **Step 1: Judge each of the six against three tests**

A sweep becomes a gate only if all three hold: it found at least one real fault; it needs no network and no secret; and its output is a pass or a fail, not a list a human has to judge. **`sweep_empty_chapters` and `sweep_scaling_svg` are the likely two.** The figure sweeps need judgement and should stay manual — a gate that cries wolf gets switched off, and this repo has already written that lesson down.

- [ ] **Step 2: For each qualifying sweep, add it to the chain and give it a ratchet if the starting count is not zero**

Never start a ratchet above the real count, and never raise one afterwards.

- [ ] **Step 3: Regenerate the counts and run the chain**

```bash
npx tsx scripts/counts.ts --write && npm run prebuild:serial
```

Expected: the new total, 0 failed. The chain takes about 210 seconds serially.

- [ ] **Step 4: For every sweep that does NOT become a gate, write down why**

In `docs/loop/shadcn-upgrade/LEDGER.md`, one line each. An unwritten reason comes back as the same question in a month.

- [ ] **Step 5: Commit**

```bash
git add scripts/prebuild_all.ts CLAUDE.md docs/loop/shadcn-upgrade/LEDGER.md && git commit -m "gates: the sweeps that earned a place in the chain"
```

---

## What this plan will not do

Stated so the founder can object before, not after.

- **It will not push.** Standing hard stop. Everything stays committed and local.
- **It will not touch the homepage headline or the ratified band order**, and none of the 842 hero, bento and feature blocks is in scope.
- **It will not raise a ratchet** to make a gate pass.
- **It will not change a reader-visible word or figure** except where the finding *is* that the figure is wrong, and every such change will be stated loudly with its measurement.
- **It will not rewrite authored copy.** Three chapter headings have now been found promising more than their sections deliver. Those are the founder's words and the decision is his.
- **It will not do dashboard work**, which is the one thing that would make any of this reach a reader.

## The decisions still waiting on the founder

Unchanged by this plan, and none of them guessed at. Nine, listed in full in the handoff dossier. The three that matter most:

1. **Is terracotta-on-hover banned?** A ratified rule says the accent never appears on hover. Ten reader-facing controls use it, two of them eleven lines from where that rule is quoted.
2. **Nine figures on the wage card cannot be read by anyone looking at it** — spoken to a screen reader only, and three more are printed twice.
3. **The peer-city strip crowds at phone width**, structurally for London, and both ways out change what the section looks like.

---

## Self-review

**Spec coverage.** The founder asked for four things. *Continue on your own*: Tasks 9 and 10. *Optimisation*: Tasks 6 and 10. *Critique the pages, overlapping, idiotic mistakes*: Tasks 2 to 5, which is the new capability and the reason this is a plan and not just more loop. *Prepare a master plan and ask for approval*: this document.

**Placeholder scan.** Every sweep carries runnable code. Two tasks deliberately carry judgement rather than code — Task 8's triage and Task 12's gate decision — because both depend on output that does not exist yet, and both state the exact test to apply. That is a decision rule, not a placeholder.

**Type consistency.** `renderAll()`, `text()` and `figures()` are defined once in Task 1 and used with those names in Tasks 2, 3, 4 and 5. The `Page` type carries `kind`, `name`, `html` throughout.

**One gap I am naming rather than hiding.** Task 1 renders a fixed sample: eight cities, three cells, three industries, one neighbourhood. A fault that only appears on one unusual entity will be missed, and every sweep says so in its own output. Widening the sample is cheap and can be done the moment a sweep earns it.
