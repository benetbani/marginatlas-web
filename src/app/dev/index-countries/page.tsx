/**
 * ATLASINDEX , countries instance (Wave 2 reference instance). The first consumer of
 * the config-driven AtlasIndex shell: "of all these countries, which few are worth
 * opening in, and on what dimension?" The list itself answers it , re-rank the world
 * by what an owner keeps / ease / cost, and read the surprising + hardest off the top.
 *
 * Server component (force-static): reads every country seed in page-data/countries,
 * builds typed rows, and hands them to the AtlasIndex client island. The seeds are
 * mostly modeled, so the honesty contract is explicit:
 *  - "Margin kept" (focal) comes from the seed margin block when present, else a dash.
 *    It is modeled / filing-pending, so it carries a sample chip on the rail.
 *  - "Ease of entry" is a REAL measured signal (economic_profile.ease_of_business),
 *    shown plainly.
 *  - "Cost of living" is a REAL signal: the headline cost_of_living_index when filed,
 *    else derived from the measured affordability read (lower = cheaper), shown plainly.
 *  - "Demand" is a placeholder proxy (population x spending power), so it is sample
 *    flagged and renders a dash wherever the underlying figures are not yet filed.
 *
 * No fabricated numbers: a signal with no real basis renders a dash, never a guess.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { SpineShell } from "@/components/spine/shell";
import { AtlasIndex, type IndexRow, type IndexSignalDef, type IndexFacet } from "@/components/spine/atlas-index";

export const dynamic = "force-static";

// A world-skyline motif for the atmosphere (opacity-only, set in SpineShell).
const BG = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=60";

type Seed = {
  meta?: { iso2?: string; name?: string; region?: string };
  headline?: {
    cost_of_living_index?: number;
    population?: number;
    gdp_per_capita_usd?: number;
  };
  margin?: { kept_pct?: number };
  economic_profile?: {
    ease_of_business?: number;
    affordability?: number;
    economic_reward?: number;
  };
};

const num = (x: unknown): number | null => (typeof x === "number" && Number.isFinite(x) ? x : null);
const round = (x: number) => Math.round(x);

function loadSeeds(): Seed[] {
  const dir = path.resolve(process.cwd(), "../page-data/countries");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const out: Seed[] = [];
  for (const f of files) {
    try {
      out.push(JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Seed);
    } catch {
      // skip an unreadable seed rather than fabricate a row
    }
  }
  return out;
}

/* Cost of living, lower = cheaper. Prefer the filed headline index; otherwise derive
 * from the measured affordability read (0-10, higher = more affordable) as a 0-100
 * cost index. This stays a REAL signal (it is built only from measured fields). */
function costIndex(s: Seed): number | null {
  const filed = num(s.headline?.cost_of_living_index);
  if (filed != null) return round(filed);
  const aff = num(s.economic_profile?.affordability);
  if (aff != null) return round((10 - Math.max(0, Math.min(10, aff))) * 10);
  return null;
}

/* Demand , placeholder proxy. Only resolvable where the seed has filed population AND
 * gdp-per-capita (a spending-power x scale read), which is almost nowhere yet, so it
 * is sample-flagged and dashes out for the rest. Never fabricated. */
function demandProxy(s: Seed): number | null {
  const pop = num(s.headline?.population);
  const gdp = num(s.headline?.gdp_per_capita_usd);
  if (pop == null || gdp == null) return null;
  // index relative to a 1bn-USD-pool reference; clamped to a readable 0-100 band.
  const pool = (pop / 1_000_000) * (gdp / 1000); // millions of people x $k per head
  return Math.max(1, Math.min(100, round(pool / 4000)));
}

const SIGNALS: IndexSignalDef[] = [
  { key: "ease", label: "Ease of entry", unit: "/10", higherIsBetter: true },
  { key: "cost", label: "Cost of living", unit: "idx", higherIsBetter: false },
  { key: "demand", label: "Demand", unit: "idx", higherIsBetter: true, sample: true },
];

const REGION_CHIPS = [
  { key: "europe", label: "Europe" },
  { key: "asia", label: "Asia" },
  { key: "americas", label: "Americas" },
  { key: "africa", label: "Africa" },
  { key: "oceania", label: "Oceania" },
];
const regionKey = (r?: string): string | undefined => (r ? r.trim().toLowerCase() : undefined);

export default function IndexCountriesPage() {
  const seeds = loadSeeds();

  const rows: IndexRow[] = seeds
    .filter((s) => s.meta?.iso2 && s.meta?.name)
    .map((s) => {
      const iso2 = (s.meta!.iso2 as string).toUpperCase();
      const kept = num(s.margin?.kept_pct);
      const ease = num(s.economic_profile?.ease_of_business);
      const cost = costIndex(s);
      const demand = demandProxy(s);
      return {
        id: iso2,
        name: s.meta!.name as string,
        href: "/dev/spine",
        flagIso2: iso2,
        leadIcon: "flag", // a tile for the flat flag to overlay
        focal: { value: kept, unit: "%", label: "Margin kept" },
        support: [
          { key: "ease", value: ease, display: ease != null ? `${ease}` : undefined },
          { key: "cost", value: cost, display: cost != null ? `${cost}` : undefined },
          { key: "demand", value: demand, display: demand != null ? `${demand}` : undefined },
        ],
        facetValues: { region: regionKey(s.meta?.region) },
      } satisfies IndexRow;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const facets: IndexFacet[] = [{ key: "region", label: "Region", chips: REGION_CHIPS }];

  return (
    <SpineShell bg={BG} bgPosition="center 30%">
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        <AtlasIndex
          title="Every country, ranked by what an owner keeps"
          rows={rows}
          signals={SIGNALS}
          facets={facets}
          focalLabel="Margin kept"
          searchPlaceholder="Search a country…"
          sampleNote="The kept figure is modeled, not filed: it shows where the seed carries a margin estimate, and a dash everywhere filing is still pending. Ease of entry and cost of living are measured reads shown plainly; demand is an early proxy and is sample-flagged. No blank is ever filled with a guess."
        />
      </main>
    </SpineShell>
  );
}
