import { chromium } from 'playwright';
const b = await chromium.launch();
const pages = ['city-london','cell-london-restaurants','industry-restaurants','hood-london'];
for (const name of pages) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/' + name + '.html');
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const band = document.querySelector('.spine-band');
    const bandBg = band ? getComputedStyle(band).backgroundImage : 'NO BAND ELEMENT';
    const glass = [...document.querySelectorAll('*')].filter(e => {
      const s = getComputedStyle(e);
      return (s.backdropFilter && s.backdropFilter !== 'none') || (s.webkitBackdropFilter && s.webkitBackdropFilter !== 'none');
    });
    const photo = [...document.querySelectorAll('.spine-frame-layer')].map(e => {
      const s = getComputedStyle(e);
      return { op: s.opacity, img: s.backgroundImage.slice(0, 40) };
    });
    return {
      band: bandBg.slice(0, 90),
      glassCount: glass.length,
      glassSample: glass[0] ? getComputedStyle(glass[0]).backdropFilter + ' / ' + getComputedStyle(glass[0]).backgroundColor : '-',
      layers: photo,
    };
  });
  console.log('\n  ' + name);
  console.log('    band           ' + r.band);
  console.log('    glass cards    ' + r.glassCount + '   ' + r.glassSample);
  r.layers.forEach((l, i) => console.log('    layer ' + i + '        opacity ' + l.op + '  ' + l.img));
  await p.close();
}
await b.close();
