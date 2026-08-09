/**
 * NoPlacePhoto , opts one page out of the site-wide place photography.
 *
 * The founder, 2026-08-09, setting the photograph as a global effect:
 * "This is a unique global effect that we're going to keep in our page, except
 * privacy policy and pages that get very few visits because they are hugely
 * technical."
 *
 * WHY IT IS A STYLE TAG AND NOT A PROP. <AtlasGutters /> renders in the ROOT
 * layout, so it wraps every route and cannot be told which route it is wrapping.
 * Reading the path there via headers() would make the root layout dynamic and
 * opt EVERY page out of static rendering , the same trap documented on
 * SiteChrome, which is why the masthead had to move out of the layout in the
 * first place. A page cannot pass a prop upward either.
 *
 * A page CAN render a style rule, and a style rule reaches a fixed layer that is
 * not its ancestor. No client JS, no dynamic rendering, no flash: the rule is in
 * the served HTML before the layer paints.
 *
 * The wash stays. Only the photograph goes, so these pages keep the warm frame
 * and lose the place, which is the distinction he drew: the picture is for pages
 * a reader is exploring, not for a terms page they were sent to.
 *
 * Use: render it anywhere in the page body.
 *   export default function PrivacyPage() {
 *     return (<><NoPlacePhoto />...</>);
 *   }
 */
export function NoPlacePhoto() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: ".atlas-frame-gutters .atlas-placephoto{display:none}",
      }}
    />
  );
}
