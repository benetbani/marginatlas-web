"use client";
/**
 * Client interactives for the cell page that are NOT part of the money-chapter
 * subtype propagation: the sortable Nearby comparison table (click-to-sort, a
 * keeps-per-$1 rate column proving the section's own verdict; figures + bold-best
 * only, the in-cell bars are gone per rulebook v1 sections 22/25), the Wages
 * mid-pay figures + track-free range brackets (permanently visible, rulebook v2
 * S6), and the Risks dot plot on a shared labeled 0-10 scale. Kept out
 * of money-chapter.tsx
 * because they do not read the FormatContext. All prose from the seed.
 */
import * as React from "react";
import { Box, Rail, Fig, EaseScale, InlineDisclosure, usd } from "@/components/spine/kit";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

type Col = { key: string; label: string; unit: string; get: (x: any) => number; cell: (v: number) => string };

/* Nearby , WI-4 brief (enriched, Final Ascent; rulebook v2 corrections 2026-07-10
 * drop the hand-rolled surface_line div , a verdict outside Rail that claimed "keeps
 * the least per dollar"): the table CARRIES that claim itself, needing no sentence
 * to assert it , a sortable keeps-per-$1 column (take over turnover, in cents),
 * default sort, proves it directly. The in-cell CellScaleBars are DELETED
 * (rulebook v1 sections 22/25, founder G2/G11: figures + bold-best carry each
 * column's winner; a table you read like a sentence, not a chart you study).
 * terracotta target: ONE , the keeps-per-$1 winner's figure. Best in the other
 * columns is semibold ink; the sort header, HERE tag and row tint are ink/neutral chrome. */
export function Nearby({ d }: { d: any }) {
  const rows: any[] = d.nearby?.places ?? [];
  // Column presence: keep only the columns for which EVERY row carries a real
  // value. On promotion the peers hold name + turnover only (no honest per-peer
  // take-home / break-in), so those columns , and the derived keeps-per-$1 ,
  // drop out; the full seed keeps all four. Turnover is always present.
  const hasTake = rows.length > 0 && rows.every((r) => typeof r.take_home_usd === "number");
  const hasBrk = rows.length > 0 && rows.every((r) => typeof r.break_in_0_100 === "number");
  const cols: Col[] = [
    { key: "rev", label: "Turnover", unit: "$/yr", get: (x) => x.rev_p50_usd, cell: (v) => money(v) },
    ...(hasTake ? [{ key: "take", label: "Owner keeps", unit: "$/yr", get: (x: any) => x.take_home_usd, cell: (v: number) => money(v) } as Col] : []),
    ...(hasTake ? [{ key: "rate", label: "Keeps per $1", unit: "c", get: (x: any) => (x.rev_p50_usd ? (x.take_home_usd / x.rev_p50_usd) * 100 : 0), cell: (v: number) => v.toFixed(1) + "c" } as Col] : []),
    ...(hasBrk ? [{ key: "brk", label: "Ease of entry", unit: "/10", get: (x: any) => x.break_in_0_100, cell: (v: number) => "" + Math.round(v / 10) } as Col] : []),
  ];
  // Default sort: keeps-per-$1 when present (proves the section's verdict),
  // else turnover. Never a key that no longer exists.
  const defaultSort = hasTake ? "rate" : "rev";
  const [sortKey, setSortKey] = React.useState<string>(defaultSort);
  const col = cols.find((c) => c.key === sortKey) ?? cols[0];
  const best: Record<string, number> = {};
  cols.forEach((c) => (best[c.key] = Math.max(...rows.map((r) => c.get(r)))));
  const sorted = [...rows].sort((a, b) => col.get(b) - col.get(a));
  // Grid template adapts to the live column count (place + N metric columns), so
  // a promoted table with turnover only reads as a clean two-column list rather
  // than a five-slot grid with three empty tracks.
  const gridCols = `1.3fr ${cols.map(() => "1fr").join(" ")}`;

  return (
    <Box>
      {/* same section-opener treatment as sibling cards (Rail kicker, not a bold Head) */}
      <Rail icon="compare" kicker="The same trade, comparable places" />
      {/* sm+ header with click-to-sort (active = ink; selection is chrome, never the accent) */}
      <div className="hidden gap-3 border-b border-[var(--c-border)] pb-2 sm:grid" style={{ gridTemplateColumns: gridCols }}>
        <span className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Place</span>
        {cols.map((c) => {
          const on = c.key === sortKey;
          return (
            <button key={c.key} type="button" onClick={() => setSortKey(c.key)} aria-sort={on ? "descending" : "none"}
              className={`flex items-center justify-end gap-1 text-[10.5px] font-semibold uppercase tracking-wide transition-colors ${on ? "text-[var(--c-ink)]" : "text-[var(--c-muted)] hover:text-[var(--c-ink2)]"}`}>
              <span>{c.label} <span className="font-normal lowercase tracking-normal">({c.unit})</span></span>
              <span aria-hidden className={`fig text-[10px] ${on ? "opacity-100" : "opacity-30"}`}>{on ? "↓" : "↕"}</span>
            </button>
          );
        })}
      </div>
      <div className="space-y-2 sm:space-y-0">
        {sorted.map((r) => (
          <div key={r.name} className="group relative rounded-md border border-[var(--c-border)] p-3 sm:grid sm:items-center sm:gap-3 sm:rounded-none sm:border-0 sm:border-b sm:p-0 sm:py-2.5"
            style={{ ...(r.home ? { background: "var(--c-soft)" } : {}), gridTemplateColumns: gridCols }}>
            <span className="block min-w-0 truncate font-medium text-[var(--c-ink)]">{r.name}{r.home ? <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">here</span> : null}</span>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 sm:contents sm:mt-0">
              {cols.map((c) => {
                const v = c.get(r);
                const isBest = v === best[c.key];
                const crowned = c.key === "rate" && isBest; // the ONE terracotta accent in this card
                return (
                  <div key={c.key} className="min-w-0 sm:text-right">
                    <span className="block text-[9.5px] uppercase tracking-wide text-[var(--c-muted)] sm:hidden">{c.label}</span>
                    <Fig className={`text-[13px] ${crowned ? "font-semibold text-[var(--terra-text)]" : isBest ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink)]"}`}>{c.cell(v)}</Fig>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[11px] text-[var(--c-muted)]">
        {hasTake
          ? "Keeps per $1: the owner’s yearly take for every dollar of turnover. Same trade, same country, read like for like."
          : "Same trade, same country, read like for like."}
      </div>
    </Box>
  );
}

/* Wages , WI-4 brief (rulebook v1 sections 25/37, founder G2/G4, 2026-07-11):
 * decision: the payroll you budget against. Leads with the three at-a-glance
 * mid-pay figures (the July-3 lead read, figures only, no summary bars). The full
 * per-role range plot stays PERMANENTLY VISIBLE below (rulebook v2 S6, a chart
 * never hides behind a disclosure) but its filled tracks are gone: each row is a
 * track-free range bracket , low/high end ticks joined by a hairline, mid dot.
 * width: rail half. terracotta target: none (a head-chef row is a roster
 * position, not an answer; the figures are the read). */
export function Wages({ d }: { d: any }) {
  const roles: any[] = d.wages?.roles ?? [];
  if (roles.length === 0) return null;
  const max = Math.max(1, ...roles.map((r) => r.high_usd)) * 1.05;
  const kUsd = (v: number) => `$${Math.round(v / 1000)}K`;
  return (
    <Box className="md:flex-[3]">
      <Rail icon="wages" kicker="What you would pay your team" />
      {/* the three mid-pay figures, first (the at-a-glance read) */}
      <div className="mt-1 space-y-1.5">
        {roles.slice(0, 3).map((r) => (
          <div key={r.role} className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink2)]">{r.role}</span>
            <Fig className="text-[14px] text-[var(--c-ink)]">{kUsd(r.mid_usd)}</Fig>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[11px] text-[var(--c-muted)]">Typical mid pay a year; the full spread by role sits below.</div>
      {/* the full spread, always visible: track-free range brackets (low tick, high tick, mid dot) */}
      <div className="mt-3 space-y-3 border-t border-[var(--c-border)] pt-3">
        {roles.map((r) => {
          const L = (r.low_usd / max) * 100, W = ((r.high_usd - r.low_usd) / max) * 100, M = (r.mid_usd / max) * 100;
          return (
            <div key={r.role} className="grid grid-cols-[120px_1fr_56px] items-center gap-3">
              <span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink2)]">{r.role}</span>
              <div className="relative h-3.5" role="img" aria-label={`${r.role} ${kUsd(r.low_usd)} to ${kUsd(r.high_usd)}, typically ${kUsd(r.mid_usd)}`}>
                <div aria-hidden className="absolute top-1/2 h-px -translate-y-1/2" style={{ left: `${L}%`, width: `${W}%`, background: "#9a9a9a" }} />
                <div aria-hidden className="absolute top-1/2 h-2 w-px -translate-y-1/2" style={{ left: `${L}%`, background: "#9a9a9a" }} />
                <div aria-hidden className="absolute top-1/2 h-2 w-px -translate-y-1/2" style={{ left: `calc(${(L + W).toFixed(2)}% - 1px)`, background: "#9a9a9a" }} />
                <div aria-hidden className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white" style={{ left: `${M}%`, borderColor: "#9a9a9a" }} />
              </div>
              <Fig className="text-right text-[14px] text-[var(--c-ink)]">{kUsd(r.mid_usd)}</Fig>
            </div>
          );
        })}
      </div>
    </Box>
  );
}

/* Risks , WI-3 brief (enriched, Final Ascent):
 * decision: what actually closes these kitchens. ALL FOUR scores visible on ONE shared
 * labeled scale, flipped to the PAGE scale (high = good): each danger score becomes a
 * safety read (safe = 11 - score, clamped 1..10), most-dangerous first, so the /10
 * convention means the same thing everywhere on the page. Notes sit behind the
 * disclosure. width: rail half. terracotta target: none (ink markers; the set is the read). */
export function Risks({ d }: { d: any }) {
  const arr: any[] = d.risks?.items ?? [];
  if (arr.length === 0) return null;
  const rows = arr
    .map((r) => ({ r, safe: Math.max(1, Math.min(10, 11 - r.score_1_10)) }))
    .sort((a, b) => a.safe - b.safe)
    .map(({ r, safe }) => [r.name, (safe / 10) * 100, `${safe}/10`]) as Array<[string, number, string, string?]>;
  return (
    <Box className="md:flex-[2]">
      <Rail icon="watch" kicker="What to watch" verdict={d.risks?.surface_line} />
      <div className="mt-1"><EaseScale rows={rows} endLabels={["Riskier", "Safer"]} /></div>
      <InlineDisclosure name="risks" summary="What each risk does">
        <div className="mt-2 space-y-2 border-t border-[var(--c-border)] pt-2.5">
          {arr.map((r) => (
            <div key={r.name} className="grid grid-cols-[120px_1fr] items-baseline gap-3">
              <span className="text-[12px] font-medium text-[var(--c-ink)]">{r.name}</span>
              <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{r.note}</span>
            </div>
          ))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}
