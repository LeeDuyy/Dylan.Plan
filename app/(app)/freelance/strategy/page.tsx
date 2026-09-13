import { FreelanceStrategySection } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function FreelanceStrategyPage() {
  const entity = await getPageContent("freelance/strategy");
  return <FreelanceStrategySection content={toPageContentView("freelance/strategy", entity)} />;
}
