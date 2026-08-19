/**
 * V3, the table. Three renderers over one row shape.
 *
 * A REPRODUCES THE SHIPPING PATTERN RATHER THAN IMPORTING IT, and that is a
 * deviation from the brief's "A is the current implementation, untouched" worth
 * stating plainly. Every table that ships on this site is welded to its own
 * data source, so none of them can be handed a different set of rows. The
 * classes in `TableA` below are copied verbatim from
 * `src/components/cities/BusinessFormationCosts.tsx`, which does ship, so what
 * is reproduced is the real markup and not an idea of it: left-aligned headers,
 * no `scope`, no sticky header, no `tabular-nums` on the figures, and the header
 * in `text-cocoa-700/85`.
 *
 * B and C do not use cocoa. It is brown, charter section 8 bans it, and the
 * graphics review found it acting as a data tone rather than only as text. A
 * keeps it because A is meant to show what ships.
 */
import * as React from "react";

export type Row = {
  name: string;
  revenue: number;
  marginPct: number;
  takeHome: number;
  firms: number;
};

export const COLS = [
  { key: "revenue", label: "Revenue", unit: "$ a year" },
  { key: "marginPct", label: "Net margin", unit: "%" },
  { key: "takeHome", label: "Owner take-home", unit: "$ a year" },
  { key: "firms", label: "Firms", unit: "count" },
] as const;

function usd(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${Math.round(n)}`;
}
function cell(r: Row, key: string): string {
  if (key === "revenue") return usd(r.revenue);
  if (key === "takeHome") return usd(r.takeHome);
  if (key === "marginPct") return `${r.marginPct}%`;
  return r.firms.toLocaleString("en-US");
}
/** Bare number for B and C, where the unit lives in the header instead. */
function cellNoUnit(r: Row, key: string): string {
  if (key === "revenue") return usd(r.revenue).replace("$", "");
  if (key === "takeHome") return usd(r.takeHome).replace("$", "");
  if (key === "marginPct") return String(r.marginPct);
  return r.firms.toLocaleString("en-US");
}

/** A. The shipping pattern, reproduced verbatim. */
export function TableA({ rows }: { rows: Row[] }) {
  return (
    <div className="atlas-card overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85">
              Trade
            </th>
            {COLS.map((c) => (
              <th
                key={c.key}
                className="text-left px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-cocoa-700/85"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-parchment">
              <td className="px-4 py-3 text-ink-900 font-medium">{r.name}</td>
              {COLS.map((c) => (
                <td key={c.key} className="px-4 py-3 text-ink-800">
                  {cell(r, c.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** B. The properties, and nothing else: no bars, no colour, no restyle. */
export function TableB({ rows, sticky = true }: { rows: Row[]; sticky?: boolean }) {
  return (
    <div className="atlas-card max-h-[420px] overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead className={sticky ? "sticky top-0 z-10 bg-white" : undefined}>
          <tr>
            <th
              scope="col"
              className="border-b border-parchment px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-700"
            >
              Trade
            </th>
            {COLS.map((c) => (
              <th
                key={c.key}
                scope="col"
                className="border-b border-parchment px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-ink-700"
              >
                {c.label}
                <span className="block font-normal normal-case tracking-normal text-ink-600">
                  {c.unit}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-parchment">
              <th scope="row" className="px-4 py-3 text-left font-medium text-ink-900">
                {r.name}
              </th>
              {COLS.map((c) => (
                <td key={c.key} className="px-4 py-3 text-right tabular-nums text-ink-800">
                  {cellNoUnit(r, c.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** C. B, plus one inline bar per numeric column, scaled to that column's max. */
export function TableC({ rows }: { rows: Row[] }) {
  const max: Record<string, number> = {};
  for (const c of COLS) {
    max[c.key] = Math.max(...rows.map((r) => Number(r[c.key as keyof Row]) || 0), 1);
  }
  return (
    <div className="atlas-card max-h-[420px] overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-white">
          <tr>
            <th
              scope="col"
              className="border-b border-parchment px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-700"
            >
              Trade
            </th>
            {COLS.map((c) => (
              <th
                key={c.key}
                scope="col"
                className="border-b border-parchment px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-ink-700"
              >
                {c.label}
                <span className="block font-normal normal-case tracking-normal text-ink-600">
                  {c.unit}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-t border-parchment">
              <th scope="row" className="px-4 py-3 text-left font-medium text-ink-900">
                {r.name}
              </th>
              {COLS.map((c) => {
                const v = Number(r[c.key as keyof Row]) || 0;
                const pct = Math.max(2, (v / max[c.key]) * 100);
                return (
                  <td key={c.key} className="px-4 py-3 text-right align-middle">
                    <span className="block tabular-nums text-ink-800">
                      {cellNoUnit(r, c.key)}
                    </span>
                    <span className="mt-1 block h-1 w-full bg-paper-200">
                      <span
                        className="block h-1 bg-atlas-600"
                        style={{ width: `${pct}%`, marginLeft: `${100 - pct}%` }}
                      />
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
