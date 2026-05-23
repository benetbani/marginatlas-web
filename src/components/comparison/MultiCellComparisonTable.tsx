/**
 * MultiCellComparisonTable
 * ========================
 *
 * Power-user view: a sortable, filterable table of Atlas cells.
 * Sticky header, coverage chip in the leftmost column, all numbers in
 * tabular-nums. Collapses to a card list on mobile so the same data is
 * usable without horizontal scroll.
 */

"use client";

import { useMemo, useState } from "react";
import {
  ArrowUp, ArrowDown, CaretUpDown, Funnel,
} from "@phosphor-icons/react/dist/ssr";
import { shortMoney, pctText, flagEmoji } from "./_primitives";

export type Coverage = "measured" | "regional" | "estimated" | "modeled";

export type Cell = {
  id: string | number;
  coverage: Coverage;
  iso2: string;
  country: string;
  city: string;
  industry: string;
  /** Uppercase sector label, e.g. "FOOD & DRINK". */
  sectorLabel: string;
  revenue: number;
  margin: number;     // 0..1
  employees?: number;
  wage: number;
  score: number;      // 0..100
  /** One of "< 5 employees", "5-19 employees", "20-99 employees". */
  sizeBand: string;
};

export type MultiCellComparisonTableProps = {
  cells: Cell[];
  /** Optional title override. */
  title?: string;
};

type SortKey = "country" | "city" | "industry" | "revenue" | "margin" | "wage" | "score";

const COVERAGE_DOT: Record<Coverage, string> = {
  measured: "#10B981",
  regional: "#0EA5E9",
  estimated: "#E94E20",
  modeled: "#A8A29E",
};

export default function MultiCellComparisonTable({
  cells,
  title,
}: MultiCellComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState({ country: "", industry: "", sector: "", size: "" });

  const countries  = useMemo(() => unique(cells.map((c) => c.country)),     [cells]);
  const industries = useMemo(() => unique(cells.map((c) => c.industry)),    [cells]);
  const sectors    = useMemo(() => unique(cells.map((c) => c.sectorLabel)), [cells]);
  const sizes      = ["< 5 employees", "5-19 employees", "20-99 employees"];

  const filtered = useMemo(() => {
    return cells.filter((c) =>
      (!filter.country  || c.country     === filter.country) &&
      (!filter.industry || c.industry    === filter.industry) &&
      (!filter.sector   || c.sectorLabel === filter.sector) &&
      (!filter.size     || c.sizeBand    === filter.size)
    );
  }, [cells, filter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey];
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      return sortDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("desc"); }
  }

  return (
    <article>
      <section className="bg-cream-50 border-b border-parchment">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-atlas-700">
            Multi-cell comparison
          </p>
          <h1 className="font-display mt-3 text-balance text-4xl sm:text-5xl leading-[1.06] tracking-[-0.022em] font-semibold text-ink-900 max-w-4xl">
            {title ?? `Power view: ${cells.length} cells, sortable.`}
          </h1>
          <p className="mt-3 text-base sm:text-lg max-w-2xl text-cocoa-700 leading-relaxed">
            Use the filters to narrow by country, industry, sector, and firm size. Tap a column header to sort.
          </p>
        </div>
      </section>

      <section className="bg-cream-100 border-b border-parchment">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center gap-2">
          <span className="text-[11px] tracking-[0.16em] uppercase font-semibold inline-flex items-center gap-1.5 text-atlas-700">
            <Funnel size={12} aria-hidden="true" /> Filter
          </span>
          <FilterSelect label="Country"  value={filter.country}  onChange={(v) => setFilter((f) => ({ ...f, country: v }))}  options={countries} />
          <FilterSelect label="Industry" value={filter.industry} onChange={(v) => setFilter((f) => ({ ...f, industry: v }))} options={industries} />
          <FilterSelect label="Sector"   value={filter.sector}   onChange={(v) => setFilter((f) => ({ ...f, sector: v }))}   options={sectors} />
          <FilterSelect label="Size"     value={filter.size}     onChange={(v) => setFilter((f) => ({ ...f, size: v }))}     options={sizes} />
          <span className="ml-auto text-xs tabular-nums text-cocoa-700">
            {sorted.length} of {cells.length} cells
          </span>
        </div>
      </section>

      {/* Desktop / tablet table */}
      <section className="hidden md:block bg-cream-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="overflow-x-auto rounded-lg border border-parchment">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-cream-100 sticky top-0 z-10">
                <tr>
                  <Th label="Coverage" />
                  <Th label="Country"  k="country"  active={sortKey} dir={sortDir} onSort={toggleSort} />
                  <Th label="City"     k="city"     active={sortKey} dir={sortDir} onSort={toggleSort} />
                  <Th label="Industry" k="industry" active={sortKey} dir={sortDir} onSort={toggleSort} />
                  <Th label="Revenue"  k="revenue"  active={sortKey} dir={sortDir} onSort={toggleSort} numeric />
                  <Th label="Margin"   k="margin"   active={sortKey} dir={sortDir} onSort={toggleSort} numeric />
                  <Th label="Wage"     k="wage"     active={sortKey} dir={sortDir} onSort={toggleSort} numeric />
                  <Th label="Score"    k="score"    active={sortKey} dir={sortDir} onSort={toggleSort} numeric />
                </tr>
              </thead>
              <tbody>
                {sorted.map((c) => (
                  <tr key={c.id} className="border-t border-parchment/70">
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-cocoa-700">
                        <span
                          aria-hidden="true"
                          className="block rounded-full"
                          style={{ width: 7, height: 7, background: COVERAGE_DOT[c.coverage] }}
                        />
                        {c.coverage}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span aria-hidden="true">{flagEmoji(c.iso2)}</span>
                      <span className="ml-1.5 text-ink-900">{c.country}</span>
                    </td>
                    <td className="px-3 py-2.5 text-ink-900">{c.city}</td>
                    <td className="px-3 py-2.5">
                      <span className="font-medium text-ink-900">{c.industry}</span>
                      <span className="block text-[10px] uppercase tracking-wide text-cocoa-700/70">{c.sectorLabel}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-ink-900">{shortMoney(c.revenue)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-900">{pctText(c.margin)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-ink-900">{shortMoney(c.wage)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums font-semibold text-atlas-700">{c.score}/100</td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-10 text-center text-sm text-cocoa-700">
                      No cells match these filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Mobile card list */}
      <section className="md:hidden bg-cream-50">
        <div className="px-4 py-6 space-y-3">
          {sorted.map((c) => (
            <div key={c.id} className="rounded-lg p-4 bg-cream-50 border border-parchment">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-cocoa-700">
                  <span aria-hidden="true" className="block rounded-full" style={{ width: 7, height: 7, background: COVERAGE_DOT[c.coverage] }} />
                  {c.coverage}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-cocoa-700/70">{c.sectorLabel}</span>
              </div>
              <p className="font-display mt-2 text-lg font-semibold text-ink-900">{c.industry}</p>
              <p className="text-sm text-cocoa-700">
                <span aria-hidden="true">{flagEmoji(c.iso2)}</span> {c.city}, {c.country}
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                <Mini label="Revenue" value={shortMoney(c.revenue)} accent />
                <Mini label="Margin"  value={pctText(c.margin)} />
                <Mini label="Wage"    value={shortMoney(c.wage)} />
                <Mini label="Score"   value={`${c.score}/100`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

function Th({
  label, k, active, dir, onSort, numeric,
}: {
  label: string; k?: SortKey; active?: SortKey; dir?: "asc" | "desc";
  onSort?: (k: SortKey) => void; numeric?: boolean;
}) {
  const isActive = !!k && active === k;
  return (
    <th
      scope="col"
      onClick={k && onSort ? () => onSort(k) : undefined}
      className={`px-3 py-2.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-cocoa-700/85 ${
        k ? "cursor-pointer hover:bg-cream-50" : ""
      } ${numeric ? "text-right" : "text-left"}`}
    >
      <span className="inline-flex items-center gap-1.5">
        {label}
        {k && (
          <span aria-hidden="true" className={isActive ? "text-atlas-700" : "text-cocoa-700/35"}>
            {!isActive ? <CaretUpDown size={10} /> : dir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
          </span>
        )}
      </span>
    </th>
  );
}

function FilterSelect({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="inline-flex items-center gap-2 text-xs text-cocoa-700">
      <span className="font-semibold uppercase tracking-wide">{label}</span>
      <span className="relative inline-block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-2.5 pr-7 h-7 rounded-md text-xs font-medium bg-cream-50 border border-parchment text-ink-900"
          aria-label={`Filter by ${label.toLowerCase()}`}
        >
          <option value="">All</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-cocoa-700/55">
          <CaretUpDown size={10} aria-hidden="true" />
        </span>
      </span>
    </label>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[9px] tracking-[0.14em] uppercase font-semibold text-cocoa-700/70">{label}</span>
      <span className={`mt-0.5 text-sm font-semibold tabular-nums ${accent ? "text-atlas-700" : "text-ink-900"}`}>
        {value}
      </span>
    </div>
  );
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
