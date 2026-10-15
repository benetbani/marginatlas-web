/**
 * src/lib/simulator/display.ts , THE MONEY IN THE READER'S CURRENCY (plan 2026-10-13 cost-simulator, Task 4A; spec section 4: "the money in the reader's
 * display currency through the site's existing switch"; the plan's Reading 14). The engine counts in the base currency, pounds for a UK place (the
 * law's own) and dollars elsewhere. A figure shows exactly in its base; a UK figure in dollars at the site's pound rate (fx.ts, the trade page's own
 * dollars), and so is a dollar figure shown in pounds; any other through dollars at the display rates (currency.ts). A typed figure goes back the same way, so the base never moves when the
 * currency does. A loss prints a true minus (U+2212) before the symbol, "−$12K", never spine/money.ts's "$-12,000".
 */
import { CURRENCIES, convertFromUsd, type CurrencyCode } from "@/lib/currency";
import { convertToUsd, convertUsdTo } from "@/lib/finance/fx";

export type Base = "GBP" | "USD";
/** The true minus sign, U+2212 (written by its code so no reader mistakes it for a hyphen). */
export const MINUS = String.fromCharCode(0x2212);

export function toDisplay(x: number, base: Base, show: CurrencyCode): number {
  if (show === base) return x;
  const usd = base === "USD" ? x : (convertToUsd("GBP", x) as number);
  /* Pounds always at fx.ts's rate, the one a UK figure's dollars take, so the page holds one pound rate (the final review's M4). */
  return show === "USD" ? usd : show === "GBP" ? (convertUsdTo("GBP", usd) as number) : convertFromUsd(usd, show);
}

export function fromDisplay(x: number, base: Base, show: CurrencyCode): number {
  if (show === base) return x;
  const usd = show === "USD" ? x : show === "GBP" ? (convertToUsd("GBP", x) as number) : x / convertFromUsd(1, show);
  return base === "USD" ? usd : (convertUsdTo("GBP", usd) as number);
}

export const symbolOf = (c: CurrencyCode): string => CURRENCIES.find((k) => k.code === c)?.symbol ?? "$";

/** An amount already in the display currency: whole units with thousands marks; `compact` takes thousands as K and millions as M. */
export function shown(d: number, show: CurrencyCode, compact = false): string {
  const a = Math.abs(d);
  const body = compact && a >= 1e6 ? `${(a / 1e6).toFixed(a >= 1e7 ? 1 : 2)}M` : compact && a >= 1e4 ? `${Math.round(a / 1000).toLocaleString("en-GB")}K` : Math.round(a).toLocaleString("en-GB");
  const negative = compact && a >= 1e4 ? d < 0 : Math.round(a) > 0 && d < 0;
  return `${negative ? MINUS : ""}${symbolOf(show)}${body}`;
}

export function money(x: number, base: Base, show: CurrencyCode, compact = false): string {
  return shown(toDisplay(x, base, show), show, compact);
}

export function percent(x: number, digits = 1): string {
  const s = (Math.abs(x) * 100).toFixed(digits);
  return `${x < 0 && Number(s) !== 0 ? MINUS : ""}${s}%`;
}

export type Format = { base: Base; show: CurrencyCode; symbol: string; money: (x: number, compact?: boolean) => string; toShow: (x: number) => number; fromShow: (x: number) => number; percent: (x: number, digits?: number) => string };

export function makeFormat(base: Base, show: CurrencyCode): Format {
  return { base, show, symbol: symbolOf(show), money: (x, compact = false) => money(x, base, show, compact), toShow: (x) => toDisplay(x, base, show), fromShow: (x) => fromDisplay(x, base, show), percent };
}
