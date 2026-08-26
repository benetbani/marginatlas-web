const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('file:///E:/atlas/website/docs/loop/artifacts/final-pages/city-london.html');
await p.waitForTimeout(700);
/* Sample the REAL composited pixels by drawing the page's own screenshot into a
   canvas in the page context, which avoids needing an image library. */
const shot=(await p.screenshot({type:'png'})).toString('base64');
const r=await p.evaluate(async (data)=>{
  const card=[...document.querySelectorAll('*')].find(e=>/rounded-\[14px\]/.test((e.className||'').toString()));
  const bb=card.getBoundingClientRect();
  const img=new Image();
  await new Promise(res=>{img.onload=res;img.src='data:image/png;base64,'+data;});
  const cv=document.createElement('canvas');cv.width=img.width;cv.height=img.height;
  const cx=cv.getContext('2d');cx.drawImage(img,0,0);
  const at=(x,y)=>{const d=cx.getImageData(Math.round(x),Math.round(y),1,1).data;return [d[0],d[1],d[2]];};
  return {inside:at(bb.left+bb.width/2,bb.top+8), outside:at(Math.max(2,bb.left-14),bb.top+20)};
},shot);
await b.close();
const lum=([r0,g0,b0])=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(r0)+0.7152*f(g0)+0.0722*f(b0)};
const ratio=(a,bb)=>{const L1=lum(a),L2=lum(bb);return ((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05)).toFixed(2)};
console.log('  inside a card:  rgb('+r.inside.join(',')+')');
console.log('  just outside:   rgb('+r.outside.join(',')+')  <- the real ground');
console.log('  muted  rgb(111,111,109) on the card: '+ratio([111,111,109],r.inside)+(ratio([111,111,109],r.inside)>=4.5?'  AA pass':'  AA FAIL'));
console.log('  body   rgb(86,86,84)    on the card: '+ratio([86,86,84],r.inside));
console.log('  ink    rgb(27,27,26)    on the card: '+ratio([27,27,26],r.inside));
})();
