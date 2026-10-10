/**
 * THE HEAD, THE ICONS AND THE WEIGHT (plan docs/superpowers/plans/2026-10-10-home-reform, Task 7, in the design repo; the spec's
 * section 4, "Head and weight"; the ship audit's 2.1 to 2.5, 3.1, 3.4, 3.7, 3.8 and 3.9). What every page's head carries and what the
 * home stops shipping:
 *   - the root's Open Graph and Twitter cut to what every page shares (the site's name, the kind, the card and its alt), so no page
 *     inherits the home's og:url or the old positioning; the viewport's theme colour, white, light only;
 *   - the icon at 48, 192 and 512 and the home-screen icon at 180, each a PNG of its size, drawn from the header's mark; the manifest
 *     naming the site, its definition and the 192 and 512 icons; none of the three writes the cream-named white hex;
 *   - the share card's words the home's definition (COPY.home.definition), its warm tint gone; the home's title at 51 characters;
 *   - every JSON-LD block escaped so a "<" cannot close its script;
 *   - the auth client imported only behind the accounts switch, and the session read once for the bar and the sheet; Sentry started
 *     when the browser is idle; one Geist; the home's h1 still from its first frame; no `transition-all` left in the hero's word or
 *     field; the root layout and SiteChrome import the modules they use, not the kit's barrel (whose ProfileChip carried the taxonomy
 *     and industries.json into every page's client bundle). (The flag-off home's picker seed, amendment 8b, is read in
 *     tests/trust/home_shape.test.ts beside the rebuilt home's.)
 * Imports the root layout through the repo's next/font stub (scripts/spikes/stub_next_font.cjs, which also empties the CSS import),
 * calls the icons and the card as Next would and reads their PNG headers. BLIND SPOT, stated: this proves what the files export and
 * draw, not the tags Next writes into a served page (Next's own metadata resolver does that at build); the bundle the auth client
 * and the barrel leave is proved by the imports' shape, not by measuring a build.
 * Run: npx tsx tests/app/head.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
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

  /* ---------------- THE ICONS AND THE MANIFEST ---------------- */
  const icon = (await import("../../src/app/icon")) as unknown as { generateImageMetadata?: () => Array<{ id: string; size: { width: number; height: number }; contentType: string }>; default: (p: { id: string }) => Response };
  const sizes = typeof icon.generateImageMetadata === "function" ? icon.generateImageMetadata() : [];
  check(`the icon comes at 48, 192 and 512, each a PNG id of its size (${sizes.map((s) => s.id).join(", ")})`, JSON.stringify(sizes) === JSON.stringify([48, 192, 512].map((px) => ({ id: String(px), size: { width: px, height: px }, contentType: "image/png" }))), { file: "src/app/icon.tsx" });
  for (const s of sizes) {
    const got = pngSize(Buffer.from(await icon.default({ id: s.id }).arrayBuffer()));
    check(`/icon/${s.id} draws a PNG ${s.id} by ${s.id} (${got ? got.join(" by ") : "no PNG"})`, !!got && got[0] === s.size.width && got[1] === s.size.height, { file: "src/app/icon.tsx" });
  }
  const apple = await tryImport<{ size: { width: number; height: number }; contentType: string; default: () => Response }>(() => import("../../src/app/apple-icon"));
  const appleGot = apple ? pngSize(Buffer.from(await apple.default().arrayBuffer())) : null;
  check(`the home-screen icon is a PNG 180 by 180 (${appleGot ? appleGot.join(" by ") : "no PNG"})`, !!apple && apple.size.width === 180 && apple.size.height === 180 && apple.contentType === "image/png" && !!appleGot && appleGot[0] === 180 && appleGot[1] === 180, { file: "src/app/apple-icon.tsx" });
  const manifest = (await tryImport<{ default: () => Record<string, unknown> }>(() => import("../../src/app/manifest")))?.default() ?? {};
  const icons = (manifest.icons as Array<{ src: string; sizes: string; type: string }>) ?? [];
  check("the manifest names the site, says what it is, opens at the home, is white and read in a browser", manifest.name === "Margin Atlas" && manifest.short_name === "Margin Atlas" && manifest.description === def && manifest.start_url === "/" && manifest.display === "browser" && manifest.theme_color === "white" && manifest.background_color === "white", { file: "src/app/manifest.ts" });
  check(`the manifest's icons are the icon's own 192 and 512 (${icons.map((i) => i.src).join(", ")})`, JSON.stringify(icons) === JSON.stringify([{ src: "/icon/192", sizes: "192x192", type: "image/png" }, { src: "/icon/512", sizes: "512x512", type: "image/png" }]) && icons.every((i) => sizes.some((s) => `/icon/${s.id}` === i.src)), { file: "src/app/manifest.ts" });
  const creamWhite = ["src/app/icon.tsx", "src/app/apple-icon.tsx", "src/app/manifest.ts", LAYOUT].filter((f) => existsSync(f) && /#ffffff/i.test(code(f)));
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
    { file: barrelUsers[0] ?? LAYOUT, remedy: "import the module that holds the export (@/components/kit/frame/AtlasGutters, @/components/kit/WatchTray): the barrel re-exports ProfileChip, whose import of @/lib/taxonomy put industries.json (130 KB of source) into every page's client bundle" },
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
