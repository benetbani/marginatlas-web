/**
 * THE PAGE'S BLOCK COUNT WITHOUT A BROWSER (milestone 1, M10): the model laws' BLOCK FLOOR counts `[data-block]` elements not
 * inside another `[data-block]`, visible at the width (scripts/harness/check_model_laws.mjs); this counts the same elements in a
 * static render. Measured equal on the nine harness renders and seven more on 2026-10-04 (country GB 25, AF 15, FR 15; howto GB 7,
 * DE 7; city London 16, Manchester 15, Frankfurt 15; cells 15, 17, 16, 13; industries 11, 11; hoods 4, 4).
 *
 * ITS BLIND SPOT: a block hidden at every width by its stylesheet still counts here (the browser rule would drop it); none of the
 * sixteen measured pages holds one. The floor census and its freshness gate both use this one function, so they cannot disagree.
 */
import { JSDOM } from "jsdom";

export function countTopBlocks(html) {
  const doc = new JSDOM(String(html).replace(/<style[^>]*>[\s\S]*?<\/style>/g, "")).window.document;
  return [...doc.querySelectorAll("[data-block]")].filter((el) => !el.parentElement?.closest("[data-block]")).length;
}

/** The floor per page type, read off the model laws' own table (one source; importing that script would run it). */
export function floorsFromLaws(lawsSource) {
  const m = String(lawsSource).match(/const FLOOR_BY_SURFACE = \{([^}]*)\}/);
  if (!m) throw new Error("FLOOR_BY_SURFACE not found in the model laws");
  return Object.fromEntries(m[1].split(",").map((p) => p.split(":").map((x) => x.trim())).filter((kv) => kv.length === 2).map(([k, v]) => [k, Number(v)]));
}
