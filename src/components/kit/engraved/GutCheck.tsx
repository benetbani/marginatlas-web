/**
 * kit/engraved/GutCheck.tsx — the gut-check triptych (client island).
 *
 * Three tight yes / no prompts as an engraved triptych, each with a checkbox
 * glyph that fills moss on yes and amber on no. Tap to answer; it is a
 * sense-check, not a score, and nothing is submitted. Ported faithfully from
 * the design export 2026-06-14-country-engraved (engraved/editorial.jsx:
 * GutCheck).
 *
 * This is the one engraved section that holds state (the per-prompt answer), so
 * it carries "use client"; the rest of the editorial family stays
 * server-renderable in ./Editorial. Reads color only through the engraved CSS
 * vars. Props are nullable; missing or empty input renders the honest
 * SampleState. SVG geometry is inline. No em-dashes, no source-agency names.
 */
"use client";

import * as React from "react";
import { SampleState } from "./primitives";

type Answer = "yes" | "no" | null;

export type GutCheckProps = {
  /** The three (or however many) yes / no prompts. */
  prompts?: string[] | null;
  /** Render the honest sample state instead of the triptych. */
  sample?: boolean;
  className?: string;
};

export function GutCheck({ prompts, sample, className }: GutCheckProps) {
  const [ans, setAns] = React.useState<Record<number, Answer>>({});
  if (sample || !prompts || prompts.length === 0) {
    return (
      <SampleState
        glyph="key"
        what="Gut-check not set yet"
        reason="Three quick yes or no prompts to sense-check the country before you commit."
        minH={100}
      />
    );
  }
  const set = (i: number, v: Answer) =>
    setAns((a) => ({ ...a, [i]: a[i] === v ? null : v }));
  return (
    <div className={["eng-gut", className].filter(Boolean).join(" ")}>
      {prompts.map((p, i) => {
        const v = ans[i] ?? null;
        const boxStroke =
          v === "yes" ? "var(--moss-600)" : v === "no" ? "var(--amber-600)" : "var(--hairline-strong)";
        return (
          <div className="eng-gutcard" key={i}>
            <div className="eng-gutcard__box" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 30 30">
                <rect x="3" y="3" width="24" height="24" rx="5" fill="none" stroke={boxStroke} strokeWidth="1.6" />
                {v === "yes" ? (
                  <path
                    d="M9 15.5l4 4 8-9"
                    fill="none"
                    stroke="var(--moss-600)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}
                {v === "no" ? (
                  <path
                    d="M10 10l10 10M20 10L10 20"
                    fill="none"
                    stroke="var(--amber-600)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                ) : null}
              </svg>
            </div>
            <div className="eng-gutcard__q">{p}</div>
            <div className="eng-gutcard__ans">
              <button
                type="button"
                className={"eng-gutpill yes" + (v === "yes" ? " is-on" : "")}
                aria-pressed={v === "yes"}
                onClick={() => set(i, "yes")}
              >
                Yes
              </button>
              <button
                type="button"
                className={"eng-gutpill no" + (v === "no" ? " is-on" : "")}
                aria-pressed={v === "no"}
                onClick={() => set(i, "no")}
              >
                No
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
