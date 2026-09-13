import { EnglishInterviewSections } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function RoadmapEnglishPage() {
  const entity = await getPageContent("roadmap/english");
  return <EnglishInterviewSections content={toPageContentView("roadmap/english", entity)} />;
}
