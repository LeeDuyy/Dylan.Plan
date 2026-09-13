import type { ReactNode } from "react";

import { AppShell } from "@/components/shared/AppShell";
import { getNavConfig, getRoadmapConfig, getTimetableConfig } from "@/server/config/actions";

// `force-dynamic`: layout đọc cấu hình (menu / roadmap / timetable) từ DB mỗi request
// nên không được cache tĩnh. AppShell vẫn mount một lần và giữ trạng thái khi điều hướng.
export const dynamic = "force-dynamic";

export default async function AppGroupLayout({ children }: { children: ReactNode }) {
  const [navPrefs, roadmapPhases, timetableRows] = await Promise.all([
    getNavConfig(),
    getRoadmapConfig(),
    getTimetableConfig()
  ]);
  return (
    <AppShell navPrefs={navPrefs} roadmapPhases={roadmapPhases} timetableRows={timetableRows}>
      {children}
    </AppShell>
  );
}
