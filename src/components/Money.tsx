"use client";

/**
 * Money — client component that re-renders when the user toggles the
 * currency switcher. Listens to the `atlas:currency-change` window event
 * and the storage event, so multiple Money instances stay in sync.
 */
import { useEffect, useState } from "react";
import { formatMoney, type CurrencyCode } from "@/lib/currency";
import { getStoredCurrency } from "./CurrencySwitcher";

type Props = {
  /** USD value from the cell layer */
  usd: number | null | undefined;
};

export function Money({ usd }: Props) {
  const [currency, setCurrency] = useState<CurrencyCode>("USD");

  useEffect(() => {
    setCurrency(getStoredCurrency());
    function handler(e: Event) {
      const detail = (e as CustomEvent<CurrencyCode>).detail;
      if (detail) setCurrency(detail);
    }
    function storageHandler() {
      setCurrency(getStoredCurrency());
    }
    window.addEventListener("atlas:currency-change", handler);
    window.addEventListener("storage", storageHandler);
    return () => {
      window.removeEventListener("atlas:currency-change", handler);
      window.removeEventListener("storage", storageHandler);
    };
  }, []);

  return <span suppressHydrationWarning>{formatMoney(usd, currency)}</span>;
}
