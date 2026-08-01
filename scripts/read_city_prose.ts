/**
 * scripts/read_city_prose.ts
 *
 * PRINT THE CITY PAGE MODEL AS PROSE, so it can be read the way a reader reads
 * it rather than the way a compiler reads it.
 *
 * WHY THIS EXISTS. Three real defects on this page type passed TypeScript and
 * every gate in the chain and were caught only by looking at the output as
 * sentences: `favouredTrades` returned "gyms" for five districts out of six,
 * "Cafes" and "cafes" were counted as two different trades, and two trade labels
 * were truncated to "phone" and "repair". None of those is a type error and none
 * of them is visible in markup. They are visible in one glance at prose.
 *
 * It reads the placeholder fixture, so every number it prints is illustrative.
 * It renders nothing and asserts nothing; it is an instrument for a person.
 *
 * Usage: npx tsx scripts/read_city_prose.ts
 */
import { buildCityPage } from "../src/lib/cities/city_adapter";
import type { CityFile } from "../src/lib/cities/city_spine2_types";
import fixture from "../fixtures/city-london.fixture.json";

const m = buildCityPage(fixture as unknown as CityFile);
const out: string[] = [];
const say = (s = "") => out.push(s);

say(`# ${m.meta.city}, ${m.meta.country}   (${m.meta.urlPath})`);
say();

for (const ch of m.chapters) {
  const filled = (m as unknown as Record<string, unknown>)[ch.id];
  say(`## ${ch.num}  ${ch.title}${filled == null ? "   [stated gap]" : ""}`);
  if (filled == null) {
    say();
    continue;
  }

  switch (ch.id) {
    case "hero": {
      const h = m.hero!;
      say(`   ${h.headline}   ${h.headlineLabel}`);
      for (const g of h.glance) {
        say(`   - ${g.label}${g.sub ? ` (${g.sub})` : ""}: ${g.value ?? "not published"}`);
      }
      break;
    }
    case "scorecard": {
      const s = m.scorecard!;
      say(`   midpoint: ${s.baselineLabel}`);
      for (const r of s.rows) {
        say(`   - ${r.label}${r.sub ? ` ${r.sub}` : ""}: ${r.value ?? "not published"}  [pos ${r.position}]`);
      }
      break;
    }
    case "incomeAndWealth": {
      const i = m.incomeAndWealth!;
      say(`   top tenth against the middle: ${i.topTenthVsMiddle ?? "not published"}`);
      for (const r of i.spread) say(`   - ${r.label}: ${r.median} (${r.lo} to ${r.hi})`);
      say(`   paid by card: ${i.paidByCard ?? "not published"}`);
      break;
    }
    case "visitors": {
      const v = m.visitors!;
      say(`   ${v.count ?? "?"} visitors a year, spending ${v.spend ?? "?"}, about ${v.spendPerVisitor ?? "?"} each`);
      say(`   visitor money is ${v.shareOfCitySpend ?? "?"} of all spend here`);
      if (v.peak && v.trough) {
        say(`   busiest ${v.peak.month} (${v.peak.index}), quietest ${v.trough.month} (${v.trough.index}), 100 is the year`);
      }
      if (v.topDistrict) say(`   heaviest district: ${v.topDistrict.name} ${v.topDistrict.share ?? "(share not published)"}`);
      break;
    }
    case "spaceCosts": {
      const s = m.spaceCosts!;
      for (const r of s.sizes) {
        say(`   - ${r.label}, ${r.description}: ${r.area ?? "?"}, ${r.annualCost ?? "not priced"} a year`);
      }
      if (s.costSplit.length) {
        /* Joined on " / ", not ", ". One of the labels IS "Fit-out, spread", so
           a comma join printed four parts as five and read as a defect that was
           not there. An instrument that invents a misreading is worse than no
           instrument. The page renders each part as its own row. */
        say(`   of every 100 spent on a unit: ${s.costSplit.map((c) => `${c.label} ${c.value}`).join(" / ")}`);
      }
      if (s.anchorTrade) {
        const a = s.anchorTrade;
        say(`   a ${a.tradeName.toLowerCase()} takes ${a.area ?? "?"}, does ${a.demandPerDay ?? "?"}, pays ${a.annualSpaceCost ?? "?"} a year`);
      }
      if (s.note) say(`   ${s.note}`);
      break;
    }
    case "tradeEconomics": {
      const t = m.tradeEconomics!;
      for (const r of t.rows) {
        say(`   - ${r.tradeName}: keeps ${r.ownerKeeps} on ${r.revenue}, costs ${r.costToOpen} to open${r.fromCell ? "" : "   [city file, not reconciled]"}`);
      }
      say(`   ${t.reconciled} of ${t.rows.length} rows read from a trade file`);
      break;
    }
    case "districtRent": {
      const d = m.districtRent!;
      say(`   priced unit: ${d.unitPriced}`);
      for (const r of d.rows) {
        say(`   - ${r.name}: ${r.rent ?? "?"} the city rate, ${r.annualUnitCost ?? "not priced here"}`);
      }
      say(`   ${d.priced} of ${d.rows.length} districts have that unit priced`);
      break;
    }
    case "people": {
      const p = m.people!;
      say(`   ${p.residents ?? "?"} residents`);
      for (const b of p.bands) say(`   - ${b.label}: ${b.sharePct}% of households`);
      for (const t of p.types) {
        say(`   - ${t.name} ${t.sharePct}%: ${t.spendingPower}${t.income ? `, ${t.income} after tax` : ""}. ${t.ageRange}. ${t.tenure}. Buys ${t.buys.join(", ")}. Good for ${t.favours.join(", ")}.`);
      }
      break;
    }
    case "districts": {
      const d = m.districts!;
      for (const r of d.rows) {
        say(`   - ${r.name} (${r.rent ?? "rent not priced"}): ${r.blurb}`);
        say(`     lives here ${r.resident ?? "?"} / by day ${r.daytime ?? "?"}`);
        say(`     mostly ${r.mix.map((x) => `${x.name.toLowerCase()} ${x.sharePct}%`).join(", ") || "(mix not filled)"}${r.scarce.length ? `; few ${r.scarce.map((s) => s.toLowerCase()).join(" or ")}` : ""}`);
        say(`     tilts towards ${r.favours.join(", ") || "(nothing stands out)"}`);
      }
      if (d.note) say(`   ${d.note}`);
      break;
    }
    case "tradeFit": {
      const t = m.tradeFit!;
      for (const r of t.rows) {
        const works = r.levels.filter((l) => l.level === "good").map((l) => l.district);
        say(`   - ${r.tradeName}: best in ${r.best ?? "nowhere in particular"}; also ${works.join(" / ") || "nowhere else"}`);
      }
      break;
    }
    case "direction": {
      for (const t of m.direction!.tiles) {
        say(`   - ${t.label} (${t.caption}): ${t.change ?? (t.direction === "up" ? "rising" : "falling")}`);
      }
      break;
    }
    case "myths": {
      const y = m.myths!;
      say(`   claim: ${y.claim ?? "(none)"}`);
      say(`   reality: ${y.reality ?? "(none)"}`);
      if (y.comparison) {
        const c = y.comparison;
        say(`   ${c.tradeName}: ${c.hereCity} ${c.hereRevenue} revenue keeping ${c.hereKeeps}; ${c.peerCity} ${c.peerRevenue} keeping ${c.peerKeeps}`);
        say(`   derived: ${c.revenueGapPct}% more revenue, ${c.keepsGapPct}% more kept`);
      }
      if (y.note) say(`   ${y.note}`);
      break;
    }
    case "peers": {
      for (const r of m.peers!.rows) say(`   - ${r.city}: ${r.value}${r.isThisCity ? "  [this city]" : ""}`);
      break;
    }
    case "watch": {
      const w = m.watch!;
      for (const p of w.pressures) say(`   - ${p.label}: ${p.value}  [severity ${p.severity}]`);
      for (const l of w.localKnowledge) say(`   . ${l}`);
      break;
    }
    case "voices": {
      for (const q of m.voices!.quotes) {
        say(`   "${q.quote}"`);
        say(`     ${q.trade}, ${q.district}${q.pull ? ` , ${q.pull}${q.pullNote ? ` ${q.pullNote}` : ""}` : "  [no figure printed]"}`);
      }
      break;
    }
    case "verdict": {
      say(`   ${m.verdict!.text}`);
      say(`   chips: ${m.verdict!.chips.join(" / ")}`);
      break;
    }
    case "methodology": {
      const md = m.methodology!;
      for (const r of md.rows) say(`   - ${r.figure} [${r.tier}]: ${r.how}`);
      say(`   derived counts: ${md.counts.measured} measured, ${md.counts.built} built, ${md.counts.thin} thin`);
      break;
    }
    case "next": {
      for (const t of m.next!.tiles) say(`   - ${t.label}: ${t.gloss}${t.href ? `  -> ${t.href}` : "  [no page yet]"}`);
      break;
    }
    default:
      say(`   (rendered, no prose printer)`);
  }
  say();
}

if (m.remember != null) {
  say(`## the closing band`);
  say(`   ${m.remember.text}`);
  say(`   ${m.remember.figure ?? "?"}   ${m.remember.figureLabel}`);
  say();
}

const gaps = m.chapters.filter((c) => (m as unknown as Record<string, unknown>)[c.id] == null);
say(`${m.chapters.length - gaps.length} of ${m.chapters.length} chapters filled; ${gaps.length} stated gaps: ${gaps.map((g) => g.id).join(", ")}`);

console.log(out.join("\n"));
