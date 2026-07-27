/**
 * src/components/spine2/calc-engine.ts
 *
 * The calculator's pure compute, plain module, no React. BATCH-C's ratified
 * shape: one INVARIANT COMPUTE, config-per-trade. Any business on earth is up
 * to six variables tagged with one of four kinds:
 *
 *   revenue = PRODUCT(volume vars) x PRODUCT(price vars) x days
 *   keep    = revenue x (1 - SUM(pct vars)/100) - SUM(fixed vars)
 *
 * Only the config changes; the compute never does.
 *
 * M7 couplings enforced here, not in the component:
 *   - the leverage caption is TEMPLATED from LeverageSpec and the delta is
 *     COMPUTED from the same spec (the mockup drifted: probe v*0.05 = 2.6
 *     orders under a hand-typed "five more orders a day" caption);
 *   - the result note is LOOKED UP in the config's ascending threshold ladder,
 *     never typed per render;
 *   - assertCalibration() proves compute(defaults) reproduces the page's
 *     published take-home, so the calculator can never contradict its page.
 */

import { usd } from "./fmt";
import type { GlyphId } from "./glyphs";

export type VarKind = "volume" | "price" | "pct" | "fixed";

/**
 * One realistic move on one variable. The caption and the probe both come
 * from this spec alone (M7: one source for the sentence and the arithmetic).
 */
export type LeverageSpec =
  | { kind: "pct"; pct: number; direction: "up" | "down"; noun: string }
  | { kind: "abs"; amount: number; direction: "up" | "down"; noun: string };

/** Named formatter ids so configs stay serialisable (no closures in config). */
export type FormatId = "int" | "usd" | "pct" | "money";

export interface CalcVar {
  id: string;
  kind: VarKind;
  label: string;
  glyph: GlyphId;
  min: number;
  max: number;
  step: number;
  /** The set of defaults must reproduce the published take-home. */
  defaultValue: number;
  format: FormatId;
  leverage: LeverageSpec;
}

export interface CalcConfig {
  trade: string;
  /** Trading days a year. */
  days: number;
  /** Up to six; any business on earth is these four kinds. */
  vars: CalcVar[];
  /**
   * Ascending thresholds; the final entry has below: Infinity. The rendered
   * note is looked up from `keep`, never typed.
   */
  notes: { below: number; say: string }[];
}

export type CalcValues = Record<string, number>;

/* ------------------------------------------------------------------ */
/* formatters                                                          */
/* ------------------------------------------------------------------ */

export function formatValue(id: FormatId, v: number): string {
  switch (id) {
    case "int":
      return String(Math.round(v));
    case "usd":
      return `$${Math.round(v)}`;
    case "pct":
      return `${Math.round(v)}%`;
    case "money":
      return usd(v) ?? "";
  }
}

/* ------------------------------------------------------------------ */
/* the invariant compute                                               */
/* ------------------------------------------------------------------ */

export function defaultsOf(config: CalcConfig): CalcValues {
  const out: CalcValues = {};
  for (const v of config.vars) out[v.id] = v.defaultValue;
  return out;
}

export function computeRevenue(config: CalcConfig, values: CalcValues): number {
  let volume = 1;
  let price = 1;
  for (const v of config.vars) {
    const x = values[v.id] ?? v.defaultValue;
    if (v.kind === "volume") volume *= x;
    else if (v.kind === "price") price *= x;
  }
  return volume * price * config.days;
}

export function computeKeep(config: CalcConfig, values: CalcValues): number {
  const revenue = computeRevenue(config, values);
  let pctSum = 0;
  let fixedSum = 0;
  for (const v of config.vars) {
    const x = values[v.id] ?? v.defaultValue;
    if (v.kind === "pct") pctSum += x;
    else if (v.kind === "fixed") fixedSum += x;
  }
  return revenue * (1 - pctSum / 100) - fixedSum;
}

/* ------------------------------------------------------------------ */
/* the note ladder                                                     */
/* ------------------------------------------------------------------ */

/** First ascending threshold the keep falls below; final rung is Infinity. */
export function noteFor(config: CalcConfig, keep: number): string {
  for (const n of config.notes) if (keep < n.below) return n.say;
  return config.notes[config.notes.length - 1]?.say ?? "";
}

/* ------------------------------------------------------------------ */
/* leverage , caption and delta from ONE spec (M7)                     */
/* ------------------------------------------------------------------ */

/** The variable's value after the spec's one realistic move. */
export function leverageProbe(v: CalcVar, value: number): number {
  const sign = v.leverage.direction === "up" ? 1 : -1;
  if (v.leverage.kind === "pct") return value * (1 + (sign * v.leverage.pct) / 100);
  return value + sign * v.leverage.amount;
}

/** What the move is worth: keep(probed) - keep(current). */
export function leverageGain(
  config: CalcConfig,
  values: CalcValues,
  v: CalcVar,
): number {
  const probe: CalcValues = { ...values, [v.id]: leverageProbe(v, values[v.id] ?? v.defaultValue) };
  return computeKeep(config, probe) - computeKeep(config, values);
}

/**
 * The caption, templated from the same spec that computes the delta.
 * pct: "5% off the rota" / "5% more the rota"; abs formats the amount with the
 * var's own formatter: "$2 more a head", "5 more orders a day", "2% off food cost".
 */
export function leverageCaption(v: CalcVar): string {
  const spec = v.leverage;
  const amount =
    spec.kind === "pct" ? `${spec.pct}%` : formatValue(v.format, spec.amount);
  const joiner = spec.direction === "up" ? "more" : "off";
  return `${amount} ${joiner} ${spec.noun}`;
}

/* ------------------------------------------------------------------ */
/* self-omit (M9)                                                      */
/* ------------------------------------------------------------------ */

function hasBounds(v: CalcVar): boolean {
  return (
    Number.isFinite(v.min) &&
    Number.isFinite(v.max) &&
    Number.isFinite(v.step) &&
    v.max > v.min
  );
}

/** Vars that render as sliders: full bounds and a finite default. */
export function sliderVars(config: CalcConfig): CalcVar[] {
  return config.vars.filter((v) => hasBounds(v) && Number.isFinite(v.defaultValue));
}

/**
 * pct/fixed vars with a published default but no usable bounds stay in the
 * compute as constants (no slider). volume/price cannot degrade this way.
 */
export function constantVars(config: CalcConfig): CalcVar[] {
  return config.vars.filter(
    (v) =>
      !hasBounds(v) &&
      Number.isFinite(v.defaultValue) &&
      (v.kind === "pct" || v.kind === "fixed"),
  );
}

/**
 * The section renders only when the compute can run: at least one volume and
 * one price var with full slider bounds, and every var either a slider or a
 * degradable constant. A partial calculator never renders (M9).
 */
export function isRenderable(config: CalcConfig): boolean {
  if (!Number.isFinite(config.days) || config.days <= 0) return false;
  if (config.notes.length === 0) return false;
  const sliders = sliderVars(config);
  if (!sliders.some((v) => v.kind === "volume")) return false;
  if (!sliders.some((v) => v.kind === "price")) return false;
  const usable = new Set([...sliders, ...constantVars(config)].map((v) => v.id));
  return config.vars.every((v) => usable.has(v.id));
}

/* ------------------------------------------------------------------ */
/* calibration , the page never contradicts itself                     */
/* ------------------------------------------------------------------ */

/** True when compute(defaults) prints the same figure as the published take-home. */
export function calibrationOk(
  config: CalcConfig,
  published: { ownerKeeps: number },
): boolean {
  const computed = computeKeep(config, defaultsOf(config));
  return usd(computed) === usd(published.ownerKeeps);
}

/**
 * Throws unless the config's defaults reproduce the published take-home
 * within display rounding. Called in dev by the config module; the prebuild
 * number gate owns the production-grade version of the same relationship.
 */
export function assertCalibration(
  config: CalcConfig,
  published: { ownerKeeps: number },
): void {
  if (calibrationOk(config, published)) return;
  const computed = computeKeep(config, defaultsOf(config));
  throw new Error(
    `calc config "${config.trade}" is out of calibration: ` +
      `compute(defaults) = ${usd(computed)} (${Math.round(computed)}) but the ` +
      `published take-home is ${usd(published.ownerKeeps)} (${published.ownerKeeps}). ` +
      `The defaults must reproduce the page's own number.`,
  );
}

/* ------------------------------------------------------------------ */
/* URL state , ?c=vol:60,rent:70000                                    */
/* ------------------------------------------------------------------ */

/**
 * Serialise only the vars that differ from their defaults; null when nothing
 * does, so canonical URLs stay clean.
 */
export function encodeState(config: CalcConfig, values: CalcValues): string | null {
  const parts: string[] = [];
  for (const v of sliderVars(config)) {
    const x = values[v.id];
    if (x != null && Number.isFinite(x) && x !== v.defaultValue) {
      parts.push(`${v.id}:${x}`);
    }
  }
  return parts.length ? parts.join(",") : null;
}

/**
 * Parse a location.search back to a full value set. Values clamp to
 * [min,max]; unknown ids and unparsable entries are ignored (configs evolve).
 */
export function decodeState(config: CalcConfig, search: string): CalcValues {
  const values = defaultsOf(config);
  let raw: string | null = null;
  try {
    raw = new URLSearchParams(search).get("c");
  } catch {
    raw = null;
  }
  if (!raw) return values;
  const byId = new Map(sliderVars(config).map((v) => [v.id, v]));
  for (const part of raw.split(",")) {
    const i = part.indexOf(":");
    if (i <= 0) continue;
    const v = byId.get(part.slice(0, i));
    if (!v) continue;
    const n = Number(part.slice(i + 1));
    if (!Number.isFinite(n)) continue;
    values[v.id] = Math.min(v.max, Math.max(v.min, n));
  }
  return values;
}
