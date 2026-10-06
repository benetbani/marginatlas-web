/**
 * THE RANKED LIST ON THE HOME PAGE (his ruling of 2026-10-05 on PARKED P36.2b, option (a): "Where kitchens score five", the share
 * of London restaurants and cafes rated five for hygiene, by borough, from the feed). src/lib/home/kitchens.ts reads
 * data/editorial/editorial_feed.json.
 *
 * Holds: the feed's item names what it ranks (boroughs) and what it holds (one trade), with its floor, its middle and its data's
 * end; the list's four rows are the set's two highest and two lowest (as the duel beside it), each the feed's figure, each name three words or fewer,
 * each stamped; its figure is the set's middle; it prints for 45 days from the ratings' date and not a day after; the home render
 * carries it, stamped, beside the duel.
 *
 * Run: npx tsx tests/home/kitchens.test.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { buildKitchens } from "../../src/lib/home/kitchens";
import { FRESH_DAYS } from "../../src/lib/home/duel";
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "home-kitchens";
const FILE = "src/lib/home/kitchens.ts";
const REMEDY = "print the ranked list from the feed only, the set's ends as its rows and its middle as its figure, fresh by the 45-day rule";
let failed = 0;
const check = (label: string, ok: boolean) => { if (ok) { console.log(`PASS  ${label}`); return; } failed++; red({ rule: RULE, file: FILE, detail: label, remedy: REMEDY }); };

type Member = { member: string; value: number };
type Item = { id: string; dimension?: string; held?: string; floor?: string; as_of?: string; middle?: number; members: number; top: Member[]; bottom: Member[] };
const feed = JSON.parse(readFileSync("data/editorial/editorial_feed.json", "utf8")) as { items: Item[] };
const item = feed.items.find((i) => i.id === "kitchens-five");
check("the feed holds the kitchens item: boroughs ranked, one trade held, its floor, its middle and its data's end",
  !!item && item.dimension === "borough" && /^trade:/.test(item.held ?? "") && !!item.floor && typeof item.middle === "number" && !!item.as_of);

if (item?.as_of) {
  const day = (n: number) => new Date(Date.parse(item.as_of as string) + n * 86_400_000).toISOString().slice(0, 10);
  const k = buildKitchens(day(10));
  check("the list builds while fresh", !!k);
  if (k) {
    const want = [...item.top.slice(0, 2), ...item.bottom.slice(-2)];
    check(`four rows, the set's two highest and two lowest (${k.rows.map((r) => `${r.name} ${r.value}`).join(", ")})`,
      k.rows.length === 4 && k.rows.every((r, i) => r.key === want[i].member && r.value === want[i].value));
    check("every row's name runs three words or fewer (his labels rule; a longer one needs its plain name in COPY.home.kitchens.names)", k.rows.every((r) => r.name.split(/\s+/).length <= 3));
    check(`its figure is the set's middle, ${k.middle.value}, and the set is the feed's ${item.members} boroughs`, k.middle.value === item.middle && k.count === item.members);
    check("every figure is stamped from the feed", [k.middle.prov, ...k.rows.map((r) => r.prov)].every((p) => p.src.startsWith("editorial/editorial_feed.json:kitchens-five") && !!p.kind));
  }
  check(`it prints on day ${FRESH_DAYS} and not on day ${FRESH_DAYS + 1} after the ratings' date`, !!buildKitchens(day(FRESH_DAYS)) && buildKitchens(day(FRESH_DAYS + 1)) === null);
}

const home = existsSync("scratchpad/harness/pages/home-gb.html") ? readFileSync("scratchpad/harness/pages/home-gb.html", "utf8") : "";
if (home) {
  check("the home render carries the list, its middle stamped from the feed", /id="kitchens"/.test(home) && /data-src="editorial\/editorial_feed\.json:kitchens-five:the middle/.test(home));
  check("the list stands in the duel's level", /data-zone-label="From the registers"/.test(home) && home.indexOf('id="duel"') < home.indexOf('id="kitchens"'));
}

if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
console.log("home/kitchens: all pass");
