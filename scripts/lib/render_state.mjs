/**
 * render_state , THE RENDERS' STATE FILE, READ AND CHECKED FRESH (release 3: the rhythm-gates review's Minor 3 and the held-bill re-review's
 * M-2, the controller's ruling e). scripts/verify_pages_fresh.mjs writes `render_state.json` beside the renders: when its run started, when
 * it wrote the file, the run's fallback count, and each page's state. Two gates read it (fact-once, held-bill's D). A gate run on its own
 * after a later render, or after a render of only some pages, would read a state that describes other renders; so:
 *  - MISSING: no file, or a file with no `started`, `written` or `pages`, is a fault;
 *  - STALE: a render the gate reads that was written after the file (redrawn since), or before the run that wrote the file started (not
 *    drawn by it), is a fault, and so is a render the file names no state for.
 * BLIND SPOT: mtimes on one machine's clock; a render copied in with its mtime kept would read as drawn by the run it falls inside.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/** Clock slack between a write and the file system's mtime, in milliseconds. */
const SLACK = 1000;

/**
 * Read `<dir>/render_state.json` and check it against the renders named (stems under `dir`, `<name>.html`; a render that does not exist
 * is skipped, the gates red a missing render themselves). Returns the parsed file (or null) and the faults, each a sentence.
 */
export function readRenderState(dir, names) {
  const file = join(dir, "render_state.json");
  if (!existsSync(file)) return { file, state: null, faults: [`${file} does not exist, so the state of the renders is unknown (pages-fresh writes it)`] };
  let state;
  try { state = JSON.parse(readFileSync(file, "utf8")); } catch (e) { return { file, state: null, faults: [`${file} does not parse: ${String(e)}`] }; }
  const started = Date.parse(state && state.started);
  const written = Date.parse(state && state.written);
  if (!Number.isFinite(started) || !Number.isFinite(written) || !state.pages || typeof state.pages !== "object") return { file, state: null, faults: [`${file} holds no started, written or pages, so it cannot be checked against the renders`] };
  const faults = [];
  for (const name of names) {
    const p = join(dir, `${name}.html`);
    if (!existsSync(p)) continue;
    const m = statSync(p).mtimeMs;
    if (m > written + SLACK) faults.push(`${name}.html was written at ${new Date(m).toISOString()}, after ${file} (${state.written}): the state describes an earlier render`);
    else if (m < started - SLACK) faults.push(`${name}.html was written at ${new Date(m).toISOString()}, before the run that wrote ${file} started (${state.started}): that run did not draw it`);
    else if (!state.pages[name]) faults.push(`${file} holds no state for ${name}`);
  }
  return { file, state, faults };
}
