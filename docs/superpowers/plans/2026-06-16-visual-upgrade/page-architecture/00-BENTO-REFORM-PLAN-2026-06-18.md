# Bento reform plan (2026-06-18)

> Why this exists: the rebuilt mockups were rejected as too wordy, too sparse, too tall, with oversized type, trivial facts in big letters, visuals that did not replace words, and at least one agreed section (country character) dropped to a pale strip. The section SET was mostly right; the LAYOUT, BREVITY, TYPE, TRIVIA-CONTROL, and VISUAL QUALITY were wrong. This plan fixes those five axes. Founder decisions baked in: **bento grid (Option B, SaaS bento)**, **founder picks the look (done: B)**, **pilot the country page first**. Standing law still binds (honesty boundary, tokens only, no em-dashes, no source-agency names, one accent). See [[feedback_visual_density_brevity]].

## 1. The one sentence
Make every page a dense, skimmable **bento of small tiles** in the warm Atlas brand, where graphics carry the meaning and words are stripped to labels, every stat earns its place, and no agreed section is lost.

## 2. The five laws (each is a hard gate at QA)

### Law 1 , Bento density (Option B)
- Page = a **4-column bento grid** (gap 12px; collapses 4 to 2 to 1). A "section" is no longer a full-width band; it is a **cluster of tiles** under a small kicker.
- Tile types: `focal` (span 2 cols, the cluster's one answer), `stat` (1 col, a number + label), `wide` (span 2, a table or chart), `chart` (1-2 cols), `spark` (1 col mini-trend).
- **Never one lone section per horizontal band.** Every band carries 2 to 4 tiles. The masthead and the single closing line are the only full-width exceptions.
- One focal point per cluster (the focal tile or the largest number); everything else supports it.
- Target: each page is **~35 to 45% shorter** than today; the first screen shows the masthead cluster AND the start of the next, never one giant section.

### Law 2 , Brevity (cut words >= 50%)
- **Kill the stack.** No more eyebrow + title + subtitle + lead paragraph + caption per section. A cluster gets at most: one kicker (10px) + one short head (>= a tile), then tiles.
- Word budgets: focal tile = headline <= 8 words + one read <= 14 words; stat tile = label <= 3 words + number + optional read <= 4 words; table row = label + visual, no sentences; narrative tiles (honest take, one thing) = <= 2 short lines.
- Prose is allowed only where the words ARE the product (the honest-take verdict, the one-thing closer) and even there it is tight. Everything else that is currently a sentence becomes a label, a number, or a visual.
- A graphic exists to REMOVE words. If a sentence and a chart say the same thing, the sentence goes.

### Law 3 , Smaller type
Drop the scale hard, especially headers (they were 26 to 36px and felt huge).

| Role | Rejected scale | New bento scale |
| --- | --- | --- |
| Page H1 (masthead) | clamp(30,46) | **clamp(24px, 30px)** |
| Hero number (one per page) | clamp(56,92) | **clamp(34px, 46px)** |
| Cluster head | clamp(26,36) serif giant | **15 to 17px, weight 600** (tile header, not a headline) |
| Eyebrow / kicker | 12px | **10 to 11px** |
| Stat number (tile) | 28 to 30px | **20 to 24px** |
| Body / read | 18px lead | **12 to 13px** (no lead paragraphs) |
| Caption / footnote | 12 to 13px | **11px** |

The biggest single change: section headers go from giant serif headlines to 15 to 17px tile headers. Newsreader serif is reserved for the masthead H1, the one hero number, and the one-thing closer only.

### Law 4 , Trivia filter (the sanity gate)
A stat earns a tile only if it is **both**: (a) non-obvious (a smart reader would not already know or guess it) AND (b) decision-relevant (it changes a start / buy / benchmark decision).
- **Banned** (the founder's own rejected examples): raw population in big type, "84% live in towns and cities", vague wealth words like "spending power comfortable", "9.5 million live in the big cities", GDP-as-trivia, any round-number geography fact.
- **Earns a tile**: cost to set up, days to register, tax rate, employer on-cost, wage floor, commercial-rent index, net margin, owner take-home, survival / months-to-breakeven, saturation, district multiplier, the character ratings.
- Vague qualitative words ("comfortable", "robust") are banned; replace with a rating (pips) or a number.

### Law 5 , Per-visual usefulness gate
Every visual must pass all four or it is cut/redone:
1. **Useful** , does it drive a real decision?
2. **Understandable** , clear in under 3 seconds, no study?
3. **Relevant** , to the reader who is on this page?
4. **Faithful** , geometry computed from the data, no decoration posing as data, not gigantic-for-no-reason?
"Dumb graphics that show nothing" fail #1 and #4 and are worse than text. The per-$100 single bar is the bar to clear: small, exact, instantly legible.

## 3. The bento component kit (built once, reused on all 6)
A single warm-token CSS kit so every page is consistent and nothing is hand-fudged:
- `.bento` grid + `.tile` base; variants `.focal .stat .wide .chart .spark`.
- `.pips` (4-rung rating, cocoa fill, atlas for a top rating, moss for a positive) , the character-table and matrix atom.
- `.statline` (label + tabular number), `.miniband` (compact range strip), `.sparkbars` (tiny trend), `.tablecard` (dense rows, hairline separators).
- All on the existing `:root` tokens; computed geometry; tabular numerals; one accent; 11px floor.

## 4. Section-list audit (no agreed section dropped)
For the pilot (country) and then every page, I produce a table BEFORE building: `agreed section | source (section-constitution / original mockup / approved-reform) | in build? | bento treatment`. A section may be merged or compacted, never silently dropped or degraded.

### Country , agreed sections and their bento treatment (the pilot)
Grounded in the recovered original + the approved-reform doc + the section-constitution:
1. Masthead , focal tile (name + one decision anchor, NO population). 
2. Scorecard (the vital signs) , a 4-up `stat` bento, trivia-filtered (tax, on-cost, days-to-register, wage, VAT, rent index), each "vs global baseline" as a pip, not a sentence.
3. **Character , RESTORED as TWO `wide` table-cards in color: "the rules, from a business view" (6 rated rows) + "the culture, from an outsider view" (6 rated rows).** This replaces both the rejected radar AND the pale 5-spectra strip. The single best lens carries the lone accent.
4. Cost and rules to set up , a `wide` table-card (formation cost by tier) + the days/steps as stats.
5. Hire and the cost of a team , pay floor-vs-typical `miniband` + on-cost pips.
6. The market you can reach , compacted to decision-relevant tiles (reach + concentration), trivia removed.
7. Versus the neighbours , a dense `wide` table-card, home row tinted, no crown.
8. How costs have moved , a `spark` trend tile.
9. Cities , uniform card row, no ranking, one real fact each.
10. Easiest to start , chips, no rank numbers.
11. What locals know , the insider tiles (kept, they are signal).
12. Still filling in , one calm strip for unheld (licences, special zones, etc.).
13. Vs the world , `chart` ScoreBand tile (or folds to the strip).
14. The honest take , a narrow narrative tile (<= 2 lines).
15. One thing to remember , the one full-width serif closer.
16. Related / Compare CTA , a compact tile row.
Chrome: full navbar + multi-column footer.

(Cell / city / industry / neighbourhood / home get the same audit before their builds, reconciled against their originals + the approved-reform doc, so nothing they had is lost.)

## 5. Ambitious, measurable targets (checked at QA)
- Words: **>= 50% fewer** than the current rebuilt page.
- Height: **~35 to 45% shorter**.
- Density: **every band >= 2 tiles** (masthead + closer excepted).
- Type: cluster heads **<= 17px**; hero **<= 46px**.
- Trivia: **100% of stats pass the filter** (zero population / %-urban / vague-wealth).
- Sections: **zero agreed sections dropped**; character two-table restored.
- Visuals: **every visual passes the 4-question gate**.
- Constraints: zero em-dashes, tokens only, one accent, honesty rails intact, computed geometry.

## 6. Quality + sanity checks (the procedure)
1. **Pre-build:** publish the section-list audit table; confirm completeness.
2. **Build:** the bento kit; computed geometry; trivia filter applied as tiles are written; word budgets enforced.
3. **Adversarial QA (workflow):** skeptics recompute every tile's geometry AND score it against the five laws (density, brevity word-count, type scale, trivia filter, visual gate) AND confirm no agreed section is missing. Defects fixed before delivery.
4. **Founder sign-off:** the country pilot is delivered as a standalone HTML you open. You approve the standard. Only then do I apply the kit to the other five.

## 7. Rollout
- **Phase 1 (this pass):** build the **country pilot** to Option B + the five laws. Deliver. Get your sign-off on the standard.
- **Phase 2 (after sign-off):** apply the locked bento kit to cell, city, industry, neighbourhood, home, each with its own section-list audit, each adversarially QA'd, delivered together.
- Production untouched; standalone HTML throughout; no app build.
