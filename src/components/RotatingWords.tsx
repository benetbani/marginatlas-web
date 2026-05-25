/**
 * RotatingWords — client island used inside HomepageHero's <h1>.
 *
 * Why a separate file: HomepageHero is a server component. This tiny piece
 * needs setInterval, so it carries the "use client" cost alone.
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
    const t = setTimeout(() => {
      const id = setInterval(() => setI((x) => (x + 1) % words.length), cadenceMs);
      return () => clearInterval(id);
    }, startOffsetMs);
    return () => clearTimeout(t);
  }, [words.length, cadenceMs, startOffsetMs]);

  // CitiesFix2 sec 2: pick the widest candidate word ONCE and use it as
  // the spacer so the surrounding text never shifts horizontally. The
  // previous spacer used `words[i]` which changed width each cycle and
  // pushed the static prefix around on every rotation.
  const widest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span
      aria-hidden="true"
      className="relative inline-block align-baseline text-atlas-700"
    >
      {words.map((w, idx) => (
        <span
          key={w}
          className={`atlas-rotator__word absolute left-1/2 -translate-x-1/2 ${idx === i ? "atlas-rotator__word--active" : "opacity-0"}`}
          style={{ pointerEvents: "none" }}
        >
          {w}
        </span>
      ))}
      {/* Static spacer renders the WIDEST candidate so the container
         width never changes as words rotate. invisible keeps the
         layout slot reserved without rendering text. */}
      <span className="invisible">{widest}</span>
    </span>
  );
}
