# STATE. The loop's memory. Written every tick, read first every tick.

A different agent, with none of tonight's context, must be able to resume from
this file alone. If it cannot, this file is wrong.

---

## Now

| | |
|---|---|
| Tick | **4** done (slot 4, site continuation) |
| Next slot | **5**, `02-ORGANISATION-RESEARCH.md` |
| In-flight | none |
| Tree | clean apart from `.mcp.json` (never commit) and untracked `scratchpad/` |
| Gates | `tsc` clean; `prebuild` **102/102** (a gate was added in tick 4; the chain is the authority, the pasted loop prompt's 101 is superseded) |
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

- **The 162 commits are already pushed.** `origin/main` equals `HEAD`, ref
  written 2026-08-18 05:42. The 2026-08-18 dossier says they are unpushed; it was
  written six minutes earlier. The loop still never pushes.
- The chain is **102 gates** since tick 4. `CLAUDE.md` says 95 and
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

1. `CLAUDE.md:92` and `:99` say 95 gates. The chain is 101.
2. `docs/verification-protocol.md:31` and `:79` say "prebuild 31/31". The chain is
   101.
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
| 7 | **153 scripts that no gate runs.** 254 in `scripts/`, 101 registered. Triage into gate, instrument, spent one-shot, with an index at `scripts/README.md`. Not a deletion sweep. | 153 files | 01, then 06 |
| 8 | `docs/` archive pass. 352 files, zero deletions, `docs/ARCHIVE/` plus a pointer index. Start with the four handoffs preceding 2026-08-18. | 352 files | 01, then 06 |
| 9 | `src/app/dev/`, 37 routes, classify and retire one per tick. | 37 routes | 01, then 06 |
| 10 | 91 tracked screenshots at the parent root, 16.5 MB. Blocked on Q6; the loop does not delete tracked files in a repo it does not own. | 16.5 MB | founder |

---

## Tick log

Newest first. One line per tick: tick number, slot, what landed, the commit.

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
