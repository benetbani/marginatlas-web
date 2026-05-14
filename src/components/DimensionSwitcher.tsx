"use client";

/**
 * DimensionSwitcher — sticky in-page bar that lets the user pivot the
 * current cell across regions, industries, size bands, and years without
 * navigating back to the home page.
 *
 * The component is purely client-side; it owns no data, only the user's
 * selection. On change it either:
 *   - navigates to a new URL (region / industry switches)
 *   - or appends a query string (size / year — same cell, narrower slice)
 */

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

type Region = { name: string; slug: string };
type IndustryOpt = { id: string; name: string; slug: string };

export type DimensionSwitcherProps = {
  country: string;
  geoSlug: string;
  industrySlug: string;
  industryName: string;
  geoName: string;
  regions: Region[];
  industries: IndustryOpt[];
  sizeBands: string[];
  years: number[];
  currentSize: string | null;
  currentYear: number | null;
};

export function DimensionSwitcher({
  country,
  geoSlug,
  industrySlug,
  industryName,
  geoName,
  regions,
  industries,
  sizeBands,
  years,
  currentSize,
  currentYear,
}: DimensionSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [size, setSize] = useState<string>(currentSize || "");
  const [year, setYear] = useState<string>(currentYear ? String(currentYear) : "");

  function navigate(toGeo: string, toIndustry: string, nextSize?: string, nextYear?: string) {
    const qs = new URLSearchParams();
    const s = nextSize ?? size;
    const y = nextYear ?? year;
    if (s) qs.set("size", s);
    if (y) qs.set("year", y);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    startTransition(() => {
      router.push(`/${country}/${toGeo}/${toIndustry}${suffix}`);
    });
  }

  return (
    <div className="sticky top-[57px] z-[5] -mx-6 px-6 py-3 bg-ink-50/95 backdrop-blur border-y border-ink-200 mb-6">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="text-xs uppercase tracking-wide text-ink-700/60 font-medium">
          Showing
        </span>

        {/* Industry */}
        <label className="flex items-center gap-2">
          <span className="sr-only">Industry</span>
          <select
            aria-label="Industry"
            value={industrySlug}
            disabled={pending}
            onChange={(e) => navigate(geoSlug, e.target.value)}
            className="appearance-none bg-white border border-ink-200 hover:border-atlas-500 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-atlas-500/30 transition cursor-pointer bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22 fill=%22none%22><path d=%22M3 5l3 3 3-3%22 stroke=%22%23475569%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[length:12px] bg-[right_0.625rem_center]"
          >
            <option value={industrySlug}>{industryName}</option>
            {industries
              .filter((i) => i.slug !== industrySlug)
              .map((i) => (
                <option key={i.id} value={i.slug}>
                  {i.name}
                </option>
              ))}
          </select>
        </label>

        <span className="text-ink-700/40">in</span>

        {/* Region */}
        <label className="flex items-center gap-2">
          <span className="sr-only">Region</span>
          <select
            aria-label="Region"
            value={geoSlug}
            disabled={pending}
            onChange={(e) => navigate(e.target.value, industrySlug)}
            className="appearance-none bg-white border border-ink-200 hover:border-atlas-500 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-atlas-500/30 transition cursor-pointer bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22 fill=%22none%22><path d=%22M3 5l3 3 3-3%22 stroke=%22%23475569%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[length:12px] bg-[right_0.625rem_center]"
          >
            <option value={geoSlug}>{geoName}</option>
            {regions
              .filter((r) => r.slug !== geoSlug)
              .map((r) => (
                <option key={r.slug} value={r.slug}>
                  {r.name}
                </option>
              ))}
          </select>
        </label>

        {/* Size band */}
        {sizeBands.length > 0 && (
          <>
            <span className="text-ink-700/40 hidden md:inline">·</span>
            <label className="flex items-center gap-2">
              <span className="text-xs text-ink-700/60">Size</span>
              <select
                aria-label="Size band"
                value={size}
                disabled={pending}
                onChange={(e) => {
                  setSize(e.target.value);
                  navigate(geoSlug, industrySlug, e.target.value);
                }}
                className="appearance-none bg-white border border-ink-200 hover:border-atlas-500 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-atlas-500/30 transition cursor-pointer bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22 fill=%22none%22><path d=%22M3 5l3 3 3-3%22 stroke=%22%23475569%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[length:12px] bg-[right_0.625rem_center]"
              >
                <option value="">All sizes</option>
                {sizeBands.map((b) => (
                  <option key={b} value={b}>
                    {prettySizeBand(b)}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {/* Year */}
        {years.length > 1 && (
          <>
            <span className="text-ink-700/40 hidden md:inline">·</span>
            <label className="flex items-center gap-2">
              <span className="text-xs text-ink-700/60">Year</span>
              <select
                aria-label="Year"
                value={year}
                disabled={pending}
                onChange={(e) => {
                  setYear(e.target.value);
                  navigate(geoSlug, industrySlug, undefined, e.target.value);
                }}
                className="appearance-none bg-white border border-ink-200 hover:border-atlas-500 rounded-lg px-3 py-1.5 pr-8 text-sm font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-atlas-500/30 transition cursor-pointer bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22 fill=%22none%22><path d=%22M3 5l3 3 3-3%22 stroke=%22%23475569%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[length:12px] bg-[right_0.625rem_center]"
              >
                <option value="">Latest</option>
                {years.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {pending && (
          <span className="text-xs text-ink-700/60 ml-auto animate-pulse">
            Loading…
          </span>
        )}
      </div>
    </div>
  );
}

/** Friendly label for a size band. */
function prettySizeBand(b: string): string {
  // Common US Census SUSB bands and similar
  const map: Record<string, string> = {
    "0-4": "1–4 employees",
    "1-4": "1–4 employees",
    "5-9": "5–9 employees",
    "10-19": "10–19 employees",
    "20-49": "20–49 employees",
    "50-99": "50–99 employees",
    "100-249": "100–249 employees",
    "250-499": "250–499 employees",
    "500-999": "500–999 employees",
    "1000+": "1,000+ employees",
    all: "All sizes",
    total: "All sizes",
  };
  const lower = b.toLowerCase().trim();
  if (map[lower]) return map[lower];
  // Generic fallback: "0-9" → "1–9 employees"
  if (/^\d+-\d+$/.test(lower)) return `${lower.replace("-", "–")} employees`;
  if (/^\d+\+$/.test(lower)) return `${lower} employees`;
  return b;
}
