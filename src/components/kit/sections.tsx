/**
 * Data sections - the kit's structured-data beats (content-map).
 *
 * Each is a small, self-omitting data section seated in the ONE card grammar
 * (BeatCard), so a page reads as a single hand. Every input is nullable; a
 * section with nothing to show returns null rather than a frame of dashes.
 *
 * PlainTerms      tangible units behind the abstract numbers
 * BreakEvenLine   when the business starts covering its costs
 * WagesByRole     pay by role, in the range-strip language (rail + median tick)
 * Seasonality     the busy / slow shape across the year
 * RealisticFirstYear  an honest first-year expectation
 * SameBusinessNearby  the same business in comparable nearby places (like-for-like)
 *
 * Tokens only, no raw color, no em-dashes, no source-agency names.
 */
import * as React from "react";
import { BeatCard } from "./editorial";
import { LikeForLikeBars, ThresholdGauge, TimelineRibbon } from "./charts";
import type { TimelineMilestone } from "./charts";

function hasText(s: string | null | undefined): s is string {
  return typeof s === "string" && s.trim().length > 0;
}
function isNum(v: number | null | undefined): v is number {
  return v != null && Number.isFinite(v);
}

/* ------------------------------------------------------------------ */
/* PlainTerms - the abstract number made tangible.                     */
/* ------------------------------------------------------------------ */

export type PlainTermItem = { label: string; value?: string | null; hint?: string };

/* The plain-terms glyph: a small, label-driven icon so each tangible unit reads
   as its own object (a day's count, a spend, a team), not a row in a table. The
   icon is decorative (aria-hidden); the label and value carry the meaning. Tokens
   only, currentColor, no raw color. */
function PlainTermIcon({ label }: { label: string }) {
  const l = (label ?? "").toLowerCase();
  let path: React.ReactNode;
  if (/(spend|each|average|price|ticket|bill|revenue|takings)/.test(l)) {
    // a coin / value
    path = (
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v6M6.2 6.6c0-.9.8-1.4 1.8-1.4s1.8.4 1.8 1.3c0 1.6-3.4 1-3.4 2.6 0 .9.8 1.3 1.8 1.3s1.8-.5 1.8-1.4" />
      </>
    );
  } else if (/(people|payroll|staff|team|employ|hire|head)/.test(l)) {
    // a small crowd
    path = (
      <>
        <circle cx="6" cy="6" r="2.2" />
        <path d="M2.5 13c0-2.2 1.6-3.6 3.5-3.6S9.5 10.8 9.5 13" />
        <path d="M10.5 4.2c1.2 0 2.2 1 2.2 2.2 0 .9-.5 1.6-1.2 2M11 9.6c1.7.1 3 1.5 3 3.4" />
      </>
    );
  } else if (/(day|week|month|covers|orders|sales|customers|visits|seats|tables)/.test(l)) {
    // a recurring cycle
    path = (
      <>
        <path d="M13 8a5 5 0 1 1-1.6-3.7" />
        <path d="M13 2.6V5h-2.4" />
      </>
    );
  } else {
    // a neutral tag
    path = (
      <>
        <path d="M2.6 8.4 8 3h4.4v4.4L7 12.8a1 1 0 0 1-1.4 0L2.6 9.8a1 1 0 0 1 0-1.4Z" />
        <circle cx="9.7" cy="6.3" r="0.9" />
      </>
    );
  }
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path}
    </svg>
  );
}

export function PlainTerms({
  items,
  eyebrow = "In plain terms",
  heading = "What the numbers feel like",
  id,
}: {
  items: PlainTermItem[];
  eyebrow?: string;
  heading?: string;
  id?: string;
}) {
  const rows = (items ?? []).filter((it) => hasText(it.value));
  if (rows.length === 0) return null;
  // Reform (R7): the tangible units read as icon-led tiles, one object per card,
  // so the section has its own character and skims in a glance instead of as a
  // flat definition list. The icon is keyed off the label (a day's count, a
  // spend, a team) and stays decorative; value + label carry the meaning.
  return (
    <BeatCard eyebrow={eyebrow} heading={heading} spot="calculator" id={id}>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((it, i) => (
          <div
            key={i}
            className="rounded-lg border border-parchment bg-cream-50/70 px-4 py-3.5"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-atlas-50 text-atlas-700">
              <PlainTermIcon label={it.label} />
            </span>
            <dd className="mt-2.5 font-display text-2xl font-semibold tabular-nums tracking-tight text-ink-900">
              {it.value}
            </dd>
            <dt className="mt-0.5 text-sm font-medium text-cocoa-700">{it.label}</dt>
            {hasText(it.hint) ? (
              <p className="mt-0.5 text-[11px] leading-relaxed text-cocoa-700">{it.hint}</p>
            ) : null}
          </div>
        ))}
      </dl>
    </BeatCard>
  );
}

/* ------------------------------------------------------------------ */
/* BreakEvenLine - when costs are covered.                             */
/* ------------------------------------------------------------------ */

export function BreakEvenLine({
  headline,
  detail,
  note,
  value,
  typical,
  unit,
  eyebrow = "Break-even",
  id,
}: {
  /** The lead statement, e.g. "You cover your costs at about 95 covers a day". */
  headline?: string | null;
  /** A supporting clause. */
  detail?: string | null;
  note?: string | null;
  /** The break-even count, for the gauge tick (e.g. 95). */
  value?: number | null;
  /** A typical day's count, to seat the "covering costs" zone (e.g. 130). */
  typical?: number | null;
  /** The unit said in words, e.g. "covers a day". */
  unit?: string | null;
  eyebrow?: string;
  id?: string;
}) {
  if (!hasText(headline) && !hasText(detail) && !isNum(value)) return null;
  // Reform (R7): the break-even reads as a position on a scale, not a sentence.
  // The gauge marks the threshold; a typical day (when known) sits in the
  // "covering costs" zone with headroom, so the gap above the line lands at a
  // glance. The prose drops to a quiet caption beneath it.
  const showGauge = isNum(value);
  // Seat the scale so the typical day reads clearly above the line with room to
  // spare; otherwise the gauge's own default ceiling (value * 1.8) applies.
  const max =
    isNum(typical) && typical > value!
      ? Math.max(typical * 1.2, value! * 1.6)
      : undefined;
  const markerLabel = `${Math.round(value!)}${hasText(unit) ? ` ${unit}` : ""}`;
  return (
    <BeatCard eyebrow={eyebrow} id={id}>
      {showGauge ? (
        <>
          {hasText(headline) ? (
            <p className="mb-4 font-display text-lg font-medium leading-snug text-balance text-ink-900 md:text-xl">
              {headline}
            </p>
          ) : null}
          <ThresholdGauge
            value={value}
            max={max}
            markerLabel={markerLabel}
            belowLabel="Losing money"
            aboveLabel="Covering costs"
            caption={hasText(detail) ? detail : null}
          />
          {hasText(note) ? (
            <p className="mt-3 text-[11px] text-cocoa-700">{note}</p>
          ) : null}
        </>
      ) : (
        <>
          {hasText(headline) ? (
            <p className="font-display text-lg font-medium leading-snug text-balance text-ink-900 md:text-xl">
              {headline}
            </p>
          ) : null}
          {hasText(detail) ? (
            <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-graphite md:text-base">
              {detail}
            </p>
          ) : null}
          {hasText(note) ? (
            <p className="mt-3 text-[11px] text-cocoa-700">{note}</p>
          ) : null}
        </>
      )}
    </BeatCard>
  );
}

/* ------------------------------------------------------------------ */
/* WagesByRole - pay by role, in the range-strip language.             */
/* ------------------------------------------------------------------ */

export type WageRole = {
  role: string;
  low?: number | null;
  median?: number | null;
  high?: number | null;
};

export function WagesByRole({
  roles,
  format,
  eyebrow = "Pay by role",
  heading = "What you would pay your team",
  note,
  id,
}: {
  roles: WageRole[];
  format: (n: number) => string;
  eyebrow?: string;
  heading?: string;
  note?: string | null;
  id?: string;
}) {
  const rows = (roles ?? []).filter(
    (r) => hasText(r.role) && (isNum(r.low) || isNum(r.median) || isNum(r.high)),
  );
  if (rows.length === 0) return null;

  // A shared scale across all roles so the rails are comparable: the lowest low
  // to the highest high present.
  const lows = rows.map((r) => r.low).filter(isNum) as number[];
  const highs = rows.map((r) => r.high).filter(isNum) as number[];
  const meds = rows.map((r) => r.median).filter(isNum) as number[];
  const lo = Math.min(...[...lows, ...meds]);
  const hi = Math.max(...[...highs, ...meds]);
  const span = hi > lo ? hi - lo : 1;
  const pct = (v: number) => `${((v - lo) / span) * 100}%`;

  return (
    <BeatCard eyebrow={eyebrow} heading={heading} id={id}>
      <ul className="space-y-3.5">
        {rows.map((r, i) => {
          const left = isNum(r.low) ? r.low : isNum(r.median) ? r.median : null;
          const right = isNum(r.high) ? r.high : isNum(r.median) ? r.median : null;
          const showRail = isNum(left) && isNum(right) && right > left;
          const label = isNum(r.median)
            ? format(r.median)
            : isNum(r.low) && isNum(r.high)
              ? `${format(r.low)} to ${format(r.high)}`
              : isNum(r.low)
                ? format(r.low)
                : isNum(r.high)
                  ? format(r.high)
                  : "";
          return (
            <li key={i}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-ink-900">{r.role}</span>
                <span className="font-display text-sm font-semibold tabular-nums text-ink-900">
                  {label}
                </span>
              </div>
              {showRail ? (
                <div className="relative mt-1.5 h-2 w-full rounded-full bg-cream-300">
                  <div
                    className="absolute top-0 h-2 rounded-full bg-cocoa-300"
                    style={{ left: pct(left!), right: `calc(100% - ${pct(right!)})` }}
                  />
                  {isNum(r.median) ? (
                    <div
                      className="absolute top-[-2px] h-3 w-[2.5px] rounded-full bg-atlas-500"
                      style={{ left: pct(r.median) }}
                    />
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      {hasText(note) ? (
        <p className="mt-3.5 text-[11px] text-cocoa-700">{note}</p>
      ) : null}
    </BeatCard>
  );
}

/* ------------------------------------------------------------------ */
/* Seasonality - the busy / slow shape across the year.                */
/* ------------------------------------------------------------------ */

const MONTH_LETTERS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export function Seasonality({
  monthly,
  note,
  eyebrow = "Through the year",
  heading = "Busy months and slow months",
  id,
}: {
  /** 12 relative demand weights (any positive scale). */
  monthly?: Array<number | null> | null;
  note?: string | null;
  eyebrow?: string;
  heading?: string;
  id?: string;
}) {
  const vals = (monthly ?? []).map((v) => (isNum(v) ? v : 0));
  const hasShape = vals.length === 12 && vals.some((v) => v > 0);
  if (!hasShape && !hasText(note)) return null;
  const max = hasShape ? Math.max(...vals) : 1;
  const peakIdx = hasShape ? vals.indexOf(max) : -1;

  return (
    <BeatCard eyebrow={eyebrow} heading={heading} id={id}>
      {hasShape ? (
        <div
          className="flex items-end gap-1.5"
          role="img"
          aria-label="Relative demand by month, busiest month marked."
        >
          {vals.map((v, i) => {
            const h = Math.max(6, Math.round((v / max) * 56));
            const peak = i === peakIdx;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={["w-full rounded-sm", peak ? "bg-atlas-500" : "bg-cocoa-300"].join(" ")}
                  style={{ height: `${h}px` }}
                />
                <span
                  className={[
                    "text-[10px] tabular-nums",
                    peak ? "font-semibold text-atlas-700" : "text-cocoa-500",
                  ].join(" ")}
                >
                  {MONTH_LETTERS[i]}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
      {hasText(note) ? (
        <p className={["max-w-2xl text-sm leading-relaxed text-graphite md:text-base", hasShape ? "mt-4" : ""].join(" ")}>
          {note}
        </p>
      ) : null}
    </BeatCard>
  );
}

/* ------------------------------------------------------------------ */
/* RealisticFirstYear - an honest first-year expectation.              */
/* ------------------------------------------------------------------ */

export function RealisticFirstYear({
  headline,
  bullets,
  milestones,
  eyebrow = "Your first year",
  id,
}: {
  headline?: string | null;
  bullets: Array<string | null | undefined>;
  /** The year as a journey, for the ribbon. Falls back to bullets when absent. */
  milestones?: TimelineMilestone[] | null;
  eyebrow?: string;
  id?: string;
}) {
  const items = (bullets ?? []).filter(hasText) as string[];
  const stops = (milestones ?? []).filter((m) => hasText(m?.label));
  // Reform (R7): the first year reads as a journey (ramp -> break-even -> steady)
  // on the TimelineRibbon, the break-even node the lone accent. Needs at least
  // two real stops; below that it falls back to the honest bullet read.
  const showRibbon = stops.length >= 2;
  if (!hasText(headline) && items.length === 0 && !showRibbon) return null;
  return (
    <BeatCard eyebrow={eyebrow} spot="first-year" id={id}>
      {hasText(headline) ? (
        <p className="font-display text-lg font-medium leading-snug text-balance text-ink-900 md:text-xl">
          {headline}
        </p>
      ) : null}
      {showRibbon ? (
        <div className={hasText(headline) ? "mt-5" : ""}>
          <TimelineRibbon
            milestones={stops}
            caption="A modeled path, not a promise. Most owners reach break-even later than they hope."
          />
        </div>
      ) : items.length > 0 ? (
        <ul className={["space-y-2.5", hasText(headline) ? "mt-3" : ""].join(" ")}>
          {items.map((b, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-cocoa-700 md:text-base">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cocoa-500" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </BeatCard>
  );
}

/* ------------------------------------------------------------------ */
/* SameBusinessNearby - the same trade in comparable nearby places.    */
/* ------------------------------------------------------------------ */

export type NearbyRow = {
  name: string;
  href?: string | null;
  value?: number | null;
  sub?: string | null;
};

export function SameBusinessNearby({
  rows,
  format,
  eyebrow = "The same business nearby",
  heading = "How it reads in comparable places",
  valueLabel,
  note,
  id,
}: {
  rows: NearbyRow[];
  format?: (n: number) => string;
  eyebrow?: string;
  heading?: string;
  valueLabel?: string;
  note?: string | null;
  id?: string;
}) {
  // Reform (R7): the same trade across comparable places reads as ranked bars,
  // so the spread and the leader land in one glance instead of as a list of
  // numbers. Needs a formatter and at least two real values to compare; below
  // that the page keeps the section present with its honest empty state.
  const items = (rows ?? [])
    .filter((r) => hasText(r.name))
    .map((r) => ({
      label: r.name,
      value: isNum(r.value) ? r.value : null,
      href: r.href ?? null,
    }));
  if (!format || items.filter((it) => isNum(it.value)).length < 2) return null;
  const caption = [valueLabel, note].filter(hasText).join(" ") || undefined;
  return (
    <BeatCard eyebrow={eyebrow} heading={heading} id={id}>
      <LikeForLikeBars items={items} format={format} caption={caption} />
    </BeatCard>
  );
}
