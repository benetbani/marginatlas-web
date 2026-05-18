/**
 * CellWarningChips (AA.6 + AA.9) — inline warning chips on a cell page.
 *
 * Surfaces two anomaly signals without making the page feel alarmist:
 *   AA.6 staleness — cells with year < 2018 get a warning chip
 *   AA.9 industry-mapping — when the URL slug resolved to a different
 *        industry than the user typed, render a quiet "showing X instead"
 *        chip with the canonical URL.
 */
import Link from "next/link";

type Props = {
  year: number | null;
  requestedIndustrySlug?: string;
  resolvedIndustryName?: string;
  resolvedIndustryUrl?: string;
};

export function CellWarningChips({
  year,
  requestedIndustrySlug,
  resolvedIndustryName,
  resolvedIndustryUrl,
}: Props) {
  const chips: React.ReactNode[] = [];

  // AA.6 — staleness
  if (year != null) {
    if (year < 2015) {
      chips.push(
        <span
          key="hide-stale"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-clay-100 border border-clay-300 text-xs font-medium text-clay-900"
        >
          <span aria-hidden>⚠</span>
          Data from {year} — refresh pending
        </span>
      );
    } else if (year < 2018) {
      chips.push(
        <span
          key="warn-stale"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cream-200 border border-parchment text-xs font-medium text-ink-900"
        >
          <span aria-hidden>🕰</span>
          {year} data — newer benchmarks available for some neighbors
        </span>
      );
    }
  }

  // AA.9 — industry-mapping warning
  if (
    requestedIndustrySlug &&
    resolvedIndustryName &&
    resolvedIndustryUrl &&
    !requestedIndustrySlug
      .toLowerCase()
      .includes(resolvedIndustryName.toLowerCase().slice(0, 6))
  ) {
    chips.push(
      <span
        key="mapping"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-atlas-100 border border-atlas-300 text-xs font-medium text-atlas-900"
      >
        <span aria-hidden>↪</span>
        Showing {resolvedIndustryName} —{" "}
        <Link href={resolvedIndustryUrl} className="underline hover:text-atlas-700">
          canonical URL
        </Link>
      </span>
    );
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">{chips}</div>
  );
}
