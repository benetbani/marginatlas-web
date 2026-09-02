/* how many pixels short is the leader's name in the standing, at each width */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";
const b = await chromium.launch();
for (const w of [1280, 375]) {
  const p = await b.newPage({ viewport: { width: w, height: 1400 } });
  await p.goto(pathToFileURL("E:/atlas/website/docs/loop/artifacts/final-pages/industry-restaurants.html").href, { waitUntil: "load" });
  await p.waitForTimeout(300);
  const r = await p.evaluate(() => {
    const ol = document.querySelector('#neighbours [data-idea="I11"]');
    const rows = [...ol.children].map((li) => {
      const [rank, name, fig] = li.children;
      return {
        name: name.textContent.trim().slice(0, 24),
        nameBox: Math.round(name.getBoundingClientRect().width),
        nameScroll: name.scrollWidth,
        clipped: name.scrollWidth > Math.ceil(name.getBoundingClientRect().width),
        figBox: Math.round(fig.getBoundingClientRect().width),
        rankBox: Math.round(rank.getBoundingClientRect().width),
      };
    });
    const card = document.getElementById("neighbours");
    return { card: Math.round(card.getBoundingClientRect().width), rows };
  });
  console.log("W=", w, JSON.stringify(r, null, 1));
  await p.close();
}
await b.close();
