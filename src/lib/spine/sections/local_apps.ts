/**
 * THE APPS A SMALL BUSINESS RUNS ON, BY JOB (2026-09-25; his message that night: "Supporting applications for each country in
 * terms of categories, booking, delivery, marketing, etc. Focus on not worldwide apps, more local ones"). Page-agnostic, keyed by
 * country.
 *
 * THE FILE, data/sections/local_apps.json: each app with the country it was founded in and its fee as its own pricing page states
 * it; an app whose fee was not found is not in the file. This module orders each job's apps with the country's own first, turns
 * each fee into its one short figure (a pound price in dollars through the one pinned rate), and draws no job with fewer than two
 * apps.
 */
import appsJson from "../../../../data/sections/local_apps.json";
import type { AtlasIconId } from "@/components/brand/icons";
import { convertToUsd } from "@/lib/finance/fx";
import { COPY } from "@/lib/spine/copy";

type Fee = { kind: "pct" | "month" | "year" | "ad" | "commission" | "free"; pct?: number; gbp?: number };
type FileApp = { name: string; from: string; fee: Fee; note?: string };
type FileJob = { key: string; apps: FileApp[] };

export type LocalApp = { name: string; from: string; local: boolean; fee: string; note: string };
export type LocalJob = { key: string; label: string; icon: AtlasIconId; apps: LocalApp[] };
export type LocalApps = { iso2: string; jobs: LocalJob[]; localCount: number; total: number };

const JOB_ICON: Record<string, AtlasIconId> = {
  bookings: "first-year",
  payments: "payments",
  accounts: "calculator",
  banking: "bank",
  payroll: "wages",
  reviews: "scorecard",
  hiring: "hiring",
};

const whole = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
const pct = (v: number) => `${Number.isInteger(v) ? v : v.toFixed(2).replace(/0$/, "")}%`;

/** One fee, one short figure: "1.69%/sale", "$44/mo", "$126/yr", "$118/ad", "35%/new client", "Free". Null when it cannot be said. */
function feeText(f: Fee): string | null {
  const F = COPY.localApps.fee;
  const usd = typeof f.gbp === "number" && f.gbp > 0 ? convertToUsd("GBP", f.gbp) : null;
  switch (f.kind) {
    case "free": return F.free;
    case "pct": return typeof f.pct === "number" && f.pct > 0 ? `${pct(f.pct)}${F.perSale}` : null;
    case "commission": return typeof f.pct === "number" && f.pct > 0 ? `${pct(f.pct)}${F.perNewClient}` : null;
    case "month": return usd != null ? `${whole(usd)}${F.perMonth}` : null;
    case "year": return usd != null ? `${whole(usd)}${F.perYear}` : null;
    case "ad": return usd != null ? `${whole(usd)}${F.perAd}` : null;
    default: return null;
  }
}

export function buildLocalApps(iso2: string): LocalApps | null {
  const code = iso2.toUpperCase();
  const c = (appsJson as unknown as Record<string, { jobs?: FileJob[] } | string>)[code];
  if (!c || typeof c === "string" || !Array.isArray(c.jobs)) return null;
  const labels = COPY.localApps.jobs as Record<string, string>;
  const jobs: LocalJob[] = [];
  for (const j of c.jobs) {
    const label = labels[j.key];
    const icon = JOB_ICON[j.key];
    if (!label || !icon) continue;
    const apps = j.apps
      .map((a) => ({ name: a.name, from: a.from, local: a.from === code, fee: feeText(a.fee), note: a.note ?? "" }))
      .filter((a): a is LocalApp => !!a.fee && !!a.name && /^[A-Z]{2}$/.test(a.from))
      /* The country's own first, then as the file lists them. */
      .sort((a, b) => Number(b.local) - Number(a.local));
    if (apps.length >= 2) jobs.push({ key: j.key, label, icon, apps });
  }
  if (jobs.length < 3) return null;
  const all = jobs.flatMap((j) => j.apps);
  return { iso2: code, jobs, localCount: all.filter((a) => a.local).length, total: all.length };
}

export function listLocalAppsCountries(): string[] {
  return Object.keys(appsJson as unknown as Record<string, unknown>).filter((k) => !k.startsWith("_"));
}
