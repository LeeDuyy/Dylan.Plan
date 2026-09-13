import { ProductPositioningSection } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function ProductPositioningPage() {
  const entity = await getPageContent("product/positioning");
  return <ProductPositioningSection content={toPageContentView("product/positioning", entity)} />;
}
