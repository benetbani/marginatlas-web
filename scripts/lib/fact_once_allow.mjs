/**
 * fact_once_allow , THE ALLOWANCES' STATE LOGIC, one module the gate (scripts/harness/check_fact_once.mjs) and its test
 * (tests/spine/fact_once.test.ts) both run (release 3: the rhythm-gates review, Important 1 and Minor 6). Pure: no browser, no file.
 *
 * AN ENTRY MATCHES ONLY IN ITS OWN STATE. An entry of scripts/harness/fact_once_allow.json with no `state` allows its repeat in every
 * render. An entry with `state` ("fallback", a page drawn from the adapters' fallbacks, or "live", none fell back) allows its repeat only
 * when the page's render is in that state, read from the state file pages-fresh writes; a stated entry whose page has no readable state
 * matches nothing, so the repeat it names reds. Before this, the state only decided whether an unused entry was required to match, and a
 * state-bound entry still silenced the same repeat in the other state.
 * BLIND SPOT: the state is a count of the query ledger's fallback lines while the page rendered (render_page.tsx, verify_pages_fresh.mjs),
 * so it cannot tell which query fell back, and withBudget logs on timeout only, so a fast-failing query reads "live".
 */
export const STATES = ["fallback", "live"];

/** The state of one page's render, or null when the state file is missing or holds none for it. */
export function stateOf(renderState, page) {
  const s = renderState && renderState[page] ? renderState[page].state : undefined;
  return typeof s === "string" ? s : null;
}

/** The index of the entry that allows this repeat on this page in the page's state, or -1. */
export function allowedBy(allow, page, x, renderState) {
  const now = stateOf(renderState, page);
  return allow.findIndex((e) => e.page === page && e.figure === x.figure && e.where === x.where && (e.state === undefined || (now !== null && e.state === now)));
}

/**
 * Every entry judged after the reads: `stale`, the entries that are a red (an unknown state, a page the list does not hold, a stated entry
 * with no state to read, an entry that matched nothing in its own state), and `notThisState`, the stated entries this render is not in
 * (printed, not required). `used` holds the indexes allowedBy returned; `read` the pages whose render was read; `listed` the list's pages.
 */
export function judgeAllowances(allow, { listed, read, used, renderState, stateFile, listFile, allowFile, widths }) {
  const stale = [];
  const notThisState = [];
  allow.forEach((e, i) => {
    const at = `${allowFile} entry ${i + 1} (${e.page}, "${e.figure}" in ${e.where})`;
    if (e.state !== undefined && !STATES.includes(e.state)) { stale.push({ at, detail: `its state "${e.state}" is none of ${STATES.join(", ")}` }); return; }
    if (!listed.has(e.page)) { stale.push({ at, detail: `names a page ${listFile} does not hold, so no render can match it` }); return; }
    if (!read.has(e.page)) return;
    if (e.state) {
      if (!renderState) { stale.push({ at, detail: `is bound to the "${e.state}" state and ${stateFile} is missing or stale, so the state of the render is unknown` }); return; }
      const now = stateOf(renderState, e.page);
      if (!now) { stale.push({ at, detail: `is bound to the "${e.state}" state and ${stateFile} holds no state for ${e.page}` }); return; }
      if (now !== e.state) { notThisState.push(`entry ${i + 1} (${e.page}, ${e.where}) holds in the ${e.state} state; this render is ${now}`); return; }
    }
    if (!used.has(i)) stale.push({ at, detail: `matched no repeat on ${e.page} at ${widths.join(" or ")}${e.state ? ` in its own state (${e.state})` : ""}: the page no longer prints it, so the allowance is a standing permission` });
  });
  return { stale, notThisState };
}
