#!/usr/bin/env node
/**
 * build_compare , one self-contained HTML file showing before against after.
 *
 * WHY IT EXISTS. The founder's chosen review format, ratified in the 2026-08-21
 * interview: "one file I open, before and after, full length, desktop and phone
 * width." He does not want a dev server and has said so repeatedly. He opens a
 * file; there is nothing to install and nothing to log into.
 *
 * WHY THE IMAGES ARE EMBEDDED rather than linked. A file that references
 * ./shots/a.jpeg is a file that shows broken images the moment it is moved,
 * copied to a phone, or sent anywhere. Embedding costs about a third in size
 * (base64) and buys a document that works everywhere, forever, with no server.
 *
 * WHAT IT DOES NOT DO. It does not render, screenshot, or measure. Those are
 * three other instruments, and mixing them is how a review tool starts
 * reporting verdicts it cannot see. It takes two directories of images whose
 * filenames match, and pairs them.
 *
 * Usage:
 *   node scripts/build_compare.mjs <beforeDir> <afterDir> <outFile> "<title>"
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * @param {{title: string, pairs: Array<{label: string, before: string, after: string}>}} input
 *   `before` and `after` are base64 JPEG payloads, not paths.
 * @returns {string} a complete HTML document
 */
export function buildCompareHtml({ title, pairs }) {
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const rows = pairs
    .map(
      (p) => `<div class="pair">
      <h2>${esc(p.label)}</h2>
      <div class="cols">
        <figure><figcaption>Before</figcaption><img alt="before, ${esc(p.label)}" src="data:image/jpeg;base64,${p.before}"></figure>
        <figure><figcaption>After</figcaption><img alt="after, ${esc(p.label)}" src="data:image/jpeg;base64,${p.after}"></figure>
      </div>
    </div>`,
    )
    .join("\n");

  /* The chrome is deliberately plain and is NOT the site's design system. This
     document is an instrument the founder reads, not a page of the product, and
     dressing it in the product's own styling would make it harder to tell which
     pixels are the thing being judged. */
  return `<!doctype html><meta charset="utf-8"><title>${esc(title)}</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  :root{color-scheme:light}
  body{margin:0;background:#f7f7f8;color:#161616;
       font:14px/1.5 ui-sans-serif,system-ui,-apple-system,sans-serif}
  header{position:sticky;top:0;background:#fff;border-bottom:1px solid #e3e3e3;
         padding:14px 20px;font-weight:600;letter-spacing:-.01em;z-index:2}
  .pair{padding:20px}
  .pair h2{font-size:15px;font-weight:600;margin:0 0 10px;letter-spacing:-.01em}
  .cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}
  figure{margin:0;background:#fff;border:1px solid #e3e3e3;border-radius:8px;overflow:hidden}
  figcaption{padding:7px 10px;font-size:11px;font-weight:600;letter-spacing:.1em;
             text-transform:uppercase;color:#6b6b6b;border-bottom:1px solid #e3e3e3}
  img{display:block;width:100%;height:auto}
  @media(max-width:900px){.cols{grid-template-columns:1fr}}
</style>
<header>${esc(title)}</header>
${rows}
`;
}

const isMain =
  process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("scripts/build_compare.mjs");

if (isMain) {
  const [beforeDir, afterDir, outFile, title = "before / after"] = process.argv.slice(2);
  if (!beforeDir || !afterDir || !outFile) {
    console.error('usage: node scripts/build_compare.mjs <beforeDir> <afterDir> <outFile> "<title>"');
    process.exit(2);
  }
  const b64 = (p) => readFileSync(p).toString("base64");
  const names = readdirSync(beforeDir).filter((f) => /\.jpe?g$/i.test(f)).sort();

  /* A missing AFTER is a hard error, not a skipped row. Silently dropping a
     pair produces a review document that looks complete and is not, which is
     the exact failure mode this project keeps paying for. */
  const missing = names.filter((n) => !existsSync(join(afterDir, n)));
  if (missing.length) {
    console.error("no AFTER shot for: " + missing.join(", "));
    process.exit(1);
  }

  const pairs = names.map((n) => ({
    label: n.replace(/\.jpe?g$/i, "").replace(/^(BEFORE|AFTER)-/i, ""),
    before: b64(join(beforeDir, n)),
    after: b64(join(afterDir, n)),
  }));
  writeFileSync(outFile, buildCompareHtml({ title, pairs }));
  console.log("wrote " + outFile + "  (" + pairs.length + " pairs)");
}
