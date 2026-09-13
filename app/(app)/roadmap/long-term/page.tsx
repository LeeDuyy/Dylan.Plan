import { LongTermSections } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function RoadmapLongTermPage() {
  const entity = await getPageContent("roadmap/long-term");
  return <LongTermSections content={toPageContentView("roadmap/long-term", entity)} />;
}
