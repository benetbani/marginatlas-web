# Section Finalization Campaign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring every section of the five rebuilt spine pages (country, city, hood, trade/cell, industry) to one consistent, founder-lawful standard: no spacing off the ladder, no unearned width, no repeated words, no cross-page drift, disclosures where prose crowds, and a quality gate holding each finding closed.

**Architecture:** Three movements. STUDY produces a findings ledger with every row citing the exact law it breaks; IMPROVE fixes findings one section at a time (blueprint amended before code, every time); PROVE closes with the full gate chain, fresh photographs, the taste panel, and one review sheet + walk strip for the founder. Nothing flips live without his APPROVE.

**Tech Stack:** Next.js 15.5 / React 19 / TS 5 spine components in `src/components/spine/`; the law in `E:/atlas/rules/` + `E:/atlas/design/`; the render/photograph harness (`scripts/build_final_pages.tsx`, `scripts/build_section_dossier.mjs`); the 133-gate prebuild chain.

---

## Global constraints (verbatim, binding on every task)

- ONE section per change; one commit per section, citing the law (`<page>: <section> <what> (rulebook §N)`).
- BLUEPRINT FIRST: any change to a section's declared anatomy amends `E:/atlas/design/blueprints/<page>.md` in the SAME task, before the code.
- §41: never delete a section to pass a rule. §43: never a file-by-file rule sweep — every fix flows from a findings row, not from grep. §0: never invent a visual or a metric; forms come from the kit, FORM-CATALOG, or a ratified precedent.
- Read the module that produces a number before using the number. Never guess an identifier from a sibling module.
- Accent: only what the register in `design/blueprints/country.md` CONSTANTS sanctions; never on hover (§37).
- Law M: nothing scrolls sideways at phone width. N9: decile words only, never quartiles.
- Harness commands need env: prefix `set -a; . ./.env.local; set +a;` in bash. Never pipe a verification command; capture `$?` and write `REAL EXIT CODE: <n>` into the log.
- Every visual claim is proven by a picture you opened. jsdom proves behavior the static render cannot (see `tests/spine/setup_tiers_expand.test.ts` for the pattern).
- Founder-decision items (Phase D list) are NEVER built unbidden; they go on the review sheet as questions.
- Working dir `E:\atlas\website` unless the path says `E:/atlas/...` (the parent repo). Stage by name, never `git add -A` (parallel founder sessions share the tree).

---

## Phase A — STUDY (findings before fixes; no production code changes)

### Task A1: The audit criteria, extracted from the law into one file

**Files:**
- Create: `E:/atlas/design/critique/AUDIT-CRITERIA-2026-08-30.md`
- Read: `E:/atlas/rules/DESIGN-RULEBOOK.md`, `E:/atlas/design/ART-DIRECTION.md`, `E:/atlas/design/critique/NOTATION.md`, `E:/atlas/rules/FOUNDER-VERDICTS.md` (the two 2026-08-30 batches), all five files in `E:/atlas/design/blueprints/`

- [ ] **Step 1:** Read the five law sources end to end. Extract every criterion an auditor can check from a photograph or the code, one line each, with a stable id. Seed list (verify each against the source before writing; add what the reading surfaces):

```markdown
| id | criterion | source |
|----|-----------|--------|
| W1 | Full width belongs to data-hero, data-wide-table, data-terminus ONLY; anything else spanning the band without a declared split is unearned width | ART-DIRECTION D1 |
| W2 | Splits come from {1-1,1-2,2-1,2-3,3-2}; a lone child takes 2fr of 2fr-1fr | D2 |
| S1 | Spacing obeys 48 > 32 > 16/20/28 > 8; no two rungs equal; a gap off the ladder is a finding | D6 |
| T1 | Type sizes on the ladder (11/12/14/16/18/20/24/30/48) unless data-typography="custom" WITH a written reason beside it | blueprints CONSTANTS |
| N1-N9 | The notation laws, incl. N5 unit named once, N7 one quantity one name, N9 deciles | NOTATION.md |
| M1 | Nothing scrolls sideways at phone width; wide things reconfigure | ART-DIRECTION law M |
| K6 | Figures always visible; ONLY prose may sit behind a disclosure | rulebook K6 |
| A1 | Accent exactly where the register sanctions (answer figures, people dots, complexity dots, hiring bars, customers typical); never hover | accent register |
| F1 | Flags rectangular, radius 0, hairline, >=14px tall, legible | flag law / verify_flag_marks |
| I1 | Identity once per section: a name never spelled twice; a country/city masthead carries its flag | founder 2026-08-30 |
| C1 | Same reading, same form, every page: a convention ratified on one page (column headers over repeated unit words; named spectra with explanatory poles; card pagers; quiet support grids) is drift wherever a sibling page still does it the old way | founder 2026-08-30 both batches |
| X1 | No world-median comparison lines | founder 2026-08-30 |
| U1 | §21 universality: the section reads correctly for Dhaka, Tirana, Lagos, La Paz |
| D8 | Section order serves the reader's question ladder; a section that answers nothing a visitor asks at this altitude is a junk-section finding | founder four fault classes |
| E1 | Big white space, patronizing info, graphical errors, junk sections: the founder's four named fault classes | goal hook |
```

- [ ] **Step 2:** Save the file with a header stating: "An auditor citing no criterion id has no finding" (the taste-gate rule, reused).
- [ ] **Step 3:** Commit (parent repo): `git add design/critique/AUDIT-CRITERIA-2026-08-30.md && git commit -m "study: the audit criteria, one line per checkable law"`

### Task A2: Fresh renders + full photograph set

**Files:** none created in src; artifacts only.

- [ ] **Step 1:** `set -a; . ./.env.local; set +a; npx tsx --tsconfig scripts/tsconfig.harness.json --require ./scripts/spikes/stub_next_font.cjs scripts/build_final_pages.tsx > /tmp/aud_render.txt 2>&1; echo "REAL EXIT CODE: $?" >> /tmp/aud_render.txt` — expect exit 0, eight surfaces listed.
- [ ] **Step 2:** `set -a; . ./.env.local; set +a; node scripts/build_section_dossier.mjs > /tmp/aud_dossier.txt 2>&1; echo "REAL EXIT CODE: $?" >> /tmp/aud_dossier.txt` — expect exit 0; crops for all 8 pages at 1280/375/zoom.

### Tasks A3-A7: Page audits (one task per page; A3 country, A4 city, A5 hood, A6 cell/trade, A7 industry)

**Files:**
- Create: `E:/atlas/design/critique/findings-2026-08-30-<page>.md`
- Read: every crop `country-gb-new-*` (A3) / `city-london-*` (A4) / `hood-london-*` (A5) / `cell-london-restaurants-*` (A6) / `industry-restaurants-*` (A7) at 1280 AND 375, plus that page's view components and its blueprint.

- [ ] **Step 1:** Open every section crop at both widths and READ it (not skim): against every criterion in AUDIT-CRITERIA. For each hit, write one findings row:

```markdown
| # | section | criterion | what the visitor sees (plain words) | severity (breaks-law / drift / polish) | fix class (layout / words / disclosure / convention / founder-question) |
```

- [ ] **Step 2:** For every criterion the CODE can contradict silently (T1 sizes, S1 margins, W1 attributes), open the section's component and verify the crop reading against the classes. A finding confirmed in both is `breaks-law`; photo-only is `drift` until code-confirmed.
- [ ] **Step 3:** Seeded known findings to verify first (from the 2026-08-30 ground-truth pass; confirm or strike with evidence, never carry forward unverified):
  - A4 (city): masthead flag `rounded-sm shadow-sm` (breaks F1); masthead H1 `md:text-4xl` = 36px off the ladder (T1); character/spectra rows still compact generic poles while the ratified named-explanatory form exists (C1); "Quick reads" lens tiles carry content classes the founder ruled out of scope on the country page (founder-question, NOT unilateral removal); repeated unit words in row lists (N5/C1).
  - A5/A6/A7: masthead identity audit (I1: name twice? flag present where a place is named?); any repeated per-row unit words (C1 vs the money-headers convention); long prose blocks that qualify for a K6 disclosure (locals-know pattern); bars still ink where the founder just ruled bars terracotta on country (founder-question: does that ruling generalize?).
  - A3 (country): the two newest sections re-audited cold (masthead grid balance at 768; money+customers band at 375; premises scale at 375 edge-pinning).
- [ ] **Step 4:** End the file with counts: total findings, by severity, by fix class. Commit each findings file to the parent repo as it lands.

### Task A8: Cross-page consistency + UX/content audit

**Files:**
- Create: `E:/atlas/design/critique/findings-2026-08-30-crosspage.md`

- [ ] **Step 1:** Build the convention matrix: rows = ratified conventions (column headers over unit words; named spectra + dot split; card pager; quiet support grid; expandable rows; winner semibold; flag spec; icon 18/2.4 via Ico; SampleTag placement; terminus form; crumb form), columns = five pages; each cell `holds / drifts / n-a`, with the drift's file named.
- [ ] **Step 2:** UX walk (the founder's ask, verbatim: "user experience and content management in terms of the user experience"): walk all five pages top to bottom at 375 and 1280 as a first-time visitor and record: (a) every place a disclosure would move bullet-prose out of the first view (K6 candidates: locals-know, myth/reality, who-it-suits, caveat paragraphs); (b) every dead end (a section that names a thing with no path to it) against funnel rule 24; (c) every place the reader must scroll past low-value rows to reach the answer (candidates for the five-max + pager convention); (d) the on-this-page rail: country has it, four pages do not (founder-question).
- [ ] **Step 3:** Merge overlaps with A3-A7 by reference (`see city #4`), never duplicate rows. Commit.

## Phase B — IMPROVE (findings become fixes; one section per task)

### Task B0: The verdict gate on the study

- [ ] **Step 1:** Assemble every `founder-question` row from A3-A8 into the decision register (Phase D list below, extended). These are BUILT ONLY IF HE SAYS SO.
- [ ] **Step 2:** Every `breaks-law` and `drift` row becomes a fix task via the template in B1. Order: per page, page order city -> cell -> hood -> industry -> country (country freshest, audited last), top of page downward.

### Task B1: The per-finding fix template (governs every fix task; dispatch one implementer per SECTION, batching that section's findings)

**Files:** the finding's component file(s); `E:/atlas/design/blueprints/<page>.md`; the findings file (status column).

- [ ] **Step 1:** Amend the page's blueprint to the post-fix truth (text before code), quoting the criterion id and, where one exists, the founder verdict.
- [ ] **Step 2:** Make the change. The brief carries: the findings row(s) verbatim, the criterion text, the blueprint's amended paragraph, the scope fence (one section; shared kit only if the findings row names it, with blast radius measured on all five pages).
- [ ] **Step 3:** `npx tsc --noEmit` (heap flake: retry with `export NODE_OPTIONS=--max-old-space-size=3072`), expect 0.
- [ ] **Step 4:** Re-render + re-crop THAT page (`--page <surface>` for cropping, but note the dossier wipes the crops dir: crop with the full page list `--page <surface>,country-gb` style comma list, or accept the wipe and re-run full before Phase C).
- [ ] **Step 5:** OPEN the new crop at 1280 and 375 and read it. Write the sentence "what I just changed could be wrong because ___" and check that thing.
- [ ] **Step 6:** Mark the findings row fixed (with the commit hash), commit: `<page>: <section> <what> (criterion, §N)`.

### Task B2: Disclosure build (only what A8 confirmed + the founder approved)

- [ ] **Step 1:** For each approved K6 candidate, reuse the `SetupTiers` disclosure pattern (`src/components/spine/country/setup-tiers.tsx`): a client component per page section, figures visible collapsed, ONLY prose behind the click, aria-expanded wired.
- [ ] **Step 2:** Each new disclosure gets a jsdom behavior test cloned from `tests/spine/setup_tiers_expand.test.ts` (adjust import + assertion strings), wired into `package.json` (`verify:<name>`) and `scripts/prebuild_all.ts` GATES, then `npx tsx scripts/counts.ts --write`.

## Phase C — PROVE (quality checks for everything)

### Task C1: The machine pass

- [ ] **Step 1:** Full render + FULL dossier (all 8 pages) fresh.
- [ ] **Step 2:** `set -a; . ./.env.local; set +a; npm run prebuild > /tmp/final_chain.txt 2>&1; ec=$?; echo "REAL EXIT CODE: $ec" >> /tmp/final_chain.txt` — expect the full count passed, exit 0. Never raise a ratchet baseline to pass.
- [ ] **Step 3:** Any convention this campaign ratified that is string-checkable and not yet gated becomes a gate NOW (working method rule 4) or is written down as not machine-checkable with the reason, in the findings file.

### Task C2: The adversarial panel

- [ ] **Step 1:** Run the taste-gate skill per changed page (`Skill taste-gate, args {page}`): three lenses, a judge citing no rule has no objection, two-of-three refusing sends the section back to B1.

### Task C3: The founder's sheet

- [ ] **Step 1:** Extend `scripts/build_country_review_sheet.mjs` (or a sibling `build_campaign_review_sheet.mjs` if cleaner) to cover every CHANGED section across all five pages, obeying the pairing law: before = this campaign's own pre-fix crop (keep copies of the Phase A crops in `E:/atlas/design/critique/crops-before-campaign/` BEFORE any B task lands — add this copy step to A2), after = fresh; unlike replacements show after alone with one line.
- [ ] **Step 2:** The decision register renders as question cards (KEEP/CHANGE controls), one per founder-question, each quoting his own words that raised it.
- [ ] **Step 3:** Regenerate the walk strip; run `node scripts/ship_check.mjs --chain /tmp/final_chain.txt`; expect PASS.
- [ ] **Step 4:** Deliver sheet + strip. Report in plain visitor language: what changed per page, findings counts before/after, what was checked, what could not be checked (unhydrated static renders; the named blind spots). NOTHING flips live before his paste.

## Phase D — The founder decision register (seeded; A-phase extends it; asked on the sheet, never guessed)

1. The city page's "Quick reads" tiles: the country's equivalents fell to "out of scope / idiotic / pointless" — do the city's go the same way?
2. Terracotta bars: a country-page order, or the law for every bar on every spine page?
3. The on-this-page rail: stays country-only, or joins the other four pages?
4. Long-prose sections (what locals know, myth vs reality, who it suits): fold behind a disclosure, or stay open?
5. Standing open item: which duplicate $100 form survives on the trade page (stacked bar vs waterfall).
6. Standing open item: a UK photograph behind the country masthead instead of the site default.

---

## Self-review notes

- Spec coverage: study (rules + sections + inconsistencies + spacing + width + disclosures + UX/content) = A1-A8; improve = B0-B2; quality checks for everything = C1-C3; his "ask for permission" = the approval gate below plus the D register.
- No placeholders: fix tasks are findings-driven by design; the template (B1) plus the verbatim findings row IS the task content, and the criteria file (A1) pins what a finding may cite. Known findings are seeded with file-level anchors.
- Type consistency: the only new component pattern (disclosures) clones a named, committed, tested precedent.
