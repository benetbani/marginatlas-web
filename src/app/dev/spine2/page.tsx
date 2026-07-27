/**
 * /dev/spine2 , routable mount of the Wave 4 spine2 catalog story.
 *
 * The canonical story lives in src/app/_design/spine2-story.tsx (the catalog
 * convention), but _design is a Next PRIVATE folder and never routes, so this
 * dev route exists for eyeballing and screenshot verification.
 * Screenshot: node scripts/shot_spine2.mjs
 */
import { Spine2Story } from "../../_design/spine2-story";

export const metadata = {
  title: "spine2 foundation kit | dev",
  robots: { index: false, follow: false },
};

export default function Spine2DevPage() {
  return <Spine2Story />;
}
