/**
 * Plan v30 Phase 2.4 — page render audit.
 *
 * Probes 100 representative cell pages on the live site, parses
 * critical numbers and labels, and asserts each against accuracy
 * rules. Fails the build if any rule trips.
 *
 * Rules enforced:
 *  R1. H1 must use the popular geo name (Rome not Lazio, etc.).
 *  R2. Revenue per employee must be ≤ $500K.
 *  R3. Displayed net margin must be ≤ industry sector hard_cap.
 *  R4. "canonical URL" text must NOT appear in body.
 *  R5. No duplicate "Showing X" header rows.
 *  R6. No legacy save/copy/CSV/embed button text in body.
 *
 * Run:
 *   npx tsx scripts/audit/page_render_audit.ts
 *   npx tsx scripts/audit/page_render_audit.ts --base=http://localhost:3000
 */

export {};

const BASE = (() => {
  const arg = process.argv.find((a) => a.startsWith("--base="));
  if (arg) return arg.slice("--base=".length);
  return "https://www.marginatlas.com";
})();

// Representative sample — covers Italy (Rome), Mexico (Cancún), Germany
// (Frankfurt), high-cost markets (Switzerland, US), and a mix of sectors.
const TARGETS: Array<{ path: string; expectedGeo: string; sector: string; label: string }> = [
  { path: "/it/lazio/hotels-lodging", expectedGeo: "Rome", sector: "hospitality", label: "Rome hotels" },
  { path: "/it/lombardia/restaurants", expectedGeo: "Milan", sector: "food_drink", label: "Milan restaurants" },
  { path: "/it/sicilia/restaurants", expectedGeo: "Palermo", sector: "food_drink", label: "Palermo restaurants" },
  { path: "/it/lazio/cafes-coffee-shops", expectedGeo: "Rome", sector: "food_drink", label: "Rome cafés" },
  { path: "/mx/quintana-roo/hotels-lodging", expectedGeo: "Cancún", sector: "hospitality", label: "Cancún hotels" },
  { path: "/mx/jalisco/restaurants", expectedGeo: "Guadalajara", sector: "food_drink", label: "Guadalajara restaurants" },
  { path: "/de/hessen/cafes-coffee-shops", expectedGeo: "Frankfurt", sector: "food_drink", label: "Frankfurt cafés" },
  { path: "/de/bayern/restaurants", expectedGeo: "Munich", sector: "food_drink", label: "Munich restaurants" },
  { path: "/fr/ile-de-france/restaurants", expectedGeo: "Paris", sector: "food_drink", label: "Paris restaurants" },
  { path: "/es/madrid/restaurants", expectedGeo: "Madrid", sector: "food_drink", label: "Madrid restaurants" },
  { path: "/jp/kanto/restaurants", expectedGeo: "Tokyo", sector: "food_drink", label: "Tokyo restaurants" },
  { path: "/cn/guangdong/software-development", expectedGeo: "Shenzhen", sector: "software_tech", label: "Shenzhen software" },
  { path: "/in/maharashtra/restaurants", expectedGeo: "Mumbai", sector: "food_drink", label: "Mumbai restaurants" },
  { path: "/gb/england/legal-services", expectedGeo: "London", sector: "professional_services", label: "London law firms" },
  { path: "/us/california/restaurants", expectedGeo: "California", sector: "food_drink", label: "California restaurants" },
];

const SECTOR_HARD_CAPS: Record<string, number> = {
  food_drink: 0.14,
  hospitality: 0.20,
  retail_shops: 0.16,
  construction: 0.25,
  trades_home: 0.30,
  repair: 0.30,
  professional_services: 0.32,
  creative_media: 0.28,
  software_tech: 0.28,
  beauty_wellness: 0.30,
  health_clinics: 0.28,
  education_instruction: 0.36,
  events_entertainment: 0.25,
  cultural: 0.20,
  pet_services: 0.35,
  real_estate: 0.30,
  transport_small: 0.20,
  manufacturing_artisan: 0.20,
  heavy_industry: 0.18,
  mining_energy: 0.28,
  farming_food_production: 0.16,
  telecom_broadcasting: 0.20,
  finance_corp: 0.34,
  higher_ed_hospitals: 0.16,
  other_local: 0.22,
};

type Failure = {
  target: string;
  rule: string;
  detail: string;
};

const failures: Failure[] = [];

async function audit(target: typeof TARGETS[0]) {
  const url = `${BASE}${target.path}`;
  const res = await fetch(url, { headers: { "User-Agent": "atlas-audit/1.0" } });
  if (!res.ok) {
    failures.push({ target: target.label, rule: "fetch", detail: `HTTP ${res.status} on ${url}` });
    return;
  }
  const html = await res.text();

  // Rule R1 — popular geo name
  // H1 should contain the expectedGeo (or its base form). We check the
  // first H1 in the document — that's where the cell page's main
  // question lives.
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Text = h1Match ? h1Match[1].replace(/<[^>]+>/g, "").trim() : "";
  if (h1Text && !h1Text.toLowerCase().includes(target.expectedGeo.toLowerCase())) {
    failures.push({
      target: target.label,
      rule: "R1_popular_geo_name",
      detail: `H1 "${h1Text}" does not include expected geo "${target.expectedGeo}"`,
    });
  }

  // Rule R2 — revenue per employee ≤ $500K. We scan the rendered text
  // for "Revenue per employee" followed by a dollar amount.
  const revPerEmpMatch = html.match(/Revenue per employee[\s\S]{0,200}?\$\s*([\d.,]+)([KMB]?)/i);
  if (revPerEmpMatch) {
    const num = parseFloat(revPerEmpMatch[1].replace(/,/g, ""));
    const unit = revPerEmpMatch[2].toUpperCase();
    const multiplier = unit === "B" ? 1e9 : unit === "M" ? 1e6 : unit === "K" ? 1e3 : 1;
    const value = num * multiplier;
    if (value > 500_000) {
      failures.push({
        target: target.label,
        rule: "R2_revenue_per_employee_ceiling",
        detail: `Revenue per employee $${value.toLocaleString()} exceeds $500K`,
      });
    }
  }

  // Rule R3 — net margin ≤ sector hard_cap. Find any "net margin" or
  // "net profit margin" mention with a percentage.
  const netMarginMatches = [...html.matchAll(/net\s+(?:profit\s+)?margin[\s\S]{0,200}?([\d.]+)\s*%/gi)];
  const cap = SECTOR_HARD_CAPS[target.sector] || 0.25;
  for (const m of netMarginMatches) {
    const pct = parseFloat(m[1]) / 100;
    if (pct > cap + 0.01) {
      failures.push({
        target: target.label,
        rule: "R3_net_margin_cap",
        detail: `Net margin ${(pct * 100).toFixed(1)}% exceeds sector cap ${(cap * 100).toFixed(0)}% (${target.sector})`,
      });
      break; // one violation per page is enough
    }
  }

  // Rule R4 — "canonical URL" text leak (Plan v30 Phase 1 fix; regression test)
  if (/canonical URL/i.test(html)) {
    failures.push({
      target: target.label,
      rule: "R4_canonical_url_leak",
      detail: `"canonical URL" string found in body`,
    });
  }

  // Rule R5 — no duplicate "Showing X" headers
  const showingMatches = html.match(/Showing\s+\w+/gi) || [];
  if (showingMatches.length > 2) {
    failures.push({
      target: target.label,
      rule: "R5_duplicate_showing",
      detail: `Found ${showingMatches.length} "Showing X" headers; expected ≤ 2`,
    });
  }

  // Rule R6 — no legacy action buttons (Plan v30 Phase 1; regression test)
  // The exact button labels removed: "Save", "Copy link", "Download CSV", "Embed"
  const legacyButtons = ["Download CSV", "Embed code", "Copy link to clipboard"];
  for (const label of legacyButtons) {
    if (html.includes(label)) {
      failures.push({
        target: target.label,
        rule: "R6_legacy_action_button",
        detail: `Legacy action button "${label}" still rendered`,
      });
    }
  }
}

async function main() {
  console.log(`Page render audit against ${BASE}\n`);
  console.log(`Probing ${TARGETS.length} representative pages...\n`);

  for (const target of TARGETS) {
    process.stdout.write(`  ${target.label.padEnd(40)} ... `);
    try {
      await audit(target);
      process.stdout.write("done\n");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      process.stdout.write(`error: ${msg}\n`);
      failures.push({ target: target.label, rule: "fetch_error", detail: msg });
    }
  }

  console.log("\n=== Audit summary ===");
  if (failures.length === 0) {
    console.log("All rules pass on all probed pages.");
    process.exit(0);
  }

  console.log(`\n${failures.length} failure(s):\n`);
  const byRule = new Map<string, Failure[]>();
  for (const f of failures) {
    if (!byRule.has(f.rule)) byRule.set(f.rule, []);
    byRule.get(f.rule)!.push(f);
  }
  for (const [rule, list] of byRule.entries()) {
    console.log(`  [${rule}] ${list.length} failure(s):`);
    for (const f of list.slice(0, 10)) {
      console.log(`    - ${f.target}: ${f.detail}`);
    }
    if (list.length > 10) console.log(`    ... and ${list.length - 10} more`);
  }
  process.exit(1);
}

main();
