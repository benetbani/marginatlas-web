/**
 * scripts/spikes/render_palette_check.tsx , renders real routes with
 * react-dom/server and asserts on the class attributes the server emits.
 *
 * WHY A RENDER AND NOT A GREP. A rename that compiles is not a rename that
 * renders. The failure mode this catches is the one a source grep cannot see:
 * a class string left holding the OLD name resolves to no rule at all once the
 * token is gone, so the element does not fall back to a near miss, it loses its
 * background entirely and the page reports 98 green gates while a panel paints
 * nothing. Tailwind emits nothing for an unknown colour and TypeScript has no
 * opinion about the inside of a string.
 *
 * So the assertion is deliberately one-sided and total: after the purge, the
 * word must not appear in ANY attribute of ANY rendered route. Combined with
 * the compiled-stylesheet assertions (every renamed utility emits the same rgb
 * it emitted before), that is what closes "nothing lost its background".
 *
 * Run with the render shims and the real env, since the page bodies query:
 *   npx tsx --env-file=.env.local --require ./scripts/spikes/stub_next_font.cjs \
 *     scripts/spikes/render_palette_check.tsx home gb gb/london
 *
 * BLIND SPOTS, stated. SSR only, so anything that appears on hydration is
 * absent here. Data bands self-omit on this machine because cell lookups
 * exceed their budget from here to eu-west-1, so a band's absence is never a
 * finding. And it proves what the server DECLARES, never what the browser
 * paints: which of two overlapping grounds wins is a screenshot's question.
 */
import { Writable } from "node:stream";

import * as React from "react";
import { renderToPipeableStream } from "react-dom/server";

(globalThis as unknown as { React: typeof React }).React = React;

function renderAll(el: React.ReactElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const sink = new Writable({
      write(chunk, _enc, cb) {
        chunks.push(Buffer.from(chunk));
        cb();
      },
    });
    sink.on("finish", () => resolve(Buffer.concat(chunks).toString("utf8")));
    const { pipe, abort } = renderToPipeableStream(el, {
      onAllReady() {
        pipe(sink);
      },
      onError(e) {
        abort();
        reject(e);
      },
    });
  });
}

type Renderer = (p: {
  params: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string>>;
}) => Promise<React.ReactElement>;

async function renderRoute(route: string): Promise<string> {
  /* "home", not "/": git bash rewrites a lone slash argument into a Windows
     path before node ever sees it. A documented local trap, not a design. */
  if (route === "home") {
    const mod = await import("../../src/app/page");
    const Home = mod.default as unknown as () => Promise<React.ReactElement>;
    return renderAll(await Home());
  }
  /* "site:pricing" renders src/app/(site)/pricing/page. The paramless marketing
     routes are where the surface ramp was used most heavily, so a check that
     only walks the data spine would miss most of what moved. */
  if (route.startsWith("site:")) {
    const mod = await import(`../../src/app/(site)/${route.slice(5)}/page`);
    const P = mod.default as unknown as (p?: unknown) => Promise<React.ReactElement>;
    return renderAll(await P({ searchParams: Promise.resolve({}) }));
  }
  const parts = route.split("/").filter(Boolean);
  if (parts.length === 1) {
    const mod = await import("../../src/app/[country]/page");
    const P = mod.default as unknown as Renderer;
    return renderAll(await P({ params: Promise.resolve({ country: parts[0] }) }));
  }
  if (parts.length === 2) {
    const mod = await import("../../src/app/[country]/[geo]/page");
    const P = mod.default as unknown as Renderer;
    return renderAll(
      await P({ params: Promise.resolve({ country: parts[0], geo: parts[1] }) }),
    );
  }
  const mod = await import("../../src/app/[country]/[geo]/[industry]/page");
  const P = mod.default as unknown as Renderer;
  return renderAll(
    await P({
      params: Promise.resolve({ country: parts[0], geo: parts[1], industry: parts[2] }),
    }),
  );
}

/**
 * The ramp's old name, and the warm values it wore as raw literals.
 *
 * SCOPED TO ATTRIBUTE VALUES, not to the whole document, and the reason is
 * not fastidiousness: this atlas is about businesses, and one of them is an ICE
 * CREAM shop. It is in the homepage trade chips as visible copy. A check that
 * greps the rendered document for the word fails on the product's own subject
 * matter, and the only ways out of that are to weaken the check or to rename a
 * business, both of which are worse than looking in the right place. Colour
 * reaches the page through class, style, fill, stroke and colour attributes.
 */
const BANNED = [/cream/i, /#fbfaf7/i, /#f7f6f4/i, /#efeeeb/i, /#e4e2dd/i, /#c3bfb7/i];
const ATTRS = /\s(?:class|style|fill|stroke|color|stop-color|bgcolor)="([^"]*)"/g;

async function main() {
  const routes = process.argv.slice(2);
  let fails = 0;

  for (const route of routes) {
    let html = "";
    try {
      html = await renderRoute(route);
    } catch (e) {
      console.log(`\n=== ${route}: THREW ${(e as Error).message}`);
      fails++;
      continue;
    }

    const classAttrs = [...html.matchAll(/class="([^"]*)"/g)].map((m) => m[1]);
    const tokens = classAttrs.flatMap((c) => c.split(/\s+/)).filter(Boolean);
    const withBg = classAttrs.filter((c) =>
      /(^|\s)(bg-|from-|via-|to-)/.test(c),
    ).length;
    const tally = (re: RegExp) => tokens.filter((t) => re.test(t)).length;

    console.log(`\n=== ${route} ===`);
    console.log(`  bytes                       ${html.length}`);
    console.log(`  elements with a class       ${classAttrs.length}`);
    console.log(`  elements carrying a ground  ${withBg}`);
    console.log(`  surface-ramp class tokens   ${tally(/-paper-\d/)}`);
    console.log(`  hairline class tokens       ${tally(/-parchment$/)}`);
    console.log(`  white class tokens          ${tally(/^(bg|text|border|ring|fill|from|via|to)-white(\/\d+)?$/)}`);
    console.log(`  atlas-card                  ${tally(/^atlas-card$/)}`);

    const attrValues = [...html.matchAll(ATTRS)].map((m) => m[1]);
    for (const re of BANNED) {
      const hits = attrValues.filter((v) => re.test(v));
      if (hits.length > 0) {
        console.log(`  FAIL  ${re} in ${hits.length} attribute value(s)`);
        /* Print them. A count alone sends the reader back to a source grep,
           which is the instrument that already missed it. */
        for (const h of hits.slice(0, 10)) console.log(`        ${h.slice(0, 200)}`);
        fails++;
      }
    }
    /* An element whose only ground class was a retired token would still be in
       classAttrs, just without a ground. So report any class attribute that
       looks like it wanted a surface and has none, which is the shape the
       failure would take. */
    const orphaned = classAttrs.filter(
      (c) => /(rounded|border)/.test(c) && /-(cream|paper)-\d/.test(c) === false && /bg-/.test(c) === false && /atlas-card/.test(c) === false,
    ).length;
    console.log(`  bordered, no ground (info)  ${orphaned}`);
  }

  console.log(fails === 0 ? "\nALL ROUTES CLEAN" : `\n${fails} FAILURE(S)`);
  process.exit(fails === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
