import { RoadmapTimelineSection } from "@/components/PlanViews";
import { getRoadmapConfig } from "@/server/config/actions";

export const dynamic = "force-dynamic";

export default async function RoadmapTimelinePage() {
  const phases = await getRoadmapConfig();
  return <RoadmapTimelineSection phases={phases} />;
}
