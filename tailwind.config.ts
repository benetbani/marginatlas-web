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
        // Primary spine — burnt amber + a wider stop range
        atlas: {
          50: "#FEF7ED",   // lightest amber wash for hero gradients
          100: "#FDE9CC",  // subtle highlight background
          200: "#FDBA74",  // light amber
          300: "#FBBF24",  // tertiary chips, callout fills
          400: "#F59E0B",  // mid amber
          500: "#D97706",  // primary accent — burnt amber (unchanged)
          600: "#C2410C",  // deeper terracotta (unchanged)
          700: "#9A3412",  // headline accents
          800: "#7C2D12",  // deep amber for hover-pressed
          900: "#5C1E0B",  // darkest amber, footer accents
        },
        // Sand / parchment layers — replace flat white-on-white
        cream: {
          50:  "#FEFBF6",  // warmer page background
          100: "#F8F2E4",  // primary card surfaces
          200: "#EEE6D2",  // hover surface on tiles
          300: "#E8DDC7",  // soft borders
          400: "#D9C9A8",
          500: "#C2AE85",
        },
        parchment: "#E8DDC7", // alias used for coverage badges + borders
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
