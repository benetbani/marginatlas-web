/**
 * /dev/spine-cell , the ROUTE. Thin by design: Next route files must conform to
 * PageProps and may not export arbitrary members, so the page body + all its
 * section components live in ./cell-view (SpineCellBody), which the live cell route
 * imports directly and feeds real adapter data. This route renders the body with
 * the full bundled illustrative seed (the default).
 */
import { SpineCellBody } from "@/components/spine/cell/cell-view";

export const dynamic = "force-static";

export default function SpineCellPage() {
  return <SpineCellBody />;
}
