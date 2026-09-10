# The Section Creation Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a loop that fires every twenty minutes and does one thing: CREATE sections, to the committed page model, until every main page type carries its full section set, with four layers of quality checking and a harmony review that judges how the sections sit together as one page.

**Architecture:** The loop already exists as a machine (doctrine, queue, state, ledger, report). This plan does not build a second one. It re-points the existing machine at creation instead of migration, gives it the six things it lacks (a section catalogue for every page type, the disclosure it dropped, a readability measure, the model's twelve unenforced laws, a harmony stage, and a shadcn consult step), and writes the kickstart prompt that carries the whole intent in one paste.

**Tech Stack:** Next.js 15.5 / React 19.2 / TypeScript 5 / Tailwind 3.4 (`E:\atlas\website`); archetypes in `src/components/spine/archetypes/`; the harness in `scripts/harness/` (Playwright, node ESM); the loop's files in `E:\atlas\design\loop\build\`; shadcn via the Shadcn_UI MCP server and the 25 local primitives in `src/components/ui/`.

## Global Constraints

Copied verbatim from the law. Every task's requirements implicitly include this section.

- **`E:\atlas\design\loop\build\briefs\MODEL.md` is the design law.** Where it disagrees with an older note, it wins. Nothing is built that contradicts it.
- **`E:\atlas\rules\FOUNDER-VERDICTS.md` is the founder's word.** Append only, verbatim, under a dated heading. Never edited otherwise.
- Never fabricate a figure, a place detail, a note or a source. A figure comes from a file or it is not printed.
- No em dash anywhere in user-visible source. No source-agency names. No raw hex, pixel or millisecond in a component; tokens only.
- No URL renames. Add, never rename.
- Two cards on one horizontal level have the same height, always (ruling 7). A hole is fixed by pairing or content, never by unstretching.
- Nothing is botched on a phone. No sideways scroll, no dropped row, no name truncated to a letter, at 375 or 768.
- One change, one verification, before the next change. Every verification redirected to a file under `scratchpad/` and its exit code read from the shell. Never pipe a verification into a formatter.
- A JSX comment never opens a ternary branch; it goes above the `{cond ? (` line.
- Never `git add -A`. Never push. Never run `npm run build` or a deploy. Never open a browser or a dev server to show the founder anything.
- Every shell command begins with `cd /e/atlas/website &&` or `cd /e/atlas &&`.
- Long scripts and edits go through a file written with the Write tool, then run. Never a heredoc with quotes inside it.
- The serial chain only (`npm run prebuild:serial`), never the parallel one, and only above about 900 MB free.
- **Graphics are never hidden behind a disclosure.** `assertNoGraphics` in `kit.tsx` is law: a disclosure moves bullet text, never a drawing.
- Section floors: country 21, city 17. A page never carries fewer.

---

## Order of execution, and why it is not the order these tasks are written in

Sixty-six agents reviewed the eighteen section briefs that preceded this plan.
Every brief was rejected, most of them twice, with checkable reasons. The
completeness critic then named the order that work must happen in, and it
overrides the order below. Two of its findings change this plan outright.

**Finding one: the grey ground has no owner.** He answered the background
question himself, and the tokens it needs (`--c-ground`, `--flag-hero`,
`--flag-row`) exist in no file. `src/components/spine/shell.tsx` line 54 still
declares `DEFAULT_BG = "/spine/_skyline.jpeg"`, and `kit.tsx` line 517 is still
a glass surface. Four other briefs already depend on those three tokens. So the
ground is Task 0 and everything else waits for it, because every emphasis and
contrast decision assumes white on grey.

**Finding two: the harness must precede the cards.** Seven of the eighteen
briefs asked the harness for their own exemption from the hierarchy rules,
which is a card asking to be excused from having a hierarchy. `EVEN_BY_RULING`
in `check_page_holes.mjs` holds four members and its comment says they are even
by a ruling of his. It is frozen at four. A section that cannot pass a rule is
redesigned; the rule is not widened to admit it.

**THE ORDER, and each stage is verifiable alone:**

1. Task 0, the ground and the three tokens.
2. Task 4, the model's twelve laws, and Task 3, readability, with the freeze.
   Their first run over the live pages produces the failure list, and that list
   is the work queue.
3. Task 2, the founder's plus, and the other shared primitives: the flag with
   both sizes reachable, the row grid, the one opener, `Band` failing on a lone
   child.
4. Copy and units, no layout: `COPY.pay.edge` and both `edgeLabel` call sites
   deleted, `cityPeers.same` deleted, the index, difference and multiple units
   removed, one decimal count per column.
5. The placement sentence: one helper, one wording, one direction, called by
   staff, premises, world seat, running costs and customers.
6. Task 1 and Task 7, the catalogue and the queue, now that the laws the
   catalogue rows must pass actually run.
7. Task 5, harmony, and Task 6, the form consult.
8. Task 8, the prompt, last, so it names only things that exist.

**ANSWERED 2026-09-08, four decisions that change what follows.** Net profit
margin is NOT blocked: it ships at full form from the global industry table,
labelled sample, with the accent moved off it. Full width stays at THREE, so
MODEL.md Part 1 is unchanged and the older hero-only ban is superseded. The
twenty-four spectra poles are recut and approved as one sheet. And every
section appears on every page, marked sample where it is not measured, so no
page falls below its floor: where the content would have to be AUTHORED rather
than derived from a figure we hold, the section still ships and still counts,
drawn with its real structure, and states plainly that it is not gathered for
that place, because inventing it would break his own rule against fabricated
place detail.

**A COLLISION THE TASK 3 REVIEW FOUND, settled here.** The prompt says layer
three must be zero reds and that a red is a run's first job, never built on
top of. But the checks are built before the cards on purpose, so each one ships
with a standing backlog the moment it can see: the accent budget reds twice,
readability eight times. Read literally, the loop would be blocked forever by
findings it was designed to produce. THE RULE, and it goes in the prompt: a
check's FIRST run establishes a baseline, recorded in DEBUG.md with its count
and its date. A run is blocked by a NEW red, meaning a count above its
baseline, or by any red in a card the run itself touched. The baseline itself
is the work queue and it shrinks as rows land. A baseline may never be raised.

**STILL BLOCKED ON DATA, and named so they are not silently attempted:** the
entry bill, easiest to break in, city living costs, the runway, the season, and
city trades beyond London. Each is blocked on data the project
does not hold, listed in the critic's inventory: street-level rent (two of his
five metrics exist on no axis), per-district measured rent (none), credible
per-country margin, the all-in opening cost (5 countries of 195), wage spread
(47 of 197), locals notes (1 of 195), city photographs (1 of 252), per-city
trade counts (London only), and a last-checked date (no field exists, which is
why a fabricated one appeared).

---

### Task 0: The ground, the card, and the three tokens

His answer of 2026-09-07, and the one change nothing owns. Every task below
assumes it has landed.

**Files:**
- Modify: `src/app/globals.css` (the `:root` spine token block, from line 2393)
- Modify: `src/components/spine/shell.tsx` (lines 54, 56, 64, 76, 77)
- Modify: `src/components/spine/kit.tsx` (`CARD_SURFACE`, line 516)
- Modify: `src/components/CountryFlag.tsx`
- Modify: `scripts/verify_flag_marks.mjs`

**Interfaces:**
- Produces: `--c-ground` (the page, and nothing else), `--flag-hero` (40px),
  `--flag-row` (20px). Consumed by Tasks 2, 3, 4 and 5 and by every section
  brief the loop writes afterwards.

- [ ] **Step 1: Read the twelve spine tokens before adding a thirteenth**

Run: `cd /e/atlas/website && sed -n '2385,2420p' src/app/globals.css`
Expected: the spine token block, so the new token is written on the same
warm-neutral ramp and not a cool grey under warm hairlines.

- [ ] **Step 2: Declare the three tokens**

In that `:root` block, beside the existing spine tokens, add:

```css
  /* THE GROUND (his answer, 2026-09-07: "some sort of a gray and the cards
     becoming white"). The page and nothing else: never inside a card.
     It sits one clear step BELOW every card surface AND below --c-border,
     not between them, because the band from --c-soft2 (#efebe8) to
     --c-border (#e7e2df) is too narrow to hold a fourth distinguishable
     grey. Warm neutral, R>G>B, on the palette ramp. White cards float on it
     by about eleven points of lightness, which is what carries the edge now
     that the photograph is gone. */
  --c-ground: #e3ded8;
  /* THE FLAG, sized by HEIGHT so a true ratio is never cropped (2026-09-07:
     "the flag which is distorted"). Two rungs, and no third. */
  --flag-hero: 40px;
  --flag-row: 20px;
```

- [ ] **Step 3: Paint the ground and delete the photograph**

In `src/components/spine/shell.tsx`: delete `DEFAULT_BG` (line 54) and the `bg`
prop that carries it (line 56); delete the fixed `.spine-band` element (line 64)
and its two stylesheet rules (lines 76 and 77); set the shell's own root to
`background: var(--c-ground)` edge to edge, behind the gutters as well, with the
main column's width and padding unchanged.

- [ ] **Step 4: Make the card opaque and give it its edge**

In `src/components/spine/kit.tsx`, `CARD_SURFACE` at line 516: the surface
becomes a solid `var(--c-card)` with `background-clip: padding-box`; the inset
white top highlight comes off the shadow string and the two soft drops stay
exactly as they are; the border becomes `--c-line-strong`, while every hairline
inside a card stays `--c-border`.

- [ ] **Step 5: Fix the flag in the component, not in 208 callers**

In `src/components/CountryFlag.tsx`, replace `aspect-[3/2] object-cover` with a
height from a token, `width: auto`, and `object-contain`, defaulting to
`--flag-hero` and taking `--flag-row` through a `size` prop. Keep the existing
behaviour that strips a caller's `rounded` utility. Add one `--c-border`
hairline, because a white field on a white card has no edge.

- [ ] **Step 6: Raise the flag gate's floor**

In `scripts/verify_flag_marks.mjs`, which today only fails under 14px, fail
anything that is not one of the two tokens, and fail any width-set flag.

- [ ] **Step 7: Verify by measurement, not by eye**

Run: `cd /e/atlas/website && npm run harness > scratchpad/harness-ground.txt 2>&1; echo "exit $?"; npx tsc --noEmit > scratchpad/tsc-ground.txt 2>&1; echo "tsc exit $?"`
Expected: both `exit 0`. Then photograph all three pages at 1280, 768 and 375
with `npm run shoot:page` and open every picture with the Read tool. The
skyline is gone, the cards read as white plates on grey, and no card has lost
its edge.

- [ ] **Step 8: Commit**

```bash
cd /e/atlas/website && git add src/app/globals.css src/components/spine/shell.tsx src/components/spine/kit.tsx src/components/CountryFlag.tsx scripts/verify_flag_marks.mjs && git commit -m "design: the grey ground and the white card, the flag sized by height (his answer of 2026-09-07)"
```

---

## File structure

**Created**

- `E:\atlas\design\loop\build\CATALOGUE.md`: every section of every main page type, in order, with its band, its form, its data source and its status. The loop's work-list for the whole phase.
- `E:\atlas\design\loop\build\CREATE-PROMPT.md`: the kickstart prompt. The one paste that starts the loop.
- `E:\atlas\design\loop\build\briefs\hood.md`, `cell.md`, `industry.md`, `howto.md`: the page block and section blocks for the four page types the model did not spine.
- `src/components/spine/archetypes/DetailPanel.tsx`: the archetype wrapper that gives any section the founder's plus, restored.
- `scripts/harness/check_readability.mjs`: the readability measure, run over every rendered page.
- `scripts/harness/check_model_laws.mjs`: the model's twelve unenforced laws, measured.
- `scripts/harness/harmony_sheet.mjs`: one picture of a whole page plus the cross-section measurements the harmony review reads.
- `scripts/harness/fixtures/readability.html`, `fixtures/model_laws.html`: fixtures with planted faults, one per rule.

**Modified**

- `E:\atlas\design\loop\build\DOCTRINE.md`: the creation stages, the harmony review as S9, the shadcn consult inside S1.5.
- `E:\atlas\design\loop\build\QUEUE.md`: seeded from the catalogue.
- `E:\atlas\design\loop\build\STATE.md`: re-pointed at the first catalogue row.
- `src/components/spine/archetypes/stories.tsx`: stories for the detail panel.
- `scripts/harness/check_archetypes.mjs`: the detail panel's own checks.
- `scripts/prebuild_all.ts`: the two new browser-free gates registered.
- `package.json`: `harness:readability`, `harness:laws`, `harmony`.
- `CLAUDE.md`: the generated counts block, after the gate count changes.

---

### Task 1: The catalogue, the loop's work-list for every page type

Nothing can be created in order until the full list of what must exist is written down and countable. The model spines the country (21) and the city (17). The neighbourhood, trade, industry and how-to pages have no spine at all, and their sections are what the loop will spend most of its runs creating.

**Files:**
- Create: `E:\atlas\design\loop\build\CATALOGUE.md`

**Interfaces:**
- Produces: the row id format `<page>:<nn>-<slug>` (for example `country:00-take`, `hood:03-streets`) used by every later task, by QUEUE.md and by STATE.md.

- [ ] **Step 1: Read the four unspined pages and count what they draw today**

Run: `cd /e/atlas/website && npm run census -- --write > scratchpad/census-catalogue.txt 2>&1; echo "exit $?"; grep -A 40 '^### hood\|^### cell\|^### industry\|^### howto' /e/atlas/design/loop/build/PAGES.md > scratchpad/catalogue-source.txt; wc -l scratchpad/catalogue-source.txt`

Expected: `exit 0`, and `scratchpad/catalogue-source.txt` holds the generated section tables for the four page types. Read the file. These are the sections that exist; the catalogue is what SHOULD exist.

- [ ] **Step 2: Write the catalogue**

Write `E:\atlas\design\loop\build\CATALOGUE.md` with the Write tool. It has one table per page type with these columns, and every cell filled:

`| id | order | title the reader sees | band | form | data source | status |`

- `id`: `<page>:<nn>-<slug>`.
- `order`: the block number, `00` upward, matching MODEL.md Part 8 for country and city.
- `band`: `FULL`, or the split (`1-1`, `2-1`, `3-2`) and which side, or `PAIR-WITH <id>`.
- `form`: the archetype that draws it (`answer-card`, `kv-grid`, `ranked-bars`, `compare-table`, `card-pager`, `tiers-table`, `range-strip`, `spectra-table`, `note-list`, `terminus`, `pay-bars`, `detail-panel`), or `NEW: <what it must draw>` when no archetype fits.
- `data source`: the file or builder the figures come from, or `DATA: <what is missing>`.
- `status`: `TODO`, `EXISTS`, `REWORK (why)`, or `DATA`.

Fill the country table (21 rows) and the city table (17 rows) directly from MODEL.md Part 8.2 and 8.3, copying the ids, titles, bands and full-width marks exactly as written there. Do not paraphrase them.

For `hood`, `cell`, `industry` and `howto`, write the table with the sections the census found, each marked `REWORK` or `EXISTS`, and add a single row at the top of each:

`| hood:SPINE | 00 | the neighbourhood spine, authored | n/a | n/a | MODEL.md Part 8 as the pattern | TODO |`

That spine row is the loop's first run for that page type: it authors the page's block list and floor the way the model did for country and city, and then rewrites its own table below. This is deliberate. A spine invented in this plan without reading that page's data would be the guessing the model was built to stop.

Head the file with:

```markdown
# The catalogue: every section of every main page type

The loop's work-list. One row per section. A row is DONE when its section
draws to its brief, passes every check layer, and its harmony reading is
recorded. Country and city rows are copied from MODEL.md Part 8 and are not
re-decided here. The four SPINE rows are authored by the loop, each in its own
run, against that page's real data, before its sections are queued.

FLOORS: country 21, city 17. The hood, cell, industry and howto floors are set
by their SPINE run and written here the same run.
```

- [ ] **Step 3: Check every country and city row matches the model, mechanically**

Write `scratchpad/arch/check_catalogue.py` with the Write tool:

```python
import io, re
model = io.open(r"E:\atlas\design\loop\build\briefs\MODEL.md", encoding="utf-8").read()
cat = io.open(r"E:\atlas\design\loop\build\CATALOGUE.md", encoding="utf-8").read()
# the model names country blocks as `NN slug` inside backticks in Part 8.2
blocks = re.findall(r"`(\d\d) ([a-z-]+)`", model)
missing = []
for num, slug in blocks:
    if ("%s-%s" % (num, slug)) not in cat:
        missing.append(num + " " + slug)
print("model blocks found:", len(blocks))
print("missing from the catalogue:", missing if missing else "none")
raise SystemExit(1 if missing else 0)
```

Run: `cd /e/atlas/website && python scratchpad/arch/check_catalogue.py; echo "exit $?"`
Expected: `exit 0`, `missing from the catalogue: none`, and a block count of at least 21.

- [ ] **Step 4: Commit**

```bash
cd /e/atlas && git add design/loop/build/CATALOGUE.md && git commit -m "build loop: the catalogue, every section of every main page type"
```

---

### Task 2: The founder's plus, restored as an archetype

He asked for it back by name: "the click and show button was removed, I hoped that you would keep it for those sections where the person clicks a plus and some more info appears for the particular query he is looking at." `InlineDisclosure` and `Expand` were never deleted from `src/components/spine/kit.tsx` (lines 948 and 962) and still run on the trade and city pages. What happened is that the eleven archetypes never adopted them, so every section the loop rebuilt lost its plus. This task gives the plus to the archetype set, under the law that already governs it.

**Files:**
- Create: `src/components/spine/archetypes/DetailPanel.tsx`
- Modify: `src/components/spine/archetypes/stories.tsx`
- Modify: `scripts/harness/check_archetypes.mjs`
- Modify: `src/lib/spine/copy.ts`

**Interfaces:**
- Consumes: `InlineDisclosure` and `assertNoGraphics` from `src/components/spine/kit.tsx`.
- Produces: `DetailPanel({ name, summary, rows })` where `rows: DetailRow[]` and `type DetailRow = { label: string; value: string; note?: string }`. Every later section that wants a plus renders `<DetailPanel .../>` at the foot of its card, never in place of its drawing.

- [ ] **Step 1: Read the law that already governs the disclosure before writing anything**

Run: `cd /e/atlas/website && sed -n '905,975p' src/components/spine/kit.tsx > scratchpad/disclosure-law.txt; cat scratchpad/disclosure-law.txt`

Expected: the JSDoc that says graphics are always visible and disclosures exist only to move bullet text, plus `assertNoGraphics`, `InlineDisclosure` and `Expand`. The panel below must obey it, not restate it.

- [ ] **Step 2: Write the failing check first**

In `scripts/harness/check_archetypes.mjs`, inside the per-instance rule block, add beside the other `r.kind` branches:

```js
    if (r.kind === "detail-panel") {
      /* THE FOUNDER'S PLUS (2026-09-08): a panel is closed on arrival, its summary
         is one line of ink2 that says what opens, and what opens is rows of text.
         A drawing never hides behind a plus: the kit's assertNoGraphics is the
         construction, this is the measurement. */
      if (r.openOnLoad) red(r.inst, w, "OPEN ON LOAD", "a detail panel is open before anyone clicks it");
      if (r.summaryLines > 1) red(r.inst, w, "SUMMARY WRAP", `the summary takes ${r.summaryLines} lines; it is one line at every width`);
      if (r.panelGraphics) red(r.inst, w, "HIDDEN GRAPHIC", `${r.panelGraphics} drawing(s) inside a disclosure`);
      if (w === WIDTHS[2] && r.summaryHit < 44) red(r.inst, w, "BOTCHED MOBILE", `the plus target is ${r.summaryHit}px tall, under 44`);
    }
```

and in the same file's `inPage()` collector, where the other `r.` fields are set, add:

```js
    if (r.kind === "detail-panel") {
      const det = card.querySelector("details");
      r.openOnLoad = !!det && det.hasAttribute("open");
      const sum = det && det.querySelector("summary");
      r.summaryHit = sum ? Math.round(sum.getBoundingClientRect().height) : 0;
      r.summaryLines = sum ? Math.max(1, Math.round(sum.getBoundingClientRect().height / parseFloat(getComputedStyle(sum).lineHeight || "20"))) : 1;
      r.panelGraphics = det ? det.querySelectorAll("svg, canvas, img, [data-archetype]").length : 0;
    }
```

- [ ] **Step 3: Run the harness to watch the new rule find nothing, because the archetype does not exist yet**

Run: `cd /e/atlas/website && npm run harness:archetypes > scratchpad/harness-panel-before.txt 2>&1; echo "exit $?"; grep -c 'detail-panel' scratchpad/harness-panel-before.txt`

Expected: `exit 0` and `0`. The rule is wired and matches nothing. That is the failing state: a check with no subject.

- [ ] **Step 4: Write the archetype**

Create `src/components/spine/archetypes/DetailPanel.tsx`:

```tsx
import * as React from "react";
import { InlineDisclosure } from "@/components/spine/kit";

/**
 * THE FOUNDER'S PLUS (2026-09-08, his words): "the click and show button was
 * removed, I hoped that you would keep it for those sections where the person
 * clicks a plus and some more info appears for the particular query he is
 * looking at."
 *
 * THE LAW, INSIDE THE COMPONENT:
 *  - It takes ROWS, not children, so nothing can smuggle a drawing behind the
 *    plus. The kit's assertNoGraphics guards the same boundary at runtime;
 *    this type makes it impossible to reach.
 *  - It is closed on arrival. A panel that opens itself is not a disclosure,
 *    it is a wall of prose with a hinge (ruling 15).
 *  - It sits at the FOOT of a card, under the drawing, never in place of it.
 *    The answer is always visible; the plus carries the detail behind the
 *    answer, for the reader who wants that one query.
 *  - Under two rows it draws nothing. One row behind a plus is worse than one
 *    row printed.
 *  - The summary is one line at every width. The harness measures it.
 */
export type DetailRow = { label: string; value: string; note?: string };

export function DetailPanel({ name, summary, rows }: { name: string; summary: string; rows: DetailRow[] }) {
  if (!rows || rows.length < 2) return null;
  return (
    <div data-archetype="detail-panel" data-rows={rows.length}>
      <InlineDisclosure name={name} summary={summary}>
        <dl className="mt-2 grid gap-2">
          {rows.map((r) => (
            <div key={r.label} data-detail-row className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
              <dt className="text-[length:var(--t-micro)] text-[var(--c-ink2)]">{r.label}</dt>
              <dd className="text-[length:var(--t-micro)] font-medium text-[var(--c-ink)] tabular-nums">{r.value}</dd>
              {r.note ? <p className="col-span-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">{r.note}</p> : null}
            </div>
          ))}
        </dl>
      </InlineDisclosure>
    </div>
  );
}
```

- [ ] **Step 5: Write the stories, picked from real data**

In `src/components/spine/archetypes/stories.tsx`, beside the other story sets, add:

```tsx
export function DetailPanelStories() {
  const sets = [
    { key: "GB:setup", summary: "What the fee covers", rows: [
      { label: "Registration fee", value: "$15" },
      { label: "Time until registered", value: "1 day" },
      { label: "Time until the doors open", value: "not measured yet" },
    ] },
    { key: "XX:two", summary: "What moves this figure", rows: [
      { label: "Rent", value: "the largest single cost" },
      { label: "Staff", value: "second, once you hire" },
    ] },
    { key: "XX:omit", summary: "Never drawn", rows: [{ label: "Only one row", value: "so it self-omits" }] },
  ];
  return (
    <>
      {sets.map((s) => (
        <section key={s.key} id={`story-detail-panel-${s.key.replace(":", "-")}`} data-story={s.key} data-kind="detail-panel">
          <DetailPanel name={`story-${s.key}`} summary={s.summary} rows={s.rows} />
        </section>
      ))}
    </>
  );
}
```

Import `DetailPanel` and `DetailRow` at the top of the file, add `DetailPanelStories` to the shared picker beside the others under the kind `"detail-panel"`, and give the three instances the reasons: the exemplar, the two-row minimum, the self-omit.

- [ ] **Step 6: Run the harness and expect the third story to draw nothing and the first two to pass**

Run: `cd /e/atlas/website && npm run harness:archetypes > scratchpad/harness-panel-after.txt 2>&1; echo "exit $?"; grep -E 'archetype harness:|OPEN ON LOAD|SUMMARY WRAP|HIDDEN GRAPHIC' scratchpad/harness-panel-after.txt`

Expected: `exit 0`, `0 design red(s)`, the instance count risen by two (not three: the one-row story self-omits and draws nothing).

- [ ] **Step 7: Typecheck**

Run: `cd /e/atlas/website && npx tsc --noEmit > scratchpad/tsc-panel.txt 2>&1; echo "exit $?"`
Expected: `exit 0`

- [ ] **Step 8: Commit**

```bash
cd /e/atlas/website && git add src/components/spine/archetypes/DetailPanel.tsx src/components/spine/archetypes/stories.tsx scripts/harness/check_archetypes.mjs && git commit -m "archetypes: the founder's plus returns as a detail panel, rows only, closed on arrival"
```

---

### Task 3: The readability measure

He said the page still has readability problems after everything else was fixed, and readability is the one quality nothing in the harness measures. Four things make a page hard to read and all four are measurable from a render.

**Files:**
- Create: `scripts/harness/check_readability.mjs`
- Create: `scripts/harness/fixtures/readability.html`
- Modify: `package.json`

**Interfaces:**
- Consumes: `preflight` from `scripts/harness/preflight.mjs`, called first with `{ browser: true, name: "check_readability" }`.
- Produces: `npm run harness:readability -- --list`, exit 1 on any red, each red naming page, width, card and rule.

- [ ] **Step 1: Write the fixture with four planted faults**

Create `scripts/harness/fixtures/readability.html`:

```html
<!doctype html><html><head><meta charset="utf-8"><style>
:root { --c-ink: rgb(20,20,20); --c-muted: rgb(150,145,140); --c-card: rgb(255,255,255); }
main { max-width: 1120px; margin: 0 auto; background: #efebe8; }
.card { border-radius: 14px; background: var(--c-card); padding: 20px; margin: 32px 0; }
p { font-size: 14px; line-height: 1.5; color: var(--c-ink); }
</style></head><body><main>
<section id="ok" class="rounded-[14px] card"><p style="max-width:60ch">A short measure, dark ink on white, comfortable leading, and a label close to its figure.</p></section>
<section id="toolong" class="rounded-[14px] card"><p style="max-width:none">This line is deliberately far longer than any comfortable measure so that the characters per line count passes the ceiling and the rule fires, and it keeps going well past the point where a reader loses the start of the line before reaching its end, which is exactly the failure being measured here today.</p></section>
<section id="toopale" class="rounded-[14px] card"><p style="color:rgb(205,202,199)">Pale text on white, under the contrast floor.</p></section>
<section id="tootight" class="rounded-[14px] card"><p style="line-height:1.05">Leading crushed to almost nothing so the lines collide with each other and the rule fires.</p></section>
<section id="toosmall" class="rounded-[14px] card"><p style="font-size:10px">A ten pixel paragraph a reader is expected to actually read.</p></section>
</main></body></html>
```

- [ ] **Step 2: Write the checker**

Create `scripts/harness/check_readability.mjs`:

```js
/**
 * READABILITY, MEASURED (the founder, 2026-09-08: "the page still has problems
 * in readability"). Four faults, all measurable from a render, none of which
 * any existing check can see. Run at three widths over every page in
 * scripts/harness/pages.json.
 *
 *  MEASURE      a paragraph over 78 characters per line loses the reader
 *               between the end of one line and the start of the next.
 *  CONTRAST     body text under 4.5:1 against the surface behind it, which is
 *               the WCAG AA floor the repo already claims to hold.
 *  LEADING      line height under 1.35x the font size for any text over two
 *               lines.
 *  READ SIZE    text under 12px that carries words a reader must read. Ten is
 *               for marks, which is the token file's own rule.
 *
 * BLIND SPOT, stated before it is trusted: contrast is computed against the
 * nearest ancestor with a non-transparent background, so a figure over a
 * gradient or an image reports against the layer under it and not what the eye
 * sees. Every page ground is now a flat token, so this holds today and would
 * stop holding the day an image returns.
 *
 * usage: node scripts/harness/check_readability.mjs <rendered.html ...>
 *        node scripts/harness/check_readability.mjs --list[=pages.json]
 */
import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { basename } from "node:path";
import { preflight } from "./preflight.mjs";

preflight({ browser: true, name: "check_readability" });

const WIDTHS = [1280, 768, 375];
const args = process.argv.slice(2);
const listArg = args.find((a) => a === "--list" || a.startsWith("--list="));
const LIST = listArg && listArg.includes("=") ? listArg.slice("--list=".length) : "scripts/harness/pages.json";
const listed = listArg ? JSON.parse(readFileSync(LIST, "utf8")).pages.map((p) => `scratchpad/harness/pages/${p.surface}-${p.slugs.join("-")}.html`) : [];
const files = [...args.filter((a) => !a.startsWith("--")), ...listed];
if (files.length === 0) { console.error("usage: node scripts/harness/check_readability.mjs <rendered.html ...> | --list"); process.exit(2); }

function inPage() {
  const lum = (c) => {
    const m = c.match(/\d+(\.\d+)?/g);
    if (!m) return null;
    const [r, g, b] = m.slice(0, 3).map((v) => { const s = Number(v) / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const behind = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return bg;
      n = n.parentElement;
    }
    return "rgb(255, 255, 255)";
  };
  const out = [];
  const cards = [...document.querySelectorAll('main [class*="rounded-[14px]"]')].filter((c) => c.getClientRects().length && !c.parentElement.closest('[class*="rounded-[14px]"]'));
  for (const card of cards) {
    const id = card.id || card.querySelector("[id]")?.id || "card";
    for (const el of card.querySelectorAll("*")) {
      if (el.children.length || !el.getClientRects().length) continue;
      const text = (el.textContent || "").trim();
      if (text.length < 25) continue;
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight) || size * 1.2;
      const w = el.getBoundingClientRect().width;
      const lines = Math.max(1, Math.round(el.getBoundingClientRect().height / lh));
      const cpl = lines > 0 ? Math.round(text.length / lines) : text.length;
      const l1 = lum(cs.color), l2 = lum(behind(el));
      const ratio = l1 == null || l2 == null ? 21 : (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const snip = text.slice(0, 28);
      if (cpl > 78) out.push({ id, rule: "MEASURE", detail: `${cpl} characters a line over ${Math.round(w)}px, past 78 ("${snip}")` });
      if (ratio < 4.5) out.push({ id, rule: "CONTRAST", detail: `${ratio.toFixed(2)} to 1 against what is behind it, under 4.5 ("${snip}")` });
      if (lines > 2 && lh / size < 1.35) out.push({ id, rule: "LEADING", detail: `line height ${(lh / size).toFixed(2)} of the font size over ${lines} lines, under 1.35 ("${snip}")` });
      if (size < 12) out.push({ id, rule: "READ SIZE", detail: `${size}px carrying ${text.length} characters a reader must read ("${snip}")` });
    }
  }
  return out;
}

const reds = [];
const browser = await chromium.launch();
for (const file of files) {
  const name = basename(file).replace(/\.html$/, "");
  if (!existsSync(file)) { reds.push({ name, w: "all", id: "-", rule: "NO RENDER", detail: "the list names this page and no render exists" }); continue; }
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(pathToFileURL(file).href, { waitUntil: "load" });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    const found = await page.evaluate(inPage);
    for (const f of found) reds.push({ name, w, ...f });
    console.log(`${name}@${w}: ${found.length} readability red(s)`);
    await ctx.close();
  }
}
await browser.close();
console.log(`readability: ${files.length} page(s) x ${WIDTHS.length} widths, ${reds.length} red(s)`);
for (const r of reds) console.log(`  ${r.name}@${r.w} #${r.id}: ${r.rule}: ${r.detail}`);
process.exit(reds.length ? 1 : 0);
```

- [ ] **Step 3: Run it on the fixture, expect four named reds and nothing on the good card**

Run: `cd /e/atlas/website && node scripts/harness/check_readability.mjs scripts/harness/fixtures/readability.html > scratchpad/readability-fixture.txt 2>&1; echo "exit $?"; grep -E 'MEASURE|CONTRAST|LEADING|READ SIZE|red\(s\)' scratchpad/readability-fixture.txt`

Expected: `exit 1`; one `MEASURE` on `#toolong`, one `CONTRAST` on `#toopale`, one `LEADING` on `#tootight`, one `READ SIZE` on `#toosmall`, and no red naming `#ok`.

- [ ] **Step 4: The npm script**

In `package.json`, after `"harness:page"`, add `"harness:readability": "node scripts/harness/check_readability.mjs",`.

- [ ] **Step 5: Run it on the three real pages and record the first reading**

Run: `cd /e/atlas/website && npm run harness:readability -- --list > scratchpad/readability-live.txt 2>&1; echo "exit $?"; tail -30 scratchpad/readability-live.txt`

Expected: a real count. Every red found here is a finding, not a failure of the check: append each to the catalogue as a `REWORK` note against the section it names. Do not fix them in this task. This step exists to give the loop its readability backlog.

- [ ] **Step 6: Commit**

```bash
cd /e/atlas/website && git add scripts/harness/check_readability.mjs scripts/harness/fixtures/readability.html package.json && git commit -m "harness: readability measured, four rules, proved on a fixture"
```

---

### Task 4: The model's twelve laws, enforced

MODEL.md Part 8.5 names twelve laws that today are prose. A ratified rule becomes a gate in the same session or it is written down as not machine-checkable: that is this repo's own working method, and four founder rulings have already come back a second time for want of it.

**Files:**
- Create: `scripts/harness/check_model_laws.mjs`
- Create: `scripts/harness/fixtures/model_laws.html`
- Modify: `package.json`, `scripts/prebuild_all.ts`, `CLAUDE.md`

**Interfaces:**
- Consumes: `preflight` as in Task 3.
- **`EVEN_BY_RULING` in `check_page_holes.mjs` is FROZEN at its four members.** Seven of the eighteen reviewed briefs asked to be added to it. A section that cannot pass a rule is redesigned; the rule is never widened to admit it. Add a comment saying so above the set.
- Produces: `npm run harness:laws -- --list`. Each red names page, width, card, and one of: `BLOCK FLOOR`, `LONE CARD`, `FLAG`, `LABEL GAP`, `UNIT MIX`, `BANNED WORDS`, `DISTRICT ADJECTIVE`, `ROW SENTENCE`, `FOCAL`, `PLACEMENT`, `EDGE`, `TWO-LINE CELL`.

- [ ] **Step 1: Write the fixture, one planted fault per rule**

Create `scripts/harness/fixtures/model_laws.html` with twelve cards, each carrying exactly one fault, each with an id naming its rule: `#floor` (a page of three blocks), `#lone` (a band with one child), `#flag` (an `img` with `aspect-[3/2] object-cover` on a 3:1 source), `#gap` (a `justify-between` row 600px wide), `#unit` (a column mixing `%` and `$`), `#banned` (a cell reading `same`), `#adjective` (a district row reading `gentrifying`), `#sentence` (a label of nine words), `#focal` (two figures at 30px in one card), `#placement` (a bar with no placement line), `#edge` (a card border equal to its inner hairlines), `#twoline` (a hero fact cell of four lines). Give each card the marker attributes the checker reads (`data-band`, `data-block`, `data-fact-cell`, `data-track`, `data-district-row`), so the fixture exercises the same selectors the real pages carry.

- [ ] **Step 2: Write the checker, one measurement per rule**

Create `scripts/harness/check_model_laws.mjs`, structured exactly like `check_readability.mjs` (the same preflight, the same `--list` handling, the same red shape, the same exit contract). Inside its `inPage()`, implement each rule as its own small block with the model's clause quoted in a comment above it, in this order: `BLOCK FLOOR` (count `[data-block]` against a floor passed per page), `LONE CARD` (`[data-band]` with one element child), `FLAG` (`img[data-flag]` whose rendered ratio differs from its natural ratio by more than 0.02, or whose height is not `--flag-hero` or `--flag-row`), `LABEL GAP` (a label and its figure separated by more than a third of the card width), `UNIT MIX` (two different unit suffixes inside one `[data-col]`), `BANNED WORDS` (`same`, `baseline`, `x1.00`, `world's highest` as a whole cell), `DISTRICT ADJECTIVE` (free text in `[data-district-row] [data-note]`), `ROW SENTENCE` (a `[data-label]` over three words, a `[data-pole]` over three words or 24 characters), `FOCAL` (more than one 30px figure per card, or any size strictly between 16 and 30 in a card that has one), `PLACEMENT` (a `[data-track]` with no sibling `[data-placement]`), `EDGE` (a card's border colour equal to any hairline colour inside it), `TWO-LINE CELL` (a `[data-fact-cell]` over two lines).

- [ ] **Step 3: Run on the fixture, expect twelve reds, one per card**

Run: `cd /e/atlas/website && node scripts/harness/check_model_laws.mjs scripts/harness/fixtures/model_laws.html > scratchpad/laws-fixture.txt 2>&1; echo "exit $?"; grep -c ': ' scratchpad/laws-fixture.txt`

Expected: `exit 1` and twelve reds, each naming a different rule and a different card.

- [ ] **Step 4: Wire the npm script and register the browser-free half as a gate**

In `package.json` add `"harness:laws": "node scripts/harness/check_model_laws.mjs",`. In `scripts/prebuild_all.ts`, register `model-laws-copy` after `archetype-copy`: the copy half only (banned words, row sentence, district adjective), because the chain must never need a browser or a database.

- [ ] **Step 5: Rewrite the generated counts and commit all three carrier files**

Run: `cd /e/atlas/website && npx tsx scripts/counts.ts --write > scratchpad/counts-laws.txt 2>&1; echo "exit $?"; git status --short`

Expected: `exit 0`, and three modified files: `CLAUDE.md`, `docs/loop/02-ORGANISATION-RESEARCH.md`, `docs/verification-protocol.md`. All three are committed together. Run 24 committed one and left two, and run 25 paid for it.

- [ ] **Step 6: Commit**

```bash
cd /e/atlas/website && git add scripts/harness/check_model_laws.mjs scripts/harness/fixtures/model_laws.html scripts/prebuild_all.ts package.json CLAUDE.md docs/loop/02-ORGANISATION-RESEARCH.md docs/verification-protocol.md && git commit -m "harness: the model's twelve laws measured, proved on a fixture, the copy half in the chain"
```

---

### Task 5: The harmony review, how the sections sit together

Every check so far judges one card. He asked for the opposite: "a final review in terms of harmony, and how well sections fit together." That is a page-level reading and it needs both a measurement and a picture, because half of harmony is not measurable and must be looked at.

**Files:**
- Create: `scripts/harness/harmony_sheet.mjs`
- Modify: `package.json`
- Modify: `E:\atlas\design\loop\build\DOCTRINE.md`

**Interfaces:**
- Produces: `npm run harmony -- <rendered.html> <out.jpeg>`, writing one tall picture of the whole page at half scale with every band bracketed and every accent outlined, and printing a harmony table to stdout: per band, the two cards' heights, their forms, their loud or quiet state, and the gap between them.

- [ ] **Step 1: Write the tool**

Create `scripts/harness/harmony_sheet.mjs`. It launches chromium through `preflight({ browser: true, name: "harmony_sheet" })`, loads the render at 1280, sets every image eager and decodes, then:

1. Measures, per band: the two cards' natural heights, their `data-archetype` forms, whether either carries an accent figure, and the vertical gap to the band above.
2. Prints the harmony table, and prints one line per finding under these four headings, which are the model's own pairing law in 8.4: `FORM ECHO` (two adjacent sections sharing a form), `LOUD NEXT TO LOUD`, `HEIGHT SPREAD` (two cards in a band whose natural heights differ by more than a third before stretching, which is a pairing fault even though equal heights hide it), and `RHYTHM` (three or more consecutive bands with no chapter break).
3. Captures each card from the viewport (never full page: a full-page shot paints a white block over the fixed layers), stacks them into one tall jpeg at half scale on a `--c-ground` field, brackets each band, and outlines each accent figure.

Exit 0 always: harmony is a reading, not a gate. The run records it and judges it by eye.

- [ ] **Step 2: Prove it on the country page**

Run: `cd /e/atlas/website && npm run harmony -- scratchpad/harness/pages/country-GB.html scratchpad/harness/shots/country-harmony.jpeg > scratchpad/harmony-country.txt 2>&1; echo "exit $?"; cat scratchpad/harmony-country.txt`

Expected: `exit 0`, a harmony table with one row per band, the four finding headings, and the picture written. Open the picture with the Read tool and judge it against MODEL.md Part 8.4. This is the first harmony reading and it is recorded in the ledger whatever it says.

- [ ] **Step 3: The doctrine gains the stage**

In `E:\atlas\design\loop\build\DOCTRINE.md`, in section 4, after `- S8 RECORD.`, add:

```
- S9 HARMONY (the founder, 2026-09-08: "a final review in terms of harmony, and how well sections fit together"). Once a page's catalogue rows are all DONE, and never before, the page is read whole: `npm run harmony` for the table and the picture, the picture opened with the Read tool, and the page judged against MODEL.md Part 8.4 (measured height, form, volume, subject) and Part 8.2 or 8.3's rhythm. A finding here is a REWORK row naming the two sections that do not sit together, never a repaint of one card in isolation. The reading is recorded in the ledger and the picture is sent to the founder with the eight lines.
```

- [ ] **Step 4: Commit both repos**

```bash
cd /e/atlas/website && git add scripts/harness/harmony_sheet.mjs package.json && git commit -m "harness: the harmony sheet, how a page's sections sit together"
```

```bash
cd /e/atlas && git add design/loop/build/DOCTRINE.md && git commit -m "build loop: S9 HARMONY, the page read whole once its sections are done"
```

---

### Task 6: The shadcn consult, so forms are chosen and not invented

He said not to forget the wealth of shadcn components available. Twenty-five primitives sit in `src/components/ui/` and the full registry is reachable through the Shadcn_UI MCP server. The failure to avoid is inventing a fifth way to draw a list when a solved component exists, and the opposite failure is dragging a component in whose look fights the model.

**Files:**
- Modify: `E:\atlas\design\loop\build\DOCTRINE.md` (section 4, stage S1.5)

- [ ] **Step 1: Read what is already local before adding anything**

Run: `cd /e/atlas/website && ls src/components/ui/ > scratchpad/ui-local.txt; cat scratchpad/ui-local.txt`

Expected: 25 entries including `disclosure.tsx`, `table.tsx`, `chart.tsx`, `stat-card.tsx`, `stat-row.tsx`, `progress-bar.tsx`, `tier-dot.tsx`, `toggle-group.tsx`, `tooltip.tsx`.

- [ ] **Step 2: The doctrine gains the consult**

In `DOCTRINE.md` section 4, inside the `S1.5 DIRECT` bullet, append this sentence:

```
Before naming a form, the brief consults what already exists, in this order and recorded in one line: the eleven archetypes; the twenty-five primitives in `src/components/ui/`; then the shadcn registry through its MCP server (`list_components`, `list_blocks`, `get_component`) for the shape being drawn. A NEW form is written only when the consult found nothing that fits, and the brief says what it looked at and why each was wrong. A shadcn component is adopted for its STRUCTURE and behaviour, never its skin: its colours, radii, shadows and type sizes are replaced with the model's tokens in the same commit, and the harness's LADDER and EDGE rules are what prove it.
```

- [ ] **Step 3: Verify the sentence landed**

Run: `cd /e/atlas/design/loop/build && grep -c 'shadcn registry through its MCP server' DOCTRINE.md`
Expected: `1`

- [ ] **Step 4: Commit**

```bash
cd /e/atlas && git add design/loop/build/DOCTRINE.md && git commit -m "build loop: the form consult, archetypes then primitives then the shadcn registry, structure not skin"
```

---

### Task 7: The queue, seeded from the catalogue

**Files:**
- Modify: `E:\atlas\design\loop\build\QUEUE.md`
- Modify: `E:\atlas\design\loop\build\STATE.md`

- [ ] **Step 1: Write the seeding script**

Write `scratchpad/arch/seed_queue.py` with the Write tool. It reads `CATALOGUE.md`, takes every row whose status is `TODO` or `REWORK`, and appends one queue row per catalogue row in catalogue order, under a new heading `## I. Creation, from the catalogue`, in the queue's existing five-column format, with the done-means column filled from the catalogue's form and data source plus the fixed sentence: `built to its block in briefs/<page>.md, every check layer green, its harmony reading recorded`. The four `SPINE` rows come first, each before its page's sections. It asserts the queue's heading is absent before writing, so a second run cannot double-seed.

- [ ] **Step 2: Run it and read the count**

Run: `cd /e/atlas/website && python scratchpad/arch/seed_queue.py; echo "exit $?"; grep -c '^| .*:' /e/atlas/design/loop/build/QUEUE.md`

Expected: `exit 0`, and a row count that has risen by at least 38 (21 country plus 17 city) plus the four spine rows plus every hood, cell, industry and howto row the census found.

- [ ] **Step 3: Point the state at the first row**

Set `next-step:` in `STATE.md` to: `the debug pass first; then the first TODO row of QUEUE.md section I, in catalogue order; a page's SPINE row before any of its sections; S1.5 DIRECT writes the block in briefs/<page>.md before any code`.

- [ ] **Step 4: Commit**

```bash
cd /e/atlas && git add design/loop/build/QUEUE.md design/loop/build/STATE.md && git commit -m "build loop: the queue seeded from the catalogue"
```

---

### Task 8: The kickstart prompt

The deliverable he asked for by name. One paste that starts the loop and carries the whole intent, so nothing has to be remembered between runs.

**Files:**
- Create: `E:\atlas\design\loop\build\CREATE-PROMPT.md`

- [ ] **Step 1: Write the prompt file**

Create `E:\atlas\design\loop\build\CREATE-PROMPT.md`:

````markdown
# The section creation loop, the kickstart prompt

Start it in an interactive Claude Code session opened in `E:\atlas\website`:

```
/loop 20m <paste everything between the rules below>
```

---

You are one run of the SECTION CREATION LOOP for marginatlas.com. Your role is
the lead designer of a serious software product, and your only goal this run is
to CREATE one section, whole, to the model. Not to migrate one, not to tidy one,
not to plan. Create it: designed, drawn, checked, and fitted to the page it
lives on. Working directories: `E:\atlas\website` (the site, its own git repo on
main, commits stay local, never push) and `E:\atlas` (rules, design, this loop's
state, branch p4-seam). Every shell command begins with a cd, because the working
directory drifts between calls and has already cost eight silent failures.

1. ORIENT, never from memory of a previous run. Read in this order:
   `E:\atlas\design\loop\build\briefs\MODEL.md` IN FULL, which is the design law
   and outranks every older note; DOCTRINE.md; STATE.md; CATALOGUE.md;
   the first thirty rows of QUEUE.md; DEBUG.md; VERDICTS.txt; REPORT.md.

2. VERDICTS. Any line in VERDICTS.txt below the marker STATE.md records is the
   founder's ruling. Copy it verbatim into `E:\atlas\rules\FOUNDER-VERDICTS.md`
   under a dated heading, turn it into a queue row or a model clause, move the
   marker, and only then continue. A ruling outranks everything, including the
   model, and the model is amended in the same run to match it.

3. DEBUG PASS, five minutes at most. `npm run harness`, `npm run harness:readability -- --list`,
   `npm run harness:laws -- --list`, `npx tsc --noEmit`, each redirected to its
   own file under scratchpad/, each exit code read from the shell, each file
   opened. A red is this run's first job. Never create on top of a red.
   Environment failures are not findings: DEBUG.md section 4 says how to tell.

4. TAKE ONE ROW. Resume the row STATE.md names at the stage it names, otherwise
   take the first TODO or REWORK row of QUEUE.md section I in catalogue order. A
   page's SPINE row is always taken before any of that page's sections. One row.
   Never two.

5. DIRECT before you draw (S1.5). Write the section's block in
   `briefs/<page>.md`: why a reader wants it, the one sentence they leave with,
   loud or quiet against the page's budget of three, what the data holds that
   you deliberately will not draw, what it must not repeat from the sections
   either side of it, the ladder of lead, support and whisper, and the change
   from what exists. Then the form consult, in one line: the eleven archetypes,
   then the twenty-five primitives in `src/components/ui/`, then the shadcn
   registry through its MCP server. Adopt structure and behaviour, never skin:
   tokens replace its colours, radii, shadows and type sizes in the same commit.
   A row whose block is missing is not built.

6. CREATE. The component with the law inside it: equal heights by construction,
   reserved label lines, ends inside the box, self-omit below the honest
   minimum, tokens never hex, copy in `src/lib/spine/copy.ts`, rows from a local
   synchronous builder in `src/lib/spine/<name>_rows.ts`, a data attribute on
   every measured part, and an accessible name that says what the drawing says.
   Where a reader will want the detail behind the answer, the section carries
   the founder's plus (`DetailPanel`) at its foot: rows of text only, closed on
   arrival, never a hidden drawing, never in place of the answer.

7. STORIES. Instances picked FROM THE DATA in `stories.tsx`: the exemplar, the
   data-poor case, the extremes of name and of value, the self-omit. Wired into
   the renderer and the dev page.

8. CHECK, in four layers, each to a file, each exit code read:
   LAYER ONE, the card: `npm run harness:archetypes`. Zero design reds.
   LAYER TWO, the page: `npm run harness:page`. Zero holes, the accent budget
   held at three, no lone card, no wall.
   LAYER THREE, the reader: `npm run harness:readability -- --list` and
   `npm run harness:laws -- --list`. Zero reds.
   LAYER FOUR, the repo: `npx tsc --noEmit` clean, then `npm run prebuild:serial`
   when free memory allows, read from its file, never piped.
   A data red is listed for the data track and never fixed by drawing.

9. PHOTOGRAPH AND JUDGE. `npm run shoot:page` at 1280, 768 and 375. Open every
   picture with the Read tool and judge it, first against the section's own
   brief (does the picture say the takeaway, at the rung the ladder gave it,
   loud or quiet as the budget says, with the hidden things hidden), then
   against the model. Never judge from markup. A fault found is fixed and
   photographed again in the same run.

10. HARMONY (S9), once a page's catalogue rows are all DONE and never before.
    `npm run harmony` for the table and the picture; open the picture; read the
    page whole against MODEL.md Part 8.4 and its rhythm. A finding is a REWORK
    row naming the two sections that do not sit together, never a repaint of one
    card alone.

11. RECORD before ending: LEDGER.md in the doctrine's entry shape; CATALOGUE.md
    row set to DONE; QUEUE.md updated; STATE.md written after every stage;
    DATA-REQUIREMENTS.md appended for every figure the data does not hold;
    PAGES.md and SYSTEMS.md when a section or a system changed; REPORT.md as the
    eight plain lines. One commit in each repo, by file name, never `git add -A`,
    never push.

12. REPORT to the founder as eight lines a friend who designs would say, and one
    picture: what changed on the page and the difference a reader sees; why;
    what is loud now and what went quiet; what you left out and why; what the
    checks say; what the picture shows that the checks cannot; what is next; what
    he can settle with one line in VERDICTS.txt. No file paths, no rule names, no
    gate names, no commit hashes, no run numbers.

HARD RULES, restated because these are the ones that get broken: never fabricate
a figure, a place detail, a note or a source; never edit a rule file except to
append his words verbatim; never rename a URL; no em dash, no source-agency
name, no raw hex or pixel in a component; two cards on one level always share a
height; nothing botched on a phone; a graphic is never hidden behind a plus; the
practical register, never the corporate one; one change then one verification
then the next; a JSX comment never opens a ternary branch; the serial chain
only, alone, above 900 MB free; every photograph a viewport capture; never open a
browser to show him anything; never ask him to look or decide inside a run, the
loop decides and records why.

WHAT DONE LOOKS LIKE FOR THIS PHASE: every row of CATALOGUE.md is DONE, every
page is at or above its floor, all four check layers are green on every page in
the filter, each page has a recorded harmony reading with no open finding, and
the founder has one picture of each page whole.

If QUEUE.md has nothing TODO or REWORK and VERDICTS.txt has nothing new, run the
debug pass, take the oldest page by harmony reading and re-read it whole, write
one line to REPORT.md, and end.
````

- [ ] **Step 2: Check the prompt names every file it tells the run to read**

Run: `cd /e/atlas/design/loop/build && for f in briefs/MODEL.md DOCTRINE.md STATE.md CATALOGUE.md QUEUE.md DEBUG.md VERDICTS.txt REPORT.md; do test -f "$f" && echo "ok $f" || echo "MISSING $f"; done`

Expected: eight `ok` lines and no `MISSING`.

- [ ] **Step 3: Check every npm script the prompt names exists**

Run: `cd /e/atlas/website && for s in harness harness:archetypes harness:page harness:readability harness:laws harmony shoot:page census prebuild:serial; do node -e "const p=require('./package.json'); process.exit(p.scripts['$s']?0:1)" && echo "ok $s" || echo "MISSING $s"; done`

Expected: nine `ok` lines and no `MISSING`.

- [ ] **Step 4: Commit**

```bash
cd /e/atlas && git add design/loop/build/CREATE-PROMPT.md && git commit -m "build loop: the kickstart prompt for the section creation loop"
```

---

### Task 9: The words and the units, no layout

Stage 4 of the order. It had no numbered task, which was a gap in this plan,
and it is written here before it is executed. It closes THREE of the founder's
named complaints at once and touches no layout, which is why it comes before
any card is redesigned.

His words, 2026-09-07:
- "you point the thing which says the world's highest, which is Switzerland.
  That's very bad. You should never put the limit out there."
- "for the table, you say cheaper to live, customer income, visitors, and then
  you just say you mention the word same. That's a major mistake."
- "for Los Angeles you say minus 14, for Paris you say plus 2, for customer
  income you say minus 10%, and for Los Angeles you say plus 3%. So you have
  made a mishmash of all of these things."

**Files:**
- Modify: `src/lib/spine/copy.ts` (`COPY.pay.edge`, `COPY.cityPeers.same`)
- Modify: `src/components/spine/archetypes/PayBars.tsx` (the `edgeLabel` prop and its render)
- Modify: `src/components/spine/archetypes/stories.tsx` and `src/components/spine/country/country-view.tsx` (the two `edgeLabel` call sites)
- Modify: `src/components/spine/archetypes/CompareTable.tsx` (the `index`, `pctdiff` and `x` units)
- Modify: `src/lib/spine/peer_rows.ts` (`buildCityPeerTable`)
- Modify: `scripts/verify_archetype_copy.ts` (the banned-phrase list, and the `x1.00` assertion that collides with `model-laws-copy`)

**Interfaces:**
- Produces: a `CompareColumn["unit"]` of `"pct" | "usd" | "days"` only. Every consumer
  of the removed three must supply an absolute in its column's own unit.

- [ ] **Step 1: The world's highest loses its name, and the track keeps its edge**

His decision of 2026-09-08 was "Keep the track, drop the label": the bar still
ends at the world maximum, and the country holding it is never named. So delete
`COPY.pay.edge` ("World's highest: {name}, {figure}"), delete the `edgeLabel`
prop from `PayBarsProps` and its `<span data-edge>` render, and delete both call
sites. Do NOT change the track's domain: `worldMax` still sets where the bar
ends, which is ruling 13 and still stands. Replace nothing at the edge; the
placement sentence of Task 10 is what tells the reader where the country sits,
and it is a separate task on purpose.

- [ ] **Step 2: Read what the peers table actually has before deleting its units**

The city peers table is the only consumer of `index`, `pctdiff` and `x`, so
deleting those three units breaks it unless its builder can supply absolutes.
Do not assume it can.

Run: `cd /e/atlas/website && grep -n 'index\|pctdiff\|x\b\|unit' src/lib/spine/peer_rows.ts > scratchpad/peers-units.txt 2>&1; echo "exit $?"; cat scratchpad/peers-units.txt`

Then read the data the builder reads. Establish, and write into your report,
whether an ABSOLUTE exists for each of the three columns (cheaper to live,
customer income, visitors) for a peer city, or whether only a relative figure
is held.

- If absolutes exist: the table prints them, each column in its own unit, one
  decimal count per column, and the home row is shaded rather than printing a
  zero or the word "same".
- If only relatives exist: this is a DATA requirement, not a design choice.
  Record it in `E:\atlas\design\loop\build\DATA-REQUIREMENTS.md`, and for this
  pass keep the column but print the absolute the site DOES hold for the home
  city with the peer's own figure beside it, so a reader compares two numbers
  rather than reading a signed difference with no anchor. Never print a bare
  word where a column holds figures, and never mix a signed count with a signed
  percentage in one table.

The column COUNT is not touched in this task. He asked for two more metrics and
the model says that table moves once, after the unit law is proven on cards he
has not praised. Note it and leave it.

- [ ] **Step 3: Delete the bare word**

`COPY.cityPeers.same` and both branches that print it
(`CompareTable.tsx` `unit === "index"` and `unit === "pctdiff"`) go. A cell in a
column of figures holds a figure.

- [ ] **Step 4: Settle the collision between two gates, which is already recorded**

`scripts/verify_archetype_copy.ts` asserts a cell equals the exact string
`x1.00`, and `model-laws-copy` bans it as a banned word. They cannot both be
right. The founder's words settle it: "then you say the city average times one
which is the baseline. You don't seem to have an idea on how the information
should be actually given." The banned-word gate is correct and the assertion is
the stale one. Change the assertion to require what the cell should now print,
and say in its comment that it was changed because of his ruling, not because it
was inconvenient.

- [ ] **Step 5: Verify, each to its own file, each exit code read**

```bash
cd /e/atlas/website && npx tsc --noEmit > scratchpad/tsc-t9.txt 2>&1; echo "exit $?"
```

```bash
cd /e/atlas/website && npm run harness > scratchpad/harness-t9.txt 2>&1; echo "exit $?"
```

```bash
cd /e/atlas/website && npx tsx scripts/prebuild_all.ts --concurrency=1 --only=archetype-copy,model-laws-copy > scratchpad/gate-t9.txt 2>&1; echo "exit $?"
```

Both gates must pass together, which is the proof the collision is settled. The
harness exits 1 on the two known standing accent reds and nothing else.

- [ ] **Step 6: Photograph the peers table and the staff bars, and look**

```bash
cd /e/atlas/website && npm run shoot:page -- scratchpad/harness/pages/city-london.html "#peers" scratchpad/photos/t9-peers "1280,375"
```

Open both with the Read tool. Every cell in a column carries the same kind of
figure, no cell is a word, and the staff card names no country at its edge.

- [ ] **Step 7: Commit**

```bash
cd /e/atlas/website && git add src/lib/spine/copy.ts src/components/spine/archetypes/PayBars.tsx src/components/spine/archetypes/CompareTable.tsx src/components/spine/archetypes/stories.tsx src/components/spine/country/country-view.tsx src/lib/spine/peer_rows.ts scripts/verify_archetype_copy.ts && git commit -m "copy: the world's highest loses its name, the peers table loses its bare word and its mixed units"
```

---

### Task 10: The placement sentence

Stage 5 of the order, and the other half of his staff-cost complaint. It is a
separate task from Task 9 because Task 9 REMOVES the thing that misled a reader
and this one ADDS the thing that informs him, and stacking a fix behind a fix
makes neither falsifiable.

His words, 2026-09-07: "you have made the minimum salary of 25k a year appear
like it is small for the world. So you have made the mistake in terms of
understanding how does the United Kingdom fit relating to the whole world.
That's a very bad thing, because the minimum salary of 25k for the world is
quite a high one. So your thing should reflect that."

The model, PART 9, forbids "a figure on a world track without its placement line
beside it. A high wage may never read as small", and forbids "placement written
in coined tier words. One fixed sentence, one direction, the same words meaning
the same rank on every page." The `PLACEMENT` rule already fires on every track
on every page, so this task's success is that rule going quiet honestly.

**Files:**
- Create: `src/lib/spine/placement.ts`
- Modify: `src/lib/spine/copy.ts` (the one wording)
- Modify: the five callers: the staff bars, the premises strip, the world seat, the running costs and the customers strip
- Modify: `src/components/spine/archetypes/stories.tsx`

**Interfaces:**
- Produces: `placementOf(value: number, all: number[]): { share: number; words: string } | null`,
  returning null under an honest minimum of comparable places, and one fixed
  sentence otherwise. Every caller renders it in an element carrying
  `data-placement` so the harness rule can see it.

- [ ] **Step 1: One wording, one direction, decided once and written down**

In `copy.ts`, one string, and only one, with its direction fixed: higher is
always more. It says where the figure sits among the places that hold the same
figure, in plain words a reader needs no key for, and it never names another
country. It is the same sentence on every page and every card, so a reader who
learns it once reads it everywhere. No coined tier words: the model bans a word
placement that comes out the same for most countries, which is the failure he
named himself.

- [ ] **Step 2: The helper, with its honest minimum**

`placementOf` computes the share of comparable places at or below the value, and
returns null when fewer than a stated minimum of places hold the figure, because
a placement among six countries is not a placement among the world. Write the
minimum as a named constant with the reason beside it. Never fabricate: the
comparison set is the file's own, read at call time.

- [ ] **Step 3: Prove it differentiates before wiring it anywhere**

This is the step that stops the failure the model names. Run the helper across
every country the file holds and count the distinct sentences it produces.

```bash
cd /e/atlas/website && npx tsx scratchpad/arch/placement_spread.ts > scratchpad/placement-spread.txt 2>&1; echo "exit $?"
```

If the wording collapses most countries onto one or two sentences, it is a tier
word wearing a sentence's clothes and it fails. Report the distribution. Adjust
the wording, not the data, until a reader in a median country and a reader in a
top-decile country are told different things.

- [ ] **Step 4: Wire the five callers**

Each renders the sentence beside its figure in an element carrying
`data-placement`. The United Kingdom's minimum wage must now read as high,
which is the acceptance test he gave: check it by eye on the photograph, not by
assertion.

- [ ] **Step 5: Verify**

```bash
cd /e/atlas/website && npx tsc --noEmit > scratchpad/tsc-t10.txt 2>&1; echo "exit $?"
```

```bash
cd /e/atlas/website && npm run harness:laws -- --list > scratchpad/laws-t10.txt 2>&1; echo "exit $?"
```

The `PLACEMENT` count must fall to zero on every page, and the fall is the proof.
Report the before and after counts.

- [ ] **Step 6: Photograph the staff card and read the sentence as a stranger**

```bash
cd /e/atlas/website && npm run shoot:page -- scratchpad/harness/pages/country-GB.html "#hiring" scratchpad/photos/t10-hiring "1280,375"
```

Open it. Ask the one question that matters: does 25,000 now read as a high wage
or a low one. Say what you actually see, not what you intended.

- [ ] **Step 7: Commit**

```bash
cd /e/atlas/website && git add src/lib/spine/placement.ts src/lib/spine/copy.ts src/components/spine/archetypes/stories.tsx && git commit -m "placement: one sentence, one direction, so a high figure never reads as low"
```

---

### Task 11: The income breakdown, his most literal instruction

He sent design references on 2026-09-10 and then said what each is for. Of the
fifteen, this is the least ambiguous: "the income breakdown is used exactly for
income brekdown with the main figure being the net income percentage."

It is also the fix for the section he called **totally broken**: "for the net
profit margin, this section that you have created, it's totally broken."

**The form, ported from his reference (mechanic B6 in
`design/references/founder-2026-09-10.md`):** one headline percentage, a single
horizontal bar split into segments beneath it, and a legend under that naming
each segment with its share. His reference pairs the headline with a small
delta pill and prints the segments hatched in different tones.

**Files:**
- Create: `src/components/spine/archetypes/IncomeBreakdown.tsx`
- Create: `src/lib/spine/income_rows.ts`
- Modify: `src/lib/spine/copy.ts`, `src/components/spine/archetypes/stories.tsx`,
  `scripts/harness/render_archetypes.tsx`, `src/app/dev/archetypes/page.tsx`
- Modify: `scripts/harness/check_archetypes.mjs` (its own checks)

**Interfaces:**
- Produces: `buildIncomeBreakdown(sector)` returning
  `{ netPct: number; segments: Array<{ key: string; label: string; share: number }>; modelled: true } | null`,
  null under an honest minimum. `IncomeBreakdown({ id, kicker, netPct, segments, basis })`.

- [ ] **Step 1: Read the data before designing against it**

`data/finance/industry_cost_profile_v1.json` holds 25 sectors, each with
`cogs_share`, `labor_share`, `rent_share`, `energy_share`, `marketing_share`,
`software_share`, `insurance_share`, `other_overhead_share`, and
`net_margin_typical_low` / `net_margin_typical_high`.

Run: `cd /e/atlas/website && python -c "import json,io;d=json.load(io.open('data/finance/industry_cost_profile_v1.json',encoding='utf-8'));s=d['sectors'];print(type(s),len(s));print(json.dumps(s[0] if isinstance(s,list) else s[list(s.keys())[0]])[:600])" > scratchpad/icp-shape.txt 2>&1; echo "exit $?"`

Read the file's own `anchor` and `convention` fields and report what they say
about where these shares come from. They are a GLOBAL BASELINE flexed by a
country modifier, which means every figure this card prints is MODELLED, not
measured. That governs Step 4.

- [ ] **Step 2: The builder, with its honest minimum and its arithmetic stated**

`buildIncomeBreakdown` reads a sector and returns the net percentage plus the
segments. Two rules the component cannot violate:
- The segments and the net percentage must SUM TO ONE HUNDRED. If the file's
  shares plus the net figure do not, the difference is a real residual and it
  is named as its own segment, never silently absorbed into another line and
  never hidden. A breakdown that does not add up is worse than no breakdown.
- Below a stated minimum of segments the builder returns null and the section
  self-omits, the same law every archetype here follows.

Cap the drawn segments so the bar stays readable: the largest few by share are
named individually and the remainder is one clearly labelled segment. Choose the
cap, state it as a named constant with its reason, and never let the remainder
be the largest segment.

- [ ] **Step 3: The component, with the law inside it**

The headline is the net percentage at the focal rung. The bar is ONE bar, full
width, its segments in descending share, each segment carrying a data attribute
with its key and share so the harness can measure it. The legend beneath names
each segment and prints its share, one per line or in a tight grid.

Segments are distinguished by TONE and HATCH, not by hue: this palette is
terracotta and warm neutrals and the page's accent budget is three figures. The
net segment may take the terracotta; every cost line is neutral.

**This card counts as ONE of the page's three bar-family drawings.** Say so in
the component's own comment so the next person counting does not miss it.

- [ ] **Step 4: Marked sample, and quiet, both by his own rulings**

His decision of 2026-09-08 on this exact section: ship it "labelled sample, and
quiet", with the accent moved off it, because it prints the same figures for
every country until per-country margin data exists. So: the card wears the
sample mark, and it is NOT one of the page's three loud moments. The basis line
says plainly that the split is typical for the trade rather than measured for
this place, in the practical register, naming no source agency.

- [ ] **Step 5: Stories picked from the data, never invented**

The exemplar (a sector with a full split), the extreme (the sector with the
largest single cost line), the thin case (fewest segments), and the self-omit.
Read each from the file. Never write a plausible number.

- [ ] **Step 6: The harness checks, written BEFORE the component and proved by failing**

Do not repeat the mistake of the detail panel, where the check was written first
but measured the wrong thing, so the component was reshaped to satisfy a bad
measurement. Write each rule, then PLANT the fault it catches and watch it red,
then remove the fault. A rule that has only ever run on clean input is unproven.
At minimum: the segments sum to one hundred within a stated tolerance; the
drawn segment count matches the declared count at every width; no segment is so
thin it renders as a sliver with an unreadable label; the legend names every
drawn segment and no more.

- [ ] **Step 7: Verify, each to its own file, each exit code read**

```bash
cd /e/atlas/website && npx tsc --noEmit > scratchpad/tsc-t11.txt 2>&1; echo "exit $?"
```

```bash
cd /e/atlas/website && npm run harness > scratchpad/harness-t11.txt 2>&1; echo "exit $?"
```

The harness exits 1 on the two known standing accent reds and nothing else.

- [ ] **Step 8: Crop the stories and LOOK, then judge against his reference**

```bash
cd /e/atlas/website && npm run crop:story -- "income-breakdown/exemplar" scratchpad/photos/t11 "1280,375"
```

Open both with the Read tool. Answer in your own words: is the net percentage
unmistakably the headline, can a reader tell the segments apart without a
colour key, does the legend agree with the bar, and does it survive 375 without
a sliver. If any answer is no, fix it before committing.

- [ ] **Step 9: Commit**

```bash
cd /e/atlas/website && git add src/components/spine/archetypes/IncomeBreakdown.tsx src/lib/spine/income_rows.ts src/lib/spine/copy.ts src/components/spine/archetypes/stories.tsx scripts/harness/render_archetypes.tsx src/app/dev/archetypes/page.tsx scripts/harness/check_archetypes.mjs && git commit -m "archetypes: the income breakdown, his form for the section he called broken"
```

---

## Self-review

**Spec coverage.** His message maps to tasks as follows. "creating all the sections for all main page types" is Task 1 (the catalogue, which is the list of everything to create, including four SPINE rows for the page types the model never spined) and Task 7 (the queue seeded from it). "think about all aspects, space, rhythm, hierarchy, readability" is Task 3 (readability measured, four rules), Task 4 (the model's twelve laws, which cover hierarchy, spacing, the edge, the focal figure and the label gap) and Task 5 (rhythm and space at page level). "the click and show button was removed, I hoped that you would keep it" is Task 2, restored as an archetype with the no-hidden-graphics law inside it. "quality checks of different kinds in place" is the four layers named in the prompt, built by Tasks 2, 3 and 4 and already-existing checks. "a final review in terms of harmony, and how well sections fit together" is Task 5, wired as stage S9 so it fires once per page rather than once per card. "the immense wealth of shadcn components" is Task 6, ordered so what already exists is consulted before the registry, and adopted for structure and not skin. "create a prompt to kickstart a loop that would run consecutively every 20 minutes, all its goals written in detail" is Task 8, with the twelve numbered steps, the hard rules and an explicit definition of done for the phase.

**Deliberately not covered, and why.** Implementation of the sections themselves is not in this plan: he said the goal is creating them, and creating them is what the loop does, one per run, which is the whole point of standing the loop up rather than writing eighty section specifications here. The country and city spines are not re-decided: they are committed in MODEL.md Part 8 and Task 1 copies them rather than reopening them. The hood, cell, industry and howto spines are deliberately left to a SPINE run each, against that page's real data, because inventing four spines in this document without reading their data is the guessing the model exists to stop.

**Placeholder scan.** Task 4 Step 2 describes twelve rules with their selectors and thresholds rather than printing the full checker body, and names `check_readability.mjs` from Task 3 as the exact structure to copy, so the engineer has a complete worked example of the file shape plus the twelve measurements to place inside it. Task 5 Step 1 does the same for the harmony sheet, against `page_strip` in the 2026-09-07 plan. These are the two places where a full listing would repeat a file written three steps earlier; every other step carries its code.

**Type consistency.** `DetailRow` and `DetailPanel({ name, summary, rows })` are the names in Task 2 Steps 4, 5 and in the prompt's step 6. `data-archetype="detail-panel"` is the value in Task 2 Steps 2, 4 and the harness rule. The row id format `<page>:<nn>-<slug>` is fixed in Task 1 and consumed by Tasks 5, 7 and 8. The four check layers are named in the same order in Task 3, Task 4 and the prompt's step 8.
