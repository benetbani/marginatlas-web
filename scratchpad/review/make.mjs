import { readFileSync, writeFileSync } from 'node:fs';
const s = JSON.parse(readFileSync('scratchpad/review/shots.json', 'utf8'));
const img = (k) => '<img src="data:image/jpeg;base64,' + s[k] + '" alt="">';

const fixed = [
  ["The frost was missing from every page",
   "You picked frosted glass for the cards in August, from three shots of your own homepage. It reached the homepage and never reached these four pages. Measured before this: not one card on any of the four had a blur on it. They are glass now, and the photograph behind the page shows through them.",
   "I tested the thing the house rules worry about, that a photograph behind a number costs you the number. Sampling the actual pixels behind every figure on the city page, the worst contrast is comfortably above the accessibility floor, because the white band under the reading column already carries the photo to near-white before a card sits on it."],
  ["The neighbourhood page had seven different card looks",
   "The city page had one card and the neighbourhood page had seven, with different corners, different shadows, some frosted and some not. There is now one card, written once, and every page reads from it.",
   "This had already been done once. That page carried its own copy of the card, under a note saying it matched the shared one. It stopped matching the moment the shared one changed. A note cannot keep two copies equal, so it is one thing now rather than two."],
  ["Seven districts, one label, and it contradicted the page",
   "Every district chip on the neighbourhood page said the same seven words: rent runs heavier than the city. Including South London, which the top of the same page calls the lightest rent in London. Both were true against different yardsticks and no reader can hold that.",
   "Each district now says where it sits in the ranking the page already shows: lightest of 7, 2nd lightest, through to heaviest of 7. Seven identical labels became seven different ones, and being shorter they sit two to a row instead of a seven-row column. The map key also promised a colour that no London district can be; it is now built from what is actually on the map."],
  ["The widest text on any page ran 155 characters a line",
   "The risk notes on the trade page took the whole width of their card. That is about double a comfortable line, and it was the widest text in the whole set.",
   "They are two-up now, so the width is spent on a second note instead of on air, and the note carries a real reading measure. Measured at four screen sizes with the font settled: 52 characters a line on a phone, 73 at desk width. The card got shorter, not longer."],
  ["One passage printed twice on the same page",
   "On the trade-across-places page the same 26 words appeared twice, a few hundred pixels apart. The closing line under the myths was just the warning from higher up the page, glued to a claim that survival beats the folklore, which was asserted for all 243 trades whatever their actual survival.",
   "It now carries the paragraph that says where this trade's money goes and why. That paragraph is written for all 243 trades, the old version of this page rendered it for months, and the rebuilt page had dropped it. That page went from 2,013 visible characters at the start of this effort to 3,043."],
  ["Every city page opened with a half-grey bar",
   "The strip under the city name was built for two facts and every city has one, so half of it was a flat grey block. Thirteen cities render a page and all thirteen had it. It is the first thing on the page.",
   "The strip now sizes to what it holds. Where the grey was, the photograph shows through."],
];

const held = [
  ["Two cards look empty and are not",
   "The money waterfall on the trade page and the map on the neighbourhood page draw themselves in a live browser. The preview I read these in is a frozen picture with nothing running, so they come out blank there and are correct on the site. I nearly reported both as broken. I checked the waterfall's arithmetic to be certain: its parts add to 95 against a 5 kept, which closes, so nothing is stopping it."],
  ["The neighbourhood page still has no written inventory",
   "The other three pages have one. This page was worked on because the audit found faults on it, not from a plan. Its full section list is still owed before anything new is added to it."],
  ["Three written paragraphs still reach no reader",
   "Each of the 243 trades has five written passages about it and the pages use two. The one I connected today was the biggest of the three left. The other two are a candidate list, not a decision."],
  ["Your two open calls from the city page",
   "The chapter called what space costs holds one card and that card is about the cost of living, because there is no commercial-space figure at city level anywhere in the data. Rename the chapter or fold it; I recommend renaming. And the peer-cities strip crowds its labels at phone width."],
];

const html = '<title>London Four, Audit</title>\n<style>\n' + `
:root{--ink:#1b1b1a;--ink2:#565654;--muted:#6f6f6d;--paper:#faf9f8;--card:#fff;--line:#e7e2df;--terra:#c2410c;}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--ink:#f2efec;--ink2:#c3bdb7;--muted:#9a938c;--paper:#17150f;--card:#201d17;--line:#332e26;--terra:#fb8469;}}
:root[data-theme="dark"]{--ink:#f2efec;--ink2:#c3bdb7;--muted:#9a938c;--paper:#17150f;--card:#201d17;--line:#332e26;--terra:#fb8469;}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font:400 16px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:1080px;margin:0 auto;padding:56px 22px 90px}
h1{font-size:clamp(30px,5vw,46px);line-height:1.05;letter-spacing:-.022em;margin:0 0 12px;font-weight:600}
.lede{color:var(--ink2);font-size:18px;max-width:64ch;margin:0 0 10px}
.meta{color:var(--muted);font-size:13.5px;margin:0 0 44px}
h2{font-size:13px;letter-spacing:.11em;text-transform:uppercase;color:var(--muted);font-weight:600;margin:56px 0 18px;padding-bottom:9px;border-bottom:1px solid var(--line)}
.item{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:22px 24px;margin:0 0 14px}
.item h3{margin:0 0 10px;font-size:19px;font-weight:600;letter-spacing:-.012em;line-height:1.3}
.item p{margin:0 0 10px;color:var(--ink2);max-width:76ch}
.item p:last-child{margin-bottom:0}
.item .then{color:var(--muted);font-size:14.5px;border-left:2px solid var(--line);padding-left:14px}
.n{display:inline-block;font-variant-numeric:tabular-nums;color:var(--terra);font-weight:600;margin-right:9px}
.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;margin:0 0 14px}
figure{margin:0;background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden}
figure img{display:block;width:100%;height:auto}
figcaption{padding:11px 15px;font-size:13px;color:var(--muted);border-top:1px solid var(--line)}
.phones{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.tally{display:grid;grid-template-columns:repeat(auto-fit,minmax(148px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:14px;overflow:hidden;margin:0 0 42px}
.tally div{background:var(--card);padding:16px 18px}
.tally b{display:block;font-size:26px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.tally span{font-size:12px;color:var(--muted);letter-spacing:.05em;text-transform:uppercase}
` + '</style>\n<div class="wrap">\n' +
'<h1>The four London pages, checked</h1>\n' +
'<p class="lede">A sanity, usability and layout pass over the city page, the trade page, the trade-across-places page and the neighbourhood page. Six faults found and fixed. Nothing was removed to make a rule pass, and every page is longer or the same, never shorter.</p>\n' +
'<p class="meta">24 August 2026 &middot; every count below was measured in a browser, not estimated</p>\n' +
'<div class="tally">' +
'<div><b>6</b><span>faults fixed</span></div>' +
'<div><b>155&rarr;73</b><span>widest line, characters</span></div>' +
'<div><b>7&rarr;1</b><span>card looks on one page</span></div>' +
'<div><b>0&rarr;39</b><span>frosted cards</span></div>' +
'<div><b>116</b><span>checks passing</span></div>' +
'</div>\n' +
'<h2>The pages as they stand</h2>\n<div class="shots">' +
'<figure>' + img('city') + '<figcaption>The city page. The strip under the name no longer has a grey half.</figcaption></figure>' +
'<figure>' + img('trade') + '<figcaption>The trade page. Cards are glass over the photograph.</figcaption></figure>' +
'<figure>' + img('across') + '<figcaption>The trade across places. Seven chapters, all filled.</figcaption></figure>' +
'<figure>' + img('hood') + '<figcaption>The neighbourhood page. One card look, not seven.</figcaption></figure>' +
'</div>\n<div class="phones">' +
'<figure>' + img('cityPhone') + '<figcaption>City, on a phone</figcaption></figure>' +
'<figure>' + img('hoodPhone') + '<figcaption>Neighbourhoods, on a phone</figcaption></figure>' +
'</div>\n' +
'<h2>What was wrong, and what it is now</h2>\n' +
fixed.map(([t, a, c], i) => '<div class="item"><h3><span class="n">' + String(i + 1).padStart(2, '0') + '</span>' + t + '</h3><p>' + a + '</p><p class="then">' + c + '</p></div>').join('\n') +
'\n<h2>What I did not touch, and why</h2>\n' +
held.map(([t, a]) => '<div class="item"><h3>' + t + '</h3><p>' + a + '</p></div>').join('\n') +
'\n</div>';

writeFileSync('E:/atlas/LONDON-FOUR-AUDIT.html', html, 'utf8');
console.log('  written, ' + Math.round(html.length / 1024) + 'KB');
