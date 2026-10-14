/**
 * THE SIGNAL'S FIVE COLOURS (plan 2026-10-13 country-page-journey, Task 2; spec section 4; his ruling of 2026-10-13, "Green to red, only in the
 * signal"), declared once and read by ./Signal.tsx alone: the one named exception to the terracotta-and-greys palette
 * (scripts/verify_palette_membership.mjs, SIGNAL_ALLOW, names this file). On white 7.87, 5.13, 4.92, 5.62 and 11.04 to 1, each 3:1 or more on
 * every ground the site paints (WCAG 1.4.11). The triangle's fill and nothing else: never text, a bar, a row tint or a chart.
 */
export const SIGNAL_FILL = { 1: "#1b5e20", 2: "#2e7d32", 3: "#8a6d00", 4: "#c62828", 5: "#7f0000" } as const;
