"use client";

import { useState, useMemo, useEffect } from "react";
import { ComboField, type ComboOption } from "@/components/ComboField";
import {
  COUNTRIES,
  INDUSTRIES,
  INDUSTRY_BY_ID,
  industryToSlug,
} from "@/lib/taxonomy";

type Slot = { country: string; industry: string; region: string };

type CompactCell = {
  country: string;
  region: string | null;
  industry: string;
  year: number | null;
  revenue_per_firm: number | null;
  rev_p10: number | null;
  rev_p90: number | null;
  n_enterprises: number | null;
  n_employees: number | null;
  payroll_per_employee: number | null;
  quality_score: number | null;
  employees_per_firm: number | null;
  cellUrl: string | null;
};

const US_REGION_OPTIONS = [
  "california",
  "texas",
  "new-york",
  "florida",
  "illinois",
  "pennsylvania",
  "ohio",
  "georgia",
  "north-carolina",
  "michigan",
  "washington",
  "massachusetts",
  "virginia",
  "new-jersey",
  "arizona",
];

function fmtMoney(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

function fmtNum(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "—";
  if (v >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return v.toFixed(0);
}

export function CompareClient() {
  const [slots, setSlots] = useState<Slot[]>([
    { country: "US", industry: "", region: "california" },
    { country: "US", industry: "", region: "texas" },
    { country: "US", industry: "", region: "new-york" },
    { country: "US", industry: "", region: "florida" },
  ]);
  const [cells, setCells] = useState<Record<number, CompactCell | null>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  // Default industry on mount
  useEffect(() => {
    setSlots((prev) =>
      prev.map((s) => (s.industry ? s : { ...s, industry: "restaurants" }))
    );
  }, []);

  const countryOptions: ComboOption[] = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        value: c.code,
        label: c.name,
        keywords: [c.code.toLowerCase(), c.name.toLowerCase()],
      })),
    []
  );

  const industryOptions: ComboOption[] = useMemo(
    () =>
      INDUSTRIES.map((i) => ({
        value: i.id,
        label: i.name,
        examples: i.examples,
        keywords: i.keywords,
      })),
    []
  );

  // Fetch the cell for each slot whenever country/industry/region changes
  useEffect(() => {
    slots.forEach((slot, idx) => {
      if (!slot.country || !slot.industry) {
        setCells((c) => ({ ...c, [idx]: null }));
        return;
      }
      setLoading((l) => ({ ...l, [idx]: true }));
      const qs = new URLSearchParams({
        country: slot.country,
        industry: slot.industry,
      });
      if (slot.region) qs.set("region", slot.region);
      fetch(`/api/cell-lookup?${qs.toString()}`)
        .then((r) => r.json())
        .then((j) => {
          setCells((c) => ({ ...c, [idx]: j.cell || null }));
        })
        .catch(() => setCells((c) => ({ ...c, [idx]: null })))
        .finally(() => setLoading((l) => ({ ...l, [idx]: false })));
    });
  }, [slots]);

  function updateSlot(idx: number, field: keyof Slot, value: string) {
    setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  }

  // FF.4 — load slots from ?q= param on mount, and write current slots back
  // to URL so the comparison is shareable.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (!q) return;
    try {
      const parsed = JSON.parse(decodeURIComponent(q));
      if (Array.isArray(parsed) && parsed.length === 4) {
        setSlots(parsed);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("q", encodeURIComponent(JSON.stringify(slots)));
    window.history.replaceState(null, "", url.toString());
  }, [slots]);

  function shareLink(): string {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }

  function copyShareLink() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(shareLink()).catch(() => {});
  }

  // FF.4 — per-row max/min for delta dots
  function rowExtremes(getValue: (c: CompactCell) => number | null) {
    const vals = slots
      .map((_, i) => {
        const c = cells[i];
        return c ? getValue(c) : null;
      })
      .map((v) => (v != null && isFinite(v) ? v : null));
    const present = vals.filter((v): v is number => v != null);
    if (present.length < 2) return { max: null as number | null, min: null as number | null };
    return { max: Math.max(...present), min: Math.min(...present) };
  }

  return (
    <div className="space-y-6">
      {/* Pickers grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {slots.map((slot, idx) => (
          <div key={idx} className="card space-y-3">
            <div className="text-xs uppercase tracking-wide text-atlas-600 font-medium">
              Cell {idx + 1}
            </div>
            <ComboField
              id={`country-${idx}`}
              label="Country"
              options={countryOptions}
              value={slot.country}
              onChange={(v) => updateSlot(idx, "country", v)}
            />
            {slot.country === "US" && (
              <div>
                <label className="text-xs text-ink-700/70 mb-1 block">Region</label>
                <select
                  value={slot.region}
                  onChange={(e) => updateSlot(idx, "region", e.target.value)}
                  className="w-full bg-white border border-ink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-atlas-500/30"
                >
                  {US_REGION_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <ComboField
              id={`industry-${idx}`}
              label="Industry"
              options={industryOptions}
              value={slot.industry}
              onChange={(v) => updateSlot(idx, "industry", v)}
            />
            {slot.industry && cells[idx]?.cellUrl ? (
              <a
                href={cells[idx]?.cellUrl || "#"}
                className="text-xs text-atlas-600 hover:underline inline-block"
              >
                Open full page →
              </a>
            ) : null}
          </div>
        ))}
      </section>

      {/* Comparison table */}
      <section className="card">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-semibold text-ink-900">Side-by-side</h2>
            <p className="mt-1 text-sm text-ink-700">
              Highest value in each row gets a moss dot; lowest gets a clay dot.
            </p>
          </div>
          <button
            type="button"
            onClick={copyShareLink}
            className="text-xs px-3 py-1.5 rounded-full bg-cream-100 border border-parchment text-ink-900 hover:bg-white transition font-medium"
          >
            Copy share link
          </button>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left">
                <th className="py-2 pr-4 font-medium text-ink-700">Metric</th>
                {slots.map((s, i) => (
                  <th key={i} className="py-2 px-3 font-medium text-ink-900 align-top">
                    <div>
                      {cells[i]?.region || s.country}
                    </div>
                    <div className="text-xs text-ink-700/70 font-normal">
                      {s.industry && INDUSTRY_BY_ID[s.industry] ? INDUSTRY_BY_ID[s.industry].name : "—"}
                    </div>
                    {loading[i] && (
                      <div className="text-[10px] text-ink-700/50 mt-1">loading…</div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-ink-800">
              {(
                [
                  ["Typical revenue", (c) => c.revenue_per_firm, fmtMoney],
                  ["Bottom 10%", (c) => c.rev_p10, fmtMoney],
                  ["Top 10%", (c) => c.rev_p90, fmtMoney],
                  ["Firms", (c) => c.n_enterprises, fmtNum],
                  ["Employees", (c) => c.n_employees, fmtNum],
                  [
                    "Employees per firm",
                    (c) => c.employees_per_firm,
                    (v: number | null) => (v != null ? v.toFixed(1) : "—"),
                  ],
                  ["Wage per employee", (c) => c.payroll_per_employee, fmtMoney],
                  [
                    "Quality",
                    (c) => c.quality_score,
                    (v: number | null) => (v != null ? `${v}/100` : "—"),
                  ],
                  [
                    "Year",
                    (c) => c.year,
                    (v: number | null) => (v != null ? String(v) : "—"),
                  ],
                ] as [
                  string,
                  (c: CompactCell) => number | null,
                  (v: number | null) => string
                ][]
              ).map(([label, valueOf, fmt]) => {
                const { max, min } = rowExtremes(valueOf);
                return (
                  <tr key={label} className="border-b border-ink-100/60">
                    <td className="py-3 pr-4 text-ink-700">{label}</td>
                    {slots.map((_, i) => {
                      const c = cells[i];
                      const v = c ? valueOf(c) : null;
                      const isMax = v != null && max != null && v === max;
                      const isMin = v != null && min != null && v === min && max !== min;
                      const dotClass = isMax
                        ? "bg-moss-500"
                        : isMin
                        ? "bg-clay-500"
                        : "bg-transparent";
                      return (
                        <td key={i} className="py-3 px-3 text-ink-900 tabular-nums">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${dotClass}`}
                              aria-hidden
                            />
                            <span>{c ? fmt(valueOf(c)) : loading[i] ? "…" : "—"}</span>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
