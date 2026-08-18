/**
 * kit/engraved/Setup.tsx — the setup-and-rules engraved sections.
 *
 * Three assets a country page leans on before anyone trades: the cost-and-rules
 * stepper (the register-a-business route), the hiring read (wage floor against
 * typical pay, time-to-hire, the employer on-cost), and the licence checklist.
 * Ported faithfully from the design export 2026-06-14-country-engraved
 * (engraved/setup.jsx).
 *
 * Each composes from the Wave-1 foundation primitives (RouteLine, StampSeal,
 * the SampleState) and reads color only through the engraved CSS vars. Props are
 * nullable: a missing or empty input renders the honest SampleState rather than
 * a fabricated number. Server-renderable; none holds state. SVG geometry numbers
 * are inline. No em-dashes, no source-agency names.
 */
import * as React from "react";
import { StampSeal, SampleState } from "./primitives";

/* ------------------------------------------------------------------ */
/* SetupStepper — the register-a-business route as a surveyor traverse. */
/* ------------------------------------------------------------------ */

/** One station on the formation route: a step with its days and any fee. */
export type SetupStep = {
  /** The step label, e.g. "Register company". */
  label: string;
  /** Working days the step takes. */
  days: number;
  /** Government fee in the country currency, or 0 / null when there is none. */
  fee?: number | null;
};

export type SetupStepperProps = {
  /** The ordered formation steps. */
  steps?: SetupStep[] | null;
  /** Currency symbol prefixing fees. @default "$" */
  currency?: string;
  /** Render the honest sample state instead of the route. */
  sample?: boolean;
  className?: string;
};

export function SetupStepper({ steps, currency = "$", sample, className }: SetupStepperProps) {
  if (sample || !steps || steps.length === 0) {
    return (
      <SampleState
        glyph="doc"
        what="Formation path not held yet"
        reason="We chart the register-a-business route once the country's steps are confirmed."
        minH={90}
      />
    );
  }
  const totalDays = steps.reduce((a, s) => a + s.days, 0);
  const totalFee = steps.reduce((a, s) => a + (s.fee || 0), 0);
  const last = steps.length - 1;
  return (
    <div className={className}>
      {/* THE STATION MARKS LEFT THE SVG 2026-08-18. They were an
          `preserveAspectRatio="none"` route line in a `viewBox="0 0 640 40"`
          with the height pinned at 40, so x and y scaled INDEPENDENTLY and
          nothing in it was ever the shape it was drawn as. Measured on the real
          /gb, rendered and read in a browser rather than reasoned about:

            375    box 285x40   x scale 0.445   node circle 8 x 18 px, 2.25:1
                                                digit 11px tall, 4.9px wide
            768    box 662x40   x scale 1.034   node circle 7 x 6.8, near round
            1280   box 754x40   x scale 1.178   node circle 21.2 x 18, 1.18:1

          So the mark was a lozenge lying on its side at desktop, a lozenge
          standing on end on a phone, and a circle only at the one width where
          the box happened to be 640. The digits were squashed on one axis only,
          which no type is designed to survive.

          THERE WAS A SECOND DEFECT UNDER IT, and it is the reason this is a
          re-layout rather than an aspect-ratio switch. The nodes sat at
          `16 + i * (608 / (n - 1))` across a 640 viewBox, i.e. 2.5% to 97.5%,
          while the cards they number are equal grid columns whose centres are
          at (i + 0.5) / n. For three steps that is 2.5 / 50 / 97.5 against
          16.7 / 50 / 83.3: THE NUMBERS DID NOT SIT OVER THE CARDS THEY NUMBER,
          at any width, at any aspect ratio. And below 540px `.eng-stepper__cards`
          switches to row flow and the cards stack, while the strip stayed
          horizontal, so the numbers labelled nothing at all on a phone.

          Keeping `none` and counter-scaling would have needed the container
          width at render time, so client JS on a server-rendered page, and
          would have fixed the squash while leaving the geometry wrong.
          Switching to `meet` letterboxes the whole strip: at 375 the box
          becomes 285x17.8 and the digit renders 4.9px on BOTH axes, smaller
          than it is now.

          So the marks are HTML in the card grid, which is the technique
          CountryShape's ring labels moved to for the same root cause. One mark
          per card means alignment is true by construction at every width and
          every step count; a border-radius on a square box cannot become an
          ellipse; and the digit is real CSS type the viewBox cannot touch. The
          engraved language is unchanged: surface-card disc, ink ring, the last
          station tinted accent, the dashed traverse between them. */}
      <div className="eng-stepper__rail" style={{ ["--eng-steps"]: steps.length } as React.CSSProperties}>
        {steps.length > 1 ? <span className="eng-stepper__traverse" aria-hidden="true" /> : null}
        <div className="eng-stepper__cards">
          {steps.map((s, i) => (
            <div className="eng-step" key={i}>
              {/* aria-hidden preserves the old behaviour exactly: the route svg
                  was aria-hidden too, and the cards already read in order. */}
              <span
                className="eng-stepper__node"
                data-last={i === last ? "" : undefined}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="eng-step__name">{s.label}</div>
              <div className="eng-step__meta">
                <span className="eng-step__days">
                  {s.days} {s.days === 1 ? "day" : "days"}
                </span>
                <span className="eng-step__fee">{s.fee ? `${currency}${s.fee}` : "no fee"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="eng-stepper__total">
        <div style={{ textAlign: "right" }}>
          <div className="eng-total__k">Total time</div>
          {/* The per-step line thirty lines up already pluralises; the TOTAL
              did not, so a country whose formation route is a single one-day
              step printed "Total time 1 days". Same rule, same place. */}
          <div className="eng-total__v">
            {totalDays} {totalDays === 1 ? "day" : "days"}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="eng-total__k">Total cost</div>
          <div className="eng-total__v">
            <span className="accent">
              {currency}
              {totalFee}
            </span>
          </div>
        </div>
      </div>

      {/* Scoped styles, composed from the engraved CSS vars, kept inside this
          one file: no globals.css edit and no shared-file edit, which is the
          same containment CountryShape uses for its own overlay. Every name
          here is new, so nothing in globals is overridden and the rules cannot
          depend on which stylesheet the browser reads first. */}
      <style>{`
        .eng-stepper__rail {
          position: relative;
        }
        /* The dashed traverse, spanning node centre to node centre. Equal grid
           columns put centre i at (i + 0.5) / n, so the insets are exactly half
           a column at each end. It is drawn only for a route with more than one
           station: a country page holds the total days and the total fee, not a
           confirmed per-step split, so one station is the common case and a
           connector between one thing is a line to nowhere. */
        .eng-stepper__traverse {
          position: absolute;
          /* the cards' own 4px top margin, plus half the 18px node */
          top: calc(4px + 9px);
          left: calc(50% / var(--eng-steps));
          right: calc(50% / var(--eng-steps));
          border-top: 1px dashed var(--hairline-strong);
          pointer-events: none;
        }
        .eng-stepper__node {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          margin-bottom: 7px;
          border: 1px solid var(--ink-700);
          border-radius: 50%;
          background: var(--surface-card);
          font-family: var(--font-num);
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          color: var(--text-faint);
        }
        /* The last station carried the accent tint on the route line; it still
           does. Nothing else about the mark changes. */
        .eng-stepper__node[data-last] {
          border-color: var(--accent-fill);
          color: var(--accent);
        }
        /* Below 540px globals switches .eng-stepper__cards to row flow and the
           cards stack, so a horizontal traverse would run across a column of
           rows and connect nothing. Same breakpoint, deliberately, so the two
           rules can never disagree about which layout is in force. The marks
           stay: they left-align with the stacked cards and read as a numbered
           list, which is what the layout has become. */
        @media (max-width: 540px) {
          .eng-stepper__traverse {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* DialGauge — an engraved 270-degree dial (the days-to-hire read).    */
/* ------------------------------------------------------------------ */

export type DialGaugeProps = {
  /** The value the needle reads. */
  value: number;
  /** Full-scale value. @default 60 */
  max?: number;
  /** Square size in px. @default 96 */
  size?: number;
};

export function DialGauge({ value, max = 60, size = 96 }: DialGaugeProps) {
  const c = 50;
  const R = 38;
  const start = 135;
  const sweep = 270;
  const frac = Math.max(0, Math.min(1, value / max));
  const ang = (deg: number) => (deg * Math.PI) / 180;
  const pt = (deg: number, r: number): [number, number] => [
    c + Math.cos(ang(deg)) * r,
    c + Math.sin(ang(deg)) * r,
  ];
  const arcPath = (fromFrac: number, toFrac: number, r: number) => {
    const a0 = start + sweep * fromFrac;
    const a1 = start + sweep * toFrac;
    const [x0, y0] = pt(a0, r);
    const [x1, y1] = pt(a1, r);
    const large = a1 - a0 > 180 ? 1 : 0;
    return `M${x0} ${y0} A${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  };
  const ticks = Array.from({ length: 13 }).map((_, i) => {
    const a = start + (sweep / 12) * i;
    const [x0, y0] = pt(a, R + 2);
    const [x1, y1] = pt(a, i % 3 === 0 ? R - 5 : R - 2);
    return (
      <line
        key={i}
        x1={x0}
        y1={y0}
        x2={x1}
        y2={y1}
        stroke="var(--hairline-strong)"
        strokeWidth={i % 3 === 0 ? 1.1 : 0.6}
      />
    );
  });
  const [nx, ny] = pt(start + sweep * frac, R - 8);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ display: "block", margin: "0 auto" }}
    >
      {ticks}
      <path d={arcPath(0, 1, R)} fill="none" stroke="var(--hairline-strong)" strokeWidth="2" />
      <path
        d={arcPath(0, frac, R)}
        fill="none"
        stroke="var(--accent-fill)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line x1={c} y1={c} x2={nx} y2={ny} stroke="var(--ink-800)" strokeWidth="2" strokeLinecap="round" />
      <circle cx={c} cy={c} r="3.5" fill="var(--surface-card)" stroke="var(--ink-800)" strokeWidth="1.5" />
      <text
        x={c}
        y={c + 20}
        textAnchor="middle"
        fill="var(--text-strong)"
        style={{ font: "600 19px var(--font-display)", fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* HiringRead — wage floor vs typical pay + days-to-hire + on-cost.    */
/* ------------------------------------------------------------------ */

export type HiringReadProps = {
  /** The legal wage floor (gross, in the country currency). */
  floor?: number | null;
  /** Typical pay for the role (gross). */
  typical?: number | null;
  /** Optional bar scale ceiling; defaults to typical * 1.15. */
  max?: number | null;
  /**
   * Typical days to fill a role. OPTIONAL, and null for every country today:
   * no country-level time-to-fill is held anywhere in this repo. When it is
   * null the dial is dropped and the pay bars take the full width, rather than
   * the whole read collapsing to a sample box because of the one input nobody
   * has. The pay figures carry the read.
   */
  daysToHire?: number | null;
  /**
   * Employer social charge added on top of gross pay, in percent. OPTIONAL:
   * it is one sentence under the bars, not a bar, and 65 of the 195 countries
   * in the taxonomy hold the two wage figures but not this rate. Its absence
   * drops the sentence; it does not withhold the pay read.
   */
  staffCostPct?: number | null;
  /** Currency symbol. @default "$" */
  currency?: string;
  /** Period suffix on the pay figures. @default "/yr" */
  period?: string;
  /** Render the honest sample state instead of the read. */
  sample?: boolean;
  className?: string;
};

export function HiringRead({
  floor,
  typical,
  max,
  daysToHire,
  staffCostPct,
  currency = "$",
  period = "/yr",
  sample,
  className,
}: HiringReadProps) {
  // The two pay figures ARE the read. Everything else on this card is optional
  // furniture around them, so only their absence falls to the sample state.
  if (sample || floor == null || typical == null) {
    return (
      <SampleState
        glyph="people"
        what="Hiring read not held yet"
        reason="The wage floor and typical pay are shown together so the picture stays honest, so the read waits for both."
        minH={120}
      />
    );
  }
  const m = max || typical * 1.15;
  const hasDial = daysToHire != null && Number.isFinite(daysToHire);
  const bars = (
    <div className="eng-hiring__bars">
      <div className="eng-paybar">
        <div className="eng-paybar__head">
          <span className="eng-paybar__k">Wage floor</span>
          <span className="eng-paybar__v">
            {currency}
            {floor.toLocaleString()}
            {period}
          </span>
        </div>
        <div className="eng-paybar__track">
          <span
            className="eng-paybar__fill eng-paybar__fill--floor"
            style={{ width: `${(floor / m) * 100}%` }}
          />
        </div>
      </div>
      <div className="eng-paybar">
        <div className="eng-paybar__head">
          <span className="eng-paybar__k">Typical pay</span>
          <span className="eng-paybar__v" style={{ color: "var(--accent)" }}>
            {currency}
            {typical.toLocaleString()}
            {period}
          </span>
        </div>
        <div className="eng-paybar__track">
          <span
            className="eng-paybar__fill eng-paybar__fill--typical"
            style={{ width: `${(typical / m) * 100}%` }}
          />
        </div>
      </div>
      {staffCostPct != null ? (
        <div className="eng-hiring__staffcost">
          On top of gross pay, employers add <b>+{staffCostPct}%</b> in social charges.
        </div>
      ) : null}
    </div>
  );

  // No dial: skip the two-column grid entirely so the bars run full width. The
  // grid lives in the stylesheet as 1.5fr 1fr, so keeping it with one child
  // would leave a third of the card empty.
  if (!hasDial) {
    return <div className={className}>{bars}</div>;
  }

  return (
    <div className={["eng-hiring", className].filter(Boolean).join(" ")}>
      {bars}
      <div className="eng-hiring__dial">
        <DialGauge value={daysToHire as number} max={60} />
        <div className="eng-hiring__dialcap">days to hire, typical</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LicenceCheck — engraved permit checklist with a StampSeal motif.    */
/* ------------------------------------------------------------------ */

/** One permit on the checklist. */
export type LicenceItem = {
  /** The permit name, e.g. "Food hygiene certificate". */
  label: string;
  /** Required (solid ink check) vs recommended (dashed ring). */
  required: boolean;
  /** The cost as a display string, e.g. "$120" or "free". */
  cost: string;
  /** The time as a display string, e.g. "3 days". */
  time: string;
};

export type LicenceCheckProps = {
  /** The permit checklist. */
  items?: LicenceItem[] | null;
  /** Show the council-stamp seal motif over the corner. @default true */
  stamp?: boolean;
  /** Render the honest sample state instead of the checklist. */
  sample?: boolean;
  className?: string;
};

export function LicenceCheck({ items, stamp = true, sample, className }: LicenceCheckProps) {
  if (sample || !items || items.length === 0) {
    return (
      <SampleState
        glyph="stamp"
        what="Licences not held yet"
        reason="The permit checklist appears once the country's requirements are confirmed."
        minH={120}
      />
    );
  }
  return (
    <div className={["eng-lic", className].filter(Boolean).join(" ")}>
      {stamp ? (
        <span className="eng-lic__stamp">
          <StampSeal size={62} label="FILED" />
        </span>
      ) : null}
      {items.map((it, i) => (
        <div className="eng-lic__row" key={i}>
          <span className="eng-lic__check" aria-hidden="true">
            {it.required ? (
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="9" fill="var(--ink-900)" />
                <path
                  d="M5.5 10l3 3 6-6.5"
                  fill="none"
                  stroke="var(--surface-card)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20">
                <circle
                  cx="10"
                  cy="10"
                  r="8.4"
                  fill="none"
                  stroke="var(--cocoa-500)"
                  strokeWidth="1.4"
                  strokeDasharray="2.5 2.5"
                />
              </svg>
            )}
          </span>
          <div>
            <div className="eng-lic__label">{it.label}</div>
            <div className={"eng-lic__kind" + (it.required ? " req" : "")}>
              {it.required ? "Required" : "Recommended"}
            </div>
          </div>
          <div className="eng-lic__tags">
            <span className="eng-lic__tag">
              <span className="k">cost</span>
              {it.cost}
            </span>
            <span className="eng-lic__tag">
              <span className="k">time</span>
              {it.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
