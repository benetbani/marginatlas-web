/**
 * /dev/spine2-hard , the Wave 4 HARD-fleet catalog: RulerColumn (eight+readcol),
 * UnitGrid + Hundred (hundred+dots), HexLens, Quad, rendered with mockup-true
 * data inside the `.av2` scope so each block is directly comparable against
 * the frozen crops:
 *
 *   RulerColumn dot  -> design/crops/country-mock/02-02-the-eight-key-numbers.jpeg
 *   RulerColumn bar  -> design/crops/country-mock/04-...what-the-rules-are-like-here.jpeg
 *   HexLens          -> design/crops/country-mock/03-...what-this-country-is-like.jpeg
 *   Quad             -> design/crops/country-mock/14-...which-trades-are-under-served.jpeg
 *   Hundred          -> design/crops/cell-mock/03-...what-owners-actually-keep.jpeg
 *
 * Two derived-truth divergences from the frozen mockups, both contract-
 * mandated: (1) RulerColumn bar-mode sorts easiest-first from the data, so
 * the first three country-04 rows render 4/8/9 where the mockup drew 9/4/8
 * under a caption promising "easiest at the top"; (2) Quad accents THREE
 * points (childcare, dental, vehicle repair at 64,46) where the mockup
 * hand-set two , the ZONE derivation, COMPONENT-BUDGET D6 implemented.
 */
import * as React from "react";

import "@/styles/atlas-spine.css";
import { spineFontVariables } from "@/lib/fonts-spine";
import { GlyphIcon } from "@/components/spine2/GlyphIcon";
import { Statblock } from "@/components/spine2/Statblock";
import { SwatchLegend } from "@/components/spine2/SwatchLegend";
import {
  RulerColumn,
  EIGHT_EXTREME,
  type RulerReading,
  type RulerAccent,
} from "@/components/spine2/RulerColumn";
import { HexLens, type HexAxis } from "@/components/spine2/HexLens";
import { Quad, type QuadPoint } from "@/components/spine2/Quad";
import { Hundred } from "@/components/spine2/Hundred";
import { UnitGrid } from "@/components/spine2/UnitGrid";
import { usd } from "@/components/spine2/fmt";
import type { GlyphId } from "@/components/spine2/glyphs";

export const metadata = {
  title: "spine2 hard kit | dev",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------ */
/* country ch02 , the eight key numbers (dot mode)                     */
/* ------------------------------------------------------------------ */

/* Annotated as the narrow member, not the union: the caption below reads .hi,
   and a `RulerAccent` annotation would widen it out of reach. */
const COUNTRY_ACCENT = { rule: "extreme" as const, ...EIGHT_EXTREME };

const EIGHT_ROWS: RulerReading[] = [
  { glyph: "taxes", label: "What the state takes", sub: "of profit", value: "36%", pos: 68 },
  { glyph: "wages", label: "Average wage", sub: "a year", value: "$47K", pos: 60 },
  { glyph: "owner-keeps", label: "Net wealth per adult", value: "$180K", pos: 74 },
  { glyph: "register-cost", label: "Days to start", value: "1", pos: 6 },
  { glyph: "ease-of-business", label: "Ease of doing business", sub: "of 100", value: "83", pos: 80 },
  { glyph: "min-wage", label: "Minimum wage", sub: "full time", value: "$24K", pos: 72 },
  { glyph: "market-size", label: "Population", value: "68M", pos: 64 },
  { glyph: "currency-stability", label: "Cost of living", sub: "world = 100", value: "142", pos: 86 },
];

/* M7: the caption interpolates the SAME constant the dots derive from. */
const SHARE_WORD: Record<number, string> = { 10: "tenth", 20: "fifth", 25: "quarter" };
function eightCaption(): string {
  const share = 100 - COUNTRY_ACCENT.hi;
  return `a terracotta dot is the top or bottom ${SHARE_WORD[share] ?? `${share}%`} worldwide`;
}

/* ------------------------------------------------------------------ */
/* country ch04 , twelve readings (bar mode)                           */
/* ------------------------------------------------------------------ */

const HARD_ACCENT: RulerAccent = { rule: "atOrAbove", threshold: 55 };

const READCOL_ROWS: RulerReading[] = [
  { glyph: "payments", label: "Paying by card", pos: 9, value: "86% of sales" },
  { glyph: "operator-voices", label: "Trading in English", pos: 4, value: "no barrier" },
  { glyph: "register-cost", label: "Registering a company", pos: 8, value: "1 day" },
  { glyph: "contrarian", label: "Room for independents", pos: 22, value: "strong" },
  { glyph: "global-spread", label: "Foreign-owned businesses", pos: 16, value: "1 in 6" },
  { glyph: "red-tape", label: "Letting someone go", pos: 26, value: "2 years" },
  { glyph: "visa-permit", label: "A visa route for founders", pos: 34, value: "open" },
  { glyph: "methodology", label: "Filing once you trade", pos: 44, value: "4 a year" },
  { glyph: "raise-money", label: "Borrowing to expand", pos: 58, value: "9% a year" },
  { glyph: "bank", label: "Opening a business account", pos: 64, value: "3 to 6 weeks" },
  { glyph: "taxes", label: "What the state takes", pos: 72, value: "36% of profit" },
  { glyph: "commercial-rent", label: "Property rates", pos: 81, value: "$5.9K a year" },
];

const COUNT_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six",
  "seven", "eight", "nine", "ten", "eleven", "twelve",
];
function readcolCaption(accented: RulerReading[]): React.ReactNode {
  const n = COUNT_WORDS[accented.length] ?? String(accented.length);
  return (
    <>
      One scale, easiest at the top. The {n} in terracotta are the ones that
      will actually cost you time or money here.
    </>
  );
}

/* ------------------------------------------------------------------ */
/* country ch03 , the hexagon                                          */
/* ------------------------------------------------------------------ */

const HEX_AXES: HexAxis[] = [
  { key: "Getting in", value: 0.92, note: "a company in a day, $60" },
  { key: "People", value: 0.62, note: "deep pool, +15% on every wage" },
  { key: "Demand", value: 0.68, note: "$19K spent per head a year" },
  { key: "What you keep", value: 0.28, note: "about 7 cents in the dollar" },
  { key: "Cost to run", value: 0.24, note: "among the dearest rents in Europe" },
  { key: "Stability", value: 0.86, note: "courts work, currency holds" },
];

/* M7: pulled-wide / pinched names derive from the sorted axes. */
function hexSummary(sorted: Array<HexAxis & { value: number }>): React.ReactNode {
  const [top1, top2] = sorted;
  const [low1, low2] = [...sorted].reverse();
  return (
    <>
      The UK is pulled wide on <b>{top1.key.toLowerCase()}</b> and{" "}
      <b>{top2.key.toLowerCase()}</b>, and pinched on{" "}
      <b>{low1.key.toLowerCase()}</b> and <b>{low2.key.toLowerCase()}</b>. That
      is the country in one shape: easy to start, expensive to hold.
    </>
  );
}

/* ------------------------------------------------------------------ */
/* cell ch03 , the hundred (counts DERIVED from the page model)        */
/* ------------------------------------------------------------------ */
/* The distribution model is page-store state, never component state
   (BATCH-B). Here the static catalog plays the store's role at the hero's
   default target, using the mockup's exact constants, so the three counts
   are computed, not hand-counted (M5). */

const MODEL = { FIXED: 383462, CONTRIB: 0.69, N: 200, A: -35000, K: 256410, P: 1.717 };
const TARGET = 95000; // the hero slider's default

function indexAt(t: number): number {
  return Math.pow((t - MODEL.A) / MODEL.K, 1 / MODEL.P) * (MODEL.N - 1);
}
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const OVER = clamp(((MODEL.N - indexAt(TARGET)) / MODEL.N) * 100);
const NONE = clamp((indexAt(0) / MODEL.N) * 100);
const MID = Math.max(0, 100 - OVER - NONE);

/* ------------------------------------------------------------------ */
/* country ch14 , the opportunity scatter                              */
/* ------------------------------------------------------------------ */
/* NO hi flag anywhere: the accent derives from ZONE inside Quad. The
   mockup hand-set childcare + dental; the derivation also marks Vehicle
   repair at (64,46), which sits inside the drawn zone. */

const QUAD_POINTS: QuadPoint[] = [
  { id: "childcare", icon: "trade-childcare", label: "Childcare", supplyPct: 82, demandPct: 24 },
  { id: "dental", icon: "trade-dental", label: "Dental", supplyPct: 72, demandPct: 32 },
  { id: "restaurants", icon: "trade-restaurant", label: "Restaurants", supplyPct: 34, demandPct: 64 },
  { id: "cafes", icon: "trade-cafe", label: "Cafes", supplyPct: 28, demandPct: 72 },
  { id: "grocery", icon: "trade-grocery", label: "Grocery", supplyPct: 44, demandPct: 80 },
  { id: "vehicle-repair", icon: "trade-auto", label: "Vehicle repair", supplyPct: 64, demandPct: 46 },
  { id: "salons", icon: "trade-salon", label: "Salons", supplyPct: 40, demandPct: 58 },
  { id: "gyms", icon: "trade-gym", label: "Gyms", supplyPct: 52, demandPct: 54 },
];

/* ------------------------------------------------------------------ */

function ChapterHead({
  icon,
  num,
  title,
}: {
  icon: GlyphId;
  num: string;
  title: string;
}) {
  return (
    <div className="chhead">
      <div className="hd">
        <span className="itile">
          <GlyphIcon id={icon} size={24} />
        </span>
        <span className="chnum">{num}</span>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

export default function Spine2HardPage() {
  return (
    <div id="spine2-hard" className={`av2 ${spineFontVariables}`}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 32px 64px" }}>
        {/* ---- RulerColumn, dot mode (country ch02) ---- */}
        <section className="ch">
          <ChapterHead icon="scorecard" num="02" title="The eight key numbers" />
          <RulerColumn
            className="full"
            mark="dot"
            readings={EIGHT_ROWS}
            scale={{ left: "lowest", mid: "world median", right: "highest" }}
            accent={COUNTRY_ACCENT}
            caption={eightCaption}
            captionSecondary="against every country we hold"
          />
        </section>

        {/* ---- dot mode, the null-percentile contract (not a crop target) ---- */}
        <section className="ch" style={{ marginTop: 40 }}>
          <div className="lab" style={{ marginBottom: 12 }}>
            Self-omit contract: a null percentile keeps its figure, rail empty
          </div>
          <RulerColumn
            mark="dot"
            readings={[
              { glyph: "taxes", label: "What the state takes", sub: "of profit", value: "36%", pos: 68 },
              { glyph: "wages", label: "Average wage", sub: "no world reading yet", value: "$47K", pos: null },
              { glyph: "register-cost", label: "Days to start", value: "1", pos: 6 },
            ]}
            scale={{ left: "lowest", mid: "world median", right: "highest" }}
            accent={COUNTRY_ACCENT}
          />
        </section>

        {/* ---- RulerColumn, bar mode (country ch04) ---- */}
        <section className="ch" style={{ marginTop: 40 }}>
          <ChapterHead icon="spread" num="04" title="What the rules are like here" />
          <RulerColumn
            className="full"
            mark="bar"
            sort="asc"
            readings={READCOL_ROWS}
            scale={{ left: "easy for an owner", right: "hard" }}
            valueLabel="where it lands"
            accent={HARD_ACCENT}
            caption={readcolCaption}
          />
        </section>

        {/* ---- HexLens (country ch03) ---- */}
        <section className="ch" style={{ marginTop: 40 }}>
          <ChapterHead icon="district-mix" num="03" title="What this country is like" />
          <div className="panel pad-lg">
            <HexLens
              axes={HEX_AXES}
              orientationNote={
                <>
                  Six qualities, one rule:{" "}
                  <b>further from the centre is better for an owner.</b> A wide
                  shape is an easy country to run a business in; a pinched one
                  is not.
                </>
              }
              summary={hexSummary}
            />
          </div>
        </section>

        {/* ---- Hundred (cell ch03) ---- */}
        <section className="ch" style={{ marginTop: 40 }}>
          <ChapterHead icon="owner-keeps" num="03" title="What owners actually keep" />
          <div className="grid g12">
            <div className="panel pad-lg">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 16,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                <span className="lab">Of every 100 restaurants in London</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: "11.5px",
                    fontWeight: 600,
                    color: "var(--terra-deep)",
                    whiteSpace: "nowrap",
                  }}
                >
                  paying yourself <span>{usd(TARGET)}</span>
                </span>
              </div>
              <Hundred
                groups={[
                  { kind: "over", count: OVER, label: `pay their owner ${usd(TARGET)} or more` },
                  { kind: "mid", count: MID, label: "pay something, but less than that" },
                  { kind: "none", count: NONE, label: "pay their owner nothing at all" },
                ]}
                caption="Each square is one restaurant. Move the slider in the hero and the three groups move with it."
              />
            </div>
            <div
              className="panel pad"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className="note">
                Every mark is one restaurant. Almost everything below the line
                is a real business, trading, employing people, and not paying
                its owner a living.
              </p>
              <Statblock
                style={{ marginTop: 16 }}
                header={{ label: "What separates top from bottom", icon: "spread" }}
                rail={false}
                rows={[
                  { label: "Rent, top quarter", sub: "of revenue", value: "9", unit: "%" },
                  { label: "Rent, bottom quarter", sub: "same measure", value: "18", unit: "%" },
                  { label: "The difference, on $620K", value: "$56", unit: "K", answer: true },
                ]}
              />
              <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
                The biggest thing dividing the chart is{" "}
                <b>what they signed for the room</b>, not what they cooked in
                it.
              </p>
            </div>
          </div>
        </section>

        {/* ---- UnitGrid, inline variant (country ch09's workforce) ---- */}
        <section className="ch" style={{ marginTop: 40 }}>
          <ChapterHead icon="hiring" num="09" title="Can you find and keep staff" />
          <div className="grid g12">
            <div className="panel pad">
              <div className="lab" style={{ marginBottom: 16 }}>
                The workforce, in a hundred people
              </div>
              <UnitGrid
                layout="inline"
                groups={[
                  {
                    count: 38,
                    tone: "ink",
                    label: { big: "38 in 100", small: "degree or skilled trade" },
                  },
                ]}
              />
              <SwatchLegend
                style={{ marginTop: 16 }}
                items={[
                  { tone: "ink", label: "Degree or skilled trade ", figure: "38" },
                ]}
              />
            </div>
            <div className="panel pad">
              <Statblock
                header={{ label: "The hiring reality", icon: "hiring" }}
                rail={false}
                rows={[
                  { label: "To fill a skilled role", value: "5 wk", answer: true },
                  { label: "Staff churn, hospitality", value: "32", unit: "%" },
                  { label: "Chefs, a known shortage", value: "short" },
                  { label: "Notice period, typical", value: "1", unit: "mo" },
                  { label: "Speak a second language", value: "16", unit: "%" },
                ]}
              />
            </div>
          </div>
        </section>

        {/* ---- Quad (country ch14) ---- */}
        <section className="ch" style={{ marginTop: 40 }}>
          <ChapterHead icon="where-it-pays" num="14" title="Which trades are under-served" />
          <div className="grid g12">
            <div className="panel pad">
              <Quad
                points={QUAD_POINTS}
                axisPoles={{
                  tl: "thin on the ground",
                  tr: "thin, and money around",
                  bl: "crowded",
                  br: "crowded, money around",
                }}
              />
            </div>
            <div
              className="panel pad"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p className="note">
                The terracotta corner is the opportunity: trades that are{" "}
                <b>thin on the ground where the money is</b>. A gap between how
                many operate and how much the market could carry.
              </p>
              <Statblock
                style={{ marginTop: 16 }}
                header={{ label: "Thinnest against the money", icon: "where-it-pays" }}
                rows={[
                  { icon: "trade-childcare", label: "Childcare", value: "short", answer: true },
                  { icon: "trade-dental", label: "Dental", value: "short" },
                  { icon: "trade-auto", label: "Vehicle repair", value: "tight" },
                ]}
              />
              <p className="note" style={{ marginTop: "auto", paddingTop: 16 }}>
                Thin does not mean easy. It means the demand is unmet, and the
                reason it is unmet is usually the licence or the skill, not the
                money.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
