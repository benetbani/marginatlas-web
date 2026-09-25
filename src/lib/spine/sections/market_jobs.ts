/**
 * WHO HOLDS THE MARKET, AND THE JOB MARKET (2026-09-25; his message that night: "Study possible localized based stats for market
 * dynamics, etc, I am thinking of how dominated by big brands a market is for example or deeper insights in the local job market,
 * unempl, youth unempl, unempl. In that sector"). Page-agnostic, keyed by country.
 *
 * THE FILES, data/sections/market_hold.json and job_market.json: shares as published for one period (the rest is 100 less the named
 * shares, computed here and named so), and one labour release's rates. Nothing is drawn from a gap: a market whose named shares
 * pass 100, or fewer than two rates, is not drawn.
 */
import holdJson from "../../../../data/sections/market_hold.json";
import jobsJson from "../../../../data/sections/job_market.json";
import { COPY } from "@/lib/spine/copy";

export type HoldPart = { key: string; name: string; pct: number; big: boolean; rest?: boolean };
export type MarketHold = { iso2: string; market: string; label: string; parts: HoldPart[]; bigShare: number; bigCount: number };

type FileHold = { parts: Array<{ key: string; name: string; pct: number; big?: boolean }>; rest?: { computed?: boolean } };

export function buildMarketHold(iso2: string, market = "grocery"): MarketHold | null {
  const c = (holdJson as unknown as Record<string, Record<string, FileHold> | string>)[iso2.toUpperCase()];
  if (!c || typeof c === "string") return null;
  const m = c[market];
  const label = (COPY.marketHold.markets as Record<string, string>)[market];
  if (!m || !label) return null;
  const parts: HoldPart[] = m.parts.filter((p) => typeof p.pct === "number" && p.pct > 0).map((p) => ({ key: p.key, name: p.name, pct: p.pct, big: !!p.big }));
  const named = parts.reduce((n, p) => n + p.pct, 0);
  if (parts.length < 2 || named > 100.05) return null;
  const rest = Math.round((100 - named) * 10) / 10;
  if (m.rest?.computed && rest > 0) parts.push({ key: "rest", name: COPY.marketHold.rest, pct: rest, big: false, rest: true });
  const big = parts.filter((p) => p.big);
  return { iso2: iso2.toUpperCase(), market, label, parts, bigShare: Math.round(big.reduce((n, p) => n + p.pct, 0) * 10) / 10, bigCount: big.length };
}

/** The market a trade's shops sell in, where the country's file maps the trade (2026-09-25: the grocery trades to the grocery
 *  market), else null. */
export function marketForTrade(iso2: string, trade: string): string | null {
  const c = (holdJson as unknown as Record<string, Record<string, unknown> | string>)[iso2.toUpperCase()];
  if (!c || typeof c === "string") return null;
  const map = c.trades as Record<string, string> | undefined;
  return map && typeof map[trade] === "string" ? map[trade] : null;
}

export type JobRate = { key: string; label: string; pct: number };
export type JobMarket = { iso2: string; rates: JobRate[]; sector: { label: string; vacancies: number; payrollChange: number } | null };

type FileJobs = { rates: Array<{ key: string; pct: number; place?: string }>; sector?: { key: string; vacancies_per_100_jobs: number; payroll_change_pct: number } };

export function buildJobMarket(iso2: string): JobMarket | null {
  const c = (jobsJson as unknown as Record<string, FileJobs | string>)[iso2.toUpperCase()];
  if (!c || typeof c === "string") return null;
  const L = COPY.jobMarket;
  const rates = c.rates
    .filter((r) => typeof r.pct === "number" && r.pct > 0 && r.pct < 100)
    .map((r) => ({ key: r.key, label: r.key === "capital" && r.place ? r.place : (L.rates as Record<string, string>)[r.key], pct: r.pct }))
    .filter((r): r is JobRate => !!r.label);
  if (rates.length < 2) return null;
  const s = c.sector;
  const sectorLabel = s ? (L.sectors as Record<string, string>)[s.key] : undefined;
  const sector = s && sectorLabel && Number.isFinite(s.vacancies_per_100_jobs) && Number.isFinite(s.payroll_change_pct) ? { label: sectorLabel, vacancies: s.vacancies_per_100_jobs, payrollChange: s.payroll_change_pct } : null;
  return { iso2: iso2.toUpperCase(), rates, sector };
}

export function listMarketCountries(): string[] {
  return Object.keys(holdJson as unknown as Record<string, unknown>).filter((k) => !k.startsWith("_"));
}
export function listJobCountries(): string[] {
  return Object.keys(jobsJson as unknown as Record<string, unknown>).filter((k) => !k.startsWith("_"));
}
