import { ProductKpiSection } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function ProductKpiPage() {
  const entity = await getPageContent("product/kpi");
  return <ProductKpiSection content={toPageContentView("product/kpi", entity)} />;
}
