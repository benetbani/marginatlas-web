/**
 * src/components/spine2/figures.ts
 *
 * The minimal figure-registry contract (BATCH-C, take). The registry itself
 * lands at page assembly , it is the set of figures the page already carries,
 * the same set the number gate reads , so a verdict chip can only ever
 * restate a number that appears above it. A chip that states a number
 * appearing nowhere on the page is the page contradicting itself at the
 * exact moment it asks to be believed.
 *
 * For now the contract is deliberately minimal: an id-to-display map plus one
 * resolver. Chips with unresolvable ids DO NOT render, and the resolver
 * console.errors in dev so the miss is loud before the build gate exists.
 */

export type FigureId = string;

export type FigureRegistry = Record<string, string>;

/**
 * Resolve a chip's figureId against the page's registry. Returns the display
 * string, or null when the id resolves to nothing , the chip must not render
 * (M9), and in dev the miss is reported.
 */
export function resolveChip(reg: FigureRegistry, figureId: FigureId): string | null {
  const display = reg[figureId];
  if (display == null || display === "") {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `figures: chip figureId "${figureId}" does not resolve against the page ` +
          "figure registry; the chip will not render.",
      );
    }
    return null;
  }
  return display;
}
