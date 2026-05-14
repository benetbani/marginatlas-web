import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Margin Atlas palette — "Bloomberg Terminal that doesn't hate you"
        // Warm off-white background, rich graphite text, burnt amber accent, sparse deep teal.
        ink: {
          50: "#FAFAF7",   // warm off-white — main background
          100: "#F0F0EA",  // soft warm gray — alt background
          200: "#E5E5E0",  // borders, dividers
          300: "#D4D4CE",
          500: "#737373",
          600: "#525252",
          700: "#3F3F3D",
          800: "#27272A",
          900: "#1A1A1A",  // rich graphite — text primary
        },
        atlas: {
          50: "#FEF3E7",   // cream tint
          100: "#FED7AA",  // peach
          200: "#FDBA74",  // light amber
          300: "#FB923C",
          400: "#F59E0B",  // amber
          500: "#D97706",  // primary accent — burnt amber
          600: "#C2410C",  // deeper terracotta
          700: "#9A3412",
        },
        teal: {
          // Sparse premium accent — only for "Pro/Enterprise" moments
          50: "#F0FDFA",
          500: "#0F766E",  // deep teal
          600: "#0D5F58",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        serif: [
          "Tiempos",
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
