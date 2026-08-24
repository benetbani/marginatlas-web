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
import { Box, Rail, Fig, EaseScale, InfoTip, InlineDisclosure, usd } from "@/components/spine/kit";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      <Rail icon="compare" kicker="The same trade, comparable places" sample />
      {/* A REAL TABLE, because this is a real table.
          It was a grid of plain boxes: places down the side, metrics across the
          top, a header row, click-to-sort and a sorted-direction attribute, and
          not one table element in it. Measured before changing anything:
          FOUR sorted-direction attributes, all four sitting on buttons, where
          that attribute means nothing and is discarded.
          SIXTEEN column labels that vanish above 640 pixels. Each figure carries
          a small label naming its column, and that label is hidden on anything
          wider than a phone, because on a wide screen the column header does the
          naming. Except there was no column header, only a box that looked like
          one. So the desktop reading was a place name followed by four bare
          numbers: "Birmingham, $340K, $39K, 11.5c, 5". Nothing said which was
          which. The phone reading was better than the desktop one.
          The structure now carries the meaning: real column headers, a real row
          header per place, and the sort state on the header where it is read.
          The small labels stay for the phone layout, and above it the header
          does the work it was always drawn to look like it was doing. */}
      <Table className="text-[length:var(--t-small)]">
        <caption className="sr-only">
          The same trade in comparable places, sorted by {col.label.toLowerCase()}, highest first.
        </caption>
        <TableHeader className="hidden sm:table-header-group">
          <TableRow className="border-[var(--c-border)] hover:bg-transparent">
            <TableHead scope="col" className="h-auto w-[30%] px-0 pb-2 text-left text-[length:var(--t-micro)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">
              Place
            </TableHead>
            {cols.map((c) => {
              const on = c.key === sortKey;
              return (
                <TableHead
                  key={c.key}
                  scope="col"
                  aria-sort={on ? "descending" : "none"}
                  className="h-auto px-0 pb-2 text-right"
                >
                  <span className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setSortKey(c.key)}
                      className={`flex items-center gap-1 text-[length:var(--t-micro)] font-semibold uppercase tracking-wide transition-colors ${on ? "text-[var(--c-ink)]" : "text-[var(--c-muted)] hover:text-[var(--c-ink2)]"}`}
                    >
                      <span>{c.label} <span className="font-normal lowercase tracking-normal">({c.unit})</span></span>
                      <span aria-hidden className={`fig text-[length:var(--t-mark)] ${on ? "opacity-100" : "opacity-30"}`}>{on ? "↓" : "↕"}</span>
                    </button>
                    {/* rulebook 40: the coined "keeps per $1" metric carries its gloss as a "?"
                        InfoTip on the header (OUTSIDE the sort button, no nested buttons), which
                        replaces the glued definition caption that used to sit under the table. */}
                    {c.key === "rate" ? <InfoTip gloss="The owner's yearly take for every dollar of turnover." /> : null}
                  </span>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((r) => (
            <TableRow
              key={r.name}
              className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-md border border-[var(--c-border)] p-3 hover:bg-transparent sm:table-row sm:gap-0 sm:rounded-none sm:border-0 sm:border-b sm:p-0"
              style={r.home ? { background: "var(--c-soft)" } : undefined}
            >
              <TableHead
                scope="row"
                className="col-span-2 h-auto px-0 py-0 text-left text-[length:var(--t-body)] font-medium text-[var(--c-ink)] sm:table-cell sm:py-2.5 sm:align-middle"
              >
                <span className="block min-w-0 truncate">
                  {r.name}
                  {r.home ? <span className="ml-1.5 text-[length:var(--t-mark)] font-semibold uppercase tracking-wide text-[var(--c-muted)]">here</span> : null}
                </span>
              </TableHead>
              {cols.map((c) => {
                const v = c.get(r);
                const isBest = v === best[c.key];
                const crowned = c.key === "rate" && isBest; // the ONE terracotta accent in this card
                return (
                  <TableCell key={c.key} className="min-w-0 px-0 py-0 align-middle sm:table-cell sm:py-2.5 sm:text-right">
                    <span className="block text-[length:var(--t-mark)] uppercase tracking-wide text-[var(--c-muted)] sm:hidden">{c.label}</span>
                    <Fig className={`text-[length:var(--t-small)] ${crowned ? "font-semibold text-[var(--terra-text)]" : isBest ? "font-semibold text-[var(--c-ink)]" : "text-[var(--c-ink)]"}`}>{c.cell(v)}</Fig>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* the glued definition + "read like for like" instruction caption is DELETED
          (rulebook 26/40): the unit lives in the column header "(c)" and its InfoTip, and
          the section's own kicker already states the "same trade, comparable places" scope. */}
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
    <Box className="md:flex-[2]">
      <Rail icon="wages" kicker="What the team costs" sample />
      {/* FOUR RAW GREYS RETIRED, and the sizes put on the ladder. The grey was
          one step off the token this project already uses for a neutral mark,
          four values apart in one channel, so nothing visible moves.
          TWO THINGS DELIBERATELY LEFT, because fixing either changes what a
          reader reads and that is the founder's call, not this loop's:
          1. The low and the high exist ONLY in the description a screen reader
             hears. A sighted reader gets a bracket on a scale with no numbers on
             it, so neither end of the spread can be recovered. Printing them
             would add text to the card.
          2. RESOLVED 2026-08-24, and the note that stood here was measured and
             found false. It read: "the three figures at the top are printed AGAIN
             in the rows below, because the top block takes the first three roles
             and the rows take all of them. Removing the repeat takes a figure off
             the page."

             That holds on the BUNDLED SAMPLE, which carries five roles, so the top
             block previews three of five. EVERY REAL PAGE CARRIES EXACTLY THREE.
             The two blocks were therefore word for word identical on every page a
             reader can reach, and removing the top one takes nothing off the page
             at all.

             So the preview is now CONDITIONAL: it draws only when it actually
             previews something, which is when more roles exist than it shows. On
             the sample nothing moves. On a real page the duplicate is gone. */}
      {/* the three mid-pay figures, first (the at-a-glance read) */}
      {roles.length > 3 ? (
        <>
          <div className="mt-1 space-y-1.5">
            {roles.slice(0, 3).map((r) => (
              <div key={r.role} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-[length:var(--t-small)] text-[var(--c-ink2)]">{r.role}</span>
                <Fig className="text-[length:var(--t-body)] text-[var(--c-ink)]">{kUsd(r.mid_usd)}</Fig>
              </div>
            ))}
          </div>
          <div className="mt-2 text-[length:var(--t-micro)] text-[var(--c-muted)]">Typical mid pay a year.</div>
        </>
      ) : null}
      {/* the full spread, always visible: track-free range brackets (low tick, high tick, mid dot) */}
      <div className="mt-3 space-y-3 border-t border-[var(--c-border)] pt-3">
        {roles.map((r) => {
          const L = (r.low_usd / max) * 100, W = ((r.high_usd - r.low_usd) / max) * 100, M = (r.mid_usd / max) * 100;
          return (
            /* AT PHONE WIDTH THE BRACKET HAD FORTY PIXELS TO LIVE IN, and drew
               as a dot. The row gave a fixed 120 to the role and 56 to the
               figure, which on a 320 screen leaves the drawing almost nothing,
               so the one thing this card exists to show, the spread from lowest
               to highest pay, was not shown at all on the width most readers
               use. Caught by photographing it at 320, not by reading the code.
               Below the breakpoint the bracket now takes its own full-width line
               under the role and its figure. Above it, nothing moves. */
            <div key={r.role} className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-2 sm:grid-cols-[120px_1fr_56px] sm:items-center sm:gap-3">
              <span className="min-w-0 truncate text-[length:var(--t-small)] text-[var(--c-ink2)]">{r.role}</span>
              <Fig className="order-2 text-right text-[length:var(--t-body)] text-[var(--c-ink)] sm:order-3">{kUsd(r.mid_usd)}</Fig>
              <div className="order-3 col-span-2 relative h-3.5 sm:order-2 sm:col-span-1" role="img" aria-label={`${r.role} ${kUsd(r.low_usd)} to ${kUsd(r.high_usd)}, typically ${kUsd(r.mid_usd)}`}>
                <div aria-hidden className="absolute top-1/2 h-px -translate-y-1/2" style={{ left: `${L}%`, width: `${W}%`, background: "var(--chart-4)" }} />
                <div aria-hidden className="absolute top-1/2 h-2 w-px -translate-y-1/2" style={{ left: `${L}%`, background: "var(--chart-4)" }} />
                <div aria-hidden className="absolute top-1/2 h-2 w-px -translate-y-1/2" style={{ left: `calc(${(L + W).toFixed(2)}% - 1px)`, background: "var(--chart-4)" }} />
                <div aria-hidden className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white" style={{ left: `${M}%`, borderColor: "var(--chart-4)" }} />
              </div>
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
      <Rail icon="watch" kicker="What to watch" sample />
      <div className="mt-1"><EaseScale rows={rows} endLabels={["Riskier", "Safer"]} /></div>
      <InlineDisclosure name="risks" summary="What each risk does">
        {/* TWO UP, AND THE REASON IS THE READING MEASURE. Rulebook v2 §17.
            One item per row gave the note column every pixel the card had:
            measured at 1280, 898px of card left 750px of note, which is 155
            CHARACTERS PER LINE at this size, roughly double a comfortable
            measure and the widest text anywhere in the four pages. Capping the
            column instead would have left 300px of dead space on every row,
            which §17 forbids in the same breath. Two columns spend the width on
            a second item rather than on air, and take the measure to about 60. */}
        <div className="mt-2 grid gap-x-7 gap-y-2.5 border-t border-[var(--c-border)] pt-2.5 sm:grid-cols-2">
          {arr.map((r) => (
            <div key={r.name} className="grid grid-cols-[104px_1fr] items-baseline gap-3">
              <span className="text-[12px] font-medium text-[var(--c-ink)]">{r.name}</span>
              <span className="text-[11.5px] leading-snug text-[var(--c-ink2)]">{r.note}</span>
            </div>
          ))}
        </div>
      </InlineDisclosure>
    </Box>
  );
}
