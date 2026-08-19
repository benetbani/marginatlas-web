# STATE. The loop's memory. Written every tick, read first every tick.

A different agent, with none of tonight's context, must be able to resume from
this file alone. If it cannot, this file is wrong.

---

## Now

| | |
|---|---|
| Tick | **8** done (slot 8, site continuation, backlog P0-1) |
| Next slot | **9**, `08-CLAIMS-AND-INDICES.md` |
| In-flight | none. |
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

- **Tick 8, slot 8, site continuation / backlog P0-1.** Repointed four design
  gates from the `dev/spine-*` route wrappers to the bodies they render. The
  wrappers are 23 to 27 lines holding ONE JSX element; the bodies total 3,695
  lines and were read by nothing. Dry-run before landing: zero new failures, and
  the gates' vocabulary is present in the bodies (Rail 3-13, Movement 5-8, Head
  0-10), so the coverage is real rather than vacuous. `bar_budget` also listed
  `NeighborhoodExplorer.tsx` TWICE, double-counting the hood group (2/2 on a
  phantom, now 1/2); on real bodies it reads **cell 3/3 and industry 3/3, exactly
  at budget**. Checkpointed tick 6's stranded render harness first (`7cf76941`).
  **A NEW FLAKE SIGNATURE, worth knowing:** the first full chain reported all 103
  red with `spawn UNKNOWN` errno -4094 and the runner crashed. Nothing had run.
  It is Windows process creation failing under load, a sibling of the documented
  esbuild flake, and the same fault hit `git commit` and a `python` heredoc
  earlier in the tick. Re-ran at `--concurrency=2`.

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
