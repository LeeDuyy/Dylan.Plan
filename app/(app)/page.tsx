import { CurrentStatusSection, HeroSection } from "@/components/PlanViews";
import { getRoadmapConfig } from "@/server/config/actions";
import { getJobTrackerSnapshot } from "@/server/job-tracker/actions";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const [initialJobTracker, phases] = await Promise.all([getJobTrackerSnapshot(), getRoadmapConfig()]);
  return (
    <>
      <HeroSection />
      <CurrentStatusSection initialJobTracker={initialJobTracker} phases={phases} />
    </>
  );
}
