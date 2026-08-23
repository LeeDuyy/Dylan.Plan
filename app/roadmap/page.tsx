import { DylanPlanApp } from "@/components/DylanPlanApp";
import { getJobTrackerSnapshot } from "@/server/job-tracker/actions";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const initialJobTracker = await getJobTrackerSnapshot();
  return <DylanPlanApp activeTab="roadmap" initialJobTracker={initialJobTracker} />;
}
