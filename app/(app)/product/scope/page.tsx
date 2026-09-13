import { ProductScopeSection } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function ProductScopePage() {
  const entity = await getPageContent("product/scope");
  return <ProductScopeSection content={toPageContentView("product/scope", entity)} />;
}
