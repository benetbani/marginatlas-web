/**
 * ATLASINDEX , EXTREMES variant (Wave 2). Same world rows as /dev/index-countries,
 * but pre-sorted into a few CURATED leaderboards instead of a searchable list. No
 * search, no facets, no re-rank: each board answers one extreme question and names
 * the catch underneath, so the reader leaves with a verdict, not a tool.
 *
 * Server component (force-static): reads every country seed in page-data/countries,
 * builds the same typed signals as the countries instance (one shared row-builder),
 * then renders 3 themed RankBars boards from kit-index. The honesty contract holds:
 *  - "Where an owner keeps the most" is the MODELED margin signal (kept_pct). It is
 *    placeholder/filing-pending, so the board carries a visible "sample data" chip.
 *  - "Easiest to break into" is the REAL ease_of_business read, shown plainly.
 *  - "Cheapest to set up in" is the REAL cost-of-living read (lower = cheaper),
 *    shown plainly, sorted ascending.
 *
 * A board self-omits if it has fewer than 5 clean (non-null) rows, so a thin seed set
 * never renders a half-empty leaderboard. No fabricated numbers: a row with no real
 * basis is simply absent from a board, never filled with a guess.
 */
import * as React from "react";
import fs from "node:fs";
import path from "node:path";
import { SpineShell } from "@/components/spine/shell";
import { Movement, Box, Ico } from "@/components/spine/kit";
import { RankBars, type RankDatum } from "@/components/spine/kit-index";
import { AtlasIcon, type AtlasIconId } from "@/components/brand/icons";

export const dynamic = "force-static";

// A world-skyline motif for the atmosphere (opacity-only, set in SpineShell).
const BG = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=60";

const SPINE_HREF = "/dev/spine";
const MIN_CLEAN = 5;

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
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
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
 * cost index. Stays a REAL signal (built only from measured fields). Mirrors the
 * countries instance so both surfaces read identically. */
function costIndex(s: Seed): number | null {
  const filed = num(s.headline?.cost_of_living_index);
  if (filed != null) return round(filed);
  const aff = num(s.economic_profile?.affordability);
  if (aff != null) return round((10 - Math.max(0, Math.min(10, aff))) * 10);
  return null;
}

/* One built row carrying every signal the boards rank on. A signal is null when the
 * seed has no real basis for it, and a null is excluded from a board (never guessed). */
type Row = {
  id: string;
  name: string;
  iso2: string;
  kept: number | null; // modeled / sample
  ease: number | null; // real
  cost: number | null; // real, lower = cheaper
};

function buildRows(seeds: Seed[]): Row[] {
  return seeds
    .filter((s) => s.meta?.iso2 && s.meta?.name)
    .map((s) => {
      const iso2 = (s.meta!.iso2 as string).toUpperCase();
      return {
        id: iso2,
        name: s.meta!.name as string,
        iso2,
        kept: num(s.margin?.kept_pct),
        ease: num(s.economic_profile?.ease_of_business),
        cost: costIndex(s),
      } satisfies Row;
    });
}

/* one themed leaderboard config. `asc` ranks lowest-first (cheapest). */
type Board = {
  key: string;
  index: string;
  eyebrow: string;
  heading: string;
  icon: AtlasIconId;
  unit: string;
  sample: boolean;
  asc?: boolean;
  pick: (r: Row) => number | null;
  catch: string;
};

const BOARDS: Board[] = [
  {
    key: "keep",
    index: "01",
    eyebrow: "Most of every sale stays with the owner",
    heading: "Where an owner keeps the most",
    icon: "where-it-pays",
    unit: "%",
    sample: true,
    pick: (r) => r.kept,
    catch:
      "The highest-keep country is often the hardest to enter. A fat take-home means little if the doors are bolted: read it next to the ease board, not on its own.",
  },
  {
    key: "ease",
    index: "02",
    eyebrow: "Fewest hoops between you and trading",
    heading: "Easiest to break into",
    icon: "gut-check",
    unit: "/10",
    sample: false,
    pick: (r) => r.ease,
    catch:
      "Easy to open is not the same as easy to profit. The most open markets are often the most crowded, so a low barrier can mean thinner margins once you are in.",
  },
  {
    key: "cost",
    index: "03",
    eyebrow: "Lowest standing cost to set up and stay open",
    heading: "Cheapest to set up in",
    icon: "myth-reality",
    unit: " idx",
    sample: false,
    asc: true,
    pick: (r) => r.cost,
    catch:
      "Cheap to run usually tracks thinner local demand and lower prices you can charge. A low cost base helps only if there is enough spending nearby to fill it.",
  },
];

/* sort + slice a board to its top ~8 clean rows. Returns null if fewer than MIN_CLEAN
 * clean rows exist, so a thin seed set self-omits rather than half-render. */
function boardRows(rows: Row[], board: Board): RankDatum[] | null {
  const clean = rows
    .map((r) => ({ r, v: board.pick(r) }))
    .filter((x): x is { r: Row; v: number } => x.v != null);
  if (clean.length < MIN_CLEAN) return null;
  clean.sort((a, b) => (board.asc ? a.v - b.v : b.v - a.v) || a.r.name.localeCompare(b.r.name));
  return clean.slice(0, 8).map(({ r, v }) => ({
    id: r.id,
    label: r.name,
    // RankBars scales bar width to the largest value; for an ascending (cheapest)
    // board we invert so the cheapest reads as the longest, leading bar. The display
    // string always shows the true figure so the number stays honest.
    value: board.asc ? 1000 - v : v,
    display: `${v}${board.unit}`,
    href: SPINE_HREF,
  }));
}

function Leaderboard({ board, rows }: { board: Board; rows: RankDatum[] }) {
  // the leader is the first row after sorting (the kit defaults to the max value,
  // which for the inverted ascending board is also the first row).
  const leaderId = rows[0]?.id;
  return (
    <>
      <Movement
        index={board.index}
        eyebrow={board.eyebrow}
        heading={board.heading}
        icon={board.icon}
        sample={board.sample}
      />
      <Box>
        <RankBars rows={rows} leaderId={leaderId} />
        <p className="mt-3 flex items-start gap-2 border-t border-[var(--c-border)] pt-3 text-[11.5px] leading-snug text-[var(--c-muted)]">
          <span className="mt-0.5 shrink-0 text-[var(--terra-text)]">
            <AtlasIcon id="honest-take" size={13} />
          </span>
          <span>
            <span className="font-semibold text-[var(--c-ink)]">The catch. </span>
            {board.catch}
          </span>
        </p>
      </Box>
    </>
  );
}

export default function IndexExtremesPage() {
  const rows = buildRows(loadSeeds());
  const boards = BOARDS.map((board) => ({ board, data: boardRows(rows, board) })).filter(
    (b): b is { board: Board; data: RankDatum[] } => b.data != null,
  );
  const anySample = boards.some((b) => b.board.sample);

  return (
    <SpineShell bg={BG} bgPosition="center 30%">
      <main className="mx-auto max-w-[1120px] px-4 py-2 md:px-6">
        {/* masthead , each board IS its own answer */}
        <header className="pb-2 pt-2">
          <div className="mb-1.5 flex items-center gap-2">
            <Ico id="ranking" tone="terra" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--terra-text)]">
              The extremes
            </span>
          </div>
          <h1 className="max-w-[34ch] text-2xl font-bold leading-tight tracking-tight text-[var(--c-ink)] md:text-[2rem]">
            The extremes
          </h1>
          <p className="mt-1.5 max-w-prose text-[13px] leading-snug text-[var(--c-ink2)]">
            No search, no filters: a handful of curated leaderboards, each ranking the world on one extreme and naming the
            catch underneath. A blank seed never makes the board.
          </p>
          {anySample ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-[var(--c-muted)]">
              <span>Modeled, not filed:</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--c-soft2)] px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-[var(--c-muted)]">
                Margin kept
                <span className="font-normal normal-case tracking-normal">sample</span>
              </span>
            </div>
          ) : null}
        </header>

        {boards.length === 0 ? (
          <Box className="mt-4">
            <p className="text-[13px] font-semibold text-[var(--c-ink)]">No board has enough clean rows yet.</p>
            <p className="mt-1 text-[12px] text-[var(--c-ink2)]">
              Each leaderboard needs at least {MIN_CLEAN} countries with a real figure before it renders. Fill more seeds
              and they appear here.
            </p>
          </Box>
        ) : (
          boards.map(({ board, data }) => <Leaderboard key={board.key} board={board} rows={data} />)
        )}
      </main>
    </SpineShell>
  );
}
