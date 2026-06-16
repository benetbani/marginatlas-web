# 07 . Interview decisions (the ratified design brief)

Status: RATIFIED by the founder, 2026-06-16, via a 40-question clickable interview.
These answers lock the open choices in `02-brand-design-constitution.md`. Where an
answer differs from the constitution draft, this document AMENDS the constitution
(noted inline). Authority: founder's word > `design-tokens.ts` > locked section spec
> constitution > research answer.

## Direction and feeling
1. Whole-site feeling: **warm editorial almanac** (not fintech, not loud magazine).
2. Dense page organised as: **six calm narrative bands** with breathing room between.
3. The frame: **keep the warm frame, light touch** (one language: engraved frame + clean core).
4. Reading order in every band: **title, number, reason, caveat** (fixed, guided).

## Typography
5. Serif (almanac voice): **Newsreader**.
6. Sans (scanned): **Inter**.
7. Serif scope: **restrained** (mastheads, openers, verdicts, the one big number only).
8. Big numbers: **one dominant answer-number** per page; others calmer.

## Colour
9. The one loud accent: **terracotta red** (`atlas-500 #e62200`).
10. Colour discipline: **one loud colour per screen, under ~5% of surface**.
11. Positive / kept: **moss green, the only second accent**.
12. Comparisons: **position, length, labels first; colour last** (Bertin; colour-blind safe).

## Density and layout
13. Desktop width: **three reading lanes** (quiet identity/source rail, central editorial, right rail for tools/comparison).
14. Whitespace: **generous between bands, tight within**.
15. Dense data (P&L, pay): **clean ruled tables** (with small in-row bars), not chart-only.
16. Desktop page index: **yes, quiet and sticky** (left rail).

## Charts (the chart language)
17. Where the money goes: **per-$100 stacked bar** (kept-row vermillion tick). *AMENDS constitution §5.2: the primary money chart is the per-$100 stacked bar, not the waterfall. The waterfall is demoted to an optional secondary read.*
18. Revenue spread: **gradient range strip with markers**.
19. Break-even: **the gap-is-the-wage two bars** (covers-to-break-even vs typical day; the gap is the owner's pay). *AMENDS §5.2: BreakEvenBand renders as the two-bar gap form, with the threshold/bullet as the fallback.*
20. The same business nearby: **ranked bars, the place-you-read in terracotta**.
21. Seasonality: **12-month bars, peaks highlighted**.
22. Risks: **a calm severity ladder** (rare/watch/serious), not a probability-impact matrix.
23. First year: **a timeline of stages** (fit-out, fragile, break-even highlighted, steady).
24. Chart labels: **direct labels on the chart**, almost no legends.

## Building blocks
25. Charts: **custom-built, on-brand** (the visx kit), not a generic chart library.
26. Controls: **a trusted accessible toolkit we own and restyle** (shadcn + Radix).
27. Icons: **one clean set everywhere** (Lucide); retire the second set (Phosphor).
28. Motion: **gentle, only for state and reveals**, reduced-motion-safe; never animates a number.

## Scope and sequence
29. Build order: **the foundation first** (tokens, type, chart kit, layout), then pages.
30. First page (the template): **London restaurants** (the business/cell page).
31. Build method: **fast static-data prototype first, then wire the real data**.
32. Scope: **the five agreed pages first** (cell, country, city, neighbourhood, home), then roll out.

## Honesty and trust
33. Missing-data sections: **filled, but clearly labelled illustrative** (a visible sample tag; never shown as real measured data). *AMENDS §7: labelled illustrative fills are permitted to make a page feel complete; the forbid is on presenting fabricated content AS real.*
34. Operator voices (no real interviews): **written, but clearly marked illustrative**, composed and NOT attributed to real named people ("typical of what operators say").
35. Trust block (coverage tier, confidence, sources): **yes, on every page**.
36. Make-it-yours calculator: **keep it in the hero**, under the headline number.

## Execution
37. Build cadence: **run whole parts, review at part boundaries** (Foundation, then Pages, then QA), not a check-in per phase.
38. Going live: **one cohesive launch** when the five pages are ready and reviewed (Wave F); never a half-changed site.
39. Pace: **take the time to make each phase genuinely excellent**, even if slower.
40. Open design calls the constitution does not cover: **I decide in the spirit of the constitution and show the founder**, stopping only for genuinely big or ambiguous calls.

---

## The two amendments to fold into the constitution
1. **Money chart (§5.2):** primary = per-$100 stacked bar with the kept-row tick; waterfall is optional secondary. (Q17)
2. **Honesty allowance (§7):** labelled illustrative content is permitted, numbers and composed-unattributed quotes, always visibly tagged as illustrative/sample, never presented as real measured data; this is the existing London-exemplar pattern made explicit. (Q33, Q34)

Everything else confirms the constitution as drafted.
