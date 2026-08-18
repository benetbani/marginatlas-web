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

---

## Answered

_(nothing yet)_
