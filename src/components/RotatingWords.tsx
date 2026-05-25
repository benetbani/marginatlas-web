/**
 * RotatingWords - client island used inside HomepageHero's <h1>.
 *
 * Why a separate file: HomepageHero is a server component. This island
 * needs setInterval, so it carries the "use client" cost alone.
 *
 * 2026-05-25 rebuild: the previous implementation used inline-grid +
 * whitespace-nowrap, which kept failing on real viewports because the
 * surrounding H1 had overflowWrap=anywhere + text-balance, which
 * overrode the rotator's own nowrap and split words like "coffee shop"
 * and "New York" across lines. The new implementation:
 *
 *   - Render an inline-block slot whose width is reserved by an
 *     invisible spacer set to the WIDEST candidate.
 *   - The active word renders ABSOLUTELY POSITIONED inside the slot,
 *     left-aligned, with its own whitespace-nowrap. The absolute
 *     position takes the word out of the H1's text-balance flow, so
 *     no parent rule can split it.
 *   - The spacer keeps the surrounding text from shifting horizontally
 *     across rotations.
 *
 * Accessibility:
 *   - The h1 includes a full sentence in <span class="sr-only">.
 *   - This island's spans are aria-hidden; screen readers do not
 *     announce each rotation.
 */

"use client";

import { useEffect, useState } from "react";

export type RotatingWordsProps = {
  words: string[];
  cadenceMs?: number;
  startOffsetMs?: number;
  /** Used only as a fallback for SR users; the visible spans are aria-hidden. */
  ariaSrText?: string;
};

export default function RotatingWords({
  words,
  cadenceMs = 2400,
  startOffsetMs = 0,
}: RotatingWordsProps) {
  const [i, setI] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion: users with motion reduction get a
    // static pick and no rotation interval.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const t = setTimeout(() => {
      const id = setInterval(
        () => setI((x) => (x + 1) % words.length),
        cadenceMs,
      );
      return () => clearInterval(id);
    }, startOffsetMs);
    return () => clearTimeout(t);
  }, [words.length, cadenceMs, startOffsetMs]);

  // Pick the widest candidate. The invisible spacer renders this string
  // so the slot reserves enough horizontal space for any rotation.
  const widest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span
      aria-hidden="true"
      className="atlas-rotator relative inline-block align-baseline text-atlas-700"
      style={{ whiteSpace: "nowrap" }}
    >
      {/* Spacer: invisible, sets the slot width to the widest candidate. */}
      <span className="invisible" style={{ whiteSpace: "nowrap" }}>
        {widest}
      </span>
      {/* All candidates stack on top of the spacer, absolutely positioned.
         Only the active one has opacity 1. Position: absolute removes
         the words from the H1 text-flow so no parent rule (text-balance,
         overflow-wrap, hyphens) can split them across lines. */}
      {words.map((w, idx) => (
        <span
          key={w}
          className="absolute left-0 top-0 transition-opacity duration-300 ease-out"
          style={{
            whiteSpace: "nowrap",
            opacity: idx === i ? 1 : 0,
            pointerEvents: "none",
          }}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
