/**
 * WHO MAKES IT PAST THE FIRST YEARS, AND WHAT HOLDS SMALL FIRMS BACK (2026-09-25; his message that night: "Decisive factors that
 * decide whether a business survives the 1st year"). Page-agnostic, keyed by country.
 *
 * THE FILE, data/sections/survival.json: `curve` is one cohort followed year by year (never years of different cohorts stitched
 * together), `regions` the best and worst region on the curve's last year, `obstacles` one survey's shares of small employers
 * naming each obstacle. This module reads them and adds nothing; a curve under three points, or an obstacle list under four, is
 * not drawn.
 */
import survivalJson from "../../../../data/sections/survival.json";
import { COPY } from "@/lib/spine/copy";

export type SurvivalPoint = { year: number; pct: number };
export type Survival = {
  iso2: string;
  cohort: number;
  points: SurvivalPoint[];
  last: SurvivalPoint;
  regions: { best: { name: string; pct: number }; worst: { name: string; pct: number } } | null;
};
export type Obstacle = { key: string; label: string; pct: number };
export type Obstacles = { iso2: string; year: number; items: Obstacle[] };

type FileCountry = {
  curve?: { cohort: number; points: SurvivalPoint[] };
  regions?: { year: number; best: { name: string; pct: number }; worst: { name: string; pct: number } };
  obstacles?: { year: number; items: Array<{ key: string; pct: number }> };
};
const file = survivalJson as unknown as Record<string, FileCountry | string>;
const countryOf = (iso2: string): FileCountry | null => {
  const c = file[iso2.toUpperCase()];
  return c && typeof c === "object" ? c : null;
};
const isPct = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0 && v <= 100;

export function buildSurvival(iso2: string): Survival | null {
  const c = countryOf(iso2);
  const pts = (c?.curve?.points ?? []).filter((p) => Number.isInteger(p.year) && p.year > 0 && isPct(p.pct)).sort((a, b) => a.year - b.year);
  if (!c?.curve || pts.length < 3) return null;
  /* A cohort only falls: a year above the one before it is a stitched curve, and it is not drawn. */
  if (pts.some((p, i) => i > 0 && p.pct > pts[i - 1].pct)) return null;
  const last = pts[pts.length - 1];
  const r = c.regions;
  const regions = r && r.year === last.year && isPct(r.best?.pct) && isPct(r.worst?.pct) && r.best.pct > r.worst.pct ? { best: r.best, worst: r.worst } : null;
  return { iso2: iso2.toUpperCase(), cohort: c.curve.cohort, points: pts, last, regions };
}

export function buildObstacles(iso2: string): Obstacles | null {
  const c = countryOf(iso2);
  const labels = COPY.firstYears.obstacles as Record<string, string>;
  const items = (c?.obstacles?.items ?? []).filter((i) => isPct(i.pct) && labels[i.key]).map((i) => ({ key: i.key, label: labels[i.key], pct: i.pct }));
  if (!c?.obstacles || items.length < 4) return null;
  return { iso2: iso2.toUpperCase(), year: c.obstacles.year, items: items.sort((a, b) => b.pct - a.pct) };
}

/** Every country the file holds, for the stories. */
export function listSurvivalCountries(): string[] {
  return Object.keys(file).filter((k) => !k.startsWith("_"));
}
