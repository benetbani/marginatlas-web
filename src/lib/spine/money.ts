/**
 * THE ONE MONEY GRAMMAR, as a module of its own (2026-09-26): the spine kit's `usd`, moved here unchanged so a client component
 * (a lever that recomputes a figure in the browser) prints money exactly as the server-drawn page does without pulling the whole
 * kit into the browser. The kit re-exports it; every caller keeps its import.
 *
 * A trillion prints one place, as a million does; billions print whole, as thousands do; under ten thousand the figure prints in
 * full with its thousands separator. One grammar (C29).
 */
export const usd = (v: number) =>
  v >= 1e12
    ? "$" + (v / 1e12).toFixed(1) + "T"
    : v >= 1e9
      ? "$" + Math.round(v / 1e9) + "B"
      : v >= 1e6
        ? "$" + (v / 1e6).toFixed(1) + "M"
        : v >= 1e4
          ? "$" + Math.round(v / 1000) + "K"
          : "$" + Math.round(v).toLocaleString("en-US");
