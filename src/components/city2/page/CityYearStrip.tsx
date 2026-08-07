/**
 * CityYearStrip , twelve bars, one year, on the city page.
 *
 * RATIFIED 2026-08-08. The founder saw this shape drawn at day scale, said it
 * was very good, and moved it: it belongs on the CITY pages, over twelve
 * months, showing how the number of customers varies through the year. That is
 * a city-level fact and not a trade-level one.
 *
 * WHAT IT REPLACED. Chapter 04 held the twelve-month index all along and
 * rendered it as a four-row label-value list plus two paragraphs, one of which
 * said "busiest in August, at 118 against a year of 100." The page could
 * describe the year and had no way to show it.
 *
 * WHY DEVIATION AND NOT LEVEL. The series is an index where 100 is the year
 * average, so the question a reader holds is "which months are above the line".
 * Drawn from zero, twelve bars between 82 and 118 are twelve near-identical
 * bars. Drawn from the average, the season is the shape.
 *
 * WIDTH IS 60% OF THE COLUMN, per the same ruling. A bar chart stretched to a
 * full column does not get more readable: the eye travels further to pair a
 * label with its bar, and the tallest bar stops meaning "tall" because
 * everything is long.
 */
import * as React from "react";

export interface CityYearStripProps {
  months: Array<{ month: string; index: number }>;
  peak: { month: string; index: number } | null;
  trough: { month: string; index: number } | null;
}

/** First letter of the month name, which is all a twelve-bar axis has room for. */
function initial(month: string): string {
  return month.trim().charAt(0).toUpperCase();
}

export function CityYearStrip({ months, peak, trough }: CityYearStripProps) {
  /* Self-omit rather than render an empty frame. A city with no measured
     seasonality gets the chapter's stated gap from the page above, which is the
     honest thing: a page is always complete, and an empty chart is not a
     figure, it is a promise of one. */
  if (!months || months.length < 3) return null;

  const dev = months.map((m) => m.index - 100);
  const span = Math.max(...dev.map(Math.abs)) || 1;

  /* THE AXIS SITS BELOW EVERY BAR, not on the baseline.
     Placed just under the midline it collided with the downward bars, so Jan,
     Feb and Mar rendered their letters INSIDE the grey. DESIGN.md is explicit:
     where two things can collide the label yields, never the data. So the
     letters clear the deepest possible bar and the baseline carries nothing. */
  const W = 430, MID = 92, REACH = 66;
  const AXIS_Y = MID + REACH + 16;
  const H = AXIS_Y + 26;
  const bw = 22;
  const gap = months.length > 1 ? (W - months.length * bw) / (months.length - 1) : 0;
  const unit = REACH / span;

  const hiIdx = dev.indexOf(Math.max(...dev));
  const loIdx = dev.indexOf(Math.min(...dev));

  return (
    <div style={{ maxWidth: "60%" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        role="img"
        aria-label={
          peak && trough
            ? `Busiest in ${peak.month} at ${peak.index} against a year of 100, quietest in ${trough.month} at ${trough.index}.`
            : "Visitor numbers by month against the year average."
        }
      >
        <line x1="0" y1={MID} x2={W} y2={MID} stroke="var(--n4)" strokeWidth="1" />
        {dev.map((d, i) => {
          const h = Math.abs(d) * unit;
          const x = i * (bw + gap);
          const y = d >= 0 ? MID - h : MID;
          /* Terracotta marks the answer ONCE, and the answer here is the peak.
             The trough is the second thing a reader looks for, so it is the
             darkest neutral rather than a second accent. */
          const fill = i === hiIdx ? "var(--terra)" : i === loIdx ? "var(--n2)" : d >= 0 ? "var(--n3)" : "var(--n4)";
          return (
            <g key={i}>
              <rect x={x} y={y} width={bw} height={Math.max(h, 1.5)} rx="4" fill={fill} />
              <title>{`${months[i].month}, ${months[i].index} against a year of 100`}</title>
            </g>
          );
        })}
        {months.map((m, i) => (
          <text
            key={i}
            x={i * (bw + gap) + bw / 2}
            y={AXIS_Y}
            fontSize="10.5"
            textAnchor="middle"
            fill={i === hiIdx || i === loIdx ? "var(--ink)" : "var(--faint)"}
            fontWeight={i === hiIdx || i === loIdx ? 600 : 400}
          >
            {initial(m.month)}
          </text>
        ))}
        {peak ? (
          <text
            x={hiIdx * (bw + gap) + bw / 2}
            y={MID - Math.abs(dev[hiIdx]) * unit - 8}
            fontSize="14"
            fontWeight="600"
            fill="var(--terra)"
            textAnchor="middle"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {peak.index}
          </text>
        ) : null}
        <text x="0" y={H - 5} fontSize="11" fill="var(--muted)">
          against the average month, where the year is 100
        </text>
      </svg>
      {peak && trough ? (
        <p className="k" style={{ margin: "12px 0 0", maxWidth: "54ch" }}>
          Busiest in {peak.month}, quietest in {trough.month}.
        </p>
      ) : null}
    </div>
  );
}
