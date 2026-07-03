/**
 * DECISION ENGINE , SPINE rebuild (dev surface). Wave 1 of the uncovered-pages
 * plan: the commercial core. "Where should I open X" answered as a ranked,
 * what-you-KEEP recommendation with the honest counterweight beside the verdict.
 *
 * The winner is the highest KEEP-INDEX district, NOT the highest-revenue one, and
 * that gap IS the honesty story (Mayfair takes the most, keeps the least). The
 * keep index is derived not stored: keepIndex(d) = 100 x (1 + rev_vs_city_pct/100)
 * / rent_mult, city baseline = 100.
 *
 * Free / Pro line (the ratified very-powerful-free default): FREE = WinnerCard +
 * Podium(top 3 with figures) + why + counterweight + the basic wizard. The #1
 * answer is NEVER paywalled. PRO (LockVeil) = the full ranked tail, the per-pick
 * drilldown, the compare, the constraint re-ranking. The gate is a single boolean
 * config (PRO_UNLOCKED) so it is trivial to tighten or loosen later.
 *
 * Server component (force-static): reads the London-district seed, computes the
 * KEEP ranking once, and hands the rows to the client island (the wizard, sort,
 * drilldown, compare tray, lock toggle). Carries a visible sample-data chip;
 * filing deferred. On promotion this wires to the real recommender joins.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { SpineShell } from "@/components/spine/shell";
import { keepIndex } from "@/components/spine/keep";
import { DecideClient, type DistrictRow } from "./decide-client";

export const dynamic = "force-static";

const N: any = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "../page-data/cities/GB-london-neighborhoods.json"), "utf8"),
);

// A London street motif for the atmosphere (opacity-only, set in SpineShell).
const BG = "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1920&q=60";

const walkScore = (w: string): number => (w === "high" ? 90 : w === "moderate" ? 72 : 55);

export default function SpineDecidePage() {
  const districts: any[] = N.districts ?? [];

  // Compute the KEEP ranking once on the server. keep is the focal signal; revenue,
  // rent and footfall are the support signals the table sorts by. The deep link
  // targets the parked neighborhood-hub dev route (real route on promotion).
  const rows: DistrictRow[] = districts.map((d: any) => {
    const keep = keepIndex(d);
    const footfall = Math.round(((d.footfall?.weekday ?? 0) + (d.footfall?.weekend ?? 0)) / 2);
    return {
      id: d.slug,
      name: d.name,
      character: d.character,
      keep,
      revIndex: Math.round((1 + (d.rev_vs_city_pct || 0) / 100) * 100),
      revVsCity: d.rev_vs_city_pct,
      rentMult: d.rent_mult,
      rentLoad: Math.round((d.rent_mult || 1) * 100),
      footfall,
      walkability: walkScore(d.walkability),
      priceTier: d.price_tier,
      tags: d.tags ?? [],
      blurb: d.blurb,
      headlineTrade: d.headline_trade,
      href: `/dev/spine-hood?d=${d.slug}`,
    };
  });

  return (
    <SpineShell bg={BG} bgPosition="center 40%">
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        <DecideClient rows={rows} city={N.meta?.city ?? "London"} myth={N.meta?.myth ?? {}} />
      </main>
    </SpineShell>
  );
}
