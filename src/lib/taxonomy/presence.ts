/**
 * src/lib/taxonomy/presence.ts
 *
 * Does this atlas hold anything real about this trade in this country?
 *
 * Founder ruling, 2026-08-21: "there should be clear thresholds about not
 * allowing certain countries to show all activities because we end up with
 * medical equipment production in Chad (or maybe for such cases we should
 * default to clear disclaimers that such an activity in this country barely
 * exists)."
 *
 * WHAT PRODUCES THAT PAGE, found 2026-08-21. `getCellBySlug` NEVER RETURNS
 * NULL. When the database has no row it calls `synthesizeCell` and returns a
 * fabricated cell stamped `is_synthetic: true`, so the route's own
 * `if (!cell) notFound()` can never fire. Every country crossed with every
 * trade renders a page, with a title, a hero figure and structured data. That
 * is the machine, and it is one function call.
 *
 * ============================ THE HONESTY LINE ============================
 *
 * This module deliberately does NOT claim to know whether a business is rare in
 * a country. It cannot: nothing in this repository measures the economy of
 * Chad. `n_enterprises` looks like it would answer the question and does not,
 * because `fill_defaults` writes a hardcoded 100 whenever it is missing, so a
 * firm count of 100 is a placeholder wearing the costume of evidence. Building
 * a threshold on it would be the exact defect this whole effort is removing.
 *
 * So the three states below are about WHAT THE ATLAS HOLDS, not about the
 * world, and the reader-facing copy must say the same. "We hold no measured
 * figures for this trade here" is true and checkable. "This barely exists here"
 * is a claim about Chad that this codebase cannot support, and it must not be
 * printed even though it is the more satisfying sentence.
 *
 * ======================= WHY IT FAILS OPEN, LOUDLY =======================
 *
 * The first draft of the plan said an unknown pair should resolve to "absent",
 * on the reasoning that showing nothing is safer than showing something. That
 * is BACKWARDS here, and the reason is measured: cell lookups exceed their 4s
 * budget from a developer machine to the database region, and a timeout is
 * indistinguishable from an empty result at the call site. A presence check
 * that hides on uncertainty would let one slow afternoon unpublish the site,
 * and it would do it silently, page by page.
 *
 * Therefore presence is read from a DURABLE BUILD-TIME MANIFEST, never from a
 * live query, and an unknown pair resolves to `measured` , publish it. The cost
 * of the wrong answer is asymmetric: publishing one thin page is a blemish,
 * unpublishing a thousand real ones is an outage.
 *
 * THE MANIFEST IS NOT YET GENERATED, and until it is this module reports
 * `measured` for everything, which is exactly today's behaviour. Generating it
 * needs a working connection to the database and cannot be done from a machine
 * whose queries time out. `scripts/gen_presence_manifest.ts` is the generator.
 */
import manifestJson from "./presence_manifest.json";

/**
 * What the atlas holds for one country crossed with one trade.
 *
 * - `measured`  a trusted local measurement. Publish normally.
 * - `modelled`  a row exists but it is extrapolated, country-level, or the
 *               estimated tier. Publish, with the note in ThinMarketNote.
 * - `none`      nothing at all; anything rendered would be synthesized whole.
 *               Do not publish.
 */
export type Presence = "measured" | "modelled" | "none";

interface PresenceManifest {
  /** ISO date the manifest was generated, or null when it never has been. */
  generated_at: string | null;
  /**
   * `"gb"` -> `{ restaurants: "measured", ... }`. A pair absent from the
   * manifest is UNKNOWN, not absent: see the fail-open note in the header.
   */
  countries: Record<string, Record<string, Presence>>;
}

const MANIFEST = manifestJson as unknown as PresenceManifest;

/**
 * A manifest holding fewer than this many countries is treated as ungenerated
 * rather than as a finding. Chosen because the atlas claims coverage in dozens
 * of countries, so a manifest with two in it is a broken generation run, and
 * acting on it would unpublish nearly everything.
 */
const MIN_CREDIBLE_COUNTRIES = 5;

/** True when the manifest is real enough to act on. */
export function isManifestUsable(): boolean {
  return (
    MANIFEST.generated_at != null &&
    Object.keys(MANIFEST.countries ?? {}).length >= MIN_CREDIBLE_COUNTRIES
  );
}

/**
 * What the atlas holds for this pair.
 *
 * @param country   ISO2, any case.
 * @param activity  The activity id (not the slug).
 */
export function presenceOf(country: string, activity: string): Presence {
  /* FAIL OPEN. No manifest, or one too small to believe, means every pair
     publishes exactly as it does today. This is the branch that runs until the
     manifest is generated, and it is deliberately the same as no change. */
  if (!isManifestUsable()) return "measured";

  const forCountry = MANIFEST.countries[country.toLowerCase()];
  /* An unknown COUNTRY is a gap in the manifest, not a statement about the
     country. Publish. */
  if (!forCountry) return "measured";

  const held = forCountry[activity];
  /* An unknown PAIR inside a known country IS meaningful: the generator walks
     every activity for every country it lists, so a missing pair means the
     query ran and found nothing. */
  return held ?? "none";
}

/** Convenience: may this pair be published as a page at all? */
export function mayPublish(country: string, activity: string): boolean {
  return presenceOf(country, activity) !== "none";
}

/** Convenience: does this pair need the honest note above the fold? */
export function needsThinMarketNote(country: string, activity: string): boolean {
  return presenceOf(country, activity) === "modelled";
}

/** For the gate and for reporting. */
export function manifestGeneratedAt(): string | null {
  return MANIFEST.generated_at;
}
