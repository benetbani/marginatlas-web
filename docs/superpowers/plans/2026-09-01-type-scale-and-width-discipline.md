# Type Scale Compression and Width Discipline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compress the site's type scale from a 4.4x range across seven read sizes to a 3.3x range across five, and write down the test that decides whether a band earns full width.

**Architecture:** Four ordered token steps, each independently verifiable, with steps 2 and 3 required to produce zero visual change; then the five page titles by the say-not-size rule; then the law text; then the gates; then the proof. Blueprint text moves before the code it governs, every time.

**Tech Stack:** CSS custom properties in one stylesheet, Tailwind arbitrary-value classes in React components, the render/photograph harness, and the prebuild gate chain.

**Spec:** `docs/superpowers/specs/2026-09-01-type-scale-and-width-discipline-design.md` (read it first; it carries the derivations).

---

## Global Constraints (binding on every task)

- **Blueprint before code.** The five constitutions in `E:/atlas/design/blueprints/` carry the ladder in their CONSTANTS blocks. Task 1 amends all five before any token moves. A gate reads those blocks.
- **Stage by name.** Never `git add -A`; the founder's parallel sessions share both trees. Website changes commit in `E:\atlas\website`; blueprint and law changes commit in `E:\atlas` (branch p4-seam). LF/CRLF warnings and failed gc/repack tasks on commit are harmless noise; verify every commit with `git log --oneline -1`.
- **Never pipe a verification command.** Redirect to a file, capture `$?`, print `REAL EXIT CODE: <n>`, read the file.
- **Typecheck heap flake:** if `npx tsc --noEmit` dies with a zone-allocation error, retry once after `export NODE_OPTIONS=--max-old-space-size=3072`.
- **The harness needs env:** prefix render and dossier commands with `set -a; . ./.env.local; set +a;`.
- **Never claim a visual result you have not looked at as a picture.**
- Do not run `npm run build` or any deploy. Do not touch the three legacy pages' full-width bands (they belong to their rebuilds).

---

## File Structure

| file | responsibility in this change |
|---|---|
| `src/app/globals.css` (token block at line 2254) | owns the ladder; steps 1 and 3 |
| 8 component files + `src/styles/atlas-spine.css` | carry `--t-small` references; step 2a |
| 15 component files | carry `--t-sub` references; step 2b, judged per use |
| 5 masthead/view files | carry the h1s; step 4 |
| `E:/atlas/design/blueprints/{country,city,hood,cell,industry}.md` | CONSTANTS blocks name the ladder |
| `E:/atlas/design/ART-DIRECTION.md` | gains the width test and the desktop statement |
| `scripts/verify_retired_type_tokens.mjs` (new) | fails if a retired token returns |
| `scripts/verify_ladder_agreement.mjs` (new) | stylesheet ladder vs blueprint ladders |

---

### Task 1: The five constitutions take the new ladder (text only, no code)

**Files:**
- Modify: `E:/atlas/design/blueprints/country.md`, `city.md`, `hood.md`, `cell.md`, `industry.md` (each has a CONSTANTS block opening `TYPE LADDER (px):`)

- [ ] **Step 1: Read the spec's section 2 table.** It is the authority for every number below.

- [ ] **Step 2: In each of the five files, replace the TYPE LADDER line.**

Old (verbatim in country.md; the others differ only in wrapping):
```
TYPE LADDER (px): micro 11 · small 12 · body 14 · lead 16 · sub 18 · head 20 ·
section 24 · focal 30 · answer 48. Nothing else. A size not on the ladder is a
defect unless it carries `data-typography="custom"` with a written reason.
```

New:
```
TYPE LADDER (px): mark 10 (marks only, never read) · micro 12 · body 14 ·
lead 16 · head 20 · section 24 · focal 30 · answer 40. Nothing else. A size not
on the ladder is a defect unless it carries `data-typography="custom"` with a
written reason.

RETIRED 2026-09-01, founder ruling ("a big variability in fonts which is
traumatic to the eye, the difference between H1 and the smallest font cannot be
so gigantic"): the 12 rung folded into micro, which rose 11 to 12, and the 18
rung folded into head. Two near-twins that a reader could not perceive as
hierarchy. The ceiling fell 48 to 40, derived: rule 16 needs the answer at 1.6x
its supports, the page title shares the masthead card, and 40 over a 24 title is
1.67x while a 36 ceiling would force titles down into the heading size.

THE TITLE RULE: an h1 that NAMES the page takes section 24, because a separate
figure carries the answer. An h1 that IS the answer takes answer 40, and then
nothing else on that page takes the answer size.
```

- [ ] **Step 3: Check each file for other ladder mentions.** Run in the parent repo:

```bash
grep -n "48\|18 \|sub \|small 12" design/blueprints/country.md design/blueprints/city.md design/blueprints/hood.md design/blueprints/cell.md design/blueprints/industry.md
```

Expected: any remaining hit is a per-section element list naming a specific size (for example "figure head 20 ink"). Update every one that names a retired rung or the old ceiling; leave sizes that did not change.

- [ ] **Step 4: Commit (parent repo).**

```bash
git add design/blueprints/country.md design/blueprints/city.md design/blueprints/hood.md design/blueprints/cell.md design/blueprints/industry.md && git commit -m "blueprint: the compressed ladder, five constitutions (founder 2026-09-01)"
```

---

### Task 2: Step 1 of the migration, the values move

**Files:**
- Modify: `src/app/globals.css` (token block, line 2254)

- [ ] **Step 1: Change three values and leave the rest.**

Old:
```css
  --t-micro: 11px;   /* the floor for anything read: axis units, chips, column heads */
  --t-small: 12px;   /* secondary labels, captions, the key half of a key/value pair */
  --t-body: 14px;    /* body prose. The default */
  --t-lead: 16px;    /* a lede, a card's first line */
  --t-sub: 18px;     /* subsection heading, h3 */
  --t-head: 20px;    /* section heading, h2 */
  --t-section: 24px; /* chapter opener */
  --t-focal: 30px;   /* a section's own focal figure */
  --t-answer: 48px;  /* the page's one dominant figure, h1. NOTHING IS LARGER */
```

New:
```css
  /* THE LADDER, compressed 2026-09-01. Founder: "a big variability in fonts
     which is traumatic to the eye, the difference between H1 and the smallest
     font cannot be so gigantic." Measured first: the country page used seven
     sizes, and two of them (12 beside 11, 18 beside 20) carried a twentieth and
     a third of their neighbour's work while adding a size to every screen. A
     reader cannot perceive a one-pixel step as hierarchy.

     The floor RISES, which compresses the range from below and makes the
     smallest text more readable at the same time: the 26 smallest labels on the
     country page get bigger, not smaller. Supersedes the 2026-08-21 ruling that
     set it at 11, in the same direction and for the same reason.

     The ceiling is DERIVED, not chosen. Rule 16 wants the answer at 1.6x its
     supports; the page title shares the masthead card with it. 40 over a 24
     title is 1.67x. A 36 ceiling would force titles to 20, colliding with
     headings site-wide. So 40 is the smallest ceiling that keeps both laws.

     --t-small and --t-sub are RETIRED. They still resolve during this step so
     the reference sweep that follows is provably visual-neutral; they are
     deleted in the step after, and a gate stops them returning. */
  --t-micro: 12px;   /* the floor for anything read: axis units, chips, column heads */
  --t-small: 12px;   /* RETIRING: equal to micro so the sweep changes nothing */
  --t-body: 14px;    /* body prose. The default */
  --t-lead: 16px;    /* a lede, a card's first line */
  --t-sub: 20px;     /* RETIRING: equal to head so the sweep changes nothing */
  --t-head: 20px;    /* every heading, h2 and h3 */
  --t-section: 24px; /* chapter opener, and a naming h1 */
  --t-focal: 30px;   /* a section's own focal figure */
  --t-answer: 40px;  /* the page's one dominant figure. NOTHING IS LARGER */
```

- [ ] **Step 2: Typecheck.**

```bash
npx tsc --noEmit > /tmp/t2_tsc.txt 2>&1; echo "REAL EXIT CODE: $?"
```
Expected: `REAL EXIT CODE: 0`.

- [ ] **Step 3: Render and photograph.**

```bash
set -a; . ./.env.local; set +a
npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx > /tmp/t2_render.txt 2>&1; echo "REAL EXIT CODE: $?"
node scripts/build_section_dossier.mjs > /tmp/t2_crops.txt 2>&1; echo "REAL EXIT CODE: $?"
```
Expected: both `0`, eight surfaces, 208 nodes across 8 pages.

- [ ] **Step 4: OPEN the pictures and read them.** At minimum `country-gb-new-0-1280.png`, `country-gb-new-0-375.png`, `cell-london-restaurants-0-1280.png`, `city-london-0-1280.png`. Expected: the dominant figures are visibly smaller and still dominant; small labels are marginally larger; nothing wraps that did not wrap before. Write the sentence "what I just changed could be wrong because ___" and check that thing.

- [ ] **Step 5: Commit.**

```bash
git add src/app/globals.css && git commit -m "type: the ladder compresses, floor 11 to 12 and ceiling 48 to 40 (founder 2026-09-01)"
```

---

### Task 3: Step 2a, the `--t-small` references collapse (must be visual-neutral)

**Files (exactly these, `globals.css` excluded, it is the token home):**
- Modify: `src/components/spine/cell/cell-view.tsx`, `src/components/spine/cell/interactive.tsx`, `src/components/spine/country/city-cards.tsx`, `src/components/spine/country/country-view.tsx`, `src/components/spine/country/setup-tiers.tsx`, `src/components/spine/industry/where-pays.tsx`, `src/components/spine/kit.tsx`, `src/styles/atlas-spine.css`

- [ ] **Step 1: Record the before-state of the rendered HTML.**

```bash
cp docs/loop/artifacts/final-pages/country-gb-new.html /tmp/before-country.html
cp docs/loop/artifacts/final-pages/cell-london-restaurants.html /tmp/before-cell.html
```

- [ ] **Step 2: Replace every `--t-small` with `--t-micro` in the eight files above.** Both tokens resolve to 12px after Task 2, so this is the one sweep in this plan that is safe to do blind.

- [ ] **Step 3: Typecheck, render.** Same two commands as Task 2 steps 2 and 3 (dossier not needed yet). Both must print `REAL EXIT CODE: 0`.

- [ ] **Step 4: Prove visual neutrality.**

```bash
diff /tmp/before-country.html docs/loop/artifacts/final-pages/country-gb-new.html > /tmp/t3_diff.txt; echo "DIFF LINES: $(wc -l < /tmp/t3_diff.txt)"
```
Expected: every diff line is a `--t-small` becoming `--t-micro` and nothing else. If any other line differs, STOP and report; the sweep touched something it should not have.

- [ ] **Step 5: Commit.**

```bash
git add src/components/spine/cell/cell-view.tsx src/components/spine/cell/interactive.tsx src/components/spine/country/city-cards.tsx src/components/spine/country/country-view.tsx src/components/spine/country/setup-tiers.tsx src/components/spine/industry/where-pays.tsx src/components/spine/kit.tsx src/styles/atlas-spine.css && git commit -m "type: the 12 rung folds into micro, references swept (visual-neutral)"
```

---

### Task 4: Step 2b, the `--t-sub` references, judged one at a time

**Files (15, every one carrying `--t-sub`):**
`src/app/dev/spine/page.tsx` (6), `src/components/kit/engraved/OpportunityGap.tsx` (3), `src/components/kit/engraved/primitives.tsx` (1), `src/components/kit/engraved/SameBusinessAbroad.tsx` (1), `src/components/kit/engraved/SpecialZones.tsx` (1), `src/components/spine/cell/masthead.tsx` (1), `src/components/spine/cell/money-chapter.tsx` (2), `src/components/spine/city/chapters.tsx` (1), `src/components/spine/city/city-view.tsx` (4), `src/components/spine/city/masthead.tsx` (1), `src/components/spine/country/country-view.tsx` (2), `src/components/spine/hood/masthead.tsx` (1), `src/components/spine/industry/industry-view.tsx` (4), `src/components/spine/kit.tsx` (1), `src/components/spine/NeighborhoodExplorer.tsx` (1)

- [ ] **Step 1: Understand why this one is not a sweep.** A blind replacement would be visually neutral (both resolve to 20px after Task 2) but semantically wrong: `--t-sub` means "subsection heading", and the two uses on the country page are figures, not headings. Judging each use is how a genuine h3-under-h2 hierarchy gets noticed instead of silently flattened.

- [ ] **Step 2: For each of the 32 uses, read the surrounding element and classify:**
  - a heading (an `<h3>`, or a `Head`/`Rail`/kicker element) -> `--t-head`
  - a figure (inside a `Fig`, or rendering a number) -> `--t-head`
  - prose (a sentence a reader reads) -> `--t-lead`
  - **and record any use that was genuinely an h3 sitting under an h2 in the same card** in the report; that is the one case where folding costs a level of hierarchy, and the founder gets told rather than it happening quietly.

- [ ] **Step 3: Typecheck, render, and diff exactly as Task 3 steps 3 and 4.** Any prose reclassification to `--t-lead` WILL show a size change in the diff, which is expected and must be listed explicitly in the report; every other line must be a token rename.

- [ ] **Step 4: Photograph and read** the pages whose files changed, at 1280 and 375. Confirm no heading now sits at the same size as its own parent heading in a way that reads as flat.

- [ ] **Step 5: Commit, staging the 15 files by name.**

```
git commit -m "type: the 18 rung folds into head, every use judged not swept"
```

---

### Task 5: Step 3, the retired tokens die, and a gate keeps them dead

**Files:**
- Modify: `src/app/globals.css`
- Create: `scripts/verify_retired_type_tokens.mjs`
- Modify: `scripts/prebuild_all.ts`, `package.json`
- Run: `npx tsx scripts/counts.ts --write`

- [ ] **Step 1: Confirm zero references remain.**

```bash
grep -rn "t-small\|t-sub" src --include=*.tsx --include=*.ts --include=*.css > /tmp/t5_refs.txt; echo "REMAINING: $(wc -l < /tmp/t5_refs.txt)"
```
Expected: `REMAINING: 2` (the two dying declarations in `globals.css` itself). Anything else means Tasks 3 or 4 missed a file; fix that first.

- [ ] **Step 2: Delete the two declarations** (`--t-small` and `--t-sub`) from the token block, leaving the comment that records their retirement.

- [ ] **Step 3: Write the gate.**

```js
#!/usr/bin/env node
/**
 * verify_retired_type_tokens , A RETIRED RUNG MUST NOT COME BACK.
 *
 * The 12 and 18 rungs were retired 2026-09-01 (founder: the font variability is
 * "traumatic to the eye"). A retired token that still resolves is a rung people
 * keep stepping on, and the two here are especially easy to retype because
 * their names still read as natural sizes. Source scan: no browser, no network,
 * no secret, so it cannot fail on a blip.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const BANNED = /--t-small|--t-sub\b/;
const files = [];
function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?|css)$/.test(e)) files.push(p);
  }
}
walk("src");

const hits = [];
for (const f of files) {
  readFileSync(f, "utf8").split(/\r?\n/).forEach((line, i) => {
    if (BANNED.test(line)) hits.push(`${f}:${i + 1}  ${line.trim().slice(0, 90)}`);
  });
}
if (hits.length) {
  console.log("x verify_retired_type_tokens: a retired rung is back.");
  hits.forEach((h) => console.log("     " + h));
  console.log("  The ladder is mark 10, micro 12, body 14, lead 16, head 20, section 24, focal 30, answer 40.");
  process.exit(1);
}
console.log(`PASS verify_retired_type_tokens. ${files.length} files, neither retired rung present.`);
```

- [ ] **Step 4: Run it, expect PASS.**

```bash
node scripts/verify_retired_type_tokens.mjs; echo "REAL EXIT CODE: $?"
```

- [ ] **Step 5: Negative-test it.** Temporarily add `--t-sub` to one component, run the gate, confirm it exits 1 and names that file, then revert. A gate never registered without a proven failure.

- [ ] **Step 6: Register it** in `scripts/prebuild_all.ts` (beside the other 2026-08-30 rulings) and add `"verify:retired-type-tokens"` to `package.json`, then `npx tsx scripts/counts.ts --write`.

- [ ] **Step 7: Commit** `src/app/globals.css`, the new script, `scripts/prebuild_all.ts`, `package.json`, `CLAUDE.md` by name.

---

### Task 6: Step 4, the five page titles by the say-not-size rule

**Files:**
- Modify: `src/components/spine/country/country-view.tsx` (h1 at ~line 193), `src/components/spine/city/masthead.tsx` (~52), `src/components/spine/hood/masthead.tsx` (~72), `src/components/spine/industry/industry-view.tsx` (~69), `src/components/spine/cell/masthead.tsx` (~50)

- [ ] **Step 1: Apply the rule from the spec's step 4 table.** Four naming h1s (country, city, hood, industry) take `text-[length:var(--t-section)]`, replacing `var(--t-focal)` or the Tailwind pair `text-3xl md:text-4xl` / `md:text-[2.75rem]`. The trade page's answering h1 takes `text-[length:var(--t-answer)]`, replacing `text-3xl md:text-[2.6rem]`.

- [ ] **Step 2: Remove any now-pointless `data-typography="custom"`** on those h1s: the marker exists to declare an off-ladder size, and these are now on the ladder. Where the marker is removed, remove its written reason with it.

- [ ] **Step 3: Typecheck, render, photograph** (all three commands, all `REAL EXIT CODE: 0`).

- [ ] **Step 4: OPEN all five mastheads at 1280 and 375 and read them.** Expected: on the four naming pages the title is quieter than the answer and the answer clearly leads; on the trade page the answer sentence is unchanged to the eye (41.6 to 40). If a title now looks lost rather than quiet, say so in the report rather than adjusting the ladder to taste.

- [ ] **Step 5: Run the conformance gate**, which independently counts answer-class figures above 36px:

```bash
set -a; . ./.env.local; set +a; node scripts/verify_blueprint_conformance.mjs > /tmp/t6_conf.txt 2>&1; echo "REAL EXIT CODE: $?"
```
Expected `0`. A failure here means a page's answer-figure count changed, which this task must not do.

- [ ] **Step 6: Commit the five files by name.**

---

### Task 7: The width test and the desktop statement enter the law

**Files:**
- Modify: `E:/atlas/design/ART-DIRECTION.md` (section D, beside the existing D1 width sanction and near law M)

- [ ] **Step 1: Add the test, verbatim from the spec's section 4**, as a new numbered clause under D: the comparison test, the chrome test, the reading-measure condition, and the sentence that anything failing both takes a band split.

- [ ] **Step 2: Add the desktop/mobile statement**, quoting the founder: "full width damages readability a lot in desktop, in mobile idk it can be seen differently as treatment", and stating that the ban is a desktop rule because at phone width the column IS the screen, so there is no traverse cost and no alternative. State explicitly that this clarifies existing behaviour and no code moves for it.

- [ ] **Step 3: Record the legacy debt honestly** in the same clause: the four rebuilt pages carry zero unsanctioned full-width bands today; home 8, countries-list 2 and country-gb 13 are the whole remaining debt and they belong to those pages' rebuilds, not to this law's enforcement.

- [ ] **Step 4: Commit (parent repo)** `design/ART-DIRECTION.md` by name.

---

### Task 8: Judge every sanctioned wide band against the new test

**Files:**
- Create: `E:/atlas/design/critique/width-justification-2026-09-01.md`
- Modify: only the components of bands that FAIL, one commit each

- [ ] **Step 1: List every sanctioned wide band** on the five rebuilt pages:

```bash
set -a; . ./.env.local; set +a
node -e '
const {chromium}=require("playwright");
(async()=>{const b=await chromium.launch();
for(const p of ["country-gb-new","city-london","hood-london","cell-london-restaurants","industry-restaurants"]){
const pg=await b.newPage({viewport:{width:1280,height:1200}});
await pg.goto("file:///"+process.cwd().replace(/\\\\/g,"/")+"/docs/loop/artifacts/final-pages/"+p+".html");
const r=await pg.evaluate(()=>[...document.querySelectorAll("[data-hero],[data-wide-table],[data-terminus]")].map(e=>({attr:e.dataset.hero!==undefined?"hero":e.dataset.wideTable!==undefined?"wide-table":"terminus",id:(e.querySelector("[id]")||{}).id||"",text:(e.textContent||"").trim().slice(0,60)})));
console.log(p,JSON.stringify(r,null,1));await pg.close();}
await b.close();})();' > /tmp/t8_bands.txt 2>&1; echo "REAL EXIT CODE: $?"
```

- [ ] **Step 2: For each band, open its crop at 1280 and write one row:**

```markdown
| page | band | attribute | test it passes (comparison / chrome / NEITHER) | verdict |
```

- [ ] **Step 3: Any band passing NEITHER test gives up the width**, taking a band split from the sanctioned set `{1-1, 1-2, 2-1, 2-3, 3-2}`, with its blueprint amended first and one commit per band.

- [ ] **Step 4: Commit the justification file** (parent repo) whether or not any band failed. A judgement recorded is what makes the next one arguable.

---

### Task 9: The ladder-agreement gate

**Files:**
- Create: `scripts/verify_ladder_agreement.mjs`
- Modify: `scripts/prebuild_all.ts`, `package.json`, then `npx tsx scripts/counts.ts --write`

- [ ] **Step 1: Write a gate that parses the ladder out of `src/app/globals.css`** (the `--t-*` declarations in the token block) and out of each `E:/atlas/design/blueprints/*.md` CONSTANTS block's `TYPE LADDER (px):` line, and fails when they disagree. Guard it with `parentRepoFile` from `scripts/lib/local_only.mjs` so it skips loudly where the design repo is absent, exactly as the blueprint conformance gate does.

- [ ] **Step 2: Run it, expect PASS** (Task 1 already made them agree).

- [ ] **Step 3: Negative-test:** change one blueprint's ladder line in a scratch copy, point the gate at it, confirm exit 1 and a message naming the disagreement, revert.

- [ ] **Step 4: Register and recount, then commit by name.**

---

### Task 10: The whole-chain proof

- [ ] **Step 1: Full render and full dossier**, both `REAL EXIT CODE: 0`, 208 nodes across 8 pages.

- [ ] **Step 2: The chain.**

```bash
set -a; . ./.env.local; set +a
npm run prebuild > /tmp/final_chain.txt 2>&1; ec=$?; echo "REAL EXIT CODE: $ec" >> /tmp/final_chain.txt; echo "chain exit: $ec"
grep -E "Ran:|✗" /tmp/final_chain.txt | tail -3
```
Expected: exit 0, `Ran: N / N gates` with N matching the generated count block, no `✗`. Never raise a ratchet baseline to pass.

- [ ] **Step 3: Read the pictures**, all five pages at 1280 and 375, top to bottom, as a first-time visitor. Count the distinct type sizes on the country page and confirm five.

- [ ] **Step 4: The adversarial panel** on every changed page (`Skill taste-gate`, args `{page}`), three lenses, two of three refusing sends a section back.

- [ ] **Step 5: The founder's sheet.** Before crops come from `E:/atlas/design/critique/crops-before-campaign/`, after from the fresh set, at 1280 and 375, obeying the pairing law (same reading in two states). Regenerate the walk strip, run `node scripts/ship_check.mjs --chain /tmp/final_chain.txt`, expect PASS, and deliver sheet and strip together.

- [ ] **Step 6: Report in plain language.** What a visitor sees, per page. The size count before and after. What was checked and what could not be. Any heading hierarchy that flattened, named.

---

## Self-Review

**Spec coverage.** Ladder values: Task 2. De-duplication: Tasks 3 and 4. Retirement plus gate: Task 5. Title rule: Task 6. Width test and desktop statement: Task 7. Per-band justification: Task 8. Ladder agreement: Task 9. The spec's eight quality checks: Tasks 2 to 6 carry the per-task ones, Task 10 carries the rest.

**Placeholders.** None: every task names its exact files, its exact commands, its expected output, and its commit. The one judgement-heavy task (4) states the classification rule and the reporting duty rather than pretending a sweep is safe.

**Type consistency.** Token names are spelled `--t-micro`, `--t-head`, `--t-section`, `--t-answer` throughout; the two retired names appear only where they are being removed or banned.

**Known risk carried forward.** Task 4 can flatten a real h3-under-h2 level. It is not designed away; it is detected and reported, because the founder's ruling was explicit and the honest move is to tell him where it cost something.
