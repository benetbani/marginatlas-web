/* Build the two candidate forms with REAL data, as a review-sheet crop.
   This is the sanctioned path in rules/FORM-CATALOG.md "Adding a form": a named
   source, a rendered candidate at real size with real page data, then one
   founder click. Nothing is mounted in src/ until that click.

   Both candidates are drawn with the site's own tokens and its ratified faces so
   what he judges is the form, not a mock in someone else's skin. */
import { readFileSync, writeFileSync } from "node:fs";

const rent = JSON.parse(readFileSync("src/lib/finance/commercial_rent_2024.json", "utf8"));

/* ---- CANDIDATE A: rent across the cities of one country ---- */
const ISO = "GB";
const rows = Object.values(rent.cities)
  .filter((c) => c.iso2 === ISO)
  .map((c) => ({ name: c.city, v: c.usd_per_sqm_per_year }))
  .sort((a, b) => b.v - a.v);
const max = Math.max(...rows.map((r) => r.v));
const median = rent.country_medians[ISO] ?? null;

/* ---- CANDIDATE B: the one real series in the building ---- */
/* THE KEY FIX, DEMONSTRATED RATHER THAN DESCRIBED: this file spells the United
   Kingdom `UK`, not the ISO `GB` the site's routes use. Joining on ISO2 returns
   nothing and the section self-omits, which reads as "no data" instead of
   "wrong key". */
const CPI_ALIAS = { GB: "UK" };
const cpiKey = CPI_ALIAS[ISO] ?? ISO;
const cpi = readFileSync("data/external/brain-skeleton/world_bank_cpi.csv", "utf8")
  .split("\n").slice(1)
  .map((l) => l.trim().split(","))
  .filter((p) => p.length === 3 && p[0] === cpiKey)
  .map((p) => ({ year: Number(p[1]), v: Number(p[2]) }))
  .filter((p) => p.year >= 2005 && Number.isFinite(p.v))
  .sort((a, b) => a.year - b.year);

/* Year-on-year inflation, derived from the index. Never the index itself: a
   reader cannot read "cpi_2010_100 = 134" but everyone reads "3.2% a year". */
const infl = cpi.slice(1).map((p, i) => ({
  year: p.year,
  pct: ((p.v / cpi[i].v) - 1) * 100,
}));
const lo = Math.min(...infl.map((p) => p.pct));
const hi = Math.max(...infl.map((p) => p.pct));
const last = infl[infl.length - 1];

const W = 560, H = 120, PAD = 8;
const x = (i) => PAD + (i * (W - PAD * 2)) / (infl.length - 1);
const y = (v) => H - PAD - ((v - Math.min(0, lo)) / (hi - Math.min(0, lo))) * (H - PAD * 2);
const line = infl.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.pct).toFixed(1)}`).join(" ");
const zeroY = y(0).toFixed(1);

const bars = rows.map((r) => `
      <div class="row">
        <div class="nm">${r.name}</div>
        <div class="track"><span class="fill${r.v === max ? " lead" : ""}" style="width:${((r.v / max) * 100).toFixed(1)}%"></span></div>
        <div class="v fig">$${r.v.toLocaleString("en-US")}</div>
      </div>`).join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Two candidate forms</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap">
<style>
  :root{--paper:#f7f7f8;--card:#fff;--rail:#e3e3e3;--ink:#0d0d0e;--ink2:#4a4a4d;--muted:#5f5f67;
        --terra:#c23a22;--terra-deep:#9e2e1b;--n4:#c0c0c4;
        --sans:"Geist",ui-sans-serif,system-ui,sans-serif;--fig:"Space Grotesk",ui-monospace,monospace;}
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:14px;line-height:1.55}
  .wrap{max-width:720px;margin:0 auto;padding:28px 24px 48px;display:flex;flex-direction:column;gap:22px}
  .fig{font-family:var(--fig);font-variant-numeric:tabular-nums lining-nums}
  .card{background:var(--card);border:1px solid var(--rail);border-radius:12px;padding:20px 22px;
        box-shadow:0 1px 2px rgba(20,16,12,.05),0 12px 32px -14px rgba(20,16,12,.14)}
  .lab{font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.13em;color:var(--muted)}
  h2{font-family:var(--fig);font-weight:600;font-size:19px;letter-spacing:-.014em;margin:6px 0 3px}
  .sub{font-size:13px;color:var(--ink2);margin:0 0 16px;max-width:60ch}
  .row{display:grid;grid-template-columns:118px 1fr 78px;align-items:center;gap:12px;padding:5px 0}
  .nm{font-size:13px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .track{height:9px;background:var(--rail);border-radius:2px;position:relative;overflow:hidden}
  .fill{position:absolute;inset-y:0;left:0;top:0;bottom:0;background:var(--n4);border-radius:2px}
  .fill.lead{background:var(--terra)}
  .v{font-size:13px;text-align:right;font-weight:500}
  .foot{margin-top:14px;padding-top:12px;border-top:1px solid var(--rail);font-size:11.5px;color:var(--muted)}
  svg{display:block;width:100%;height:auto}
</style></head><body><div class="wrap">

  <div class="card">
    <div class="lab">What space costs</div>
    <h2>Commercial rent across the United Kingdom</h2>
    <p class="sub">Per square metre a year, so a shop in Leeds and a shop in London are the same
      measurement. The national middle is $${median}.</p>
    ${bars}
    <div class="foot">Estimation only. Real rent moves with the street, the building and the lease.</div>
  </div>

  <div class="card">
    <div class="lab">What money does here</div>
    <h2>Inflation, ${infl[0].year} to ${last.year}</h2>
    <p class="sub">Prices rose <strong class="fig">${last.pct.toFixed(1)}%</strong> in ${last.year}.
      Over ${infl.length} years the range was
      <span class="fig">${lo.toFixed(1)}%</span> to <span class="fig">${hi.toFixed(1)}%</span>.</p>
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Yearly inflation, ${infl[0].year} to ${last.year}">
      <line x1="${PAD}" y1="${zeroY}" x2="${W - PAD}" y2="${zeroY}" stroke="var(--rail)" stroke-width="1"/>
      <path d="${line}" fill="none" stroke="var(--terra)" stroke-width="1.75" stroke-linejoin="round"/>
      <circle cx="${x(infl.length - 1).toFixed(1)}" cy="${y(last.pct).toFixed(1)}" r="3.5" fill="var(--terra-deep)"/>
    </svg>
    <div class="foot">A zero line is drawn, so a fall reads as a fall. ${infl.length} real yearly points, none interpolated.</div>
  </div>

</div></body></html>`;

writeFileSync("scratchpad/candidates.html", html);
console.log("rent rows      : " + rows.length + " cities, $" + Math.min(...rows.map((r) => r.v)) + " to $" + max);
console.log("inflation      : " + infl.length + " years, " + infl[0].year + "-" + last.year +
  ", range " + lo.toFixed(1) + "% to " + hi.toFixed(1) + "%");
console.log("cpi key used   : " + cpiKey + "  (site route says " + ISO + ")");
console.log("wrote scratchpad/candidates.html");
