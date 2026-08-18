# 08. Claims and indices. Stop printing judgements as if they were measurements.

**Founder:** "we claim a lot and these claims are hard to measure: ex. how hard is
restaurant industry in a shithole city; we need objective data not some slaps like
that, that should be reformed, and oversimplification of metrics should be studied
and avoided".

This is the deepest item in the brief and it is a product decision, not a
cosmetic one. The atlas sells honesty. A word like "brutal" printed beside a real
revenue figure borrows that figure's credibility without having earned it.

---

## What is actually being printed today

`src/lib/scores/` holds **22 modules** and between them they emit ordinal words
and 0-to-100 numbers across every page type: `break_in_rating` (forgiving,
manageable, demanding, brutal), the score bands in `index.ts` (strong, workable,
mixed, weak, avoid), `composite`, `margin_index`, `city_attractiveness`, and six
`*_verdict` modules. `band_labels.ts` holds the words and `band_tone.ts` holds
the colour, so the vocabulary is at least centralised, which is the one thing
that makes this reform tractable.

**The founder's example, translated into the actual defect:** a single word
answering "how hard is this trade here" compresses rent, wages, competitor
density, licensing, demand and luck into one ordinal, with weights nobody
published, from inputs that are sometimes imputed, and prints it in the same type
as a measured revenue figure.

---

## The four-way classification. Every printed claim gets exactly one.

| Class | Definition | Allowed to print |
|---|---|---|
| **MEASURED** | An observed value, with a source and a date | Yes, with its provenance |
| **DERIVED** | Arithmetic on measured values, formula publishable in one line | Yes, with the formula reachable |
| **JUDGED** | Thresholds, weights or cut-points we chose | Only with weights published, sensitivity stated, and worded as our reading rather than a fact |
| **ASSERTED** | No traceable input, or inputs too thin to carry it | **No.** Remove it, or demote it to a described condition |

The reform is to move everything out of ASSERTED, and to make every JUDGED claim
carry its own working.

---

## Procedure, one tick at a time. This is a campaign, not a single change.

1. **Census first, machine-generated.** One row per printed claim:
   surface, module, the exact words or range printed, its inputs, the transform,
   the coverage (how many live cells have real inputs against imputed), and what
   would falsify it. Write to `docs/loop/artifacts/claims-census.md`. Regenerate
   rather than hand-edit on later ticks.
2. **Classify each row.** Where a row cannot be classified without reading the
   module, read the module. That is rule 1 of the working method and six
   measurement artifacts have died to skipping it.
3. **Run the sensitivity test.** This is the instrument that decides everything
   else, and it does not exist yet, so building it is a legitimate whole tick:
   perturb each input by 10% and by 20%, recompute, and count how many live cells
   change band or move more than 5 points.
   - **A label that flips under noise smaller than the error in its own inputs is
     fiction, and the number of flips is the evidence.**
   - Report per module: inputs, flip rate at 10%, flip rate at 20%, and the
     single input the output is most sensitive to.
4. **Repair, one claim per tick, in this order of preference.**
   - **Show the ingredients instead of the score.** For the restaurant example
     the honest surface is: rent per square metre, the wage floor for the trade,
     same-trade businesses per thousand residents, licence steps and days, and
     the take-home spread. Five numbers a reader can check and weigh themselves,
     against one word that hides our weighting.
   - If a composite must stay, publish weights and inputs beside it, and state
     its coverage.
   - If neither is possible, **remove the claim.** Self-omission is sanctioned and
     preferred, and it is cheaper than a wrong number.
5. **Words, separately.** Never characterise a place or a trade as bad. Describe
   conditions with numbers. Never rank across geography and business, which is
   already a constitution rule and is exactly what a cross-page 0-to-100
   invites.
6. **Gate what you ratify, same tick.** The target instrument is a claims
   registry: no module may print a band, score or verdict unless it has a
   registry entry carrying inputs, formula, coverage and falsification note.
   Register it as a ratchet at today's measured number, never as a red line.

---

## Research, and what it can and cannot buy

**Semrush, aggressively, on new questions only.** Load the tools with
`ToolSearch`, cache every response to `docs/loop/artifacts/semrush/`, and check
the cache before every call. Useful here for: what people actually ask about a
trade in a place, which comparisons have real demand, which of our claims match a
question a human types, and which competitor surfaces answer them.

**Its blind spot, and it is the whole point of this step:** search demand
measures what people ask, never how hard a business is. Nothing from Semrush may
become an input to a difficulty claim. It informs what we should answer and how
we word it, not what is true.

**Web research** is for finding objective, checkable inputs that could replace a
judged score: published business survival rates by industry, licence and permit
step counts and timelines, commercial rent series, wage floors, business density.
Capture every source with URL and date to `docs/loop/artifacts/research/`.
Internal documents may name sources; **components may not**, because
`verify_no_source_agencies` enforces that in user-facing copy and it is a founder
rule.

---

## Forbidden

- Inventing an input to make a formula complete.
- Averaging two disagreeing figures. That is fabrication with extra steps.
- Adding a new index of any kind during this campaign. The point is fewer,
  better-founded claims.
- Silently deleting a claim the founder has agreed to. Removing one is allowed
  and is often right, but it is stated explicitly in the commit and in
  `WAKE-UP.md`.

## Done test

**"Every claim I touched is now MEASURED, DERIVED, or JUDGED with its weights and
sensitivity published, and I can name the number of cells whose band flips when
its inputs move 10%."**
