# Per-page QA Checklist

> **Plan v16 Block I.** Every commit that creates or substantially modifies
> a user-facing page must pass all twelve items below before push. Founder
> ends the volume-over-quality cadence here.

---

## The twelve

Every page-touching PR confirms:

1. **tsc clean.** `npx tsc --noEmit` returns nothing.
2. **Taxonomy clean.** `npm run verify:taxonomy` passes.
3. **No em-dashes.** `npm run verify:em-dashes` passes (already in prebuild).
4. **No source-agency names.** No string in the page or its components contains "Eurostat", "Census", "Destatis", "INSEE", "ISTAT", "ONS", "e-Stat", "INE", "CBS", "IBGE", "INEGI", "OECD", "World Bank" inside user-visible JSX text. (Plan A lockdown / R-002.)
5. **No user-visible "cell" / "cells".** D-107. Component file names may keep the word; user-facing copy says "benchmark" or "snapshot".
6. **No raw `p10` / `p50` / `p90`.** Use Bottom 10% / Typical / Top 10% (D-107).
7. **No calendar years in user-facing copy.** Inflation roll-forward makes the year actively misleading (D-102 / D-107).
8. **Every card grid symmetric at every breakpoint.** Count rendered children; confirm count is a multiple of the lg/md/sm column count, or that the grid pads / trims to keep it so. No 4-then-2 rows.
9. **Adjacent buttons share dimensions.** Buttons or anchors that sit next to each other use the same width and padding tokens. Slight colour variation allowed.
10. **No "Coming soon" / "TBD" / "Lorem ipsum".** Per founder explicit rejection.
11. **Image lookups never serve a country-mismatched photo with a country-named attribution.** AtlasHeroImage no longer renders attribution at all (Plan v16 A7). If you change that, you must add country-tag guards.
12. **Mobile breakpoints explicitly tested.** Render or screenshot the page at 375 px, 414 px, and 768 px. Headings don't overflow, buttons don't wrap weirdly, images scale.

---

## Run the prebuild guards

```bash
cd E:\atlas\website
npm run verify:taxonomy
npm run verify:em-dashes
npx tsc --noEmit
```

All three must pass.

## Smoke-test URLs

After a deploy, hit at minimum:

```
https://www.marginatlas.com/
https://www.marginatlas.com/us/california/restaurants
https://www.marginatlas.com/fr/fr10/restaurants
https://www.marginatlas.com/gb/gb/legal-services
https://www.marginatlas.com/mx/mx-roo/hotels-lodging
https://www.marginatlas.com/jp/japan/restaurants
https://www.marginatlas.com/it/itc4c/clothing-stores
https://www.marginatlas.com/world
https://www.marginatlas.com/compare
https://www.marginatlas.com/pricing
https://www.marginatlas.com/sectors/professional_services
https://www.marginatlas.com/industries/management-consulting
```

Every URL must return 200 with a populated `<h1>` and either real numbers
or an honest "not yet covered" placeholder. No 500s. No "Coming soon".

## How to fail-fast

If any of the twelve fails, stop. Fix it inline before commit. Do not
push a fix-it-later commit. Plan v15 + v16 lessons: incremental volume
without these checks is the failure mode the founder flagged.
