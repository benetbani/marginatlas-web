/**
 * src/components/spine2/Calc.tsx
 *
 * The calculator, cell 02: six sliders into one invariant compute, the
 * "you would keep" figure, a threshold-laddered plain-words note, and the
 * sorted "what one move is worth" leverage readout. The only part of the
 * calculator that is a client component; the engine (calc-engine.ts) and the
 * configs (calc-config.ts) are plain modules.
 *
 * URL state (ratified: a scenario is shareable): one query param,
 * `?c=vol:60,rent:70000`, listing only vars that differ from their defaults.
 * Read ONCE on mount from location.search, never useSearchParams, so the
 * prerendered page stays static; written with a debounced
 * history.replaceState. Values clamp to [min,max]; unknown ids are ignored.
 *
 * Self-omit (M9): renders only when the config can run its own compute AND
 * the defaults reproduce the published take-home. In dev an out-of-calibration
 * config throws; in production it self-omits, because a calculator that
 * contradicts its page is worse than none.
 */
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { GlyphIcon } from "./GlyphIcon";
import { usd } from "./fmt";
import {
  type CalcConfig,
  type CalcValues,
  assertCalibration,
  calibrationOk,
  computeKeep,
  constantVars,
  decodeState,
  defaultsOf,
  encodeState,
  formatValue,
  isRenderable,
  leverageCaption,
  leverageGain,
  noteFor,
  sliderVars,
} from "./calc-engine";

const MINUS = "−";

export interface CalcProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  config: CalcConfig;
  /** The page's headline take-home; the defaults must reproduce it. */
  published: { ownerKeeps: number };
  title?: string;
  hint?: string;
}

/** Signed money in the mockup's grammar: a true minus, never a hyphen. */
function signedMoney(n: number, always?: boolean): string {
  const body = usd(Math.abs(n)) ?? "";
  if (n < 0) return `${MINUS}${body}`;
  return always ? `+${body}` : body;
}

const URL_DEBOUNCE_MS = 250;

export function Calc({
  config,
  published,
  title = "Calculator",
  hint = "drag any slider",
  className,
  ...props
}: CalcProps) {
  const renderable = isRenderable(config) && calibrationOk(config, published);
  if (process.env.NODE_ENV !== "production" && isRenderable(config)) {
    // dev: a config that cannot reproduce its page's number is a defect, not
    // a silent omission.
    assertCalibration(config, published);
  }

  const [values, setValues] = React.useState<CalcValues>(() => defaultsOf(config));
  const urlReady = React.useRef(false);

  // Read once on mount from location.search (NOT useSearchParams: the page
  // must stay static). Runs before the write effect below by declaration order.
  React.useEffect(() => {
    setValues(decodeState(config, window.location.search));
    urlReady.current = true;
  }, [config]);

  // Debounced history.replaceState; only vars that differ from defaults, and
  // the param disappears entirely at defaults so canonical URLs stay clean.
  React.useEffect(() => {
    if (!urlReady.current) return;
    const t = window.setTimeout(() => {
      const enc = encodeState(config, values);
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("c") === enc || (enc == null && !sp.has("c"))) return;
      if (enc) sp.set("c", enc);
      else sp.delete("c");
      const q = sp.toString().replace(/%3A/gi, ":").replace(/%2C/gi, ",");
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${q ? `?${q}` : ""}${window.location.hash}`,
      );
    }, URL_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [config, values]);

  if (!renderable) return null;

  const sliders = sliderVars(config);
  const constants = constantVars(config);
  const keep = computeKeep(config, values);
  const note = noteFor(config, keep);

  // The leverage readout: caption templated and delta computed from ONE spec
  // (M7), re-sorted by gain, bars scaled to the biggest move.
  const moves = [...sliders, ...constants]
    .map((v) => ({
      id: v.id,
      caption: leverageCaption(v),
      gain: leverageGain(config, values, v),
    }))
    .sort((a, b) => b.gain - a.gain);
  const top = Math.max(...moves.map((m) => Math.abs(m.gain)), 0) || 1;

  return (
    <div className={cn("calc", className)} {...props}>
      <div className="chd">
        <div className="t">
          <GlyphIcon id="calculator" size={18} />
          {title}
        </div>
        <span className="hint">
          <GlyphIcon id="range" size={13} />
          {hint}
        </span>
        <button
          type="button"
          className="rst"
          onClick={() => setValues(defaultsOf(config))}
        >
          Reset
        </button>
      </div>
      <div className="body2">
        <div className="vars">
          {sliders.map((v) => {
            const value = values[v.id] ?? v.defaultValue;
            return (
              <div className="var" key={v.id}>
                <div className="vh">
                  <span className="nm">
                    <GlyphIcon id={v.glyph} size={18} />
                    {v.label}
                  </span>
                  <span className="cur fig">{formatValue(v.format, value)}</span>
                </div>
                <input
                  type="range"
                  min={v.min}
                  max={v.max}
                  step={v.step}
                  value={value}
                  aria-label={v.label}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    setValues((prev) => ({ ...prev, [v.id]: next }));
                  }}
                />
                <div className="ends">
                  <span>{formatValue(v.format, v.min)}</span>
                  <span>{formatValue(v.format, v.max)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="out">
          <div className={cn("res", keep < 0 && "neg")}>
            <div className="rl">You would keep</div>
            <div className="rn fig">{signedMoney(keep)}</div>
            <div className="rs">{note}</div>
          </div>
          <div className="lev">
            <div className="lh">What one move is worth</div>
            <div>
              {moves.map((m) => (
                <div className="lr" key={m.id}>
                  <span className="nm">{m.caption}</span>
                  <span className="bar">
                    <i
                      style={{
                        width: `${((Math.abs(m.gain) / top) * 100).toFixed(0)}%`,
                      }}
                    />
                  </span>
                  <span className="v">{signedMoney(m.gain, true)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
