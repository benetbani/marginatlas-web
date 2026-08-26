const {chromium}=require('playwright');
const P=[['city-london','CITY'],['cell-london-restaurants','CELL'],['hood-london','HOOD'],['industry-restaurants','INDUSTRY']];
(async()=>{const b=await chromium.launch();
for(const [f,label] of P){
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/'+f+'.html');
  await p.waitForTimeout(500);
  const r=await p.evaluate(()=>({c:document.body.innerText.replace(/\s+/g,' ').trim().length,
    h2:document.querySelectorAll('h2').length,h3:document.querySelectorAll('h3').length}));
  console.log('  '+label.padEnd(10)+String(r.c).padStart(7)+' chars   '+r.h2+' chapters, '+r.h3+' sections');
  await p.close();}
await b.close();})();
