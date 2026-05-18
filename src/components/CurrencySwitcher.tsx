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
    <div className="inline-flex items-center gap-1 rounded-full bg-cream-100 border border-parchment p-0.5 text-xs">
      {CURRENCIES.map((c) => (
        <button
          key={c.code}
          type="button"
          onClick={() => pick(c.code)}
          className={`px-2.5 py-1 rounded-full transition font-medium ${
            current === c.code
              ? "bg-ink-900 text-cream-50"
              : "text-ink-700 hover:text-ink-900"
          }`}
          title={c.label}
        >
          {c.code}
        </button>
      ))}
    </div>
  );
}
