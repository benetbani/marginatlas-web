# Design-System Guidelines

**The authority for any UI work on Margin Atlas.**

Last revised 2026-05-27, shipping with the v1 design system. Read this
before adding a component, before adding a token, before adding a
className that feels like an exception. If you find yourself reaching
past this document, that's the signal to update it instead of working
around it.

---

## 1. The mental model

The design system is **what's documented and rendered on `/_design`**.
If it isn't there, it isn't a primitive yet — it's either application
code or it's debt waiting for a refactor.

Three layers, top down:

| Layer | Lives in | What's here |
|---|---|---|
| **Application** | `src/app/`, `src/components/sections/`, `src/components/empty/`, page-specific files in `src/components/` | Pages, sections, domain-specific compositions. Consumes the system. Does NOT define new tokens. |
| **Domain primitives** | `src/components/` (root level files like `CoverageIndicator`, `KeyBenchmarkBanner`) | Atlas-specific widgets that wrap system primitives with business semantics. Reuse the system; never bypass it. |
| **System primitives** | `src/components/ui/` and `src/components/ui/motion/` | The catalogued, documented, accessible, themable foundation. Buttons, pills, skeletons, money, etc. Everything composes from tokens. |
| **Tokens** | `src/lib/design-tokens.ts` | The atomic values. Color, type, spacing, radius, elevation, motion, z-index. Single source of truth — `tailwind.config.ts` imports from here. |

Movement is **upward only**: domain wraps system, application wraps
domain. A system primitive that imports from `src/components/sections/`
is broken architecture, full stop. The `verify_layering` gate enforces
the application-to-data boundary; we trust authorial judgment for
domain-to-system but flag it in PR review.

---

## 2. Decision tree: do I need a new primitive?

```
Want to build something?
│
├─ Is it on /_design already?
│   └─ YES → use it. End.
│
├─ Can two existing primitives compose into what you need?
│   └─ YES → compose them in your application code. End.
│       (e.g. <EmptyState> + <InlineLink> for a "no data, try X" panel)
│
├─ Is the visual unique to one page?
│   └─ YES → keep it page-local in src/components/sections/.
│       Do NOT add it to ui/. End.
│
├─ Will three or more independent surfaces use it?
│   └─ NO  → reconsider; build it in the page that needs it first,
│           promote to ui/ only when the third consumer appears.
│   └─ YES → it's a primitive. Build it in ui/.
│              See §4 for what every primitive must satisfy.
```

The "third consumer" rule is the only one worth memorizing. Premature
primitives ossify the wrong API. Lived-in code is easier to refactor
than scattered abstractions.

---

## 3. Tokens versus arbitrary values

**The rule:** if you're typing a hex code, a pixel value, a duration in
ms, an easing curve, or a z-index number, **stop**. Open
`src/lib/design-tokens.ts` and find the token. If the token doesn't
exist, ask whether you should add one (most cases) or whether your
value is one-off enough to deserve an inline override (rare).

### Concretely

| You're writing | Reach for |
|---|---|
| `text-[#D73A14]` | `text-atlas-500` |
| `bg-[#F5F5F5]` | `bg-cream-100` |
| `style={{ borderRadius: 16 }}` | `rounded-lg` (which resolves to `--radius` = 16px) |
| `style={{ boxShadow: "0 1px 3px..." }}` | `style={{ boxShadow: elevation.card }}` from `@/lib/design-tokens` |
| `transition: all 0.2s ease` | `transition-colors` (built-in) or `style={{ transition: TRANSITION.base }}` from `@/lib/motion` |
| `style={{ zIndex: 9999 }}` | `style={{ zIndex: z.modal }}` from `@/lib/design-tokens` |

### When inline overrides ARE acceptable

- One-off width/height for a specific layout shape (e.g. `width="220px"` on a Skeleton inside a custom hero)
- Decorative SVG inline styles (gradients, masks)
- Page-specific spotlight effects that don't reuse

If the override appears twice, it's a token in waiting. Add it to
`design-tokens.ts` and migrate both sites.

---

## 4. What every primitive must satisfy

A primitive lives in `src/components/ui/`. Before it gets there:

### 4.1 File shape

```tsx
/**
 * src/components/ui/<name>.tsx
 *
 * One-paragraph intent: what the primitive is for, when to reach
 * for it, when to use a sibling instead. Link to the relevant
 * ui-ux-pro-max priority section (§1 accessibility, §2 touch, etc.)
 * when applicable.
 *
 * Design system Phase X, YYYY-MM-DD.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const xVariants = cva("base classes", {
  variants: { ... },
  defaultVariants: { ... },
});

export interface XProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof xVariants> {
  // explicit props with JSDoc on each
}

const X = React.forwardRef<HTMLElement, XProps>(
  ({ className, ...props }, ref) => (
    <element ref={ref} className={cn(xVariants({ ... }), className)} {...props} />
  ),
);
X.displayName = "X";

export { X, xVariants };
```

Mandatory:
- `forwardRef` for any element that might receive a parent ref
- `displayName` set explicitly (React DevTools, error stacks)
- `cva` for any variant-bearing primitive (use `Button` as the reference)
- Named export, not default (consistent with shadcn pattern)
- The variants object exported alongside (lets consumers extend or compose)

### 4.2 Accessibility floor (WCAG AA)

Every primitive must satisfy:

- **Contrast**: 4.5:1 for body text on its surface, 3:1 for large text and non-text borders. Use a contrast checker on every variant before shipping. The atlas-700 / cream-50 pair passes AA at all sizes; verify if you stray.
- **Focus**: every interactive primitive renders `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2`. Never remove a focus ring; if it's visually wrong, the rest of the design is wrong, not the ring.
- **Keyboard**: every interactive element reachable by Tab in source order; Escape dismisses dialogs/popovers; arrow keys for radix-based components.
- **Roles**: `role="status"` on loading regions (polite); `role="alert"` on errors (assertive). Don't hand-roll either; use the primitives that already set them (`Spinner`, `ErrorState`).
- **Labels**: icon-only buttons MUST have `aria-label`. Real headings (`<h1>`–`<h4>`) for any title, never a styled div. `aria-hidden="true"` on icons whose meaning is duplicated by adjacent text.
- **Reduced motion**: any animation must include `motion-reduce:animate-none` (Tailwind) or check `prefers-reduced-motion` via media query.

### 4.3 State coverage

A primitive isn't done until it handles:

- Default / hover / focus / active / disabled
- Loading (where applicable — buttons, forms)
- Empty (where applicable — lists, data displays)
- Error (where applicable — fetches)

If you can't articulate what the disabled state looks like, you haven't
finished the primitive.

### 4.4 Catalog story

Add a section to `src/app/_design/page.tsx` showing the primitive in
every variant and every state. The catalog IS the documentation. If
the catalog wouldn't show it cleanly, the primitive's API is too
complicated and needs simplification before shipping.

---

## 5. Props API conventions

### Names

| Concept | Prop name | Type |
|---|---|---|
| Visual tone variant | `variant` | string literal union |
| Size | `size` | `"sm" \| "md" \| "lg"` (md is default) |
| Element override (polymorphic) | `as` | `React.ElementType` |
| Wrap any element | `asChild` | `boolean`; uses Radix Slot |
| Override label for assistive tech | `srLabel` or `aria-label` | string |
| Heading level | `headingLevel` | `2 \| 3 \| 4` |
| Loading flag | `loading` | `boolean` |
| Disabled flag | `disabled` | inherited from element |
| Click handler | `onClick` | inherited |

Never invent a new prop name for a concept that already has one
above. New primitive that takes a tone? It's `variant`, not `kind` /
`flavor` / `type`.

### Slot patterns

Three patterns. Pick by intent:

1. **Single child** — primitive renders its children:
   `<Card>{...}</Card>`. Trivial.

2. **Composed parts** — primitive has named subparts:
   `<Card><CardHeader><CardTitle/></CardHeader></Card>`. Use when
   the primitive has structural slots that consumers need to control.
   Match the existing `Card` / `CardHeader` / `CardContent` pattern.

3. **`asChild` polymorphism** — primitive merges its styling into
   whatever child you pass. Built on Radix Slot. Use when a primitive
   needs to BE a link / button / other element while keeping its
   styles. `Button` and `Pill` both support `asChild`. Don't add it
   speculatively; only when a consumer actually needs it.

### What goes in the props vs. composition

If a configuration affects ONE aspect of the primitive, it's a prop.
If it changes the SHAPE of the primitive (renders extra elements,
restructures the layout), it's almost always a composed subpart.

| Configuration | Prop or composition |
|---|---|
| Color / size / tone | prop (`variant`, `size`) |
| Whether to show a trailing icon | prop (`showExternalIcon`) |
| Custom icon | prop (`icon` ReactNode) |
| Extra section beneath the body | composition (extend with subparts, do NOT add `extraSection` props) |
| Loading state | prop (`loading`) |
| Two completely different layouts | two primitives, not one with `layout="..."` |

---

## 6. Motion

Defaults that consumers should rarely override:

- Duration `fast` (150ms) for hover / focus
- Duration `base` (200ms) for state transitions (accordions, dropdowns)
- Duration `slow` (300ms) for enter / exit
- Easing `out` for entering, `in` for exiting (exit should be 60-70% of enter duration)
- `spring` for natural-feel interactions (pressed buttons, toasts)

Hard rules:

- Animate `opacity` and `transform` only. Never width / height / top / left.
- Every motion primitive applies `motion-reduce:animate-none`.
- One or two animated elements per view max. Decorative motion is noise.
- Stagger lists at 30-50ms per item, cap at 480ms total.

Pick from `src/components/ui/motion/*` first (`FadeIn`, `SlideUp`,
`Stagger`). Only reach for raw CSS keyframes when you have a documented
reason none of those fits.

---

## 7. Anti-patterns we don't ship

These are documented because they kept appearing in PR review:

### 7.1 The "styled div" headline

```tsx
// Wrong
<div className="text-2xl font-semibold">Section title</div>

// Right
<h2 className="text-2xl font-semibold">Section title</h2>
```
Headings are real `<h2>` / `<h3>` / `<h4>`. Screen readers and AI
crawlers both depend on the outline. The visual class is incidental.

### 7.2 Inline hex codes

```tsx
// Wrong
<span style={{ color: "#952509" }}>...</span>

// Right
<span className="text-atlas-700">...</span>
```
If it's not in `colors`, ask why. Then either add a token or fix the
intent.

### 7.3 The mystery em-dash

```tsx
// Wrong (also fails the prebuild gate)
<p>Atlas is a small-business benchmark — it covers ~150 countries.</p>

// Right
<p>Atlas is a small-business benchmark. It covers ~150 countries.</p>
```
Em-dashes are banned in user-visible source (R-020). Use period,
comma, or colon. JSDoc + inline code comments are exempt; the
`verify_no_em_dashes` gate catches the rest.

### 7.4 The orphan Skeleton

```tsx
// Wrong — Skeleton renders without a role, screen readers don't know
// anything is loading
<Skeleton variant="block" />

// Right — parent owns the role/aria-live, sr-only label, lays out
// the shape composition
<div role="status" aria-live="polite">
  <span className="sr-only">Loading benchmark…</span>
  <Skeleton variant="block" />
</div>
```
Skeleton is the SHAPE. The PARENT owns the status semantics. Use
`LoadingSkeleton` for canonical page-layout skeletons that bundle
both.

### 7.5 The "good enough" focus ring

Removing or suppressing focus rings to "clean up the design" is a
WCAG fail. The ring exists for keyboard users. Make the rest of the
design accommodate it.

### 7.6 Speculative `variant="..."` proliferation

Three variants are usually right. Seven means you've baked design
decisions into your API that should have been composition. If a
primitive has more than five non-default variants, it's two
primitives.

---

## 8. Pre-merge checklist

Before requesting review on a PR that touches `src/components/ui/`:

- [ ] tsc clean: `npx tsc --noEmit`
- [ ] Prebuild clean: `npm run prebuild` (or `npm run prebuild:serial` if the parallel runner is flaky on your machine)
- [ ] New / changed primitive has a story on `/_design`
- [ ] Variants visible in catalog
- [ ] Loading / empty / error states demonstrated where applicable
- [ ] Focus ring visible at default zoom
- [ ] Contrast AA verified against every surface the primitive renders on
- [ ] Reduced-motion preview tested (browser devtools → emulate `prefers-reduced-motion: reduce`)
- [ ] Mobile preview at 375px width
- [ ] No raw hex / pixel / ms values; all from `design-tokens.ts` or its derivatives
- [ ] No em-dashes in user-visible copy
- [ ] No new `cva` enum value without a catalog example

---

## 9. Where everything lives (file map)

| Concern | File / dir |
|---|---|
| Plan + roadmap | `docs/design-system/PLAN.md` |
| Current inventory | `docs/design-system/INVENTORY.md` |
| Token reference | `docs/design-system/TOKENS.md` |
| This guidelines doc | `docs/design-system/GUIDELINES.md` |
| Typed tokens (single source of truth) | `src/lib/design-tokens.ts` |
| Motion helpers (TRANSITION, stagger) | `src/lib/motion.ts` |
| Tailwind config (imports tokens) | `tailwind.config.ts` |
| Global CSS variables (shadcn aliases) | `src/app/globals.css` |
| Decorative-utility classes | `src/styles/homepage-visual-tokens.css` |
| System primitives | `src/components/ui/` |
| Motion primitives | `src/components/ui/motion/` |
| Catalog page | `src/app/_design/page.tsx` (ADMIN_KEY-gated) |
| Legacy state components (delegate to ui/) | `src/components/EmptyState.tsx`, `LoadingSkeleton.tsx`, `empty/*` |
| Domain primitives | `src/components/CoverageIndicator.tsx`, `TurnoverBandChip.tsx`, etc. |

---

## 10. When this document is wrong

If you find yourself fighting the guidelines, that's a signal — either
the design system is missing a piece, or this document hasn't kept up
with reality. Don't work around it silently:

1. Open a PR that updates this document alongside the change.
2. Explain in the PR why the existing rule was wrong.
3. Add the new rule, the new primitive, or the new exception with a
   dated note explaining its scope.

The design system is a living artifact. The cost of letting it drift
is everyone else having to guess what's "blessed" and what's freelance.
The cost of keeping it current is one PR comment per change.
