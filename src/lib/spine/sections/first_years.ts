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
import type { Provenance } from "@/lib/spine/provenance";

export type SurvivalPoint = { year: number; pct: number };
/** A point the builder has stamped (fix round F1, group G2, the final review's M2): `prov` names the key of data/sections/survival.json the
 *  share was read from, so the label that prints it can say so as an obstacle's label does. */
export type StampedPoint = SurvivalPoint & { prov: Provenance };
export type Survival = {
  iso2: string;
  cohort: number;
  points: StampedPoint[];
  last: StampedPoint;
  regions: { best: { name: string; pct: number }; worst: { name: string; pct: number } } | null;
  /** The place the country's curve is ("the UK"), and each region's own curve for the same cohort (2026-09-26, the region lever). */
  place: string | null;
  regionCurves: Array<{ key: string; name: string; inName: string; points: StampedPoint[] }>;
  /** The stamp of the curve's START, year 0 with every firm still trading: no share the file holds (its series begins at year 1) but the
   *  whole cohort by definition, every share in the file being a share of that cohort's births. It is worked out from the file's
   *  `cohort` (the method is that division, stated here where the figure is built), and the curve prints the start's label with it. */
  startProv: Provenance;
};
/** `prov`: where the share was read (the survey table in data/sections/survival.json, a published count read there), stamped on every
 *  figure that prints it (critique pass 2, fix round C2, item P1.5: the leading obstacle now prints its share too). */
export type Obstacle = { key: string; label: string; pct: number; prov: Provenance };
export type Obstacles = { iso2: string; year: number; items: Obstacle[] };

type FileCountry = {
  curve?: { cohort: number; points: SurvivalPoint[] };
  regions?: { year: number; best: { name: string; pct: number }; worst: { name: string; pct: number } };
  place?: string;
  regionCurves?: { cohort: number; regions: Array<{ key: string; name: string; inName: string; points: SurvivalPoint[] }> };
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
  /* EVERY POINT SAYS WHERE ITS SHARE WAS READ (fix round F1, group G2): the key of the file it came from, as buildObstacles stamps an
     obstacle's share, "looked up" because the file's own source line is a published table read on a date. The country's points are
     keyed by year, a region's by region and year; the key names no entry the file lacks. */
  const ISO = iso2.toUpperCase();
  const stamp = (key: string): Provenance => ({ src: `sections/survival.json:${ISO}:${key}`, kind: "looked up" });
  const points: StampedPoint[] = pts.map((p) => ({ ...p, prov: stamp(`curve:${p.year}`) }));
  const last = points[points.length - 1];
  const r = c.regions;
  const regions = r && r.year === last.year && isPct(r.best?.pct) && isPct(r.worst?.pct) && r.best.pct > r.worst.pct ? { best: r.best, worst: r.worst } : null;
  /* A region's curve is drawn only as the country's is: the same cohort, the same years, and falling year on year. */
  const regionCurves = (c.regionCurves && c.regionCurves.cohort === c.curve.cohort
    ? c.regionCurves.regions.filter((r) => r.points.length === pts.length && r.points.every((p, i) => p.year === pts[i].year && isPct(p.pct) && (i === 0 || p.pct <= r.points[i - 1].pct)))
    : []
  ).map((r) => ({ ...r, points: r.points.map((p) => ({ ...p, prov: stamp(`regionCurves:${r.key}:${p.year}`) })) }));
  const startProv: Provenance = { src: `sections/survival.json:${ISO}:curve:cohort`, kind: "worked out" };
  return { iso2: ISO, cohort: c.curve.cohort, points, last, regions, place: typeof c.place === "string" ? c.place : null, regionCurves, startProv };
}

export function buildObstacles(iso2: string): Obstacles | null {
  const c = countryOf(iso2);
  const labels = COPY.firstYears.obstacles as Record<string, string>;
  const items = (c?.obstacles?.items ?? []).filter((i) => isPct(i.pct) && labels[i.key]).map((i) => ({ key: i.key, label: labels[i.key], pct: i.pct, prov: { src: `sections/survival.json:${iso2.toUpperCase()}:obstacles:${i.key}`, kind: "looked up" as const } }));
  if (!c?.obstacles || items.length < 4) return null;
  return { iso2: iso2.toUpperCase(), year: c.obstacles.year, items: items.sort((a, b) => b.pct - a.pct) };
}

/** Every country the file holds, for the stories. */
export function listSurvivalCountries(): string[] {
  return Object.keys(file).filter((k) => !k.startsWith("_"));
}
