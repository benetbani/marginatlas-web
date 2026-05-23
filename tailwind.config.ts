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
          50: "#FAFAFA",   // off-white (kept for back-compat, was warm)
          100: "#F0F0F0",  // soft gray — alt background (was warm)
          200: "#E5E5E5",  // borders, dividers (was warm)
          300: "#D4D4D4",
          500: "#737373",
          600: "#525252",
          700: "#3A3A3A",  // matches picker slot 4
          800: "#1A1A1A",
          900: "#000000",  // PURE BLACK — text primary (was #1A1A1A)
        },
        // Plan v31 starter v2 — palette locked from founder color-picker
        // screenshot. Five colors: pure white, near-white surface,
        // vermillion accent (#D73A14), dark gray, black. SaaS-modern,
        // not editorial-warm.
        atlas: {
          50:  "#FFF1ED",  // pale wash
          100: "#FED7C6",  // subtle highlight background
          200: "#FCAA8B",  // light vermillion
          300: "#F87850",  // tertiary chips
          400: "#E94E20",  // mid vermillion
          500: "#D73A14",  // PRIMARY ACCENT — vermillion (from color picker)
          600: "#B82F0F",  // hover-pressed
          700: "#952509",  // headline accents
          800: "#6F1A06",  // deepest
          900: "#491004",  // darkest, footer accents
        },
        // cream tokens become pure-white-to-light-gray surfaces.
        // cream.50 = page background; cream.100 = card surface;
        // cream.300 = borders. All from the picker's neutral track.
        cream: {
          50:  "#FFFFFF",  // page background — PURE WHITE
          100: "#F5F5F5",  // primary card surfaces (slot 2 in picker)
          200: "#EAEAEA",  // hover surface on tiles
          300: "#DDDDDD",  // soft borders
          400: "#BBBBBB",
          500: "#888888",
        },
        parchment: "#DDDDDD", // border token — neutral gray
        // Dark gray secondary slot from the picker — surfaces a calmer
        // text tone for muted labels and secondary chrome.
        graphite: "#3A3A3A",
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
        // Plan v31 starter v3 — cocoa was the warm "cream brown" body
        // text token. Founder feedback: that warm cocoa was still
        // pulling Substack feel into the page on every text element
        // that used text-cocoa-700/80, border-cocoa-300, etc. Replaced
        // with neutral grays from the picker. ~120 components shift
        // automatically without per-file edits.
        cocoa: {
          50:  "#FAFAFA",  // was #FBF7F2 warm
          100: "#F0F0F0",  // was #F2E8DC warm
          300: "#BBBBBB",  // was #C9B59A warm sand
          500: "#737373",  // was #A1856A warm mid
          700: "#3A3A3A",  // was #78350F warm dark — now picker slot 4
          900: "#171717",  // was #451A03 — now near black
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
