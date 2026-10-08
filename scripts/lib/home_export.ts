/**
 * scripts/lib/home_export.ts , THE HOME'S EXPORTS ARE THEIR SOURCES' (plan 2026-10-08, home sections).
 *
 * data/home/ holds slices of files on disk outside this repo, written by scripts/data/home/export_home.py with a manifest of each
 * file's SHA-256, its rows, the day it ran and every source it read (path, bytes, SHA-256, the publisher's key on the sources page,
 * whether a figure prints from it). Each section's gate (tests/home/<section>.test.ts) holds its file here:
 *   - the manifest hashes every .json in data/home and names none that is missing, so a file nothing hashes cannot sit there;
 *   - the file is the export's byte for byte, so a figure edited by hand fails the chain (a CRLF checkout is named as such);
 *   - every source a figure prints from names its publisher's entry in src/lib/spine/uk_sources.ts (UK_SOURCES or WORLD_SOURCES);
 *   - on the machine that holds the sources, each is hashed again, so a source changed since the export fails until it runs again.
 * It reads this repo, and a source only where it exists (existsSync), which a build server never has: there the line says the
 * source was not read again, never that it passed.
 *
 * What it cannot see: a hand edit that also rewrites manifest.json (nothing signs the manifest, as with the register slices), and
 * whether the export read its source rightly (the export's refusals and each gate's own checks hold that).
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { UK_SOURCES, WORLD_SOURCES } from "../../src/lib/spine/uk_sources";

export const HOME_DIR = "data/home";
export const HOME_MANIFEST = `${HOME_DIR}/manifest.json`;
export const HOME_EXPORT = "python -P scripts/data/home/export_home.py";

export type HomeSource = { key: string; path: string; bytes: number; sha256: string; publisher: string | null; title: string; prints: boolean };
export type HomeEntry = { sha256: string; rows: number; built: string; sources: HomeSource[] };

const sha = (b: Buffer | string) => createHash("sha256").update(b).digest("hex");

/** The slice `name` held to the manifest and its sources, each finding through `check`; its parsed body and its manifest entry. */
export function holdHomeExport(name: string, check: (label: string, ok: boolean) => void): { data: unknown; entry: HomeEntry } | null {
  if (!existsSync(HOME_MANIFEST)) {
    check(`${HOME_MANIFEST} exists (run ${HOME_EXPORT})`, false);
    return null;
  }
  const manifest = JSON.parse(readFileSync(HOME_MANIFEST, "utf8")) as { files: Record<string, HomeEntry> };
  const listed = Object.keys(manifest.files).sort();
  const onDisk = readdirSync(HOME_DIR).filter((f) => f.endsWith(".json") && f !== "manifest.json").sort();
  check(`the manifest hashes every file in ${HOME_DIR} and names none that is missing (listed ${listed.join(", ") || "none"}; on disk ${onDisk.join(", ") || "none"})`, JSON.stringify(listed) === JSON.stringify(onDisk));
  const entry = manifest.files[name];
  const file = `${HOME_DIR}/${name}`;
  if (!entry || !existsSync(file)) {
    check(`${file} is exported and in the manifest (run ${HOME_EXPORT})`, false);
    return null;
  }
  const raw = readFileSync(file);
  const now = sha(raw);
  const crlf = now !== entry.sha256 && sha(raw.toString("utf8").replace(/\r\n/g, "\n")) === entry.sha256;
  check(`${name} is the export's, byte for byte (${now.slice(0, 12)}, the manifest's ${entry.sha256.slice(0, 12)})${crlf ? ": its line ends were rewritten to CRLF; keep data/home/*.json eol=lf in .gitattributes" : ""}`, now === entry.sha256);
  check(`${name} says the day it was exported (${entry.built})`, /^\d{4}-\d{2}-\d{2}$/.test(entry.built ?? ""));
  check(`${name} names the sources it was exported from (${(entry.sources ?? []).map((s) => s.key).join(", ") || "none"})`, Array.isArray(entry.sources) && entry.sources.length > 0);
  const keys = new Set([...UK_SOURCES, ...WORLD_SOURCES].map((s) => s.key));
  for (const s of entry.sources ?? []) {
    if (s.prints) check(`${name}: the source a figure prints from names its publisher on the sources page (${s.key}: ${s.publisher})`, !!s.publisher && keys.has(s.publisher));
    if (existsSync(s.path)) check(`${name}: on this machine its source ${s.key} is the file it was exported from`, sha(readFileSync(s.path)) === s.sha256);
    else console.log(`NOTE  ${name}: its source ${s.key} is not on this machine, so its hash was not read again here`);
  }
  return { data: JSON.parse(raw.toString("utf8")), entry };
}
