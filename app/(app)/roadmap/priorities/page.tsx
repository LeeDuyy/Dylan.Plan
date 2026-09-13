import { PrioritySection } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function RoadmapPrioritiesPage() {
  const entity = await getPageContent("roadmap/priorities");
  return <PrioritySection content={toPageContentView("roadmap/priorities", entity)} />;
}
