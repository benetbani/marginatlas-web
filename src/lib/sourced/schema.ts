/**
 * THE SOURCED-DATA CONTRACT (plan 2026-10-17 replicable pages, Tasks 1 to 4): one file per source under data/sourced/<domain>/,
 * one row per published figure, each said at its level (constitution law 14). A row's own `source` overrides its file's (a licence
 * read from its issuer's page); `value: null` stands only with a `note` saying the fact in words (Italy: no statutory minimum wage).
 * checkFile is the one judge of the shape: the sourced-data gate and the loader's tests both read it (it mirrors
 * /srv/atlas/wc/briefs/validate_sourced.py, which the data jobs ran).
 */

/* "district" joined on the industry port (2026-10-21): data/sourced/place/uk5-voa-borough-rents-2026.json holds London's 33
   boroughs at that level and Inner and Outer London as "group" (ONS's two groupings of the boroughs), sourced on his word "Yes: add a Rent by district section to London from the official rents for the 33
   boroughs" (FOUNDER-VERDICTS, 2026-10-21, "London (/cities/london) v4 seen: rent by district, yes"); without it the file reds. */
export type Level = "district" | "group" | "city" | "metro" | "county" | "region" | "country" | "eu";
export const LEVELS: readonly Level[] = ["district", "group", "city", "metro", "county", "region", "country", "eu"];

export type Source = { publisher: string; title: string; url: string; table?: string; licence?: string };

export type Geo = { level: Level; code: string; name: string };

export type SourcedRow = {
  item: string;
  trade?: string;
  /** The official class's code in its classification's notation ("56.10", "96.0", "G"), on data-trades' files, which carry no `trade`:
   *  one class serves many trades, the trade-to-class join is the class map (data/sourced/trades/classes-uk.json). */
  classCode?: string;
  officialClass?: string;
  geo: Geo;
  value: number | null;
  unit: string;
  year: string;
  measure?: string;
  note?: string;
  source?: Source;
  /** A register's broad sector (data note 36): its own code ("I", "72", "9 : Accommodation & food services (I)"'s letter), the
   *  register's name for it in `officialClass`. Only the whole register's sector rows carry it. */
  sector?: string;
  /** Read through one route only (data note 34: a fetch tool, a value typed from an image) and not yet confirmed by a second: the row
   *  stays in its file with its note and the loader never hands it to a page. */
  unconfirmed?: boolean;
};

export type SourcedFile = { id: string; source: Source; retrieved: string; rows: SourcedRow[] };

/** A row with its source resolved (its own, else its file's) and the id of the file it came from (the Sources page's anchor). */
export type ResolvedRow = SourcedRow & { source: Source; fileId: string };

const text = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";

function sourceFaults(s: unknown, where: string): string[] {
  if (!s || typeof s !== "object") return [`${where}: source is not an object`];
  const o = s as Record<string, unknown>;
  const out: string[] = [];
  for (const k of ["publisher", "title", "url"]) if (!text(o[k])) out.push(`${where}: source.${k} missing`);
  if (text(o.url) && !/^https?:\/\//.test(o.url)) out.push(`${where}: source.url is not a URL`);
  return out;
}

/** Every fault of one parsed file against the contract, as sentences; empty when it holds. */
export function checkFile(d: unknown, name: string): string[] {
  if (!d || typeof d !== "object" || Array.isArray(d)) return [`${name}: top level is not an object`];
  const f = d as Record<string, unknown>;
  const out: string[] = [];
  if (!text(f.id)) out.push(`${name}: id missing`);
  out.push(...sourceFaults(f.source, name));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(f.retrieved ?? ""))) out.push(`${name}: retrieved is not YYYY-MM-DD`);
  if (!Array.isArray(f.rows) || f.rows.length === 0) return [...out, `${name}: rows missing or empty`];
  f.rows.forEach((r: unknown, i: number) => {
    const w = `${name} row ${i}`;
    if (!r || typeof r !== "object") { out.push(`${w}: not an object`); return; }
    const o = r as Record<string, unknown>;
    if (!text(o.item)) out.push(`${w}: item missing`);
    const g = o.geo as Record<string, unknown> | undefined;
    if (!g || typeof g !== "object" || !LEVELS.includes(g.level as Level)) out.push(`${w}: geo.level must be one of ${LEVELS.join(", ")}`);
    else for (const k of ["code", "name"]) if (!text(g[k])) out.push(`${w}: geo.${k} missing`);
    if (o.value === null || o.value === undefined) { if (!text(o.note)) out.push(`${w}: value null without a note saying the fact`); }
    else if (typeof o.value !== "number" || !Number.isFinite(o.value)) out.push(`${w}: value must be a number or null`);
    if (!text(o.unit)) out.push(`${w}: unit missing`);
    if (typeof o.year !== "string" || !/^\d{4}/.test(o.year)) out.push(`${w}: year must start with four digits`);
    if ("source" in o) out.push(...sourceFaults(o.source, w));
  });
  return out;
}
