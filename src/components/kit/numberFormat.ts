/**
 * numberFormat - a serializable number-format spec for the kit.
 *
 * The masthead anchor animates inside a client island (CountUpNumber), and a
 * function prop cannot cross the server/client boundary in the App Router. So
 * the anchor carries a SPEC (a plain string), and both the server masthead and
 * the client count-up format through this one shared helper. Everything else in
 * the kit renders server-side, where a plain format function is fine.
 *
 * Locale is pinned so the server render and the first client paint agree (no
 * hydration mismatch on digit grouping).
 */
export type NumberFormatSpec =
  | "usd-compact"
  | "usd-full"
  | "int"
  | "percent"
  | "percent1";

export function formatWithSpec(n: number, spec: NumberFormatSpec): string {
  if (!Number.isFinite(n)) return "–";
  switch (spec) {
    case "usd-compact": {
      const a = Math.abs(n);
      if (a >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
      if (a >= 1_000) return `$${Math.round(n / 1_000)}K`;
      return `$${Math.round(n)}`;
    }
    case "usd-full":
      return `$${Math.round(n).toLocaleString("en-US")}`;
    case "int":
      return Math.round(n).toLocaleString("en-US");
    case "percent":
      return `${Math.round(n)}%`;
    case "percent1":
      return `${n.toFixed(1)}%`;
  }
}
