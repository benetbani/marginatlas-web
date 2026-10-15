/**
 * src/lib/simulator/bundle.ts , A PLACE'S DEFAULTS AND THE READER'S CHANGES, AS THE ENGINE TAKES THEM (plan 2026-10-13 cost-simulator, Task 2).
 * Pure and small: the browser imports it with the engine. The defaults builder (defaults.ts, on the server) writes a SimBundle; the levers write
 * a SimState; toEngine joins them, every figure the reader set stamped "yours" (`calculator:lever:<key>`). The owner's pay and the profit goal are
 * off until the reader turns them on (R7 4.1: "none by default: the owner keeps the profit").
 */
import type { EngineInputs, Form, Share, Spread, Stamp, Tax, Value } from "./engine";

export type Level = "city" | "nation" | "country" | "trade" | "sector" | "law" | "none";
export type SimInput = { value: number | null; stamp: Stamp | null; level: Level; line: string };

export const LEVERS = ["area", "rent", "service", "oncost", "sales", "ticket", "goods", "runShare", "owner", "target", "loanAmount", "loanRate", "loanYears", "opening"] as const;
export type LeverKey = (typeof LEVERS)[number];

export type SimRole = { key: string; name: string; sub: string | null; heads: number; headsStamp: Stamp; pay: SimInput; owner: boolean };
export type OpeningLine = { key: string; name: string; amount: number; stamp: Stamp };
export type OpeningRule = { kind: "held" | "built" | "none"; lines: OpeningLine[]; line: string };

export type SimBundle = {
  path: "uk-model" | "world";
  currency: "GBP" | "USD";
  inputs: Record<LeverKey, SimInput>;
  roles: SimRole[];
  teamLine: string;
  /** The UK's law per hire (employer_cost.ts); `allowance` false on the UK model, whose staff line has spent the Employment Allowance. */
  ukLaw: { allowance: boolean } | null;
  lines: Array<{ key: string; name: string; amountYear: number; stamp: Stamp }>;
  variable: Share[] | null;
  rates: EngineInputs["rates"];
  ratesLine: string | null;
  tax: Tax;
  spread: Spread | null;
  opening: OpeningRule;
  notes: Array<{ label: string; fact: string }>;
};

export type SimState = {
  levers: Partial<Record<LeverKey, number | null>>;
  on: { owner?: boolean; target?: boolean };
  heads: Record<string, number>;
  pay: Record<string, number>;
  form: Form | null;
};
export const FRESH: SimState = { levers: {}, on: {}, heads: {}, pay: {}, form: null };

/** The bare page's place, London restaurants, the site's exemplar (R7 4.1's first row); place.ts re-exports it. */
export const DEFAULT_PLACE = { country: "gb", city: "london", trade: "restaurants" } as const;

export const yours = (key: string): Stamp => ({ src: `calculator:lever:${key}`, kind: "yours" });

const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);

export function toEngine(b: SimBundle, s: SimState): EngineInputs {
  const pick = (k: LeverKey): Value => {
    if (has(s.levers, k)) { const x = s.levers[k]; return x == null || !Number.isFinite(x) ? null : { v: x, stamp: yours(k) }; }
    const d = b.inputs[k];
    return d.value === null || d.stamp === null ? null : { v: d.value, stamp: d.stamp };
  };
  const goods = pick("goods");
  const sum = (b.variable ?? []).reduce((a, x) => a + x.share, 0);
  /* The reader's cost of goods keeps the defaults' split between their lines, each stamped as the reader's. */
  const variable: Share[] | null = !has(s.levers, "goods") ? b.variable : goods === null ? null : sum > 0 ? (b.variable ?? []).map((x) => ({ ...x, share: (x.share * goods.v) / sum, stamp: goods.stamp })) : [{ key: "goods", share: goods.v, stamp: goods.stamp }];
  const oncost = pick("oncost");
  return {
    area: pick("area"),
    rentPerM2: pick("rent"),
    serviceChargePerM2: pick("service"),
    rates: b.rates,
    lines: b.lines.map((l) => ({ key: l.key, amountYear: l.amountYear, stamp: l.stamp })),
    roles: b.roles.map((r) => ({
      key: r.key,
      heads: has(s.heads, r.key) ? s.heads[r.key] : r.heads,
      headsStamp: has(s.heads, r.key) ? yours(`team:${r.key}`) : r.headsStamp,
      payYear: has(s.pay, r.key) ? { v: s.pay[r.key], stamp: yours(`pay:${r.key}`) } : r.pay.value === null || r.pay.stamp === null ? null : { v: r.pay.value, stamp: r.pay.stamp },
    })),
    onCost: b.ukLaw ? { law: "uk", allowance: b.ukLaw.allowance } : oncost ? { rate: oncost } : null,
    variable,
    runningShare: pick("runShare"),
    ownerPay: s.on.owner ? pick("owner") : null,
    targetProfit: s.on.target ? pick("target") : null,
    sales: pick("sales"),
    ticket: pick("ticket"),
    openingCost: pick("opening"),
    loan: { amount: pick("loanAmount"), ratePct: pick("loanRate"), years: pick("loanYears") },
    tax: b.tax.law === "uk" ? { law: "uk", form: s.form ?? b.tax.form } : b.tax,
    spread: b.spread,
  };
}
