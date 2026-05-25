/**
 * RotatingWords — client island used inside HomepageHero's <h1>.
 *
 * Why a separate file: HomepageHero is a server component. This tiny piece
 * needs setInterval, so it carries the "use client" cost alone.
 *
 * Country-page rebuild §6 (2026-05-25): the previous implementation rendered
 * the active word as `absolute left-1/2 -translate-x-1/2` over an invisible
 * spacer. When the H1 wrapped mid-rotator (e.g. on a narrow viewport with
 * "How much does a [pharmacy] make in [New York]?"), the absolutely-
 * positioned word fell on a different line than the surrounding inline
 * static text, so "New York" would float next to a trailing "?" on its
 * own row. The fix: render the active word inside a CSS grid stack where
 * every candidate word shares the same cell. Only opacity changes between
 * frames; the rotator stays inline and never escapes its line box.
 *
 * Accessibility:
 *   - The h1 includes a full sentence in <span class="sr-only">.
 *   - This island's spans are aria-hidden, so screen readers do not announce
 *     each rotation (per spec: "announced once on page load").
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
    // Plan v14 6c: respect prefers-reduced-motion. Users with motion
    // reduction enabled get a single static pick and no rotation interval.
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

  // Pick the widest candidate so the slot reserves enough horizontal
  // space and the surrounding inline text never reflows.
  const widest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span
      aria-hidden="true"
      className="atlas-rotator inline-grid align-baseline whitespace-nowrap text-atlas-700"
    >
      {/* Spacer: invisibly reserves the width of the widest candidate. */}
      <span
        className="invisible col-start-1 row-start-1"
        style={{ gridArea: "1 / 1" }}
      >
        {widest}
      </span>
      {/* All candidate words stack in the SAME grid cell. Only opacity
         toggles between frames, so the active word never escapes the
         line box. */}
      {words.map((w, idx) => (
        <span
          key={w}
          className="col-start-1 row-start-1 transition-opacity duration-300 ease-out"
          style={{
            gridArea: "1 / 1",
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
