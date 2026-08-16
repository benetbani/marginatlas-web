"use client";

/**
 * WeightedCompare - a personalized comparison grid with live weighting.
 *
 * Each metric row carries a weight (0..100, "how much you care") on the kit
 * Slider, plus a lock. Columns (places / scenarios) re-rank live as weights
 * move: each metric is normalized 0..1 by its own better-direction, then a
 * weighted average gives every column a 0..100 score. A weighted-total row and
 * a one-line verdict re-settle with the weights.
 *
 * Agency principles: P1 the controls act on the visible scores in place; P2 no
 * Apply button, the re-rank is live; P3 every weight lives in the URL via
 * useUrlStateMap, so a reader can copy the address bar and land on the exact
 * same personalized ranking, and Back rewinds one change at a time.
 *
 * It NEVER crowns across a true tie, and refuses to call a "winner" when no
 * metric is weighted. Filled, empty (self-omits with < 2 columns), and 375px
 * stacked states. Tokens only, no em-dashes, no source-agency names. Figures
 * are tabular.
 */
import * as React from "react";
import { cn } from "@/lib/utils";
import { useUrlStateMap, type UrlStateField } from "@/lib/url_state";
import { Slider } from "../controls/Slider";
import { DASH, hasText, isNum, TableShell } from "./helpers";

export type WeightedColumn = {
  key: string;
  label: string;
  flag?: string;
  subject?: boolean;
};

export type WeightedMetric = {
  /** Stable key (also the URL weight key, prefixed). */
  key: string;
  label: string;
  /** "high" (higher is better) or "low" (lower is better). Default high. */
  better?: "high" | "low";
  /** Comparable numbers per column key. */
  values: Record<string, number | null | undefined>;
  /** Format a held value for display. Defaults to String(). */
  format?: (n: number) => string;
  /** Starting weight 0..100 (default 50). */
  initialWeight?: number;
};

export type WeightedCompareProps = {
  columns: WeightedColumn[];
  metrics: WeightedMetric[];
  eyebrow?: string;
  heading?: string;
  lede?: string;
  /** URL key prefix so multiple grids on a page do not collide. Default "w". */
  urlKeyPrefix?: string;
  framed?: boolean;
  id?: string;
  className?: string;
};

const clampWeight = (n: number) => Math.max(0, Math.min(100, Math.round(n / 5) * 5));

export function WeightedCompare({
  columns,
  metrics,
  eyebrow,
  heading,
  lede,
  urlKeyPrefix = "w",
  framed = true,
  id,
  className,
}: WeightedCompareProps) {
  const cols = (columns ?? []).filter((c) => hasText(c.key) && hasText(c.label));
  const mets = (metrics ?? []).filter((m) => hasText(m.key) && hasText(m.label));

  // Build a URL-state field per metric weight + per metric lock. Declared from
  // the metrics list; stable across renders for a given metric set.
  const fields = React.useMemo(() => {
    const f: Record<string, UrlStateField<number | boolean>> = {};
    for (const m of mets) {
      f[`${urlKeyPrefix}_${m.key}`] = {
        parse: (raw) => (raw == null ? clampWeight(m.initialWeight ?? 50) : clampWeight(Number(raw))),
        serialize: (v) => {
          const def = clampWeight(m.initialWeight ?? 50);
          return v === def ? null : String(v);
        },
        fallback: clampWeight(m.initialWeight ?? 50),
      } as UrlStateField<number | boolean>;
      f[`${urlKeyPrefix}lk_${m.key}`] = {
        parse: (raw) => raw === "1",
        serialize: (v) => (v ? "1" : null),
        fallback: false,
      } as UrlStateField<number | boolean>;
    }
    return f as {
      [k: string]: UrlStateField<number | boolean>;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKeyPrefix, mets.map((m) => m.key).join("|")]);

  const { values, set } = useUrlStateMap<Record<string, number | boolean>>(fields);

  const weightOf = (m: WeightedMetric) => Number(values[`${urlKeyPrefix}_${m.key}`] ?? 50);
  const lockOf = (m: WeightedMetric) => Boolean(values[`${urlKeyPrefix}lk_${m.key}`]);

  // Score every column 0..100 from the live weights.
  const { totals, rankByKey, leadKey, anyWeight } = React.useMemo(() => {
    const totalW = mets.reduce((a, m) => a + weightOf(m), 0);
    const totalsArr = cols.map((c) => {
      let sum = 0;
      for (const m of mets) {
        const present = cols
          .map((cc) => m.values[cc.key])
          .filter((v): v is number => isNum(v));
        if (present.length === 0) continue;
        const lo = Math.min(...present);
        const hi = Math.max(...present);
        const span = hi - lo || 1;
        const v = m.values[c.key];
        if (!isNum(v)) continue;
        let s = (v - lo) / span;
        if (m.better === "low") s = 1 - s;
        sum += s * weightOf(m);
      }
      return { key: c.key, score: totalW > 0 ? Math.round((sum / totalW) * 100) : 0 };
    });
    const ranked = [...totalsArr].sort((a, b) => b.score - a.score);
    const rbk: Record<string, number> = {};
    ranked.forEach((t, i) => {
      rbk[t.key] = i;
    });
    // A true tie at the top has no single leader.
    const lead =
      totalW > 0 && ranked.length >= 2 && ranked[0].score > ranked[1].score ? ranked[0].key : null;
    return { totals: totalsArr, rankByKey: rbk, leadKey: lead, anyWeight: totalW > 0 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cols, mets, JSON.stringify(values)]);

  if (cols.length < 2 || mets.length === 0) return null;

  const scoreByKey: Record<string, number> = {};
  totals.forEach((t) => {
    scoreByKey[t.key] = t.score;
  });
  const winner = leadKey ? cols.find((c) => c.key === leadKey) : null;

  const verdict = winner ? (
    <>
      For what you care about,{" "}
      <strong className="font-bold text-atlas-700">
        {hasText(winner.flag) ? `${winner.flag} ` : ""}
        {winner.label} leads
      </strong>
      . Drag a weight, or lock one, and the ranking re-settles.
    </>
  ) : anyWeight ? (
    <>It is too close to call right now. Nudge a weight to separate them.</>
  ) : (
    <>Give a metric some weight to rank these.</>
  );

  return (
    <TableShell
      eyebrow={eyebrow}
      heading={heading}
      lede={lede}
      caption={verdict}
      framed={framed}
      id={id}
      className={className}
      ariaLabel="Weighted comparison"
    >
      {/* sm and up: metric + weight control + a score-per-column header */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse text-left" style={{ minWidth: "640px" }}>
          <thead>
            <tr className="border-b border-parchment align-bottom text-[13px] font-bold text-ink-900">
              <th scope="col" className="w-40 py-2 pr-4 text-left">
                Metric
              </th>
              <th scope="col" className="w-56 py-2 pr-6 text-left text-[11px] font-medium text-cocoa-700">
                Weight, how much you care
              </th>
              {cols.map((c) => {
                const lead = leadKey === c.key;
                const rank = rankByKey[c.key];
                return (
                  <th key={c.key} scope="col" className="px-3 py-2 text-right align-bottom">
                    <span
                      className={cn(
                        "inline-flex items-center justify-end gap-1.5",
                        lead ? "text-atlas-700" : "text-ink-900",
                      )}
                    >
                      {hasText(c.flag) ? <span aria-hidden="true">{c.flag}</span> : null}
                      {c.label}
                    </span>
                    <span className="block text-[11px] font-medium text-cocoa-700">
                      {!anyWeight ? "" : lead ? "leads now" : `#${rank + 1}`}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {mets.map((m) => {
              const w = weightOf(m);
              const locked = lockOf(m);
              return (
                <tr key={m.key} className="align-middle">
                  <th scope="row" className="py-3 pr-4 text-left align-middle text-[13.5px] font-medium text-ink-900">
                    {m.label}
                    <span className="block text-[11px] font-normal text-cocoa-700">
                      {m.better === "low" ? "lower is better" : "higher is better"}
                    </span>
                  </th>
                  <td className="py-3 pr-6 align-middle">
                    <div className="flex items-center gap-2">
                      <div className="min-w-0 flex-1">
                        <Slider
                          id={`${id ?? "wc"}-${m.key}`}
                          label={m.label}
                          min={0}
                          max={100}
                          step={5}
                          value={w}
                          format={(n) => String(n)}
                          onChange={(next) =>
                            !locked && set({ [`${urlKeyPrefix}_${m.key}`]: clampWeight(next) })
                          }
                          className={cn("[&_label]:sr-only [&_output]:sr-only", locked && "opacity-40")}
                        />
                      </div>
                      <LockButton
                        locked={locked}
                        label={m.label}
                        onToggle={() => set({ [`${urlKeyPrefix}lk_${m.key}`]: !locked })}
                      />
                    </div>
                  </td>
                  {cols.map((c) => {
                    const v = m.values[c.key];
                    const held = isNum(v);
                    const lead = leadKey === c.key;
                    return (
                      <td
                        key={c.key}
                        className={cn(
                          "px-3 py-3 text-right align-middle tabular-nums",
                          !held
                            ? "font-medium text-cocoa-700"
                            : lead
                              ? "font-bold text-atlas-700"
                              : "font-semibold text-ink-900",
                        )}
                      >
                        {held ? (m.format ? m.format(v) : String(v)) : DASH}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {/* weighted-total row */}
            <tr className="border-t border-parchment">
              <th scope="row" className="pt-4 pr-4 text-left align-bottom text-[13.5px] font-bold text-ink-900">
                Weighted score
                <span className="block text-[11px] font-normal text-cocoa-700">out of 100</span>
              </th>
              <td className="pt-4" />
              {cols.map((c) => {
                const lead = leadKey === c.key;
                return (
                  <td
                    key={c.key}
                    className={cn(
                      "px-3 pt-4 text-right align-bottom text-[17px] font-bold tabular-nums",
                      lead ? "text-atlas-700" : "text-ink-900",
                    )}
                  >
                    {anyWeight ? scoreByKey[c.key] : DASH}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* below sm: per-metric group (weight control + per-place figures), then
          the weighted-score group. No horizontal scroll. */}
      <div className="flex flex-col gap-[18px] sm:hidden">
        {mets.map((m) => {
          const w = weightOf(m);
          const locked = lockOf(m);
          return (
            <div key={m.key} className="border-t border-parchment pt-3 first:border-t-0 first:pt-0">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-ink-900">{m.label}</span>
                <span className="text-[11px] text-cocoa-700">
                  {m.better === "low" ? "lower is better" : "higher is better"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <Slider
                    id={`${id ?? "wc"}-m-${m.key}`}
                    label={`Weight for ${m.label}`}
                    min={0}
                    max={100}
                    step={5}
                    value={w}
                    suffix="weight"
                    format={(n) => String(n)}
                    onChange={(next) =>
                      !locked && set({ [`${urlKeyPrefix}_${m.key}`]: clampWeight(next) })
                    }
                    className={cn("[&_label]:sr-only", locked && "opacity-40")}
                  />
                </div>
                <LockButton
                  locked={locked}
                  label={m.label}
                  onToggle={() => set({ [`${urlKeyPrefix}lk_${m.key}`]: !locked })}
                />
              </div>
              <dl className="mt-2 space-y-0">
                {cols.map((c, ci) => {
                  const v = m.values[c.key];
                  const held = isNum(v);
                  const lead = leadKey === c.key;
                  return (
                    <div
                      key={c.key}
                      className={cn(
                        "flex items-baseline justify-between gap-4 py-1.5",
                        ci > 0 && "border-t border-parchment/60",
                      )}
                    >
                      <dt
                        className={cn(
                          "inline-flex items-center gap-1.5 text-[13px] font-medium",
                          lead ? "font-bold text-atlas-700" : "text-cocoa-700",
                        )}
                      >
                        {hasText(c.flag) ? <span aria-hidden="true">{c.flag}</span> : null}
                        {c.label}
                      </dt>
                      <dd
                        className={cn(
                          "shrink-0 text-right text-sm tabular-nums",
                          !held
                            ? "font-medium text-cocoa-700"
                            : lead
                              ? "font-bold text-atlas-700"
                              : "font-semibold text-ink-900",
                        )}
                      >
                        {held ? (m.format ? m.format(v) : String(v)) : DASH}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          );
        })}
        <div className="border-t border-parchment pt-3">
          <div className="mb-2 text-xs font-bold text-ink-900">
            Weighted score <span className="font-normal text-cocoa-700">out of 100</span>
          </div>
          <dl className="space-y-0">
            {cols.map((c, ci) => {
              const lead = leadKey === c.key;
              return (
                <div
                  key={c.key}
                  className={cn(
                    "flex items-baseline justify-between gap-4 py-1.5",
                    ci > 0 && "border-t border-parchment/60",
                  )}
                >
                  <dt
                    className={cn(
                      "inline-flex items-center gap-1.5 text-[13px] font-medium",
                      lead ? "font-bold text-atlas-700" : "text-cocoa-700",
                    )}
                  >
                    {hasText(c.flag) ? <span aria-hidden="true">{c.flag}</span> : null}
                    {c.label}
                  </dt>
                  <dd
                    className={cn(
                      "shrink-0 text-right text-base tabular-nums",
                      lead ? "font-bold text-atlas-700" : "font-bold text-ink-900",
                    )}
                  >
                    {anyWeight ? scoreByKey[c.key] : DASH}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </TableShell>
  );
}

/* ------------------------------------------------------------------ */
/* LockButton - holds a weight steady while others move.               */
/* ------------------------------------------------------------------ */

function LockButton({
  locked,
  label,
  onToggle,
}: {
  locked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={locked}
      aria-label={locked ? `Unlock weight for ${label}` : `Lock weight for ${label}`}
      title={locked ? "Locked" : "Lock this weight"}
      className={cn(
        "inline-flex h-11 w-9 shrink-0 items-center justify-center rounded-md",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        locked ? "text-atlas-700" : "text-cocoa-500 hover:text-atlas-700",
      )}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {locked ? (
          <path
            d="M6 11V8a6 6 0 0 1 12 0v3M5 11h14v9H5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M8 11V8a6 6 0 0 1 11.3-2.8M5 11h14v9H5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
