/**
 * probe_triage_rows , which open ledger rows does the dead-section sweep answer?
 *
 * The sweep reports candidates. This checks each open row's title against the
 * module that feeds it, which is the only thing that can turn a candidate into a
 * verdict: a title absent from fifteen renders may be a sampling accident, but a
 * field the adapter drops unconditionally is dropped for everyone.
 *
 * WHAT THIS CANNOT DISTINGUISH: it reports what the RENDER shows. The reason
 * beside each row was read out of the adapter by hand and is quoted, not derived.
 *
 * See the header of scripts/lib/render_pages.tsx for how to run this.
 */
import { renderAll, text } from "./lib/render_pages";

const OPEN_ROWS: Array<[string, string]> = [
  ["40", "How seasonal it is"],
  ["41", "Lowest bar to entry"],
  ["42", "Next-easiest, and the cost to open"],
  ["43", "Where the risks sit"],
  ["44", "How business runs here"],
  ["45", "What locals know"],
  ["46", "Peer cities, side by side"],
  ["47", "The next move"],
  ["48", "What rent takes, district by district"],
  ["49", "The revenue myth"],
  ["50", "Compare districts"],
  ["51", "Weekday and weekend footfall"],
];

void (async () => {
  const pages = (await renderAll()).filter((p) => !p.failed).map((p) => ({ ...p, t: text(p.html) }));
  console.log(`\n  ${pages.length} real pages rendered.\n`);
  let dead = 0;
  for (const [row, title] of OPEN_ROWS) {
    const on = pages.filter((p) => p.t.includes(title));
    if (on.length === 0) dead++;
    console.log(
      `  row ${row.padEnd(3)} ${title.padEnd(38)} ${
        on.length ? `reaches ${on.length}: ${on.map((p) => p.kind + "/" + p.name).slice(0, 3).join(", ")}` : "REACHES NONE"
      }`,
    );
  }
  console.log(`\n  ${dead} of ${OPEN_ROWS.length} open rows reach none of the rendered pages.`);
  console.log(`  Each still has to be confirmed against the module that feeds it.\n`);
})();
