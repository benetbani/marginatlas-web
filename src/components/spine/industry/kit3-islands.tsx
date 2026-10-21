"use client";
/**
 * THE INDUSTRY PAGE v6'S CLIENT ISLANDS (the target's own scripts, kit3.py SCRIPTS "switch" and "qlist"; nothing else on the page
 * moves). Both draw as the server markup draws them, so nothing shifts on load.
 *
 *  - the € / $ switch above the country table: CurrencySwitch3, beside version 2's switch in ./currency-switch.tsx.
 *  - OpenAll: a question list's "Open all" (version 3's question list: independent questions, several may open at once; past five
 *    the button). It opens or closes every question of its list and says which it will do next.
 */
import * as React from "react";

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
