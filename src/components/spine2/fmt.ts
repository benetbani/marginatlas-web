/**
 * src/components/spine2/fmt.ts
 *
 * Shared formatters for the v2 spine kit. Extracted from the /dev/calculator
 * usd() (the shape the mockups print: $620K, $2.4K, $36, $1.2M), hardened to
 * the nullable-inputs rule: a missing number formats to null, never a dash or
 * "NaN", so callers can self-omit the row (PORT-CONTRACT M9 pattern 2).
 *
 * usdParts()/pctParts() split value and unit for the Fig atom, whose small
 * `.u` suffix ("K", "%", "yr") is part of the frozen figure typography.
 */

export function usd(n: number | null | undefined): string | null {
  if (n == null || !Number.isFinite(n)) return null;
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  if (a >= 1e6) return `${sign}$${trimZero((a / 1e6).toFixed(1))}M`;
  if (a >= 1e3) return `${sign}$${Math.round(a / 1e3)}K`;
  return `${sign}$${Math.round(a)}`;
}

/** usd split for <Fig value unit>: 620000 -> { value: "$620", unit: "K" } */
export function usdParts(
  n: number | null | undefined,
): { value: string; unit?: string } | null {
  if (n == null || !Number.isFinite(n)) return null;
  const sign = n < 0 ? "-" : "";
  const a = Math.abs(n);
  if (a >= 1e6) return { value: `${sign}$${trimZero((a / 1e6).toFixed(1))}`, unit: "M" };
  if (a >= 1e3) return { value: `${sign}$${Math.round(a / 1e3)}`, unit: "K" };
  return { value: `${sign}$${Math.round(a)}` };
}

/**
 * Fraction to percent: 0.34 -> "34%"; signed: 0.15 -> "+15%" (the mockups
 * print employer contributions and deviations with an explicit sign).
 */
export function pct(
  n: number | null | undefined,
  opts?: { digits?: number; signed?: boolean },
): string | null {
  if (n == null || !Number.isFinite(n)) return null;
  const v = n * 100;
  const digits = opts?.digits ?? 0;
  const body = trimZero(v.toFixed(digits));
  const sign = opts?.signed && v > 0 ? "+" : "";
  return `${sign}${body}%`;
}

/** pct split for <Fig>: 0.34 -> { value: "34", unit: "%" } */
export function pctParts(
  n: number | null | undefined,
  opts?: { digits?: number; signed?: boolean },
): { value: string; unit: string } | null {
  const s = pct(n, opts);
  if (s == null) return null;
  return { value: s.slice(0, -1), unit: "%" };
}

/** Plain grouped figure: 12500 -> "12,500". */
export function fig(n: number | null | undefined, digits = 0): string | null {
  if (n == null || !Number.isFinite(n)) return null;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function trimZero(s: string): string {
  return s.replace(/\.0+$/, "");
}
