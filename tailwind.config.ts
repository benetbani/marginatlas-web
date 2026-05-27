import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import { tailwindColors, fontFamily } from "./src/lib/design-tokens";

// Palette + font-family values are imported from src/lib/design-tokens.ts
// so the design-system module is the single source of truth. Edit the
// values there, not here. Tailwind picks up the changes on next build.

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 0.25rem)",
        sm: "calc(var(--radius) - 0.5rem)",
      },
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
        // Plan v30 Phase 3 — calm pulse for LoadingSkeleton. Slower
        // than tailwind's default animate-pulse; smaller opacity range
        // so the page doesn't feel jittery during loads.
        atlasPulse: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "0.85" },
        },
        // Section 1 visual upgrade: shadcn Accordion expand/collapse.
        // Standard shadcn keyframes; consumed by the Accordion primitive.
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        atlasPulse: "atlasPulse 1800ms ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        // Imported from src/lib/design-tokens.ts. sans = Inter via
        // next/font (body, tabular numbers, stats). display / serif =
        // Newsreader via next/font (H1-H3, hero numbers).
        sans: [...fontFamily.sans],
        serif: [...fontFamily.serif],
        display: [...fontFamily.display],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
