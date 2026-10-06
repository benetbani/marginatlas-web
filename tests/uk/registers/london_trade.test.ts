/**
 * A London trade's register figures (data/uk/registers/turnover.json, Greater London E12000007): the counts, the median and
 * quartiles read from the band counts once, the share under 100,000 pounds, and the code's group named where the trade
 * shares its code or only approximates it. Expected figures agree with tests/uk/pnl/banded.test.ts (the Python estimator's).
 *
 * Run: npx tsx tests/uk/registers/london_trade.test.ts
 */
import { londonTradeRegister, londonTradeSales, SHARED_GROUP } from "../../../src/lib/uk/registers/london_trade";
import turnoverJson from "../../../data/uk/registers/turnover.json";
import { red, redSummary } from "../../../scripts/lib/red";

const RULE = "uk-london-trade";
const FILE = "src/lib/uk/registers/london_trade.ts";
const REMEDY = "fix london_trade.ts; a shared code without a plain name in SHARED_GROUP gets one written there from its official name, never guessed from the trade";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const r = londonTradeRegister("restaurants");
check("restaurants: 7,865 enterprises and 9,560 local units in Greater London", r !== null && r.enterprises === 7865 && r.localUnits === 9560);
check("restaurants: an exact match, so no group name", r !== null && r.match === "exact" && r.group === null);
const s = londonTradeSales("restaurants");
check("restaurants: the median from the band counts, 281,941.82 pounds", s !== null && s.medianGbp !== null && Math.abs(s.medianGbp - 281_941.82) < 0.01);
check("restaurants: the median's range from the file (280,659 to 283,227 pounds) holds the median", s !== null && s.medianRangeGbp !== null && s.medianRangeGbp[0] === 280_659 && s.medianRangeGbp[1] === 283_227);
check("restaurants: the lower and upper quartiles 124,596.43 and 759,125.14, neither in an open band", s !== null && s.q25.open === false && s.q75.open === false && Math.abs(s.q25.gbp - 124_596.43) < 0.01 && Math.abs(s.q75.gbp - 759_125.14) < 0.01);
check("restaurants: 18.1 of 100 take under 100,000 pounds", s !== null && Math.abs(s.shareUnder100k - 0.181) < 0.0005);

const b = londonTradeRegister("barbershops");
check("barbershops: the shared hair and beauty code's 9,695 enterprises, its group named", b !== null && b.enterprises === 9695 && b.match === "shared" && b.group === "hair or beauty business");
const bs = londonTradeSales("barbershops");
check("barbershops: the code's median 78,625.81 pounds", bs !== null && bs.medianGbp !== null && Math.abs(bs.medianGbp - 78_625.81) < 0.01);

check("pizzerias only approximate their codes: no register figures", londonTradeRegister("pizzerias") === null && londonTradeSales("pizzerias") === null);
check("an unknown trade has no register row", londonTradeRegister("no-such-trade") === null);

/* A word that names a built-in names no trade (2026-10-06): `TURNOVER.trades["constructor"]` was the Object function, and
   londonTradeRegister("constructor") threw a TypeError on every page that asked (trade head, hero, city market, country depth,
   Checked). Every Object.prototype member, as written and lowercased. */
const PROTO_KEYS = [...new Set(Object.getOwnPropertyNames(Object.prototype).flatMap((k) => [k, k.toLowerCase()]))];
const protoAnswers = (k: string): string => {
  try { return `${londonTradeRegister(k) === null && londonTradeSales(k) === null}`; } catch (e) { return `throws ${e instanceof Error ? e.message : e}`; }
};
const protoWrong = PROTO_KEYS.filter((k) => protoAnswers(k) !== "true").map((k) => `${k} (${protoAnswers(k).slice(0, 60)})`);
check(`no register row for any of ${PROTO_KEYS.length} Object.prototype names, read as own entries with own() (src/lib/own.ts)${protoWrong.length ? `: ${protoWrong.slice(0, 4).join(", ")}` : ""}`, protoWrong.length === 0);

/* Every shared code the slice holds has a plain group name, so no page prints a shared figure as the trade's own. */
type T = { trades: Record<string, { sic: string[]; match: string }> };
const missing = Object.entries((turnoverJson as unknown as T).trades)
  .filter(([, t]) => t.match === "shared" && !SHARED_GROUP[t.sic.join("+")])
  .map(([slug, t]) => `${slug} (${t.sic.join("+")})`);
check(`every shared code has its group's name${missing.length ? `: missing ${missing.join(", ")}` : ""}`, missing.length === 0);

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("uk/registers/london_trade: all pass");
