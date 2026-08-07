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
  /* No first person in either of these, and that is not a style preference.
     BRAND.md calls the tier vocabulary "the most repeated thing on the site"
     and the site's spine, and two of the three definitions were saying "we".
     The wording below is BRAND.md's own: "arithmetic on published figures,
     shown so it can be checked" and "the shape is right, the level is not
     certain". A synonym here breaks a reader's ability to compare two pages. */
  built: {
    label: "Built",
    means: "it is arithmetic on published figures, shown so it can be checked.",
  },
  thin: {
    label: "Thin",
    means:
      "nobody publishes it, so the page gives a range and says so rather than inventing a number.",
  },
};
