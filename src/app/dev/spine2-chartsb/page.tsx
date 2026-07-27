/**
 * /dev/spine2-chartsb , catalog of the Wave 4 CHARTS-B components:
 * MonthDeviation (year + touryear merge), AxisDots (strip + mini merge),
 * RankBarsV2 (the ranked spec, new in spine2), SparkTrend (trendrow).
 *
 * Same .av2 pattern as /dev/spine2. Mockup-true data throughout: cell ch10's
 * twelve indices, cell ch13's four cities, cell ch07's three thresholds, cell
 * ch09's opening costs (with the data layer's corrected $231K total), city
 * ch04's visitor months, city ch11's four directions. Directly comparable
 * against design/crops/cell-mock 10 / 13 / 07 / 09.
 *
 * Every caption below interpolates from the same constants the marks read
 * (PORT-CONTRACT M7): the seasonality notes derive from
 * monthDeviationSummary(), the ranked note derives the assumed fit-out from
 * total minus the fixed rows, the strip lab derives its subject sentence.
 */
import * as React from "react";

import "@/styles/atlas-spine.css";
import { spineFontVariables } from "@/lib/fonts-spine";
import { MonthDeviation, monthDeviationSummary } from "@/components/spine2/MonthDeviation";
import { AxisDots } from "@/components/spine2/AxisDots";
import { RankBarsV2, type RankRowV2 } from "@/components/spine2/RankBarsV2";
import { SparkTrend } from "@/components/spine2/SparkTrend";
import { usd } from "@/components/spine2/fmt";

export const metadata = {
  title: "spine2 charts-b kit | dev",
  robots: { index: false, follow: false },
};

/* ---- cell ch10, revenue through the year (indexed, avg = 100) ---- */
const CELL_MONTHS = [80, 78, 92, 98, 100, 104, 102, 96, 106, 110, 116, 132];

/* ---- city ch04, visitors by month (indexed, avg = 100) ---- */
const CITY_VISITOR_MONTHS = [64, 66, 77, 91, 106, 124, 143, 147, 114, 91, 77, 99];

/* ---- cell ch13, what an owner keeps, city by city ($K) ---- */
const STRIP_SUBJECT = "London";
const STRIP_DOMAIN: [number, number] = [37, 45];
const STRIP_STOPS = [
  { value: 39, display: "$39K", label: "Birmingham" },
  { value: 40, display: "$40K", label: "Edinburgh" },
  { value: 41, display: "$41K", label: "Manchester" },
  { value: 43, display: "$43K", label: STRIP_SUBJECT, role: "subject" as const },
];

/* ---- cell ch07, the floor every day you open ---- */
const MINI_DOMAIN: [number, number] = [1225, 2215];
const MINI_STOPS = [
  { value: 1225, display: "$1,225", label: "committed cost" },
  { value: 1776, display: "$1,776", label: "breaks even" },
  { value: 2215, display: "$2,215", label: "pays you $95K", role: "subject" as const },
];

/* ---- cell ch09, what it costs to open. The data layer corrected the total
   from the mockup's $212K to $231K; figures below are the corrected ones,
   form unchanged. The assumed fit-out point DERIVES from the same object the
   total reads (M7), never hand-written. ---- */
const OPEN_ROWS: RankRowV2[] = [
  { id: "fitout", label: "Fit-out & kitchen", range: [90000, 340000], display: "90 to 340K" },
  { id: "deposit", label: "Deposit & first rent", value: 16000, display: "$16K" },
  { id: "stock", label: "Opening stock", value: 12000, display: "$12K" },
  { id: "reg", label: "Registration & insurance", value: 2400, display: "$2.4K" },
  { id: "licence", label: "Licence", value: 1200, display: "$1.2K" },
];
const OPEN_TOTAL = { label: "To open the doors", value: 231000, display: "$231K" };
const FITOUT_ASSUMED =
  OPEN_TOTAL.value -
  OPEN_ROWS.filter((r) => r.value != null).reduce((s, r) => s + (r.value as number), 0);

/* ---- city ch11, which way the district is moving. Deltas DERIVE from the
   series. Accent per D7 polarity: rising rent moves against the owner, so
   Rent carries the terracotta (the mockup accented falling vacancies, good
   news in the alarm colour, which D7 overrules). ---- */
const TRENDS = [
  { label: "Rent", icon: "commercial-rent" as const, values: [100, 104, 110, 116, 118], caption: "over ten years", againstOwner: true },
  { label: "Footfall", icon: "footfall" as const, values: [100, 96, 104, 102, 106], caption: "recovering" },
  { label: "Empty units", icon: "vacancy" as const, values: [100, 95, 89, 82, 78], caption: "fewer vacancies" },
  { label: "Population", icon: "market-size" as const, values: [100, 103, 105, 107, 109], caption: "still growing" },
];

function Lab({ children }: { children: React.ReactNode }) {
  return (
    <div className="lab" style={{ margin: "34px 0 12px" }}>
      {children}
    </div>
  );
}

export default function Spine2ChartsBPage() {
  const cell = monthDeviationSummary(CELL_MONTHS);
  const city = monthDeviationSummary(CITY_VISITOR_MONTHS);
  return (
    <div id="spine2-chartsb" className={`av2 ${spineFontVariables}`}>
      <div style={{ maxWidth: 1060, margin: "0 auto", padding: "36px 32px 48px" }}>
        {/* ---- MonthDeviation, deviation mode , cell ch10 ---- */}
        <Lab>MonthDeviation, deviation , cell ch10</Lab>
        <div className="panel pad">
          <MonthDeviation
            months={CELL_MONTHS}
            header={{ title: "Revenue, month by month", sub: "indexed to the year average" }}
          />
          {cell ? (
            <p className="note" style={{ marginTop: 16 }}>
              <span className="lowconf" style={{ marginRight: 10 }}>
                Pattern, not a forecast
              </span>
              {cell.peak.name} runs {cell.peak.pctAbove}% above the year and {cell.trough.name}{" "}
              {cell.trough.pctBelow}% below.{" "}
              <b>The lull lands in January, when the rent has not moved.</b>
            </p>
          ) : null}
        </div>

        {/* ---- MonthDeviation, level mode , city ch04 (the touryear merge;
            level bars start at 0, never the mockup's 40-floor) ---- */}
        <Lab>MonthDeviation, level , city ch04</Lab>
        <div className="grid g2">
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 16 }}>
              Visitors by month{" "}
              <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--muted)", fontWeight: 400 }}>
                index, 100 = the year average
              </span>
            </div>
            <MonthDeviation months={CITY_VISITOR_MONTHS} mode="level" />
            {city ? (
              <p className="note" style={{ marginTop: 16 }}>
                {city.peak.name} runs <b>{city.peak.pctAbove}% above</b> the year and{" "}
                {city.trough.name} <b>{city.trough.pctBelow}% below</b>. A room that leans on
                visitors carries a thin, cold winter.
              </p>
            ) : null}
          </div>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 16 }}>
              Deviation form of the same series
            </div>
            <MonthDeviation months={CITY_VISITOR_MONTHS} />
          </div>
        </div>

        {/* ---- AxisDots, line track , cell ch13 ---- */}
        <Lab>AxisDots, line track , cell ch13</Lab>
        <div className="panel pad">
          <div className="lab" style={{ marginBottom: 6 }}>
            What an owner keeps, city by city{" "}
            <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--muted)", fontWeight: 400 }}>
              {STRIP_SUBJECT} is the marker on the right
            </span>
          </div>
          <AxisDots stops={STRIP_STOPS} domain={STRIP_DOMAIN} />
        </div>

        {/* ---- AxisDots, gradient track , cell ch07 ---- */}
        <Lab>AxisDots, gradient track , cell ch07</Lab>
        <div className="grid g2" style={{ alignItems: "start" }}>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 16 }}>
              The floor, every day you open
            </div>
            <AxisDots stops={MINI_STOPS} domain={MINI_DOMAIN} track="gradient" />
            <p className="note" style={{ marginTop: 26 }}>
              Before a plate is sold the day has already cost you <b>$1,225</b> in staff, rent
              and bills. You break even at <b>$1,776</b> of takings, because food eats 31 cents
              of every dollar on the way in. The third mark is your own target.
            </p>
          </div>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 16 }}>
              Same track with the honest-range band
            </div>
            <AxisDots
              stops={MINI_STOPS}
              domain={MINI_DOMAIN}
              track="gradient"
              range={[1610, 1950]}
            />
            <p className="note" style={{ marginTop: 26 }}>
              The band is the honest range around break-even; it drops when the range is
              missing.
            </p>
          </div>
        </div>

        {/* ---- RankBarsV2 , cell ch09, corrected figures ---- */}
        <Lab>RankBarsV2 , cell ch09</Lab>
        <div className="grid g12" style={{ alignItems: "start" }}>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 16 }}>
              Everything it takes to open the doors
            </div>
            <RankBarsV2 rows={OPEN_ROWS} total={OPEN_TOTAL} />
            <p className="note" style={{ marginTop: 18 }}>
              Fit-out dwarfs everything else and it is the one number nobody can tell you. The{" "}
              {OPEN_TOTAL.display} total takes it at <b>{usd(FITOUT_ASSUMED)}</b>, near the
              middle of the range. A light refresh of a room that already traded as a
              restaurant sits at the bottom of that range. A strip-out to bare brick sits at
              the top.
            </p>
          </div>
          <div className="panel pad">
            <div className="lab" style={{ marginBottom: 16 }}>
              Without the range row&apos;s partner, the total self-omits
            </div>
            <RankBarsV2
              rows={[
                ...OPEN_ROWS.slice(1),
                { id: "broken", label: "A row with no figure", value: null, display: "" },
              ]}
              total={OPEN_TOTAL}
            />
            <p className="note" style={{ marginTop: 18 }}>
              One row lost its figure, so the total footer degrades away: a total over a
              partial list is a lie.
            </p>
          </div>
        </div>

        {/* ---- SparkTrend , city ch11 ---- */}
        <Lab>SparkTrend , city ch11</Lab>
        <SparkTrend items={TRENDS} />
      </div>
    </div>
  );
}
