# STATE. The loop's memory. Written every tick, read first every tick.

A different agent, with none of tonight's context, must be able to resume from
this file alone. If it cannot, this file is wrong.

---

## Now

| | |
|---|---|
| Tick | **3** done (slot 3, claims) |
| Next slot | **4**, `09-SITE-CONTINUATION.md` (the foreign-font hypothesis) |
| In-flight | none |
| Tree | clean apart from `.mcp.json` (never commit) and untracked `scratchpad/` |
| Gates | `tsc` clean; `prebuild` 101/101 |
| HEAD | see the tick log below; `origin/main` is at `6fc88e3e` and the loop's commits sit above it, unpushed by rule |

---

## Standing facts a resuming agent needs

- **The 162 commits are already pushed.** `origin/main` equals `HEAD`, ref
  written 2026-08-18 05:42. The 2026-08-18 dossier says they are unpushed; it was
  written six minutes earlier. The loop still never pushes.
- The chain is **101 gates**. `CLAUDE.md` says 95 and
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

## Leads, not yet confirmed

- **The foreign font.** `src/app/globals.css:882` declares
  `--font-display: var(--font-display), ...`, a self-reference, while its two
  neighbours reference `--font-sans`. Would make every engraved display heading
  fall back to body type. **Measure before believing it.** Owner step 09.

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
