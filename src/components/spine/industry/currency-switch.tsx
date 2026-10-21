"use client";
/**
 * THE € / $ SWITCH of the industry page v4 (the kit's switch, kit.py SWITCH; his "always in those tables, there should be the option
 * to make the thing in dollars, some sort of switch", FOUNDER-VERDICTS 2026-10-20 04:30): two buttons, the local currency first.
 * Pressing the dollar puts every money pair on the page dollars first; it sets `data-cur` on the page's root (`.kit4`), which the
 * rules in globals.css, THE KIT PAGE, read. The page draws in euros first without it (the server markup), so nothing moves on load.
 */
import * as React from "react";

export function CurrencySwitch({ label }: { label: string }) {
  const [usd, setUsd] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const pick = (next: boolean) => {
    setUsd(next);
    const root = ref.current?.closest(".kit4");
    if (root) root.setAttribute("data-cur", next ? "usd" : "local");
  };
  return (
    <div ref={ref} className="k-switch" role="group" aria-label={label}>
      <button type="button" aria-pressed={!usd} onClick={() => pick(false)}>
        €
      </button>
      <button type="button" aria-pressed={usd} onClick={() => pick(true)}>
        $
      </button>
    </div>
  );
}

/**
 * THE € / $ SWITCH ON KIT-VERSION 3 (the industry page v6, his "v6 is the approved industry target.", 2026-10-21): the same two buttons in
 * kit3.py's markup (`.switch`, `data-cur` on each button, a disclosure of kind `switch`, KIT 3's DISCLOSURE law). Pressing $ sets
 * `data-cur="usd"` on the page's root (`.kit3`), which globals.css, THE KIT 3 PAGE, reads to put every money pair dollars first.
 * Added beside version 2's switch above, which stays exactly as it is (the city page v9 reads it).
 */
export function CurrencySwitch3({ label }: { label: string }) {
  const [usd, setUsd] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const pick = (next: boolean) => {
    setUsd(next);
    const root = ref.current?.closest(".kit3");
    if (root) root.setAttribute("data-cur", next ? "usd" : "local");
  };
  return (
    <div ref={ref} className="switch" role="group" aria-label={label} data-disclosure="switch">
      <button type="button" data-cur="eur" aria-pressed={!usd} onClick={() => pick(false)}>
        €
      </button>
      <button type="button" data-cur="usd" aria-pressed={usd} onClick={() => pick(true)}>
        $
      </button>
    </div>
  );
}
