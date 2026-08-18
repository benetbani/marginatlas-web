# STATE. The loop's memory. Written every tick, read first every tick.

A different agent, with none of tonight's context, must be able to resume from
this file alone. If it cannot, this file is wrong.

---

## Now

| | |
|---|---|
| Tick | **0** (not started) |
| Next slot | **1**, `01-CLEANUP.md` |
| In-flight | none |
| Tree | clean apart from `.mcp.json` (never commit) and untracked `scratchpad/` |
| Gates | `tsc` clean; `prebuild` 101/101 as of 2026-08-18, one Windows esbuild flake on `no-slot-counting` which passed alone |
| HEAD | `6fc88e3e`, and `origin/main` is at the same commit |

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

## Tick log

Newest first. One line per tick: tick number, slot, what landed, the commit.

_(empty; the first tick writes here)_
