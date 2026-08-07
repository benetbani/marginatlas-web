#!/usr/bin/env node
/**
 * scripts/loop/mobile.mjs , does a RENDERED route survive a phone?
 *
 * WHY THIS EXISTS. `audit_overflow.mjs` measures the founder's mockup HTML in
 * `design/mockups/*.html`. It cannot see a Next route at all, so nothing in the
 * repository has ever checked a rendered page at phone width, on a project
 * where mobile is a standing emphasis. The plan for tonight told a worker to
 * run the overflow audit against `/dev/home3` and it would have failed with a
 * usage error.
 *
 * THREE THINGS IT CHECKS, and each is a rule with a source:
 *
 *   SIDEWAYS SCROLL  the document is wider than the viewport. A page that
 *                    scrolls horizontally on a phone is broken, not
 *                    stylistically imperfect. Reported with the widest
 *                    offending elements, because the document is never the
 *                    culprit, something inside it is.
 *
 *   TAP TARGET       DESIGN.md: "Tap targets 40px minimum." A 16px glyph needs
 *                    12px of padding around it to clear the floor. Anything
 *                    interactive and visible under 40px in either axis is
 *                    listed with its measured size.
 *
 *   CLIPPED VALUE    the `.v` figure column at phone width. `--val-col` is
 *                    tuned at desktop and a narrower column clips silently,
 *                    mid-word, with no ellipsis, exactly as it does at 1440.
 *
 * ONE BROWSER, ONE PAGE AT A TIME, and it closes between routes. This box has
 * had a dev server plus a second Chromium kill it six times in one night.
 *
 * USAGE
 *   node scripts/loop/mobile.mjs /dev/home3
 *   node scripts/loop/mobile.mjs /world /industries --width 390
 *
 * EXIT 0 clean, 1 findings, 2 a route could not be read.
 */
import { chromium } from "playwright";

const argv = process.argv.slice(2);
const flag = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : d;
};

/* Git Bash rewrites any argument starting with a slash into a path under its
   own install directory. Same guard as prose.mjs and audit_row_layout.mjs; it
   has now bitten three separate tools in one night. */
const unmangle = (a) => {
  const m = a.match(/^[A-Za-z]:[\\/](?:Program Files[\\/])?Git[\\/](.*)$/i);
  return m ? "/" + m[1].replace(/\\/g, "/") : a;
};

const BASE = flag("base", "http://localhost:3210");
const WIDTH = Number(flag("width", 390));
const HEIGHT = Number(flag("height", 844));
const TAP = Number(flag("tap", 40));

const routes = argv
  .map(unmangle)
  .filter((a) => a.startsWith("/") && !a.startsWith("--"));

if (!routes.length) {
  console.error("usage: node scripts/loop/mobile.mjs /dev/home3 [/world ...] [--width 390]");
  process.exit(1);
}

const browser = await chromium.launch();
let findings = 0;
let unreadable = 0;

for (const route of routes) {
  const page = await browser.newPage({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  console.log(`\n${"=".repeat(66)}\n${route}   ${WIDTH}x${HEIGHT}\n${"=".repeat(66)}`);

  let res;
  try {
    res = await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 180000 });
  } catch (e) {
    console.log(`  UNREADABLE: ${e.message.split("\n")[0]}`);
    console.log(`  If this is localhost, the dev server may have died. Restart before trusting anything else.`);
    unreadable++;
    await page.close();
    continue;
  }

  if (!res || res.status() !== 200) {
    console.log(`  HTTP ${res ? res.status() : "?"} , not a readable page.`);
    unreadable++;
    await page.close();
    continue;
  }

  const out = await page.evaluate(
    ({ vw, tap }) => {
      const r = { docWidth: document.documentElement.scrollWidth, wide: [], taps: [], clipped: [] };

      /* WIDEST OFFENDERS. The document being too wide is the symptom; the
         culprit is a descendant whose right edge crosses the viewport. Sorted
         worst first and capped, because one runaway element usually drags a
         dozen ancestors over with it and listing all of them buries the cause. */
      if (r.docWidth > vw + 1) {
        const seen = [];
        document.querySelectorAll("body *").forEach((el) => {
          const b = el.getBoundingClientRect();
          if (b.width === 0 || b.height === 0) return;
          const over = Math.round(b.right - vw);
          if (over > 1) {
            seen.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className && typeof el.className === "string" ? el.className : "").slice(0, 45),
              over,
              width: Math.round(b.width),
              text: (el.textContent || "").trim().slice(0, 40),
            });
          }
        });
        seen.sort((a, b) => b.over - a.over);
        r.wide = seen.slice(0, 8);
      }

      /* TAP TARGETS. Only things a finger is meant to hit, and only ones that
         are actually visible: a collapsed <details> hides its contents and
         those are not targets until it opens. */
      document.querySelectorAll('a,button,summary,[role="button"],input,select').forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) return;
        const st = getComputedStyle(el);
        if (st.visibility === "hidden" || st.display === "none") return;
        if (b.width < tap || b.height < tap) {
          r.taps.push({
            tag: el.tagName.toLowerCase(),
            w: Math.round(b.width),
            h: Math.round(b.height),
            text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 38),
          });
        }
      });

      /* CLIPPED FIGURES at this width. Same defect as the desktop audit: the
         value column is fixed and a longer string is cut with no ellipsis. */
      document.querySelectorAll(".statblock .row .v").forEach((v) => {
        if (v.scrollWidth > v.clientWidth + 1) {
          r.clipped.push({
            value: (v.textContent || "").trim(),
            needs: v.scrollWidth,
            has: v.clientWidth,
          });
        }
      });

      return r;
    },
    { vw: WIDTH, tap: TAP },
  );

  if (out.docWidth > WIDTH + 1) {
    findings++;
    console.log(`  SIDEWAYS SCROLL: document is ${out.docWidth}px in a ${WIDTH}px viewport.`);
    for (const w of out.wide) {
      console.log(`    +${w.over}px  <${w.tag}> ${w.cls ? "." + w.cls.split(/\s+/).join(".") : ""}  w=${w.width}  "${w.text}"`);
    }
  } else {
    console.log(`  ok  no sideways scroll (${out.docWidth}px)`);
  }

  if (out.taps.length) {
    findings++;
    const uniq = [];
    const key = (t) => `${t.tag}|${t.w}x${t.h}|${t.text}`;
    const seen = new Set();
    for (const t of out.taps) if (!seen.has(key(t))) { seen.add(key(t)); uniq.push(t); }
    console.log(`  TAP TARGETS under ${TAP}px: ${out.taps.length} (${uniq.length} distinct)`);
    for (const t of uniq.slice(0, 12)) {
      console.log(`    ${t.w}x${t.h}  <${t.tag}>  "${t.text}"`);
    }
  } else {
    console.log(`  ok  every tap target clears ${TAP}px`);
  }

  if (out.clipped.length) {
    findings++;
    console.log(`  CLIPPED VALUES: ${out.clipped.length}`);
    for (const c of out.clipped) console.log(`    has ${c.has}px, needs ${c.needs}px: "${c.value}"`);
  } else {
    console.log(`  ok  no clipped figures`);
  }

  await page.close();
}

await browser.close();
console.log(`\n${findings === 0 && unreadable === 0 ? "MOBILE: PASS" : `MOBILE: ${findings} finding(s), ${unreadable} unreadable`}`);
process.exit(unreadable ? 2 : findings ? 1 : 0);
