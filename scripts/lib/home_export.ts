/**
 * scripts/lib/home_export.ts , THE HOME'S EXPORTS ARE THEIR SOURCES' (plan 2026-10-08, home sections).
 *
 * data/home/ holds slices of files on disk outside this repo, written by scripts/data/home/export_home.py with a manifest of each
 * file's SHA-256, its rows, the day it ran and every source it read (path, bytes, SHA-256, the publisher's key on the sources page,
 * whether a figure prints from it). Each section's gate (tests/home/<section>.test.ts) holds its file here:
 *   - the manifest is readable JSON that lists files, hashes every .json in data/home and names none that is missing, so a file
 *     nothing hashes cannot sit there;
 *   - the file is the export's byte for byte, so a figure edited by hand fails the chain (a CRLF checkout is named as such);
 *   - every source a figure prints from names its publisher's entry in src/lib/spine/uk_sources.ts (UK_SOURCES or WORLD_SOURCES);
 *   - on the machine that holds the sources, each is hashed again, so a source changed since the export fails until it runs again.
 * It reads this repo, and a source only where it exists (existsSync), which a build server never has. A source it could not hash
 * again is DEFERRED, never passed: the holder returns its key (`deferred`), and the gate ends on homePassLine(), whose last line
 * reads "<gate>: all pass, N deferred (<keys>: source not on this machine)". The chain's runner counts that "N deferred" off the
 * last twenty lines a gate prints (scripts/prebuild_all.ts), so the skip shows in its summary, and nothing may print after it.
 *
 * Every finding goes through the gate's `check(label, ok, at?)`. `at` is optional and says where a finding is and what to do about
 * it when that is not the gate's own file and remedy: the manifest, a stray or a missing file, the sources page, the line ends.
 * A gate that passes none (or whose check takes two arguments) keeps its own file and remedy for every finding.
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
/** The module that names every publisher; a source's `publisher` is a key in it. */
export const HOME_SOURCES_PAGE = "src/lib/spine/uk_sources.ts";

export type HomeSource = { key: string; path: string; bytes: number; sha256: string; publisher: string | null; title: string; prints: boolean };
export type HomeEntry = { sha256: string; rows: number; built: string; sources: HomeSource[] };
/** Where a finding is and what to do about it, when that is not the gate's own file and remedy. */
export type HomeAt = { file?: string; remedy?: string };
/** The gate's `check`: a PASS line, or a red with the gate's rule, and `at` or else the gate's file and remedy. */
export type HomeCheck = (label: string, ok: boolean, at?: HomeAt) => void;
/** A slice held: its parsed body, its manifest entry, and the keys of the sources this machine does not hold (their hashes were not read again). */
export type HomeHeld = { data: unknown; entry: HomeEntry; deferred: string[] };

const sha = (b: Buffer | string) => createHash("sha256").update(b).digest("hex");
/** A file's SHA-256, or null where it cannot be read as a file. */
const hashOf = (path: string): string | null => {
  try {
    return sha(readFileSync(path));
  } catch {
    return null;
  }
};

/** The slice `name` held to the manifest and its sources, each finding through `check`; its parsed body, its manifest entry and the keys it deferred. */
export function holdHomeExport(name: string, check: HomeCheck): HomeHeld | null {
  /* THE MANIFEST: there, JSON, and listing files. A missing, cut-off or emptied one is a red with its remedy, never a stack. */
  const manifestAt: HomeAt = { file: HOME_MANIFEST, remedy: `git checkout -- ${HOME_MANIFEST}, or re-run ${HOME_EXPORT}` };
  let files: Record<string, HomeEntry> | null = null;
  let damage = "is missing";
  if (existsSync(HOME_MANIFEST)) {
    try {
      const m = JSON.parse(readFileSync(HOME_MANIFEST, "utf8")) as { files?: unknown } | null;
      if (m && typeof m.files === "object" && m.files !== null && !Array.isArray(m.files)) files = m.files as Record<string, HomeEntry>;
      else damage = "holds no list of files";
    } catch {
      damage = "cannot be read as JSON";
    }
  }
  if (!files) {
    check(`${HOME_MANIFEST} ${damage}`, false, manifestAt);
    return null;
  }
  const listed = Object.keys(files).sort();
  const onDisk = readdirSync(HOME_DIR).filter((f) => f.endsWith(".json") && f !== "manifest.json").sort();
  const unlisted = onDisk.filter((f) => !listed.includes(f));
  const lacking = listed.filter((f) => !onDisk.includes(f));
  if (unlisted.length === 0 && lacking.length === 0) check(`the manifest hashes every file in ${HOME_DIR} and names none that is missing (listed ${listed.join(", ") || "none"}; on disk ${onDisk.join(", ") || "none"})`, true);
  for (const f of unlisted) check(`${HOME_DIR}/${f} sits in ${HOME_DIR} and the manifest does not list it`, false, { file: `${HOME_DIR}/${f}`, remedy: "delete it, or add it to the export" });
  for (const f of lacking) check(`the manifest lists ${f} and ${HOME_DIR} does not hold it`, false, { file: `${HOME_DIR}/${f}`, remedy: `re-run ${HOME_EXPORT} ${f.replace(/\.json$/, "")}` });

  /* THE SLICE: listed, there, readable, and the export's byte for byte. */
  const entry = files[name];
  const file = `${HOME_DIR}/${name}`;
  if (!entry || typeof entry !== "object" || !existsSync(file)) {
    check(`${file} is exported and in the manifest`, false);
    return null;
  }
  let raw: Buffer;
  try {
    raw = readFileSync(file);
  } catch {
    check(`${file} cannot be read as a file`, false);
    return null;
  }
  const now = sha(raw);
  const want = typeof entry.sha256 === "string" ? entry.sha256 : "";
  const same = now === want;
  const crlf = !same && sha(raw.toString("utf8").replace(/\r\n/g, "\n")) === want;
  check(`${name} is the export's, byte for byte (${now.slice(0, 12)}, the manifest's ${want.slice(0, 12)})${crlf ? ": its line ends were rewritten to CRLF" : ""}`, same, crlf ? { file, remedy: "check out data/home/*.json with LF: .gitattributes pins it" } : undefined);
  check(`${name} says the day it was exported (${entry.built})`, /^\d{4}-\d{2}-\d{2}$/.test(typeof entry.built === "string" ? entry.built : ""));
  const sources = Array.isArray(entry.sources) ? entry.sources : [];
  const named = sources.length > 0 && sources.every((s) => !!s && typeof s.key === "string" && typeof s.path === "string" && typeof s.sha256 === "string");
  check(`${name} names the sources it was exported from (${named ? sources.map((s) => s.key).join(", ") : "none"})`, named);

  /* THE SOURCES: the publisher of each a figure prints from is on the sources page; each is hashed again where this machine holds it. */
  const keys = new Set([...UK_SOURCES, ...WORLD_SOURCES].map((s) => s.key));
  const deferred: string[] = [];
  for (const s of named ? sources : []) {
    if (s.prints) check(`${name}: the source a figure prints from names its publisher on the sources page (${s.key}: ${s.publisher})`, !!s.publisher && keys.has(s.publisher), { file: HOME_SOURCES_PAGE, remedy: "add the source to WORLD_SOURCES or fix the key in export_home.py" });
    if (existsSync(s.path)) check(`${name}: on this machine its source ${s.key} is the file it was exported from`, hashOf(s.path) === s.sha256);
    else {
      deferred.push(s.key);
      console.log(`DEFER ${name}: its source ${s.key} is not on this machine, so its hash was not read again here`);
    }
  }
  let data: unknown;
  try {
    data = JSON.parse(raw.toString("utf8"));
  } catch {
    check(`${file} cannot be read as JSON`, false);
    return null;
  }
  return { data, entry, deferred };
}

/** A gate's last line. When `held` deferred any source it says so as "N deferred (<keys>: source not on this machine)", the form the runner counts. */
export function homePassLine(gate: string, held: HomeHeld | null): string {
  const keys = held?.deferred ?? [];
  return keys.length > 0 ? `${gate}: all pass, ${keys.length} deferred (${keys.join(", ")}: source not on this machine)` : `${gate}: all pass`;
}
