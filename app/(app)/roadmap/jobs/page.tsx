import { JobTrackerBoard } from "@/components/JobTrackerBoard";
import { getJobTrackerSnapshot } from "@/server/job-tracker/actions";

export const dynamic = "force-dynamic";

export default async function RoadmapJobsPage() {
  const snapshot = await getJobTrackerSnapshot();
  return <JobTrackerBoard initialJobs={snapshot.jobs} initialPlatforms={snapshot.platforms} />;
}
