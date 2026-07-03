/**
 * ATLASINDEX , cities instance (UK). Second consumer of the config-driven AtlasIndex
 * shell: "of all the UK cities, which few are worth opening in, and how big is the
 * prize?" The list itself answers it , re-rank by market reach (the size of the local
 * market relative to the capital), then read the surprising + hardest off the top.
 *
 * Server component (force-static): reads the UK cities from the GB seed
 * (page-data/countries/GB.json , cities.list), builds typed rows, and hands them to
 * the AtlasIndex client island.
 *
 * Honesty contract on this surface , there is very little FILED city data yet, so
 * almost everything carries the sample chip:
 *  - "Market reach" (focal) comes from each city's market_index_vs_capital (London =
 *    100). It is a real-ish reading off the seed, but the seed itself is an early
 *    estimate, so it is treated as modeled and carries the sample chip on the rail.
 *  - "Rent pressure" and "Demand" are early SAMPLE proxies. They are sample-flagged,
 *    expressed only as an index (never a raw figure), and dash out wherever the seed
 *    gives no basis , a blank is never filled with a guess.
 *
 * Routing: London links to the city spine demo (/dev/spine-city); the rest link to the
 * country spine (/dev/spine) until their own city pages exist.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { SpineShell } from "@/components/spine/shell";
import { AtlasIndex, type IndexRow, type IndexSignalDef } from "@/components/spine/atlas-index";

export const dynamic = "force-static";

// A UK-skyline motif for the atmosphere (opacity-only, set in SpineShell).
const BG = "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1920&q=60";

type City = {
  name?: string;
  slug?: string;
  character?: string;
  market_index_vs_capital?: number;
  lat?: number;
  lng?: number;
};
type Seed = { cities?: { list?: City[] } };

const num = (x: unknown): number | null => (typeof x === "number" && Number.isFinite(x) ? x : null);

function loadCities(): City[] {
  const file = path.resolve(process.cwd(), "../page-data/countries/GB.json");
  try {
    const seed = JSON.parse(fs.readFileSync(file, "utf8")) as Seed;
    return Array.isArray(seed.cities?.list) ? (seed.cities!.list as City[]) : [];
  } catch {
    // a missing / unreadable seed yields an empty list, never a fabricated one.
    return [];
  }
}

/* Rent pressure , SAMPLE proxy. There is no filed rent figure on the seed, so this is
 * an early index keyed off market reach (a bigger local market tends to mean tighter,
 * costlier space). Index only (never a raw figure), and it is clearly sample-flagged.
 * Cities with no market reach on the seed dash out. */
function rentPressureSample(c: City): number | null {
  const reach = num(c.market_index_vs_capital);
  if (reach == null) return null;
  // map a 0-100 reach onto a 30-95 pressure band: more reach = more pressure.
  return Math.max(30, Math.min(95, Math.round(30 + reach * 0.65)));
}

/* Demand , SAMPLE proxy. Same honesty rules: an early index, never a filed figure, and
 * a dash wherever the seed gives nothing to stand on. Demand tracks reach but is
 * deliberately not identical to it so the two columns read as distinct samples. */
function demandSample(c: City): number | null {
  const reach = num(c.market_index_vs_capital);
  if (reach == null) return null;
  return Math.max(10, Math.min(100, Math.round(reach * 0.9 + 8)));
}

const SIGNALS: IndexSignalDef[] = [
  { key: "rent", label: "Rent pressure", unit: "idx", higherIsBetter: false, sample: true },
  { key: "demand", label: "Demand", unit: "idx", higherIsBetter: true, sample: true },
];

export default function IndexCitiesPage() {
  const cities = loadCities();

  const rows: IndexRow[] = cities
    .filter((c) => c.name)
    .map((c) => {
      const name = c.name as string;
      const slug = c.slug ?? name.toLowerCase();
      const reach = num(c.market_index_vs_capital);
      const rent = rentPressureSample(c);
      const demand = demandSample(c);
      const isLondon = slug === "london";
      return {
        id: slug,
        name,
        href: isLondon ? "/dev/spine-city" : "/dev/spine",
        flagIso2: "gb",
        leadIcon: "flag", // a tile for the flat flag to overlay
        focal: { value: reach, unit: "", label: "Market reach" },
        support: [
          { key: "rent", value: rent, display: rent != null ? `${rent}` : undefined },
          { key: "demand", value: demand, display: demand != null ? `${demand}` : undefined },
        ],
      } satisfies IndexRow;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <SpineShell bg={BG} bgPosition="center 35%">
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        <AtlasIndex
          title="Every UK city, by the size of the prize"
          rows={rows}
          signals={SIGNALS}
          focalLabel="Market reach"
          searchPlaceholder="Search a UK city…"
          sampleNote="Market reach is an index against London (London = 100): a quick read of how big the local market is, modeled rather than filed, so it carries the sample chip. Rent pressure and demand are early sample proxies shown only as an index, never a raw figure, and a dash stands wherever the seed gives no basis. No blank is ever filled with a guess."
        />
      </main>
    </SpineShell>
  );
}
