/**
 * THE SOURCES PAGE'S ENTRIES FOR data/sourced/ (plan 2026-10-17 replicable pages; the global constraint "a section's source line
 * names the kind of source, the place and the year in words and links to its entry on the Sources page, which names the publisher,
 * title and URL"). One entry per source file: its publisher, title, URL, licence and the years its rows hold, under a stable anchor
 * made from the file's id (sourceAnchor), and, where rows carry their own source, each of those beneath it. The Sources page is
 * About the figures, section #sources (src/app/(site)/about-data/page.tsx); a section's source line links to sourceHref(row.fileId).
 */
import type { SourcedFile } from "./schema";
import { SOURCED_FILES } from "./files";

export const SOURCES_PAGE = "/about-data";

/** The anchor of a source file's entry: its id, kept to letters, digits and hyphens. */
export const sourceAnchor = (fileId: string) => `source-${fileId.toLowerCase().replace(/[^a-z0-9-]+/g, "-")}`;
export const sourceHref = (fileId: string) => `${SOURCES_PAGE}#${sourceAnchor(fileId)}`;

/** A file whose rows each carry their own issuer (the rules files: a law, a fee, a rate, each from its issuer's own page) says so in
 *  its file-level publisher; on the Sources page it is headed by what it holds and lists each issuer under it (I1, step 5). */
export const PER_ROW_ISSUER = /^Each row's own issuer/;
export const PER_ROW_HEADING = "Laws, fees and rates, read from each issuer's own page";

export type SourceEntry = {
  anchor: string;
  /** The entry's head: the publisher, or PER_ROW_HEADING for a file whose rows each name their own issuer. */
  publisher: string;
  /** True where the rows each name their own issuer: the title then says what the file holds and is no link of its own. */
  perRow: boolean;
  title: string;
  url: string;
  licence: string | null;
  /** The calendar years its rows cover, in runs ("2020 to 2024"). */
  years: string;
  /** The row-level sources beneath the file's own, each once. */
  also: Array<{ publisher: string; title: string; url: string; licence: string | null }>;
};

/** The calendar years a year string covers: its four-digit years ("2024-06-12" and "2025-Q3" one each), a span ("2020-2024",
 *  "2022/23-2024/25") every year between its ends, a tax year ("2026-27", its second part the next year) both of its years. */
export function yearsCovered(y: string): number[] {
  const full = (y.match(/\d{4}/g) ?? []).map(Number);
  const tax = /^(\d{4})-(\d{2})$/.exec(y);
  if (tax && Number(tax[2]) === (Number(tax[1]) + 1) % 100) full.push(Number(tax[1]) + 1);
  for (const m of y.matchAll(/(\d{4})\/(\d{2})\b/g)) full.push(Math.floor(Number(m[1]) / 100) * 100 + Number(m[2]));
  if (!full.length) return [];
  const lo = Math.min(...full), hi = Math.max(...full);
  return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
}

/** The years rows hold, in words: the calendar years they cover, in runs ("2019, 2022 to 2024"). */
export function yearsHeld(years: readonly string[]): string {
  const all = [...new Set(years.flatMap(yearsCovered))].sort((a, b) => a - b);
  const out: string[] = [];
  let run: number[] = [];
  const flush = () => { if (run.length) out.push(run.length > 1 ? `${run[0]} to ${run[run.length - 1]}` : String(run[0])); run = []; };
  for (const n of all) { if (run.length && n !== run[run.length - 1] + 1) flush(); run.push(n); }
  flush();
  return out.join(", ");
}

export function sourceEntries(files: readonly SourcedFile[] = SOURCED_FILES): SourceEntry[] {
  return [...files]
    .sort((a, b) => a.source.publisher.localeCompare(b.source.publisher) || a.source.title.localeCompare(b.source.title))
    .map((f) => {
      const also = new Map<string, SourceEntry["also"][number]>();
      const perRow = PER_ROW_ISSUER.test(f.source.publisher);
      for (const r of f.rows) {
        const s = r.source;
        if (!s || (!perRow && s.url === f.source.url && s.title === f.source.title)) continue;
        const key = `${s.url}\n${s.title}`;
        if (!also.has(key)) also.set(key, { publisher: s.publisher, title: s.title, url: s.url, licence: s.licence ?? null });
      }
      return {
        anchor: sourceAnchor(f.id),
        publisher: perRow ? PER_ROW_HEADING : f.source.publisher,
        perRow,
        title: f.source.title,
        url: f.source.url,
        licence: f.source.licence ?? null,
        years: yearsHeld(f.rows.map((r) => r.year)),
        also: perRow ? [...also.values()].sort((a, b) => a.publisher.localeCompare(b.publisher) || a.title.localeCompare(b.title)) : [...also.values()],
      };
    });
}
