/**
 * Comparison grammar - LikeForLikeTable and WageRangeTracks (design-system 10.1).
 *
 * The shared way Atlas compares places without shaming any of them. A comparison
 * holds ONE axis constant (the same business, the same role) and the leader cell
 * per row takes the lone vermillion tint. Crucially, the leader mark is opt-out
 * (noLeaderMark): when the columns span different price regimes (countries), the
 * page passes noLeaderMark so a raw figure is never crowned across borders, the
 * data-sanity rule from WS1. Divergent rows never become an absolute "best
 * places" ranking.
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 * Server-renderable.
 */
import * as React from "react";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";

function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}
function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

/* ------------------------------------------------------------------ */
/* LikeForLikeTable - same axis held constant, leader cell tinted.     */
/* ------------------------------------------------------------------ */

export type LikeForLikeColumn = { key: string; label: string; sub?: string };

export type LikeForLikeRow = {
  label: string;
  hint?: string;
  /** Display string per column key (null renders the dash). */
  cells: Record<string, string | null | undefined>;
  /** Optional comparable numbers per column for the leader mark. */
  metric?: Record<string, number | null | undefined>;
  /** Whether a higher metric is the stronger one (default true). */
  higherIsBetter?: boolean;
};

const DASH = "–";

export function LikeForLikeTable({
  columns,
  rows,
  eyebrow,
  heading,
  lede,
  noLeaderMark = false,
  footnote,
  id,
  className,
}: {
  columns: LikeForLikeColumn[];
  rows: LikeForLikeRow[];
  eyebrow?: string;
  heading?: string;
  lede?: string;
  /** Suppress every leader mark (e.g. columns span price regimes). */
  noLeaderMark?: boolean;
  footnote?: string;
  id?: string;
  className?: string;
}) {
  const cols = (columns ?? []).filter((c) => hasText(c.key) && hasText(c.label));
  const validRows = (rows ?? []).filter((r) => hasText(r.label));
  if (cols.length < 2 || validRows.length === 0) return null;

  // The leading column key per row (highest or lowest metric), or null when the
  // mark is suppressed or there is no clear, non-tied winner across >=2 values.
  function leaderKey(row: LikeForLikeRow): string | null {
    if (noLeaderMark || !row.metric) return null;
    const present = cols
      .map((c) => ({ key: c.key, v: row.metric![c.key] }))
      .filter((p): p is { key: string; v: number } => isNum(p.v));
    if (present.length < 2) return null;
    const higher = row.higherIsBetter !== false;
    let best = present[0];
    let tie = false;
    for (const p of present.slice(1)) {
      if (p.v === best.v) tie = true;
      else if (higher ? p.v > best.v : p.v < best.v) {
        best = p;
        tie = false;
      }
    }
    // A best tied with the trailing value is not a winner.
    const worst = present.reduce((a, b) => ((higher ? b.v < a.v : b.v > a.v) ? b : a));
    if (best.v === worst.v) return null;
    return tie ? null : best.key;
  }

  return (
    <section
      id={id}
      aria-label={heading || eyebrow || "Comparison"}
      className={[
        "rounded-lg border border-parchment bg-cream-50 shadow-subtle",
        "px-5 py-5 md:px-7 md:py-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {hasText(eyebrow) ? <SectionEyebrow className="mb-1">{eyebrow}</SectionEyebrow> : null}
      {hasText(heading) ? (
        <h2 className="font-display text-xl font-medium tracking-tight text-balance text-ink-900 md:text-2xl">
          {heading}
        </h2>
      ) : null}
      {hasText(lede) ? (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-cocoa-700 md:text-base">
          {lede}
        </p>
      ) : null}

      {/* sm and up: the full comparison table. Below sm it is hidden so the
          primary content never sits behind horizontal scroll. */}
      <div className="mt-5 hidden sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-parchment text-left align-bottom">
              <th className="w-44 py-2 pr-4 text-[11px] font-semibold uppercase tracking-wide text-cocoa-700">
                Metric
              </th>
              {cols.map((c) => (
                <th key={c.key} className="px-3 py-2 align-bottom">
                  <span className="block font-display text-base font-semibold text-ink-900">
                    {c.label}
                  </span>
                  {hasText(c.sub) ? (
                    <span className="block text-[11px] font-normal text-cocoa-700">{c.sub}</span>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-ink-900">
            {validRows.map((row, ri) => {
              const leader = leaderKey(row);
              return (
                <tr key={ri} className="border-b border-parchment/50">
                  <td className="py-2.5 pr-4 align-top text-cocoa-500">
                    {row.label}
                    {hasText(row.hint) ? (
                      <span className="mt-0.5 block text-[11px] text-cocoa-700">{row.hint}</span>
                    ) : null}
                  </td>
                  {cols.map((c) => {
                    const disp = row.cells[c.key];
                    const blank = !hasText(disp);
                    const isLeader = leader === c.key;
                    return (
                      <td
                        key={c.key}
                        className={[
                          "px-3 py-2.5 align-top tabular-nums",
                          blank
                            ? "text-cocoa-700"
                            : isLeader
                              ? "font-semibold text-atlas-700"
                              : "text-ink-900",
                        ].join(" ")}
                      >
                        {blank ? DASH : disp}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Below sm: the same data reflowed into a stacked, labeled list so every
          column stays readable without horizontal scroll. One group per metric;
          inside, one labeled row per place. CSS-only toggle, no JS. */}
      <div className="mt-5 space-y-4 sm:hidden">
        {validRows.map((row, ri) => {
          const leader = leaderKey(row);
          return (
            <div
              key={ri}
              className="rounded-md border border-parchment/70 bg-cream-75 px-4 py-3"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide text-cocoa-700">
                {row.label}
              </div>
              {hasText(row.hint) ? (
                <div className="mt-0.5 text-[11px] text-cocoa-700">{row.hint}</div>
              ) : null}
              <dl className="mt-2.5 space-y-2">
                {cols.map((c) => {
                  const disp = row.cells[c.key];
                  const blank = !hasText(disp);
                  const isLeader = leader === c.key;
                  return (
                    <div key={c.key} className="flex items-baseline justify-between gap-3">
                      <dt className="min-w-0 text-sm text-cocoa-500">
                        <span className="block truncate font-medium text-ink-900">{c.label}</span>
                        {hasText(c.sub) ? (
                          <span className="block truncate text-[11px] text-cocoa-700">{c.sub}</span>
                        ) : null}
                      </dt>
                      <dd
                        className={[
                          "shrink-0 text-right text-sm tabular-nums",
                          blank
                            ? "text-cocoa-700"
                            : isLeader
                              ? "font-semibold text-atlas-700"
                              : "text-ink-900",
                        ].join(" ")}
                      >
                        {blank ? DASH : disp}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
      </div>

      {hasText(footnote) ? (
        <p className="mt-3 text-[11px] text-cocoa-700">{footnote}</p>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* WageRangeTracks - one role/place per row, rail + fill + median tick.*/
/* ------------------------------------------------------------------ */

export type WageTrack = {
  label: string;
  low?: number | null;
  median?: number | null;
  high?: number | null;
};

export function WageRangeTracks({
  tracks,
  format,
  className,
}: {
  tracks: WageTrack[];
  format: (n: number) => string;
  className?: string;
}) {
  const rows = (tracks ?? []).filter(
    (t) => hasText(t.label) && (isNum(t.low) || isNum(t.median) || isNum(t.high)),
  );
  if (rows.length === 0) return null;

  const lows = rows.map((r) => r.low).filter(isNum) as number[];
  const highs = rows.map((r) => r.high).filter(isNum) as number[];
  const meds = rows.map((r) => r.median).filter(isNum) as number[];
  const lo = Math.min(...[...lows, ...meds]);
  const hi = Math.max(...[...highs, ...meds]);
  const span = hi > lo ? hi - lo : 1;
  const pct = (v: number) => `${((v - lo) / span) * 100}%`;

  return (
    <ul className={["space-y-3.5", className].filter(Boolean).join(" ")}>
      {rows.map((r, i) => {
        const left = isNum(r.low) ? r.low : isNum(r.median) ? r.median : null;
        const right = isNum(r.high) ? r.high : isNum(r.median) ? r.median : null;
        const showRail = isNum(left) && isNum(right) && right > left;
        const label = isNum(r.median)
          ? format(r.median)
          : isNum(r.low) && isNum(r.high)
            ? `${format(r.low)} to ${format(r.high)}`
            : isNum(r.low)
              ? format(r.low)
              : isNum(r.high)
                ? format(r.high)
                : "";
        return (
          <li key={i}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-ink-900">{r.label}</span>
              <span className="font-display text-sm font-semibold tabular-nums text-ink-900">
                {label}
              </span>
            </div>
            {showRail ? (
              <div className="relative mt-1.5 h-2 w-full rounded-full bg-cream-300">
                <div
                  className="absolute top-0 h-2 rounded-full bg-cocoa-300"
                  style={{ left: pct(left!), right: `calc(100% - ${pct(right!)})` }}
                />
                {isNum(r.median) ? (
                  <div
                    className="absolute top-[-2px] h-3 w-[2.5px] rounded-full bg-atlas-500"
                    style={{ left: pct(r.median) }}
                  />
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
