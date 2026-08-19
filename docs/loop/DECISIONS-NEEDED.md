# DECISIONS NEEDED. Each answerable in one word.

The loop never blocks on these. It writes the question, takes the smallest
reversible step consistent with the recommendation, and moves on. Anything
touching a locked value it leaves entirely alone.

Answer by writing the letter next to the question, or by voice.

---

## Carried from the charter, section 13. Not pre-empted, still yours.

**Q1. The smallest type the atlas prints.** 114 text nodes compute under 12px;
the live decision is the 10px step, 31 nodes, 24 of them the character panel's
spectrum end labels, which are load-bearing rather than decorative.

- **A.** 10px stays; the engraved family keeps its own micro step.
- **B.** 10px goes to 10.5px, a size already in the ladder. **Recommended.**
- **C.** 11px floor for anything a reader must read; only settles
  `CountryShape`'s private 9.5px and 8px if you pick this one.

**Q2. `--text-faint`.** `#87745d` measures 4.48:1 on white and 4.35:1 over the
card's worst backdrop. AA is 4.5. It misses everywhere by about 0.15, and 82 of
the 114 small nodes are this one token.

- **A.** Darken to roughly `#857259`, the smallest change that clears AA.
- **B.** Accept 4.48 and write down why, so it stops being rediscovered.
  **Recommended.**
- **C.** Split the token by size. Most work, most correct by the letter of the
  rule.

---

## New, 2026-08-18

**Q3. Do the gates run on a Vercel deploy?** There is no `vercel.json`, so the
build command is a dashboard setting. If Vercel runs `next build` directly, the
npm `prebuild` hook is bypassed and all 101 gates are skipped in CI while passing
locally. One line settles it permanently, in the repo rather than a dashboard:
`{ "buildCommand": "npm run build" }`.

- **A.** Add the file. The loop can do it in one tick. **Recommended.**
- **B.** You set it in the dashboard instead.
- **C.** Leave it; accept that the gates are local-only.

Left to you because changing how production builds is a deploy decision.

**Q4. May the loop remove a claim from a live page?** The claims reform will find
scores and verdict words with no traceable inputs. Removing one changes what the
site says.

- **A.** Remove it and state it in the commit and in `WAKE-UP.md`.
  **Recommended:** a wrong claim costs more than a missing one, and self-omission
  is already the house rule.
- **B.** Leave it in place, list it, and wait for you.
- **C.** Replace it with the inputs behind it in the same tick, never removing
  anything outright.

**Q5. The homepage band count.** You asked for at least ten sections. Three of
the current eleven are data bands that self-omit when their lookups fail, so
eleven declared can paint as eight.

- **A.** Build to twelve or thirteen declared, so ten still paint on a bad data
  day. **Recommended.**
- **B.** Exactly ten declared, and fix the self-omission instead.
- **C.** Ten declared and accept that some days show fewer.

**Q6. The 91 screenshots committed to the parent repo.** `E:\atlas\` holds 91
tracked `.jpeg` files at its root, 16.5 MB, added 2026-07-27 in `d843425`. By
name they are agent verification shots (`_pass-cell-hero`, `_idx-cities`,
`_final-hood-mobile`), not design sources, but they were classified by naming
family and nobody has opened them.

- **A.** The loop samples a dozen visually, confirms they are verification
  output, then deletes all 91 in one parent-repo commit. **Recommended:** they
  are regenerable and they are 16.5 MB of the parent repo's working tree.
- **B.** Move them to `E:\atlas\_attic\` instead, so nothing leaves history.
- **C.** Leave them. They are somebody's record.

The loop has NOT acted on this: the parent repo is not the loop's working tree
and deleting tracked files there is a decision about that project.

**Q7. The break-in word, and where the caveat travels.** Your example, measured,
and corrected once during the tick. The rating blends three sub-scores with
weights we chose, and it carries a `restsOnModeled` flag the callers set: **four
of the five production callers hard-code it to true**. Only ONE component reads
it, `BreakInScore.tsx`, which prints "read it as directional" and draws the three
driver bars. Every other surface printing the word shows neither.

Two supporting numbers over 1,764 plausible input combinations: a 10 percent move
in one real input changes the printed word **14.1 percent** of the time, and on
three of the four call sites time-to-open has no place argument at all, so **24
percent of the score is a per-trade constant, identical in every city**.

- **A.** Carry the modeled caveat and the three driver bars to every surface that
  prints the word. **Recommended:** the mechanism already exists, one component
  already does it, and it shows the ingredients instead of hiding them.
- **B.** Omit the word entirely wherever the rating rests on modeled inputs, and
  print the payback figure alone.
- **C.** Leave it and write down that the word is directional by design.

**The loop has NOT acted.** The percentages are the function's behaviour across a
plausible grid, not a count of live pages. The queued measurement is how many
published cells sit within three points of a band cut-point, which turns each
percentage into a page count.

**Q8. The industry page prints one quantity twice, at two precisions.** Measured
on `restaurants`: the benchmark rail says Fast-casual keeps **$9** and the
subtype table says **8.6%**, for the same trade, on the same page. Six rows, six
disagreements, worst 0.5pp. Both descend from the same net margin; the rail
rounds at the adapter, the table keeps a decimal.

- **A.** Round the subtype table to whole numbers, so both read $9 / 9%.
  **Recommended:** it keeps the `$ per $100` idiom your design prints at 64px,
  the rank order is unchanged, and the three-way tie at 8.6 stays a tie.
- **B.** Give the rail the decimal instead: `$8.6 per $100`. More precise, and a
  decimal in a 64px figure.
- **C.** Leave both and label them differently, so the reader knows one is
  rounded.

Reversible either way and it touches no locked value, but it changes a printed
number on a live page, so the loop measured it and stopped.

**Q9. Five files named `verify_*` that no chain runs.** `verify_aov_city_tier`,
`verify_enrichment`, `verify_formation_expansion`, `verify_manual_aliases`,
`verify_manual_aliases_db`. They sit beside 84 files with the same prefix that do
run, so the name asserts an enforcement that does not exist. All five were last
touched between 2026-05-22 and 2026-06-07; one needs the database, so it can
never join the chain (the chain must not depend on a secret).

- **A.** Run all five once. Register the four that are green and secret-free;
  attic the database one with a note saying how to run it by hand.
  **Recommended:** it is the repo's own rule, wire it or delete it, and running
  them first means nothing is thrown away unmeasured.
- **B.** Attic all five now. They have not been edited in over two months.
- **C.** Rename them to `check_*` so the name stops claiming enforcement, and
  leave them where they are.

The loop has not acted: registering a gate that fails would turn the chain red
for a future tick, which `05-GUARDRAILS.md` forbids.

---

## Answered

_(nothing yet)_

---

## Raised 2026-08-19 by the reference-page research. Genuinely in tension with a ratified rule.

**Q3. Typed absence, or self-omission?** Our doctrine is that a missing figure
renders NOTHING: no placeholder, no row. The external research says the opposite,
and says it from twenty pages: *"absence is a typed token in the value slot with
one legend per page, never a deleted row."* World Bank and census-style legends
keep the label and type the absence. **Levels.fyi hides thin rows and is the only
site in the set where a reader cannot see the coverage gap** - and it is the most
admired page of the twenty, which is exactly why the habit spreads.

The two are not obviously reconcilable, and the loop will not settle a ratified
rule on its own.

- **A.** Keep self-omission everywhere. Simplest, and it is what the gates
  already assume.
- **B.** **Split by scope: a SECTION still self-omits, a ROW inside a table keeps
  its label and types the absence, with one legend per page. Recommended.** It
  takes the research where it is strongest (a reader cannot see a gap you
  deleted) without touching the band-level behaviour the charter ratified, and it
  is reversible.
- **C.** Typed absence everywhere, including sections. Most faithful to the
  research, largest change, and it would contradict the charter directly.

**Related and cheaper, needs no ruling:** Data USA's substitution pattern. When a
figure does not exist at the requested resolution, show the coarser one and
**name the substitute geography in the same sentence.** That is additive rather
than contradictory, and it is the most transferable fix for the sample-tag
problem.
