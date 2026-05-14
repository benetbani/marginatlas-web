import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Per CLAUDE.md design rules — Tesseract Stock Agent palette
        ink: {
          50: "#F7FAFC",
          900: "#0A2540",
          800: "#093877",
          700: "#153457",
        },
        atlas: {
          50: "#B7F6F8",
          100: "#7EE3EB",
          200: "#7BE2E6",
          400: "#35BFD0",
          500: "#36C6CC",
          600: "#16AEB5",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
