#!/usr/bin/env node
// apply_verdicts.mjs
// Applies a founder verdict string (from the review sheet's Copy button) to the design registries.
//
// Usage:
//   node apply_verdicts.mjs "<verdict-string>" [--date YYYY-MM-DD]
//
// Verdict string grammar:
//   string  := entry (";" entry)*
//   entry   := <page> ":" <NN> "=" <verdict>
//   verdict := "A" | "R" | "R(" <reason> ")"
//   page    := registry file basename in E:/atlas/design/registry/ (e.g. "city" -> city.json)
//   NN      := zero-padded section index (2 digits; more accepted if index > 99)
//   reason  := free text, no ";" (the sheet sanitizes ";" -> "," and parens -> brackets)
//
// Effects:
//   A -> state "approved", cropApprovedHash = cropHash, verdicts += {date, verdict:"A"}
//   R -> state "rejected", verdicts += {date, verdict:"R", reason?}
//   Every applied R is also appended to E:/atlas/rules/FOUNDER-VERDICTS.md
//   under a "## Sheet verdicts <date>" heading.
//   Unknown pages or section indexes warn and are skipped.

import fs from "node:fs";
import path from "node:path";

const REGISTRY_DIR = "E:/atlas/design/registry";
const VERDICTS_MD = "E:/atlas/rules/FOUNDER-VERDICTS.md";

const TOP_ORDER = ["page", "route", "updated", "sections"];
const SECTION_ORDER = ["id", "index", "heading", "state", "crop", "cropHash", "cropApprovedHash", "verdicts", "stale"];
const VERDICT_ORDER = ["date", "verdict", "reason"];

const ENTRY_RE = /^([A-Za-z0-9_-]+):(\d{2,})=(A|R)(?:\((.*)\))?$/;

function localDate() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function parseArgs(argv) {
  let verdictString = null;
  let date = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--date") {
      date = argv[++i];
    } else if (a.startsWith("--date=")) {
      date = a.slice("--date=".length);
    } else if (a.startsWith("--")) {
      console.warn(`[warn] unknown flag ${a}, ignored`);
    } else if (verdictString === null) {
      verdictString = a;
    } else {
      console.warn(`[warn] extra positional argument ignored: ${a}`);
    }
  }
  if (!verdictString || !verdictString.trim()) {
    console.error('Usage: node apply_verdicts.mjs "<verdict-string>" [--date YYYY-MM-DD]');
    console.error("       e.g. node apply_verdicts.mjs \"city:03=A;city:05=R(too wordy);hood:02=A\"");
    process.exit(1);
  }
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error(`[error] --date must be YYYY-MM-DD, got: ${date}`);
    process.exit(1);
  }
  return { verdictString: verdictString.trim(), date: date || localDate() };
}

function orderKeys(obj, preferred) {
  const out = {};
  for (const k of preferred) if (k in obj) out[k] = obj[k];
  for (const k of Object.keys(obj)) if (!(k in out)) out[k] = obj[k];
  return out;
}

function normalizeRegistry(reg) {
  const r = orderKeys(reg, TOP_ORDER);
  if (Array.isArray(r.sections)) {
    r.sections = r.sections.map((s) => {
      const sec = orderKeys(s, SECTION_ORDER);
      if (Array.isArray(sec.verdicts)) {
        sec.verdicts = sec.verdicts.map((v) => orderKeys(v, VERDICT_ORDER));
      }
      return sec;
    });
  }
  return r;
}

function loadRegistry(cache, page) {
  if (page in cache) return cache[page];
  const file = path.join(REGISTRY_DIR, `${page}.json`);
  if (!fs.existsSync(file)) {
    console.warn(`[warn] unknown page "${page}": registry not found at ${file}`);
    cache[page] = null;
    return null;
  }
  try {
    const reg = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(reg.sections)) {
      console.warn(`[warn] registry has no sections array, skipping page: ${file}`);
      cache[page] = null;
      return null;
    }
    cache[page] = { file, reg, dirty: false };
  } catch (e) {
    console.warn(`[warn] registry unreadable (${e.message}), skipping page: ${file}`);
    cache[page] = null;
  }
  return cache[page];
}

function findSection(reg, nnStr) {
  return reg.sections.find((s) => String(s.index ?? "").padStart(2, "0") === nnStr.padStart(2, "0"));
}

function appendToVerdictsMd(lines, date) {
  if (lines.length === 0) return false;
  const heading = `## Sheet verdicts ${date}`;
  fs.mkdirSync(path.dirname(VERDICTS_MD), { recursive: true });
  let content = "";
  if (fs.existsSync(VERDICTS_MD)) {
    content = fs.readFileSync(VERDICTS_MD, "utf8");
  } else {
    console.warn(`[warn] ${VERDICTS_MD} did not exist, creating it`);
    content = "# Founder verdicts\n";
  }
  const headingIdx = content.indexOf(heading);
  const block = lines.join("\n") + "\n";
  if (headingIdx !== -1) {
    // Heading already exists (earlier run, same date): insert right under it,
    // past any blank lines that follow the heading.
    const lineEnd = content.indexOf("\n", headingIdx);
    let insertAt = lineEnd === -1 ? content.length : lineEnd + 1;
    while (content.startsWith("\n", insertAt)) insertAt++;
    content = content.slice(0, insertAt) + block + content.slice(insertAt);
  } else {
    if (!content.endsWith("\n")) content += "\n";
    content += `\n${heading}\n\n${block}`;
  }
  fs.writeFileSync(VERDICTS_MD, content);
  return true;
}

function main() {
  const { verdictString, date } = parseArgs(process.argv.slice(2));

  const entries = verdictString
    .split(";")
    .map((e) => e.trim())
    .filter(Boolean);

  if (entries.length === 0) {
    console.error("[error] verdict string contained no entries");
    process.exit(1);
  }

  const cache = {};
  const rejectLines = [];
  let approved = 0;
  let rejected = 0;
  let unknown = 0;

  for (const entry of entries) {
    const m = ENTRY_RE.exec(entry);
    if (!m) {
      console.warn(`[warn] malformed entry, skipped: "${entry}"`);
      unknown++;
      continue;
    }
    const [, page, nnStr, verdict, rawReason] = m;
    if (verdict === "A" && rawReason !== undefined) {
      console.warn(`[warn] reason on an A verdict ignored: "${entry}"`);
    }

    const loaded = loadRegistry(cache, page);
    if (!loaded) {
      unknown++;
      continue;
    }
    const section = findSection(loaded.reg, nnStr);
    if (!section) {
      console.warn(`[warn] unknown section ${page}:${nnStr}, skipped`);
      unknown++;
      continue;
    }

    if (!Array.isArray(section.verdicts)) section.verdicts = [];

    if (verdict === "A") {
      section.state = "approved";
      if (section.cropHash === undefined) {
        console.warn(`[warn] ${section.id}: approved but registry has no cropHash to lock`);
      }
      section.cropApprovedHash = section.cropHash;
      section.verdicts.push({ date, verdict: "A" });
      approved++;
    } else {
      const reason = rawReason !== undefined ? rawReason.trim() : "";
      section.state = "rejected";
      const record = { date, verdict: "R" };
      if (reason) record.reason = reason;
      section.verdicts.push(record);
      rejected++;
      rejectLines.push(
        reason
          ? `- ${section.id}: "${reason}" (sheet, ${date})`
          : `- ${section.id}: rejected, no reason given (sheet, ${date})`
      );
    }
    loaded.dirty = true;
  }

  for (const page of Object.keys(cache)) {
    const loaded = cache[page];
    if (!loaded || !loaded.dirty) continue;
    const out = JSON.stringify(normalizeRegistry(loaded.reg), null, 2) + "\n";
    fs.writeFileSync(loaded.file, out);
    console.log(`[ok] wrote ${loaded.file}`);
  }

  if (appendToVerdictsMd(rejectLines, date)) {
    console.log(`[ok] appended ${rejectLines.length} rejection${rejectLines.length === 1 ? "" : "s"} to ${VERDICTS_MD}`);
  }

  console.log("");
  console.log(`verdict summary (${date})`);
  console.log(`  approved  ${approved}`);
  console.log(`  rejected  ${rejected}`);
  console.log(`  unknown   ${unknown}`);

  if (approved + rejected === 0) {
    console.error("[error] no verdicts were applied");
    process.exit(1);
  }
}

main();
