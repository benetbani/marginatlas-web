"use client";
/**
 * THE BOROUGHS' "SEE ALL" BUTTON of the city page v9 (his "for long lists we use the click to explore more functionality", 2026-10-21):
 * on a phone the rent by district shows Inner London's first rows, and this one button opens every borough and closes them again. It
 * toggles `k-all` on its card's `.k-rdist`, which the rules in globals.css, THE KIT PAGE: THE CITY, read; on a desktop the CSS hides it
 * and every row stands beside the prime rent and the tax. The page draws closed without it (the server markup), so nothing moves on load.
 */
import * as React from "react";

export function SeeAll({ more, less, children }: { more: string; less: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLButtonElement>(null);
  const flip = () => {
    const next = !open;
    setOpen(next);
    ref.current?.closest(".k-sbody")?.querySelector(".k-rdist")?.classList.toggle("k-all", next);
  };
  return (
    <button ref={ref} type="button" className="k-seeall" aria-expanded={open} onClick={flip}>
      <span>{open ? less : more}</span>
      {children}
    </button>
  );
}
