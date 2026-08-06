/**
 * scripts/audit_lexicon.mjs , which words the site repeats, and how often.
 *
 * READ-ONLY. It changes nothing. It counts.
 *
 * WHY IT EXISTS. The founder's note was "words that are repeated through the
 * site". Repetition is not automatically a fault: a benchmark site earns trust
 * partly by naming the same thing the same way on every page, so the tier
 * vocabulary and the provenance line SHOULD be identical everywhere. What is a
 * fault is the same sentence shape reached for out of habit. Those two look
 * alike from a distance and only separate once you can see the counts, so this
 * counts first and judges nothing. The judgement lives in design/loop4/LEXICON.md.
 *
 * WHY IT PARSES RATHER THAN GREPS. A grep over these files reports mostly
 * comments: this codebase writes long reasoning headers, and "every figure"
 * greps 13 times of which fewer than half are copy a reader ever sees. So the
 * file goes through the TypeScript parser and only nodes that reach the screen
 * are read. Comments are trivia and never enter the AST, which removes the
 * largest source of noise for free.
 *
 * WHAT COUNTS AS USER-FACING:
 *   - JSX text, flattened per block element so that a sentence broken by
 *     <b> or <a> is still counted as one sentence, and a heading immediately
 *     followed by a paragraph is not glued into a phrase nobody wrote.
 *   - String literals that render: prop values, object fields, array members.
 *
 * WHAT IS EXCLUDED, and this is the part that decides whether the report is
 * worth reading:
 *   - comments (never in the AST), import and export specifiers, type literals,
 *     object KEYS, console calls, and class-name helpers (cn/clsx/cva/twMerge).
 *   - the presentational attribute and field names: className, style, href, id,
 *     the SVG geometry set, colours, icons, variants. Denylisted by name.
 *   - anything that reads like a path, a slug, a hex, a CSS declaration, a
 *     dimension, or a Tailwind class list. Denylisted by shape.
 *   - the three-word floor does most of the work on its own: almost no slug,
 *     class or prop value survives a requirement to be three real words long.
 *
 * WHAT IT REPORTS. Every phrase of three or more consecutive words appearing
 * more than twice, longest form first. A shorter phrase is suppressed when a
 * longer phrase contains it AND carries the same count, because reporting
 * "we have not" at 9 next to "we have not published this" at 9 is the same
 * finding printed twice.
 *
 * WHAT IT CANNOT SEE, so nobody trusts it further than it deserves: copy that
 * lives in the data files rather than the components, copy assembled at runtime
 * from variables, and the difference between a phrase written once in a shared
 * component (and therefore read on 191 pages) and a phrase written three times
 * in three files. It counts SOURCE occurrences. The `live` column is the closest
 * correction available: it separates shipping routes from dev prototypes, so a
 * count inflated by four abandoned versions of the same page is visible as one.
 *
 * Usage:
 *   node scripts/audit_lexicon.mjs              full report
 *   node scripts/audit_lexicon.mjs --live       shipping routes only, no dev/
 *   node scripts/audit_lexicon.mjs --min 4      raise the occurrence floor
 *   node scripts/audit_lexicon.mjs --json       machine-readable
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";
import ts from "typescript";

/* ------------------------------------------------------------------ config */

const ROOTS = ["src/app", "src/components"];
const MIN_WORDS = 3;
const MAX_WORDS = 14;

const argv = process.argv.slice(2);
const AS_JSON = argv.includes("--json");
const SITE_ONLY = argv.includes("--site");
const MIN_COUNT = (() => {
  const i = argv.indexOf("--min");
  const n = i >= 0 ? Number(argv[i + 1]) : NaN;
  return Number.isFinite(n) && n > 1 ? n : 3; // "more than twice"
})();

/** Not the site's editorial voice: a prototype yard, a component catalog, and
    the founder's own console. Still scanned and still counted, but tallied
    separately, because a phrase repeated across six dead drafts of one page is
    not a phrase the site says six times, and "No wave5_logic_check_v1.json on
    disk" is not the site talking to a reader. */
const OFF_SITE_PREFIX = ["src/app/dev/", "src/app/_design/", "src/app/(site)/admin/"];

/** JSX text is user-facing by construction, with two exceptions: these tags
    carry code to the browser, not words to a person. Without this the report
    ranks ".15s ease-out" fourteenth. */
const NON_TEXT_TAGS = new Set(["style", "script", "noscript"]);

/* Inline tags keep a sentence together. Everything else, including every
   capitalised component, breaks it: two block siblings are two utterances and
   gluing them invents phrases nobody wrote. */
const INLINE_TAGS = new Set([
  "span", "b", "strong", "em", "i", "a", "small", "sup", "sub", "abbr",
  "mark", "u", "s", "code", "var", "kbd", "time", "cite", "q", "wbr",
]);

/* Attribute and object-field names whose values are never prose. The shape
   filters below catch most of these anyway; naming them keeps the report clean
   when a value happens to be three lowercase words. */
const NOT_COPY_KEYS = new Set([
  // presentation
  "classname", "class", "classlist", "style", "css", "sx", "styles", "variant",
  "tone", "size", "align", "layout", "mode", "theme", "palette", "token",
  "cssvar", "accent", "color", "colour", "bg", "background", "backgroundcolor",
  "bordercolor", "font", "fontfamily", "fontsize", "fontweight", "weight",
  // identity and routing
  "id", "htmlfor", "key", "ref", "testid", "datatestid", "data-testid",
  "href", "src", "srcset", "action", "to", "url", "slug", "path", "pathname",
  "route", "anchor", "hash", "rel", "target", "xmlns", "as", "kind", "type",
  // svg geometry
  "d", "points", "viewbox", "transform", "preserveaspectratio", "clippath",
  "fill", "stroke", "strokewidth", "strokelinecap", "strokelinejoin",
  "strokedasharray", "stopcolor", "offset", "gradientunits", "textanchor",
  "dominantbaseline", "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r",
  "rx", "ry", "dx", "dy", "mask", "filter",
  // marks and glyphs
  "icon", "iconname", "glyph", "emoji", "symbol", "sectoricon", "flag",
  // protocol
  "charset", "crossorigin", "integrity", "enctype", "method", "autocomplete",
  "inputmode", "accept", "lang", "dir", "locale", "itemprop", "itemtype",
  "property", "role", "scope", "tabindex", "sizes", "media", "srclang",
]);

/* Callees whose string arguments are never read by a person. */
const NOT_COPY_CALLEES = new Set([
  "cn", "cx", "clsx", "classnames", "cva", "twmerge", "tw", "require",
  "console.log", "console.warn", "console.error", "console.info", "console.debug",
]);

/* Grammar, not vocabulary. Articles, prepositions, conjunctions, pronouns,
   auxiliaries, determiners, wh-words. Deliberately NOT including adverbs like
   "yet", "already" or "still": those carry the site's meaning ("not held yet"
   is a real line) and stripping them would hide a signature phrase. */
const FUNCTION_WORDS = new Set(
  ("a an the and or but nor of in on at to for from by with as is are was were am be been being it its it's this that these those you your yours we us our they them their there here not no if then than so such which who whom whose what when where how why all any each both per into onto over under about after before between through during while other another same do does did done doing can could may might must will would shall should has have had having up out off down at").split(
    " ",
  ),
);

/* A phrase needs two words that mean something. One content word surrounded by
   grammar ("at the top of", "it takes to", "so you can see") is a sentence
   fragment the extractor happened to cut, not a habit worth naming. Suppressed
   count is printed so nothing disappears silently. */
const CONTENT_WORDS_REQUIRED = 2;

/* ------------------------------------------------------------- shape filter */

const ENTITIES = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'",
  "&nbsp;": " ", "&rsquo;": "'", "&lsquo;": "'", "&ldquo;": '"',
  "&rdquo;": '"', "&hellip;": "...", "&ndash;": "-", "&times;": "x",
  "&middot;": ".", "&bull;": ".", "&#39;": "'", "&deg;": " ",
};
const decode = (s) =>
  s.replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? " ");

const RE_URL = /https?:\/\/|mailto:|tel:|^\/\/|www\./i;
const RE_PATHISH = /(^|\s)[.~@]?\/[A-Za-z0-9_[\]{}$*-]/; // /world, ./x, @/lib
const RE_SNAKE = /[A-Za-z0-9]_[A-Za-z0-9]/; // summary_large_image, cell_triage_v1
const RE_FILE = /\.(tsx?|jsx?|mjs|cjs|css|scss|json|svg|png|jpe?g|webp|avif|ico|md|woff2?)\b/i;
const RE_CSSFN = /var\(--|calc\(|rgba?\(|hsla?\(|url\(|translate|linear-gradient|#[0-9a-fA-F]{3}\b|#[0-9a-fA-F]{6}\b/;
const RE_DIMENSION = /\b\d+(\.\d+)?(px|rem|em|vh|vw|vmin|vmax|ch|ms|fr|dvh)\b/;
const RE_CSSDECL = /^[a-z-]+\s*:\s*\S+.*;/;
const RE_CODEY = /[{}<>|\\`]|\$\{|=>|::|&&|\|\|/;
const RE_SCREAMING = /^[A-Z0-9_]{3,}(\s+[A-Z0-9_]{3,})*$/; // CONST_CASE soup

/* Tailwind and utility-class detectors. Two independent nets because the class
   strings in this codebase come in two flavours: framework utilities, and the
   project's own short semantic names ("panel pad hairline"). */
const RE_TW_VARIANT = /(^|\s)(sm|md|lg|xl|2xl|hover|focus|focus-visible|active|group-hover|peer|dark|print|first|last|odd|even|disabled|motion-safe|motion-reduce|aria-[a-z]+|data-[a-z-]+):/;
const RE_TW_UTIL = /(^|\s)-?(flex|grid|block|inline-flex|inline-block|hidden|absolute|relative|fixed|sticky|truncate|uppercase|antialiased|overflow-[a-z]|whitespace-[a-z]|text-(xs|sm|base|lg|xl|\d|left|right|center|\[)|bg-[[a-z]|border(-[trblxy])?-\d|[pm][trblxy]?-\d|gap-[xy]?-?\d|w-(full|screen|\d|\[)|h-(full|screen|\d|\[)|min-[wh]-|max-[wh]-|rounded|shadow|font-(sans|serif|mono|bold|medium|semibold|normal|light)|leading-|tracking-|items-|justify-|self-|place-|space-[xy]-|z-\d|opacity-\d|col-span|row-span|basis-|shrink|grow|order-\d|aspect-|ring-|divide-|backdrop-)/;

/** A string is a class list when it is several lowercase tokens and enough of
    them are hyphenated or otherwise unspeakable. "panel pad hairline" is three
    real words by the tokenizer, so token shape is the only tell left. */
function looksLikeClassList(s) {
  const toks = s.trim().split(/\s+/);
  if (toks.length < 2) return false;
  /* Colon and full stop are NOT prose tells here: Tailwind spends both
     ("focus-visible:ring-2", "gap-1.5"). Testing for them was why four
     focus-ring strings reached the first draft of this report. */
  if (/[,;!?()"']/.test(s)) return false;
  if (!/^[a-z0-9\s:[\]/.%_-]+$/.test(s)) return false; // any capital rules it out
  const machine = toks.filter((t) => /[-:/[\]%]/.test(t) || t.length <= 2).length;
  return machine / toks.length >= 0.4;
}

/** The content gate. Everything above is context; this is shape. */
function looksLikeCopy(s) {
  const t = s.trim();
  if (t.length < 8) return false;
  if (RE_URL.test(t)) return false;
  if (RE_PATHISH.test(t)) return false;
  if (RE_SNAKE.test(t)) return false;
  if (RE_FILE.test(t)) return false;
  if (RE_CSSFN.test(t)) return false;
  if (RE_DIMENSION.test(t)) return false;
  if (RE_CSSDECL.test(t)) return false;
  if (RE_CODEY.test(t)) return false;
  if (RE_SCREAMING.test(t)) return false;
  if (RE_TW_VARIANT.test(t)) return false;
  if (RE_TW_UTIL.test(t)) return false;
  if (looksLikeClassList(t)) return false;
  // Needs at least three tokens that are actually words.
  const words = t.match(/[A-Za-z][A-Za-z'-]{1,}/g);
  if (!words || words.length < MIN_WORDS) return false;
  // And it must be mostly letters, not a punctuation or numeric artefact.
  const letters = (t.match(/[A-Za-z]/g) ?? []).length;
  return letters / t.length >= 0.55;
}

/* ------------------------------------------------------------- ast helpers */

const lower = (s) => (s ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "");

function tagNameOf(node, sf) {
  const n = ts.isJsxElement(node) ? node.openingElement.tagName : node.tagName;
  try {
    return n.getText(sf);
  } catch {
    return "";
  }
}

function calleeName(expr, sf) {
  try {
    return expr.getText(sf).toLowerCase();
  } catch {
    return "";
  }
}

/** Walk up from a string literal and decide whether anything it renders. */
function contextAllows(node, sf) {
  let n = node;
  let child = node;
  while (n.parent) {
    const p = n.parent;

    // module graph, never read
    if (
      ts.isImportDeclaration(p) ||
      ts.isExportDeclaration(p) ||
      ts.isImportEqualsDeclaration(p) ||
      ts.isExternalModuleReference(p) ||
      ts.isImportTypeNode(p) ||
      ts.isModuleDeclaration(p)
    ) return false;

    // a literal type ("a" | "b"), an enum member, a satisfies clause
    if (ts.isLiteralTypeNode(p) || ts.isTypeNode(p) || ts.isEnumMember(p)) return false;

    // the KEY of an object field is a name, not copy
    if (
      (ts.isPropertyAssignment(p) ||
        ts.isPropertySignature(p) ||
        ts.isMethodDeclaration(p) ||
        ts.isEnumMember(p)) &&
      p.name === n
    ) return false;

    // element access a["some key"] is a lookup
    if (ts.isElementAccessExpression(p) && p.argumentExpression === n) return false;

    if (ts.isCallExpression(p)) {
      const name = calleeName(p.expression, sf);
      if (NOT_COPY_CALLEES.has(name)) return false;
      // classList.add(...), el.setAttribute(...), matchMedia(...)
      if (/\.(add|remove|toggle|setattribute|getattribute|matchmedia|queryselector|getelementbyid|log|warn|error)$/.test(name))
        return false;
    }

    // style={{ ... }} and any style object field
    if (ts.isJsxAttribute(p)) {
      const attr = lower(p.name.getText(sf));
      if (NOT_COPY_KEYS.has(attr)) return false;
      // *Class / *ClassName / *Style suffixes
      if (/(classname|class|style|href|src|id|slug|icon|glyph|color|colour|token|variant)$/.test(attr))
        return false;
      return true; // named an allowed attribute; stop here
    }

    if (ts.isPropertyAssignment(p) && p.initializer === child) {
      const key = lower(p.name.getText(sf));
      if (NOT_COPY_KEYS.has(key)) return false;
      if (/(classname|class|style|href|src|url|path|slug|icon|glyph|color|colour|token|variant|id)$/.test(key))
        return false;
    }

    if (ts.isVariableDeclaration(p) && p.name && ts.isIdentifier(p.name)) {
      const v = lower(p.name.text);
      if (/(class|style|css|token|palette|colou?r|icon|glyph|slug|path|url|route)/.test(v))
        return false;
    }

    child = n;
    n = p;
  }
  return true;
}

/* -------------------------------------------------------------- extraction */

function walkFiles(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name).replace(/\\/g, "/");
    if (e.isDirectory()) {
      if (e.name !== "node_modules" && e.name !== ".next") walkFiles(p, out);
    } else if (extname(e.name) === ".tsx") {
      out.push(p);
    }
  }
  return out;
}

/** Pull every user-facing segment out of one file. */
function segmentsFor(file) {
  const text = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const segments = [];

  const push = (s) => {
    const t = decode(String(s)).replace(/\s+/g, " ").trim();
    if (t) segments.push(t);
  };

  /* JSX is flattened per block element rather than per text node, so a sentence
     interrupted by <b> survives and two stacked <p> do not fuse. */
  function jsxTree(root) {
    let buf = [];
    const flush = () => {
      if (buf.length) push(buf.join(" "));
      buf = [];
    };

    function attrs(opening) {
      for (const a of opening.attributes.properties) {
        if (ts.isJsxAttribute(a) && a.initializer) visit(a.initializer);
        else if (ts.isJsxSpreadAttribute(a)) visit(a.expression);
      }
    }

    function inner(n) {
      if (ts.isJsxText(n)) {
        const t = decode(n.text).replace(/\s+/g, " ").trim();
        if (t) buf.push(t);
        return;
      }
      if (ts.isJsxExpression(n)) {
        const e = n.expression;
        /* {" "} and {"a literal"} sit in the flow; anything computed breaks it,
           because a phrase spanning an unknown value is a phrase nobody wrote.
           The literal still has to look like words: a <style> body arrives here
           as a template literal and is CSS, not copy. */
        if (e && (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e))) {
          const t = decode(e.text).replace(/\s+/g, " ").trim();
          if (t && (looksLikeCopy(t) || (t.length <= 40 && /^[A-Za-z0-9 ,.'"%$()-]+$/.test(t)))) {
            buf.push(t);
          } else if (t) {
            flush();
          }
        } else {
          flush();
          if (e) visit(e);
        }
        return;
      }
      if (ts.isJsxElement(n)) {
        const tag = tagNameOf(n, sf);
        if (NON_TEXT_TAGS.has(tag.toLowerCase())) {
          flush();
          return; // the body is CSS or JS, never words
        }
        const inline = INLINE_TAGS.has(tag);
        if (!inline) flush();
        attrs(n.openingElement);
        for (const c of n.children) inner(c);
        if (!inline) flush();
        return;
      }
      if (ts.isJsxSelfClosingElement(n)) {
        const tag = tagNameOf(n, sf);
        if (NON_TEXT_TAGS.has(tag.toLowerCase())) return;
        if (!INLINE_TAGS.has(tag)) flush();
        attrs(n);
        return;
      }
      if (ts.isJsxFragment(n)) {
        for (const c of n.children) inner(c);
        return;
      }
    }

    inner(root);
    flush();
  }

  const isJsxRoot = (n) =>
    ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n);

  function visit(node) {
    if (isJsxRoot(node)) {
      jsxTree(node);
      return;
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (contextAllows(node, sf) && looksLikeCopy(node.text)) push(node.text);
      return;
    }
    if (ts.isTemplateExpression(node)) {
      if (contextAllows(node, sf)) {
        // Each literal run is its own segment; the holes are unknown values.
        for (const part of [node.head, ...node.templateSpans.map((s) => s.literal)]) {
          if (looksLikeCopy(part.text)) push(part.text);
        }
      }
      for (const s of node.templateSpans) visit(s.expression);
      return;
    }
    ts.forEachChild(node, visit);
  }

  visit(sf);
  return segments;
}

/* ------------------------------------------------------------- phrase count */

/** A token a reader sees but does not read as a word: a filename, a path, a
    command, an identifier. It appears in copy ("No coverage_v1.json on disk"),
    so it cannot be dropped from the page, but it must not glue the words on
    either side of it into a phrase. It becomes a break. */
const RE_MACHINE_TOKEN = /(^|\s)\S*(?:[_/\\@#{}]|\.(?:tsx?|jsx?|mjs|json|csv|py|sql|svg|css|md))\S*(?=\s|$)/g;

/** Split a segment where a reader would stop. Commas do not stop a phrase. */
function toSentences(seg) {
  return seg
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(RE_MACHINE_TOKEN, " \n ")
    .split(/(?<=[.!?;:])\s+|\s+[•·|]\s+|\n+/);
}

function tokenize(sentence) {
  return (sentence.toLowerCase().match(/[a-z][a-z'-]*|\d+(?:[.,]\d+)*%?/g) ?? []).filter(
    (w) => w.length > 0,
  );
}

/* A content word carries meaning: it is not grammar, it is longer than a single
   letter, and it is not a bare figure. Without the last two rules the report
   ranks "p 25 p" (the percentile labels) and "about 48 k" as vocabulary. */
const isContent = (w) =>
  !FUNCTION_WORDS.has(w) && w.length >= 2 && /[a-z]/.test(w);
const contentCount = (words) => words.filter(isContent).length;
const isGrammar = (words) => contentCount(words) < CONTENT_WORDS_REQUIRED;

const files = [];
for (const root of ROOTS) walkFiles(root, files);
files.sort();

const phrases = new Map(); // key -> { words, count, site, files: Map<file, n> }
const grammarSeen = new Set(); // dropped for having under two content words
let segmentCount = 0;
let siteFiles = 0;
let offSiteFiles = 0;
const failures = [];

for (const file of files) {
  const offSite = OFF_SITE_PREFIX.some((p) => file.startsWith(p));
  if (offSite) offSiteFiles++;
  else siteFiles++;
  if (SITE_ONLY && offSite) continue;

  let segs;
  try {
    segs = segmentsFor(file);
  } catch (err) {
    failures.push(`${file}: ${err.message}`);
    continue;
  }
  segmentCount += segs.length;

  for (const seg of segs) {
    for (const sentence of toSentences(seg)) {
      const words = tokenize(sentence);
      if (words.length < MIN_WORDS) continue;
      const cap = Math.min(words.length, MAX_WORDS);
      for (let n = MIN_WORDS; n <= cap; n++) {
        for (let i = 0; i + n <= words.length; i++) {
          const gram = words.slice(i, i + n);
          if (isGrammar(gram)) {
            grammarSeen.add(gram.join(" "));
            continue;
          }
          const key = gram.join(" ");
          let rec = phrases.get(key);
          if (!rec) {
            rec = { words: gram, count: 0, site: 0, files: new Map() };
            phrases.set(key, rec);
          }
          rec.count++;
          if (!offSite) rec.site++;
          rec.files.set(file, (rec.files.get(file) ?? 0) + 1);
        }
      }
    }
  }
}

/* Keep only what repeats, then drop any phrase that is merely the inside of a
   longer phrase seen exactly as often. Same finding, printed twice. */
let kept = [...phrases.entries()]
  .filter(([, r]) => r.count >= MIN_COUNT)
  .map(([key, r]) => ({ key, ...r }));

const byCount = new Map();
for (const p of kept) {
  if (!byCount.has(p.count)) byCount.set(p.count, []);
  byCount.get(p.count).push(p);
}
const maximal = [];
for (const [, bucket] of byCount) {
  bucket.sort((a, b) => b.words.length - a.words.length);
  const survivors = [];
  for (const p of bucket) {
    const padded = ` ${p.key} `;
    if (survivors.some((s) => ` ${s.key} `.includes(padded))) continue;
    survivors.push(p);
  }
  maximal.push(...survivors);
}

maximal.sort(
  (a, b) =>
    b.count - a.count || b.site - a.site || b.words.length - a.words.length ||
    a.key.localeCompare(b.key),
);

/* ------------------------------------------------------------------ output */

const occurrences = maximal.reduce((n, p) => n + p.count, 0);

if (AS_JSON) {
  console.log(
    JSON.stringify(
      {
        scanned: {
          files: files.length,
          site: siteFiles,
          offSite: offSiteFiles,
          segments: segmentCount,
        },
        minCount: MIN_COUNT,
        phrases: maximal.map((p) => ({
          phrase: p.key,
          words: p.words.length,
          count: p.count,
          site: p.site,
          files: [...p.files.entries()].map(([f, n]) => ({ file: f, n })),
        })),
        totals: { phrases: maximal.length, occurrences },
        failures,
      },
      null,
      2,
    ),
  );
} else {
  const scope = SITE_ONLY ? "public pages only" : "every route";
  console.log(`LEXICON AUDIT , repeated phrases in user-facing copy (${scope})`);
  console.log(
    `scanned ${files.length} .tsx files under ${ROOTS.join(" and ")}  (${siteFiles} public, ${offSiteFiles} prototype/catalog/admin)`,
  );
  console.log(`extracted ${segmentCount} text segments`);
  console.log(
    `showing every phrase of ${MIN_WORDS}+ words seen ${MIN_COUNT}+ times, longest form first`,
  );
  console.log(
    `"site N" means N of those occurrences are on public pages; the rest sit in ${OFF_SITE_PREFIX.join(", ")}`,
  );
  console.log("");

  for (const p of maximal) {
    const site = p.site === p.count ? "" : `  (site ${p.site})`;
    console.log(`${String(p.count).padStart(4)}x${site}  "${p.key}"`);
    const where = [...p.files.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([f, n]) => (n > 1 ? `${f} x${n}` : f));
    console.log(`       ${where.join(", ")}`);
  }

  console.log("");
  console.log(
    `TOTAL ${maximal.length} repeated phrases, ${occurrences} occurrences, across ${files.length} files.`,
  );
  console.log(
    `(${grammarSeen.size} distinct word runs were dropped for carrying under ${CONTENT_WORDS_REQUIRED} content words, e.g. "at the top of".)`,
  );
  if (failures.length) {
    console.log(`\n${failures.length} file(s) failed to parse:`);
    for (const f of failures) console.log(`  ${f}`);
  }
}
