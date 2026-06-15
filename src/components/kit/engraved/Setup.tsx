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
import { RouteLine, StampSeal, SampleState } from "./primitives";

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

// The internal viewBox width the route line spans.
const STEPPER_W = 640;

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
  const pad = 16;
  const step = steps.length > 1 ? (STEPPER_W - pad * 2) / (steps.length - 1) : 0;
  return (
    <div className={className}>
      <svg
        className="eng-stepper__route"
        viewBox={`0 0 ${STEPPER_W} 40`}
        preserveAspectRatio="none"
        height="40"
        aria-hidden="true"
      >
        <RouteLine nodes={steps.length} w={STEPPER_W} />
        {steps.map((_, i) => (
          <text
            key={i}
            x={pad + step * i}
            y="38"
            textAnchor="middle"
            fill="var(--text-faint)"
            style={{ font: "700 11px var(--font-num)" }}
          >
            {i + 1}
          </text>
        ))}
      </svg>
      <div className="eng-stepper__cards">
        {steps.map((s, i) => (
          <div className="eng-step" key={i}>
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
      <div className="eng-stepper__total">
        <div style={{ textAlign: "right" }}>
          <div className="eng-total__k">Total time</div>
          <div className="eng-total__v">{totalDays} days</div>
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
  /** Typical days to fill a role. */
  daysToHire?: number | null;
  /** Employer social charge added on top of gross pay, in percent. */
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
  if (sample || floor == null || typical == null || daysToHire == null || staffCostPct == null) {
    return (
      <SampleState
        glyph="people"
        what="Hiring read not held yet"
        reason="Wage floor, typical pay and time-to-hire are shown together so the picture stays honest."
        minH={120}
      />
    );
  }
  const m = max || typical * 1.15;
  return (
    <div className={["eng-hiring", className].filter(Boolean).join(" ")}>
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
        <div className="eng-hiring__staffcost">
          On top of gross pay, employers add <b>+{staffCostPct}%</b> in social charges.
        </div>
      </div>
      <div className="eng-hiring__dial">
        <DialGauge value={daysToHire} max={60} />
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
