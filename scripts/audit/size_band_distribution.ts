import { config } from "dotenv";
import { resolve } from "node:path";
config({ path: resolve(process.cwd(), ".env.local") });
import { createClient } from "@supabase/supabase-js";

export {};
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  const { data } = await sb
    .from("extrapolated_cells")
    .select("size_band")
    .limit(5000);
  const counts = new Map<string, number>();
  for (const r of data || []) {
    const k = (r.size_band as string) || "null";
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  console.log("size_band distribution (first 5000 rows):");
  for (const [k, v] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(20)} ${v}`);
  }

  // Also check column existence on regional_cells
  const { data: rc } = await sb.from("regional_cells").select("*").limit(1);
  if (rc && rc.length > 0) {
    console.log("\nregional_cells columns:");
    console.log(Object.keys(rc[0]).join(", "));
  }
}
main();
