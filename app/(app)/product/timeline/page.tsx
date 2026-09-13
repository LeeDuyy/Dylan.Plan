import { ProductTimelineSection } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function ProductTimelinePage() {
  const entity = await getPageContent("product/timeline");
  return <ProductTimelineSection content={toPageContentView("product/timeline", entity)} />;
}
