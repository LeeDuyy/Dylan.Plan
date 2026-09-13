import { FreelanceProcessSection } from "@/components/PlanViews";
import { toPageContentView } from "@/lib/page-content-defaults";
import { getPageContent } from "@/server/pages/actions";

export const dynamic = "force-dynamic";

export default async function FreelanceProcessPage() {
  const entity = await getPageContent("freelance/process");
  return <FreelanceProcessSection content={toPageContentView("freelance/process", entity)} />;
}
