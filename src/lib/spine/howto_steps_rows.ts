/**
 * src/lib/spine/howto_steps_rows.ts
 *
 * THE STEPS TO REGISTER, the how-to page's `01 steps` (2026-09-23, QUEUE
 * ui:how-to-as-a-stepper, from the audit in briefs/VISUAL-CHOICE.md: the
 * how-to page's whole subject is an ordered sequence and it was drawn as four
 * prose lists, which is the one shape that hides the order).
 *
 * WHERE THE FIGURES COME FROM, each with its file and field, on the country
 * shard (`data/facts/country/<ISO2>.json`, read through `country_shard.ts`
 * into the fact store):
 *  - `setup.steps.*.name`, what the step is ("Register the company");
 *  - `setup.steps.*.how`, how it is done ("Online", "In person", "Either");
 *  - `setup.steps.*.time_days`, how long that step takes;
 *  - `setup.steps.*.cost_usd`, what that step costs;
 *  - `setup.total_days`, how long the whole registration takes.
 * Measured 2026-09-23: 198 of 198 countries hold steps, between one and seven
 * of them, most four. Nothing under `src/` had ever read them.
 *
 * THE ORDER IS THE DATA'S ORDER and is never sorted here: a sequence whose
 * order a builder decides is not a sequence, it is a list with numbers on it.
 *
 * THE TOTAL IS NOT THE SUM, AND THE PAGE SAYS SO. The United Kingdom's four
 * steps take 1, 1, 21 and 7 days and its total is 21, because steps overlap:
 * the bank account is opened while the tax registration is in the post. So
 * the total is the file's own `setup.total_days`, and the basis line says the
 * steps can run at the same time. Adding them up would have produced 30 days
 * for a country whose own file says 21, which is the kind of number that is
 * wrong in a way nobody can see.
 *
 * A STEP MISSING ITS FIGURES IS STILL A STEP. The name is the only field a
 * step cannot be without; a step with no days or no cost draws its name and
 * says nothing where the figure would be, because dropping it would break the
 * order the page exists to show.
 */
import { queryFacts } from "@/lib/facts/store";
import { loadCountryShard, countryEntityId } from "@/lib/facts/country_shard";
import type { FactTag } from "@/lib/facts/types";
import { usd } from "@/components/spine/kit";
import { COPY } from "@/lib/spine/copy";

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export type HowToStep = {
  key: string;
  /** What the step is, the shard's own words. */
  name: string;
  /** How it is done, the shard's own word ("Online", "In person", "Either"), or null. */
  how: string | null;
  /** Its own days and cost as printed, or null where the shard holds neither. */
  days: string | null;
  cost: string | null;
};

export type HowToStepsData = {
  iso2: string;
  steps: HowToStep[];
  /** The whole registration's days, the shard's own figure, never the sum of the steps. */
  totalDays: string | null;
  basis: string;
  foot: string;
  tag: FactTag;
};

/** The shard's step rows, in the file's order, one per rowKey. */
function readSteps(iso2: string): Array<{ key: string; name?: string; how?: string; days?: number; cost?: number; tag?: FactTag }> {
  if (!loadCountryShard(iso2)) return [];
  const id = countryEntityId(iso2);
  const order: string[] = [];
  const byKey = new Map<string, { key: string; name?: string; how?: string; days?: number; cost?: number; tag?: FactTag }>();
  for (const f of queryFacts({ entityId: id })) {
    if (!f.metric.startsWith("setup.steps.*.")) continue;
    const field = f.metric.slice("setup.steps.*.".length);
    const key = String(f.rowKey ?? "");
    if (!byKey.has(key)) {
      byKey.set(key, { key });
      order.push(key);
    }
    const step = byKey.get(key)!;
    if (field === "name" && typeof f.value === "string") step.name = f.value.trim();
    if (field === "how" && typeof f.value === "string") step.how = f.value.trim();
    if (field === "time_days" && isNum(f.value)) step.days = f.value;
    if (field === "cost_usd" && isNum(f.value)) step.cost = f.value;
    step.tag = step.tag && step.tag !== "held" ? step.tag : f.tag;
  }
  return order.map((k) => byKey.get(k)!).filter((s) => typeof s.name === "string" && s.name.length > 0);
}

const daysText = (d: number) => `${Math.round(d)} ${Math.round(d) === 1 ? COPY.howToSteps.units.day : COPY.howToSteps.units.days}`;

export function buildHowToSteps(iso2: string): HowToStepsData | null {
  const code = countryEntityId(iso2);
  if (!code) return null;
  const rows = readSteps(code);
  if (rows.length === 0) return null;
  const total = queryFacts({ entityId: code, metrics: ["setup.total_days"], rowKey: "" })[0];
  const steps: HowToStep[] = rows.map((r, i) => ({
    key: r.key || String(i),
    name: r.name as string,
    how: r.how ?? null,
    days: isNum(r.days) ? daysText(r.days) : null,
    /* A free step says so in a word: a zero fee printed as "$0" reads as a figure nobody checked (the free rule, COPY.free). */
    cost: isNum(r.cost) ? (r.cost > 0 ? usd(Math.round(r.cost)) : COPY.free) : null,
  }));
  const weakest: FactTag = rows.some((r) => r.tag && r.tag !== "held") ? "modeled" : "held";
  return {
    iso2: code,
    steps,
    totalDays: total && isNum(total.value) ? daysText(total.value) : null,
    basis: COPY.howToSteps.basis,
    foot: COPY.howToSteps.foot,
    tag: weakest,
  };
}
