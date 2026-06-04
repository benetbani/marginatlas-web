"use client";

import { useState, useMemo, useEffect } from "react";
import { ComboField, type ComboOption } from "@/components/ComboField";
import {
  COUNTRIES,
  INDUSTRIES,
  INDUSTRY_BY_ID,
} from "@/lib/taxonomy";
import { getRegionsForCountry } from "@/lib/regions/regions-by-country";
import { fmtMoney } from "@/lib/format/money";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import {
  generateCompareVerdict,
  type CompareSide,
} from "@/lib/scores/compare_verdict";

type Slot = { country: string; industry: string; region: string };

type CompactCell = {
  country: string;
  region: string | null;
  industry: string;
  year: number | null;
  revenue_per_firm: number | null;
  rev_p10: number | null;
  rev_p25: number | null;
  rev_p50: number | null;
  rev_p75: number | null;
  rev_p90: number | null;
  n_enterprises: number | null;
  n_employees: number | null;
  payroll_per_employee: number | null;
  quality_score: number | null;
  cellUrl: string | null;
};

function fmtNum(v: number | null | undefined): string {
  if (v == null || isNaN(v)) return "-";
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

  // Build the blunt decision read from the figures the page actually loaded.
  // The helper invents nothing and self-omits when fewer than two slots carry
  // a typical revenue.
  const verdict = useMemo(() => {
    const sides: CompareSide[] = slots.map((s, i) => {
      const c = cells[i];
      const label =
        c?.region ||
        COUNTRIES.find((x) => x.code === s.country)?.name ||
        s.country;
      const industry =
        (s.industry && INDUSTRY_BY_ID[s.industry]
          ? INDUSTRY_BY_ID[s.industry].name
          : c?.industry) || "businesses";
      return {
        index: i,
        place: label,
        industry,
        typical: c ? c.revenue_per_firm ?? c.rev_p50 ?? null : null,
        p10: c?.rev_p10 ?? null,
        p90: c?.rev_p90 ?? null,
        wagePerEmployee: c?.payroll_per_employee ?? null,
        quality: c?.quality_score ?? null,
      };
    });
    return generateCompareVerdict(sides);
  }, [slots, cells]);

  const anyData = slots.some((_, i) => cells[i] != null);
  const anyLoading = slots.some((_, i) => loading[i]);

  // Slot accent: each populated option gets a stable label so the verdict's
  // "winner" can point back at the right column without colour-only cues.
  function slotLabel(i: number): string {
    const c = cells[i];
    return (
      c?.region ||
      COUNTRIES.find((x) => x.code === slots[i].country)?.name ||
      slots[i].country ||
      `Option ${i + 1}`
    );
  }

  // The honest stand-in for a cost waterfall: where the typical number sits
  // inside the bottom-to-top spread. The data carries no cost structure, so we
  // show how much the median hides instead of inventing a margin breakdown.
  function spreadPct(c: CompactCell, key: "rev_p10" | "rev_p50" | "rev_p90"): number | null {
    const lo = c.rev_p10;
    const hi = c.rev_p90;
    const v = c[key];
    if (lo == null || hi == null || v == null || hi <= lo) return null;
    return Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));
  }

  return (
    <div className="space-y-12 md:space-y-16">
      {/* ----- The decision ----- */}
      <section aria-labelledby="compare-verdict-heading">
        <SectionEyebrow className="mb-3">The call</SectionEyebrow>
        <h2
          id="compare-verdict-heading"
          data-typography="custom"
          className="font-serif text-2xl leading-snug text-ink-900 sm:text-3xl"
        >
          {verdict.headline}.
        </h2>
        <div className="mt-4 max-w-2xl space-y-3 text-base leading-relaxed text-graphite">
          <p>{verdict.lead}</p>
          <p className="text-ink-900">{verdict.close}</p>
        </div>

        {verdict.wins.length > 0 ? (
          <dl className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {verdict.wins.map((win) => (
              <div
                key={win.metric}
                className="rounded-lg border border-parchment/70 bg-cream-50 p-4"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-cocoa-500">
                  {win.metric}
                </dt>
                <dd>
                  <p className="mt-1 font-serif text-lg leading-snug text-moss-700">
                    {win.winnerName}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-graphite">
                    {win.reading}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>

      {/* ----- Pick what to weigh ----- */}
      <section aria-labelledby="compare-pickers-heading">
        <SectionEyebrow className="mb-3">Set the matchup</SectionEyebrow>
        <h2
          id="compare-pickers-heading"
          data-typography="custom"
          className="font-serif text-2xl leading-snug text-ink-900"
        >
          Up to four options, side by side
        </h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-graphite">
          Pick a country, region, and activity for each column. The numbers and
          the call above update as you change them.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {slots.map((slot, idx) => (
            <div
              key={idx}
              className="space-y-3 rounded-lg border border-parchment/70 bg-cream-50 p-4"
            >
              <SectionEyebrow size="md">Option {idx + 1}</SectionEyebrow>
              <ComboField
                id={`country-${idx}`}
                label="Country"
                options={countryOptions}
                value={slot.country}
                onChange={(v) => {
                  updateSlot(idx, "country", v);
                  // Reset region when country changes so the first option of
                  // the new country takes effect.
                  const name = COUNTRIES.find((c) => c.code === v)?.name || v;
                  const opts = getRegionsForCountry(v, name);
                  updateSlot(idx, "region", opts[0]?.value || "");
                }}
              />
              {(() => {
                const name = COUNTRIES.find((c) => c.code === slot.country)?.name || slot.country;
                const regionOpts = getRegionsForCountry(slot.country, name);
                return (
                  <div>
                    <label
                      htmlFor={`region-${idx}`}
                      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-cocoa-700"
                    >
                      Region
                    </label>
                    <select
                      id={`region-${idx}`}
                      value={slot.region}
                      onChange={(e) => updateSlot(idx, "region", e.target.value)}
                      className="w-full rounded-xl border border-parchment bg-white px-3.5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:border-atlas-300 focus-visible:border-atlas-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/30"
                    >
                      {regionOpts.map((r) => (
                        <option key={r.value || "country-level"} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })()}
              <ComboField
                id={`industry-${idx}`}
                label="Activity"
                options={industryOptions}
                value={slot.industry}
                onChange={(v) => updateSlot(idx, "industry", v)}
              />
              {slot.industry && cells[idx]?.cellUrl ? (
                <a
                  href={cells[idx]?.cellUrl || "#"}
                  className="inline-block text-xs font-medium text-atlas-700 hover:underline"
                >
                  Open the full page
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* ----- Side by side ----- */}
      <section aria-labelledby="compare-table-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <SectionEyebrow className="mb-3">The figures</SectionEyebrow>
            <h2
              id="compare-table-heading"
              data-typography="custom"
              className="font-serif text-2xl leading-snug text-ink-900"
            >
              What each option does on the numbers
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-graphite">
              The strongest value in each row is marked. Revenue is a typical
              firm&apos;s yearly sales, before what a dollar buys locally. It is
              the top line, not what an owner keeps.
            </p>
          </div>
          <button
            type="button"
            onClick={copyShareLink}
            className="rounded-full border border-parchment bg-cream-100 px-3.5 py-1.5 text-xs font-medium text-ink-900 transition-colors hover:bg-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-500/30"
          >
            Copy share link
          </button>
        </div>

        {!anyData && !anyLoading ? (
          <p className="mt-6 text-sm leading-relaxed text-cocoa-500">
            Pick a country and an activity for at least two options above to see
            the comparison.
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-parchment text-left">
                  <th className="py-2 pr-4 font-medium text-cocoa-500">Metric</th>
                  {slots.map((s, i) => (
                    <th key={i} className="px-3 py-2 align-top">
                      <span className="block font-semibold text-ink-900">
                        {slotLabel(i)}
                      </span>
                      <span className="block text-xs font-normal text-cocoa-500">
                        {s.industry && INDUSTRY_BY_ID[s.industry]
                          ? INDUSTRY_BY_ID[s.industry].name
                          : "-"}
                      </span>
                      {loading[i] ? (
                        <span
                          className="mt-1 block text-[10px] text-cocoa-500"
                          role="status"
                        >
                          loading
                        </span>
                      ) : null}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-ink-900">
                {(
                  [
                    ["Typical revenue", (c) => c.revenue_per_firm ?? c.rev_p50, fmtMoney, "high"],
                    ["Bottom 10%", (c) => c.rev_p10, fmtMoney, "high"],
                    ["Top 10%", (c) => c.rev_p90, fmtMoney, "high"],
                    ["Employees", (c) => c.n_employees, fmtNum, "high"],
                    ["Wage per employee", (c) => c.payroll_per_employee, fmtMoney, "high"],
                    [
                      "Data quality",
                      (c) => c.quality_score,
                      (v: number | null) => (v != null ? `${v}/100` : "-"),
                      "high",
                    ],
                  ] as [
                    string,
                    (c: CompactCell) => number | null,
                    (v: number | null) => string,
                    "high",
                  ][]
                ).map(([label, valueOf, fmt]) => {
                  const { max, min } = rowExtremes(valueOf);
                  return (
                    <tr key={label} className="border-b border-parchment/50">
                      <td className="py-3 pr-4 text-cocoa-500">{label}</td>
                      {slots.map((_, i) => {
                        const c = cells[i];
                        const v = c ? valueOf(c) : null;
                        const isMax = v != null && max != null && v === max && max !== min;
                        const isMin =
                          v != null && min != null && v === min && max !== min;
                        return (
                          <td
                            key={i}
                            className={`px-3 py-3 tabular-nums ${
                              isMax
                                ? "font-semibold text-moss-700"
                                : isMin
                                ? "text-clay-700"
                                : "text-ink-900"
                            }`}
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                className={`inline-block h-1.5 w-1.5 rounded-full ${
                                  isMax
                                    ? "bg-moss-500"
                                    : isMin
                                    ? "bg-clay-500"
                                    : "bg-transparent"
                                }`}
                                aria-hidden
                              />
                              <span>{c ? fmt(valueOf(c)) : loading[i] ? "…" : "-"}</span>
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
        )}
      </section>

      {/* ----- Where the typical number hides the spread ----- */}
      {(() => {
        const withSpread = slots
          .map((s, i) => ({ s, i, c: cells[i] }))
          .filter(
            (r): r is { s: Slot; i: number; c: CompactCell } =>
              r.c != null &&
              r.c.rev_p10 != null &&
              r.c.rev_p90 != null &&
              (r.c.rev_p90 as number) > (r.c.rev_p10 as number),
          );
        if (withSpread.length < 1) return null;
        return (
          <section aria-labelledby="compare-spread-heading">
            <SectionEyebrow className="mb-3">Where the number hides</SectionEyebrow>
            <h2
              id="compare-spread-heading"
              data-typography="custom"
              className="font-serif text-2xl leading-snug text-ink-900"
            >
              The typical firm is not the whole story
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-graphite">
              Each bar runs from the bottom-ten-percent firm to the top-ten. The
              marker is the typical one. A wide bar means the headline revenue
              hides a lot, and who runs the place decides where you land on it.
            </p>

            <div className="mt-6 space-y-5">
              {withSpread.map(({ i, c }) => {
                const medianPos = spreadPct(c, "rev_p50") ?? spreadPct(c, "rev_p10");
                const ratio =
                  c.rev_p10 && c.rev_p10 > 0 && c.rev_p90
                    ? c.rev_p90 / c.rev_p10
                    : null;
                return (
                  <div key={i}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <span className="font-semibold text-ink-900">
                        {slotLabel(i)}
                        <span className="ml-2 text-sm font-normal text-cocoa-500">
                          {c.industry}
                        </span>
                      </span>
                      {ratio != null ? (
                        <span className="text-xs text-cocoa-500">
                          top firm earns {ratio >= 10 ? Math.round(ratio) : ratio.toFixed(1)}x the bottom
                        </span>
                      ) : null}
                    </div>
                    <div className="relative mt-2 h-2 w-full rounded-full bg-cream-100">
                      <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-atlas-100" />
                      {medianPos != null ? (
                        <div
                          className="absolute top-1/2 h-3.5 w-1 -translate-y-1/2 rounded-full bg-atlas-700"
                          style={{ left: `${medianPos}%` }}
                          aria-hidden
                        />
                      ) : null}
                    </div>
                    <div className="mt-1.5 flex justify-between text-xs tabular-nums text-cocoa-500">
                      <span>{fmtMoney(c.rev_p10)}</span>
                      <span className="font-medium text-ink-900">
                        typical {fmtMoney(c.revenue_per_firm ?? c.rev_p50)}
                      </span>
                      <span>{fmtMoney(c.rev_p90)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })()}
    </div>
  );
}
