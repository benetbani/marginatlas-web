/* throwaway (loop run F, row 2): look at the two things the two repaired
   documents describe.
   (1) the city page where the blueprint now says section 8 is dark, so the
       band that lost its card can be judged as a reader sees it;
   (2) the legal-form table's OPEN panel and its five-tier shape, which is what
       the corrected proof asserts on and which no static page render can show. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const b = await chromium.launch();

for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 2 });
  await p.goto(pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html").href, { waitUntil: "load" });
  await p.waitForTimeout(300);
  const geo = await p.evaluate(() => {
    const ids = [...document.querySelectorAll("main [id]")].map((e) => e.id);
    const seasonal = document.getElementById("seasonal");
    const band = seasonal && seasonal.parentElement;
    const r = (e) => { const q = e.getBoundingClientRect(); return { x: Math.round(q.x + scrollX), y: Math.round(q.y + scrollY), w: Math.round(q.width), h: Math.round(q.height) }; };
    return {
      ids,
      spacePresent: !!document.getElementById("space"),
      seasonal: seasonal ? r(seasonal) : null,
      band: band ? r(band) : null,
      bandChildren: band ? band.children.length : null,
      bandCols: band ? getComputedStyle(band).gridTemplateColumns : null,
    };
  });
  console.log("city", w, JSON.stringify(geo));
  if (geo.band) {
    await p.screenshot({
      path: `scratchpad/loopF/city-seasonal-band-${w}.jpeg`,
      quality: 84, type: "jpeg", fullPage: true,
      clip: { x: Math.max(0, geo.band.x - 16), y: Math.max(0, geo.band.y - 16), width: Math.min(w, geo.band.w + 32), height: geo.band.h + 32 },
    });
  }
  await p.close();
}

/* The branch harness: case 2 is Germany's five tiers (two rows both named LLC),
   case 6 is the shipped panel markup with the disclosure OPEN. */
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1200 }, deviceScaleFactor: 2 });
  await p.goto(pathToFileURL("E:/atlas/website/scratchpad/loop9/b8-branches.html").href, { waitUntil: "load" });
  await p.waitForTimeout(400);
  const boxes = await p.evaluate(() => {
    const secs = [...document.querySelectorAll("section")];
    const pick = (needle) => secs.find((s) => (s.textContent || "").includes(needle));
    const r = (e) => { const q = e.getBoundingClientRect(); return { x: Math.round(q.x + scrollX), y: Math.round(q.y + scrollY), w: Math.round(q.width), h: Math.round(q.height) }; };
    const five = pick("FIVE TIERS");
    const open = secs[secs.length - 1];
    return { five: five ? r(five) : null, open: open ? r(open) : null, openText: open ? (open.textContent || "").slice(0, 40) : null };
  });
  console.log("harness", w, JSON.stringify(boxes));
  for (const [name, bx] of Object.entries({ five: boxes.five, open: boxes.open })) {
    if (!bx) continue;
    await p.screenshot({
      path: `scratchpad/loopF/b8-${name}-${w}.jpeg`,
      quality: 84, type: "jpeg", fullPage: true,
      clip: { x: Math.max(0, bx.x - 8), y: Math.max(0, bx.y - 8), width: Math.min(w, bx.w + 16), height: Math.min(bx.h + 16, 4000) },
    });
  }
  await p.close();
}

await b.close();
