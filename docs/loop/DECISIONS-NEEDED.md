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

---

## Answered

_(nothing yet)_
