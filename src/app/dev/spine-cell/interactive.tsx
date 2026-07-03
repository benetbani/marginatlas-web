"use client";
/**
 * Client interactives for the cell page that are NOT part of the money-chapter
 * subtype propagation: the sortable Nearby comparison table (click-to-sort +
 * inline magnitude bars), the Wages table behind a disclosure, and the Risks
 * behind a disclosure. Kept out of money-chapter.tsx because they do not read the
 * FormatContext. All prose from the seed.
 */
import * as React from "react";
import { Box, Head, Rail, Fig, TERRA, TRACK, InlineDisclosure } from "@/components/spine/kit";

const money = (v: number) => (v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" : "$" + Math.round(v / 1000) + "K");

type Col = { key: string; label: string; unit: string; get: (x: any) => number; cell: (v: number) => string };

/* Nearby , WI-4 brief:
 * decision: how this place compares to peer cities on the same trade. Number: owner-keeps per place.
 * focal: the comparison table with inline micro-bars so magnitude reads at a glance; click-to-sort.
 * width: Full. terracotta target: the best figure per column (bold text) + its micro-bar.
 * The home place is tinted, never ranked. No fabricated cells. */
export function Nearby({ d }: { d: any }) {
  const cols: Col[] = [
    { key: "rev", label: "Turnover", unit: "$/yr", get: (x) => x.rev_p50_usd, cell: (v) => money(v) },
    { key: "take", label: "Owner keeps", unit: "$/yr", get: (x) => x.take_home_usd, cell: (v) => money(v) },
    { key: "brk", label: "Ease of entry", unit: "/100", get: (x) => x.break_in_0_100, cell: (v) => "" + v },
  ];
  const rows: any[] = d.nearby?.places ?? [];
  const [sortKey, setSortKey] = React.useState<string>("take");
  const col = cols.find((c) => c.key === sortKey) ?? cols[1];
  const best: Record<string, number> = {};
  cols.forEach((c) => (best[c.key] = Math.max(...rows.map((r) => c.get(r)))));
  const maxByCol: Record<string, number> = {};
  cols.forEach((c) => (maxByCol[c.key] = Math.max(...rows.map((r) => c.get(r))) || 1));
  const sorted = [...rows].sort((a, b) => col.get(b) - col.get(a));

  return (
    <Box>
      <Head icon="compare">The same trade, comparable places</Head>
      <div className="mb-3 text-[12.5px] text-[var(--c-ink2)]">{d.nearby?.surface_line}</div>
      {/* sm+ header with click-to-sort */}
      <div className="hidden grid-cols-[1.3fr_1fr_1fr_1fr] gap-3 border-b border-[var(--c-border)] pb-2 sm:grid">
        <span className="text-[10.5px] font-semibold uppercase tracking-wide text-[var(--c-muted)]">Place</span>
        {cols.map((c) => {
          const on = c.key === sortKey;
          return (
            <button key={c.key} type="button" onClick={() => setSortKey(c.key)} aria-sort={on ? "descending" : "none"}
              className={`flex items-center justify-end gap-1 text-[10.5px] font-semibold uppercase tracking-wide transition-colors ${on ? "text-[var(--terra-text)]" : "text-[var(--c-muted)] hover:text-[var(--c-ink2)]"}`}>
              <span>{c.label} <span className="font-normal lowercase tracking-normal">({c.unit})</span></span>
              <span aria-hidden className={`fig text-[10px] ${on ? "opacity-100" : "opacity-30"}`}>{on ? "↓" : "↕"}</span>
            </button>
          );
        })}
      </div>
      <div className="space-y-2 sm:space-y-0">
        {sorted.map((r) => (
          <div key={r.name} className="celltop group relative rounded-md border border-[var(--c-border)] p-3 sm:grid sm:grid-cols-[1.3fr_1fr_1fr_1fr] sm:items-center sm:gap-3 sm:rounded-none sm:border-0 sm:border-b sm:p-0 sm:py-2.5"
            style={r.home ? { background: "#fff4f1" } : undefined}>
            <span className="block min-w-0 truncate font-medium text-[var(--c-ink)]">{r.name}{r.home ? <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--terra-text)]">here</span> : null}</span>
            <div className="mt-2 grid grid-cols-3 gap-3 sm:contents sm:mt-0">
              {cols.map((c) => {
                const v = c.get(r);
                const isBest = v === best[c.key];
                return (
                  <div key={c.key} className="min-w-0 sm:text-right">
                    <span className="block text-[9.5px] uppercase tracking-wide text-[var(--c-muted)] sm:hidden">{c.label}</span>
                    <Fig className={`text-[13px] ${isBest ? "font-bold text-[var(--terra-text)]" : "text-[var(--c-ink)]"}`}>{c.cell(v)}</Fig>
                    {/* inline magnitude bar , length encodes the number so "big turnover, thin keep" reads at a glance */}
                    <span className="mt-1 block h-1.5 overflow-hidden rounded-full sm:ml-auto sm:w-full" style={{ background: TRACK }}>
                      <span className="block h-full rounded-full" style={{ width: `${Math.max(4, (v / maxByCol[c.key]) * 100)}%`, background: isBest ? TERRA : "#c8c8c6" }} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
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
      {top ? <div className="mt-2 text-[11px] text-[var(--c-muted)]">Typical mid pay a year. The {top.role.toLowerCase()} is the ceiling everyone else sits below.</div> : null}
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

/* Risks , WI-3 brief:
 * decision: what actually closes these kitchens. Number: the top risk score.
 * focal: the leading risk on a shared scale; the rest + detail behind a disclosure.
 * width: rail half. terracotta target: the leading risk's fill only. */
export function Risks({ d }: { d: any }) {
  const arr: any[] = d.risks?.items ?? [];
  const top = arr[0];
  return (
    <Box className="md:flex-[2]">
      <Rail icon="watch" kicker="What to watch" verdict={d.risks?.surface_line} />
      {top ? (
        <div className="mb-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[13px] font-medium text-[var(--c-ink)]">{top.name}</span>
            <Fig className="text-[13px] text-[var(--terra-text)]">{top.score_1_10}/10</Fig>
          </div>
          <span className="mt-1 block h-2 overflow-hidden rounded-full" style={{ background: TRACK }}>
            <span className="block h-full rounded-full" style={{ width: `${(top.score_1_10 / 10) * 100}%`, background: TERRA }} />
          </span>
          <div className="mt-1.5 text-[11.5px] leading-snug text-[var(--c-ink2)]">{top.note}</div>
        </div>
      ) : null}
      <InlineDisclosure name="risks" summary="See the other risks">
        <div className="mt-2 space-y-2.5 border-t border-[var(--c-border)] pt-2.5">
          {arr.slice(1).map((r) => (
            <div key={r.name}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12.5px] text-[var(--c-ink2)]">{r.name}</span>
                <Fig className="text-[12px] text-[var(--c-ink)]">{r.score_1_10}/10</Fig>
              </div>
              <span className="mt-1 block h-1.5 overflow-hidden rounded-full" style={{ background: TRACK }}>
                <span className="block h-full rounded-full" style={{ width: `${(r.score_1_10 / 10) * 100}%`, background: "#c8c8c6" }} />
              </span>
            </div>
          ))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}
