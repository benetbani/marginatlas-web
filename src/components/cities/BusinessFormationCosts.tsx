/**
 * BusinessFormationCosts (Cities sec 6).
 *
 * Renders the cost + setup-days to register a business in the city's
 * country, broken out by legal tier (Freelancer / Sole Trader / LLC /
 * Joint-Stock + local equivalents).
 *
 * Data: data/legal/business_formation_costs_v1.json. When the country
 * has no entry, the section quietly renders a "we are working on this"
 * empty state instead of breaking.
 *
 * Server component, no client JS.
 */

import { SectionEyebrow } from "@/components/ui/section-eyebrow";

import formationJson from "../../../data/legal/business_formation_costs_v1.json";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TierRow = {
  tier: "Freelancer" | "Sole Trader" | "LLC" | "Joint-Stock";
  local_term: string;
  setup_cost_usd: number;
  setup_days: number;
  complexity_score?: number;
};

type FormationFile = {
  tier_definitions: Record<string, string>;
  countries: Record<string, TierRow[]>;
};

const FILE = formationJson as FormationFile;

function formatCost(usd: number): string {
  if (usd === 0) return "Free";
  if (usd < 1000) return `$${usd}`;
  return `$${(usd / 1000).toFixed(1)}K`;
}

function formatDays(days: number): string {
  if (days <= 1) return "1 day";
  if (days <= 7) return `${days} days`;
  if (days <= 30) return `${Math.round(days / 7)} weeks`;
  return `${Math.round(days / 30)} months`;
}

/**
 * Render the complexity score as five small dots (filled vs empty).
 * 1 = trivial online filing; 5 = lawyer, notary, multiple agencies, weeks.
 */
function ComplexityDots({ score }: { score: number | undefined }) {
  if (!score || score < 1) return null;
  const clamped = Math.max(1, Math.min(5, Math.round(score)));
  const label =
    clamped <= 1
      ? "Trivial"
      : clamped === 2
        ? "Light"
        : clamped === 3
          ? "Moderate"
          : clamped === 4
            ? "Heavy"
            : "Very heavy";
  return (
    <span
      className="inline-flex items-center gap-0.5 ml-2 align-middle"
      title={`Complexity: ${label} (${clamped} of 5)`}
      aria-label={`Complexity ${clamped} of 5: ${label}`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={
            "inline-block w-1.5 h-1.5 rounded-full " +
            (i <= clamped ? "bg-atlas-600" : "bg-parchment")
          }
        />
      ))}
    </span>
  );
}

export function BusinessFormationCosts({
  countryIso2,
  countryName,
}: {
  countryIso2: string;
  countryName: string;
}) {
  const rows = FILE.countries[countryIso2.toUpperCase()];

  return (
    /* THIS IS A SUB-BLOCK, NOT A PAGE SECTION, and it was dressed as the
       latter. It mounts in exactly one place, inside the country page's
       "decisive read" card (`[country]/page.tsx`), under that card's own
       eyebrow and h2. Three things followed from the mismatch and all three
       were visible in a render:

       - Its h2 was `text-2xl md:text-3xl`, TWO steps above the h2 of the
         section containing it (`text-lg md:text-xl`), so the sub-block's
         heading was the largest type in the card and read as the section
         title. It is an h3 at the sub-heading step now.
       - Its eyebrow was hand-rolled at `text-atlas-600` with `tracking-wide`,
         while every other eyebrow on that page is `SectionEyebrow`
         (atlas-700, tracking .16em). Two eyebrow treatments, one card.
       - `mb-12 md:mb-16` hung 48 to 64px of dead space under the table, inside
         a parent that already owns the spacing. The gap was visible under the
         "See what restaurants typically keep after tax" link at 1440. */
    <section className="mb-0">
      <SectionEyebrow className="mb-2">Cost to start</SectionEyebrow>
      <h3 className="font-display text-base md:text-lg font-medium tracking-tight text-ink-900 mb-2">
        Setting up a business in {countryName}
      </h3>
      <p className="text-sm md:text-base text-cocoa-700/80 mb-6 max-w-2xl">
        Government fees + typical online-filing turnaround for each legal
        tier. Professional fees (lawyer, notary, accountant) on top vary
        widely.
      </p>

      {rows ? (
        /* `overflow-x-auto`, NOT `overflow-hidden`. Measured at 375x812 on
           /gb: the table lays out at 389px inside a 269px box, and
           `overflow-hidden` gives no scrollbar and no drag, so the entire
           COMPLEXITY column and the difficulty dots were cut off the right
           edge of the card and were unreachable by any means. The header row
           ended at TIME. Auto keeps the same rounded clip and lets the last
           120px be reached. */
        /* MIGRATED to the shadcn table primitive, 2026-08-21. Same five
           columns, same order, same rows, same figures, same formatters:
           structure adapts, substance does not.

           THREE DEFECTS GO WITH THE SWAP:
             - every header now carries scope="col". Eleven reader-facing files
               had a table with none at all, and a screen reader cannot
               associate a figure with its column without it.
             - STICKY HEADER NOT DONE HERE, deliberately. Table wraps itself
               in an overflow-x-auto container, which establishes a scroll
               context and very likely defeats a page-level `sticky top-0` on
               the header row. That needs a browser to settle and this machine
               could not launch one (506MB free of 8GB). Shipping a sticky class
               believed to be inert is worse than shipping none, so it waits.
             - the horizontal scroll container comes from the primitive. The
               hand-written note that used to live here recorded a real bug,
               measured at 375 on /gb: the table laid out at 389px inside a
               269px box and overflow-hidden made the last column unreachable
               by any means. Table's own wrapper is overflow-x-auto, so that
               class of bug cannot come back through this component. */
        <div className="rounded-2xl border border-parchment bg-white">
          <Table className="text-sm">
            <TableHeader className="bg-paper-100">
              <TableRow className="border-b border-parchment hover:bg-transparent">
                <TableHead scope="col" className="text-left px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                  Tier
                </TableHead>
                <TableHead scope="col" className="text-left px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                  Local name
                </TableHead>
                <TableHead scope="col" className="text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                  Fees
                </TableHead>
                <TableHead scope="col" className="text-right px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                  Time
                </TableHead>
                <TableHead scope="col" className="text-left px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
                  Complexity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  key={`${row.tier}-${row.local_term}-${i}`}
                  className="border-t border-parchment"
                >
                  <TableCell className="px-4 py-3 text-ink-900 font-medium">
                    {row.tier}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-ink-800">
                    {row.local_term}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right tabular-nums text-ink-900 font-semibold">
                    {formatCost(row.setup_cost_usd)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right tabular-nums text-ink-800">
                    {formatDays(row.setup_days)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-left">
                    <ComplexityDots score={row.complexity_score} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-xl border border-parchment bg-white p-5 text-sm text-cocoa-700">
          We are still gathering the legal-tier breakdown for {countryName}.
        </div>
      )}
    </section>
  );
}
