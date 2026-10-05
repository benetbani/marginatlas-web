/**
 * src/lib/spine/home_answers.ts
 *
 * THE UK'S HEADLINE ANSWERS ON THE HOME PAGE (milestone 3, masterplan step 34; his interview of 2026-09-26, ruling 11: "a
 * place-and-trade search, then the UK's headline answers"). Three answers, each the same figure, under the same name and in the
 * same unit, as the section of /gb it opens, read from the same builder /gb reads, never a second number for the same thing:
 *
 *   the UK's answer           buildHeroBoard: the total effective tax burden on a sole trader's profit, the page's one 40
 *   what London's trades take buildLondonTradeSales, londonMiddleSales: the middle trade's typical yearly sales, and /gb's first
 *                             three trades
 *   who is still trading      buildSurvival: the share of new firms still trading after the cohort's last year
 *
 * Each carries where its figure came from, and the href of the /gb section it summarises (the doors gate reads `lands`).
 */
import { buildHeroBoard } from "@/lib/spine/hero_board";
import { buildLondonTradeSales, londonMiddleSales } from "@/lib/spine/country_depth_rows";
import { buildSurvival } from "@/lib/spine/sections/first_years";
import { usd } from "@/lib/spine/money";
import { COPY } from "@/lib/spine/copy";
import { SURFACE_ANSWERS, type DoorKind } from "@/lib/spine/door_kinds";
import type { Provenance } from "@/lib/spine/provenance";
import type { AtlasIconId } from "@/components/brand/icons";
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
  rows?: Array<{ key: string; label: string; value: string; icon?: AtlasIconId; prov: Provenance | null }>;
  /** A share of a whole, drawn (his law of 2026-09-19): the tax burden's own bar from /gb's masthead. `value` is out of 100. */
  bar?: { value: number; part?: string; rest?: string; aria: string };
};

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
    out.push({
      key: "trades",
      id: "trades",
      href: "/gb#money",
      lands,
      kicker: COPY.londonSales.kicker,
      icon: "owner-keeps",
      figure: usd(londonMiddleSales(sales)),
      words: COPY.londonSales.focalWords,
      /* The middle of the trades' register medians, each read from the register's band counts (turnover.json). */
      prov: { src: `uk/registers/turnover.json:the middle of ${sales.rows.length} London trades`, kind: "worked out" },
      rows: sales.rows.slice(0, 3).map((r) => ({ key: r.key, label: r.name, value: usd(r.value), icon: r.icon as AtlasIconId | undefined, prov: r.prov ?? null })),
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
      /* The curve's years before the last, as /gb's curve marks them ("Year 1"), the cohort's own points: its second reading. */
      rows: survival.points.filter((p) => p.year !== survival.last.year).map((p) => ({
        key: `year-${p.year}`,
        label: COPY.firstYears.year.replace("{n}", String(p.year)),
        value: `${Math.round(p.pct)}%`,
        prov: { src: `sections/survival.json:GB:the ${survival.cohort} cohort:year ${p.year}`, kind: "looked up" },
      })),
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
