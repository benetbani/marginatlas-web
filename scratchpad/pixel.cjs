const {chromium}=require('playwright');
const {PNG}=(()=>{try{return require('pngjs')}catch(e){return {}}})();
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
await p.waitForTimeout(700);
const r=await p.evaluate(()=>{
  const card=[...document.querySelectorAll('*')].find(e=>/rounded-\[14px\]/.test((e.className||'').toString()));
  const b=card.getBoundingClientRect();
  return {x:Math.round(b.left+b.width/2), y:Math.round(b.top+8), gx:Math.round(b.left-14), gy:Math.round(b.top+20)};
});
const buf=await p.screenshot({clip:{x:0,y:0,width:1280,height:900}});
await b.close();
if(!PNG){console.log('  pngjs unavailable; sampled coordinates only: card('+r.x+','+r.y+') ground('+r.gx+','+r.gy+')');return;}
const png=PNG.sync.read(buf);
const at=(x,y)=>{const i=(png.width*y+x)<<2;return [png.data[i],png.data[i+1],png.data[i+2]];};
const c=at(r.x,r.y), g=at(r.gx,r.gy);
console.log('  pixel INSIDE a card:  rgb('+c.join(',')+')');
console.log('  pixel just OUTSIDE:   rgb('+g.join(',')+')   <- the real ground the card sits on');
const lum=([r0,g0,b0])=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(r0)+0.7152*f(g0)+0.0722*f(b0)};
const ratio=(a,bb)=>{const L1=lum(a),L2=lum(bb);return ((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)).toFixed(2)};
console.log('  muted text rgb(111,111,109) on the card pixel: '+ratio([111,111,109],c));
console.log('  body  text rgb(86,86,84)   on the card pixel: '+ratio([86,86,84],c));
})();
