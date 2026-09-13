import { FreelanceKpiSection } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function FreelanceKpiPage() {
  const entity = await getPageContent("freelance/kpi");
  return <FreelanceKpiSection content={toPageContentView("freelance/kpi", entity)} />;
}
