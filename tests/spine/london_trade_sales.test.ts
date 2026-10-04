/**
 * The United Kingdom's "What London's trades take" card prints the register's figures, the ones its doors print (plan 06, task
 * B3b, 2026-10-04). Until that day the card drew each trade's net margin off the curated London file ("directional ranges, not
 * exact measurements": barbershops and accountants 22%) and said each trade page printed the same; the truth pass took that money
 * off the trade pages (task A5), so the card printed a figure its own doors no longer showed.
 *
 * Run: npx tsx tests/spine/london_trade_sales.test.ts
 */
import { buildLondonTradeSales } from "../../src/lib/spine/country_depth_rows";
import { tradeHeadFigure } from "../../src/lib/spine/trade_head";
import { londonTradeRegister } from "../../src/lib/uk/registers/london_trade";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "london-trade-sales";
const FILE = "src/lib/spine/country_depth_rows.ts";
const REMEDY = "print each London trade's register median, rounded once as its trade page's head rounds it, one row a code, a shared code named as its group";
let failed = 0;
const check = (label: string, ok: boolean) => {
  if (ok) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY });
};

const card = buildLondonTradeSales();
const rows = card?.rows ?? [];
check(`the card draws (${rows.length} trades)`, rows.length >= 3);

/* ONE FIGURE ON THE CARD AND ON THE PAGE IT OPENS */
const off = rows.filter((r) => tradeHeadFigure({ isLondon: true, slug: r.key })?.usd !== r.value).map((r) => `${r.key} ${r.value}`);
check(`every row is its trade page's head figure${off.length ? `: ${off.join(", ")}` : ""}`, off.length === 0);
check("restaurants: the register's median, $374K (281,942 pounds at 1.3265, rounded once through its range)", rows.find((r) => r.key === "restaurants")?.value === 374_000);
check("no row is a margin (every value is yearly sales in dollars)", rows.every((r) => r.value >= 50_000));

/* ONE ROW A CODE, A SHARED CODE NAMED AS ITS GROUP */
const codes = rows.map((r) => londonTradeRegister(r.key)!.sic.join("+"));
check("one row a code (barbershops and nail salons read one code, 96020)", new Set(codes).size === codes.length);
const hair = rows.find((r) => londonTradeRegister(r.key)?.sic.join("+") === "96020");
check("the 96020 row is named as its group, never as one trade", hair?.name === "Hair and beauty");
check("a shared code always prints its group's name", rows.every((r) => !londonTradeRegister(r.key)?.group || !/^(Barbershops|Nail salons)$/.test(r.name)));
check("a trade with no register row or no page prints nothing (full-service salons, childcare, the mixed trades)", rows.every((r) => !["hair-salons-full-service", "childcare-social-services", "specialty-trades-mixed"].includes(r.key)));
check("every trade the register holds with a page and a named code draws (16 rows from the file's 20)", rows.length === 16);
check("cafes are their code's group, unlicensed restaurants with them", rows.find((r) => r.key === "cafes-coffee-shops")?.name === "Cafés, unlicensed restaurants");

/* THE CARD'S OWN LAWS */
check("every row's name is three words at the most", rows.every((r) => r.name.split(/\s+/).length <= 3));
check("the largest first", rows.every((r, i) => i === 0 || rows[i - 1].value >= r.value));
check("each row opens its own trade page in the file's place", rows.every((r) => r.href === `/gb/london/${r.key}`));

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("spine/london_trade_sales: all pass");
