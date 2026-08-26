import { chromium } from "playwright";
const PAGES = ["city-london", "cell-london-restaurants", "industry-restaurants", "hood-london"];
const b = await chromium.launch();
for (const name of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(`file:///E:/atlas/website/docs/loop/artifacts/final-pages/${name}.html`);
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const shot = await p.screenshot({ clip: { x: 0, y: 300, width: 1440, height: 300 } });
  const px = await p.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width; c.height = img.height;
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0);
    const at = (x, y) => Array.from(g.getImageData(x, y, 1, 1).data).slice(0, 3);
    return {
      gutter_x50: at(50, 150),   // x=50 abs -> deep in .10-alpha gutter zone
      content_x500: at(500, 150), // the gate's actual sample point
      content_x900: at(900, 150), // still inside content zone, different x
    };
  }, shot.toString("base64"));
  console.log(name, JSON.stringify(px));
  await p.close();
}
await b.close();
