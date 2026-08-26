const {chromium}=require('playwright');
const fs=require('fs');
const SECTIONS=[
 ['Quick reads','The city\u2019s conditions','RESTORED. Six reads built from measured fields, plus how many days to register a business.'],
 ['Cost of living against peer cities','What space costs','RENAMED. It was called "Rent against peer cities" and is not built on rent.'],
 ['The spending pool','Who buys, and when','REPLACED. The figures it wanted have no source; it now shows how evenly the money is spread.'],
 ['Trades with local figures','What you can open here','RESTORED as a funnel with no ranking, because every ranking metric is banned at city level.'],
 ['The pick, and where to take it','The next move','REFRAMED. It was recommending a trade chosen by a banned score.'],
];
(async()=>{const b=await chromium.launch();
const shots={};
for (const w of [1280,375]){
  const p=await b.newPage({viewport:{width:w,height:1000}});
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
  await p.waitForTimeout(800);
  for (const [title] of SECTIONS){
    const h=await p.evaluateHandle((t)=>{
      const n=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&e.textContent.trim()===t);
      let c=n; for(let i=0;i<8&&c;i++){c=c.parentElement; if(c&&/rounded-\[14px\]/.test((c.className||'').toString()))return c;}
      return n;},title);
    const el=h.asElement();
    if(el){const buf=await el.screenshot(); shots[title+'-'+w]='data:image/png;base64,'+buf.toString('base64');}
  }
  await p.close();
}
await b.close();
const rows=SECTIONS.map(([t,ch,note],i)=>`
<section>
  <div class="chap">Chapter: ${ch}</div>
  <h2>${i+1}. ${t}</h2>
  <p>${note}</p>
  <div class="lab">Reading width</div><img src="${shots[t+'-1280']||''}" alt="">
  <div class="lab">Phone</div><img class="ph" src="${shots[t+'-375']||''}" alt="">
  <div class="verdict">APPROVE&nbsp;&nbsp;/&nbsp;&nbsp;REJECT&nbsp;&nbsp;<span class="hint">paste back: ${i+1}=A or ${i+1}=R</span></div>
</section>`).join('');
fs.mkdirSync('docs/loop/artifacts/review',{recursive:true});
fs.writeFileSync('docs/loop/artifacts/review/london-city-review.html',`<!doctype html><meta charset="utf-8">
<title>London city page, five sections for your verdict</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}body{margin:0;padding:30px 18px 70px;background:#fafaf9;color:#1b1b1a;font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.55}
h1{font-size:23px;font-weight:500;margin:0 0 10px}h2{font-size:16px;font-weight:600;margin:2px 0 4px}
p{color:#57575b;margin:0 0 12px;max-width:70ch}
section{background:#fff;border:1px solid #e7e2df;border-radius:12px;padding:18px;margin:22px 0}
.chap{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e}
.lab{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#9a9a9e;margin:14px 0 6px}
img{max-width:100%;border:1px solid #eee7e3;border-radius:8px;display:block}
img.ph{max-width:340px}
.verdict{margin-top:16px;padding-top:14px;border-top:1px solid #e7e2df;font-weight:600;letter-spacing:.04em}
.hint{font-weight:400;color:#9a9a9e;letter-spacing:0}
.intro{background:#fff;border:1px solid #e7e2df;border-radius:12px;padding:16px 18px}
b{color:#1b1b1a}
footer{margin-top:36px;font-size:12px;color:#8c8c8a;max-width:70ch}
</style>
<h1>London city page, five sections for your verdict</h1>
<div class="intro">
<p><b>The page went from four chapters to six.</b> Nothing on it is empty or thin. Five sections changed; they are below, at reading width and on a phone.</p>
<p><b>Paste back one line</b>, for example <b>1=A 2=A 3=R 4=A 5=A</b>. A bare R with no reason is fine.</p>
<p><b>Two things are yours to decide, and neither is below.</b> The chapter "What space costs" now holds one card and that card is about the cost of living, because the page carries no commercial-space figure at city level at all. Rename the chapter, or fold the card into the conditions chapter and lose the chapter. I would rename it. Second: the peer strip crowds its labels at phone width, and fixing it needs pixel widths this page does not have, so it is a design call.</p>
</div>
${rows}
<footer>Five more sections on this page stay dark, each with a written reason: three have no knowable figure anywhere in the data, two need metrics your rules ban at city level. None was deleted. Nothing here is published anywhere.</footer>`);
console.log('  wrote docs/loop/artifacts/review/london-city-review.html');
})();
