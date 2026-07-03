"use client";
/**
 * Client interactives for the cell page that are NOT part of the money-chapter
 * subtype propagation: the sortable Nearby comparison table (click-to-sort, a
 * keeps-per-$1 rate column proving the section's own verdict, CellScaleBar in-cell
 * bars on a drawn domain), the Wages ranked bars + range-plot disclosure, and the
 * Risks dot plot on a shared labeled 0-10 scale. Kept out of money-chapter.tsx
 * because they do not read the FormatContext. All prose from the seed.
 */
import * as React from "react";
import { Box, Rail, Fig, TERRA, TRACK, EaseScale, InlineDisclosure, usd } from "@/components/spine/kit";
import { CellScaleBar } from "@/components/spine/kit-index";

const money = usd; // ONE money grammar page-set-wide (kit usd: $43K / $1.4M)

type Col = { key: string; label: string; unit: string; get: (x: any) => number; cell: (v: number) => string };

/* Nearby , WI-4 brief (enriched, Final Ascent):
 * decision: how this place compares to peer cities on the same trade. The verdict claims
 * "keeps the least per dollar", so the table now CARRIES that metric: a sortable
 * keeps-per-$1 column (take over turnover, in cents), default sort. In-cell bars are
 * CellScaleBar (drawn 0-max domain with a visible baseline tick).
 * terracotta target: ONE , the keeps-per-$1 winner's figure + bar. Best in the other
 * columns is bold ink; the sort header, HERE tag and row tint are ink/neutral chrome. */
export function Nearby({ d }: { d: any }) {
  const cols: Col[] = [
    { key: "rev", label: "Turnover", unit: "$/yr", get: (x) => x.rev_p50_usd, cell: (v) => money(v) },
    { key: "take", label: "Owner keeps", unit: "$/yr", get: (x) => x.take_home_usd, cell: (v) => money(v) },
    { key: "rate", label: "Keeps per $1", unit: "c", get: (x) => (x.rev_p50_usd ? (x.take_home_usd / x.rev_p50_usd) * 100 : 0), cell: (v) => v.toFixed(1) + "c" },
    { key: "brk", label: "Ease of entry", unit: "/100", get: (x) => x.break_in_0_100, cell: (v) => "" + v },
  ];
  const rows: any[] = d.nearby?.places ?? [];
  const [sortKey, setSortKey] = React.useState<string>("rate");
  const col = cols.find((c) => c.key === sortKey) ?? cols[2];
  const best: Record<string, number> = {};
  cols.forEach((c) => (best[c.key] = Math.max(...rows.map((r) => c.get(r)))));
  const maxByCol: Record<string, number> = {};
  cols.forEach((c) => (maxByCol[c.key] = Math.max(...rows.map((r) => c.get(r))) || 1));
  const sorted = [...rows].sort((a, b) => col.get(b) - col.get(a));

  return (
    <Box>
      {/* same section-opener treatment as sibling cards (Rail kicker, not a bold Head) */}
      <Rail icon="compare" kicker="The same trade, comparable places" />
      <div className="mb-3 text-[12.5px] text-[var(--c-ink2)]">{d.nearby?.surface_line}</div>
      {/* sm+ header with click-to-sort (active = ink; selection is chrome, never the accent) */}
      <div className="hidden grid-cols-[1.3fr_1fr_1fr_1fr_1fr] gap-3 border-b border-[var(--c-border)] pb-2 sm:grid">
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
          <div key={r.name} className="celltop group relative rounded-md border border-[var(--c-border)] p-3 sm:grid sm:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] sm:items-center sm:gap-3 sm:rounded-none sm:border-0 sm:border-b sm:p-0 sm:py-2.5"
            style={r.home ? { background: "#fff4f1" } : undefined}>
            <span className="block min-w-0 truncate font-medium text-[var(--c-ink)]">{r.name}{r.home ? <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">here</span> : null}</span>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2 sm:contents sm:mt-0">
              {cols.map((c) => {
                const v = c.get(r);
                const isBest = v === best[c.key];
                const crowned = c.key === "rate" && isBest; // the ONE terracotta accent in this card
                return (
                  <div key={c.key} className="min-w-0 sm:text-right">
                    <span className="block text-[9.5px] uppercase tracking-wide text-[var(--c-muted)] sm:hidden">{c.label}</span>
                    <Fig className={`text-[13px] ${crowned ? "font-bold text-[var(--terra-text)]" : isBest ? "font-bold text-[var(--c-ink)]" : "text-[var(--c-ink)]"}`}>{c.cell(v)}</Fig>
                    {/* in-cell bar on a DRAWN 0-max domain (baseline tick visible) */}
                    <CellScaleBar value={v} domain={[0, maxByCol[c.key]]} accent={crowned} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[11px] text-[var(--c-muted)]">Keeps per $1: the owner&rsquo;s yearly take for every dollar of turnover. Same trade, same country, read like for like.</div>
    </Box>
  );
}

/* Wages , WI-4 brief:
 * decision: the payroll you budget against. Number: the head-chef ceiling.
 * focal: the head-chef pay, with the full role table behind a disclosure (progressive disclosure).
 * width: rail half. terracotta target: the head-chef range bar only. */
export function Wages({ d }: { d: any }) {
  const roles: any[] = d.wages?.roles ?? [];
  const max = Math.max(1, ...roles.map((r) => r.high_usd)) * 1.05;
  const top = roles[0];
  // a tiny ranked list of the key roles (chef / manager / line cook ...) so the
  // payroll reads as a shape, not one lonely number. terracotta on the top role only.
  const topRoles = roles.slice(0, 3);
  const kMid = Math.max(1, ...topRoles.map((r) => r.mid_usd));
  return (
    <Box className="md:flex-[3]">
      <Rail icon="wages" kicker="What you would pay your team" verdict={d.wages?.surface_line} />
      {topRoles.length ? (
        <div className="mt-1 space-y-2">
          {topRoles.map((r, i) => {
            const lead = i === 0;
            return (
              <div key={r.role} className="grid grid-cols-[104px_1fr_44px] items-center gap-3">
                <span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink2)]">{r.role}</span>
                <span className="h-1.5 overflow-hidden rounded-full" style={{ background: TRACK }}>
                  <span className="block h-full rounded-full" role="img" aria-label={`${r.role} about $${Math.round(r.mid_usd / 1000)}K`} style={{ width: `${Math.max(8, (r.mid_usd / kMid) * 100)}%`, background: lead ? TERRA : "#c8c8c6" }} />
                </span>
                <Fig className={`text-right text-[13px] ${lead ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>${Math.round(r.mid_usd / 1000)}K</Fig>
              </div>
            );
          })}
        </div>
      ) : null}
      {top ? <div className="mt-2 text-[11px] text-[var(--c-muted)]">Typical mid pay a year; the full spread by role sits below.</div> : null}
      <InlineDisclosure name="wages" summary="See the full pay table">
        <div className="mt-3 space-y-3">
          {roles.map((r, i) => {
            const L = (r.low_usd / max) * 100, W = ((r.high_usd - r.low_usd) / max) * 100, M = (r.mid_usd / max) * 100;
            const lead = i === 0;
            return (
              <div key={r.role} className="grid grid-cols-[120px_1fr_56px] items-center gap-3">
                <span className="min-w-0 truncate text-[12.5px] text-[var(--c-ink2)]">{r.role}</span>
                <div className="relative h-3.5">
                  <div className="absolute top-1/2 h-0.5 w-full -translate-y-1/2 rounded" style={{ background: "#e3e3e3" }} />
                  <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded" style={{ left: `${L}%`, width: `${W}%`, background: lead ? TERRA : "#c8c8c6" }} />
                  <div className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white" style={{ left: `${M}%`, borderColor: lead ? TERRA : "#9a9a9a" }} />
                </div>
                <Fig className="text-right text-[14px] text-[var(--c-ink)]">${Math.round(r.mid_usd / 1000)}K</Fig>
              </div>
            );
          })}
        </div>
      </InlineDisclosure>
    </Box>
  );
}

/* Risks , WI-3 brief (enriched, Final Ascent):
 * decision: what actually closes these kitchens. ALL FOUR scores visible on ONE shared
 * labeled 0-10 scale (a dot plot: hiding three of four scores bought no focus, just an
 * empty card bottom); the notes sit behind the disclosure. Descending seed order keeps
 * the sort monotonic. Score notation is the tight n/10 (one slash convention page-wide).
 * width: rail half. terracotta target: none (ink markers; the whole set is the read). */
export function Risks({ d }: { d: any }) {
  const arr: any[] = d.risks?.items ?? [];
  if (arr.length === 0) return null;
  const rows = arr.map((r) => [r.name, (r.score_1_10 / 10) * 100, `${r.score_1_10}/10`]) as Array<[string, number, string, string?]>;
  return (
    <Box className="md:flex-[2]">
      <Rail icon="watch" kicker="What to watch" verdict={d.risks?.surface_line} />
      <div className="mt-1"><EaseScale rows={rows} endLabels={["Mild", "Severe"]} /></div>
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
