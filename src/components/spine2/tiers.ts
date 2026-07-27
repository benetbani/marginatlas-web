/**
 * src/components/spine2/tiers.ts
 *
 * The confidence tier: ONE enum and ONE copy constant, consumed by TierPill,
 * the Ledger, the trust strip's tally, and the page-level definitions note.
 * PORT-CONTRACT M7: the pill and the definition sentence must come from the
 * same source so a tier added or renamed can never desync them.
 *
 * Copy is verbatim from the mockups' definitions paragraph (cell §18 /
 * city §16 / country §19).
 */

export type Tier = "measured" | "built" | "thin";

export const TIERS: readonly Tier[] = ["measured", "built", "thin"] as const;

export const TIER_COPY: Record<Tier, { label: string; means: string }> = {
  measured: {
    /* useless-tile-ok: provenance tier label, the ledger's How-solid pill, not a tile value */
    label: "Measured",
    means: "it comes from a published record.",
  },
  built: {
    label: "Built",
    means: "we compute it from published records and show the arithmetic.",
  },
  thin: {
    label: "Thin",
    means:
      "nobody publishes it, so we give a range and say so rather than inventing a number.",
  },
};
