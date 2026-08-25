# London Four Pages, Correction Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the four London pages against seven faults the founder named on 2026-08-25, every one of which has now been measured on the built pages rather than inferred.

**Architecture:** Every fault becomes a MEASUREMENT FIRST, wired into the prebuild chain as a ratchet, and only then a fix. This is not ceremony. Four separate instruments lied during the work that produced these faults, and three of the founder's complaints were invisible to 116 gates. A fault that has no gate comes back. Fixes are made in the shared spine kit where the fault is shared, and per section where it is not.

**Tech Stack:** Next.js 15.5, React 19.2, TypeScript 5, Tailwind 3.4, Playwright for measurement, the existing `scripts/prebuild_all.ts` gate chain (currently 116 gates).

---

## THE MEASURED FAULTS

Every number below was taken from the four built pages inside the real shell on
2026-08-25, at 1440 / 1280 / 768 / 375, with the webfont settled and with the
generated stylesheet (not the stale snapshot that produced earlier false
readings).

| # | Founder's words | What was measured |
|---|---|---|
| 1 | "sections should not occupy the full width... respect the range of vision" | **28 of 39 sections are a single card at 1072px.** city 8/10, trade 8/12, across 7/10, hood 5/7 |
| 2 | "you are repeating the front part" | hood prints "South London" **10 times**, the hero's answer restated 235px below it; city prints "Customer income" twice inside the masthead; across lists the same three trades in two sections |
| 3 | "strange overlaps" | **2 painted overlaps**, both on the city hero: "Customer income" over "$65K" at every width, and "Paris" over "Munich" at 375 |
| 4 | "some sections have huge white space" | **2 sections over half empty**: "What the team costs" 174px empty of 314px; "Five-year survival" 122px of 318px at 768 |
| 5 | "the revenue myth... you slap a line on top of it" | a struck sentence floating over a slope chart, inside a box inside a box, right column a third empty, all seven district names printed twice |
| 6 | "the sections do not have the frost that we need" | sampled across one line: margin `rgb(233,245,253)`, **inside a card `rgb(254,255,255)`**. The readable band whitens the ground before a card is drawn, so the blur has nothing to refract. The frost is invisible wherever a card exists |
| 7 | "replace the sections with the shadcn components... you have just boxed it" | **5 of 9 authored section blocks are used in zero files**: `LicenceList`, `MinimumWage`, `OperatorVoices`, `RiskList`, `StreetCharacter` |

**The ratified rule these violate, in the founder's own words, 2026-06-18:**
"bento two-up bands (never one section per row)". It is in the project memory and
was not applied.

---

## FILE STRUCTURE

**New measurement scripts** (each is a gate, each carries a calibration case that
proves it can see the fault it exists to catch):

- `scripts/verify_section_bands.mjs` , one section per row is the defect. Ratchet.
- `scripts/verify_front_repetition.mjs` , a string printed twice in the first screen. Ratchet.
- `scripts/verify_painted_overlaps.mjs` , text boxes that overlap AND paint. Hard zero.
- `scripts/verify_section_fill.mjs` , a section more than half empty. Ratchet.
- `scripts/verify_frost_reads.mjs` , the card's ground must differ from white. Hard floor.
- `scripts/verify_prose_sections.mjs` , a section made of sentences with nothing drawn. Ratchet.
- `scripts/lib/measure_pages.mjs` , the shared Playwright harness all six import.

**Modified:**

- `src/components/spine/shell.tsx` , the readable band (Task 1)
- `src/components/spine/kit.tsx` , `Box`, and a new `Band` two-up wrapper (Task 3)
- `src/components/spine/city/city-view.tsx`, `cell/cell-view.tsx`, `industry/industry-view.tsx`, `hood/hood-view.tsx` , section pairing (Tasks 4 to 7)
- `src/components/spine/city/masthead.tsx` , the overlap and the doubled label (Task 8)
- `src/components/spine/NeighborhoodExplorer.tsx` , the revenue myth (Task 10)
- `src/components/spine/cell/interactive.tsx` , the stretched card (Task 11)
- `src/components/kit/blocks/*` , the five unused character forms (Task 12)
- `scripts/prebuild_all.ts` , register the six gates

---

## TASK 1: The frost, and the one decision this plan needs from the founder

**This is first because every other visual task sits on top of it.**

The frost cannot read while the readable band is at .82. Measured: the band takes
the photograph to `rgb(251,253,255)` before any card is drawn, and the card then
composites to `rgb(254,255,255)`. A blur with nothing behind it is a white
rectangle.

There are exactly two honest ways out, and they are not equivalent.

**Option A, RECOMMENDED: the band lightens, the cards carry legibility.**
The band drops from .82 to about .34, so the photograph stays visible under the
content column and the glass has something to refract. Card alpha rises from .80
to about .92 so text keeps its contrast. Result: cards read as panes ON a city,
which is what the 2026-08-20 ratification looked like on the homepage.

**Option B: the band stays, the frost moves to the margins only.**
Cards stay opaque and honest, and the frosted treatment is used only for the
chrome that sits over the open photograph. Result: no frost in the content
column, ever. This is the current state, described accurately.

**Recommendation: A.** It is the only one that delivers what he asked for. The
risk is contrast, and the risk is measurable, which is what Step 3 does.

- [ ] **Step 1: Write the failing gate**

Create `scripts/verify_frost_reads.mjs`:

```js
/**
 * verify_frost_reads , THE FROST MUST HAVE SOMETHING TO REFRACT.
 *
 * Founder, 2026-08-25: "the sections do not have the frost that we need."
 * Measured that day: the ground inside a card composited to rgb(254,255,255),
 * which is white. A backdrop-filter over white is a white rectangle, so the
 * treatment ratified on 2026-08-20 was present in the markup and absent to a
 * reader.
 *
 * BLIND SPOT, stated because this number will be quoted: this samples ONE row of
 * pixels per page at a fixed height. It cannot tell a card that reads as glass
 * everywhere from one that reads as glass only where it was sampled. It is a
 * floor, not a proof.
 *
 * Usage: node scripts/verify_frost_reads.mjs
 */
import { chromium } from "playwright";

const PAGES = ["city-london", "cell-london-restaurants", "industry-restaurants", "hood-london"];
const MIN_DELTA = 6; // the card ground must sit at least this far below pure white

const run = async () => {
  const b = await chromium.launch();
  const fails = [];
  for (const name of PAGES) {
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.goto(`file:///E:/atlas/website/docs/loop/artifacts/final-pages/${name}.html`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);
    const shot = await p.screenshot({ clip: { x: 0, y: 300, width: 1440, height: 300 } });
    const rgb = await p.evaluate(async (b64) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext("2d");
      g.drawImage(img, 0, 0);
      const d = g.getImageData(500, 150, 1, 1).data;
      return [d[0], d[1], d[2]];
    }, shot.toString("base64"));
    const delta = 255 - Math.max(...rgb);
    if (delta < MIN_DELTA) fails.push(`${name}: card ground rgb(${rgb.join(",")}), ${delta} below white, needs ${MIN_DELTA}`);
    await p.close();
  }
  await b.close();
  if (fails.length) {
    console.log(`\nx verify_frost_reads: ${fails.length} page(s) where the frost cannot read.`);
    fails.forEach((f) => console.log("     " + f));
    console.log("\n  A backdrop-filter over white is a white rectangle. Either the ground\n  under the cards keeps some of the photograph, or the frost is not there.\n");
    process.exit(1);
  }
  console.log(`\nPASS verify_frost_reads , all ${PAGES.length} pages keep a ground the frost can act on.\n`);
};
void run();
```

- [ ] **Step 2: Run it to make sure it fails**

```bash
node scripts/verify_frost_reads.mjs
```

Expected: FAIL, 4 pages, each reporting a card ground at rgb(254,255,255) or similar, 1 below white.

- [ ] **Step 3: Apply Option A in the shell**

In `src/components/spine/shell.tsx`, the inline `<style>` block, replace the `.spine-band` rule:

```css
.spine-band{background:linear-gradient(to right,rgba(255,255,255,.10) 0%,rgba(255,255,255,.10) 9.61%,rgba(255,255,255,.34) 9.61%,rgba(255,255,255,.34) 90.39%,rgba(255,255,255,.10) 90.39%,rgba(255,255,255,.10) 100%)}
@media (max-width:767px){.spine-band{background:rgba(255,255,255,.34)}}
```

In `src/components/spine/kit.tsx`, in `CARD_SURFACE`, change the fill so the card carries the legibility the band no longer does:

```ts
background: "rgba(255, 255, 255, var(--glass-alpha-spine, 0.92))",
```

Add to `src/app/globals.css` beside the existing glass tokens:

```css
--glass-alpha-spine: 0.92;
```

- [ ] **Step 4: Run the gate to verify it passes**

```bash
node scripts/verify_frost_reads.mjs
```

Expected: PASS, 4 pages.

- [ ] **Step 5: Prove the text is still legible, which is the whole risk of Option A**

```bash
node scratchpad/contrast.mjs
```

Expected: every figure at 4.5 or above. If any figure falls below 4.5, raise
`--glass-alpha-spine` in steps of .02 and re-run BOTH this and Step 4 until both
pass. If they cannot both pass, Option A is refuted and this task stops with that
written down. Do not proceed to Task 2 with a failing contrast reading.

- [ ] **Step 6: Look at it**

```bash
node scratchpad/final4.mjs
```

Open `scratchpad/shots-glass/FINAL-city-london.jpeg` and read it. The photograph
must be visible THROUGH the cards, not only beside them.

- [ ] **Step 7: Register the gate and commit**

In `scripts/prebuild_all.ts`, add to the `GATES` array:

```ts
{ name: "frost-reads", cmd: "node", args: ["scripts/verify_frost_reads.mjs"] },
```

```bash
npx tsx scripts/counts.ts --write
npm run prebuild:serial
git add scripts/verify_frost_reads.mjs scripts/prebuild_all.ts src/components/spine/shell.tsx src/components/spine/kit.tsx src/app/globals.css CLAUDE.md
git commit -m "spine: the frost gets something to refract, and a gate that says so (rulebook v2 §36)"
```

---

## TASK 2: The section-band gate, before any section is touched

**Files:**
- Create: `scripts/lib/measure_pages.mjs`
- Create: `scripts/verify_section_bands.mjs`
- Create: `scripts/section_bands_baseline.json`

- [ ] **Step 1: Write the shared harness**

Create `scripts/lib/measure_pages.mjs`:

```js
/**
 * The one place the visual gates open the built pages. Every gate that measures
 * a RENDERED page imports this, so a change to how pages are opened lands once.
 *
 * The pages come from scripts/build_final_pages.tsx, which regenerates the
 * stylesheet on every run. Run that first or the measurement describes an older
 * page than the one on disk.
 */
import { chromium } from "playwright";

export const PAGES = ["city-london", "cell-london-restaurants", "industry-restaurants", "hood-london"];

export async function eachPage(width, fn) {
  const b = await chromium.launch();
  const out = [];
  for (const name of PAGES) {
    const p = await b.newPage({ viewport: { width, height: 1000 } });
    await p.goto(`file:///E:/atlas/website/docs/loop/artifacts/final-pages/${name}.html`);
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    out.push({ name, result: await p.evaluate(fn) });
    await p.close();
  }
  await b.close();
  return out;
}
```

- [ ] **Step 2: Write the failing gate**

Create `scripts/verify_section_bands.mjs`:

```js
/**
 * verify_section_bands , ONE SECTION PER ROW IS THE DEFECT.
 *
 * Founder, 2026-06-18, ratified and then not applied: "bento two-up bands
 * (never one section per row)". Restated 2026-08-25: "there are no sections that
 * should not occupy the full width, and you just slap the full width out of
 * them... the human brain on the desktop cannot just move its eyes from the left
 * to the right."
 *
 * Measured 2026-08-25 at 1440: 28 of 39 sections were a single 1072px card.
 *
 * A section may be full width when it holds a WIDE FORM that cannot be halved: a
 * comparison table with four or more columns, a ranked strip with seven or more
 * rows, or a map. Those are counted separately and are not the defect.
 *
 * BLIND SPOT: this counts what RENDERS at 1440. It cannot tell a section that is
 * full width by design from one that is full width by neglect. That is what the
 * allowlist below is for, and every entry in it names its form.
 *
 * Usage: node scripts/verify_section_bands.mjs [--write-baseline]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { eachPage } from "./lib/measure_pages.mjs";

const BASELINE = "scripts/section_bands_baseline.json";

const counts = await eachPage(1440, () => {
  const cards = [...document.querySelectorAll("div")].filter((e) => getComputedStyle(e).backdropFilter !== "none");
  const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));
  return outer
    .filter((c) => c.getBoundingClientRect().width > 1000)
    .map((c) => ({
      cols: c.querySelectorAll("thead th, thead td").length,
      rows: c.querySelectorAll("tbody tr, ol > li").length,
      hasMap: !!c.querySelector("[aria-label='District map'], canvas"),
      label: (c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
    }));
});

const wide = (s) => s.cols >= 4 || s.rows >= 7 || s.hasMap;
const now = {};
let total = 0;
for (const { name, result } of counts) {
  const bad = result.filter((s) => !wide(s));
  now[name] = bad.length;
  total += bad.length;
  if (bad.length) {
    console.log(`\n  ${name}: ${bad.length} full-width section(s) with no wide form`);
    bad.forEach((s) => console.log(`     "${s.label}"`));
  }
}
console.log(`\n  ${total} full-width sections that could be paired.\n`);

if (process.argv.includes("--write-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + "\n");
  console.log(`  wrote ${BASELINE}\n`);
  process.exit(0);
}
const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const grew = Object.entries(now).filter(([k, v]) => v > (base[k] ?? 0));
if (grew.length) {
  console.log("x verify_section_bands: full-width sections GREW. This baseline may only come DOWN.");
  grew.forEach(([k, v]) => console.log(`     ${k}: ${base[k] ?? 0} -> ${v}`));
  process.exit(1);
}
console.log("PASS verify_section_bands.\n");
```

- [ ] **Step 3: Run it and record the honest starting number**

```bash
node scripts/verify_section_bands.mjs --write-baseline
```

Expected: prints the per-page counts, writes the baseline. The total should be
close to 28; the exact figure is whatever it prints, and that figure goes in the
commit message.

- [ ] **Step 4: Prove the gate can see the fault it exists to catch**

Temporarily change `> 1000` to `> 100000` in the gate, re-run, confirm it reports
0 sections, then change it back and confirm the real count returns. A gate that
cannot be made to fail has not been tested.

- [ ] **Step 5: Register and commit**

```ts
{ name: "section-bands", cmd: "node", args: ["scripts/verify_section_bands.mjs"] },
```

```bash
npx tsx scripts/counts.ts --write
git add scripts/lib/measure_pages.mjs scripts/verify_section_bands.mjs scripts/section_bands_baseline.json scripts/prebuild_all.ts CLAUDE.md
git commit -m "gate: one section per row becomes a ratchet, at its honest starting count (rulebook v2 §17)"
```

---

## TASK 3: The `Band` wrapper, so pairing is one decision and not thirty-nine

**Files:**
- Modify: `src/components/spine/kit.tsx`

The pages currently place each section as a lone `<Box>`. Pairing them one file
at a time is how thirty-nine different answers get written. One wrapper, used
everywhere, is the leverage point (§44).

- [ ] **Step 1: Add the wrapper**

In `src/components/spine/kit.tsx`, after `CARD_SURFACE`:

```tsx
/**
 * Band , TWO SECTIONS TO A ROW, WHICH IS THE DEFAULT AND NOT THE EXCEPTION.
 *
 * Founder, 2026-06-18: "bento two-up bands (never one section per row)."
 * Restated 2026-08-25 with the reason: a reader at a desk cannot sweep their eyes
 * from one edge of a 1072px card to the other, so a full-width section is a
 * section that does not get read.
 *
 * Two children sit side by side from `md` and stack below it. A single child
 * takes the LEFT half and leaves the right open, because a lone section that
 * stretches is the fault this exists to stop; if a section genuinely needs the
 * width it takes `wide`, and `wide` is for a form that cannot be halved: a
 * four-column table, a seven-row strip, a map.
 */
export function Band({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  if (wide) return <div className="mt-5">{children}</div>;
  return <div className="mt-5 grid grid-cols-1 items-start gap-5 md:grid-cols-2">{children}</div>;
}
```

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/components/spine/kit.tsx
git commit -m "kit: a two-up band, so pairing is one decision instead of thirty-nine (rulebook v2 §17, §44)"
```

---

## TASK 4: Pair the city page's eight lone sections

**Files:**
- Modify: `src/components/spine/city/city-view.tsx`

Measured full-width sections on this page, with the pairing decision for each.
The two already paired ("The spending pool" at 625px and "How seasonal it is" at
431px) stay as they are.

| Section | Height | Decision |
|---|---|---|
| The rent, district by district | 168px | pair with "Quick reads" |
| By district (ranked strip, 7 rows) | 623px | **wide**, seven rows |
| Quick reads | 402px | pair with the rent focal |
| Cost of living against peer cities | 206px | pair with "What customers earn here" |
| What customers earn here | 172px | pair with the peer strip |
| Trades with local figures | 197px | pair with "The pick, and where to take it" |
| Peer cities, side by side | 266px | **wide**, four columns |
| The pick, and where to take it | 269px | pair with the trades chip row |

- [ ] **Step 1: Import the wrapper**

At the top of `src/components/spine/city/city-view.tsx`, add `Band` to the existing kit import:

```tsx
import { Box, Rail, Fig, Ico, Band } from "@/components/spine/kit";
```

(Keep whatever names are already in that import; add `Band` to the list.)

- [ ] **Step 2: Wrap the first pair**

Find the two sibling sections that render the rent focal and the quick reads.
Wrap them:

```tsx
<Band>
  <RentFocal d={d} />
  <QuickReads d={d} />
</Band>
```

- [ ] **Step 3: Wrap the second pair**

```tsx
<Band>
  <CostOfLivingPeers d={d} />
  <WhatCustomersEarn d={d} />
</Band>
```

- [ ] **Step 4: Wrap the third pair**

```tsx
<Band>
  <TradesHere d={d} />
  <Close d={d} />
</Band>
```

- [ ] **Step 5: Mark the two that keep the width**

```tsx
<Band wide><ByDistrict d={d} /></Band>
<Band wide><PeerTable d={d} /></Band>
```

- [ ] **Step 6: Rebuild and measure**

```bash
npx tsc --noEmit
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx
node scripts/verify_section_bands.mjs
```

Expected: `city-london` drops from 8 to 2.

- [ ] **Step 7: Look at it at three widths**

```bash
node scratchpad/final4.mjs
```

Open `scratchpad/shots-glass/FINAL-city-london.jpeg`. Confirm no pair has one tall
card beside one short card with a large gap under the short one. If it does,
swap that pairing for one closer in height and repeat from Step 6.

- [ ] **Step 8: Commit**

```bash
node scripts/verify_section_bands.mjs --write-baseline
git add src/components/spine/city/city-view.tsx scripts/section_bands_baseline.json docs/loop/artifacts/final-pages/
git commit -m "city: six lone sections become three bands (rulebook v2 §17)"
```

---

## TASK 5: Pair the trade page's eight lone sections

**Files:**
- Modify: `src/components/spine/cell/cell-view.tsx`

| Section | Height | Decision |
|---|---|---|
| Business level masthead | 459px | **wide**, it is the masthead |
| Who it suits | 145px | pair with "Where each $100 of sales goes" |
| Where each $100 of sales goes | 139px | pair with "Who it suits" |
| What to watch | 344px | pair with "Getting to break-even" |
| Getting to break-even | 178px | pair with "What to watch" |
| The same trade, comparable places | 276px | **wide**, four columns |
| Myth vs. reality | 228px | pair with "Where to next" |
| Where to next | 137px | pair with "Myth vs. reality" |

Steps identical in shape to Task 4: import `Band`, wrap each pair, mark the two
wide, rebuild, measure, look, commit.

- [ ] **Step 1: Import `Band` into `src/components/spine/cell/cell-view.tsx`**
- [ ] **Step 2: Wrap "Who it suits" + "Where each $100 of sales goes" in `<Band>`**
- [ ] **Step 3: Wrap "What to watch" + "Getting to break-even" in `<Band>`**
- [ ] **Step 4: Wrap "Myth vs. reality" + "Where to next" in `<Band>`**
- [ ] **Step 5: Mark the masthead and the comparable-places table `<Band wide>`**
- [ ] **Step 6: Rebuild and run `node scripts/verify_section_bands.mjs`.** Expected: `cell-london-restaurants` drops from 8 to 2.
- [ ] **Step 7: Open `scratchpad/shots-glass/FINAL-cell-london-restaurants.jpeg` and read it.**
- [ ] **Step 8: `node scripts/verify_section_bands.mjs --write-baseline`, then commit** with message `trade: six lone sections become three bands (rulebook v2 §17)`

---

## TASK 6: Pair the across-places page's seven lone sections

**Files:**
- Modify: `src/components/spine/industry/industry-view.tsx`

| Section | Height | Decision |
|---|---|---|
| Kept per $100, by trade | 453px | **wide**, seven rows |
| What a customer spends | 153px | pair with "Where each $100 goes" |
| Keep and cost, trades next door | 343px | **wide**, four columns |
| Where each $100 goes | 205px | pair with "What a customer spends" |
| The typical operator | 138px | pair with "The close" |
| What people get wrong | 257px | **wide**, it carries the struck lines |
| The close | 140px | pair with "The typical operator" |

- [ ] **Step 1: Import `Band` into `src/components/spine/industry/industry-view.tsx`**
- [ ] **Step 2: Wrap "What a customer spends" + "Where each $100 goes" in `<Band>`**
- [ ] **Step 3: Wrap "The typical operator" + "The close" in `<Band>`**
- [ ] **Step 4: Mark the three wide ones `<Band wide>`**
- [ ] **Step 5: Rebuild and run `node scripts/verify_section_bands.mjs`.** Expected: `industry-restaurants` drops from 7 to 3.
- [ ] **Step 6: Open `scratchpad/shots-glass/FINAL-industry-restaurants.jpeg` and read it.**
- [ ] **Step 7: `--write-baseline`, then commit** with `across: four lone sections become two bands (rulebook v2 §17)`

---

## TASK 7: Pair the neighbourhood page's five lone sections

**Files:**
- Modify: `src/components/spine/hood/hood-view.tsx`

| Section | Height | Decision |
|---|---|---|
| Rent runs lightest (masthead figure) | 121px | **wide**, it is the masthead |
| Ranked by rent load (7 rows) | 312px | **wide**, seven rows |
| Revenue rank vs rent rank | 415px | rebuilt in Task 10, then paired |
| Compare districts table | 241px | **wide**, three or more columns |
| Open a trade in London | 182px | pair with "What works in South London" (currently 440px, already half) |

- [ ] **Step 1: Import `Band` into `src/components/spine/hood/hood-view.tsx`**
- [ ] **Step 2: Wrap "Open a trade in London" + "What works in South London" in `<Band>`**
- [ ] **Step 3: Mark the masthead, the strip and the compare table `<Band wide>`**
- [ ] **Step 4: Rebuild and run `node scripts/verify_section_bands.mjs`.** Expected: `hood-london` drops from 5 to 3, the third being the revenue myth which Task 10 handles.
- [ ] **Step 5: Open `scratchpad/shots-glass/FINAL-hood-london.jpeg` and read it.**
- [ ] **Step 6: `--write-baseline`, then commit** with `hood: two lone sections become one band (rulebook v2 §17)`

---

## TASK 8: The two painted overlaps on the city hero

**Files:**
- Modify: `src/components/spine/city/masthead.tsx`

Measured: "Customer income" overlaps "$65K" by 124x7px at 1440, 1280 and 768, and
by 77x5px at 375. The label and the figure are stacked in a right-aligned block
where the figure's 48px line box rises into the label above it.

- [ ] **Step 1: Write the failing gate**

Create `scripts/verify_painted_overlaps.mjs`:

```js
/**
 * verify_painted_overlaps , TEXT MUST NOT SIT ON TEXT. Hard zero, no ratchet.
 *
 * Founder, 2026-08-25: "there are strange overlaps that you create."
 *
 * CHROME REPORTS A LAID-OUT RECT FOR CONTENT INSIDE A CLOSED <details> THAT IT
 * NEVER PAINTS. A first version of this measurement counted fourteen overlaps and
 * twelve of them were that, including one that looked like a whole paragraph
 * lying across a chapter heading. Anything inside a collapsed disclosure, or
 * hidden by visibility or opacity, is skipped here for that reason.
 *
 * Usage: node scripts/verify_painted_overlaps.mjs
 */
import { eachPage } from "./lib/measure_pages.mjs";

let total = 0;
for (const width of [1440, 1280, 768, 375]) {
  const pages = await eachPage(width, () => {
    const runs = [];
    for (const e of document.querySelectorAll("*")) {
      const own = [...e.childNodes].filter((x) => x.nodeType === 3 && x.textContent.trim()).map((x) => x.textContent.trim()).join(" ");
      if (!own) continue;
      const d = e.closest("details");
      if (d && !d.open && !e.closest("summary")) continue;
      const s = getComputedStyle(e);
      if (s.visibility === "hidden" || s.opacity === "0") continue;
      const b = e.getBoundingClientRect();
      if (b.width < 4 || b.height < 4) continue;
      runs.push({ e, b, t: own.slice(0, 30) });
    }
    const hits = [];
    for (let i = 0; i < runs.length; i++)
      for (let j = i + 1; j < runs.length; j++) {
        const A = runs[i], B = runs[j];
        if (A.e.contains(B.e) || B.e.contains(A.e)) continue;
        const ox = Math.min(A.b.right, B.b.right) - Math.max(A.b.left, B.b.left);
        const oy = Math.min(A.b.bottom, B.b.bottom) - Math.max(A.b.top, B.b.top);
        if (ox > 3 && oy > 3) hits.push(`"${A.t}" over "${B.t}" (${Math.round(ox)}x${Math.round(oy)}px)`);
      }
    return [...new Set(hits)];
  });
  for (const { name, result } of pages) {
    if (!result.length) continue;
    total += result.length;
    console.log(`\n  ${name} @${width}: ${result.length}`);
    result.forEach((h) => console.log("     " + h));
  }
}
if (total) {
  console.log(`\nx verify_painted_overlaps: ${total} place(s) where text is drawn on text.\n`);
  process.exit(1);
}
console.log("\nPASS verify_painted_overlaps , no text sits on text at any of the four widths.\n");
```

- [ ] **Step 2: Run it to make sure it fails**

```bash
node scripts/verify_painted_overlaps.mjs
```

Expected: FAIL, reporting "Customer income" over "$65K" at all four widths, and "Paris" over "Munich" at 375.

- [ ] **Step 3: Fix the focal block**

In `src/components/spine/city/masthead.tsx`, the focal figure carries
`leading-none`, which sets the line box shorter than the glyphs. Replace:

```tsx
<div className="fig leading-none text-[var(--terra-text)] text-[30px] md:text-[48px]">
```

with:

```tsx
{/* leading-none set the line box SHORTER than the glyphs, so a 48px figure rose
    into the label above it: measured 124x7px of overlap at 1440, 1280 and 768.
    A figure needs a line box at least as tall as itself. */}
<div className="fig leading-[1.05] text-[var(--terra-text)] text-[30px] md:text-[48px]">
```

- [ ] **Step 4: Fix the peer strip crowding at 375**

In `src/components/spine/city/city-view.tsx`, the peer strip places each city
label at its own value along one axis, so two close values collide. Add a
minimum separation: when two labels would sit within 40px of each other, the
second drops to a second row.

```tsx
{/* TWO PEERS AT NEARLY THE SAME VALUE PUT THEIR LABELS ON TOP OF EACH OTHER.
    Measured at 375: "Paris" and "Munich" overlapped by 9x14px. The label drops
    to a second row rather than the figure moving, because moving the figure
    would put it somewhere it is not. */}
const placed: number[] = [];
const rowOf = (pct: number) => {
  const row = placed.some((p) => Math.abs(p - pct) < 12) ? 1 : 0;
  placed.push(pct);
  return row;
};
```

and apply `style={{ top: rowOf(pct) * 18 }}` to each label.

- [ ] **Step 5: Rebuild and run the gate to verify it passes**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx
node scripts/verify_painted_overlaps.mjs
```

Expected: PASS.

- [ ] **Step 6: Register and commit**

```ts
{ name: "painted-overlaps", cmd: "node", args: ["scripts/verify_painted_overlaps.mjs"] },
```

```bash
npx tsx scripts/counts.ts --write
git add scripts/verify_painted_overlaps.mjs scripts/prebuild_all.ts src/components/spine/city/masthead.tsx src/components/spine/city/city-view.tsx CLAUDE.md docs/loop/artifacts/final-pages/
git commit -m "city: the hero figure stops sitting on its own label, and a gate that says so (rulebook v2 §17)"
```

---

## TASK 9: The repetition at the front

**Files:**
- Create: `scripts/verify_front_repetition.mjs`
- Modify: `src/components/spine/hood/masthead.tsx`, `src/components/spine/city/masthead.tsx`

Measured: the neighbourhood masthead prints "x1.20 South London" and the strip
235px below prints "South London ... x1.20" again as its first row. "South
London" appears 10 times on that page, "West End" 8, "North London" 7. The city
masthead prints "Customer income" twice within 82px.

The rule this plan adopts, and it is narrow on purpose: **a string may not be
printed twice within the first 900px of a page.** Below the fold, repetition is
often the same district appearing legitimately in a table and a chart. At the top
it is the page telling you the same thing twice before you have scrolled.

- [ ] **Step 1: Write the failing gate**

Create `scripts/verify_front_repetition.mjs`:

```js
/**
 * verify_front_repetition , THE TOP OF A PAGE MAY NOT SAY THE SAME THING TWICE.
 *
 * Founder, 2026-08-25: "you are repeating the front part."
 *
 * Measured that day: the neighbourhood masthead answered "x1.20 South London"
 * and the strip 235px below opened with "South London ... x1.20". The city
 * masthead printed "Customer income" twice inside 82px.
 *
 * SCOPED TO THE FIRST 900px ON PURPOSE. Further down, the same district name in
 * a chart and in a table is the page working, not repeating. At the top it is the
 * reader being told something they were just told.
 *
 * Usage: node scripts/verify_front_repetition.mjs [--write-baseline]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { eachPage } from "./lib/measure_pages.mjs";

const BASELINE = "scripts/front_repetition_baseline.json";
const pages = await eachPage(1280, () => {
  const seen = new Map();
  for (const e of document.querySelectorAll("*")) {
    const own = [...e.childNodes].filter((x) => x.nodeType === 3 && x.textContent.trim()).map((x) => x.textContent.trim()).join(" ").replace(/\s+/g, " ");
    if (own.length < 4) continue;
    const d = e.closest("details");
    if (d && !d.open && !e.closest("summary")) continue;
    const top = e.getBoundingClientRect().top + window.scrollY;
    if (top > 900) continue;
    if (!seen.has(own)) seen.set(own, new Set());
    seen.get(own).add(Math.round(top));
  }
  return [...seen.entries()].filter(([, ys]) => ys.size > 1).map(([t, ys]) => `"${t.slice(0, 40)}" at ${[...ys].sort((a, b) => a - b).join(", ")}`);
});

const now = {};
let total = 0;
for (const { name, result } of pages) {
  now[name] = result.length;
  total += result.length;
  if (result.length) {
    console.log(`\n  ${name}: ${result.length} string(s) repeated in the first screen`);
    result.forEach((r) => console.log("     " + r));
  }
}
console.log(`\n  ${total} repeated in the first 900px.\n`);

if (process.argv.includes("--write-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + "\n");
  console.log(`  wrote ${BASELINE}\n`);
  process.exit(0);
}
const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const grew = Object.entries(now).filter(([k, v]) => v > (base[k] ?? 0));
if (grew.length) {
  console.log("x verify_front_repetition: repetition at the top GREW. This baseline may only come DOWN.");
  grew.forEach(([k, v]) => console.log(`     ${k}: ${base[k] ?? 0} -> ${v}`));
  process.exit(1);
}
console.log("PASS verify_front_repetition.\n");
```

- [ ] **Step 2: Run it and read the honest list**

```bash
node scripts/verify_front_repetition.mjs --write-baseline
```

- [ ] **Step 3: Stop the neighbourhood masthead answering the strip's question**

The masthead's job is the ANSWER; the strip's job is the RANKING. Both currently
give the answer. In `src/components/spine/hood/masthead.tsx`, the focal block
names the lightest district and its multiple. The strip immediately below opens
with the same district and the same multiple as its first row.

Keep the masthead. Change the strip so its first row is not a restatement: it
already carries a rank number and a name, so the masthead drops the DISTRICT NAME
and keeps the figure and the label, which is the part the strip does not repeat.

```tsx
{/* THE STRIP BELOW IS THE RANKING; THIS IS THE ANSWER. Both were printing the
    same district and the same multiple, 235px apart, which is the founder's
    "repeating the front part" and is why "South London" appeared ten times on
    this page. The name lives in the strip's first row, where it carries a rank
    with it. */}
```

- [ ] **Step 4: Remove the doubled label on the city masthead**

In `src/components/spine/city/masthead.tsx`, "Customer income" renders as both
the focal's `label` and again inside the focal's `sub`. Delete the one in `sub`
and leave the label.

- [ ] **Step 5: Rebuild, re-measure, and lock the lower baseline**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx
node scripts/verify_front_repetition.mjs
node scripts/verify_front_repetition.mjs --write-baseline
```

- [ ] **Step 6: Register and commit**

```ts
{ name: "front-repetition", cmd: "node", args: ["scripts/verify_front_repetition.mjs"] },
```

```bash
npx tsx scripts/counts.ts --write
git add scripts/verify_front_repetition.mjs scripts/front_repetition_baseline.json scripts/prebuild_all.ts src/components/spine/hood/masthead.tsx src/components/spine/city/masthead.tsx CLAUDE.md docs/loop/artifacts/final-pages/
git commit -m "spine: the top of a page stops saying the same thing twice (rulebook v2 §7)"
```

---

## TASK 10: The revenue myth, rebuilt

**Files:**
- Modify: `src/components/spine/NeighborhoodExplorer.tsx`

Founder, 2026-08-25, verbatim: "this thing called the revenue myth, and you just
create like a text and you slap like a line on top of it, what the fuck is that."

He is describing the sentence "the loudest is the best place" floating in the
middle of the slope chart with a line struck through it, plus a dashed phantom
line. Measured alongside it: the card holds a bordered box holding the chart,
plus two more bordered boxes in a right column whose lower third is empty, and
the chart prints all seven district names TWICE, which is where most of that
page's repetition comes from.

- [ ] **Step 1: Delete the struck floating sentence and the phantom line**

Remove the `strikeLabel` text node and the dashed reference line from the SVG.
The myth is carried by the crossing lines themselves: the district with the
loudest takings sits at rank 6 of 7 on rent. That IS the counter-evidence, and it
needs no caption lying across it.

- [ ] **Step 2: Remove the inner box**

The chart sits inside `<div className="overflow-hidden rounded-[14px] border ...">`
inside the section card. Two borders around one chart is the "you have just boxed
it" the founder named. Delete the inner wrapper's `rounded` and `border` classes,
keeping `overflow-hidden`.

- [ ] **Step 3: Print each district name once**

The slope chart labels both columns. Replace the right column's names with rank
numbers alone, and put a single "rent rank" header over them. Every name then
appears once, and the line still connects the two ranks.

- [ ] **Step 4: Move the two stat boxes under the chart**

The right column is a third empty. Move "Loudest takings" and "Lightest lease"
into a two-up row BELOW the chart, so the card has no empty quarter.

- [ ] **Step 5: Rebuild and measure all four gates**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx
node scripts/verify_section_bands.mjs
node scripts/verify_front_repetition.mjs
node scripts/verify_painted_overlaps.mjs
node scripts/verify_section_fill.mjs
```

- [ ] **Step 6: Look at it**

```bash
node scratchpad/myth.mjs
```

Open `scratchpad/shots-glass/myth.jpeg`. There must be no sentence with a line
through it, no box inside a box, and no empty quarter.

- [ ] **Step 7: Commit**

```bash
git add src/components/spine/NeighborhoodExplorer.tsx docs/loop/artifacts/final-pages/
git commit -m "hood: the revenue myth loses the struck caption, the inner box and the empty quarter (rulebook v2 §26, §30)"
```

---

## TASK 11: The half-empty sections

**Files:**
- Create: `scripts/verify_section_fill.mjs`
- Modify: `src/components/spine/cell/interactive.tsx`, `src/components/spine/industry/industry-view.tsx`

Measured: "What the team costs" is 314px tall with 174px empty, because it sits
beside the taller waterfall card in a flex row that equalises heights. "Five-year
survival" is 318px with 122px empty at 768.

- [ ] **Step 1: Write the gate**

Create `scripts/verify_section_fill.mjs`:

```js
/**
 * verify_section_fill , A SECTION MAY NOT BE MOSTLY EMPTY.
 *
 * Founder, 2026-08-25: "some sections have huge white space."
 *
 * Measured that day at 1440: "What the team costs" was 314px tall with 174px of
 * it empty, because it sat beside a taller card in a flex row that stretches its
 * children. "Five-year survival" was 318px with 122px empty at 768.
 *
 * BLIND SPOT, stated because this number will be quoted: it measures the EXTENT
 * of ink from the topmost drawn thing to the bottommost, not its density. A
 * section with content at the very top and the very bottom and nothing between
 * reads as full here and looks empty to a person. For that, look at the picture.
 *
 * Usage: node scripts/verify_section_fill.mjs [--write-baseline]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { eachPage } from "./lib/measure_pages.mjs";

const BASELINE = "scripts/section_fill_baseline.json";
const now = {};
let total = 0;

for (const width of [1440, 768]) {
  const pages = await eachPage(width, () => {
    const cards = [...document.querySelectorAll("div")].filter((e) => getComputedStyle(e).backdropFilter !== "none");
    const outer = cards.filter((c) => !cards.some((o) => o !== c && o.contains(c)));
    const out = [];
    for (const c of outer) {
      const cb = c.getBoundingClientRect();
      if (cb.height < 120) continue;
      let top = cb.bottom, bot = cb.top;
      for (const e of c.querySelectorAll("*")) {
        const s = getComputedStyle(e);
        const drawn = [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim()) || e.tagName === "svg" || s.backgroundColor !== "rgba(0, 0, 0, 0)";
        const b = e.getBoundingClientRect();
        if (drawn && b.height > 2) { top = Math.min(top, b.top); bot = Math.max(bot, b.bottom); }
      }
      const empty = Math.round(cb.height - Math.max(0, bot - top));
      if (empty > cb.height * 0.4) out.push(`${Math.round(cb.height)}px tall, ${empty}px empty  "${(c.textContent || "").trim().replace(/\s+/g, " ").slice(0, 34)}"`);
    }
    return out;
  });
  for (const { name, result } of pages) {
    const key = `${name}@${width}`;
    now[key] = result.length;
    total += result.length;
    if (result.length) {
      console.log(`\n  ${key}: ${result.length} section(s) more than 40% empty`);
      result.forEach((r) => console.log("     " + r));
    }
  }
}
console.log(`\n  ${total} mostly-empty section(s).\n`);

if (process.argv.includes("--write-baseline")) {
  writeFileSync(BASELINE, JSON.stringify(now, null, 2) + "\n");
  console.log(`  wrote ${BASELINE}\n`);
  process.exit(0);
}
const base = JSON.parse(readFileSync(BASELINE, "utf8"));
const grew = Object.entries(now).filter(([k, v]) => v > (base[k] ?? 0));
if (grew.length) {
  console.log("x verify_section_fill: empty space GREW. This baseline may only come DOWN.");
  grew.forEach(([k, v]) => console.log(`     ${k}: ${base[k] ?? 0} -> ${v}`));
  process.exit(1);
}
console.log("PASS verify_section_fill.\n");
```

- [ ] **Step 2: Run and baseline**

```bash
node scripts/verify_section_fill.mjs --write-baseline
```

- [ ] **Step 3: Stop the flex row equalising heights**

The two-up rows use `flex` with default `items-stretch`, so the shorter card
grows to match the taller. `Band` from Task 3 uses `items-start`, which is the
fix; converting these two rows to `Band` resolves both.

- [ ] **Step 4: Rebuild, re-measure, lock the lower baseline, register, commit**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx
node scripts/verify_section_fill.mjs
node scripts/verify_section_fill.mjs --write-baseline
npx tsx scripts/counts.ts --write
git add scripts/verify_section_fill.mjs scripts/section_fill_baseline.json scripts/prebuild_all.ts src/components/spine/cell/interactive.tsx src/components/spine/industry/industry-view.tsx CLAUDE.md docs/loop/artifacts/final-pages/
git commit -m "spine: a card stops stretching to its neighbour's height (rulebook v2 §17)"
```

---

## TASK 12: The five unused character blocks

**Files:**
- Modify: `src/components/spine/hood/hood-view.tsx`, `src/components/spine/cell/cell-view.tsx`

Founder, 2026-08-25: "I've told you before to replace the sections with the
shadcn components in order to save the character... you have just boxed it."

Measured: `src/components/kit/blocks/` holds nine section forms and **five are
used in zero files**: `LicenceList`, `MinimumWage`, `OperatorVoices`,
`RiskList`, `StreetCharacter`.

- [ ] **Step 1: Read each of the five and write down what decision it serves**

```bash
head -40 src/components/kit/blocks/StreetCharacter.tsx
head -40 src/components/kit/blocks/OperatorVoices.tsx
head -40 src/components/kit/blocks/RiskList.tsx
head -40 src/components/kit/blocks/LicenceList.tsx
head -40 src/components/kit/blocks/MinimumWage.tsx
```

Write `E:\atlas\design\inventory\unused-blocks.md` with one row per block: what it
shows, what data it needs, whether any London page carries that data, counted.

**Do not wire a block whose data is not carried. §0.** A block rendered from
nothing is a worse box than the box it replaced.

- [ ] **Step 2: Wire only the blocks whose data exists**

For each block the inventory marks as fed, replace the plain `Box` currently
holding that content with the block.

- [ ] **Step 3: Rebuild, run every gate, look at every changed section, commit one per block**

---

## TASK 13: The sections that are made of sentences

**Files:**
- Create: `scripts/verify_prose_sections.mjs`
- Modify: `src/components/spine/industry/industry-view.tsx` (the `WhoItSuits` block, mounted on two pages)
- Modify: `src/components/spine/NeighborhoodExplorer.tsx` (the district detail panel)

Founder, 2026-08-25: "you have not respected the fact that the sections should
not be filled with text."

Measured at 1440, counting only runs of 30 characters or more that contain a
space, against the number of drawn marks in the same card:

| Section | Prose | Drawn marks |
|---|---|---|
| "Who it suits", trade page | 288 chars | 2 |
| "Who it suits", across page | 288 chars | 2 |
| South London detail panel, hood page | 265 chars | 2 |

Two of those three are the SAME 288 characters, because that block is mounted on
both pages. A reader who moves from the trade page to the across page is shown
the identical two paragraphs twice.

- [ ] **Step 1: Write the gate**

Create `scripts/verify_prose_sections.mjs`, using `eachPage` from
`scripts/lib/measure_pages.mjs`, failing when a section carries more than 140
characters of sentence prose and fewer than 3 drawn marks. Ratchet, baselined at
whatever it first prints. Header must carry the blind spot: it counts DRAWN
MARKS, so a section whose one graphic is a single large chart reads as sparse and
is not.

- [ ] **Step 2: Run and baseline**

```bash
node scripts/verify_prose_sections.mjs --write-baseline
```

- [ ] **Step 3: Give "who it suits" a form instead of two paragraphs**

The block is two columns of prose headed SUITS and THINK TWICE. Its content is
already two opposed lists. Replace the paragraphs with the `Bullets` component
already in the kit, one short line each, so the section reads as a comparison
rather than as an essay:

```tsx
import { Bullets } from "@/components/spine/kit";
```

The source strings stay as they are, split on sentence boundaries. **Do not
rewrite the copy.** It is authored, it covers 243 activities, and shortening it
here would be inventing.

- [ ] **Step 4: Stop mounting the same block on two pages**

The trade page and the across page both render `WhoItSuits` from identical data.
Keep it on the ACROSS page, which is the trade's home altitude, and on the trade
page show only the half that changes with the city. If neither half changes with
the city, the block does not belong on the trade page and its removal is a §41
differentiation cut with the grounds recorded.

- [ ] **Step 5: Give the district detail panel its numbers back**

The panel already holds a multiplier breakdown and two scales. Its 265 characters
of prose are the district description, which is authored and stays. Move it BELOW
the numbers rather than above, so the section opens with what it measures.

- [ ] **Step 6: Rebuild, re-measure, lock the lower baseline, register, commit**

```bash
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx
node scripts/verify_prose_sections.mjs
node scripts/verify_prose_sections.mjs --write-baseline
npx tsx scripts/counts.ts --write
git add scripts/verify_prose_sections.mjs scripts/prose_sections_baseline.json scripts/prebuild_all.ts src/components/spine/industry/industry-view.tsx src/components/spine/NeighborhoodExplorer.tsx CLAUDE.md docs/loop/artifacts/final-pages/
git commit -m "spine: three sections stop being made of sentences (rulebook v2 §19, §7)"
```

---

## TASK 14: The full chain, and the review sheet

- [ ] **Step 1: Run the whole chain**

```bash
npm run prebuild:serial
```

Expected: 122 passed (116 plus the six new gates), 0 failed.

- [ ] **Step 2: Shoot all four pages at 1280 and 375**

```bash
node scratchpad/final4.mjs
```

- [ ] **Step 3: Build the review sheet**

One file, every changed section before and after at both widths, one
APPROVE/REJECT control each, handed over as a single HTML file the founder opens
himself. No dev server, no browser automation shown to him.

- [ ] **Step 4: Report in plain language**

No file paths, no function names, no line numbers. Section counts before and
after. What was measured, what was fixed, what was left and why.

---

## WHAT THIS PLAN DELIBERATELY DOES NOT DO

- **It does not shorten the pages.** Every section survives; they are paired, not
  removed. The founder has said twice not to chop.
- **It does not change the site-wide prose measure.** Five paragraphs on the
  across page sit at 89 characters a line because `--measure-prose` is 68ch,
  which renders wider than it reads. That is a ratified token and a founder
  decision, recorded here and not acted on.
- **It does not touch a second vertical.** London only. Every shared file changed
  is measured across all fifteen real pages before it lands.
