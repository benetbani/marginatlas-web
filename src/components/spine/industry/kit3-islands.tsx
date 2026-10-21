"use client";
/**
 * THE INDUSTRY PAGE v6'S TWO CLIENT ISLANDS (the target's own scripts, kit3.py SCRIPTS "switch" and "qlist"; nothing else on the page
 * moves). Both draw as the server markup draws them, so nothing shifts on load.
 *
 *  - CurrencySwitch3: the € / $ switch above the country table (his "always in those tables, there should be the option to make the
 *    thing in dollars, some sort of switch", FOUNDER-VERDICTS 2026-10-20 04:30). Pressing $ sets `data-cur="usd"` on the page's root
 *    (`.kit3`), which globals.css, THE KIT 3 PAGE, reads to put every money pair dollars first; the switch is a disclosure of kind
 *    `switch` (KIT 3's DISCLOSURE law).
 *  - OpenAll: a question list's "Open all" (version 3's question list: independent questions, several may open at once; past five
 *    the button). It opens or closes every question of its list and says which it will do next.
 */
import * as React from "react";

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

export function OpenAll({ list, open: openWord, close: closeWord }: { list: string; open: string; close: string }) {
  const [open, setOpen] = React.useState(false);
  const toggle = () => {
    const next = !open;
    document.querySelectorAll<HTMLDetailsElement>(`#${list} details`).forEach((d) => (d.open = next));
    setOpen(next);
  };
  return (
    <button className="btn line openall" type="button" data-openall={list} aria-expanded={open} aria-controls={list} onClick={toggle}>
      {open ? closeWord : openWord}
    </button>
  );
}
