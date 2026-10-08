/**
 * A WORD FROM THE REQUEST THAT NAMES A BUILT-IN NAMES NOTHING, IN TWO MORE READERS (2026-10-08). 7395d11d closed the trade word
 * at the edge and in the resolvers, and 7d2503ba the place word; two readers still indexed a plain object with a word the
 * reader sent. (1) /api/cell-lookup asked `!INDUSTRY_BY_ID[industryId]` of ?industry=, so `?industry=constructor` (the Object
 * function) passed the validity guard and went on to resolve a trade that does not exist, answering a synthesized cell where it
 * answers nothing for any other made-up id. (2) The presence threshold read `MANIFEST.countries[country]`: once its manifest is
 * generated, a country word that names a built-in came back as the Object function, so `constructor/restaurants` read as a pair
 * the manifest holds nothing for and hid, where an unknown country is a gap in the manifest and publishes (the module's
 * fail-open rule), and a built-in name as the activity answered the function as its presence.
 *
 * Part 1 calls the route's own GET with the database pointed nowhere (a dummy URL and a fetch that answers every query "no
 * rows": no network and no secret, as the chain requires). Part 2 plants a usable manifest in the require cache before the
 * module loads, because the real one is ungenerated (generated_at null) and presence.ts returns "measured" for every pair
 * before it reads a country; it first checks that the planted manifest is the one in force, so the checks cannot pass by
 * reading an empty one.
 *
 * Run: npx tsx tests/routing/request_word_keys.test.ts
 */
import { red, redSummary } from "../../scripts/lib/red";

const RULE = "request-word-keys";
const REMEDY = "read a table keyed by a word from the request with own() or hasOwn() (src/lib/own.ts), never table[word] or `word in table`";
let failed = 0;
const check = (file: string, label: string, wrong: string[]) => {
  if (wrong.length === 0) { console.log(`PASS  ${label}`); return; }
  failed++;
  red({ rule: RULE, file, detail: `${label}: ${wrong.slice(0, 6).join("; ")}${wrong.length > 6 ? `; and ${wrong.length - 6} more` : ""}`, remedy: REMEDY });
};

/* Every name every object inherits, as written and lowercased. */
const NAMES = [...new Set([...Object.getOwnPropertyNames(Object.prototype), "__proto__"])];
const KEYS = [...new Set(NAMES.flatMap((k) => [k, k.toLowerCase()]))];

const ROUTE = "src/app/api/cell-lookup/route.ts";
const PRESENCE = "src/lib/taxonomy/presence.ts";

/* PART 2 FIRST, synchronously: it needs a module that has not loaded yet, and part 1 loads a great deal. */
function presencePart() {
  const manifestPath = require.resolve("../../src/lib/taxonomy/presence_manifest.json");
  const planted = {
    generated_at: "2026-10-08",
    countries: {
      gb: { restaurants: "measured", cafes_coffee: "modelled" },
      us: { restaurants: "measured" },
      de: { restaurants: "measured" },
      fr: { restaurants: "measured" },
      es: { restaurants: "measured" },
    },
  };
  require.cache[manifestPath] = { id: manifestPath, filename: manifestPath, loaded: true, exports: planted, children: [], paths: [] } as unknown as NodeJS.Module;
  const presence = require("../../src/lib/taxonomy/presence") as typeof import("../../src/lib/taxonomy/presence");

  const inForce =
    presence.isManifestUsable() &&
    presence.presenceOf("gb", "restaurants") === "measured" &&
    presence.presenceOf("GB", "cafes_coffee") === "modelled" &&
    presence.presenceOf("gb", "no-such-activity") === "none" &&
    presence.presenceOf("zz", "restaurants") === "measured";
  check(PRESENCE, "the planted manifest is the one in force (a held pair reads as held, an unknown activity in a held country as none, an unknown country as measured)", inForce ? [] : ["the planted manifest is not in force, so the checks below would read an empty one"]);

  const countryWrong: string[] = [];
  const activityWrong: string[] = [];
  for (const k of KEYS) {
    const asCountry = presence.presenceOf(k, "restaurants");
    if (asCountry !== "measured" || !presence.mayPublish(k, "restaurants")) countryWrong.push(`${k} (${String(asCountry).slice(0, 30)})`);
    const asActivity = presence.presenceOf("gb", k);
    if (asActivity !== "none" || presence.mayPublish("gb", k)) activityWrong.push(`${k} (${String(asActivity).slice(0, 30)})`);
  }
  check(PRESENCE, `a country word that names a built-in is an unknown country, which publishes, as "zz" does (${KEYS.length} names)`, countryWrong);
  check(PRESENCE, `an activity word that names a built-in is an unknown activity in a held country, which is none, as "no-such-activity" is (${KEYS.length} names)`, activityWrong);
}

async function apiPart() {
  /* src/lib/supabase.ts builds its client when first imported and needs a URL: set the environment and replace fetch BEFORE the
     route (and so the client) loads. */
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://offline.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "offline";
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  globalThis.fetch = (async () => new Response("[]", { status: 200, headers: { "content-type": "application/json" } })) as typeof fetch;
  const { NextRequest } = await import("next/server");
  const { GET } = await import("../../src/app/api/cell-lookup/route");

  let client = 0;
  type Answer = { status: number; cell: { region?: string | null; country?: string } | null; reason?: string };
  const ask = async (query: string): Promise<Answer> => {
    const req = new NextRequest(`https://www.marginatlas.com/api/cell-lookup?${query}`, { headers: { "x-real-ip": `10.7.${client >> 8}.${client++ & 255}` } });
    const res = await GET(req);
    const body = (await res.json()) as { cell: Answer["cell"]; reason?: string };
    return { status: res.status, cell: body.cell, reason: body.reason };
  };

  /* A real id still resolves: with every query empty the cell is a synthesized one, but a cell. */
  const real = await ask("country=US&industry=restaurants&region=california");
  const realGb = await ask("country=GB&industry=restaurants");
  check(ROUTE, "a real activity id still answers a cell (US restaurants in California, GB restaurants)", real.status === 200 && real.cell !== null && realGb.status === 200 && realGb.cell !== null ? [] : [`US ${real.status} ${JSON.stringify(real.cell)?.slice(0, 40)}, GB ${realGb.status} ${JSON.stringify(realGb.cell)?.slice(0, 40)}`]);

  const industryWrong: string[] = [];
  for (const k of KEYS) {
    const a = await ask(`country=US&industry=${encodeURIComponent(k)}`);
    if (a.cell !== null || !/invalid/.test(a.reason ?? "")) industryWrong.push(`?industry=${k} (${a.status}, ${a.cell === null ? "no cell" : "a cell"}, ${a.reason ?? "no reason"})`);
  }
  check(ROUTE, `?industry= a name that is a built-in fails the validity guard, as a made-up id does (${KEYS.length} names)`, industryWrong);

  /* The region word is a place word: it resolves as a made-up one does (7d2503ba), here through the route. */
  const control = await ask("country=US&industry=restaurants&region=zzzzzzzz");
  const regionWrong: string[] = [];
  for (const k of ["constructor", "__proto__", "hasOwnProperty", "toString"]) {
    const a = await ask(`country=US&industry=restaurants&region=${encodeURIComponent(k)}`);
    if (a.status !== 200 || a.cell === null || a.cell.region !== control.cell?.region) regionWrong.push(`?region=${k} (${a.status}, ${a.cell === null ? "no cell" : `region ${JSON.stringify(a.cell.region)}`}, a made-up region's is ${JSON.stringify(control.cell?.region)})`);
  }
  check(ROUTE, "?region= a name that is a built-in answers as a made-up region does", regionWrong);
}

presencePart();
apiPart().then(
  () => {
    if (failed > 0) { redSummary(RULE, failed, REMEDY, "checks failed"); process.exit(1); }
    console.log("routing/request_word_keys: all pass");
    process.exit(0);
  },
  (e) => {
    failed++;
    red({ rule: RULE, file: "tests/routing/request_word_keys.test.ts", detail: `the route part could not run: ${e instanceof Error ? e.stack ?? e.message : String(e)}`.slice(0, 400), remedy: REMEDY });
    redSummary(RULE, failed, REMEDY, "checks failed");
    process.exit(1);
  },
);
