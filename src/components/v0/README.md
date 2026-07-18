# src/components/v0 , where v0 output lands

Paste components generated in v0 into this folder, one file per section
(`Hero.tsx`, `MoneySplit.tsx`, `SurvivalMyth.tsx`, ...).

## The rule

**The founder's approved look is never redesigned here, only wired.** Changing spacing,
type, colour, or composition of an approved v0 component is out of bounds. The only edits
allowed when integrating are:

1. Replace hardcoded numbers with props from `@/lib/v0/cell-props`.
2. Swap raw hex for the `--v0-*` variables in `@/styles/v0-tokens.css` where they match.
3. Add the visible "modeled" tag on any figure where `data.modeled` is true.
4. Make it responsive/accessible if v0 missed it (alt text, aria-label on charts, 390px).

Anything beyond that goes back to v0, not into a hand edit here.

## Wiring a pasted component

```tsx
import { CELL_LONDON_RESTAURANTS as data } from "@/lib/v0/cell-props";

// v0 gave you <Hero /> with $43,000 hardcoded. Change the signature, not the design:
<Hero
  trade={data.meta.trade}
  city={data.meta.city}
  ownerKeeps={data.answer.ownerKeepsUsdYear}
  stats={data.heroStats}
  turnover={data.turnover}
  modeled={data.modeled}
/>
```

Preview it live with real data at `/dev/v0` before it goes near a real route.

## Then

Once a section is approved and wired, it graduates into the real page and is locked.
Forward only: new work adds sections, it never regenerates approved ones.
