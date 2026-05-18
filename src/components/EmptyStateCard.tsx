/**
 * EmptyStateCard (CC.13) — surfaced when a cell loads but has no usable
 * metrics. Honest "we don't have it here yet" message with a single best
 * suggestion: the closest measured neighbor cell.
 */
import Link from "next/link";

type Props = {
  industryName: string;
  geoName: string;
  /** Closest-match neighbor cell from getNudgeNeighbor — when available. */
  neighborUrl?: string;
  neighborGeoName?: string;
};

export function EmptyStateCard({
  industryName,
  geoName,
  neighborUrl,
  neighborGeoName,
}: Props) {
  return (
    <section className="my-6 rounded-2xl border border-clay-300 bg-clay-50 p-6">
      <div className="text-xs uppercase tracking-wide text-clay-700 font-semibold">
        No measured data yet
      </div>
      <h2 className="mt-2 text-lg md:text-xl font-semibold text-ink-900">
        We don&apos;t have firm-level numbers for {industryName.toLowerCase()} in{" "}
        {geoName} yet.
      </h2>
      <p className="mt-2 text-sm text-ink-700 leading-relaxed max-w-2xl">
        The industry is in the taxonomy but the source data either suppresses
        this slice (low firm count) or our extrapolation hasn&apos;t reached
        it yet. The page is reachable so the URL stays stable; come back
        after the next refresh, or jump to a covered neighbor below.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm">
        {neighborUrl && neighborGeoName ? (
          <Link
            href={neighborUrl}
            className="inline-flex items-center px-4 py-2 rounded-full bg-ink-900 text-cream-50 hover:bg-ink-800 transition font-medium"
          >
            Closest match: {industryName} in {neighborGeoName} →
          </Link>
        ) : null}
        <Link
          href="/browse"
          className="inline-flex items-center px-4 py-2 rounded-full bg-cream-100 border border-parchment text-ink-900 hover:bg-white transition font-medium"
        >
          Browse all countries
        </Link>
        <Link
          href="/industries"
          className="inline-flex items-center px-4 py-2 rounded-full bg-cream-100 border border-parchment text-ink-900 hover:bg-white transition font-medium"
        >
          Try another industry
        </Link>
      </div>
    </section>
  );
}
