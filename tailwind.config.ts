import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import { tailwindColors, fontFamily, elevation, z } from "./src/lib/design-tokens";

// Palette + font-family values are imported from src/lib/design-tokens.ts
// so the design-system module is the single source of truth. Edit the
// values there, not here. Tailwind picks up the changes on next build.

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    /**
     * THE DEFAULT PALETTE IS REPLACED, NOT EXTENDED, 2026-08-17.
     *
     * `theme.extend.colors` leaves Tailwind's own twenty-two colour families
     * sitting underneath the project's, which means DELETING A RAMP DOES NOT
     * RETIRE ITS CLASS NAME. The moss, amber and teal ramps were deleted from
     * design-tokens this session and `bg-teal-700` went on emitting a live
     * rule at `rgb(15 118 110)`, hue 175, because Tailwind's teal was still
     * there. That was found the hard way: merely NAMING the class in a comment
     * put the rule back into the compiled stylesheet, since Tailwind's content
     * scan does not strip comments.
     *
     * So every banned family was one guess away, permanently, and no ramp
     * deletion could ever be complete. Replacing the palette closes it at the
     * source: `bg-emerald-700` now emits NOTHING, which is a visibly broken
     * class in review rather than a silent green on the page.
     *
     * MEASURED BEFORE SWITCHING, because dropping the defaults is destructive
     * if anything still uses them. Across all of src with comments stripped,
     * stock ramp references: **zero**. Every one (emerald 14, rose 3, stone 1,
     * teal 1) was converted earlier in this session, which is what makes the
     * switch safe today and would not have been true this morning.
     *
     * The five bare keywords are re-declared because `theme.colors` drops them
     * with everything else, and they are load-bearing: `white` alone has 278
     * references, plus transparent 21, black 5, current 3. `inherit` is
     * carried for completeness rather than because anything reads it.
     *
     * Semantic CSS-variable aliases stay in `extend.colors` below, which now
     * merges into this instead of into Tailwind's defaults.
     */
    colors: {
      inherit: "inherit",
      current: "currentColor",
      transparent: "transparent",
      white: "#ffffff",
      black: "#000000",
      ...tailwindColors,
    },
    extend: {
      maxWidth: {
        /**
         * THE CONTENT COLUMN, one number for the whole site.
         *
         * The chrome used max-w-7xl (1280px) while the spine design, including
         * the passe-partout in AtlasFrame, was drawn around 1120. With a 1280
         * column there is almost no gutter left for the photograph to show in:
         * at 1440 it came to an 18px strip, and at 1366 and 1280 to nothing,
         * which is not what "visible on the edges of the whole site" means.
         *
         * Named rather than written as max-w-[1120px] at four call sites, so
         * the column and the frame's calc() stops cannot drift apart, and so
         * components keep their no-raw-pixels rule.
         */
        content: "1120px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0.25rem)",
        sm: "calc(var(--radius) - 0.5rem)",
      },
      boxShadow: {
        // Elevation scale from src/lib/design-tokens.ts (SaaS reformation
        // 2026-06-12). Use shadow-subtle / shadow-card / shadow-lift /
        // shadow-modal; never hand-rolled box-shadow values in components.
        subtle: elevation.subtle,
        card: elevation.card,
        lift: elevation.lift,
        modal: elevation.modal,
      },
      /**
       * TWO IMPLICIT DEFAULTS PINNED, because replacing theme.colors above
       * would otherwise change them silently.
       *
       * Tailwind 3 derives `borderColor.DEFAULT` from `colors.gray.200` with a
       * `currentColor` fallback. Dropping the stock palette takes gray with it,
       * so every bare `border` (a width class with no colour class) would have
       * flipped from a light grey to the element's TEXT colour. That is not
       * hypothetical: chips like `rounded-full border text-[11px]` render that
       * way in AccountPreview and the admin queue. `divideColor` inherits from
       * `borderColor`, so the 23 bare `divide-y` uses are covered by the same
       * line.
       *
       * Pinned to `parchment` rather than back to gray-200: #e3e3e3 against
       * #e5e7eb is a difference of two points on each channel, both cool
       * neutrals, and parchment is this site's hairline token with 380-odd
       * call sites. Converging a default onto the token it should always have
       * been is better than restoring a stock value the palette does not hold.
       *
       * `ringColor.DEFAULT` was `rgb(59 130 246 / 0.5)`, which is BLUE, and it
       * survived the palette replacement because the ring plugin hardcodes it
       * rather than reading the palette. It was emitted into the stylesheet on
       * every build of a site whose palette bans blue. No call site relies on
       * it (measured: zero bare `ring` uses, every one names its colour), so
       * this is closing a hole rather than changing a look.
       */
      borderColor: { DEFAULT: tailwindColors.parchment },
      ringColor: { DEFAULT: "rgb(var(--ring) / 0.4)" },
      colors: {
        // Semantic aliases driven by CSS variables on :root in globals.css.
        // Consumers of ui/* primitives use these (bg-primary, text-foreground,
        // border-border) so theming stays centralized.
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        // Atlas palette imported from src/lib/design-tokens.ts — that is
        // the source of truth. Adding new color tokens? Edit there.
        ...tailwindColors,
      },
      keyframes: {
        // Calm pulse for LoadingSkeleton. Slower than Tailwind's default
        // animate-pulse; smaller opacity range so the page does not feel
        // jittery during loads.
        atlasPulse: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "0.85" },
        },
        // shadcn Accordion expand/collapse keyframes.
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Design-system Phase 4 motion vocabulary. Subtle entrance
        // animations consumed by ui/motion/* primitives. Easing
        // matches design-tokens.easing.out so duration/easing read
        // consistently across the site.
        "ds-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "ds-slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        atlasPulse: "atlasPulse 1800ms ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "ds-fade-in": "ds-fade-in 300ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "ds-slide-up": "ds-slide-up 300ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
      fontFamily: {
        // Imported from src/lib/design-tokens.ts. sans = Inter via
        // next/font (body, tabular numbers, stats). display / serif =
        // Newsreader via next/font (H1-H3, hero numbers).
        sans: [...fontFamily.sans],
        serif: [...fontFamily.serif],
        display: [...fontFamily.display],
      },
      zIndex: {
        // Z-index scale from src/lib/design-tokens.ts (the `z` token).
        // Wiring it here makes z-raised / z-sticky / z-dropdown etc. real
        // Tailwind utilities so components stop hand-rolling z-10/z-20 and
        // the layering order stays centralized. Keys mirror the token names.
        raised: `${z.raised}`,
        sticky: `${z.sticky}`,
        dropdown: `${z.dropdown}`,
        overlay: `${z.overlay}`,
        tooltip: `${z.tooltip}`,
        modal: `${z.modal}`,
        toast: `${z.toast}`,
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
