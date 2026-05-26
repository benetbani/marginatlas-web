/**
 * /check form — ATO Phase 7.
 *
 * Client component. Renders the form, calls the verdict engine, and
 * renders the result inline. State is held in URL search params so
 * the resulting verdict URL is shareable.
 */

"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { computeVerdict, type CheckInput } from "@/lib/check/verdict_engine";
import { CheckResult } from "./CheckResult";

// Subset of industries to expose in the picker. Phase 7 ships the
// founder-validated set; future iterations can swap to a typeahead
// against the full INDUSTRIES list.
const PICKER: Array<{ id: string; label: string }> = [
  { id: "restaurants", label: "Restaurants" },
  { id: "cafes_coffee", label: "Cafes & coffee shops" },
  { id: "bakeries", label: "Bakeries" },
  { id: "hairdressers_beauty", label: "Hair & beauty" },
  { id: "barbershops", label: "Barbershops" },
  { id: "auto_repair_shops", label: "Auto repair" },
  { id: "dental_practices", label: "Dental practice" },
  { id: "doctors_clinics", label: "Doctors clinic" },
  { id: "legal_services", label: "Legal services" },
  { id: "accounting_tax", label: "Accounting & tax" },
  { id: "real_estate_agencies", label: "Real estate agency" },
  { id: "residential_construction", label: "Residential construction" },
  { id: "plumbing_services", label: "Plumbing" },
  { id: "carpentry_services", label: "Carpentry" },
  { id: "bricklaying_services", label: "Bricklaying" },
  { id: "grocery_stores", label: "Grocery store" },
  { id: "clothing_stores", label: "Clothing retail" },
  { id: "book_retailing", label: "Bookshop" },
  { id: "sports_fitness", label: "Gym / fitness" },
  { id: "veterinary_pet_care", label: "Veterinary clinic" },
];

type FormState = {
  industryId: string;
  revenueUsd: string;
  rentUsd: string;
  labourUsd: string;
  cogsUsd: string;
  motorVehicleUsd: string;
};

const INITIAL: FormState = {
  industryId: "",
  revenueUsd: "",
  rentUsd: "",
  labourUsd: "",
  cogsUsd: "",
  motorVehicleUsd: "",
};

function parseNumber(s: string): number {
  const n = Number(s.replace(/[$,_\s]/g, ""));
  return isFinite(n) ? n : 0;
}

export function CheckForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const verdict = useMemo(() => {
    if (!submitted || !form.industryId || !form.revenueUsd) return null;
    const input: CheckInput = {
      industryId: form.industryId,
      revenueUsd: parseNumber(form.revenueUsd),
      rentUsd: form.rentUsd ? parseNumber(form.rentUsd) : undefined,
      labourUsd: form.labourUsd ? parseNumber(form.labourUsd) : undefined,
      cogsUsd: form.cogsUsd ? parseNumber(form.cogsUsd) : undefined,
      motorVehicleUsd: form.motorVehicleUsd ? parseNumber(form.motorVehicleUsd) : undefined,
    };
    if (input.revenueUsd <= 0) return null;
    return computeVerdict(input);
  }, [form, submitted]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white border border-ink-200 p-5 md:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-cocoa-700">
              Industry
            </span>
            <select
              required
              value={form.industryId}
              onChange={(e) => update("industryId", e.target.value)}
              className="rounded-lg border border-ink-200 bg-cream-50 px-3 py-2 text-sm text-ink-900"
            >
              <option value="">Pick one</option>
              {PICKER.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-cocoa-700">
              Annual revenue (USD)
            </span>
            <input
              required
              inputMode="numeric"
              value={form.revenueUsd}
              onChange={(e) => update("revenueUsd", e.target.value)}
              placeholder="e.g. 750000"
              className="rounded-lg border border-ink-200 bg-cream-50 px-3 py-2 text-sm tabular-nums text-ink-900"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-cocoa-700">
              Annual cost of sales (optional)
            </span>
            <input
              inputMode="numeric"
              value={form.cogsUsd}
              onChange={(e) => update("cogsUsd", e.target.value)}
              placeholder="e.g. 280000"
              className="rounded-lg border border-ink-200 bg-cream-50 px-3 py-2 text-sm tabular-nums text-ink-900"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-cocoa-700">
              Annual labour cost (optional)
            </span>
            <input
              inputMode="numeric"
              value={form.labourUsd}
              onChange={(e) => update("labourUsd", e.target.value)}
              placeholder="e.g. 215000"
              className="rounded-lg border border-ink-200 bg-cream-50 px-3 py-2 text-sm tabular-nums text-ink-900"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-cocoa-700">
              Annual rent (optional)
            </span>
            <input
              inputMode="numeric"
              value={form.rentUsd}
              onChange={(e) => update("rentUsd", e.target.value)}
              placeholder="e.g. 72000"
              className="rounded-lg border border-ink-200 bg-cream-50 px-3 py-2 text-sm tabular-nums text-ink-900"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-cocoa-700">
              Motor vehicle (optional)
            </span>
            <input
              inputMode="numeric"
              value={form.motorVehicleUsd}
              onChange={(e) => update("motorVehicleUsd", e.target.value)}
              placeholder="e.g. 9000"
              className="rounded-lg border border-ink-200 bg-cream-50 px-3 py-2 text-sm tabular-nums text-ink-900"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-atlas-700 hover:bg-atlas-800 text-cream-50 text-sm font-semibold transition shadow-sm"
        >
          Compare my numbers
        </button>
      </form>

      {verdict && (
        <div className="mt-8">
          <CheckResult verdict={verdict} />
        </div>
      )}
    </>
  );
}
