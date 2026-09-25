/**
 * THE LINES A FIRST YEAR CROSSES (2026-09-25; his message that night: "1st year threshholds that should be met"). Page-agnostic,
 * keyed by country.
 *
 * THE FILE, data/sections/thresholds.json: each line a figure the law sets (in the law's own currency) and what crossing it
 * changes; `lead` names the line the card leads with. This module converts each figure to dollars through the one pinned rate and
 * writes its one short note; nothing is drawn from a line the copy cannot name, and fewer than three lines draw no card.
 */
import thresholdsJson from "../../../../data/sections/thresholds.json";
import type { AtlasIconId } from "@/components/brand/icons";
import { convertToUsd } from "@/lib/finance/fx";
import { COPY } from "@/lib/spine/copy";

type FileLine = { key: string; gbp: number; basis: string; pct?: number; upper_gbp?: number; upper_pct?: number };
type FileCountry = { currency: string; lead: string; lines: FileLine[] };

export type ThresholdRow = { key: string; icon: AtlasIconId; label: string; figure: string; note: string };
export type Thresholds = { iso2: string; lead: { figure: string; words: string }; rows: ThresholdRow[] };

const ICON: Record<string, AtlasIconId> = { vat: "taxes", rates: "commercial-rent", wage: "min-wage", allowance: "hiring", "small-profits": "margin" };
const whole = (v: number) => `$${Math.round(v).toLocaleString("en-US")}`;
const cents = (v: number) => `$${v.toFixed(2)}`;

export function buildThresholds(iso2: string): Thresholds | null {
  const c = (thresholdsJson as unknown as Record<string, FileCountry | string>)[iso2.toUpperCase()];
  if (!c || typeof c === "string" || !Array.isArray(c.lines)) return null;
  const T = COPY.thresholds.lines as Record<string, { label: string; note: string; words?: string; unit?: string }>;
  const rows: ThresholdRow[] = [];
  let lead: Thresholds["lead"] | null = null;
  for (const l of c.lines) {
    const t = T[l.key];
    const usd = convertToUsd(c.currency, l.gbp);
    if (!t || !ICON[l.key] || usd == null || !(usd > 0)) continue;
    const figure = l.basis === "hour" ? `${cents(usd)}${t.unit ?? ""}` : whole(usd);
    let note = t.note;
    if (l.key === "small-profits" && typeof l.upper_gbp === "number" && typeof l.upper_pct === "number") {
      const upper = convertToUsd(c.currency, l.upper_gbp);
      if (upper == null) continue;
      note = note.replace("{pct}", `${l.upper_pct}%`).replace("{upper}", whole(upper));
    }
    if (l.key === c.lead && t.words) lead = { figure, words: t.words };
    else rows.push({ key: l.key, icon: ICON[l.key], label: t.label, figure, note });
  }
  if (!lead || rows.length < 3) return null;
  return { iso2: iso2.toUpperCase(), lead, rows };
}

export function listThresholdCountries(): string[] {
  return Object.keys(thresholdsJson as unknown as Record<string, unknown>).filter((k) => !k.startsWith("_"));
}
