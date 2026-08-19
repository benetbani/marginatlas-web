# STATE. The loop's memory. Written every tick, read first every tick.

A different agent, with none of tonight's context, must be able to resume from
this file alone. If it cannot, this file is wrong.

---

## Now

| | |
|---|---|
| Tick | **9** done (slot 9, claims), after the machine stopped forking mid-tick and recovered |
| Next slot | **10**, `06-REFORMATION.md` |
| In-flight | none. The Q8 repair is a founder decision, not unfinished work. |
| Tree | clean apart from `.mcp.json` (never commit) and untracked `scratchpad/` |
| Gates | `tsc` clean; `prebuild` **103/103** (a gate was added in tick 4; the chain is the authority, the pasted loop prompt's 101 is superseded) |
| HEAD | see the tick log below; `origin/main` is at `6fc88e3e` and the loop's commits sit above it, unpushed by rule |

---

## Standing facts a resuming agent needs

- **Work now comes from a queue.** Build slots take the top unblocked item in
  `docs/superpowers/plans/2026-08-19-masterplan/06-BACKLOG.md` and update it at
  step S11. The standard to build to is `01-DESIGN-STANDARD.md`; the eleven
  steps and the 13-check review gate are `03-PROCEDURE.md`. Added 2026-08-19,
  outside the rotation.
- **The external research is DONE. Do not re-run it.** Three annexes in
  `docs/superpowers/research/` dated 2026-08-19: 18 homepages plus design
  psychology, 262 UI/UX rules across 113 sources, and a full internal audit. A
  fourth, on how reference pages sequence answer/evidence/context, was still
  running when they landed; `02-PAGE-DOSSIERS.md` marks its section orders as
  pending rather than guessing them.
- **P0 is instrument repair, not the homepage.** Ten design gates scan `dev/`
  bodies no reader reaches. A green gate here is evidence the gate ran, not
  evidence the site is correct.
- **Render and count; never census from a registry.** `PAGE_SECTION_ORDER` lists
  7 cell sections and the cell page renders 34. This already produced one wrong
  conclusion in the plan and was corrected.

- **The 162 commits were pushed on 2026-08-19.** `origin/main` is at
  `6fc88e3e`; local `HEAD` has moved past it and the loop's later commits are
  unpushed by rule. **Do not restate the gap as a number here** - it is stale the
  moment the next tick commits, which is exactly the defect this file's own
  proposal (move M1) exists to retire. Run `git rev-list --left-right --count
  origin/main...HEAD` instead. Superseded ref
  written 2026-08-18 05:42. The 2026-08-18 dossier says they are unpushed; it was
  written six minutes earlier. The loop still never pushes.
- The chain is **103 gates** since tick 7. `CLAUDE.md` says 95 and
  `docs/verification-protocol.md` says 31. Both are stale and both are on the
  contradiction list below.
- `cell-lattice` defers 3 checks by design. Deferred is not passed.
- The Bash CWD resets to `E:\atlas`. Prefix every command with
  `cd /e/atlas/website`.

---

## Open work, carried from the 2026-08-18 dossier

| # | Item | Where | Owner step |
|---|---|---|---|
| 1 | An aria-label says "All trades average" over a median | `src/components/spine/industry/industry-view.tsx:136` | 08 |
| 2 | The same trade reads `$9` in one block and `8.6%` in another, 6 of 6 rows disagree | `src/lib/spine/adapt_industry.ts` | 08 |
| 3 | `preserveAspectRatio="none"`, **10 instances across 9 files**, not the 6 the dossier lists | `kit/engraved/*`, `spine/*`, `spine2/Quad.tsx` | 09 |
| 4 | `#newsletter` carries `scroll-mt-20` (80px) against an 85px masthead | `src/components/newsletter/NewsletterSignupVariants.tsx:91` | 09 |
| 5 | `buildCityBoard` has 0 external references; `buildCountryBoard` has 6, all from its own gate | `src/lib/scores/` | 06 |
| 6 | Two Supabase migrations written and never applied; signups and corrections silently discarded | `db/migrations/2026-08-16-*.sql` | founder, manual |

## Contradictions found 2026-08-18, to be repaired by 02 and 06

1. `CLAUDE.md:92` and `:99` say 95 gates. The chain is **102**.
2. `docs/verification-protocol.md:31` and `:79` say "prebuild 31/31". The chain is
   **102**.
3. `CLAUDE.md` names the 2026-08-01 handoff as current. Three have landed since.
4. `src/components/AtlasFrame.tsx` header still documents a third passe-partout
   layer, with its `.16`/`.82` values and `calc(50% +/- 622px)` stops, which the
   component no longer renders. The same header says
   `--atlas-surface-card` is opaque `#ffffff`; it is now
   `rgba(255,255,255,0.955)`.

## Leads, resolved

- **The foreign font: CONFIRMED and FIXED, tick 4.** `--font-display` referenced
  itself on the same element next/font's class lands on. Measured in a browser
  on a two-order fixture: when `:root` won the tie the property computed to the
  EMPTY STRING and consumers inherited the body sans; when the font class won,
  the `:root` fallback chain never applied. Fixed by giving next/font the slot
  name `--font-serif` and having `--font-display` read it, which is exactly how
  `--font-body` reads `--font-sans`. Re-measured in both orders after the fix:
  identical, correct. Gated by `verify_no_self_referential_css_vars`.
  **Still unknown: which order production actually serves**, so how much of the
  site a reader currently sees in the wrong face is not established.

---

## Queued by tick 1, for the next cleanup and organisation slots

| # | Item | Size | Owner step |
|---|---|---|---|
| 7 | **155 scripts that no gate runs.** 257 in `scripts/`, 102 registered. Triage into gate, instrument, spent one-shot, with an index at `scripts/README.md`. Not a deletion sweep. | 153 files | 01, then 06 |
| 8 | `docs/` archive pass. 352 files, zero deletions, `docs/ARCHIVE/` plus a pointer index. Start with the four handoffs preceding 2026-08-18. | 352 files | 01, then 06 |
| 9 | `src/app/dev/`, 37 routes, classify and retire one per tick. | 37 routes | 01, then 06 |
| 10 | 91 tracked screenshots at the parent root, 16.5 MB. Blocked on Q6; the loop does not delete tracked files in a repo it does not own. | 16.5 MB | founder |

---

## Tick log

Newest first. One line per tick: tick number, slot, what landed, the commit.

- **Tick 9, slot 9, claims. The dossier's precision defect is CONFIRMED, exactly,
  and my own first reading of it was wrong.** Measured on the real
  `restaurants` seed: the benchmark rail prints Fast-casual at **$9** while the
  subtype table prints the same trade at **8.6%**. Six rows, six disagreements,
  worst 0.5pp (Food trucks $12 vs 11.5%, Bars $7 vs 6.5%). Mechanism:
  `adapt_industry.ts:205` and `:397` round every rail figure with `Math.round`,
  the subtype table renders `toFixed(1)`, both descend from one net margin.
  **The correction that matters:** I first read the London seed file, saw whole
  numbers, and concluded the 8.6% had no source and that the blocks described
  different entities anyway. Both halves were wrong, and reading a neighbouring
  file instead of the module that produces the number is rule 1 of the working
  method. The probe corrected it.
  Repair NOT made: which precision wins is a judgement about what the page
  shows, so it is **Q8** with a recommendation (round the table; rank order and
  the three-way tie survive). Artifact:
  `artifacts/industry-precision-2026-08-19.md`. Instrument:
  `scripts/spikes/measure_industry_precision.tsx`.
  Also read and worth carrying: the adapter's own header already measured the
  OTHER open claim item, the aria-label at `industry-view.tsx:137` that says
  "All trades average" over a median. Median 7.920 ships as $8; the mean is
  9.126 and would ship as $9; trades span about $5 to $12, so the name is a
  whole dollar out on a scale one dollar wide. **The adapter says the name is
  the defect, not the number, and the string lives in the component.** That is a
  one-line fix waiting for a machine that can run a typecheck.
  **The environment, measured across the tick:** `spawn UNKNOWN` (-4094), then
  npm "Could not determine Node.js install directory", then `0xC000012D` on
  every fork including `bash` itself. Likely orphaned node processes from the
  night's killed runs. **A tick that cannot verify must not commit**, so nothing
  was committed rather than landing an unverified change.

- **Tick 8b, slot 8, site continuation, THE SAME SLOT NUMBER AS THE ENTRY BELOW.**
  Two agents ran tick 8 concurrently: the cron fired while a tick was already in
  progress. Files did not collide (that line took backlog P0-1 and the `verify_*`
  gates; this one took the homepage paint census), but `STATE.md` and
  `WAKE-UP.md` are written by both and one anchor-based edit failed against the
  other agent's rewrite. **The subagent doctrine says ownership is exclusive and
  declared; the cron does not know that.** Filed as a loop-health item for slot 7.
  Work landed: the first PAINT measurement of the homepage. 11/11 bands paint at
  both widths, **0 compute `position: static`**, no horizontal scroll, 5,933px at
  1280 and 9,848px at 375. **The page is 617 words, not 764**, so the 615 target
  was already met and P1 is re-aimed from words to height. **Height is three
  bands**: neighborhoods 1,568px, catalog-plates 1,142px, audience 1,127px, 39% of
  the mobile page for 208 words. Font census: exactly two families, Inter 171 and
  Newsreader 61, confirming `2179bcb2` from the paint side. Filed P0-14, a defect
  class gate 102 does not catch. `796b96aa`, census in
  `artifacts/home-paint-census-2026-08-19.md`.

- **Tick 8, slot 8, site continuation / backlog P0-1.** Repointed four design
  gates from the `dev/spine-*` route wrappers to the bodies they render. The
  wrappers are 23 to 27 lines holding ONE JSX element; the bodies total 3,695
  lines and were read by nothing. Dry-run before landing: zero new failures, and
  the gates' vocabulary is present in the bodies (Rail 3-13, Movement 5-8, Head
  0-10), so the coverage is real rather than vacuous. `bar_budget` also listed
  `NeighborhoodExplorer.tsx` TWICE, double-counting the hood group (2/2 on a
  phantom, now 1/2); on real bodies it reads **cell 3/3 and industry 3/3, exactly
  at budget**. Checkpointed tick 6's stranded render harness first (`7cf76941`).
  **A NEW FLAKE SIGNATURE, and the commit message understates it.** `85f6d5df`
  says "green after two false starts"; the accurate account is here. Run 1: all
  103 reported red, `spawn UNKNOWN` errno -4094, runner crashed, nothing
  executed. Run 2: `npm` itself failed, "Could not determine Node.js install
  directory". Run 3, driven straight through `tsx` at `--concurrency=2`: **95
  passed, 8 crashed at STARTUP** in under 2.6s with empty output, six at
  `0xC0000409` and two at exit 134, the segfault signature already in the notes.
  The 8 are the first eight entries in the array, so they took the worst of the
  contention. **All eight were then re-run individually and all eight pass.** So
  the chain is green on the evidence and has never once been green in a single
  process on this machine tonight. Windows process creation also killed a `git
  commit` and a `python` heredoc in the same half hour.
  **Two measurement traps caught while checking this**, both already in the
  notes and both re-paid: `$?` after a pipe reports `tail`, not the gate, so six
  gates read as exit 0 while crashing; and the CWD reset to `E:\atlas` mid-tick,
  so the same six failed with `ERR_MODULE_NOT_FOUND` and looked like defects.

- **Tick 7, slot 7, failure reflection then guardrail.** Mined ticks 1-6: **one
  class accounts for all six**, a typed statement about the codebase that was
  never checked against it, and four of the instances are in this loop's own
  documents. Found a live example while looking: **`prebuild:serial` ran 43 of
  the 102 gates**, missing cream, palette, take-home identity, canonical URLs and
  every wired test, while `CLAUDE.md` called it "same gates" and the parallel
  runner it stands in for is the flaky one. Deleted the duplicate list (it now
  invokes `prebuild_all.ts --concurrency=1`), added gate 103
  `verify_single_gate_chain`, negative-tested, and corrected the `CLAUDE.md`
  claim. Wrote `artifacts/failure-log.md` and three prose rules into
  `05-GUARDRAILS.md`.

- **Tick 6, slot 6, homepage.** Withdrew the top backlog item rather than
  building it. P1-0 proposed raising section padding to 56px desktop to cut a
  third of the page height. Three measurements killed it: `ToneBand` already
  renders `py-8 md:py-10` = 32/40px, at the TIGHT end of the editorial range;
  `verify_spacing_scale` defines a scale that STOPS AT 40, derived from the
  founder's mockup, so 56 would have gone red; and `4ff9d677` had already removed
  1,216px (18% of height) by collapsing four rhythms into this one. The change
  would have added ~320px back. **The research finding was true and the local
  instruction derived from it was backwards, because nobody measured this page.**
  Correction written into `01-DESIGN-STANDARD` §0 rule 2 so it is not re-derived.
  Filed P1-0b: per-band computed height is still unmeasured, and until it exists
  every "too tall" claim here is a guess. Commit `658edc3e`.
- **Tick 5, slot 5, organisation research.** Found that `CLAUDE.md` routes every
  session to the two most abandoned directories: `docs/design-system/GUIDELINES.md`
  last committed 2026-05-28 and `docs/architecture/README.md` 2026-05-27. Worse
  than stale, `TOKENS.md` carries 25 references to moss, amber, teal and cream,
  ramps deleted 2026-08-17 and now gated against, so the prescribed reading order
  teaches a palette the chain rejects. Fixed this step file's own gate count in
  passing (said 101, is 102). The census then found it is worse: the count is
  stated at ~78 locations across 32 files at TEN values. Proposal refuses a
  tree restructure and proposes three properties instead: generated counts, an
  entry point that names rather than restates, status lines on records. Commits
  `edfab3ab`, `21e3c86d` (research, 20 pages, 17 projects), `54e0a7ef`.
- **Tick 4, slot 4, site continuation.** Confirmed the foreign-font hypothesis
  in a browser and fixed it in two lines, plus a false comment in `LogoWordmark`
  claiming an invalid variable falls through to Georgia. Added gate 102,
  `verify_no_self_referential_css_vars`, negative-tested. Chain is now 102/102.
- **Tick 3, slot 3, claims.** Classified the founder's own example,
  `break_in_rating`, as JUDGED and measured it over 1,764 combinations: a 10%
  move in one input changes the printed word **14.1%** of the time, and on 3 of 4
  call sites time-to-open has **no place argument**, so 24% of the score is a
  per-trade constant. **Corrected mid-tick** after `tsc` caught a field I had not
  read: the neutral-50 fallback (24.8% to 32.3% word changes) is defensive, not
  live, because callers pass modeled values rather than null. The real finding is
  `restsOnModeled`: **4 of 5 production callers hard-code it true and exactly one
  component displays it**. Instrument: `scripts/spikes/sensitivity_break_in.tsx`.
  Raised as **Q7**, not acted on. Queued: how many published cells sit within 3
  points of a band cut-point.
- **Tick 2, slot 2, homepage.** Gave all eleven bands a `data-band` identity,
  because ToneBand emitted an anonymous div and three bands share one tone, so
  nothing could count them. Built `scripts/spikes/measure_home_bands.tsx` and
  measured: 11 declared, **11 emitted, 0 absent** with real data, 764 visible
  words, nine bands between 59 and 76 words. Corrected `10-HOMEPAGE.md`, which
  had assumed three self-omitted. Next: paint height at 1280 and 375, now
  trivial.
- **Tick 1, slot 1, cleanup.** Deleted 9 unreferenced render leftovers at the
  parent root (1.26 MB); found that 91 of the 100 were TRACKED and out of scope,
  correcting the step file's own figure by a factor of ten. Wrote
  `artifacts/bloat-census-2026-08-18.md` as the baseline. Added a guardrail after
  an untargeted grep from `E:\atlas` burned ten minutes and timed out.
