/**
 * scripts/lib/page_renders.mjs , THE ONE LIST OF THE RENDERS THE BROWSER GATES
 * READ (plan-2026-09-17/02-ERRORS.md, step 14b, first half).
 *
 * WHY. Nine of the chain's browser gates (full-width-sitewide, form-variety,
 * frost-reads, flag-marks, gathered-emptiness, no-phone-sideways,
 * radius-uniform, section-bands, art-direction) each carried their own list of
 * HTML files under docs/loop/artifacts/final-pages/, renders frozen on
 * 2026-09-08. A gate that reads a snapshot reports the snapshot, confidently,
 * on every deploy: no browser rule saw the source being deployed. Now the six
 * spine pages come FRESH from scripts/harness/render_page.tsx (the real
 * adapters and views, into scratchpad/harness/pages/, written by the
 * `pages-fresh` gate at the head of the chain, scripts/verify_pages_fresh.mjs),
 * and only the two legacy pages the harness cannot render stay frozen. Every
 * gate prints describeRenders() so its output says what it measured and how
 * old that was.
 *
 * THE ENTRIES.
 *   fresh   the six surfaces of scripts/harness/pages.json, read from that file
 *           so this list cannot drift from the harness's own. The path is
 *           scratchpad/harness/pages/<surface>-<slugs>.html, the harness's stem
 *           (country-GB, howto-GB, city-london, cell-gb-london-restaurants,
 *           industry-restaurants, hood-london).
 *   frozen  home and countries-list, docs/loop/artifacts/final-pages/, the
 *           render of 2026-09-08 (FROZEN_DATE, a literal on purpose: the file's
 *           mtime is whatever the checkout gave it). Legacy pages the harness
 *           cannot render; the home page is plan step 37's subject.
 *
 * RETIRED FROM EVERY GATE: final-pages/country-gb.html (the legacy country
 * page) and final-pages/country-gb-new.html (a fixture of the rebuild, edited
 * by hand since it was captured). Production serves the spine country page
 * (the deploy watcher read data-archetype="city-cards" on marginatlas.com/gb
 * on 2026-09-17), and the harness's country-GB.html IS that page, drawn from
 * the same source. The files stay on disk for the non-gate tools that still
 * open them (crop_sections, build_page_sheet, the walk strip); no gate does.
 *
 * THE BASELINE KEYS. Six gates keep a per-page ratchet keyed by the surface
 * name the gate used before this module (scripts/fullwidth_baseline.json,
 * flags_baseline.json, radius_baseline.json, section_bands_baseline.json,
 * art_direction_baseline.json, gathered_emptiness_baseline.json). Those keys
 * are KEPT AS THEY WERE, and `key` on each entry is the old name wherever one
 * existed, so a stored number keeps its meaning without a rewrite:
 *   country-GB                 -> country-gb-new   the rebuild's own key, which
 *                                                   held no allowance anywhere
 *                                                   (budget 0), never the legacy
 *                                                   country-gb's numbers
 *   cell-gb-london-restaurants -> cell-london-restaurants
 *   city-london, industry-restaurants, hood-london, home, countries-list: the same
 *   howto-GB                   -> howto-GB         never in a gate before; no
 *                                                   stored number, so budget 0
 * A gate keys its `now` by entry.key and prints entry.name (with the key beside
 * it when the two differ), so a reader of its output sees both.
 *
 * WHAT THIS CANNOT TELL: whether a fresh render was drawn from live rows or
 * from the adapters' fallbacks. That is stated, with what is measured about
 * it, in verify_pages_fresh.mjs's header.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

export const FRESH_DIR = "scratchpad/harness/pages";
export const FROZEN_DIR = "docs/loop/artifacts/final-pages";
/** The day the frozen renders were captured; a literal, because it is a fact about the files, not about the checkout. */
export const FROZEN_DATE = "2026-09-08";
export const HARNESS_LIST = "scripts/harness/pages.json";

/** Harness stem -> the key a gate's baseline was written under before this module. */
export const BASELINE_KEYS = {
  "country-GB": "country-gb-new",
  "cell-gb-london-restaurants": "cell-london-restaurants",
};

/** The old surface names the gates used -> the harness stem that now carries them. */
export const OLD_NAMES = {
  "city-london": "city-london",
  "hood-london": "hood-london",
  "cell-london-restaurants": "cell-gb-london-restaurants",
  "industry-restaurants": "industry-restaurants",
  "country-gb-new": "country-GB",
};

/** Fixtures no gate reads any more, named so a reader of a baseline knows why their keys are gone. */
export const RETIRED = ["country-gb", "country-gb-new"];

/** The two legacy pages, frozen. */
const FROZEN = ["home", "countries-list"];

/**
 * One entry per render the gates read, with its file's state at the moment of
 * the call: `exists`, `mtime` (a Date, or null), `bytes`.
 *
 * @param {{ kinds?: Array<"fresh" | "frozen"> }} [opts]  which kinds to return; both by default
 * @returns {Array<{ name: string, key: string, kind: "fresh" | "frozen", path: string,
 *   surface?: string, slugs?: string[], date?: string, exists: boolean, mtime: Date | null, bytes: number }>}
 */
export function pageRenders({ kinds = ["fresh", "frozen"] } = {}) {
  const out = [];
  if (kinds.includes("fresh")) {
    const list = JSON.parse(readFileSync(HARNESS_LIST, "utf8")).pages;
    for (const p of list) {
      const name = `${p.surface}-${p.slugs.join("-")}`;
      out.push(withFileState({ name, key: BASELINE_KEYS[name] ?? name, kind: "fresh", path: `${FRESH_DIR}/${name}.html`, surface: p.surface, slugs: p.slugs }));
    }
  }
  if (kinds.includes("frozen")) {
    for (const name of FROZEN) {
      out.push(withFileState({ name, key: name, kind: "frozen", path: `${FROZEN_DIR}/${name}.html`, date: FROZEN_DATE }));
    }
  }
  return out;
}

/** The same shape for a page handed in by a gate's `--pages name=path` override, so describeRenders can say so. */
export function givenRenders(pairs) {
  return pairs.map(([name, path]) => withFileState({ name, key: name, kind: "given", path }));
}

function withFileState(entry) {
  const abs = resolve(entry.path);
  if (!existsSync(abs)) return { ...entry, exists: false, mtime: null, bytes: 0 };
  const st = statSync(abs);
  return { ...entry, exists: true, mtime: st.mtime, bytes: st.size };
}

/** `name` with the baseline key beside it when the two differ, for a gate's per-page line. */
export function nameWithKey(entry) {
  return entry.key === entry.name ? entry.name : `${entry.name} (baseline key ${entry.key})`;
}

/** The red line for a render a gate could not open, one shape for every gate. */
export function missingLine(gate, entry) {
  return entry.kind === "fresh"
    ? `x ${gate} ${entry.path}: no fresh render of ${entry.name} (the pages-fresh gate writes it; read its output). Remedy: run npx tsx scripts/verify_pages_fresh.mjs and fix what it names`
    : `x ${gate} ${entry.path}: no ${entry.kind === "frozen" ? `frozen render of ${entry.name}` : `page ${entry.name}`} at that path. Remedy: ${entry.kind === "frozen" ? "restore the file from git" : "check the --pages path"}`;
}

/**
 * The one line every gate prints, so a reader of its output knows what it
 * measured: `reads 6 fresh renders (oldest 3 min) and 2 frozen renders of
 * 2026-09-08`. A fresh render that is missing is named, never folded into the
 * count. Pass the gate's name to lead the line with it.
 */
export function describeRenders(entries, gate = null) {
  const parts = [];
  const fresh = entries.filter((e) => e.kind === "fresh");
  if (fresh.length) {
    const present = fresh.filter((e) => e.exists);
    const missing = fresh.filter((e) => !e.exists).map((e) => e.name);
    const oldest = present.length ? Math.max(...present.map((e) => Date.now() - e.mtime.getTime())) : null;
    const age = oldest === null ? "none present" : `oldest ${ageWords(oldest)}`;
    const count = missing.length ? `${present.length} of ${fresh.length}` : `${fresh.length}`;
    parts.push(`${count} fresh render${fresh.length === 1 ? "" : "s"} (${age}${missing.length ? `; MISSING: ${missing.join(", ")}` : ""})`);
  }
  const frozen = entries.filter((e) => e.kind === "frozen");
  if (frozen.length) {
    const missing = frozen.filter((e) => !e.exists).map((e) => e.name);
    parts.push(`${frozen.length} frozen render${frozen.length === 1 ? "" : "s"} of ${FROZEN_DATE}${missing.length ? ` (MISSING: ${missing.join(", ")})` : ""}`);
  }
  const given = entries.filter((e) => e.kind === "given");
  if (given.length) parts.push(`${given.length} page${given.length === 1 ? "" : "s"} given by --pages (${given.map((e) => e.name).join(", ")})`);
  const line = `reads ${parts.length ? parts.join(" and ") : "no renders"}`;
  return gate ? `${gate} ${line}` : line;
}

function ageWords(ms) {
  const min = Math.floor(ms / 60000);
  if (min < 1) return "under 1 min";
  if (min < 180) return `${min} min`;
  const h = Math.floor(min / 60);
  return h < 48 ? `${h} h` : `${Math.floor(h / 24)} days`;
}
