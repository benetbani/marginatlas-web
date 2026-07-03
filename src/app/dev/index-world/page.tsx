/**
 * ATLASINDEX , WORLD variant (the index PLUS a map). Same browse/decide list as the
 * countries instance, with one addition: an interactive SpineMap band above it, so
 * the same country dataset reads two ways , a terracotta dot at each capital (sized by
 * what an owner keeps / the market read) and the re-rankable list below it.
 *
 * Server component (force-static): reads every country seed in page-data/countries,
 * builds the SAME typed rows as index-countries (reused builder logic), and hands them
 * BOTH to the SpineMap (markers) and the AtlasIndex client island (list). The two share
 * one source of truth, so a row and its dot can never disagree.
 *
 * Honesty contract (inherited from index-countries):
 *  - "Margin kept" (focal) comes from the seed margin block when present, else a dash.
 *    It is modeled / filing-pending, so it carries a sample chip on the rail.
 *  - "Ease of entry" is a REAL measured signal (economic_profile.ease_of_business).
 *  - "Cost of living" is a REAL signal: the headline index when filed, else derived
 *    from the measured affordability read (lower = cheaper).
 *  - "Demand" is an early proxy (population x spending power), so it is sample flagged
 *    and dashes out wherever the underlying figures are not filed.
 *
 * Capital coordinates are objective facts, kept as a local lookup here (the seeds carry
 * no coords). A country with no coord simply gets no marker , it still appears in the
 * list. No fabricated numbers: a signal with no real basis renders a dash, never a guess.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { SpineShell } from "@/components/spine/shell";
import { Movement } from "@/components/spine/kit";
import { SpineMap, type SpinePoint } from "@/components/spine/SpineMap";
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

/* Capital coordinates , objective facts (lat, lng), kept local since the seeds carry
 * none. Keyed by ISO-2. A country absent here gets no marker; it still appears in the
 * list below the map. Covers the major seeded economies across every region. */
const CAPITAL_COORDS: Record<string, [lat: number, lng: number]> = {
  GB: [51.5074, -0.1278], // London
  US: [38.9072, -77.0369], // Washington
  CA: [45.4215, -75.6972], // Ottawa
  MX: [19.4326, -99.1332], // Mexico City
  BR: [-15.7939, -47.8828], // Brasília
  AR: [-34.6037, -58.3816], // Buenos Aires
  CL: [-33.4489, -70.6693], // Santiago
  CO: [4.711, -74.0721], // Bogotá
  PE: [-12.0464, -77.0428], // Lima
  DE: [52.52, 13.405], // Berlin
  FR: [48.8566, 2.3522], // Paris
  ES: [40.4168, -3.7038], // Madrid
  IT: [41.9028, 12.4964], // Rome
  NL: [52.3676, 4.9041], // Amsterdam
  BE: [50.8503, 4.3517], // Brussels
  CH: [46.948, 7.4474], // Bern
  AT: [48.2082, 16.3738], // Vienna
  IE: [53.3498, -6.2603], // Dublin
  PT: [38.7223, -9.1393], // Lisbon
  PL: [52.2297, 21.0122], // Warsaw
  SE: [59.3293, 18.0686], // Stockholm
  NO: [59.9139, 10.7522], // Oslo
  DK: [55.6761, 12.5683], // Copenhagen
  FI: [60.1699, 24.9384], // Helsinki
  GR: [37.9838, 23.7275], // Athens
  CZ: [50.0755, 14.4378], // Prague
  RO: [44.4268, 26.1025], // Bucharest
  TR: [39.9334, 32.8597], // Ankara
  RU: [55.7558, 37.6173], // Moscow
  UA: [50.4501, 30.5234], // Kyiv
  AE: [24.4539, 54.3773], // Abu Dhabi
  SA: [24.7136, 46.6753], // Riyadh
  IL: [31.7683, 35.2137], // Jerusalem
  EG: [30.0444, 31.2357], // Cairo
  ZA: [-25.7479, 28.2293], // Pretoria
  NG: [9.0765, 7.3986], // Abuja
  KE: [-1.2864, 36.8172], // Nairobi
  MA: [34.0209, -6.8416], // Rabat
  CN: [39.9042, 116.4074], // Beijing
  JP: [35.6762, 139.6503], // Tokyo
  KR: [37.5665, 126.978], // Seoul
  IN: [28.6139, 77.209], // New Delhi
  ID: [-6.2088, 106.8456], // Jakarta
  TH: [13.7563, 100.5018], // Bangkok
  VN: [21.0285, 105.8542], // Hanoi
  MY: [3.139, 101.6869], // Kuala Lumpur
  PH: [14.5995, 120.9842], // Manila
  SG: [1.3521, 103.8198], // Singapore
  PK: [33.6844, 73.0479], // Islamabad
  BD: [23.8103, 90.4125], // Dhaka
  AU: [-35.2809, 149.13], // Canberra
  NZ: [-41.2865, 174.7762], // Wellington
};

export default function IndexWorldPage() {
  const seeds = loadSeeds();

  // ONE builder, ONE dataset , the rows feed both the map and the list.
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

  // Map markers , one per country WITH a known capital coord. Dot size rides the focal
  // (what an owner keeps) when filed, else the demand/market read so the dot still
  // carries meaning; the popup figure names whichever is shown. No coord = no marker
  // (the country stays in the list below).
  const points: SpinePoint[] = rows
    .map((r): SpinePoint | null => {
      const coord = CAPITAL_COORDS[r.id];
      if (!coord) return null;
      const kept = r.focal.value;
      const market = r.support.find((s) => s.key === "demand")?.value ?? null;
      // size encoding: prefer kept (0-100-ish %), fall back to the market read.
      const signal = kept != null ? Math.max(0, Math.min(100, kept)) : market != null ? market : undefined;
      const signalLabel =
        kept != null
          ? `${kept}% kept`
          : market != null
            ? `market ${market}`
            : "figure pending";
      return {
        name: r.name,
        slug: r.id,
        lat: coord[0],
        lng: coord[1],
        href: "/dev/spine",
        signal,
        signalLabel,
      } satisfies SpinePoint;
    })
    .filter((p): p is SpinePoint => p !== null);

  return (
    <SpineShell bg={BG} bgPosition="center 30%">
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        {/* Movement opener , the page's chapter masthead above the map band. */}
        <Movement
          index="01"
          eyebrow="The world, mapped"
          heading="The whole atlas, on one map"
          icon="global-spread"
        />
        <p className="-mt-1 mb-4 max-w-prose text-[13px] leading-snug text-[var(--c-ink2)]">
          Every seeded country sits at its capital, a terracotta dot sized by what an owner keeps. Read the world at a
          glance up here, then re-rank the same countries on the signal you care about in the list below.
        </p>

        {/* Full-width map band , the same dataset as the list, shown spatially. */}
        <SpineMap
          points={points}
          ariaLabel="World map of seeded countries, each at its capital"
          legendLabel="Dot size = what an owner keeps"
          className="mb-2"
        />

        {/* The index , the SAME country rows, re-rankable and searchable. */}
        <AtlasIndex
          title="The whole atlas, on one map"
          rows={rows}
          signals={SIGNALS}
          facets={facets}
          focalLabel="Margin kept"
          searchPlaceholder="Search a country…"
          sampleNote="The kept figure is modeled, not filed: it shows where the seed carries a margin estimate, and a dash everywhere filing is still pending. Ease of entry and cost of living are measured reads shown plainly; demand is an early proxy and is sample-flagged. Markers sit at each capital and are sized by the kept figure when filed, else by the market read; a country with no capital coordinate yet shows no dot but still appears in the list. No blank is ever filled with a guess."
        />
      </main>
    </SpineShell>
  );
}
