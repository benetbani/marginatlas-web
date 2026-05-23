import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Margin Atlas palette — warm-earth-tone family.
        // Expanded Plan v3.0: more in-family tones for richer surfaces, no
        // cool colors except a single sparse deep teal. Aquamarine is
        // reserved for the founder's other product and never appears here.
        ink: {
          50: "#FAFAF7",   // warm off-white — original page bg (kept for back-compat)
          100: "#F0F0EA",  // soft warm gray — alt background
          200: "#E5E5E0",  // borders, dividers
          300: "#D4D4CE",
          500: "#737373",
          600: "#525252",
          700: "#3F3F3D",
          800: "#27272A",
          900: "#1A1A1A",  // rich graphite — text primary
        },
        // Plan v31 starter — atlas accent shifted from burnt amber to brick
        // red. Founder direction: "terracotta but shifted more to red...
        // some sort of dark brick color with a red tint." This single
        // token change ripples across every cell page, button, link,
        // sector chip, waterfall accent, and the world map highlight.
        atlas: {
          50:  "#FEF2F2",  // pale wash (replaces #FEF7ED amber wash)
          100: "#FEE2E2",  // subtle highlight
          200: "#FECACA",  // light brick
          300: "#FCA5A5",  // tertiary chips
          400: "#EF4444",  // mid brick
          500: "#B91C1C",  // PRIMARY ACCENT — true brick red (was burnt amber #D97706)
          600: "#991B1B",  // deeper brick (hover-pressed)
          700: "#7F1D1D",  // headline accents (was #9A3412)
          800: "#681414",  // deepest brick
          900: "#450A0A",  // darkest, footer accents
        },
        // Plan v31 starter — cream becomes the SURFACE color, not the
        // page background. New page bg is pure off-white below.
        // These tokens kept for back-compat; cards still use them.
        cream: {
          50:  "#FAFAFA",  // page background — neutral warm-tinted white
          100: "#F5F5F4",  // primary card surfaces (lighter than before)
          200: "#EEEDEC",  // hover surface on tiles
          300: "#E5E5E4",  // soft borders
          400: "#D6D5D3",
          500: "#A8A7A4",
        },
        parchment: "#E5E5E4", // border token — neutral gray, no warm tint
        // Moss — positive deltas (replaces harsh emerald)
        moss: {
          50:  "#F7FCE8",
          100: "#ECFCCB",  // badge background
          300: "#BEF264",
          500: "#65A30D",  // chart positive area
          700: "#3F6212",  // text for positive YoY
          900: "#1A2E05",
        },
        // Clay — negative deltas (replaces harsh rose)
        clay: {
          50:  "#FEF2F2",
          100: "#FEE2E2",  // badge background
          300: "#FCA5A5",
          500: "#DC2626",  // mid clay
          700: "#991B1B",  // text for negative YoY
          900: "#450A0A",
        },
        // Cocoa — deep text / borders (alternative to pure graphite)
        cocoa: {
          50:  "#FBF7F2",
          100: "#F2E8DC",
          300: "#C9B59A",
          500: "#A1856A",
          700: "#78350F",  // section dividers, deep card borders
          900: "#451A03",  // footer text, attribution lines
        },
        // Sparse deep teal — single signature data accent, used <5% of surface
        teal: {
          50:  "#F0FDFA",
          500: "#0F766E",
          600: "#0D5F58",
          700: "#0F766E",
        },
      },
      keyframes: {
        // Plan v30 Phase 3 — calm pulse for LoadingSkeleton. Slower
        // than tailwind's default animate-pulse; smaller opacity range
        // so the page doesn't feel jittery during loads.
        atlasPulse: {
          "0%,100%": { opacity: "0.55" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        atlasPulse: "atlasPulse 1800ms ease-in-out infinite",
      },
      fontFamily: {
        // Plan v30 Phase 3 typography reset — Inter via next/font for
        // every sans-serif use (body text, numbers in tables, stats,
        // waterfall lines). Tabular-nums enabled where numbers render.
        sans: [
          "var(--font-sans)",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: [
          "var(--font-display)",
          "Georgia",
          "ui-serif",
          "serif",
        ],
        // Newsreader via next/font — warm bookish editorial serif used
        // for H1/H2/H3 and the single hero number per page.
        display: [
          "var(--font-display)",
          "Georgia",
          "ui-serif",
          "serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
