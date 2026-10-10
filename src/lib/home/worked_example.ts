/**
 * src/lib/home/worked_example.ts
 *
 * THE WORKED EXAMPLE, A LONDON RESTAURANT IN FOUR STEPS (plan docs/superpowers/plans/2026-10-09-home-introduction.md, Task 6; the home's
 * spec of 2026-10-09, section 2, approved as written). The case the picker opens on (src/lib/home/search_cascade.ts, CASCADE_PREFILLS[0]),
 * answered with the London page's own figures, each read from the builder that page reads (never typed), each with its kind
 * (src/lib/spine/provenance.ts) and one line that says how it was made (steps 1 to 3 open with it, step 4 names what it counts first):
 *
 *   1 Registered businesses   londonTradeHero's firms cell, the register's count                    counted
 *   2 Typical yearly sales    londonTradeStrip's typical mark, the strip's tenths drawn beside it    worked out
 *   3 Sales to break even     londonTradeHero's answer, with its "Take that much" share             estimate
 *   4 Insolvent a year        ukInsolvencyPer100: notices matched by name, of 100 live companies    worked out
 *
 * Step 2 carries the London pages' own name for the typical, "Typical yearly sales" (COPY.londonTrade.salesLabel, the answer's label on a
 * London trade page without a break-even); a restaurant's page draws the same figure as its strip's "Typical" under "Sales a year". Step
 * 4's name is the spec's: the restaurant page prints the 2.9 in a sentence, with no label.
 *
 * A restaurant and not the bakery the presented design named: the bakery's break-even prints nowhere (plan 06 rule (g),
 * londonMoneyPrints: its recipe carries no utilities) and its survival maps to two groups. The case must stay whole or the example does
 * not draw (exampleCaseWhole).
 */
import premisesJson from "../../../data/uk/registers/premises.json";
import failuresJson from "../../../data/uk/registers/failures.json";
import { londonTradeHero, londonTradeStrip, londonMoneyPrints, londonShareAbove, PREMISES_NOUN, type LondonStripMark } from "@/lib/spine/london_trade_hero";
import { londonTradeRegister, londonTradeSales, londonRegisterMonth } from "@/lib/uk/registers/london_trade";
import { ukInsolvencyPer100 } from "@/lib/spine/uk_trade_typical";
import { tradeSurvivalUk } from "@/lib/uk/registers/survival";
import { ukTradePagePath } from "@/lib/home/destination";
import { SLUG_TO_INDUSTRY } from "@/lib/taxonomy";
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { own } from "@/lib/own";
import { registerSrc, type Provenance } from "@/lib/spine/provenance";

const PREMISES = premisesJson as unknown as { trade_category: Record<string, string> };
const FAILURES = failuresJson as unknown as { trades: Record<string, { match?: string }> };

/** The case the example works: the picker's first prefill, restaurants in London. */
export const EXAMPLE_TRADE = "restaurants";

export type ExampleStep = { n: "1" | "2" | "3" | "4"; label: string; figure: string; line: string; prov: Provenance };
export type WorkedExample = {
  trade: string;
  /** The London page the left half's door opens. */
  href: string;
  place: { title: string; registered: ExampleStep; sales: ExampleStep; strip: LondonStripMark[]; door: string };
  pays: { title: string; breakEven: ExampleStep; above: { part: number; figure: string; label: string; prov: Provenance }; insolvent: ExampleStep; door: string };
};

/** The clauses of a whole case, each named so a test can show each one is there (tests/home/home_answers.test.ts holds a trade that
 *  fails each): break-even prints (`money`) and its share (`share`), every tenth is placed (`placed`), the failures sit on an exact
 *  code (`exact`), one survival group (`survival`). */
export function exampleCaseClauses(slug: string) {
  const sales = londonTradeSales(slug);
  return {
    money: londonMoneyPrints(slug),
    share: londonShareAbove(slug) != null,
    placed: !!sales && [sales.q10, sales.q50, sales.q90].every((q) => q.open === false),
    exact: own(FAILURES.trades, slug)?.match === "exact",
    survival: tradeSurvivalUk(slug) !== null,
  };
}

/** Whether a London trade's case is whole: every clause of exampleCaseClauses holds. */
export function exampleCaseWhole(slug: string): boolean {
  return Object.values(exampleCaseClauses(slug)).every(Boolean);
}

/** `insolvent` is the UK's company insolvencies a year per 100 live companies, ukInsolvencyPer100(slug) unless it is handed in (a test
 *  hands in a whole rate, which no trade of the slice has today). Step 4 writes it as the trade page does (market.tsx prints String of
 *  the same number), so a whole rate reads "3" on both and never "3.0". */
export function buildWorkedExample(slug: string = EXAMPLE_TRADE, insolvent: number | null = ukInsolvencyPer100(slug)): WorkedExample | null {
  if (!exampleCaseWhole(slug)) return null;
  const C = COPY.home.example;
  const hero = londonTradeHero(slug);
  const strip = londonTradeStrip(slug);
  const share = londonShareAbove(slug);
  const month = londonRegisterMonth();
  const noun = PREMISES_NOUN[own(PREMISES.trade_category, slug) ?? ""];
  const trade = own(SLUG_TO_INDUSTRY, slug)?.name;
  if (!hero || hero.kind !== "breakEven" || !strip || !londonTradeRegister(slug) || share == null || insolvent == null || !month || !noun || !trade) return null;
  const firms = hero.cells.find((c) => c.key === "firms");
  const above = hero.cells.find((c) => c.key === "above");
  const typical = strip.marks.find((m) => m.key === "typical");
  if (!firms?.prov || !above?.prov || !typical) return null;
  return {
    trade: slug,
    href: ukTradePagePath(slug),
    place: {
      title: C.placeTitle.replace("{trade}", trade),
      registered: { n: "1", label: firms.label, figure: String(firms.value), line: C.registered.replace("{month}", month), prov: firms.prov },
      sales: { n: "2", label: COPY.londonTrade.salesLabel, figure: usd(typical.value), line: C.sales, prov: typical.prov },
      strip: strip.marks,
      door: C.placeDoor.replace("{trade}", trade.toLowerCase()),
    },
    pays: {
      title: C.paysTitle,
      breakEven: { n: "3", label: hero.answer.label, figure: hero.answer.value, line: C.breakEven.replace("{basis}", hero.answer.basis), prov: hero.answer.prov },
      above: { part: share, figure: String(above.value), label: above.label, prov: above.prov },
      insolvent: { n: "4", label: C.insolventLabel, figure: C.insolventFigure.replace("{n}", String(insolvent)), line: C.insolvent.replace("{noun}", noun), prov: { src: registerSrc("failures.json", slug), kind: "worked out" } },
      door: C.paysDoor,
    },
  };
}
