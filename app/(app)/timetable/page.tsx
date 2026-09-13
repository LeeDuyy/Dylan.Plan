import { TimetableSection } from "@/components/PlanViews";
import { getTimetableConfig } from "@/server/config/actions";

export const dynamic = "force-dynamic";

export default async function TimetablePage() {
  const rows = await getTimetableConfig();
  return <TimetableSection rows={rows} />;
}
