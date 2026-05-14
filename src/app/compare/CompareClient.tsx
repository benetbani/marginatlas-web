"use client";

import { useState, useMemo, useEffect } from "react";
import { ComboField, type ComboOption } from "@/components/ComboField";
import {
  COUNTRIES,
  INDUSTRIES,
  INDUSTRY_BY_ID,
  industryToSlug,
} from "@/lib/taxonomy";

type Slot = { country: string; industry: string };

export function CompareClient() {
  const [slots, setSlots] = useState<Slot[]>([
    { country: "US", industry: "" },
    { country: "DE", industry: "" },
    { country: "FR", industry: "" },
    { country: "JP", industry: "" },
  ]);

  // Pre-populate first 4 with restaurants by default
  useEffect(() => {
    setSlots((prev) =>
      prev.map((s, i) =>
        s.industry ? s : { ...s, industry: "restaurants" }
      )
    );
  }, []);

  const countryOptions: ComboOption[] = COUNTRIES.map((c) => ({
    value: c.code,
    label: c.name,
    keywords: [c.code.toLowerCase(), c.name.toLowerCase()],
  }));

  const industryOptions: ComboOption[] = INDUSTRIES.map((i) => ({
    value: i.id,
    label: i.name,
    examples: i.examples,
    keywords: i.keywords,
  }));

  function updateSlot(idx: number, field: "country" | "industry", value: string) {
    setSlots((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
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
            <ComboField
              id={`industry-${idx}`}
              label="Industry"
              options={industryOptions}
              value={slot.industry}
              onChange={(v) => updateSlot(idx, "industry", v)}
            />
            <div className="text-xs text-ink-700/70">
              {slot.industry && INDUSTRY_BY_ID[slot.industry] ? (
                <>
                  Sample URL:{" "}
                  <a
                    href={`/${slot.country.toLowerCase()}/california/${industryToSlug(slot.industry)}`}
                    className="text-atlas-600 hover:underline"
                  >
                    /{slot.country.toLowerCase()}/california/{industryToSlug(slot.industry)}
                  </a>
                </>
              ) : (
                "Pick an industry to load data."
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Comparison table — placeholder for now, will fetch real data when API is wired */}
      <section className="card">
        <h2 className="text-xl font-semibold text-ink-900">Side-by-side</h2>
        <p className="mt-1 text-sm text-ink-700">
          Live comparison loads from the API once you've picked at least 2 cells.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left">
                <th className="py-2 pr-4 font-medium text-ink-700">Metric</th>
                {slots.map((s, i) => (
                  <th key={i} className="py-2 px-3 font-medium text-ink-900">
                    {s.country}
                    <div className="text-xs text-ink-700/70 font-normal">
                      {s.industry && INDUSTRY_BY_ID[s.industry] ? INDUSTRY_BY_ID[s.industry].name : "—"}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-ink-800">
              {[
                "Typical yearly revenue per firm",
                "Smallest 10%",
                "Biggest 10%",
                "Typical firm size (employees)",
                "Wage per employee",
                "Data quality",
              ].map((label) => (
                <tr key={label} className="border-b border-ink-100/60">
                  <td className="py-3 pr-4 text-ink-700">{label}</td>
                  {slots.map((_, i) => (
                    <td key={i} className="py-3 px-3 text-ink-900">
                      <span className="text-ink-500 italic text-xs">loading…</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-700/70">
          This is a UI scaffold. Live cell-data join is in v1.20 (next push).
        </p>
      </section>
    </div>
  );
}
