# 02 — THE SKIN CONTRACT. What we take, and what we refuse.

`FORM-CATALOG.md` has said this since 2026-06-16 and it still governs:

> Sanctioned external sources: shadcn/ui + Radix as component substrate,
> shadcnblocks patterns, Tremor / Recharts / visx as chart idioms. **Rule 0 makes
> all of them subordinate: take only chart legibility (direct labels, axis units,
> one-line legends, no decoration over data), never their aesthetics.**

This file makes that operational, because "never their aesthetics" was previously
read as "build it yourself", which is how the site ended up with 29 hand-rolled
charts.

---

## 1. THE TOKEN BRIDGE. Why this is nearly free.

shadcn components carry **no colours of their own**. They reference semantic
tokens, and all fifteen are already declared in `src/app/globals.css`:

| shadcn reads | this site supplies |
|---|---|
| `bg-background`, `text-foreground` | the page ground and ink |
| `bg-card`, `text-card-foreground` | `.atlas-card`'s surface |
| `bg-muted`, `text-muted-foreground` | the quiet neutral and quiet text |
| `border`, `ring`, `input` | the hairline |
| `bg-primary` | **atlas-700 `#991600`**, the guide's text/headline accent |
| `bg-accent`, `bg-secondary`, `bg-popover` | the cool neutrals |
| `--chart-1` .. `--chart-5` | added 2026-08-21: **atlas-500 `#e62200`** (the guide's SURFACE accent), then the cool ramp |

**Consequence:** an imported component is on-skin the moment it lands. Verify it
rather than assume it, but the default is correct, not wrong.

### CORRECTION, 2026-08-21, AND THEN A CORRECTION TO THAT CORRECTION

**First pass:** this file asserted the fifteen tokens **exist** without checking
what they **hold**. Checking was right. The conclusion drawn from it was wrong,
and the wrong conclusion nearly became a Phase 0 blocker.

**What was claimed:** that `--primary` (`#991600`) pointed at the wrong end of
the accent ramp, because the "ratified accent" is `#fb8469`.

**What is actually true.** `src/lib/design-tokens.ts` labels its own ramp, and
`docs/design-system/TOKENS.md` says the same thing:

```
atlas-300  #fb8469   a light tint
atlas-500  #e62200   primary accent (SURFACES)
atlas-700  #991600   primary accent (TEXT + HEADLINE)
```

`--primary` holds **atlas-700**, which is exactly what the guide specifies for
text and headline accents. **It is correct. There is no blocker.** `#fb8469` is a
tint three steps up the ramp, and reading FORM-CATALOG's shorthand "terracotta
#fb8469" as "the primary accent" rather than as one step of a labelled ramp is
what produced the false alarm.

**The founder's response to this is the lesson worth keeping:** *"we have a guide
on the colors that we should be using. So everything is clearly understandable.
It's not rocket science to understand it."* The guide was sitting in
`docs/design-system/TOKENS.md` and in the ramp's own comments the whole time.
**Read the guide before reporting a palette problem.**

**One real error did fall out of it.** `--chart-1` shipped as `#fb8469`, the
tint. A chart bar is a SURFACE, and the guide assigns surfaces to atlas-500.
Corrected to `#e62200`.

**The remaining warm-ink note stands and is genuinely open.** `--foreground` and
`--muted-foreground` sit at hue 28 to 30, the cocoa family that
`01-DESIGN-STANDARD.md` section 4 already flags as a banned hue and routes to
`DECISIONS-NEEDED.md`. The migration inherits it, does not create it, and must
not silently resolve it.

---

## 2. THE TYPE LADDER. The founder's "funds" instruction.

His words, 2026-08-21: *"a big variability in fonts which is traumatic to the
eye, the difference between H1 and the smallest font cannot be so gigantic."*

Measured before the ladder landed: **44 distinct sizes, 8px to 86px, a 10.75x
range, across 2,758 declarations, on two ladders that did not know about each
other.**

The ladder is now ten steps, declared identically in `globals.css` and
`atlas-spine.css`:

| token | px | role |
|---|---|---|
| `--t-mark` | 10 | marks only. **Never a sentence** |
| `--t-micro` | 11 | the floor for anything read |
| `--t-small` | 12 | secondary labels, captions |
| `--t-body` | 14 | body prose, the default |
| `--t-lead` | 16 | a lede, a card's first line |
| `--t-sub` | 18 | subsection heading |
| `--t-head` | 20 | section heading |
| `--t-section` | 24 | chapter opener |
| `--t-focal` | 30 | a section's focal figure |
| `--t-answer` | 48 | the page's one dominant figure. **Nothing is larger** |

### What this means for every shadcn import

**The good news, checked:** shadcn's defaults mostly land ON the ladder already.
`text-xs` = 12, `text-sm` = 14, `text-base` = 16, `text-lg` = 18, `text-xl` = 20,
`text-2xl` = 24, `text-3xl` = 30. Seven of the ten steps are Tailwind defaults.

**The rules:**

1. **Any imported size not on the ladder is changed on import.** `text-[0.8rem]`,
   `text-[13px]`, `text-5xl` and friends do not survive.
2. `verify_type_ladder` is a ratchet over off-ladder sizes and it **counts down
   only**. An import that adds one fails the build. That is the mechanism, not a
   suggestion.
3. **Typefaces are locked: Geist + Space Grotesk**, figures in the figure face at
   weight 500. shadcn imports nothing here, but a copied block might.
4. `--t-answer` is the ceiling. If a shadcnblocks hero wants 72px, it gets 48.

---

## 3. THE PALETTE. One accent, and it is not negotiable.

- **One accent, and the guide names which step does what.** `atlas-500`
  `#e62200` for surfaces (a chart bar, a filled button). `atlas-700` `#991600`
  for text and headline accents. `atlas-300` `#fb8469` is a light TINT, not the
  accent, and mistaking it for one produced a false alarm on 2026-08-21.
  The authority is `docs/design-system/TOKENS.md` plus the ramp's own comments
  in `src/lib/design-tokens.ts`. **Read it before reporting a palette problem.**
- The accent marks **answers only**. Never on hover, never on a "featured" item,
  never decoratively.
- Cool neutrals for everything else. **No green, no amber, no brown, no cream.**
- `--chart-1` is the accent because it is the answer series. `--chart-2..5` are
  the neutral ramp, darkest first, so a series reads as ordered **without a
  second hue entering the page**.
- `verify_palette_membership` and `verify_no_cream` both run in the chain.

**What arrives from shadcn and must be refused:** the default chart palette is
five distinct hues. Using it would put four new colours on the page in one
import. The token bridge already redirects it; do not override the tokens
per-chart to "make the series clearer". Use lightness, not hue.

---

## 4. WHAT WE TAKE, ITEMISED

**TAKE, gratefully:**

- Accessibility and keyboard behaviour. Radix focus traps, roving tabindex,
  escape handling, ARIA wiring. G22 (keyboard reachability) and G23 (24px
  targets) are **both unmeasured** on this site today; Radix gives most of it.
- Axis handling, tick formatting, responsive sizing, tooltip positioning.
- Form validation plumbing: react-hook-form + zod resolvers.
- Table semantics: `scope`, header association, caption handling. 13 files have
  a `<table>` with no `scope` at all.
- The `data-slot` convention, which makes a component targetable without
  reaching into its internals.

**REFUSE, every time:**

| Arrives by default | Why it is refused |
|---|---|
| the 5-hue chart palette | one accent (rule 37) |
| `radius={8}` candy bars | decoration over data; makes short bars read taller |
| legends | direct labels only. Five sources agree, and a legend forces a colour-match a colourblind reader cannot do |
| "Trending up 5.2% this month" footers | **a sentence glued to a chart.** Rule 26: a chart that needs a sentence is wrong, not under-captioned |
| `CardDescription` under every `CardTitle` | rule 14: a subtitle never delivers a verdict, and most should not exist |
| drop shadows | 8 of 11 studied design systems use zero. The local card is a hairline plus the July-3 pair, nothing else |
| gradients, glass, glow | not in the locked system |
| `lucide` icons wholesale | the site has its own 80-id icon vocabulary (`AtlasIconId`). Lucide is allowed only where no atlas icon exists |
| animated chart entry | `isAnimationActive={false}`. Honour `prefers-reduced-motion`; animate only transform and opacity |

---

## 5. THE IMPORT RITUAL

Every component, every time, in this order:

1. **`npx shadcn@latest add <name> --yes`** , and **never `--overwrite`**. It
   clobbered the customised `card.tsx` this session; the variant prop mapping to
   `.atlas-card` was lost and had to be restored from git.
2. **Read the file you just pulled.** Every line. It is now this repo's code.
3. **Strip the refusals** from section 4.
4. **Check every size against the ladder** in section 2.
5. **Check every colour resolves** to an existing token.
6. **`npx tsc --noEmit`**, then the gate chain.
7. **Render it and look at it**, at 1280 and at 375. See `04-GUARDRAILS.md` for
   how, because the usual instrument does not work for client components.

---

## 6. Blind spot, stated

This contract governs what a component **declares**. It cannot tell you whether
the result looks right, whether the density is correct, or whether the founder
will like it. That is a screenshot and a person, in that order.
