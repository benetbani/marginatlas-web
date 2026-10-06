/**
 * src/lib/spine/home_answers.ts
 *
 * THE UK'S HEADLINE ANSWERS ON THE HOME PAGE (milestone 3, masterplan step 34; his interview of 2026-09-26, ruling 11: "a
 * place-and-trade search, then the UK's headline answers"). Three answers, each the same figure, under the same name and in the
 * same unit, as the section of /gb it opens, read from the same builder /gb reads, never a second number for the same thing:
 *
 *   the UK's answer           buildHeroBoard: the total effective tax burden on a sole trader's profit, the page's one 40
 *   what London's trades take buildLondonTradeSales, londonMiddleSales: the middle trade's typical yearly sales, and /gb's first
 *                             four trades
 *   who is still trading      buildSurvival: the share of new firms still trading after the cohort's last year
 *
 * Each carries where its figure came from, and the href of the /gb section it summarises (the doors gate reads `lands`).
 *
 * ONE NAME, ONE FIGURE, ONE LINE A CARD, AND ITS DRAWING (his instruction of 2026-10-07, "reform home drastically", the home's
 * words cut by half; clause 65, a figure is never alone). The rows each card carried (two other taxes, four trades, four years)
 * left; what stands beside the figure is a drawing of it, which costs no words: the tax burden's own bar from /gb's masthead,
 * the middle trade's sales on the range of London's trades (every trade a hairline), the share still trading as a ring.
 */
import { buildHeroBoard } from "@/lib/spine/hero_board";
import { buildLondonTradeSales, londonMiddleSales } from "@/lib/spine/country_depth_rows";
import { buildSurvival } from "@/lib/spine/sections/first_years";
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { SURFACE_ANSWERS, type DoorKind } from "@/lib/spine/door_kinds";
import type { Provenance } from "@/lib/spine/provenance";
import type { AtlasIconId } from "@/components/brand/icons";
import type { WorldRange } from "@/lib/spine/world_stats";
import { getAtlasLedger } from "@/lib/home/atlas_ledger";

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
  if (board.answer?.prov && board.answerBasis) {
    const bar = board.answerBar ? { value: board.answerBar.value, part: board.answerBar.part, rest: board.answerBar.rest, aria: board.answerBar.aria } : undefined;
    out.push({ key: "answer", id: "answer", href: "/gb#take", lands, kicker: board.answer.label, icon: "taxes", figure: board.answer.value, words: board.answerBasis, prov: board.answer.prov, ...(bar ? { bar } : {}) });
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
    const words = COPY.firstYears.focalWords.replace("{n}", String(survival.last.year));
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
  return out;
}

/**
 * WHAT THE ATLAS HOLDS (masterplan step 35; milestone 3, the criticised "What the atlas can see" replaced): the ledger module's own
 * counts (src/lib/home/atlas_ledger.ts, computed from the sources the pages are built from, never typed), the benchmarks at the
 * focal rung and the rest as rows, each stamped as counted with the ledger key it reads. The launch check's item (i) reads these
 * stamps on the served page.
 */
export type AtlasHolds = {
  focal: { figure: string; words: string; prov: Provenance };
  rows: Array<{ key: string; label: string; value: string; note: string; prov: Provenance }>;
};

export function buildAtlasHolds(): AtlasHolds {
  const l = getAtlasLedger();
  const H = COPY.home.atlas;
  const counted = (key: string): Provenance => ({ src: `lib/home/atlas_ledger.ts:${key}`, kind: "counted" });
  return {
    focal: { figure: l.benchmarks.toLocaleString("en-US"), words: H.words, prov: counted("benchmarks") },
    rows: [
      { key: "countries", label: H.rows.countries, value: `${l.countriesMeasured} of ${l.countriesTotal}`, note: H.notes.countries, prov: counted("countries") },
      { key: "cities", label: H.rows.cities, value: String(l.cities), note: H.notes.cities, prov: counted("cities") },
      { key: "districts", label: H.rows.districts, value: l.districts.toLocaleString("en-US"), note: H.notes.districts, prov: counted("districts") },
      { key: "trades", label: H.rows.trades, value: String(l.trades), note: H.notes.trades, prov: counted("trades") },
    ],
  };
}
