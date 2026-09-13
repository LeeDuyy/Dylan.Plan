import { FirstWeekSection } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function RoadmapFirstWeekPage() {
  const entity = await getPageContent("roadmap/first-week");
  return <FirstWeekSection content={toPageContentView("roadmap/first-week", entity)} />;
}
