/**
 * src/lib/coverage/report.ts , the one reader of the coverage report.
 *
 * WHY THIS EXISTS. Three modules independently answered "which countries have
 * coverage" and all three gave a different answer:
 *
 *   the sitemap           declared all 195 taxonomy countries, unconditionally
 *   the hub               listed whatever was in the report, 264 rows
 *   generateStaticParams  pre-rendered a hardcoded list of 30 GDP economies
 *
 * Three answers means at least two are wrong. They were: the sitemap declared
 * pages with nothing on them, the hub listed things that are not countries, and
 * one of the 30 pre-rendered pages (SG) had no row at all.
 *
 * ================= THE THING THIS FILE EXISTS TO GET RIGHT =================
 *
 * coverage_v2.json holds 264 rows in TWO DIFFERENT SHAPES, and telling them
 * apart is the whole job.
 *
 *   REAL      GT   regional 264, tiers {X: 264}, quality 3.7/10, year 2024
 *   HOLLOW    AFG  extrapolated 264, tiers {}, quality 0, geographies 0,
 *                  year_range [null, null]
 *
 * 169 of the 264 rows are hollow, and every hollow row is identical: 264 cells,
 * 44 industries, ZERO geographies, no tier, no quality, no year. 264 is 44
 * industries x 6 size bands. It is an allocated grid with nothing in it.
 *
 * So `regional_cells + extrapolated_cells` COUNTS SLOTS, NOT FACTS. That is the
 * blind spot, stated plainly, because reading that sum as evidence produces a
 * confident wrong answer twice over:
 *
 *   1. All 163 ISO-3 rows (AFG, AGO, BDI...) are hollow. Every one. Read by
 *      cell count they look like 117 countries whose data is stranded under a
 *      code the site cannot parse, and "bridge ISO-3 to ISO-2 and recover them"
 *      is a fix that publishes 95 scorecards each claiming 264 benchmarks that
 *      do not exist. There is nothing stranded. There is nothing there.
 *
 *   2. On 52 countries that DO hold real data, the hollow 264-cell block is
 *      added to the genuine total. Australia's classified cells are 80,728 and
 *      the hub was showing 80,992. The gap is exactly 264 on all 52, and
 *      exactly 0 on the other 43.
 *
 * Hence the rule: a cell counts when it is CLASSIFIED, meaning it carries a
 * confidence tier. Everything below keys off sum(tiers), never off the stored
 * totals. That single test drops the aggregates, drops the hollow skeleton, and
 * fixes the overstatement, because all three are the same defect.
 *
 * ==========================================================================
 *
 * WHAT ELSE GETS DROPPED, and it is only ever a row this site cannot name and
 * cannot link. The report mixes ISO-2, ISO-3 and World Bank AGGREGATE codes;
 * WLD, EUU, ARB and AFE are not countries, and "Arab World" is not somewhere
 * you open a business. Aggregates fail the naming test on their own, so no list
 * of them is maintained here: a new one appears and is dropped untouched.
 *
 * Nothing is ever dropped for being small, thin, or unflattering. A country
 * with 264 classified cells at 3.7/10 ships with its tier and its quality
 * score visible, because that is the ratified treatment for a weak number:
 * label it, do not hide it. What does not ship is a number nobody measured.
 */
import fs from "node:fs";
import path from "node:path";

import { COUNTRIES } from "../taxonomy";
import { iso3ToIso2 } from "../countries";

/** A row exactly as the generator writes it, in whatever code system it used. */
type RawCountry = {
  iso2: string;
  regional_cells: number;
  extrapolated_cells: number;
  industries: number;
  geographies: number;
  tiers: Record<string, number>;
  avg_quality: number;
  avg_quality_10: number;
  year_range: [number | null, number | null];
};

type RawReport = { generated_at: string; countries: RawCountry[] };

/** One country the site can name, link, and render. */
export type CoverageRow = RawCountry & {
  /** Canonical ISO-2, the code every URL and every other module uses. */
  iso2: string;
  /** Display name from the taxonomy. Never a bare code. */
  name: string;
  /**
   * Cells carrying a confidence tier. THE ONLY COUNT ANY PAGE SHOULD SHOW.
   * Deliberately not regional + extrapolated, which folds in a 264-cell
   * unclassified block on 52 countries.
   */
  cellCount: number;
};

/**
 * Non-ISO codes that mean a country the taxonomy already knows.
 *
 * Both are statistical-agency spellings, not errors: EL for Greece and UK for
 * the United Kingdom. EL is the only carrier of Greece's 1,733 classified
 * cells, so without this line Greece reads as uncovered.
 */
const ALIASES: Record<string, string> = { UK: "GB", EL: "GR" };

const NAME_BY_ISO2 = new Map(COUNTRIES.map((c) => [c.code, c.name]));

/** Cells that carry a confidence tier. The evidence test. */
function classifiedCells(c: RawCountry): number {
  return Object.values(c.tiers || {}).reduce((a, b) => a + (b || 0), 0);
}

/**
 * Resolve any code in the report to a canonical ISO-2 the site can render, or
 * null when it is not a country this site can show.
 */
function canonicalIso2(code: string): string | null {
  const upper = (code || "").toUpperCase();
  const aliased = ALIASES[upper] || upper;
  const iso2 = aliased.length === 3 ? iso3ToIso2(aliased) : aliased;
  if (!iso2 || !NAME_BY_ISO2.has(iso2)) return null;
  return iso2;
}

function loadRaw(): RawReport | null {
  const candidates = [
    path.resolve(process.cwd(), "data/quality/coverage_v2.json"),
    path.resolve(process.cwd(), "delivery/quality/coverage_v2.json"),
  ];
  for (const p of candidates) {
    try {
      return JSON.parse(fs.readFileSync(p, "utf-8")) as RawReport;
    } catch {
      continue;
    }
  }
  return null;
}

let cached: { rows: CoverageRow[]; generatedAt: string } | null = null;

function build(): { rows: CoverageRow[]; generatedAt: string } {
  if (cached) return cached;
  const raw = loadRaw();
  if (!raw) {
    cached = { rows: [], generatedAt: "" };
    return cached;
  }

  /* Collisions are real: GB carries 13,462 classified cells and UK carries
     3,218, and they are the same country. Summing them would invent 3,218
     benchmarks, so the row that arrived under the CANONICAL code wins and the
     alias is dropped. Where only the alias is present it is kept, renamed,
     which is how Greece survives. Ties break on cellCount so the result never
     depends on file order. */
  const byIso2 = new Map<string, { row: CoverageRow; wasCanonical: boolean }>();

  for (const c of raw.countries) {
    const cellCount = classifiedCells(c);
    if (cellCount <= 0) continue;
    const iso2 = canonicalIso2(c.iso2);
    if (!iso2) continue;

    const wasCanonical = (c.iso2 || "").toUpperCase() === iso2;
    const row: CoverageRow = {
      ...c,
      iso2,
      name: NAME_BY_ISO2.get(iso2) as string,
      cellCount,
    };
    const held = byIso2.get(iso2);
    if (
      !held ||
      (wasCanonical && !held.wasCanonical) ||
      (wasCanonical === held.wasCanonical && cellCount > held.row.cellCount)
    ) {
      byIso2.set(iso2, { row, wasCanonical });
    }
  }

  const rows = [...byIso2.values()]
    .map((v) => v.row)
    .sort((a, b) => b.cellCount - a.cellCount || a.iso2.localeCompare(b.iso2));

  cached = { rows, generatedAt: raw.generated_at || "" };
  return cached;
}

/** Every country the site can name and defend, deepest first. */
export function getCoverageRows(): CoverageRow[] {
  return build().rows;
}

/** One country's row, or null when nothing classified is held for it. */
export function getCoverageFor(iso2: string): CoverageRow | null {
  const upper = (iso2 || "").toUpperCase();
  return build().rows.find((r) => r.iso2 === upper) || null;
}

/** When the report was generated, as YYYY-MM-DD. Empty when unreadable. */
export function getCoverageGeneratedAt(): string {
  return build().generatedAt.slice(0, 10);
}
