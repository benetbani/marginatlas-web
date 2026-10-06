/**
 * src/lib/spine/home_answers.ts
 *
 * THE UK'S HEADLINE ANSWERS ON THE HOME PAGE (milestone 3, masterplan step 34; his interview of 2026-09-26, ruling 11: "a
 * place-and-trade search, then the UK's headline answers"). Three answers, each the same figure, under the same name and in the
 * same unit, as the section of /gb it opens, read from the same builder /gb reads, never a second number for the same thing:
 *
 *   the UK's answer           buildHeroBoard: the total effective tax burden on a sole trader's profit, the page's one 40
 *   who is still trading      buildSurvival: the share of new firms still trading after the cohort's last year
 *   what London's trades take buildLondonTradeSales, londonMiddleSales: the middle trade's typical yearly sales
 *
 * IN THAT ORDER, THE TRADES LAST (2026-10-07): from 768 to 1023 the level of three stands two and one, the third across the whole
 * row (zones.tsx, "1-1-1"), and of the three only the trades' card fills a row that wide (its range runs the card's width); the
 * ring, centred, would leave two blank sides wider than the page filter's hole.
 *
 * Each carries where its figure came from, and the href of the /gb section it summarises (the doors gate reads `lands`).
 *
 * ONE NAME, ONE FIGURE, ONE LINE A CARD, AND ITS DRAWING (his instruction of 2026-10-07, "reform home drastically", the home's
 * words cut by half; clause 65, a figure is never alone). The rows each card carried (two other taxes, four trades, four years)
 * left; what stands beside the figure is a drawing of it, which costs no words: the tax burden's own bar from /gb's masthead,
 * the middle trade's sales on the range of London's trades (every trade a hairline), the share still trading as a ring. The tax
 * burden's and the years' lines are the short forms of /gb's (COPY.home.lines), the same facts in fewer words.
 */
import { buildHeroBoard } from "@/lib/spine/hero_board";
import { ukTaxOnProfit } from "@/lib/spine/uk_tax_on_profit";
import { buildLondonTradeSales, londonMiddleSales } from "@/lib/spine/country_depth_rows";
import { buildSurvival } from "@/lib/spine/sections/first_years";
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { SURFACE_ANSWERS, type DoorKind } from "@/lib/spine/door_kinds";
import type { Provenance } from "@/lib/spine/provenance";
import type { AtlasIconId } from "@/components/brand/icons";
import type { WorldRange } from "@/lib/spine/world_stats";

export type HomeAnswer = {
  key: "answer" | "trades" | "years";
  /** The section's id on the home page. */
  id: string;
  href: string;
  lands: DoorKind;
  kicker: string;
  icon: AtlasIconId;
  figure: string;
  words: string;
  prov: Provenance;
  /** A share of a whole, drawn (his law of 2026-09-19): the tax burden's own bar from /gb's masthead. `value` is out of 100. */
  bar?: { value: number; part?: string; rest?: string; aria: string };
  /** The middle trade's sales on the range of London's trades: the set's ends and middle half, every trade's figure a hairline. */
  range?: { range: WorldRange; values: number[] };
  /** The share still trading, out of 100, drawn as a ring with the figure inside it. */
  ring?: number;
};

/** The set's quantile, interpolated (world_stats.ts's rule), for the middle half of London's trades. */
function quantile(sorted: number[], q: number): number {
  const at = (sorted.length - 1) * q;
  const lo = Math.floor(at);
  const hi = Math.ceil(at);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (at - lo);
}

export function buildHomeAnswers(iso2 = "GB"): HomeAnswer[] {
  if (iso2.toUpperCase() !== "GB") return [];
  const lands = SURFACE_ANSWERS.country;
  const out: HomeAnswer[] = [];

  const board = buildHeroBoard("GB");
  /* The profit the masthead's basis names, from the one function the masthead reads (uk_tax_on_profit.ts), in the short line. */
  const uk = ukTaxOnProfit();
  if (board.answer?.prov && board.answerBasis && uk) {
    const bar = board.answerBar ? { value: board.answerBar.value, part: board.answerBar.part, rest: board.answerBar.rest, aria: board.answerBar.aria } : undefined;
    out.push({ key: "answer", id: "answer", href: "/gb#take", lands, kicker: board.answer.label, icon: "taxes", figure: board.answer.value, words: COPY.home.lines.answer.replace("{profit}", usd(uk.profitUsd)), prov: board.answer.prov, ...(bar ? { bar } : {}) });
  }

  const sales = buildLondonTradeSales();
  if (sales) {
    const middle = londonMiddleSales(sales);
    const values = sales.rows.map((r) => r.value).sort((a, b) => a - b);
    out.push({
      key: "trades",
      id: "trades",
      href: "/gb#money",
      lands,
      kicker: COPY.londonSales.kicker,
      icon: "owner-keeps",
      figure: usd(middle),
      words: COPY.londonSales.focalWords,
      /* The middle of the trades' register medians, each read from the register's band counts (turnover.json). */
      prov: { src: `uk/registers/turnover.json:the middle of ${sales.rows.length} London trades`, kind: "worked out" },
      /* The same trades /gb ranks, their lowest and highest at the track's ends, their middle half shaded, each a hairline. */
      range: { range: { min: values[0], p25: quantile(values, 0.25), median: middle, p75: quantile(values, 0.75), max: values[values.length - 1], count: values.length }, values },
    });
  }

  const survival = buildSurvival("GB");
  if (survival) {
    const figure = `${Math.round(survival.last.pct)}%`;
    const words = COPY.home.lines.years.replace("{n}", String(survival.last.year));
    out.push({
      key: "years",
      id: "years",
      href: "/gb#first-years",
      lands,
      kicker: COPY.firstYears.kicker,
      icon: "first-year",
      figure,
      words,
      prov: { src: `sections/survival.json:GB:the ${survival.cohort} cohort`, kind: "looked up" },
      ring: survival.last.pct,
    });
  }
  const ORDER: HomeAnswer["key"][] = ["answer", "years", "trades"];
  return ORDER.map((k) => out.find((a) => a.key === k)).filter((a): a is HomeAnswer => !!a);
}

/* WHAT THE ATLAS HOLDS LEFT THE HOME PAGE (his instruction of 2026-10-07, "reform home drastically"): its counts (252 cities,
   1,266 districts, 94 countries of 195) took in the city pages outside the UK, which are not indexed, so the page claimed more
   than a visitor can reach. The ledger module (src/lib/home/atlas_ledger.ts) stays: the live home's band and the launch check
   read it. */
