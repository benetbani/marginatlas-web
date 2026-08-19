# One quantity, two precisions, six rows. Measured 2026-08-19, tick 9.

The 2026-08-18 dossier carried this as an unverified claim: "the same trade reads
`$9` in one block and `8.6%` in another; 6 of 6 rows disagree, worst 0.5pp".
Measured with `scripts/spikes/measure_industry_precision.tsx` against the real
`buildSpineIndustrySeed("restaurants")` and the real `deriveSubtypes`.

**The claim is exactly right, including the worst-case figure.**

| name | benchmark rail | subtype table | delta |
|---|---|---|---|
| Fast-casual restaurants | **$9** | **8.6%** | 0.4 |
| Sit-down restaurants | $5 | 5.2% | 0.2 |
| Cafés & coffee shops | **$9** | **8.6%** | 0.4 |
| Food trucks | $12 | 11.5% | **0.5** |
| Pizzerias | **$9** | **8.6%** | 0.4 |
| Bars & nightclubs | $7 | 6.5% | **0.5** |

Six rows, six disagreements, worst 0.5pp, on one page, for entities with
identical names.

## The mechanism, read from the modules rather than inferred

- `adapt_industry.ts:205` computes `netPct = Math.round(netFraction * 100)` and
  `:397` rounds each sibling the same way, so **every figure the rail prints is
  a whole number by construction**.
- The subtype table renders `keeps_pct.toFixed(1)`, and its values arrive
  unrounded.
- Both descend from the same net margin. The page therefore prints one quantity
  twice, at two precisions, under one name.

## A correction to my own first reading, made mid-tick

I read the seed file first, saw subtype keeps of 9, 7 and 5, and concluded the
`8.6%` had no source and that the two blocks described different things anyway,
trades being sibling industries and subtypes being formats within one trade.
**Both halves of that were wrong.** The seed's whole numbers belong to a
different cell (`GB-london-restaurants`), and on this page the subtype rows carry
the same names as the trade rows. Reading a neighbouring file is not reading the
module that produces the number, which is rule 1 of the working method, and it
took a probe to correct.

## Not fixed in this tick, and why

Which way the two should converge is a judgement about what the page shows, not
a bug with one right answer, so it is **Q8** rather than a silent change:

- Rounding the subtype table to whole numbers preserves the rail's `$ per $100`
  idiom, which the design commits to at 64px, and loses nothing the table uses:
  the rank order is unchanged (11.5, 8.6, 8.6, 8.6, 6.5, 5.2 becomes 12, 9, 9, 9,
  7, 5) and the three-way tie at 8.6 stays a three-way tie.
- Giving the rail a decimal is more precise and prints `$8.6 per $100`.
- Either is better than a page that says 9 and 8.6 about the same trade.

## Also measured, and still open

`industry-view.tsx:137` reads `All trades average` to a screen reader over a
figure that is a **median**. The adapter's own header measured the gap in
2026-08-18: median **7.920**, shipping as $8; mean **9.126**, which would ship as
$9; the trades themselves span about $5 to $12. So the wrong word is a whole
dollar out on a scale one dollar wide. The adapter states the conclusion plainly
and could not act on it, because the string lives in the component: **the name is
the defect, not the number.** One line, next claims tick.

## Blind spots

- Measured on `restaurants` only. The probe accepts any slug and the second one
  it was given did not complete before the machine stopped creating processes.
- It reads the data handed to the components, so rounding done inside a component
  is invisible to it.
- It cannot say which precision a reader would prefer. That is Q8.
