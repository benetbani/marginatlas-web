"use client";

/**
 * CurrencySwitcher — small client component that flips the displayed
 * currency on a cell page. Uses localStorage so the choice persists
 * across navigations.
 *
 * The currency state is read by CellMoneyDisplay (a client wrapper around
 * a number that reformats based on the current localStorage value).
 */
import { useEffect, useState } from "react";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const STORAGE_KEY = "atlas:currency";

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "USD";
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (
    v === "USD" ||
    v === "EUR" ||
    v === "GBP" ||
    v === "JPY" ||
    v === "CAD" ||
    v === "AUD"
  ) {
    return v;
  }
  return "USD";
}

export function setStoredCurrency(c: CurrencyCode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, c);
  window.dispatchEvent(new CustomEvent("atlas:currency-change", { detail: c }));
}

export function CurrencySwitcher() {
  const [current, setCurrent] = useState<CurrencyCode>("USD");

  useEffect(() => {
    setCurrent(getStoredCurrency());
  }, []);

  function pick(c: CurrencyCode) {
    setCurrent(c);
    setStoredCurrency(c);
  }

  return (
    /* MIGRATED to Radix ToggleGroup via the shadcn primitive, 2026-08-21.
       Six currencies in, six out, same order, same labels, same stored value,
       same change event. The control changes; the content does not.

       TWO DEFECTS GO WITH THE SWAP.

       1. THE PAGE STOPPED SCROLLING SIDEWAYS ON A PHONE. Measured at 375 on
          the London restaurant page: 371px of content in a 360px viewport, and
          this row was the only thing past the edge. The old container was
          `inline-flex` with no wrap, so a label plus six pills sat on one line
          that no phone is wide enough to hold. `flex-wrap` lets it fall to a
          second line, which is why the fix is a wrap rather than a dropdown:
          the pills are the established look and wrapping keeps them.

       2. IT IS NOW REACHABLE BY KEYBOARD, PROPERLY. Six separate buttons meant
          six tab stops and no relationship between them. Radix gives one tab
          stop, arrow keys between options, and a single-select role so a screen
          reader announces which of six is chosen rather than reading six
          unrelated buttons. Criterion G22, keyboard reachability, is recorded
          as UNMEASURED on this site; this is one surface that no longer needs
          measuring.

       `type="single"` (not multiple) and a guarded onValueChange: Radix emits
       the empty string when a user deselects the active item, and accepting
       that would store an empty currency and reformat every figure on the page
       to nothing. */
    <ToggleGroup
      type="single"
      value={current}
      onValueChange={(v) => {
        if (v) pick(v as CurrencyCode);
      }}
      aria-label="Show numbers in"
      className="inline-flex flex-wrap items-center gap-1 rounded-full bg-paper-100 border border-parchment p-0.5 text-xs"
    >
      {CURRENCIES.map((c) => (
        <ToggleGroupItem
          key={c.code}
          value={c.code}
          title={c.label}
          aria-label={c.label}
          className="rounded-full px-2.5 py-1 font-medium text-ink-700 transition hover:text-ink-900 data-[state=on]:bg-ink-900 data-[state=on]:text-white"
        >
          {c.code}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
