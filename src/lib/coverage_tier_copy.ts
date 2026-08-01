/**
 * src/lib/coverage_tier_copy.ts
 *
 * ONE home for the user-facing gloss of each coverage tier.
 *
 * WHY THIS EXISTS. The four tier words are derived in exactly one place
 * (deriveCoverageTier in src/components/CoverageIndicator.tsx), but what each
 * word MEANS was being written out independently everywhere it was published.
 * That drifted on its very first duplication: the social card's gloss for
 * `estimated` read "built from country and activity averages", dropping the
 * word "indicators" that /api/export-csv carries. Those are not the same
 * claim. "Country indicators" means derived from country-level measures such
 * as output per head and urbanization; "country averages" means an average
 * taken across countries. The card was making the weaker, wrong claim on the
 * surface read by people who never open the page.
 *
 * Same fact, two places, drifting, is this project's most expensive defect
 * class. So the short and long forms live here and every publisher reads them.
 *
 * TWO FORMS, ONE CLAIM:
 *   short , a full sentence for a constrained surface (a social card).
 *   long  , the fragment that follows the tier name in a key or legend
 *           (the CSV export's header block).
 * They may differ in length. They may not differ in what they assert.
 *
 * NOT THE LONGEST FORM. src/app/(site)/about-data/page.tsx carries the
 * published prose for each tier, and it is allowed to be fuller than either
 * form here: it is the page HowWeKnowThis links to and has room to name the
 * actual inputs. The rule runs one way: nothing here may contradict it.
 *
 * WHERE THIS LIVES, AND WHY IT IS NOT IN CoverageIndicator.tsx. Both current
 * consumers are route handlers, not renderers. Keeping the copy in a leaf
 * module with no runtime imports means a consumer can take the vocabulary
 * without pulling a React component, and through it next/link, into its
 * bundle. The CoverageTier import below is type-only and erases at compile,
 * so this module has no runtime dependency at all. That matters on
 * src/app/og/cell, which has already paid once for an import chain it did not
 * inspect: a transitive 2.8 MB JSON pushed it past the Vercel Edge 1 MB cap
 * and blocked every deploy for about three weeks.
 */
import type { CoverageTier } from "@/components/CoverageIndicator";

export type TierCopy = {
  /** One sentence, tier word first. For cards and other tight surfaces. */
  short: string;
  /** Fragment that follows the tier name in a legend or column key. */
  long: string;
};

export const COVERAGE_TIER_COPY = {
  measured: {
    short: "Measured: firms counted in this place and activity",
    long: "direct measurement of firms in this place and activity",
  },
  regional: {
    short: "Regional: a broader benchmark applied to this place",
    long: "a broader benchmark applied to this place",
  },
  estimated: {
    short: "Estimated: built from country indicators and activity averages",
    long: "built from country indicators and activity averages",
  },
  modeled: {
    // The reconciling clause is load-bearing and must not be shortened away.
    // On a card this sentence sits directly beneath a printed figure, so "no
    // observation for this cell" on its own reads as a flat contradiction of
    // the number above it. Both forms therefore keep the part that says what
    // the number IS, not only what it is not.
    short: "Modeled: no observation here, this is what we would expect",
    long: "no observation for this cell; what we would expect on average",
  },
  // `satisfies` rather than a type annotation: the object keeps its literal
  // types for callers, and adding a fifth tier to CoverageTier fails the build
  // here until its copy is written, which is the whole point of centralizing.
} as const satisfies Record<CoverageTier, TierCopy>;
