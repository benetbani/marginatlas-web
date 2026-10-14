/**
 * src/lib/spine/slots/last.ts , STAGE 5, TO LAST: SLOTS 12 AND 13 (plan 2026-10-13 country-page-journey, Task 3G; spec sections 2 and 3; R5
 * section 5): "Will it survive, and what if it does not?"
 *   12 HOW MANY LAST (SHARE of 100): the survival curve, its figure at 30 its own (SurvivalCurve, the region lever), so the slot draws no
 *      second lead; behind the plus what holds firms back, where new firms last by city (doors to the cities) and the trades that fail most
 *      (doors to the trade pages, while the feed is fresh). The UK's alone today (data/sections/survival.json).
 *   13 SELLING OR FAILING (TIME): off the UK, the time to sell at 30, its slow end placed among the countries with its signal, the buyers in
 *      its words, the usual span drawn beside it; on the UK, whose sale times have no source, if it fails: the months to be freed at 30, its
 *      times as rows with their units in their labels (the strike-off's from the rules beside the failure law's), its costs and what it
 *      reaches behind the plus. The director's loan charge is a tax and stands in slot 1 (Task 3B).
 */
import { COPY } from "@/lib/spine/copy";
import { buildSurvival, buildObstacles, type Survival } from "@/lib/spine/sections/first_years";
import { buildFirmsLast } from "@/lib/home/firms_last";
import { buildDuel } from "@/lib/home/duel";
import { buildCountryExit, exitMonthsText, worldExitHighs, type CountryExitData } from "@/lib/spine/country_exit_rows";
import { buildIfItFails } from "@/lib/spine/sections/if_it_fails";
import { lawValue, ruleRaw, ruleRow } from "@/lib/spine/sections/country_rules";
import { signalFor } from "@/lib/spine/signal";
import { datedRow } from "./dated";
import { durationParts } from "./run";
import { list, present, valueClass, type SlotLead, type SlotModel, type SlotRow } from "./types";

const J = COPY.journey;

export type LastingDrawing = { survival: Survival };
export function buildLastingSlot(iso2In: string, today: string): SlotModel<LastingDrawing> | null {
  const iso2 = iso2In.toUpperCase();
  const survival = buildSurvival(iso2);
  if (!survival) return null;
  const C = COPY.firstYears;
  const back: SlotRow[] = (buildObstacles(iso2)?.items ?? []).map((o, i) => ({ key: o.key, label: o.label, value: `${o.pct}%`, note: i === 0 ? C.obstaclesWords.replace("{item}", o.label.toLowerCase()) : null, prov: o.prov }));
  const lasts = iso2 === "GB" ? buildFirmsLast() : null;
  const L = J.lastRows;
  const byCity: SlotRow[] = (lasts?.rows ?? []).map((r, i) => ({ key: r.key, label: r.name, value: `${r.display}%`, note: i === 0 ? L.cohort.replace("{cohort}", String(lasts!.cohort)).replace("{year}", String(lasts!.year)) : null, prov: r.prov, href: r.href }));
  const duel = iso2 === "GB" ? buildDuel(today) : null;
  const failMost: SlotRow[] = duel
    ? [
        ...duel.rows.slice(0, 2).map((r, i): SlotRow => ({ key: r.key, label: r.name, value: `${r.value.toFixed(1)}%`, note: i === 0 ? L.insolvent : null, prov: r.prov, href: r.href })),
        { key: "middle", label: L.middle, value: `${duel.middle.figure}%`, note: L.ofTrades.replace("{n}", String(duel.count)), prov: duel.middle.prov },
        ...duel.rows.slice(2).map((r): SlotRow => ({ key: r.key, label: r.name, value: `${r.value.toFixed(1)}%`, note: null, prov: r.prov, href: r.href })),
      ]
    : [];
  const M = J.more;
  return {
    id: "lasting",
    lead: null,
    rows: null,
    more: present([list("back", M.back, "share", back), list("by-city", M.byCity, "share", byCity), list("fail-most", M.failMost, "share", failMost)]),
    drawing: { survival },
    thin: false,
  };
}

export type ExitDrawing = { exit: CountryExitData | null };
export function buildExitSlot(iso2In: string, today: string): SlotModel<ExitDrawing> | null {
  const iso2 = iso2In.toUpperCase();
  const fails = iso2 === "GB" ? buildIfItFails() : null;
  if (fails) {
    const X = J.exit;
    const TIME_LABEL: Record<string, string> = { "liquidation-time": X.liquidation, "director-ban": X.ban };
    const times: SlotRow[] = [];
    const costs: SlotRow[] = [];
    const reach: SlotRow[] = [];
    for (const r of fails.rows) {
      if (r.key === "directors-loan") continue;
      const text = String(r.value);
      const cls = valueClass(text);
      const d = cls === "time" ? durationParts(text) : null;
      const row: SlotRow = { key: r.key, label: r.label, value: text, note: r.note ?? null, prov: r.prov ?? null };
      if (d && TIME_LABEL[r.key]?.endsWith(d.unit)) times.push({ ...row, label: TIME_LABEL[r.key], value: d.figure });
      else if (cls === "money") costs.push(row);
      else if (cls === "state") reach.push(row);
    }
    /* THE SOLVENT CLOSE BESIDE THE FAILURE (rules.json closing; the paperwork card's "To close" until now): its two waits as times, its fee
       a cost, dated where the ledger dates it. */
    for (const [key, label] of [["strike-off-notice", X.strikeNotice], ["no-trading-period", X.noTrading]] as const) {
      const v = ruleRaw(iso2, "closing", key);
      if (v && typeof v.months === "number") times.push({ key, label, value: String(v.months), note: ruleRow(iso2, "closing", key)?.note ?? null });
    }
    const fee = ruleRow(iso2, "closing", "strike-off-fee");
    if (fee) {
      const d = datedRow(iso2, "strike-off-fee", today, (v) => lawValue(v, true));
      costs.push(d ? { ...fee, value: d.value, note: d.note ?? fee.note ?? null, change: "strike-off-fee" } : fee);
    }
    return {
      id: "exit",
      lead: { figure: `${fails.focal.months} ${COPY.ifItFails.months}`, words: COPY.ifItFails.words, prov: fails.focal.prov },
      rows: times.length ? { key: "times", head: J.slots.exit.heading, type: "time", rows: times } : null,
      more: present([list("costs", J.more.failCosts, "money", costs), list("reach", J.more.failReach, "state", reach)]),
      drawing: { exit: null },
      thin: false,
    };
  }
  /* OFF THE UK: THE TIME TO SELL, its slow end placed among every shard's slow ends (the placement's own set), its signal from the same. */
  const exit = buildCountryExit(iso2);
  if (!exit) return null;
  const lo = exit.marks[0].value;
  const hi = exit.marks[exit.marks.length - 1].value;
  const highs = worldExitHighs();
  const buyers = exit.climateWord ? J.buyers[exit.climateWord] : undefined;
  const lead: SlotLead = {
    figure: `${exitMonthsText(lo).replace(/ months?$/, "")} to ${exitMonthsText(hi)}`,
    words: buyers ? `${J.exitWords}, ${buyers}` : J.exitWords,
    placement: exit.placement,
    placed: "time-to-sell",
    ...(highs ? signalFor("time-to-sell", hi, highs) : { signal: null, noSignal: "set" as const }),
  };
  return { id: "exit", lead, rows: null, more: [], drawing: { exit }, thin: true, gloss: COPY.countryExit.basis };
}
