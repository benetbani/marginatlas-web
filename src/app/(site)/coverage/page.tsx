/**
 * /coverage: the coverage hub.
 *
 * Was a 308-redirect to /world. Now a distinct depth-first view: every covered
 * country grouped into four tiers (deep / good / starter / modeled) by how much
 * sub-national measurement it carries, rendered by the v2 CoverageHubV2
 * component. /world stays as the map/grid entry point; this page answers "how
 * deep do the numbers go".
 *
 * Reads through lib/coverage/report, which is the only module that opens the
 * report file. This page used to open it directly and paid for it twice: it
 * listed 264 rows including World Bank aggregates (ARB, AFE, WLD are not
 * countries), and it labelled anything the taxonomy could not name with its raw
 * code, so a reader saw "ABW" and "CEB" sitting in a list of countries.
 *
 * Server component. Reads at build/ISR time.
 */
import type { Metadata } from "next";
import CoverageHubV2 from "@/components/v2/CoverageHubV2";
import {
  getCoverageRows,
  getCoverageGeneratedAt,
  type CoverageRow,
} from "@/lib/coverage/report";

export const revalidate = 21600;

export const metadata: Metadata = {
  title: "Coverage: where Margin Atlas reaches",
  description:
    "Every country Margin Atlas covers, grouped by how deep the numbers go, from neighborhood-level measurement to modeled estimates.",
  alternates: { canonical: "/coverage" },
};

type Tier = "deep" | "good" | "starter" | "modeled";

// Tier by sub-national measurement depth, matching the component's semantics:
// deep = neighborhood/city depth, good = regional, starter = some real cells,
// modeled = country-level extrapolation only.
function tierFor(c: CoverageRow): Tier {
  if (c.regional_cells >= 3000) return "deep";
  if (c.regional_cells >= 300) return "good";
  if (c.regional_cells >= 1) return "starter";
  return "modeled";
}

export default function CoveragePage() {
  const refreshed = getCoverageGeneratedAt();
  const countries = getCoverageRows().map((c) => ({
    iso2: c.iso2,
    name: c.name,
    tier: tierFor(c),
    cellCount: c.cellCount,
    lastRefreshed: refreshed,
  }));

  return <CoverageHubV2 countries={countries} />;
}
