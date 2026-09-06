import { RoadmapView } from "@/components/PlanViews";
import { getJobTrackerSnapshot } from "@/server/job-tracker/actions";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const initialJobTracker = await getJobTrackerSnapshot();
  return <RoadmapView initialJobTracker={initialJobTracker} />;
}
