import { Suspense } from "react";
import { NextRequest } from "next/server";
import { CompareClient, type CompactCell } from "./CompareClient";
import { GET as cellLookup } from "@/app/api/cell-lookup/route";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

export const metadata = {
  title: "Compare snapshots | Margin Atlas",
  description:
    "Put the same small business in up to three cities side by side: typical revenue, net margin, owner take-home, rent and labor pressure, and the spread.",
  alternates: { canonical: "/compare" },
};

// Render per request: the default matchup is resolved server-side via live cell
// reads, so the page must not be statically prerendered at build time (that would
// run the database reads during the build and could ship a stale default). At
// request time the production database resolves the three budgeted reads quickly.
export const dynamic = "force-dynamic";

/**
 * The matchup the page lands on. Kept in lockstep with DEFAULT_SLOTS in
 * CompareClient: the page fetches the cells for exactly these slots server-side
 * so the first paint (and a no-JS / crawler view) shows real rows, then the
 * client hydrates the same slots and keeps the grid interactive.
 */
const DEFAULT_SLOTS = [
  { country: "US", industry: "restaurants", region: "california" },
  { country: "US", industry: "restaurants", region: "texas" },
  { country: "US", industry: "restaurants", region: "new-york" },
] as const;

/**
 * Resolve the default matchup's cells server-side by calling the same route the
 * client fetches from, so the figures are derived through one code path (no
 * duplicated finance logic) and there is no internal-origin guesswork. Each slot
 * resolves independently and fails soft to null, so a single miss never blocks
 * the page: the client refetches any missing slot after hydration.
 */
async function loadDefaultCells(): Promise<Record<number, CompactCell>> {
  const results = await Promise.all(
    DEFAULT_SLOTS.map((slot) => fetchSlotCell(slot)),
  );
  const out: Record<number, CompactCell> = {};
  results.forEach((cell, i) => {
    if (cell != null) out[i] = cell;
  });
  return out;
}

async function fetchSlotCell(slot: {
  country: string;
  industry: string;
  region: string;
}): Promise<CompactCell | null> {
  try {
    const qs = new URLSearchParams({
      country: slot.country,
      industry: slot.industry,
      region: slot.region,
    });
    const req = new NextRequest(
      `https://marginatlas.com/api/cell-lookup?${qs.toString()}`,
    );
    const res = await cellLookup(req);
    const json = (await res.json()) as { cell?: CompactCell | null };
    return json?.cell ?? null;
  } catch {
    return null;
  }
}

export default async function ComparePage() {
  // The default matchup's cells, resolved server-side so the first paint shows
  // real rows. Fails soft to an empty map: if the fetch throws or returns
  // nothing, the page still renders and the client fetches after hydration.
  let initialCells: Record<number, CompactCell> = {};
  try {
    initialCells = await loadDefaultCells();
  } catch {
    initialCells = {};
  }

  return (
    <div>
      <header className="border-b border-parchment/60 py-8 sm:py-10">
        <SectionEyebrow size="md" className="mb-3">
          Compare
        </SectionEyebrow>
        <h1 className="max-w-3xl font-display text-3xl font-medium leading-tight tracking-tight text-ink-900 sm:text-4xl">
          Same business, up to three cities. Which one is worth it?
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-graphite">
          Set up to three cities, then read the figures that decide it. The same
          activity earns very different money in different places, and the
          biggest revenue number is rarely the one that leaves an owner the most.
        </p>
      </header>

      <Suspense
        fallback={
          <div
            className="py-10 text-sm text-cocoa-500"
            role="status"
            aria-live="polite"
          >
            Loading the comparison
          </div>
        }
      >
        <CompareClient initialCells={initialCells} />
      </Suspense>
    </div>
  );
}
