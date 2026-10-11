/**
 * THE HEAD, THE ICONS AND THE WEIGHT (plan docs/superpowers/plans/2026-10-10-home-reform, Task 7, in the design repo; the spec's
 * section 4, "Head and weight"; the ship audit's 2.1 to 2.5, 3.1, 3.4, 3.7, 3.8 and 3.9). What every page's head carries and what the
 * home stops shipping:
 *   - the root's Open Graph and Twitter cut to what every page shares (the site's name, the kind, the card and its alt), so no page
 *     inherits the home's og:url or the old positioning; the viewport's theme colour, white, light only;
 *   - the icon at 48, 192 and 512 as three NUMBERED files (src/app/icon.tsx at /icon, icon1.tsx at /icon1, icon2.tsx at /icon2, each
 *     exporting its `size` and `contentType` and none exporting generateImageMetadata, which would move /icon, the address
 *     production has served since 2026-10-06, to /icon/<id>), and the home-screen icon at 180, each a PNG of its size, drawn from the
 *     header's mark by one shared drawing; the manifest naming the site, its definition and the icon1 and icon2 addresses; none of
 *     the files writes the cream-named white hex;
 *   - the share card's words the home's definition (COPY.home.definition), its warm tint gone; the home's title at 51 characters;
 *   - a missing blog post (fix round F1, group G8; F2, item I1; taken back in fix round F4): the post page's generateMetadata throws Next's
 *     not-found error for it, so the metadata stops there, and answers a post that exists with its own title and canonical; the route does
 *     not set `dynamicParams` to false (an explicit true or none at all passes) and its generateStaticParams lists every file of content/blog.
 *     Nothing in the route sets the status of a missing post. The throw does not (the metadata streams inside the root loading boundary:
 *     src/middleware.ts says so beside its place rule), and `dynamicParams = false`, which round F2 set for it, made Next decline a slug the
 *     list does not hold, so the request fell through to /[country]/[geo], which answered 200 with an indexable title, worse than the page's
 *     own soft 404 (measured on the build of 83fd5f99, 2026-10-11). The status for a missing post is the edge's, a queued item (QUEUE
 *     site:route-folder-fallthrough), and no check here reads it;
 *   - every JSON-LD block escaped so a "<" cannot close its script;
 *   - the auth client imported only behind the accounts switch, and the session read once for the bar and the sheet; Sentry started
 *     when the browser is idle; one Geist; the home's h1 still from its first frame; no `transition-all` left in the hero's word or
 *     field; the root layout and SiteChrome import the modules they use, not the kit's barrel; and a static walk of the client closure
 *     (the chrome's six client roots, and the kit barrel taken as a client root, which is what a client component that imports it
 *     bundles) holds neither the taxonomy nor industries.json (ProfileChip's import of the taxonomy had put industries.json into the
 *     client closure of every route that imports the barrel, and EngravedHero's flag then the taxonomy). (The flag-off home's
 *     picker seed, amendment 8b, is read in tests/trust/home_shape.test.ts beside the rebuilt home's.)
 * Imports the root layout through the repo's next/font stub (scripts/spikes/stub_next_font.cjs, which also empties the CSS import),
 * calls the icons and the card as Next would and reads their PNG headers. BLIND SPOT, stated: this proves what the files export and
 * draw, not the tags Next writes into a served page (Next's own metadata resolver does that at build); the bundle the auth client
 * and the barrel leave is proved by the imports' shape, not by measuring a build.
 * THE ICONS' CACHE, NOT MACHINE-CHECKED: Next links each icon as /icon?<hash of that icon file's OWN text> and serves the PNG immutable
 * for a year, while the drawing lives in src/components/brand/LogoMark.tsx and src/app/_site-icon.tsx. An edit to the mark that leaves
 * the four icon files (icon.tsx, icon1.tsx, icon2.tsx, apple-icon.tsx) as they were keeps the old icon in every returning browser for
 * a year, so such an edit touches them in the same commit (the "Mark revised" date in each header). The hash is Next's, taken at
 * build, so nothing here can tell that the mark changed; LogoMark.tsx and _site-icon.tsx say so where the edit is made. The
 * manifest's two icon URLs are written by hand and carry no hash, so they carry ?v=<MARK_REVISED> (one constant in _site-icon.tsx),
 * and this test holds the four headers' dates to that constant, so the date a person moves is the one the manifest reads.
 * Run: npx tsx tests/app/head.test.ts
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { posix } from "node:path";
import ts from "typescript";
import { stripCommentLines } from "../../scripts/lib/strip_comments";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "head";
const LAYOUT = "src/app/layout.tsx";
const CHROME = "src/components/SiteChrome.tsx";
const REMEDY = "keep the head to the plan's Task 7: the root's openGraph and twitter cut to siteName, type and the card with its alt; the viewport white and light; icons at 48, 192, 512 and 180; the manifest; the card's words COPY.home.definition";
let failed = 0;
const check = (label: string, ok: boolean, at?: { file?: string; remedy?: string }) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: at?.file ?? LAYOUT, detail: label, remedy: at?.remedy ?? REMEDY });
};
const code = (f: string) => stripCommentLines(readFileSync(f, "utf8").split("\n")).join("\n");
/** A module, or null when it does not exist or throws on load (a file this task creates is absent before it). */
const tryImport = async <T,>(load: () => Promise<unknown>): Promise<T | null> => { try { return (await load()) as T; } catch { return null; } };
/** A PNG's width and height from its IHDR chunk, or null when the bytes are no PNG. */
const pngSize = (buf: Buffer): [number, number] | null =>
  buf.length > 24 && buf.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" ? [buf.readUInt32BE(16), buf.readUInt32BE(20)] : null;

/* ---------------- THE CLIENT CLOSURE, BY A STATIC WALK (no build) ---------------- */
/* The walk the Task 7 review wrote (its closure.cjs), copied here so the guard runs in the chain. Its rules, stated so a number is read
   for what it is:
   - the entries are SERVER modules (the layout, SiteChrome), each walked only to find the client modules ("use client" at the
     top) it imports; a client module found is a ROOT. A module that a CLIENT file imports is not an entry of that kind: the kit
     barrel is taken as a root itself (clientClosure's second argument), because a client component that imports it bundles every
     module it re-exports, whether that module is a client file or not (EngravedHero is a server file, and its import of the flag
     put the country list, and through it the taxonomy, into the bundle of every client file that imports the barrel);
   - the CLIENT CLOSURE is every module a root reaches by static import or re-export, whatever its own directive, because a client file
     bundles what it imports;
   - a barrel counts every module it re-exports: this repo sets neither sideEffects nor optimizePackageImports, so a first-party barrel
     is bundled whole (the Oct 5 production build's chunk 2373 held the taxonomy because ProfileChip was re-exported there);
   - `import type`, `export type` and an import whose every specifier is `type X` are erased; an import used only as a type is NOT
     elided here, so a count can only be too high, never too low, on that account;
   - import() is its own chunk, fetched on use: listed as lazy, never in the closure; a package is named, not walked.
   BLIND SPOT: this reads import statements, not a bundle. It cannot tell which re-exports the bundler keeps, how a chunk is split or
   what a package pulls in, so it proves a module IS in the closure by the statements and never how many bytes a build ships. */
type Mod = { client: boolean; statics: string[]; dynamics: string[]; bytes: number };
const modules = new Map<string, Mod>();
const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", "/index.ts", "/index.tsx", "/index.js"];
const isFile = (p: string): boolean => { try { return statSync(p).isFile(); } catch { return false; } };
/** The repo file a local specifier names (`@/` is src/), or undefined for a package and for a local one that names nothing. */
const resolveLocal = (spec: string, from: string): string | undefined => {
  const base = spec.startsWith("@/") ? posix.join("src", spec.slice(2)) : spec.startsWith(".") ? posix.join(posix.dirname(from), spec) : null;
  return base === null ? undefined : EXTENSIONS.map((e) => base + e).find(isFile);
};
function readModule(file: string): Mod {
  const known = modules.get(file);
  if (known) return known;
  const text = readFileSync(file, "utf8");
  const mod: Mod = { client: false, statics: [], dynamics: [], bytes: Buffer.byteLength(text) };
  modules.set(file, mod);
  if (/\.(json|css)$/.test(file)) return mod;
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  for (const st of sf.statements) {
    /* the directive prologue: the string statements at the top */
    if (ts.isExpressionStatement(st) && ts.isStringLiteral(st.expression)) { if (st.expression.text === "use client") mod.client = true; continue; }
    break;
  }
  const add = (spec: string, into: string[]): void => { const r = resolveLocal(spec, file); if (r) into.push(r); };
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st) && ts.isStringLiteral(st.moduleSpecifier)) {
      const c = st.importClause, named = c?.namedBindings;
      if (c?.isTypeOnly) continue;
      if (c && !c.name && named && ts.isNamedImports(named) && named.elements.length > 0 && named.elements.every((e) => e.isTypeOnly)) continue;
      add(st.moduleSpecifier.text, mod.statics);
    } else if (ts.isExportDeclaration(st) && st.moduleSpecifier && ts.isStringLiteral(st.moduleSpecifier)) {
      const ex = st.exportClause;
      if (st.isTypeOnly) continue;
      if (ex && ts.isNamedExports(ex) && ex.elements.length > 0 && ex.elements.every((e) => e.isTypeOnly)) continue;
      add(st.moduleSpecifier.text, mod.statics);
    }
  }
  const visit = (n: ts.Node): void => {
    if (ts.isCallExpression(n) && n.expression.kind === ts.SyntaxKind.ImportKeyword && n.arguments.length === 1 && ts.isStringLiteral(n.arguments[0])) add(n.arguments[0].text, mod.dynamics);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return mod;
}
/** `files` maps each module of the closure to the module that first imported it ("" for a root); `bytes` is their source. */
type Closure = { roots: string[]; files: Map<string, string>; bytes: number; lazy: string[] };
function clientClosure(entries: string[], entriesAreClient = false): Closure {
  const roots = new Set<string>(), seen = new Set<string>();
  const findRoots = (file: string): void => {
    if (seen.has(file)) return;
    seen.add(file);
    const m = readModule(file);
    if (m.client) { roots.add(file); return; }
    for (const s of m.statics) if (!/\.(json|css)$/.test(s)) findRoots(s);
  };
  if (entriesAreClient) entries.forEach((e) => roots.add(e)); else entries.forEach(findRoots);
  const files = new Map<string, string>(), lazy = new Set<string>();
  const walk = (file: string, via: string): void => {
    if (files.has(file)) return;
    files.set(file, via);
    const m = readModule(file);
    m.dynamics.forEach((d) => lazy.add(d));
    m.statics.forEach((s) => walk(s, file));
  };
  [...roots].sort().forEach((r) => walk(r, ""));
  return { roots: [...roots].sort(), files, bytes: [...files.keys()].reduce((n, f) => n + readModule(f).bytes, 0), lazy: [...lazy].sort() };
}
/** What the guard keeps out of a client bundle: the taxonomy module (src/lib/taxonomy.ts) and every file under its folder (industries.json among them). */
const heavyIn = (c: Closure): string[] => [...c.files.keys()].filter((f) => f === "src/lib/taxonomy.ts" || f.startsWith("src/lib/taxonomy/"));
/** The chain of imports from a root down to a module of the closure: `root -> ... -> module`. */
const chainTo = (c: Closure, file: string): string => {
  const out = [file];
  for (let v = c.files.get(file); v; v = c.files.get(v)) out.push(v);
  return out.reverse().join(" -> ");
};
/** The module through which the taxonomy comes in (the taxonomy module itself, else the first file of its folder), or undefined when it is out. */
const heavyEntry = (c: Closure): string | undefined => { const hv = heavyIn(c); return hv.includes("src/lib/taxonomy.ts") ? "src/lib/taxonomy.ts" : hv[0]; };
/** The taxonomy in a line: the chain of imports that brings it in and how much of its folder comes with it, or "none". */
const heavyLine = (c: Closure): string => {
  const entry = heavyEntry(c);
  return entry === undefined ? "none" : `${chainTo(c, entry)}, with ${heavyIn(c).length - 1} more of its files${heavyIn(c).includes("src/lib/taxonomy/industries.json") ? ", industries.json among them" : ""}`;
};
const sizeOf = (c: Closure): string => `${c.roots.length} client roots, ${c.files.size} files, ${Math.round(c.bytes / 1024)} KB of source${c.lazy.length ? `, ${c.lazy.length} lazy chunk${c.lazy.length === 1 ? "" : "s"} not counted` : ""}`;

async function main() {
  /* next/font is a build-time transform and the layout imports a stylesheet: the repo's stub stands in for both. */
  await import("../../scripts/spikes/stub_next_font.cjs");
  const React = (await import("react")).default;
  (globalThis as unknown as { React: typeof React }).React = React;
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { COPY } = await import("../../src/lib/spine/copy");
  const def = COPY.home.definition;

  /* ---------------- THE ROOT'S SHARE TAGS AND THE VIEWPORT ---------------- */
  const layout = (await import("../../src/app/layout")) as unknown as {
    metadata: { openGraph?: Record<string, unknown>; twitter?: Record<string, unknown> };
    viewport?: Record<string, unknown>;
  };
  const og = layout.metadata.openGraph ?? {};
  check(`the root's Open Graph holds only what every page shares (${Object.keys(og).join(", ")})`, JSON.stringify(Object.keys(og).sort()) === JSON.stringify(["images", "siteName", "type"]) && og.siteName === "Margin Atlas" && og.type === "website");
  check("the root's card is /og/default at 1200 by 630, its alt the definition", JSON.stringify(og.images) === JSON.stringify([{ url: "/og/default", width: 1200, height: 630, alt: def }]));
  const tw = layout.metadata.twitter ?? {};
  check(`the root's Twitter card holds only the card and the image with its alt (${Object.keys(tw).join(", ")})`, JSON.stringify(Object.keys(tw).sort()) === JSON.stringify(["card", "images"]) && tw.card === "summary_large_image" && JSON.stringify(tw.images) === JSON.stringify([{ url: "/og/default", alt: def }]));
  check(`the viewport: white theme, light only, device width at scale 1 (${JSON.stringify(layout.viewport ?? null)})`, JSON.stringify(layout.viewport ?? null) === JSON.stringify({ width: "device-width", initialScale: 1, themeColor: "white", colorScheme: "light" }));

  /* ---------------- A MISSING BLOG POST: THE THROW, AND dynamicParams NOT FALSE (fix round F1, group G8; F2, item I1; taken back in fix round F4) ---------------- */
  /* The post page called notFound() only in the page, which runs inside the root loading boundary after the status line is sent, so
     /blog/<no such post> answered 200 with the loading skeleton and drew its 404 in the browser: a soft 404, probed on the built page
     (.superpowers/sdd/hr-p16-report.md). Round F1 added a notFound() to generateMetadata, believing the metadata sets the status as /[country]'s
     does for /zz. It does not: the metadata streams inside the same root loading boundary (src/middleware.ts says so beside its place rule:
     "Moving the call into generateMetadata does not help either"), and /zz's 404 is the middleware's, not its metadata's, so a missing post still
     answered 200 (the final review's I1). Round F2 then set `export const dynamicParams = false` over a generateStaticParams that lists every
     post, which is every .md file of content/blog, expecting the router to answer any other slug 404. The build of 83fd5f99 (2026-10-11) showed
     it does not: /blog/no-such-post still answered 200 and, worse, with the blog route declining the slug the request fell through to
     /[country]/[geo] (country "blog"), whose page answered 200 with the title "no-such-post: small-business benchmarks | Margin Atlas", robots
     index and follow, the loading skeleton and a client-side 404. That is worse than the page's own soft 404, so round F4 took `dynamicParams`
     back to true and this test pins any value but false. (The fall-through is already on production under any route folder with no dynamic
     child: /pricing/xyz and /about/xyz answer 200, "xyz: small-business benchmarks", index and follow.) The status for a missing post is set at
     the EDGE, by a queued item (QUEUE site:route-folder-fallthrough: a generated blog-slug table judged in the middleware as /industries and
     /cities are, and the route-folder fall-through closed), not by the route and not by this test. Here: the metadata throws Next's own
     not-found error (its digest, NEXT_HTTP_ERROR_FALLBACK;404) for a post that does not exist, so it draws no title of its own for one, and still
     answers a post that does with its own title and canonical (the throw only: nothing in this file claims the status); the route does not set
     dynamicParams to false; and its list equals the files. BLIND SPOT: this reads the route's exports and runs its metadata, so it cannot tell a
     404 from the 200 a fall-through answers; the status on the wire is the build's and then the edge's, and the built page is where it is seen
     (curl on /blog/no-such-post, once with no user agent and once with a browser's). */
  type BlogMeta = { title?: string; alternates?: { canonical?: string } };
  const blogPage = await tryImport<{ generateMetadata: (a: { params: Promise<{ slug: string }> }) => Promise<BlogMeta>; dynamicParams?: boolean; generateStaticParams?: () => Promise<Array<{ slug: string }>> }>(() => import("../../src/app/(site)/blog/[slug]/page"));
  const { getAllPosts } = await import("../../src/lib/blog");
  const realPost = getAllPosts()[0];
  const metaOf = async (slug: string): Promise<{ got: BlogMeta | null; threw: { digest?: string } | null }> => {
    try { return { got: await blogPage!.generateMetadata({ params: Promise.resolve({ slug }) }), threw: null }; } catch (e) { return { got: null, threw: e as { digest?: string } }; }
  };
  const missingPost = blogPage ? await metaOf("no-such-post-zz") : null;
  const presentPost = blogPage && realPost ? await metaOf(realPost.slug) : null;
  const BLOG_AT = { file: "src/app/(site)/blog/[slug]/page.tsx", remedy: "call notFound() (next/navigation) in generateMetadata when getPost(slug) finds no post, so the metadata stops there and draws no title of its own for one; it does not set the status (the metadata streams inside the root loading boundary), and neither does dynamicParams = false (Next declines the slug and the request falls through to /[country]/[geo], an indexable 200): the status for a missing post is the edge's, QUEUE site:route-folder-fallthrough" };
  check(`a post that does not exist answers with Next's not-found error from generateMetadata (digest ${missingPost?.threw?.digest ?? "none, it returned " + JSON.stringify(missingPost?.got ?? null)}): the metadata stops there, the throw only and not the status`, !!missingPost && missingPost.got === null && missingPost.threw?.digest === "NEXT_HTTP_ERROR_FALLBACK;404", BLOG_AT);
  check(`a post that exists still answers its own title and canonical (${presentPost?.got?.title ?? "none"})`, !!presentPost && !!realPost && presentPost.threw === null && presentPost.got?.title === `${realPost.title} | Margin Atlas` && presentPost.got?.alternates?.canonical === `/blog/${realPost.slug}`, BLOG_AT);
  const postFiles = readdirSync("content/blog").filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, "")).sort();
  const listedPosts = blogPage?.generateStaticParams ? (await blogPage.generateStaticParams()).map((p) => p.slug).sort() : [];
  /* THE PIN: ANY VALUE BUT FALSE (fix round F4). `undefined` passes, because Next reads a route that exports no dynamicParams as true. */
  const dynParams = !blogPage ? "the page did not load" : blogPage.dynamicParams === undefined ? "not exported, which is true" : String(blogPage.dynamicParams);
  check(`the blog route does not set dynamicParams to false (${dynParams}): false made Next decline a slug the list does not hold, and the request fell through to /[country]/[geo], an indexable 200 worse than the page's own soft 404 (the build of 83fd5f99, 2026-10-11); a missing post's status is the edge's (QUEUE site:route-folder-fallthrough), not this route's`, !!blogPage && blogPage.dynamicParams !== false, { ...BLOG_AT, remedy: "export const dynamicParams = true in src/app/(site)/blog/[slug]/page.tsx (or leave it out): with false Next declines a slug generateStaticParams does not list and the request falls through to /[country]/[geo], which answers 200 with an indexable title (measured on the build of 83fd5f99, 2026-10-11), worse than the page's own soft 404; set the status of a missing post at the edge (QUEUE site:route-folder-fallthrough), never with dynamicParams false" });
  check(`generateStaticParams lists every file of content/blog (${listedPosts.length} listed of ${postFiles.length} files), so every post is built with the site and none waits for its first request`, !!blogPage && postFiles.length > 0 && JSON.stringify(listedPosts) === JSON.stringify(postFiles), { ...BLOG_AT, remedy: "have generateStaticParams in src/app/(site)/blog/[slug]/page.tsx return one { slug } for every .md file of content/blog (getAllPosts() reads them): a post it leaves out is built on its first request instead of with the site" });

  /* ---------------- THE ICONS AND THE MANIFEST ---------------- */
  /* THREE NUMBERED FILES, NOT ONE FILE WITH generateImageMetadata (the Task 7 review, fix round 7). A file that exports
     generateImageMetadata is served at /icon/<id> and nothing answers /icon, the address production has served since the icon fix of
     2026-10-06: Next routes it to the country wildcard, and no redirect may be added before the inventory (his URL rule). Next's
     numbered icon files are served at /icon, /icon1 and /icon2 and linked from every head, each with its own `size`. */
  type IconFile = { size?: { width: number; height: number }; contentType?: string; generateImageMetadata?: unknown; default: () => Response };
  const SHARED_ICON = "src/app/_site-icon.tsx";
  const ICONS = [
    { file: "src/app/icon.tsx", address: "/icon", px: 48, mod: await tryImport<IconFile>(() => import("../../src/app/icon")) },
    { file: "src/app/icon1.tsx", address: "/icon1", px: 192, mod: await tryImport<IconFile>(() => import("../../src/app/icon1")) },
    { file: "src/app/icon2.tsx", address: "/icon2", px: 512, mod: await tryImport<IconFile>(() => import("../../src/app/icon2")) },
  ];
  /** The PNG size a file's default export draws, or null when it throws, returns no PNG or is not there. */
  const drawn = async (mod: IconFile | null): Promise<[number, number] | null> => {
    try { return mod ? pngSize(Buffer.from(await mod.default().arrayBuffer())) : null; } catch { return null; }
  };
  for (const { file, address, px, mod } of ICONS) {
    const got = await drawn(mod);
    check(
      `${address} (${file}) declares ${px} by ${px} and image/png, and exports no generateImageMetadata`,
      !!mod && mod.size?.width === px && mod.size?.height === px && mod.contentType === "image/png" && typeof mod.generateImageMetadata === "undefined",
      { file, remedy: `export const size = { width: ${px}, height: ${px} } and contentType = "image/png", and no generateImageMetadata: with it Next serves the file at ${address}/<id> and nothing answers ${address} itself, which routes to the country wildcard` },
    );
    check(`${address} draws a PNG ${px} by ${px} (${got ? got.join(" by ") : "no PNG"})`, !!got && got[0] === px && got[1] === px, { file, remedy: `${file} default-exports a function returning the drawing at ${px} by ${px} (siteIcon(size.width))` });
  }
  const drawers = ICONS.filter(({ file }) => existsSync(file) && /from "\.\/_site-icon"/.test(code(file))).length;
  check(
    `the three icon files draw through one shared drawing, ${SHARED_ICON} (${drawers} of 3 import it)`,
    drawers === 3 && existsSync(SHARED_ICON) && /new ImageResponse\(/.test(code(SHARED_ICON)),
    { file: SHARED_ICON, remedy: "icon.tsx, icon1.tsx and icon2.tsx each return siteIcon(size.width) from src/app/_site-icon.tsx, the one drawing, which holds the black and the white; its name ends in icon.tsx because scripts/verify_hardcoded_hex.ts skips raster icon routes by that ending, which icon1.tsx and icon2.tsx do not match; it sits in src/app, not src/components, because scripts/audit_render_graph.ts calls a component that only a metadata file imports an orphan" },
  );
  const apple = await tryImport<{ size: { width: number; height: number }; contentType: string; default: () => Response }>(() => import("../../src/app/apple-icon"));
  const appleGot = apple ? pngSize(Buffer.from(await apple.default().arrayBuffer())) : null;
  check(`the home-screen icon is a PNG 180 by 180 (${appleGot ? appleGot.join(" by ") : "no PNG"})`, !!apple && apple.size.width === 180 && apple.size.height === 180 && apple.contentType === "image/png" && !!appleGot && appleGot[0] === 180 && appleGot[1] === 180, { file: "src/app/apple-icon.tsx" });
  const manifest = (await tryImport<{ default: () => Record<string, unknown> }>(() => import("../../src/app/manifest")))?.default() ?? {};
  const icons = (manifest.icons as Array<{ src: string; sizes: string; type: string }>) ?? [];
  check("the manifest names the site, says what it is, opens at the home, is white and read in a browser", manifest.name === "Margin Atlas" && manifest.short_name === "Margin Atlas" && manifest.description === def && manifest.start_url === "/" && manifest.display === "browser" && manifest.theme_color === "white" && manifest.background_color === "white", { file: "src/app/manifest.ts" });
  /* THE MANIFEST'S TWO ICON URLS CARRY A VERSION (cleanup round 2). Next links /icon, /icon1 and /icon2 from every head with the hash of
     the icon file's own text, but the manifest is written by hand, and an address with no hash is cached by a browser for a year
     under its own key: the old 192 or 512 would stay on a home screen after the mark changes. The version is the mark's revised date,
     one constant (MARK_REVISED) beside the shared drawing, read by the manifest; the "Mark revised" date in each icon file's header
     is the same day, so the date a person changes in the header and the one the manifest reads cannot part. */
  const shared = await tryImport<{ MARK_REVISED?: unknown }>(() => import("../../src/app/_site-icon"));
  const version = typeof shared?.MARK_REVISED === "string" ? shared.MARK_REVISED : "";
  check(
    `the mark's revised date is one constant beside the shared drawing, a day (MARK_REVISED in ${SHARED_ICON}: ${version || "absent"})`,
    /^\d{4}-\d{2}-\d{2}$/.test(version),
    { file: SHARED_ICON, remedy: `export const MARK_REVISED = "<the day the mark or its drawing last changed, yyyy-mm-dd>" from ${SHARED_ICON}, and have src/app/manifest.ts put it on both icon URLs as ?v=` },
  );
  const HEADED = ["src/app/icon.tsx", "src/app/icon1.tsx", "src/app/icon2.tsx", "src/app/apple-icon.tsx"];
  const parted = HEADED.filter((f) => /Mark revised: (\d{4}-\d{2}-\d{2})/.exec(readFileSync(f, "utf8"))?.[1] !== version);
  check(
    `the four icon files' "Mark revised" headers read the constant's day, ${version || "absent"} (${parted.length ? `parted: ${parted.join(", ")}` : "all four"})`,
    version !== "" && parted.length === 0,
    { file: parted[0] ?? SHARED_ICON, remedy: `change MARK_REVISED in ${SHARED_ICON} and the "Mark revised" date in the header of icon.tsx, icon1.tsx, icon2.tsx and apple-icon.tsx in the same commit: the header's text is what Next takes the head links' hash from, and the constant is what the manifest's two icon URLs carry` },
  );
  check(
    `the manifest's icons are the numbered files' own 192 and 512, /icon1 and /icon2, each with ?v=${version || "<MARK_REVISED>"} (${icons.map((i) => i.src).join(", ")})`,
    version !== "" && JSON.stringify(icons) === JSON.stringify([{ src: `/icon1?v=${version}`, sizes: "192x192", type: "image/png" }, { src: `/icon2?v=${version}`, sizes: "512x512", type: "image/png" }]) && icons.every((i) => ICONS.some((f) => f.address === i.src.split("?")[0] && !!f.mod?.size && i.sizes === `${f.mod.size.width}x${f.mod.size.height}`)),
    { file: "src/app/manifest.ts", remedy: `point the manifest's icons at /icon1?v=\${MARK_REVISED} (192x192) and /icon2?v=\${MARK_REVISED} (512x512), the addresses of src/app/icon1.tsx and icon2.tsx with the version from ${SHARED_ICON}: an address with no version is cached for a year under its own key; /icon/192 and /icon/512 are not routes` },
  );
  const creamWhite = ["src/app/icon.tsx", "src/app/icon1.tsx", "src/app/icon2.tsx", SHARED_ICON, "src/app/apple-icon.tsx", "src/app/manifest.ts", LAYOUT].filter((f) => existsSync(f) && /#ffffff/i.test(code(f)));
  check(`no new file writes white as #ffffff, the hex the cream gate counts (${creamWhite.join(", ") || "none"})`, creamWhite.length === 0, { file: creamWhite[0] ?? "src/app/icon.tsx", remedy: "write white as the word white" });

  /* ---------------- THE SHARE CARD AND THE HOME'S TITLE ---------------- */
  const card = code("src/app/og/default/route.tsx");
  check("the share card prints the home's definition, not the old line", /\{COPY\.home\.definition\}/.test(card) && !/actually earns|Revenue, payroll/.test(card), { file: "src/app/og/default/route.tsx" });
  check("the card's ground ends on a neutral, not the retired warm tint #f7f6f4", !/#f7f6f4/i.test(code("src/app/og/_card.tsx")), { file: "src/app/og/_card.tsx" });
  const { GET } = (await import("../../src/app/og/default/route")) as unknown as { GET: () => Promise<Response> };
  const cardGot = pngSize(Buffer.from(await (await GET()).arrayBuffer()));
  check(`the card still draws, a PNG 1200 by 630 (${cardGot ? cardGot.join(" by ") : "no PNG"})`, !!cardGot && cardGot[0] === 1200 && cardGot[1] === 630, { file: "src/app/og/default/route.tsx" });
  const title = /export const metadata: Metadata = \{\s*title: "([^"]+)"/.exec(code("src/app/page.tsx"))?.[1] ?? "";
  check(`the home's title is "Margin Atlas: what a small business earns and keeps", ${title.length} characters (a result shows about 60)`, title === "Margin Atlas: what a small business earns and keeps" && title.length === 51, { file: "src/app/page.tsx" });

  /* ---------------- THE STRUCTURED DATA ---------------- */
  const sd = await import("../../src/components/StructuredData");
  const tricky = { name: "</script><script>alert(1)</script>", note: "a < b" };
  const escaped = typeof sd.ldJson === "function" ? sd.ldJson(tricky) : JSON.stringify(tricky);
  check("ldJson writes no raw < and reads back as the same object", !escaped.includes("<") && escaped.includes("\\u003c/script>") && JSON.stringify(JSON.parse(escaped)) === JSON.stringify(tricky), { file: "src/components/StructuredData.tsx" });
  const sdCode = code("src/components/StructuredData.tsx");
  check(`every JSON-LD block goes through ldJson (${(sdCode.match(/__html: ldJson\(data\)/g) ?? []).length} of 5)`, (sdCode.match(/__html: ldJson\(data\)/g) ?? []).length === 5 && !/__html: JSON\.stringify/.test(sdCode), { file: "src/components/StructuredData.tsx" });
  const orgHtml = renderToStaticMarkup(React.createElement(sd.Organization));
  const orgJson = /<script type="application\/ld\+json">([\s\S]*)<\/script>/.exec(orgHtml)?.[1] ?? "";
  check("the Organization block renders, its JSON holding the definition and no raw <", orgJson.length > 0 && !orgJson.includes("<") && (JSON.parse(orgJson) as { description?: string }).description === def, { file: "src/components/StructuredData.tsx" });
  /* ldJson is total (fix round 7): JSON.stringify answers undefined for undefined, a function and a symbol, and the `.replace` after it
     then threw; a block with no data is the JSON of nothing, null. */
  const totalResults = (() => { try { return [undefined, () => 1, Symbol("x"), null].map((v) => sd.ldJson(v)); } catch (e) { return [`threw: ${e instanceof Error ? e.message : String(e)}`]; } })();
  check(`ldJson is total: undefined, a function, a symbol and null each give null, never a throw (${totalResults.join(" | ")})`, totalResults.length === 4 && totalResults.every((r) => r === "null"), { file: "src/components/StructuredData.tsx", remedy: "write ldJson as (JSON.stringify(data) ?? \"null\").replace(/</g, \"\\\\u003c\")" });
  /* EVERY application/ld+json EMITTER IN src (fix round 7): this test read StructuredData.tsx alone, and four other files wrote the block
     without the shared escape (FAQSchema, ProLockedData, the learn article page, and the blog post page with a copy of the escape of its
     own). The scan reads the syntax of each src file that names ld+json: a <script type="application/ld+json"> whose
     dangerouslySetInnerHTML.__html is a call of the ldJson imported from StructuredData; an ld+json string it cannot read as such is
     a finding too, so an emitter written another way (createElement, a template) never passes unseen. BLIND SPOT: it cannot see a block
     assembled from a string that does not contain the words ld+json. */
  const srcFiles = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? srcFiles(`${dir}/${e.name}`) : /\.tsx?$/.test(e.name) ? [`${dir}/${e.name}`] : []));
  const emitters: Array<{ file: string; line: number; shared: boolean }> = [];
  const unreadable: string[] = [];
  for (const file of srcFiles("src")) {
    const text = readFileSync(file, "utf8");
    if (!text.includes("ld+json")) continue;
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const importsShared = file === "src/components/StructuredData.tsx" || /import\s*\{[^}]*\bldJson\b[^}]*\}\s*from\s*"@\/components\/StructuredData"/.test(text);
    let literals = 0, scripts = 0;
    const visit = (n: ts.Node): void => {
      if (ts.isStringLiteralLike(n) && n.text.includes("ld+json")) literals++;
      if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
        const attrs = n.attributes.properties.filter(ts.isJsxAttribute);
        const named = (name: string) => attrs.find((a) => a.name.getText(sf) === name);
        const type = named("type")?.initializer;
        if (n.tagName.getText(sf) === "script" && type && ts.isStringLiteral(type) && type.text === "application/ld+json") {
          scripts++;
          const raw = named("dangerouslySetInnerHTML")?.initializer;
          const obj = raw && ts.isJsxExpression(raw) ? raw.expression : undefined;
          const prop = obj && ts.isObjectLiteralExpression(obj) ? obj.properties.find((p): p is ts.PropertyAssignment => ts.isPropertyAssignment(p) && p.name.getText(sf) === "__html") : undefined;
          const via = prop?.initializer;
          emitters.push({ file, line: sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1, shared: importsShared && !!via && ts.isCallExpression(via) && ts.isIdentifier(via.expression) && via.expression.text === "ldJson" });
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
    if (literals !== scripts) unreadable.push(file);
  }
  const loose = emitters.filter((e) => !e.shared).map((e) => `${e.file}:${e.line}`).concat(unreadable.map((f) => `${f} (an ld+json string this scan cannot read as a script block)`));
  check(
    `every application/ld+json block in src goes through the shared ldJson (${emitters.length} blocks in ${new Set(emitters.map((e) => e.file)).size} files; ${loose.join(", ") || "none loose"})`,
    emitters.length >= 5 && loose.length === 0,
    { file: loose[0]?.replace(/:\d+$| \(.*$/, "") ?? "src/components/StructuredData.tsx", remedy: "write __html: ldJson(data) with ldJson imported from @/components/StructuredData: a raw JSON.stringify lets a value that holds </script> close the script element early" },
  );
  const faq = await tryImport<{ FAQSchema: (p: { faqs: Array<{ question: string; answer: string }> }) => React.ReactElement | null }>(() => import("../../src/components/FAQSchema"));
  const faqHtml = faq ? renderToStaticMarkup(React.createElement(faq.FAQSchema, { faqs: [{ question: "Is a < b </script> safe?", answer: "<b>yes</b>" }] })) : "";
  const faqJson = /<script type="application\/ld\+json">([\s\S]*)<\/script>/.exec(faqHtml)?.[1] ?? "";
  check("the FAQ block renders a question holding </script> with no raw <, and reads back as the same text", faqJson.length > 0 && !faqJson.includes("<") && (JSON.parse(faqJson) as { mainEntity?: Array<{ name?: string }> }).mainEntity?.[0]?.name === "Is a < b </script> safe?", { file: "src/components/FAQSchema.tsx", remedy: "write FAQSchema's block as __html: ldJson(json), with ldJson imported from @/components/StructuredData" });

  /* ---------------- THE WEIGHT ---------------- */
  /* The auth client loads inside the one shared session read (readSession), and that read starts only from the hook's effect, after
     its `if (!authEnabled) return;` guard: with accounts off the import() is never reached and its chunk is never requested. The read
     is one function, so the bar and the sheet share one asking (tests/chrome/masthead.test.ts counts the calls in a mounted tree). */
  const auth = code("src/components/HeaderAuth.tsx");
  const guard = auth.indexOf("if (!authEnabled) return;");
  const lazy = 'await import("@/lib/supabase/client")';
  const reader = /function readSession\(\)[\s\S]*?\n\}/.exec(auth)?.[0] ?? "";
  const callsAt = [...auth.matchAll(/(?<!function )\breadSession\(\)/g)].map((m) => m.index ?? -1);
  check(
    "the auth client is imported only behind the accounts switch: no static import, one dynamic import inside the shared read, which the hook calls only after the guard",
    !/^import[^;]*from "@\/lib\/supabase\/client";/m.test(auth) && (auth.split(lazy).length - 1) === 1 && reader.includes(lazy) && guard > -1 && callsAt.length > 0 && callsAt.every((i) => i > guard),
    { file: "src/components/HeaderAuth.tsx", remedy: "no static import of @/lib/supabase/client; the one await import(\"@/lib/supabase/client\") stays inside readSession, and useAuthState calls readSession() only after `if (!authEnabled) return;`" },
  );
  check(
    `the session is read once for the bar and the sheet: one getUser() (${(auth.match(/\.auth\.getUser\(\)/g) ?? []).length}), in the module-level shared promise`,
    (auth.match(/\.auth\.getUser\(\)/g) ?? []).length === 1 && reader.includes(".auth.getUser()") && /^let sessionRead: Promise<boolean> \| null = null;$/m.test(auth),
    { file: "src/components/HeaderAuth.tsx", remedy: "keep one module-level `let sessionRead: Promise<boolean> | null = null;` that readSession() fills once, so every entry takes the same promise" },
  );
  const barrelUsers = [LAYOUT, CHROME].filter((f) => /from\s*["']@\/components\/kit(?:\/index)?["']/.test(code(f)));
  check(
    `neither the root layout nor SiteChrome imports the kit barrel (${barrelUsers.join(", ") || "none"})`,
    barrelUsers.length === 0,
    { file: barrelUsers[0] ?? LAYOUT, remedy: "import the module that holds the export (@/components/kit/frame/AtlasGutters, @/components/kit/WatchTray): the barrel re-exports every client module of the kit (the sliders, the switchers, the waterfall on recharts), and a root file that imports it ships all of them to every page" },
  );
  /* THE CLIENT CLOSURE, NOT ONLY THE TWO IMPORT LINES (the Task 7 review, fix round 7): the line check above misses a chrome file that
     reaches the taxonomy through another module, and it never looked at the routes that import the barrel, where ProfileChip's
     import of @/lib/taxonomy still put industries.json (130 KB of source) into the client closure. HeaderSearch left the list in
     critique pass 3 (fix round D1, item P1.2): the bar's Search is a plain link now, a server component with no client code. */
  const CHROME_ROOTS = ["src/components/HeaderAuth.tsx", "src/components/MobileNav.tsx", "src/components/NavLinks.tsx", "src/components/brand/PhoneLockup.tsx", "src/components/kit/WatchTray.tsx", "src/components/newsletter/NewsletterSignupVariants.tsx"];
  const HEAVY_REMEDY = "the file named is the one that imports the taxonomy, the last link of the chain: have it read what it needs from a light module (src/lib/country_list.ts holds the country list with no imports; src/lib/nav.ts holds the country codes), or load the heavy module with import() on use, as src/components/NavigatorForm.tsx loads src/lib/home/picker.ts";
  const chrome = clientClosure([LAYOUT, CHROME]);
  const missingRoots = CHROME_ROOTS.filter((r) => !chrome.roots.includes(r));
  check(
    `the chrome's client closure (the layout and SiteChrome: ${sizeOf(chrome)}) holds the six chrome roots and neither the taxonomy nor industries.json (${heavyLine(chrome)}${missingRoots.length ? `; roots not found: ${missingRoots.join(", ")}` : ""})`,
    missingRoots.length === 0 && heavyEntry(chrome) === undefined,
    { file: (heavyEntry(chrome) && chrome.files.get(heavyEntry(chrome) as string)) || LAYOUT, remedy: heavyEntry(chrome) ? HEAVY_REMEDY : "the walk found fewer than the six chrome roots (HeaderAuth, MobileNav, NavLinks, PhoneLockup, WatchTray, NewsletterSignupVariants): read it against the layout and SiteChrome, or update CHROME_ROOTS in tests/app/head.test.ts with the change" },
  );
  /* THE BARREL AS A CLIENT ROOT (cleanup round 2): a client component that imports the barrel bundles every module the barrel
     re-exports. The walk used to take the barrel as a server entry and look only for the "use client" files under it, so EngravedHero
     (a server file) and its import of the flag, the country list and the taxonomy were never in it, while CompareClient, DecideWizard,
     YouDashboard, MakeItYoursPanel and CityWatchAction all carried them. */
  const barrel = clientClosure(["src/components/kit/index.ts"], true);
  check(
    `a client module that imports the kit barrel bundles the barrel's ${barrel.files.size} files (${Math.round(barrel.bytes / 1024)} KB of source), with neither the taxonomy nor industries.json (${heavyLine(barrel)})`,
    barrel.files.size > 1 && heavyEntry(barrel) === undefined,
    { file: (heavyEntry(barrel) && barrel.files.get(heavyEntry(barrel) as string)) || "src/components/kit/index.ts", remedy: heavyEntry(barrel) ? HEAVY_REMEDY : "the walk found nothing under the kit barrel: read it against src/components/kit/index.ts" },
  );
  const sentry = code("src/instrumentation-client.ts");
  check("Sentry starts when the browser is idle (within four seconds), not before hydration", /function startSentry\(\): void \{\s*Sentry\.init\(/.test(sentry) && (sentry.match(/Sentry\.init\(/g) ?? []).length === 1 && /requestIdleCallback\(startSentry, \{ timeout: 4000 \}\)/.test(sentry) && /setTimeout\(startSentry, 1\)/.test(sentry) && /sendDefaultPii: false/.test(sentry), { file: "src/instrumentation-client.ts" });
  const shell = code("src/components/spine/shell.tsx");
  check("one Geist: the spine shell loads no font of its own and reads the layout's --font-sans", !/next\/font/.test(shell) && !/--font-geist/.test(shell) && /fontFamily: "var\(--font-sans\), ui-sans-serif, system-ui, sans-serif"/.test(shell), { file: "src/components/spine/shell.tsx" });
  const css = code("src/app/globals.css");
  const motion = /@media \(prefers-reduced-motion: no-preference\) \{\s*h1 \{[\s\S]*?\n  \}/.exec(css)?.[0] ?? "";
  check("the home's h1 is still from its first frame: #search h1 takes no entrance fade", /#search h1,\s*#search h1 \+ p \{\s*animation: none;\s*\}/.test(motion), { file: "src/app/globals.css" });
  /* The rule finds the h1 only while the home draws it inside #search (Task 2 owns the hero's markup): read it off the harness's render
     of the home where one exists (the chain's pages-fresh writes it first), deferred and said where it does not. */
  const HOME = "scratchpad/harness/pages/home-gb.html";
  if (existsSync(HOME)) {
    const home = readFileSync(HOME, "utf8");
    const at = home.indexOf('id="search"'), h1 = home.indexOf("<h1", at), end = home.indexOf("</section>", at);
    check("the home's h1 stands inside #search, where the rule finds it", at > -1 && h1 > at && (end < 0 || h1 < end), { file: "src/components/spine/home/home-view.tsx", remedy: "keep the home's h1 inside <section id=\"search\">, or point the rule in globals.css at the h1's new seat" });
  } else console.log(`DEFER  ${HOME} is not rendered here; the h1's seat inside #search was not read`);
  const tall = ["src/components/RotatingWord.tsx", "src/components/ComboField.tsx"].filter((f) => /\btransition-all\b/.test(code(f)));
  check(`no transition-all in the hero's word or field (${tall.join(", ") || "none"})`, tall.length === 0, { file: tall[0] ?? "src/components/RotatingWord.tsx", remedy: "transition-opacity on the word, transition-colors on the field" });

  if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
  console.log("app/head: all pass");
}

main().catch((e) => {
  red({ rule: RULE, file: LAYOUT, detail: `the head test crashed: ${e instanceof Error ? e.message : String(e)}`, remedy: REMEDY });
  process.exit(1);
});
