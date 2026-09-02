/* throwaway (loop run F, row 1): pixel-compare the before/after photographs.
   A gate going green is not evidence a colour held; two identical images are. */
import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 400, height: 300 } });
await p.goto(pathToFileURL("E:/atlas/website/scratchpad/loopF/blank.html").href);
for (const name of ["home", "cell", "country"]) {
  for (const w of [1280, 375]) {
    const r = await p.evaluate(async ([a, c]) => {
      const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
      const [ia, ib] = await Promise.all([load(a), load(c)]);
      if (ia.width !== ib.width || ia.height !== ib.height) return { size: `${ia.width}x${ia.height} vs ${ib.width}x${ib.height}` };
      const mk = (img) => { const cv = document.createElement("canvas"); cv.width = img.width; cv.height = img.height; cv.getContext("2d").drawImage(img, 0, 0); return cv.getContext("2d").getImageData(0, 0, img.width, img.height).data; };
      const da = mk(ia), db = mk(ib);
      let diff = 0, worst = 0, firstAt = null;
      for (let k = 0; k < da.length; k += 4) {
        const d = Math.abs(da[k] - db[k]) + Math.abs(da[k + 1] - db[k + 1]) + Math.abs(da[k + 2] - db[k + 2]);
        if (d > 6) { diff++; if (d > worst) worst = d; if (firstAt === null) firstAt = { x: (k / 4) % ia.width, y: Math.floor((k / 4) / ia.width) }; }
      }
      return { w: ia.width, h: ia.height, px: ia.width * ia.height, diff, worst, firstAt };
    }, [pathToFileURL(`E:/atlas/website/scratchpad/loopF/${name}-before-${w}.jpeg`).href, pathToFileURL(`E:/atlas/website/scratchpad/loopF/${name}-after-${w}.jpeg`).href]);
    console.log(name, w, JSON.stringify(r));
  }
}
await b.close();
