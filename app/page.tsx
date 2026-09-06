import { OverviewView } from "@/components/PlanViews";
import { getJobTrackerSnapshot } from "@/server/job-tracker/actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const initialJobTracker = await getJobTrackerSnapshot();
  return <OverviewView initialJobTracker={initialJobTracker} />;
}
