import { WeeklyKpiSection } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function RoadmapWeeklyKpiPage() {
  const entity = await getPageContent("roadmap/weekly-kpi");
  return <WeeklyKpiSection content={toPageContentView("roadmap/weekly-kpi", entity)} />;
}
