/**
 * src/lib/spine/provenance.ts
 *
 * WHERE A PRINTED FIGURE CAME FROM, ON THE FIGURE (plan 06, task B5, 2026-10-04). The truth pass replaced a hand-typed London
 * model, a filled revenue constant, a parent trade's bill, a world median over interpolated countries and a modelled London with
 * figures read from registers and laws; this makes each of those figures say so in the page itself: `data-src` names the file
 * and the key it was read from (`uk/registers/turnover.json:restaurants:E12000007`), `data-kind` what was done to it, in the
 * register ledger's own four words (E:/atlas/registers/uk/tables/ledger.json `kinds`):
 *  - "counted": taken straight from an official register or table;
 *  - "worked out": our arithmetic on official figures, the method stated where the figure is built (a median read from band
 *    counts, a tax computed by the law engine);
 *  - "looked up": a price, a rule or a published count read on a named page on a date;
 *  - "estimate": our judgement where no register exists (the engine's break-even and keeps, a cost at the city's prices).
 *
 * The figure components spread `provAttrs(prov)` on the element that carries the `fig` class (kit.tsx `Fig`, the hero's answer,
 * the answer card's figure), so scripts/harness/check_provenance.mjs can count, page by page, the figures that still say nothing
 * about where they came from; that count is a ratchet and only falls.
 */
export type ProvenanceKind = "counted" | "worked out" | "looked up" | "estimate";
export type Provenance = { src: string; kind: ProvenanceKind };

/** The two attributes for a figure's element, or nothing when the figure carries no provenance. */
export function provAttrs(prov: Provenance | null | undefined): { "data-src"?: string; "data-kind"?: ProvenanceKind } {
  return prov ? { "data-src": prov.src, "data-kind": prov.kind } : {};
}

/** A register slice's key: `uk/registers/<file>:<key>[:<geography>]`. */
export const registerSrc = (file: string, key: string, geography?: string): string =>
  `uk/registers/${file}:${key}${geography ? `:${geography}` : ""}`;
