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
import {
  visibleSectors,
  visibleIndustriesInSector,
  searchIndustries,
  INDUSTRY_BY_ID,
  type Industry,
} from "@/lib/taxonomy";
import { CheckResult } from "./CheckResult";

// Full picker source. Every business we cover, grouped by sector and
// kept in the curated display order. The discovery gate drops the
// solo-professional, non-SMB, and large-firm-only categories that do
// not fit an owner self-comparison, leaving the businesses a real
// operator would pick. A search box filters the long list; the grouped
// select stays usable on mobile as a native control.
type PickerGroup = { sectorId: string; sectorName: string; items: Industry[] };

const PICKER_GROUPS: PickerGroup[] = visibleSectors().map((s) => ({
  sectorId: s.id,
  sectorName: s.name,
  items: visibleIndustriesInSector(s.id),
}));

const SECTOR_OF_VISIBLE = new Set(
  PICKER_GROUPS.flatMap((g) => g.items.map((i) => i.id))
);

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
  const [query, setQuery] = useState("");

  // Groups narrowed by the search box. With no query we show every
  // group; with a query we keep only matching industries (and only the
  // groups that still have at least one match). Search runs against the
  // same discovery-visible pool the picker draws from.
  const groups = useMemo<PickerGroup[]>(() => {
    const q = query.trim();
    if (!q) return PICKER_GROUPS;
    const matched = new Set(
      searchIndustries(q)
        .filter((i) => SECTOR_OF_VISIBLE.has(i.id))
        .map((i) => i.id)
    );
    return PICKER_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => matched.has(i.id)),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  // Keep a selected industry visible in the list even when a search
  // would otherwise hide it, so the choice never silently clears.
  const selectedIndustry = form.industryId ? INDUSTRY_BY_ID[form.industryId] : undefined;
  const selectionHidden =
    !!selectedIndustry && !groups.some((g) => g.items.some((i) => i.id === selectedIndustry.id));

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
        /* Canonical surface: was "rounded-2xl bg-white border border-ink-200",
           fully opaque over the fixed page photograph. The seven controls
           INSIDE this form keep their own fills: an input needs an opaque
           field to read as a field, and forcing a form control into a card
           idiom is damage, not convergence. */
        className="atlas-card p-5 md:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label htmlFor="check-industry-search" className="text-xs font-semibold uppercase tracking-wide text-cocoa-700">
              Industry
            </label>
            <input
              id="check-industry-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search businesses, e.g. bakery, plumber, dentist"
              className="rounded-lg border border-ink-200 bg-cream-50 px-3 py-2 text-sm text-ink-900"
              aria-label="Filter the industry list"
            />
            <select
              required
              aria-label="Industry"
              value={form.industryId}
              onChange={(e) => update("industryId", e.target.value)}
              className="rounded-lg border border-ink-200 bg-cream-50 px-3 py-2 text-sm text-ink-900"
            >
              <option value="">Pick one</option>
              {selectionHidden && selectedIndustry && (
                <option value={selectedIndustry.id}>{selectedIndustry.name}</option>
              )}
              {groups.map((g) => (
                <optgroup key={g.sectorId} label={g.sectorName}>
                  {g.items.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </optgroup>
              ))}
              {groups.length === 0 && (
                <option value="" disabled>
                  No match. Clear the search to see all.
                </option>
              )}
            </select>
          </div>

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
