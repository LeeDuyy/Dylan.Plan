"use client";

import { Drawer, Segment, Tabs } from "@vn-dylan/ui";

import { NavConfigEditor } from "@/components/shared/NavConfigEditor";
import { RoadmapConfigEditor } from "@/components/shared/RoadmapConfigEditor";
import { TimetableConfigEditor } from "@/components/shared/TimetableConfigEditor";
import { useDensity, type Density } from "@/components/shared/useDensity";
import type { NavPref } from "@/lib/nav-registry";
import type { RoadmapPhaseView } from "@/lib/roadmap-defaults";
import type { TimetableRowView } from "@/lib/timetable-defaults";

const DENSITY_OPTIONS: { value: Density; label: string; hint: string }[] = [
  { value: "compact", label: "Gọn", hint: "Ít khoảng trắng, xem được nhiều thông tin hơn trong một màn." },
  { value: "comfortable", label: "Vừa", hint: "Mặc định — cân bằng giữa mật độ và độ thoáng." },
  { value: "spacious", label: "Thoáng", hint: "Nhiều khoảng thở, chữ và thẻ lớn hơn." }
];

// Drawer tuỳ chỉnh mở từ nút bánh răng trên header.
//  - "Hiển thị": mật độ giao diện (localStorage, useDensity).
//  - "Menu": thứ tự + ẩn/hiện mục điều hướng (DB, server/config).
//  - "Roadmap" / "Timetable": sửa dữ liệu timeline + lịch tuần (DB, server/config).
export function ConfigDrawer({
  open,
  navPrefs,
  roadmapPhases,
  timetableRows,
  onClose
}: {
  open: boolean;
  navPrefs: NavPref[];
  roadmapPhases: RoadmapPhaseView[];
  timetableRows: TimetableRowView[];
  onClose: () => void;
}) {
  const [density, setDensity] = useDensity();
  const current = DENSITY_OPTIONS.find((option) => option.value === density) ?? DENSITY_OPTIONS[1];

  return (
    <Drawer isOpen={open} placement="right" width="max(360px, 50vw)" title="Tuỳ chỉnh" onClose={onClose}>
      <Tabs defaultValue="display" variant="underline">
        <Tabs.TabList>
          <Tabs.TabNav value="display">Hiển thị</Tabs.TabNav>
          <Tabs.TabNav value="menu">Menu</Tabs.TabNav>
          <Tabs.TabNav value="roadmap">Roadmap</Tabs.TabNav>
          <Tabs.TabNav value="timetable">Lịch tuần</Tabs.TabNav>
        </Tabs.TabList>

        <Tabs.TabContent value="display">
          <div className="config-drawer">
            <div className="config-section">
              <h3>Mật độ hiển thị</h3>
              <p className="config-hint">Áp dụng cho toàn app, lưu trên trình duyệt này.</p>
              <Segment
                className="config-density-seg"
                selectionType="single"
                value={density}
                onChange={(value) => setDensity(value as Density)}
              >
                {DENSITY_OPTIONS.map((option) => (
                  <Segment.Item key={option.value} value={option.value}>
                    {option.label}
                  </Segment.Item>
                ))}
              </Segment>
              <p className="config-hint">{current.hint}</p>
            </div>
          </div>
        </Tabs.TabContent>

        <Tabs.TabContent value="menu">
          <NavConfigEditor navPrefs={navPrefs} />
        </Tabs.TabContent>

        <Tabs.TabContent value="roadmap">
          <RoadmapConfigEditor phases={roadmapPhases} />
        </Tabs.TabContent>

        <Tabs.TabContent value="timetable">
          <TimetableConfigEditor rows={timetableRows} />
        </Tabs.TabContent>
      </Tabs>
    </Drawer>
  );
}
