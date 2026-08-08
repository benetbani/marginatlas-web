#!/usr/bin/env node
/**
 * density.mjs , is this page drawing, or is it writing?
 *
 * WHY THIS EXISTS, AND WHY IT IS NOT A GATE.
 *
 * Firing 4 measured drawings-per-paragraph across our pages and the ranking
 * came out like this:
 *
 *     /dev/cell2          1.97      he called it "the most beautiful one"
 *     /dev/industry2      1.40
 *     /dev/hood2          0.60      he called it "a failed page, very ugly"
 *     /cities/london      0.36
 *     /world              0.25
 *
 * **It reproduced both of the founder's verdicts without having been told
 * them.** That is the whole value here: a number that predicts his reaction
 * before he sees the page. Everything else in the research notes is advice.
 *
 * IT IS NOT A GATE AND MUST NOT BECOME ONE YET. 1.97 earned praise and 0.60
 * earned "ugly", so the threshold is somewhere between and two data points do
 * not locate it. A gate asserting a number nobody has established is the
 * cries-wolf failure this codebase has already paid for twice: the
 * stated-totals sweep was narrowed after 15 of 16 hits were false, and
 * DESIGN.md once claimed an icon scale of two when it is five. Measure first,
 * gate when the threshold is earned.
 *
 * THE RATIO IS INTERNALLY COMPARABLE ONLY, and this is stated in the output as
 * well as here because it would otherwise be quoted out of context. Our World
 * in Data scores 0 and Trading Economics scores 1, not because they do not
 * draw but because their charts are canvas and iframe embeds rather than
 * inline SVG. Comparing our ratio to theirs is meaningless.
 *
 * WHAT COUNTS AS A DRAWING. An <svg> carrying more than two shape elements. A
 * lone glyph is an icon, not a drawing: it decorates a heading and encodes no
 * value. The threshold of two is deliberately crude and is why this reports a
 * number to a human instead of failing a build.
 *
 * USAGE
 *   node scripts/loop/density.mjs                       the standard set, production
 *   node scripts/loop/density.mjs /world /dev/cell2
 *   node scripts/loop/density.mjs --base http://localhost:3210 /dev/hood2
 */

const argv = process.argv.slice(2);
const flag = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
};

/* Git Bash rewrites any argument starting with a slash into a path under its
   own install directory. Third tool in this folder to need the guard. */
const unmangle = (a) => {
  const m = a.match(/^[A-Za-z]:[\\/](?:Program Files[\\/])?Git[\\/](.*)$/i);
  return m ? "/" + m[1].replace(/\\/g, "/") : a;
};

const BASE = flag("base", "https://www.marginatlas.com");

const DEFAULT = [
  "/world",
  "/industries",
  "/cities/london",
  "/dev/cell2",
  "/dev/industry2",
  "/dev/hood2",
  "/dev/home3",
];

const routes = argv.map(unmangle).filter((a) => a.startsWith("/") && !a.startsWith("--"));
const ROUTES = routes.length ? routes : DEFAULT;

/** The founder's own words, so the output carries its own calibration. */
const VERDICTS = {
  "/dev/cell2": "he called this the most beautiful one",
  "/dev/hood2": "he called this a failed page, very ugly",
  "/dev/industry2": "he called this a failed page",
};

const rows = [];

for (const route of ROUTES) {
  let html;
  try {
    const res = await fetch(BASE + route, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; margin-atlas-density)" },
      signal: AbortSignal.timeout(90_000),
    });
    if (res.status !== 200) {
      rows.push({ route, err: `HTTP ${res.status}` });
      continue;
    }
    html = await res.text();
  } catch (e) {
    rows.push({ route, err: e.message.slice(0, 40) });
    continue;
  }

  /* Scripts carry serialised markup that would double-count. */
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, " ");

  const svg = [...body.matchAll(/<svg[\s\S]*?<\/svg>/gi)].filter(
    (m) => (m[0].match(/<(rect|circle|path|line|polyline|polygon)\b/g) || []).length > 2,
  ).length;

  /* NOT EVERY DRAWING IS AN SVG, and counting only SVG undercounted badly. Half
     this kit draws bars as divs with a percentage width, which is exactly how
     an HTML bar encodes a value. Measured on 2026-08-08: /cities/london went
     from 0.36 to 0.96 once these were counted, and /dev/cell2 from 1.97 to
     2.73.
     The ORDER survived, which is the reassuring part: cell2 stayed first and
     home3 stayed last under both counts, so the founder's two calibration
     points hold either way. But quoting the SVG-only number alone understates
     every page, so both are reported. */
  const divBar = (body.match(/style="[^"]*width:\s*\d+(?:\.\d+)?%/g) || []).length;
  const drawings = svg + divBar;

  const paras = (body.match(/<p\b[^>]*>/gi) || []).length;

  /* Word counts, so a page with few paragraphs but enormous ones is not
     flattered by the ratio alone. */
  const clean = (s) =>
    s.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
  const lens = [...body.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => clean(m[1]).split(/\s+/).filter(Boolean).length)
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  const median = lens.length ? lens[Math.floor(lens.length / 2)] : 0;
  const tiny = lens.filter((n) => n < 8).length;

  rows.push({ route, svg, divBar, drawings, paras, ratio: paras ? drawings / paras : null, median, tiny });
}

console.log(`\ndensity , drawings per paragraph, against ${BASE}\n`);
console.log(
  "route".padEnd(24) +
    "svg".padStart(5) +
    "div".padStart(5) +
    "draw".padStart(6) +
    "paras".padStart(7) +
    "ratio".padStart(8) +
    "median".padStart(8) +
    "<8w".padStart(6),
);
console.log("-".repeat(69));

const scored = rows.filter((r) => r.ratio != null).sort((a, b) => b.ratio - a.ratio);
for (const r of rows) {
  if (r.err) {
    console.log(r.route.padEnd(24) + r.err);
    continue;
  }
  console.log(
    r.route.padEnd(24) +
      String(r.svg).padStart(5) +
      String(r.divBar).padStart(5) +
      String(r.drawings).padStart(6) +
      String(r.paras).padStart(7) +
      (r.ratio == null ? "n/a" : r.ratio.toFixed(2)).padStart(8) +
      String(r.median).padStart(8) +
      String(r.tiny).padStart(6) +
      (VERDICTS[r.route] ? "   , " + VERDICTS[r.route] : ""),
  );
}

if (scored.length > 1) {
  const best = scored[0];
  const worst = scored[scored.length - 1];
  console.log(
    `\n  best  ${best.route} at ${best.ratio.toFixed(2)}` +
      `\n  worst ${worst.route} at ${worst.ratio.toFixed(2)}`,
  );
}

console.log(
  `\n  CALIBRATION. 1.97 earned "the most beautiful one" and 0.60 earned "very` +
    `\n  ugly". The threshold between them is not established, which is why this` +
    `\n  reports and does not fail.` +
    `\n\n  MEDIAN is words per paragraph. Our World in Data runs 18 on an essay page` +
    `\n  and 3 on a reference page. Ours ran 33 everywhere when last measured.` +
    `\n\n  DO NOT COMPARE THIS RATIO TO ANOTHER SITE. OWID scores 0 and Trading` +
    `\n  Economics scores 1, not because they do not draw but because their charts` +
    `\n  are canvas and iframe embeds rather than inline SVG.\n`,
);
